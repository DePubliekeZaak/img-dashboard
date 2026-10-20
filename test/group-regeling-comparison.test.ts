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
