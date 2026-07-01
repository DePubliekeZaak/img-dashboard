// @vitest-environment jsdom
//
// KTOGroupV1 — the atypical group:
//   - uses the "tevredenheid" API endpoint → triggers complete === true filter
//   - calls ktoTables (not tables) → only monthTableInc returned
//   - overrides week/cumul tables to empty arrays
//   - relyOnCompleted is called but its return is unused (dead code path)
//
import { describe, it, expect, beforeEach } from 'vitest';
import { resetStore, initPageStore, buildGroup, fakePage, fixtureData, buildPageConfig } from './helpers/harness';
import { KTOGroupV1 } from '../src/shared/kto-group-v1';
import type { IPageConfig, IGroupMappingV2 } from '../src/shared/interfaces';
import * as tevredenheidRaw from './fixtures/regelingen/all_waardering/ep1.json';

const TEVREDENHEID_FIXTURE_ROWS = (tevredenheidRaw as any).default?.length ?? (tevredenheidRaw as any).length ?? 0;

const groups: Record<string, new (...args: any[]) => any> = { KTOGroupV1 };

beforeEach(() => {
  resetStore();
});

// ---------------------------------------------------------------------------
// Anchor period — first complete row: _yearweek=202622, completed_month=5
// ---------------------------------------------------------------------------
const ANCHOR = {
  _yearweek: '202622',
  _year: '2026',
  _week: '22',
  completed_month: '5',
  doorlopend_cijfer: 6.8,
  maandcijfer: 6.5,
  aantal_respondenten_maand: 282,
};

// ---------------------------------------------------------------------------
// Config slice — mirrors regelingen/all_waardering
// ---------------------------------------------------------------------------
const GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'all_waardering',
  ctrlr: 'KTOGroupV1',
  graphs: [
    {
      slug: 'a_waardering_numbers',
      ctrlr: 'NumbersPlusRespondentsV1',
      parameters: [
        [{
          label: 'Sinds start',
          column: 'doorlopend_cijfer',
          colour: 'orange',
          format: 'decimals',
        }],
        [{
          label: 'Totaal respondenten',
          column: 'aantal_respondenten',
          units: 'respondenten sinds start',
          colour: 'orange',
        }],
      ],
      segment: { key: 'doorlopend_cijfer', cumulative: false, periodization: 'latest' },
    },
    {
      slug: 'a_waardering_trend',
      ctrlr: 'BarTrendKTOV1',
      parameters: [
        [{
          label: 'Maand cijfer',
          column: 'maandcijfer',
          colour: 'orange',
          format: 'decimals',
        }],
        [{
          label: 'Aantal nieuwe respondenten',
          column: 'aantal_respondenten_maand',
          colour: 'orange',
          units: 'respondenten',
        }],
      ],
      segment: { key: 'maandcijfer', cumulative: false, periodization: 'monthly' },
    },
  ],
  segment: { key: 'maandcijfer', cumulative: false, periodization: 'monthly' },
  functionality: ['table', 'definitions', 'download'],
  endpoints: ['tevredenheid'],
};

const PAGE_CONFIG: IPageConfig = buildPageConfig(
  'regelingen',
  { key: 'maandcijfer', cumulative: false, periodization: 'monthly' },
  [GROUP_CONFIG],
  [],
);

const RAW_TEVREDENHEID = (tevredenheidRaw as any).default ?? tevredenheidRaw as any;

// Build fixture data for the "tevredenheid" endpoint
function buildKTOData() {
  const config = {
    ...PAGE_CONFIG,
    groups: [GROUP_CONFIG],
  };
  initPageStore(config);
  const page = fakePage(config);
  const group = buildGroup(page, GROUP_CONFIG, groups, 0);
  page.chartArray = [group];

  // resolvedEndpoints for ["tevredenheid"] → ["tevredenheid"]
  // fixtureData matches "tevredenheid" in ep via ep.includes("tevredenheid")
  const data = fixtureData(
    { 'tevredenheid': RAW_TEVREDENHEID as any[] },
    group.resolvedEndpoints,
  );
  const result = group.ctrlr.prepareData(data);
  return { result, group, page, data };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('KTOGroupV1 with recorded tevredenheid fixture', () => {
  describe('complete === true filter', () => {
    it('month data is filtered to only complete=true rows', () => {
      const { result } = buildKTOData();
      // 358 raw rows, 83 have complete=true. The filter reduces graphDataMonth to 83.
      expect(result.graphDataMonth.length).toBeLessThan(RAW_TEVREDENHEID.length);
      expect(result.graphDataMonth.length).toBeGreaterThan(0);
      // Every row in graphDataMonth must be complete
      for (const row of result.graphDataMonth) {
        expect(row.complete).toBe(true);
      }
    });

    it('week data stays unfiltered (complete filter only applies to month side)', () => {
      const { result } = buildKTOData();
      expect(result.graphDataWeek.length).toBe(RAW_TEVREDENHEID.length);
    });
  });

  describe('return shape — only monthTableInc is populated', () => {
    // 83 of 357 raw rows have complete=true — that's the expected table row count
    const EXPECTED_KTO_ROWS = 83;

    it('monthTableInc has rows matching the filtered count', () => {
      const { result } = buildKTOData();
      expect(result.monthTableInc).not.toBeNull();
      expect(result.monthTableInc!.rows.length).toBe(EXPECTED_KTO_ROWS);
      // Dimensional check: 2 fixed headers (Jaar, Maand) + 4 param columns
      // (doorlopend_cijfer, aantal_respondenten, maandcijfer, aantal_respondenten_maand)
      expect(result.monthTableInc!.headers.length).toBe(6);
    });

    it('week inc, week cumul, and month cumul tables are empty arrays', () => {
      const { result } = buildKTOData();
      expect(result.weekTableInc).toEqual([]);
      expect(result.weekTableCumul).toEqual([]);
      expect(result.monthTableCumul).toEqual([]);
    });

    it('visibility check — month-table-inc is the single visible table', () => {
      const { result, group, page } = buildKTOData();

      document.body.appendChild(page.main.htmlContainer);
      group.ctrlr.html();
      group.ctrlr.populateTable(result);

      const tables = document.querySelectorAll('table');
      const visibleTables = Array.from(tables).filter(t => !t.classList.contains('hidden'));
      // KTO segment: cumulative=false, periodization=monthly → visible index = 1 + 0*2 = 1 (month-table-inc)
      expect(visibleTables).toHaveLength(1);
      expect(visibleTables[0].id).toBe('month-table-inc');

      const tbody = visibleTables[0].querySelector('tbody');
      expect(tbody?.querySelectorAll('tr').length).toBe(83);
    });

    it('month inc headers start with ["Jaar", "Maand"] (no Periode column for KTO)', () => {
      const { result } = buildKTOData();
      const headers = result.monthTableInc!.headers;
      expect(headers[0]).toBe('Jaar');
      expect(headers[1]).toBe('Maand');
    });
  });

  describe('row structure', () => {
    it('first row of monthTableInc uses _year and completed_month', () => {
      const { result } = buildKTOData();
      const rows = result.monthTableInc!.rows;
      // ktoRowing pushes period._year then period.completed_month
      // The first row of the filtered data should have these
      const firstRow = rows[0];
      expect(firstRow[0]).toBeDefined(); // _year
      expect(firstRow[1]).toBeDefined(); // completed_month
    });

    it('completed_month is populated for all filtered rows', () => {
      const { result } = buildKTOData();
      for (const row of result.graphDataMonth) {
        expect(row.completed_month).not.toBeNull();
      }
    });
  });

  describe('ktoTables vs tables differences', () => {
    it('ktoTables does not produce cumul tables or showToggle', () => {
      const { result } = buildKTOData();
      // ktoTables returns { monthTableInc, showToggle, hasAny }
      // But KTOGroupV1 overrides the return to only include monthTableInc
      expect('weekTableCumul' in result).toBe(true); // returned as []
      expect('monthTableCumul' in result).toBe(true); // returned as []
      // showToggle/hasAny are not in the KTO return — they're consumed by ktoTables internally
      expect('showToggle' in result).toBe(false);
    });
  });
});