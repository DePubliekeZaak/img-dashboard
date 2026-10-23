// @vitest-environment jsdom
//
// Regression test: RegelingComparisonGroupV1 merges the per-regeling
// endpoints of a group into rows keyed by periode, prefixing every data
// column with the lowercased regeling_code so the regelingen sit side-by-side
// in the same row (mw_*, vv_*, …). It returns the same data shape the
// KTORatingsV1 graph consumes (graphDataWeek, graphDataMonth, numbers, …).
//
// Example group: waardering → waardering_regeling → mw_cijfer_regeling
//
import { describe, it, expect, beforeEach } from 'vitest';
import {
  resetStore,
  initPageStore,
  buildGroup,
  fakePage,
  buildPageConfig,
} from './helpers/harness';
import { RegelingComparisonGroupV1 } from '../src/pages/waardering/groups/regeling-comparison-group';
import type { IPageConfig, IGroupMappingV2 } from '../src/shared/interfaces';

const groups: Record<string, new (...args: any[]) => any> = {
  RegelingComparisonGroupV1,
};

// Mirrors group "waardering_regeling" in src/pages/waardering/config.ts:
// one maand + one week endpoint per regeling, params authored for the
// default regeling (mw_*).
const GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'waardering_regeling',
  ctrlr: 'RegelingComparisonGroupV1',
  filters: [],
  graphs: [
    {
      slug: 'mw_cijfer_regeling',
      ctrlr: 'KTORatingsV1',
      args: [],
      filters: ['domeinSelect', 'monthSelect'],
      parameters: [
        [
          { label: 'Doorlopend', column: 'mw_kto_score_gemiddeld_cumul', colour: 'orange' },
          { label: 'Maandcijfer', column: 'mw_kto_score_gemiddeld', colour: 'orange' },
        ],
      ],
      segment: { key: 'all', domein: 'mw', cumulative: true, periodization: 'monthly' },
    },
  ],
  segment: { key: 'all', domein: 'mw', cumulative: true, periodization: 'monthly' },
  functionality: [],
  endpoints: [
    'regelingen?aggregatie=eq.maand&regeling_code=eq.MW&order=periode.desc',
    'regelingen?aggregatie=eq.maand&regeling_code=eq.VV&order=periode.desc',
    'regelingen?aggregatie=eq.week&regeling_code=eq.MW&order=periode.desc',
    'regelingen?aggregatie=eq.week&regeling_code=eq.VV&order=periode.desc',
  ],
};

const PAGE_CONFIG: IPageConfig = buildPageConfig(
  'waardering',
  { key: 'all', cumulative: true, periodization: 'monthly' },
  [GROUP_CONFIG],
);

beforeEach(() => {
  resetStore();
  document.body.innerHTML = '';
});

function buildPrepared(): any {
  initPageStore(PAGE_CONFIG);
  const page = fakePage(PAGE_CONFIG);
  const g = buildGroup(page, GROUP_CONFIG, groups, 0);
  // super.prepareData() looks the group up via page.chartArray by slug.
  (page.chartArray as any[]).push(g);

  // Raw per-endpoint rows with regeling_code + KTO score columns. Week rows
  // carry the non-cumulative column, month rows the cumulative one.
  const raw: Record<string, any[]> = {};
  for (const ep of g.resolvedEndpoints) {
    const isWeek = ep.includes('aggregatie=eq.week');
    const reg = (ep.match(/regeling_code=eq\.([A-Z]+)/) as any[])[1];
    raw[ep] = [
      isWeek
        ? { periode: '2026_09', regeling_code: reg, kto_score_gemiddeld: 7.2, _week: 37 }
        : {
            periode: '2026_09',
            regeling_code: reg,
            kto_score_gemiddeld_cumul: 7.2,
            kto_score_totaal_cumul: 42,
            _month: 9,
            _year: 2026,
            _yearmonth: '2026_09',
            complete: true,
          },
      isWeek
        ? { periode: '2026_08', regeling_code: reg, kto_score_gemiddeld: 7.0, _week: 36 }
        : {
            periode: '2026_08',
            regeling_code: reg,
            kto_score_gemiddeld_cumul: 7.0,
            kto_score_totaal_cumul: 40,
            _month: 8,
            _year: 2026,
            _yearmonth: '2026_08',
            complete: true,
          },
    ];
  }

  return g.ctrlr.prepareData(raw);
}

describe('RegelingComparisonGroupV1', () => {
  it('merges month endpoints into per-periode rows with regeling-prefixed columns', () => {
    const prepared = buildPrepared();

    // Two periods, kept from both MW and VV endpoints, sorted desc.
    expect(prepared.graphDataMonth.map((r: any) => r.periode)).toEqual([
      '2026_09',
      '2026_08',
    ]);

    const row = prepared.graphDataMonth[0];
    expect(row['mw_kto_score_gemiddeld_cumul']).toBe(7.2);
    expect(row['vv_kto_score_gemiddeld_cumul']).toBe(7.2);

    // regeling_code is not kept; internal _yearmonth survives unprefixed.
    expect(row['regeling_code']).toBeUndefined();
    expect(row['_yearmonth']).toBe('2026_09');
  });

  it('keeps week and month merges separate (cumulative vs non-cumulative columns)', () => {
    const prepared = buildPrepared();

    const weekRow = prepared.graphDataWeek[0];
    expect(weekRow['mw_kto_score_gemiddeld']).toBe(7.2);
    expect(weekRow['mw_kto_score_gemiddeld_cumul']).toBeUndefined();

    const monthRow = prepared.graphDataMonth[0];
    expect(monthRow['mw_kto_score_gemiddeld_cumul']).toBe(7.2);
    expect(monthRow['mw_kto_score_gemiddeld']).toBeUndefined();
  });

  it('exposes the numbers + table/timeline shape the KTO graph consumes', () => {
    const prepared = buildPrepared();

    expect(prepared.numbers).toBe(prepared.graphDataWeek[0]);
    expect(prepared).toHaveProperty('graphDataMonth');
    expect(prepared).toHaveProperty('weekTableInc');
    expect(prepared).toHaveProperty('monthTableInc');
    expect(prepared).toHaveProperty('weekTableCumul');
    expect(prepared).toHaveProperty('monthTableCumul');
    expect(prepared).toHaveProperty('definitions');
    expect(prepared).toHaveProperty('timeline');
  });
});

// ---------------------------------------------------------------------------
// waardering → respondenten_trend (2nd group): the table is incremental,
// month-only, one respondent-count column per regeling, no pre-header bands.
// ---------------------------------------------------------------------------
const RESPONDENT_GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'respondenten_trend',
  ctrlr: 'RegelingComparisonGroupV1',
  filters: [],
  graphs: [
    {
      slug: 'fs_trend_respondents',
      ctrlr: 'BarTrendStackedMakeup',
      filters: [],
      args: [],
      parameters: [
        [
          { label: 'Fysieke schade', column: 'mw_kto_score_totaal', units: 'respondenten', colour: 'blue' },
          { label: 'Vaste vergoeding', column: 'vv_kto_score_totaal', units: 'respondenten', colour: 'orange' },
          { label: 'Waardedaling', column: 'wd_kto_score_totaal', units: 'respondenten', colour: 'purple' },
          { label: 'Immateriele schade: volwassenen', column: 'ims_kto_score_totaal', units: 'respondenten', colour: 'moss' },
          { label: 'Immateriele schade: kinderen en jongeren', column: 'imk_kto_score_totaal', units: 'respondenten', colour: 'lightBlue' },
        ],
      ],
      segment: { key: 'mw_kto_score_totaal', cumulative: false, periodization: 'monthly' },
    },
  ],
  segment: { key: 'mw_kto_score_totaal', cumulative: false, periodization: 'monthly' },
  functionality: ['table', 'definitions', 'download'],
  endpoints: [
    'regelingen?aggregatie=eq.maand&regeling_code=eq.MW&order=periode.desc',
    'regelingen?aggregatie=eq.maand&regeling_code=eq.VV&order=periode.desc',
    'regelingen?aggregatie=eq.maand&regeling_code=eq.IMK&order=periode.desc',
    'regelingen?aggregatie=eq.maand&regeling_code=eq.IMS&order=periode.desc',
    'regelingen?aggregatie=eq.maand&regeling_code=eq.WD&order=periode.desc',
    'regelingen?aggregatie=eq.week&regeling_code=eq.MW&order=periode.desc',
    'regelingen?aggregatie=eq.week&regeling_code=eq.VV&order=periode.desc',
    'regelingen?aggregatie=eq.week&regeling_code=eq.IMK&order=periode.desc',
    'regelingen?aggregatie=eq.week&regeling_code=eq.IMS&order=periode.desc',
    'regelingen?aggregatie=eq.week&regeling_code=eq.WD&order=periode.desc',
  ],
};

const RESPONDENT_PAGE_CONFIG: IPageConfig = buildPageConfig(
  'waardering',
  { key: 'mw_kto_score_totaal', cumulative: false, periodization: 'monthly' },
  [RESPONDENT_GROUP_CONFIG],
);

// Respondent counts per regeling (same for week + month rows here).
const RESPONDENT_COUNTS: Record<string, number> = {
  MW: 120,
  VV: 80,
  IMK: 30,
  IMS: 60,
  WD: 40,
};

describe('respondenten_trend group table (inc / month / per regeling)', () => {
  function buildPrepared(): any {
    resetStore();
    document.body.innerHTML = '';
    initPageStore(RESPONDENT_PAGE_CONFIG);
    const page = fakePage(RESPONDENT_PAGE_CONFIG);
    const g = buildGroup(page, RESPONDENT_GROUP_CONFIG, groups, 0);
    (page.chartArray as any[]).push(g);

    const raw: Record<string, any[]> = {};
    for (const ep of g.resolvedEndpoints) {
      const isWeek = ep.includes('aggregatie=eq.week');
      const reg = (ep.match(/regeling_code=eq\.([A-Z]+)/) as any[])[1];
      const count = RESPONDENT_COUNTS[reg];
      raw[ep] = [
        {
          periode: '2026_09',
          regeling_code: reg,
          kto_score_totaal: isWeek ? count - 5 : count,
          _yearmonth: '2026_09',
          _year: 2026,
          _month: 9,
        },
        {
          periode: '2026_08',
          regeling_code: reg,
          kto_score_totaal: isWeek ? count - 10 : count - 10,
          _yearmonth: '2026_08',
          _year: 2026,
          _month: 8,
        },
      ];
    }
    return g.ctrlr.prepareData(raw);
  }

  it('has a month incremental table with one respondent column per regeling', () => {
    const prepared = buildPrepared();

    expect(prepared.monthTableInc).not.toBeNull();
    expect(prepared.monthTableInc!.headers).toEqual([
      'Jaar',
      'Maand',
      'Periode',
      'Fysieke schade', // mw
      'Vaste vergoeding', // vv
      'Waardedaling', // wd
      'Immateriele schade: volwassenen', // ims
      'Immateriele schade: kinderen en jongeren', // imk
    ]);
  });

  it('is month-only and incremental-only (week + cumul tables empty)', () => {
    const prepared = buildPrepared();

    // Week rows are never fed to tables(), so week tables are null.
    expect(prepared.weekTableInc).toBeNull();
    expect(prepared.weekTableCumul).toBeNull();
    // No _cumul params → the cumul table has only the 3 fixed headers and no rows.
    expect(prepared.monthTableCumul!.headers).toEqual(['Jaar', 'Maand', 'Periode']);
    expect(prepared.monthTableCumul!.rows).toHaveLength(0);
  });

  it('rows carry the respondent count for every regeling', () => {
    const prepared = buildPrepared();
    const rows = prepared.monthTableInc!.rows;

    expect(rows).toHaveLength(2);
    expect(rows[0]).toContain(120); // mw
    expect(rows[0]).toContain(80); // vv
    expect(rows[0]).toContain(40); // wd
    expect(rows[0]).toContain(60); // ims
    expect(rows[0]).toContain(30); // imk
  });

  it('has no pre-header bands', () => {
    const prepared = buildPrepared();
    // No table_label on the params and an empty pre_headers arg → no bands.
    expect(prepared.monthTableInc!.pre_headers).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// waardering → waardering_regelingsvarianten (4th group): the table mirrors
// all_waardering / waardering_regelingen — two symmetric tables
// (cumul + incremental) for week AND month, 5 regelingen x (cijfer,
// respondenten) = 10 columns, one band per regeling.
// ---------------------------------------------------------------------------
const VARIANTS_GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'waardering_regelingsvarianten',
  ctrlr: 'RegelingComparisonGroupV1',
  filters: ['regelingSelect'],
  graphs: [
    {
      slug: 'mw_cijfer_regeling',
      ctrlr: 'KTORatingsV1',
      filters: ['monthSelect'],
      args: ['mw_kto_score_totaal_cumul', 'mw_kto_score_totaal'],
      parameters: [
        [
          { label: 'Doorlopend', column: 'mw_kto_score_gemiddeld_cumul', colour: 'orange', table_label: 'Maatwerk', table_header: 'cijfer' },
          { label: 'Maandcijfer', column: 'mw_kto_score_gemiddeld', colour: 'orange', table_label: 'Maatwerk', table_header: 'cijfer' },
          { label: 'Respondenten doorlopend', column: 'mw_kto_score_totaal_cumul', colour: 'orange', table_label: 'Maatwerk', table_header: 'respondenten' },
          { label: 'Respondenten', column: 'mw_kto_score_totaal', colour: 'orange', table_label: 'Maatwerk', table_header: 'respondenten' },
        ],
        [
          { label: '1', column: 'mw_kto_score_1_aantal_cumul', colour: 'orange', excludeFromTable: true },
          { label: '2', column: 'mw_kto_score_2_aantal_cumul', colour: 'orange', excludeFromTable: true },
          { label: '3', column: 'mw_kto_score_3_aantal_cumul', colour: 'orange', excludeFromTable: true },
          { label: '4', column: 'mw_kto_score_4_aantal_cumul', colour: 'orange', excludeFromTable: true },
          { label: '5', column: 'mw_kto_score_5_aantal_cumul', colour: 'orange', excludeFromTable: true },
          { label: '6', column: 'mw_kto_score_6_aantal_cumul', colour: 'blue', excludeFromTable: true },
          { label: '7', column: 'mw_kto_score_7_aantal_cumul', colour: 'blue', excludeFromTable: true },
          { label: '8', column: 'mw_kto_score_8_aantal_cumul', colour: 'moss', excludeFromTable: true },
          { label: '9', column: 'mw_kto_score_9_aantal_cumul', colour: 'moss', excludeFromTable: true },
          { label: '10', column: 'mw_kto_score_10_aantal_cumul', colour: 'moss', excludeFromTable: true },
        ],
        [
          { label: '1', column: 'mw_kto_score_1_aantal', colour: 'orange', excludeFromTable: true },
          { label: '2', column: 'mw_kto_score_2_aantal', colour: 'orange', excludeFromTable: true },
          { label: '3', column: 'mw_kto_score_3_aantal', colour: 'orange', excludeFromTable: true },
          { label: '4', column: 'mw_kto_score_4_aantal', colour: 'orange', excludeFromTable: true },
          { label: '5', column: 'mw_kto_score_5_aantal', colour: 'orange', excludeFromTable: true },
          { label: '6', column: 'mw_kto_score_6_aantal', colour: 'blue', excludeFromTable: true },
          { label: '7', column: 'mw_kto_score_7_aantal', colour: 'blue', excludeFromTable: true },
          { label: '8', column: 'mw_kto_score_8_aantal', colour: 'moss', excludeFromTable: true },
          { label: '9', column: 'mw_kto_score_9_aantal', colour: 'moss', excludeFromTable: true },
          { label: '10', column: 'mw_kto_score_10_aantal', colour: 'moss', excludeFromTable: true },
        ],
      ],
      segment: { key: 'all', regeling: 'mw', cumulative: true, periodization: 'monthly' },
    },
    {
      slug: 'regeling_trend',
      ctrlr: 'KtoBarTrendV1',
      filters: [],
      args: [],
      parameters: [
        [{ label: 'Waardering', column: 'mw_kto_score_gemiddeld', units: 'waardering', colour: 'moss', format: 'decimals', excludeFromTable: true }],
      ],
      segment: { key: 'mw_kto_score_gemiddeld', regeling: 'mw', cumulative: false, periodization: 'monthly' },
    },
  ],
  segment: { key: 'mw_kto_score_gemiddeld', regeling: 'mw', cumulative: true, periodization: 'monthly' },
  functionality: ['table', 'definitions', 'download'],
  endpoints: [
    ...(['MW', 'VV', 'IMK', 'IMS', 'WD'] as const).flatMap((r) => [
      `regelingen?aggregatie=eq.maand&regeling_code=eq.${r}&order=periode.desc`,
      `regelingen?aggregatie=eq.week&regeling_code=eq.${r}&order=periode.desc`,
    ]),
  ],
};

const VARIANTS_PAGE_CONFIG: IPageConfig = buildPageConfig(
  'waardering',
  { key: 'mw_kto_score_gemiddeld', regeling: 'mw', cumulative: true, periodization: 'monthly' },
  [VARIANTS_GROUP_CONFIG],
);

const REGELING_VALUES: Record<string, { cumul: number; cumulResp: number; inc: number; incResp: number }> = {
  MW: { cumul: 7.4, cumulResp: 1000, inc: 7.1, incResp: 100 },
  VV: { cumul: 6.9, cumulResp: 800, inc: 6.6, incResp: 80 },
  IMK: { cumul: 6.1, cumulResp: 400, inc: 5.9, incResp: 40 },
  IMS: { cumul: 5.8, cumulResp: 600, inc: 5.5, incResp: 60 },
  WD: { cumul: 5.5, cumulResp: 300, inc: 5.2, incResp: 30 },
};

describe('waardering_regelingsvarianten table mirrors the symmetric layout (5 x 2)', () => {
  function buildPrepared(): any {
    resetStore();
    document.body.innerHTML = '';
    initPageStore(VARIANTS_PAGE_CONFIG);
    const page = fakePage(VARIANTS_PAGE_CONFIG);
    const g = buildGroup(page, VARIANTS_GROUP_CONFIG, groups, 0);
    (page.chartArray as any[]).push(g);

    const raw: Record<string, any[]> = {};
    for (const ep of g.resolvedEndpoints) {
      const isWeek = ep.includes('aggregatie=eq.week');
      const reg = (ep.match(/regeling_code=eq\.([A-Z]+)/) as any[])[1];
      const v = REGELING_VALUES[reg];
      raw[ep] = [
        {
          periode: '2026_09',
          regeling_code: reg,
          kto_score_gemiddeld_cumul: v.cumul,
          kto_score_totaal_cumul: v.cumulResp,
          kto_score_gemiddeld: v.inc,
          kto_score_totaal: v.incResp,
          _yearmonth: '2026_09',
          _year: 2026,
          _month: 9,
          _yearweek: '2026_38',
          _week: 38,
        },
        {
          periode: '2026_08',
          regeling_code: reg,
          kto_score_gemiddeld_cumul: v.cumul - 0.1,
          kto_score_totaal_cumul: v.cumulResp - 5,
          kto_score_gemiddeld: v.inc - 0.1,
          kto_score_totaal: v.incResp - 5,
          _yearmonth: '2026_08',
          _year: 2026,
          _month: 8,
          _yearweek: '2026_36',
          _week: 36,
        },
      ];
      void isWeek;
    }
    return g.ctrlr.prepareData(raw);
  }

  it('produces all four tables (week + month, cumul + inc), 10 data columns each', () => {
    const prepared = buildPrepared();

    expect(prepared.weekTableInc).not.toBeNull();
    expect(prepared.monthTableInc).not.toBeNull();
    expect(prepared.weekTableCumul).not.toBeNull();
    expect(prepared.monthTableCumul).not.toBeNull();

    for (const t of [prepared.weekTableInc, prepared.monthTableInc, prepared.weekTableCumul, prepared.monthTableCumul]) {
      expect(t!.headers).toHaveLength(3 + 10);
    }
  });

  it('headers repeat cijfer | respondenten for each of the 5 regelingen', () => {
    const prepared = buildPrepared();
    const expected = [
      'Jaar', 'Maand', 'Periode',
      'cijfer', 'respondenten',
      'cijfer', 'respondenten',
      'cijfer', 'respondenten',
      'cijfer', 'respondenten',
      'cijfer', 'respondenten',
    ];
    expect(prepared.monthTableCumul!.headers).toEqual(expected);
    expect(prepared.monthTableInc!.headers).toEqual(expected);
  });

  it('pre-header bands span one per regeling (5 x 2)', () => {
    const prepared = buildPrepared();
    const expected = [
      { label: '', length: 3 },
      { label: 'Maatwerk', length: 2 },
      { label: 'Vaste vergoeding', length: 2 },
      { label: 'Immateriele schade: volwassenen', length: 2 },
      { label: 'Immateriele schade: kinderen en jongeren', length: 2 },
      { label: 'Waardedaling wonen', length: 2 },
    ];
    expect(prepared.monthTableCumul!.pre_headers).toEqual(expected);
    expect(prepared.monthTableInc!.pre_headers).toEqual(expected);
    const total = expected.reduce((sum, h) => sum + h.length, 0);
    expect(total).toBe(3 + 10);
  });

  it('rows carry cumul + inc values for every regeling', () => {
    const prepared = buildPrepared();

    const cumulRows = prepared.monthTableCumul!.rows;
    expect(cumulRows).toHaveLength(2);
    expect(cumulRows[0]).toContain(1000); // mw cumul respondenten
    expect(cumulRows[0]).toContain(800); // vv
    expect(cumulRows[0]).toContain(400); // imk
    expect(cumulRows[0]).toContain(600); // ims
    expect(cumulRows[0]).toContain(300); // wd

    const incRows = prepared.monthTableInc!.rows;
    expect(incRows[0]).toContain(100); // mw inc respondenten
    expect(incRows[0]).toContain(80); // vv
    expect(incRows[0]).toContain(40); // imk
    expect(incRows[0]).toContain(60); // ims
    expect(incRows[0]).toContain(30); // wd
  });

  it('keeps the 1-10 score breakdown out of the table', () => {
    const prepared = buildPrepared();
    const joined = [...prepared.monthTableCumul!.headers, ...prepared.monthTableInc!.headers].join(' ');
    expect(joined).not.toContain('kto_score_');
  });
});
