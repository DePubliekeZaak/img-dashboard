// @vitest-environment jsdom
//
// waardering/waardering_regelingen (3rd group) — DomainComparisonGroupV1 now
// mirrors all_waardering's table: TWO symmetric tables (cumul/Optellend +
// incremental/Toename) with the SAME 8 columns (Totaal + 3 domeinen x
// cijfer + respondenten), pre-header bands per domein, and a regular header
// that repeats `cijfer | respondenten` per band. The graphs are authored
// against the default domein (fysiek_*), so the group expands the table
// params to Totaal + all domeinen; the 1-10 score breakdown params stay out
// of the table.
//
import { describe, it, expect, beforeEach } from 'vitest';
import {
  resetStore,
  initPageStore,
  buildGroup,
  fakePage,
  buildPageConfig,
} from './helpers/harness';
import { DomainComparisonGroupV1 } from '../src/pages/waardering/groups/domain-comparison-group';
import type { IPageConfig, IGroupMappingV2 } from '../src/shared/interfaces';

const groups: Record<string, new (...args: any[]) => any> = {
  DomainComparisonGroupV1,
};

beforeEach(() => {
  resetStore();
});

const SELECT_EXTRA = 'kto_score_gemiddeld_cumul%2ckto_score_gemiddeld%2ckto_score_totaal_cumul%2ckto_score_totaal%2ckto_score_1_aantal_cumul%2ckto_score_2_aantal_cumul%2ckto_score_3_aantal_cumul%2ckto_score_4_aantal_cumul%2ckto_score_5_aantal_cumul%2ckto_score_6_aantal_cumul%2ckto_score_7_aantal_cumul%2ckto_score_8_aantal_cumul%2ckto_score_9_aantal_cumul%2ckto_score_10_aantal_cumul%2ckto_score_1_aantal%2ckto_score_2_aantal%2ckto_score_3_aantal%2ckto_score_4_aantal%2ckto_score_5_aantal%2ckto_score_6_aantal%2ckto_score_7_aantal%2ckto_score_8_aantal%2ckto_score_9_aantal%2ckto_score_10_aantal';

function ep(domein: string, agg: 'week' | 'maand') {
  const extra = agg === 'maand' ? SELECT_EXTRA : 'kto_score_gemiddeld_cumul%2ckto_score_totaal_cumul%2ckto_score_gemiddeld%2ckto_score_totaal';
  return `regelingen?aggregatie=eq.${agg}&domein_code=eq.${domein}&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2c${extra}&order=periode.desc${agg === 'week' ? '&limit=1' : ''}`;
}

const GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'waardering_regelingen',
  ctrlr: 'DomainComparisonGroupV1',
  filters: ['domeinSelect'],
  graphs: [
    {
      slug: 'fs_cijfer_domein',
      ctrlr: 'KTORatingsV1',
      filters: ['monthSelect'],
      args: ['fysiek_kto_score_totaal_cumul', 'fysiek_kto_score_totaal'],
      parameters: [
        [
          { label: 'Doorlopend', column: 'fysiek_kto_score_gemiddeld_cumul', colour: 'orange', table_label: 'Fysieke schade', table_header: 'cijfer' },
          { label: 'Maandcijfer', column: 'fysiek_kto_score_gemiddeld', colour: 'orange', table_label: 'Fysieke schade', table_header: 'cijfer' },
          { label: 'Respondenten doorlopend', column: 'fysiek_kto_score_totaal_cumul', colour: 'orange', table_label: 'Fysieke schade', table_header: 'respondenten' },
          { label: 'Respondenten', column: 'fysiek_kto_score_totaal', colour: 'orange', table_label: 'Fysieke schade', table_header: 'respondenten' },
        ],
        [
          { label: '1', column: 'fysiek_kto_score_1_aantal_cumul', colour: 'orange', excludeFromTable: true },
          { label: '2', column: 'fysiek_kto_score_2_aantal_cumul', colour: 'orange', excludeFromTable: true },
          { label: '3', column: 'fysiek_kto_score_3_aantal_cumul', colour: 'orange', excludeFromTable: true },
          { label: '4', column: 'fysiek_kto_score_4_aantal_cumul', colour: 'orange', excludeFromTable: true },
          { label: '5', column: 'fysiek_kto_score_5_aantal_cumul', colour: 'orange', excludeFromTable: true },
          { label: '6', column: 'fysiek_kto_score_6_aantal_cumul', colour: 'blue', excludeFromTable: true },
          { label: '7', column: 'fysiek_kto_score_7_aantal_cumul', colour: 'blue', excludeFromTable: true },
          { label: '8', column: 'fysiek_kto_score_8_aantal_cumul', colour: 'moss', excludeFromTable: true },
          { label: '9', column: 'fysiek_kto_score_9_aantal_cumul', colour: 'moss', excludeFromTable: true },
          { label: '10', column: 'fysiek_kto_score_10_aantal_cumul', colour: 'moss', excludeFromTable: true },
        ],
        [
          { label: '1', column: 'fysiek_kto_score_1_aantal', colour: 'orange', excludeFromTable: true },
          { label: '2', column: 'fysiek_kto_score_2_aantal', colour: 'orange', excludeFromTable: true },
          { label: '3', column: 'fysiek_kto_score_3_aantal', colour: 'orange', excludeFromTable: true },
          { label: '4', column: 'fysiek_kto_score_4_aantal', colour: 'orange', excludeFromTable: true },
          { label: '5', column: 'fysiek_kto_score_5_aantal', colour: 'orange', excludeFromTable: true },
          { label: '6', column: 'fysiek_kto_score_6_aantal', colour: 'blue', excludeFromTable: true },
          { label: '7', column: 'fysiek_kto_score_7_aantal', colour: 'blue', excludeFromTable: true },
          { label: '8', column: 'fysiek_kto_score_8_aantal', colour: 'moss', excludeFromTable: true },
          { label: '9', column: 'fysiek_kto_score_9_aantal', colour: 'moss', excludeFromTable: true },
          { label: '10', column: 'fysiek_kto_score_10_aantal', colour: 'moss', excludeFromTable: true },
        ],
      ],
      segment: { key: 'all', domein: 'fysiek', cumulative: true, periodization: 'monthly' },
    },
    {
      slug: 'domein_trend',
      ctrlr: 'KtoBarTrendV1',
      filters: [],
      args: [],
      parameters: [
        [{ label: 'Waardering', column: 'fysiek_kto_score_gemiddeld', units: 'waardering', colour: 'moss', format: 'decimals', excludeFromTable: true }],
      ],
      segment: { key: 'fysiek_kto_score_gemiddeld', domein: 'fysiek', cumulative: false, periodization: 'monthly' },
    },
  ],
  segment: { key: 'fysiek_kto_score_gemiddeld', domein: 'fysiek', cumulative: true, periodization: 'monthly' },
  functionality: ['table', 'definitions', 'download'],
  endpoints: [
    ...(['Totaal', 'FYSIEK', 'IMS', 'WDL'] as const).flatMap((d) => [
      ep(d, 'maand'),
      ep(d, 'week'),
    ]),
  ],
};

const PAGE_CONFIG: IPageConfig = buildPageConfig(
  'waardering',
  { key: 'fysiek_kto_score_gemiddeld', domein: 'fysiek', cumulative: true, periodization: 'monthly' },
  [GROUP_CONFIG],
);

// Values per domein so merged rows are distinguishable. Week rows carry the
// same numbers as the month rows of the same periode.
const DOMAIN_VALUES: Record<string, { cumul: number; cumulResp: number; inc: number; incResp: number }> = {
  Totaal: { cumul: 7.5, cumulResp: 4567, inc: 7.2, incResp: 120 },
  FYSIEK: { cumul: 7.6, cumulResp: 300, inc: 7.3, incResp: 30 },
  IMS: { cumul: 5.6, cumulResp: 200, inc: 5.4, incResp: 20 },
  WDL: { cumul: 5.9, cumulResp: 100, inc: 5.7, incResp: 10 },
};

const RAW_PAYLOADS: Record<string, any[]> = {};
for (const d of Object.keys(DOMAIN_VALUES)) {
  const v = DOMAIN_VALUES[d];
  RAW_PAYLOADS[ep(d, 'maand')] = [
    { periode: '2026_09', aggregatie: 'maand', kto_score_gemiddeld_cumul: v.cumul, kto_score_totaal_cumul: v.cumulResp, kto_score_gemiddeld: v.inc, kto_score_totaal: v.incResp, _yearmonth: '2026_09', _year: 2026, _month: 9 },
    { periode: '2026_08', aggregatie: 'maand', kto_score_gemiddeld_cumul: v.cumul - 0.1, kto_score_totaal_cumul: v.cumulResp - 5, kto_score_gemiddeld: v.inc - 0.1, kto_score_totaal: v.incResp - 5, _yearmonth: '2026_08', _year: 2026, _month: 8 },
  ];
  RAW_PAYLOADS[ep(d, 'week')] = [
    { periode: '2026_38', aggregatie: 'week', kto_score_gemiddeld_cumul: v.cumul, kto_score_totaal_cumul: v.cumulResp, kto_score_gemiddeld: v.inc, kto_score_totaal: v.incResp, _yearweek: '2026_38', _year: 2026, _week: 38 },
  ];
}

function buildAndPrepare(slug: string = 'waardering_regelingen') {
  const config = { ...GROUP_CONFIG, slug, ctrlr: 'DomainComparisonGroupV1' };
  initPageStore(PAGE_CONFIG);
  const page = fakePage(PAGE_CONFIG);
  const group = buildGroup(page, config, groups, 0);
  page.chartArray = [group];

  const data: Record<string, any[]> = {};
  for (const epKey of group.resolvedEndpoints) {
    const key = Object.keys(RAW_PAYLOADS).find((k) => epKey.includes(k));
    if (key) data[epKey] = RAW_PAYLOADS[key].map((r: any) => ({ ...r, _isNewApi: true }));
  }

  const result = group.ctrlr.prepareData(data);
  return { result, group, page };
}

describe('waardering_regelingen table mirrors all_waardering (symmetric cumul/inc)', () => {
  it('produces both tables for week and month, 8 columns each', () => {
    const { result } = buildAndPrepare();

    expect(result.weekTableInc).not.toBeNull();
    expect(result.monthTableInc).not.toBeNull();
    expect(result.weekTableCumul).not.toBeNull();
    expect(result.monthTableCumul).not.toBeNull();

    expect(result.monthTableCumul!.headers).toHaveLength(3 + 8);
    expect(result.monthTableInc!.headers).toHaveLength(3 + 8);
  });

  it('regular header repeats cijfer | respondenten per band', () => {
    const { result } = buildAndPrepare();
    const expected = [
      'Jaar', 'Maand', 'Periode',
      'cijfer', 'respondenten',
      'cijfer', 'respondenten',
      'cijfer', 'respondenten',
      'cijfer', 'respondenten',
    ];
    expect(result.monthTableCumul!.headers).toEqual(expected);
    expect(result.monthTableInc!.headers).toEqual(expected);
  });

  it('pre-header bands span Totaal + the 3 domeinen', () => {
    const { result } = buildAndPrepare();
    const expected = [
      { label: '', length: 3 },
      { label: 'Totaal', length: 2 },
      { label: 'Fysieke schade', length: 2 },
      { label: 'Immateriele schade', length: 2 },
      { label: 'Waardedaling', length: 2 },
    ];
    expect(result.monthTableCumul!.pre_headers).toEqual(expected);
    expect(result.monthTableInc!.pre_headers).toEqual(expected);
  });

  it('rows carry cumul + inc values for Totaal and every domein', () => {
    const { result } = buildAndPrepare();

    const cumulRows = result.monthTableCumul!.rows;
    expect(cumulRows).toHaveLength(2);
    expect(cumulRows[0]).toContain(4567); // totaal cumul respondenten
    expect(cumulRows[0]).toContain(7.5); // totaal cumul cijfer
    expect(cumulRows[0]).toContain(300); // fysiek cumul respondenten
    expect(cumulRows[0]).toContain(200); // ims cumul respondenten
    expect(cumulRows[0]).toContain(100); // wdl cumul respondenten

    const incRows = result.monthTableInc!.rows;
    expect(incRows[0]).toContain(120); // totaal inc respondenten
    expect(incRows[0]).toContain(7.2); // totaal inc cijfer
    expect(incRows[0]).toContain(30); // fysiek inc respondenten
    expect(incRows[0]).toContain(20); // ims inc respondenten
    expect(incRows[0]).toContain(10); // wdl inc respondenten
  });

  it('keeps the 1-10 score breakdown out of the table', () => {
    const { result } = buildAndPrepare();
    const joined = [...result.monthTableCumul!.headers, ...result.monthTableInc!.headers].join(' ');
    expect(joined).not.toContain('fysiek_kto_score_');
    expect(joined).not.toMatch(/\b[1-9]|10\b/);
  });

  it('other slugs keep the conventional split (no expansion)', () => {
    const { result } = buildAndPrepare('some_other_group');

    // No expansion: only the 4 fysiek-* table params remain — 2 per table
    // (cumul + inc) instead of 4 domeinen x 2 = 8, and a single Fysieke
    // schade band.
    expect(result.monthTableCumul!.headers).toHaveLength(3 + 2);
    expect(result.monthTableInc!.headers).toHaveLength(3 + 2);
    expect(result.monthTableCumul!.pre_headers).toEqual([
      { label: '', length: 3 },
      { label: 'Fysieke schade', length: 2 },
    ]);
  });
});
