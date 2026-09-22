// @vitest-environment jsdom
//
// Tests for the 4-tab Excel download factory. The factory must read ALL four
// tables inside a table-view container (week/month x toename/cumulatief),
// regardless of the CSS `hidden` class, and produce one worksheet per table
// with cleaned cells and the header row preserved.
//
import { describe, it, expect, beforeEach } from 'vitest';
import * as XLSX from 'xlsx';
import {
  TABLE_SHEETS,
  cleanCell,
  tableToArray,
  buildWorkbookFromElement,
  workbookToBlob,
} from '../src/shared/download.factory';

const HEADERS = [
  'Jaar',
  'Week/Maand',
  'Periode',
  'Meldingen',
  'Afgehandeld',
  'Toegekend',
  'Afgewezen',
];

function rowHTML(vals: string[]): string {
  return `<tr>${vals.map((v) => `<td>${v}</td>`).join('')}</tr>`;
}

function tableHTML(id: string, hidden: boolean, rows: string[][]): string {
  const header = rowHTML(HEADERS);
  const body = rows.map(rowHTML).join('');
  return `<table id="${id}"${hidden ? ' class="hidden"' : ''}>
    <thead>${header}</thead>
    <tbody>${body}</tbody>
  </table>`;
}

let container: HTMLElement;

beforeEach(() => {
  // Realistic DOM: four tables inside one container; three carry class
  // "hidden", one is visible — exactly like the togglers produce.
  document.body.innerHTML = `
    <section class="table-view">
      ${tableHTML('week-table-inc', true, [
        ['2024', '2024-W01', '01/01/2024 - 07/01/2024', '1.234', '€ 500', '1.234,50', '50'],
      ])}
      ${tableHTML('month-table-inc', false, [
        ['2024', '2024-01', '01/01/2024 - 31/01/2024', '2.000', '€ 800', '2.000,25', '10'],
      ])}
      ${tableHTML('week-table-cumul', true, [
        ['2024', '2024-W01', '01/01/2024 - 07/01/2024', '3.000', '1.500', '3.000,75', '0'],
        ['2024', '2024-W02', '08/01/2024 - 14/01/2024', '4.000', '2.000', '4.000,00', '5'],
      ])}
      ${tableHTML('month-table-cumul', true, [
        ['2024', '2024-01', '01/01/2024 - 31/01/2024', '5.000', '2.500', '5.000,50', '2'],
      ])}
    </section>`;
  container = document.querySelector('.table-view') as HTMLElement;
});

describe('TABLE_SHEETS configuration', () => {
  it('defines the four expected tables in order', () => {
    expect(TABLE_SHEETS.map((s) => s.id)).toEqual([
      'week-table-inc',
      'month-table-inc',
      'week-table-cumul',
      'month-table-cumul',
    ]);
  });
});

describe('cleanCell', () => {
  it('strips € and non-breaking spaces', () => {
    expect(cleanCell('€ 500')).toBe('500');
    expect(cleanCell('€\u00a01.234')).toBe('1234');
    expect(cleanCell('1.234&nbsp;567')).toBe('1234567');
  });

  it('converts Dutch thousands dots to plain digits', () => {
    expect(cleanCell('1.234')).toBe('1234');
    expect(cleanCell('1.234.567')).toBe('1234567');
  });

  it('converts Dutch decimal comma into a dot and drops thousands dots', () => {
    expect(cleanCell('1.234,50')).toBe('1234.50');
  });

  it('passes t/m ranges through as text', () => {
    expect(cleanCell('10 t/m 20')).toBe('10 t/m 20');
  });

  it('passes long date ranges through as text', () => {
    expect(cleanCell('01/01/2024 - 07/01/2024')).toBe(
      '01/01/2024 - 07/01/2024',
    );
  });

  it('leaves a short dash as-is', () => {
    expect(cleanCell('-')).toBe('-');
  });
});

describe('tableToArray', () => {
  it('reads the header row and all data rows with cleaned cells', () => {
    const table = container.querySelector(
      'table#week-table-inc',
    ) as HTMLTableElement;
    const data = tableToArray(table);

    expect(data.length).toBe(2); // header + 1 data row
    expect(data[0]).toEqual(HEADERS);

    // Dutch numbers cleaned, currency/nbsp stripped, date range preserved
    expect(data[1]).toEqual([
      '2024',
      '2024-W01',
      '01/01/2024 - 07/01/2024',
      '1234',
      '500',
      '1234.50',
      '50',
    ]);
  });
});

describe('buildWorkbookFromElement', () => {
  it('produces one worksheet per table with the expected names', () => {
    const wb = buildWorkbookFromElement(container);
    expect(wb.SheetNames).toEqual([
      'Week (toename)',
      'Maand (toename)',
      'Week (cumulatief)',
      'Maand (cumulatief)',
    ]);
  });

  it('does NOT skip hidden tables — all four sheets carry data', () => {
    const wb = buildWorkbookFromElement(container);
    expect(wb.SheetNames.length).toBe(4);

    const counts = wb.SheetNames.map(
      (name) =>
        (XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1 }) as unknown[])
          .length,
    );
    // header + data rows for each sheet, even the hidden ones
    expect(counts).toEqual([2, 2, 3, 2]);
  });

  it('keeps the header row in every sheet', () => {
    const wb = buildWorkbookFromElement(container);
    for (const name of wb.SheetNames) {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[name], {
        header: 1,
      }) as unknown[][];
      expect(rows[0]).toEqual(HEADERS);
    }
  });

  it('applies cell cleaning to every sheet', () => {
    const wb = buildWorkbookFromElement(container);
    const rows = XLSX.utils.sheet_to_json(wb.Sheets['Week (toename)'], {
      header: 1,
    }) as unknown[][];
    // currency stripped + thousands dots removed
    expect(rows[1][4]).toBe('500');
    expect(rows[1][3]).toBe('1234');
    // decimal comma converted to dot
    expect(rows[1][5]).toBe('1234.50');
    // date range preserved as text
    expect(rows[1][2]).toBe('01/01/2024 - 07/01/2024');
  });

  it('returns a workbook even when a table element is missing', () => {
    const partial = document.createElement('div');
    partial.innerHTML = tableHTML('week-table-inc', true, [
      ['2024', '2024-W01', 'a - b', '1', '2', '3', '4'],
    ]);
    const wb = buildWorkbookFromElement(partial);
    // Missing tables are skipped but the present one still yields a sheet.
    expect(wb.SheetNames).toEqual(['Week (toename)']);
    const rows = XLSX.utils.sheet_to_json(wb.Sheets['Week (toename)'], {
      header: 1,
    }) as unknown[][];
    expect(rows[0]).toEqual(HEADERS);
    expect(rows.length).toBe(2);
  });
});

describe('workbookToBlob', () => {
  it('serialises the workbook to a binary spreadsheet Blob', () => {
    const wb = buildWorkbookFromElement(container);
    const blob = workbookToBlob(wb);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toContain('spreadsheetml');
    expect(blob.size).toBeGreaterThan(0);
  });
});
