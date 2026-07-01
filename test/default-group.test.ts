// @vitest-environment jsdom
//
// Real per-group test for DefaultGroupV1 using recorded API fixtures.
// Asserts exact row values from a known anchor period — the transposition
// guard that was the whole point of starting with tables.
//
import { describe, it, expect, beforeEach } from 'vitest';
import { resetStore, initPageStore, buildGroup, fakePage, fixtureData, buildPageConfig } from './helpers/harness';
import { DefaultGroupV1 } from '../src/shared/default-group-v1';
import type { IPageConfig, IGroupMappingV2 } from '../src/shared/interfaces';
import * as fsWeekRaw from './fixtures/fs_overzicht/fs_totals/week.json';
import * as fsMonthRaw from './fixtures/fs_overzicht/fs_totals/month.json';

// Number of rows in recorded fixtures
const WEEK_FIXTURE_ROWS = (fsWeekRaw as any).default?.length ?? (fsWeekRaw as any).length ?? 0;
const MONTH_FIXTURE_ROWS = (fsMonthRaw as any).default?.length ?? (fsMonthRaw as any).length ?? 0;

const groups: Record<string, new (...args: any[]) => any> = { DefaultGroupV1 };

beforeEach(() => {
  resetStore();
});

// ---------------------------------------------------------------------------
// Anchor period — 2026_05, the latest common period between week and month
// fixtures for fs_overzicht/fs_totals.  Values are from the raw JSON files.
// ---------------------------------------------------------------------------
const ANCHOR = {
  yearweek: '2026_05',
  yearmonth: '2026_05',
  // week values for anchor period 2026_05 (used in week table row assertions)
  ingediend_aantal: 1187,
  ingediend_cumul: 374671,
  voorraad_verschil: -196,
  voorraad_cumul: 26534,
  afgerond_aantal: 1383,
  afgerond_cumul: 348137,
  // month values for anchor period 2026_05 (used in month table row assertions)
  m_ingediend_aantal: 4490,
  m_ingediend_cumul: 396013,
  m_afgerond_aantal: 5689,
  m_afgerond_cumul: 372479,
};

// Values from the FIRST week row (most recent period 2026_25), which is
// what incVsCum reads as data[0] and what numbers derives from.
const FIRST_WEEK = {
  periode: '2026_25',
  ingediend_aantal: 717,
  ingediend_cumul: 398810,
  voorraad_verschil: -301,
  voorraad_cumul: 21622,
  afgerond_aantal: 1018,
  afgerond_cumul: 377188,
};

// ---------------------------------------------------------------------------
// Config slice — mirrors fs_overzicht/fs_totals
// ---------------------------------------------------------------------------
const GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'fs_totals',
  ctrlr: 'DefaultGroupV1',
  filters: ['totaalVsRecent'],
  graphs: [
    {
      slug: 'fs_numbers_v1',
      ctrlr: 'NumbersMultiplesV1',
      parameters: [
        [
          {
            label: 'Ingediend',
            column: 'ingediend',
            colour: 'orange',
            units: 'ingediend',
            modifiers: { cumul: '_cumul', delta: '_aantal' },
          },
          {
            label: 'Voorraad',
            column: 'voorraad',
            colour: 'purple',
            units: 'voorraad',
            modifiers: { cumul: '_cumul', delta: '_verschil' },
          },
          {
            label: 'Afgehandeld',
            column: 'afgerond',
            colour: 'moss',
            units: 'afgehandeld',
            modifiers: { cumul: '_cumul', delta: '_aantal' },
          },
        ],
        [],
      ],
      segment: { key: 'ingediend', cumulative: true, periodization: 'monthly' },
    },
  ],
  segment: { key: 'ingediend', cumulative: true, periodization: 'monthly' },
  functionality: ['table', 'definitions', 'download'],
  endpoints: [
    'regelingen?aggregatie=eq.week&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&order=periode.desc&periode_vanaf=gte.{VANAF}',
    'regelingen?aggregatie=eq.maand&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&order=periode.desc',
  ],
};

const PAGE_CONFIG: IPageConfig = buildPageConfig(
  'regelingen',
  { key: 'ingediend', cumulative: true, periodization: 'monthly' },
  [GROUP_CONFIG],
);

// Resolved endpoints (what addVarsToEndpoint produces with default segment)
const RESOLVED_WEEK_EP = 'regelingen?aggregatie=eq.week&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&order=periode.desc&periode_vanaf=gte.2025-01-01';
const RESOLVED_MONTH_EP = 'regelingen?aggregatie=eq.maand&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&order=periode.desc';

// Raw payloads keyed by partial match (fixtureData matches ep.includes(k))
const RAW_PAYLOADS: Record<string, any[]> = {
  'aggregatie=eq.week': (fsWeekRaw as any).default ?? fsWeekRaw as any,
  'aggregatie=eq.maand': (fsMonthRaw as any).default ?? fsMonthRaw as any,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildAndPrepare(cumulative: boolean = true) {
  const config = {
    ...PAGE_CONFIG,
    segment: { ...PAGE_CONFIG.segment, cumulative },
    groups: [{
      ...GROUP_CONFIG,
      segment: { ...GROUP_CONFIG.segment, cumulative },
      graphs: [{
        ...GROUP_CONFIG.graphs[0],
        segment: { ...GROUP_CONFIG.graphs[0].segment, cumulative },
      }],
    }],
  };
  initPageStore(config);
  const page = fakePage(config);
  const group = buildGroup(page, config.groups[0], groups, 0);
  page.chartArray = [group];
  const data = fixtureData(RAW_PAYLOADS, group.resolvedEndpoints);
  const result = group.ctrlr.prepareData(data);
  return { result, group, page };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('DefaultGroupV1 with recorded fixtures', () => {
  describe('four-table split', () => {
    it('produces all four tables with week and month data', () => {
      const { result } = buildAndPrepare();
      expect(result.weekTableInc).not.toBeNull();
      expect(result.weekTableCumul).not.toBeNull();
      expect(result.monthTableInc).not.toBeNull();
      expect(result.monthTableCumul).not.toBeNull();

      // Dimensional check — rows match fixture length, headers = 3 fixed + param count
      const incParamCount = 3; // ingediend, voorraad, afgerond
      const cumulParamCount = 3;
      expect(result.weekTableInc!.rows.length).toBe(WEEK_FIXTURE_ROWS);
      expect(result.weekTableInc!.headers.length).toBe(3 + incParamCount);
      expect(result.weekTableCumul!.rows.length).toBe(WEEK_FIXTURE_ROWS);
      expect(result.weekTableCumul!.headers.length).toBe(3 + cumulParamCount);
      expect(result.monthTableInc!.rows.length).toBe(MONTH_FIXTURE_ROWS);
      expect(result.monthTableInc!.headers.length).toBe(3 + incParamCount);
      expect(result.monthTableCumul!.rows.length).toBe(MONTH_FIXTURE_ROWS);
      expect(result.monthTableCumul!.headers.length).toBe(3 + cumulParamCount);
    });

    it('inc tables carry non-_cumul params; cumul tables carry _cumul params', () => {
      const { result } = buildAndPrepare();
      // Inc headers: ["Jaar", "Week", "Periode", "Ingediend", "Voorraad", "Afgehandeld"]
      expect(result.weekTableInc!.headers.slice(3)).toEqual([
        'Ingediend', 'Voorraad', 'Afgehandeld',
      ]);
      // Cumul headers use same labels (same params, different columns)
      expect(result.weekTableCumul!.headers.slice(3)).toEqual([
        'Ingediend', 'Voorraad', 'Afgehandeld',
      ]);
    });
  });

  describe('visibility check — one table visible, ID derived from segment', () => {
    it('mounts and populates tables, the visible table matches segment', () => {
      const { result, group, page } = buildAndPrepare(true); // cumulative=true, periodization=monthly

      document.body.appendChild(page.main.htmlContainer);
      group.ctrlr.html();
      group.ctrlr.populateTable(result);

      // Derive expected visible table from segment
      const periodIndex = group.config.segment.periodization === 'monthly' ? 1 : 0;
      const calcIndex = group.config.segment.cumulative ? 1 : 0;
      const visibleIndex = periodIndex + calcIndex * 2;
      const tableIds = ['week-table-inc', 'month-table-inc', 'week-table-cumul', 'month-table-cumul'];
      const expectedId = tableIds[visibleIndex];

      // Exactly one table is visible (others have class="hidden")
      const tables = document.querySelectorAll('table');
      const visibleTables = Array.from(tables).filter(t => !t.classList.contains('hidden'));
      expect(visibleTables).toHaveLength(1);
      expect(visibleTables[0].id).toBe(expectedId);

      // The visible table has rows
      const tbody = visibleTables[0].querySelector('tbody');
      expect(tbody?.querySelectorAll('tr').length).toBeGreaterThan(0);
    });
  });

  describe('anchor row — transposition guard', () => {
    it('week inc table: full row values match anchor', () => {
      const { result } = buildAndPrepare();
      const rows = result.weekTableInc!.rows;
      // Find the anchor row (sorted descending by _yearweek, so it's toward the end)
      const anchorRow = rows.find((r: string[]) => r[0] === '2026' && r[1] === '5');
      expect(anchorRow).toBeDefined();
      // [Jaar, Week, Periode, ingediend_aantal, voorraad_verschil, afgerond_aantal]
      expect(anchorRow![0]).toBe('2026');
      expect(anchorRow![1]).toBe('5');
      expect(anchorRow![2]).toMatch(/t\/m/); // date range cell
      expect(anchorRow![3]).toBe(ANCHOR.ingediend_aantal);
      expect(anchorRow![4]).toBe(ANCHOR.voorraad_verschil);
      expect(anchorRow![5]).toBe(ANCHOR.afgerond_aantal);
    });

    it('week cumul table: full row values match anchor cumul', () => {
      const { result } = buildAndPrepare();
      const rows = result.weekTableCumul!.rows;
      const anchorRow = rows.find((r: string[]) => r[0] === '2026' && r[1] === '5');
      expect(anchorRow).toBeDefined();
      expect(anchorRow![3]).toBe(ANCHOR.ingediend_cumul);
      expect(anchorRow![4]).toBe(ANCHOR.voorraad_cumul);
      expect(anchorRow![5]).toBe(ANCHOR.afgerond_cumul);
    });

    it('month inc table uses "Maand" header with anchor values', () => {
      const { result } = buildAndPrepare();
      const monthInc = result.monthTableInc!;
      expect(monthInc.headers.slice(0, 3)).toEqual(['Jaar', 'Maand', 'Periode']);
      const rows = monthInc.rows;
      const anchorRow = rows.find((r: string[]) => r[0] === '2026' && r[1] === '5');
      expect(anchorRow).toBeDefined();
      expect(anchorRow![3]).toBe(ANCHOR.m_ingediend_aantal);
      expect(anchorRow![5]).toBe(ANCHOR.m_afgerond_aantal);
    });
  });

  describe('numbers derivation', () => {
    it('numbers is the cumulative array when cumulative=true (no NumbersV1 graph)', () => {
      const { result } = buildAndPrepare(true);
      // Group has NumbersMultiplesV1, not NumbersV1 → numbers = cumulative array
      // from incVsCum: [ingediend_cumul, voorraad_cumul, afgerond_cumul]
      // incVsCum reads data[0] = most recent week (FIRST_WEEK.periode = 2026_25)
      expect(Array.isArray(result.numbers)).toBe(true);
      expect(result.numbers).toHaveLength(3);
      expect(result.numbers[0]).toBe(FIRST_WEEK.ingediend_cumul);
    });

    it('numbers switches to incremental array when cumulative=false', () => {
      const { result } = buildAndPrepare(false);
      expect(Array.isArray(result.numbers)).toBe(true);
      expect(result.numbers[0]).toBe(FIRST_WEEK.ingediend_aantal);
    });
  });

  describe('incVsCum arrays', () => {
    it('incremental and cumulative match first week values in param order', () => {
      const { result } = buildAndPrepare();
      // incVsCum reads data[0] (first week row, most recent period 2026_25)
      // Params order: ingediend, voorraad, afgerond
      expect(result.incremental).toEqual([
        FIRST_WEEK.ingediend_aantal,
        FIRST_WEEK.voorraad_verschil,
        FIRST_WEEK.afgerond_aantal,
      ]);
      expect(result.cumulative).toEqual([
        FIRST_WEEK.ingediend_cumul,
        FIRST_WEEK.voorraad_cumul,
        FIRST_WEEK.afgerond_cumul,
      ]);
    });
  });

  describe('complete filter observable through real data', () => {
    it('the complete filter only fires for endpoints matching "tevredenheid" — other endpoints pass all rows through', () => {
      const { result } = buildAndPrepare();
      // The fs_overzicht endpoints don't include "tevredenheid", so the
      // monthGroup === "tevredenheid" filter in group-v1.ts does NOT fire.
      // This is correct — the === check is not a bug despite looking like
      // a .includes()/.=== mismatch; it intentionally only matches the
      // literal endpoint string "tevredenheid" (a legacy API view name
      // that current KTO/waardering groups still use).  Groups whose
      // endpoints include "eq.maand" route through a different code path
      // and should NOT be silently filtered.
      expect(result.graphDataMonth.length).toBeGreaterThan(0);
    });
  });

  describe('all_totals mutation', () => {
    it('fs_totals slug does NOT trigger the all_totals mutation', () => {
      const { result } = buildAndPrepare();
      // The mutation only fires for slug === "all_totals" → our group is "fs_totals"
      const firstWeekRow = result.graphDataWeek[0];
      expect(firstWeekRow.bedrag_betaald_totaal_cumul_eur).not.toBe('-');
    });
  });

  describe('pre_headers', () => {
    it('pre_headers are undefined (preHeaders returns [] for non-special-cased graph slugs)', () => {
      const { result } = buildAndPrepare();
      expect(result.weekTableInc!.pre_headers).toBeUndefined();
    });
  });
});
