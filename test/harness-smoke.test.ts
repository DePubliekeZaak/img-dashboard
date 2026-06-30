// @vitest-environment jsdom
//
// End-to-end smoke test that proves the harness wiring works end to end.
// Builds DefaultGroupV1 from a real config slice, feeds it fixture data,
// calls prepareData, and asserts non-null tables with correct row values.
//
import { describe, it, expect, beforeEach } from 'vitest';
import { resetStore, initPageStore, buildGroup, fakePage, fixtureData, buildPageConfig } from './helpers/harness';
import { DefaultGroupV1 } from '../src/shared/default-group-v1';
import type { IPageConfig, IGroupMappingV2 } from '../src/shared/interfaces';

const groups: Record<string, new (...args: any[]) => any> = { DefaultGroupV1 };

beforeEach(() => {
  resetStore();
});

// ---------------------------------------------------------------------------
// Raw fixture rows (hand-built, no API dependency — real mapRow derives _ fields)
// ---------------------------------------------------------------------------
const RAW_WEEK_ROWS = [
  {
    aggregatie: 'WEEK',
    periode: '2025_03',
    periode_vanaf: '2025-01-13',
    periode_totenmet: '2025-01-19',
    ingediend_aantal: 42,
    ingediend_cumul: 420,
    voorraad_verschil: 5,
    voorraad_cumul: 50,
    afgerond_aantal: 18,
    afgerond_cumul: 180,
  },
  {
    aggregatie: 'WEEK',
    periode: '2025_02',
    periode_vanaf: '2025-01-06',
    periode_totenmet: '2025-01-12',
    ingediend_aantal: 35,
    ingediend_cumul: 378,
    voorraad_verschil: -2,
    voorraad_cumul: 45,
    afgerond_aantal: 15,
    afgerond_cumul: 162,
  },
];

const RAW_MONTH_ROWS = [
  {
    aggregatie: 'MAAND',
    periode: '2025_01',
    periode_vanaf: '2025-01-01',
    periode_totenmet: '2025-01-31',
    ingediend_aantal: 180,
    ingediend_cumul: 1800,
    voorraad_verschil: 20,
    voorraad_cumul: 200,
    afgerond_aantal: 80,
    afgerond_cumul: 800,
  },
];

// ---------------------------------------------------------------------------
// Config slice — mirrors fs_overzicht's fs_totals group
// ---------------------------------------------------------------------------
const GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'fs_totals',
  ctrlr: 'DefaultGroupV1',
  filters: [],
  graphs: [
    {
      slug: 'fs_numbers_v1',
      ctrlr: 'NumbersMultiplesV1',
      parameters: [
        [
          {
            label: 'Ingediend',
            column: 'ingediend', colour: 'orange', units: 'ingediend',
            modifiers: { cumul: '_cumul', delta: '_aantal' },
          },
          {
            label: 'Afgehandeld',
            column: 'afgerond', colour: 'moss', units: 'afgehandeld',
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
    'regelingen?aggregatie=eq.week&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&order=periode.desc',
    'regelingen?aggregatie=eq.maand&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&order=periode.desc',
  ],
};

const PAGE_CONFIG: IPageConfig = buildPageConfig(
  'regelingen',
  { key: 'ingediend', cumulative: true, periodization: 'monthly' },
  [GROUP_CONFIG],
);

const RAW_PAYLOADS: Record<string, any[]> = {
  'aggregatie=eq.week': RAW_WEEK_ROWS,
  'aggregatie=eq.maand': RAW_MONTH_ROWS,
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('harness end-to-end smoke — DefaultGroupV1', () => {
  it('builds a group and prepareData returns all four tables', () => {
    initPageStore(PAGE_CONFIG);
    const page = fakePage(PAGE_CONFIG);
    const group = buildGroup(page, GROUP_CONFIG, groups, 0);
    page.chartArray = [group];

    const data = fixtureData(RAW_PAYLOADS, group.resolvedEndpoints);
    const result = group.ctrlr.prepareData(data);

    // DefaultGroupV1.prepareData returns individual table objects, not showToggle/hasAny
    expect(result.weekTableInc).not.toBeNull();
    expect(result.weekTableCumul).not.toBeNull();
    expect(result.monthTableInc).not.toBeNull();
    expect(result.monthTableCumul).not.toBeNull();
  });

  it('week inc table uses param labels for headers and contains row values', () => {
    initPageStore(PAGE_CONFIG);
    const page = fakePage(PAGE_CONFIG);
    const group = buildGroup(page, GROUP_CONFIG, groups, 0);
    page.chartArray = [group];

    const data = fixtureData(RAW_PAYLOADS, group.resolvedEndpoints);
    const result = group.ctrlr.prepareData(data);

    const weekInc = result.weekTableInc!;
    // Headers use p.short ?? p.label; neither param has short → label
    expect(weekInc.headers).toEqual([
      'Jaar', 'Week', 'Periode',
      'Ingediend', 'Afgehandeld',
    ]);

    // Rows sorted descending by _yearweek → 2025_03 first
    expect(weekInc.rows[0][0]).toBe('2025');
    expect(weekInc.rows[0][1]).toBe('3');  // _week from periode.split("_")[1]
    // Periode cell exists with date range
    expect(weekInc.rows[0][2]).toMatch(/t\/m/);
    // ingediend_aantal = 42, afgerond_aantal = 18
    expect(weekInc.rows[0][3]).toBe(42);
    expect(weekInc.rows[0][4]).toBe(18);

    // Second row (2025_02)
    expect(weekInc.rows[1][3]).toBe(35);
    expect(weekInc.rows[1][4]).toBe(15);
  });

  it('week cumul table has labels from cumul-column params only', () => {
    initPageStore(PAGE_CONFIG);
    const page = fakePage(PAGE_CONFIG);
    const group = buildGroup(page, GROUP_CONFIG, groups, 0);
    page.chartArray = [group];

    const data = fixtureData(RAW_PAYLOADS, group.resolvedEndpoints);
    const result = group.ctrlr.prepareData(data);

    const weekCumul = result.weekTableCumul!;
    // Cumul uses same labels because tables() filters by column name pattern:
    // columns ending in _cumul → cumul table, everything else → inc table
    // But params are created by paramsAndModifiers which appends modifiers
    // to the base column name: ingediend + _cumul → ingediend_cumul
    // The label stays the same.
    expect(weekCumul.headers.slice(0, 3)).toEqual(['Jaar', 'Week', 'Periode']);
    // Both params have both inc and cumul variants, so both appear in both tables
    // Actually no — cumul columns have _cumul suffix, inc columns have _aantal suffix
    // tables() filters: if column includes "_cumul" → cumul table, else → inc table
    // ingediend_cumul includes "_cumul" → cumul
    // ingediend_aantal does NOT include "_cumul" → inc
    // afgerond_cumul includes "_cumul" → cumul
    // afgerond_aantal does NOT include "_cumul" → inc
    // But the label is the same for both variants: "Ingediend" and "Afgehandeld"
    // So cumul headers are ["Jaar", "Week", "Periode", "Ingediend", "Afgehandeld"]
    expect(weekCumul.headers.slice(3)).toEqual(['Ingediend', 'Afgehandeld']);

    // Values
    expect(weekCumul.rows[0][3]).toBe(420);  // ingediend_cumul
    expect(weekCumul.rows[0][4]).toBe(180);  // afgerond_cumul
  });

  it('month inc table uses "Maand" header and has month data', () => {
    initPageStore(PAGE_CONFIG);
    const page = fakePage(PAGE_CONFIG);
    const group = buildGroup(page, GROUP_CONFIG, groups, 0);
    page.chartArray = [group];

    const data = fixtureData(RAW_PAYLOADS, group.resolvedEndpoints);
    const result = group.ctrlr.prepareData(data);

    const monthInc = result.monthTableInc!;
    expect(monthInc.headers.slice(0, 3)).toEqual(['Jaar', 'Maand', 'Periode']);
    expect(monthInc.rows[0][3]).toBe(180);  // ingediend_aantal for January
  });

  it('pre_headers is undefined (preHeaders returns [] → [][0] is undefined)', () => {
    initPageStore(PAGE_CONFIG);
    const page = fakePage(PAGE_CONFIG);
    const group = buildGroup(page, GROUP_CONFIG, groups, 0);
    page.chartArray = [group];

    const data = fixtureData(RAW_PAYLOADS, group.resolvedEndpoints);
    const result = group.ctrlr.prepareData(data);

    // preHeaders(this.config.graphs, this.segment) for fs_totals (no special-cased slug)
    // returns []. tables() does pre_headers !== null ? pre_headers![0] : []
    // → [] !== null → [][0] → undefined
    expect(result.weekTableInc!.pre_headers).toBeUndefined();
  });

  it('numbers reflects cumulative mode (array from incVsCum)', () => {
    initPageStore(PAGE_CONFIG);
    const page = fakePage(PAGE_CONFIG);
    const group = buildGroup(page, GROUP_CONFIG, groups, 0);
    page.chartArray = [group];

    const data = fixtureData(RAW_PAYLOADS, group.resolvedEndpoints);
    const result = group.ctrlr.prepareData(data);

    // group segment cumulative=true, no NumbersV1 graph in config
    // → numbers = cumulative array from incVsCum: [ingediend_cumul, afgerond_cumul]
    expect(result.numbers).toEqual([420, 180]);
  });
});