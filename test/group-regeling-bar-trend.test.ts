// @vitest-environment jsdom
//
// KtoBarTrendV1 — the single controller shared by the domein- and
// regeling-comparison groups. It resolves an authored mw_* column against
// segment.regeling (fed by the group-level regelingSelect) and draws from the
// merged month data of a RegelingComparisonGroupV1, exactly like the domein
// variant.
//
import { describe, it, expect, beforeEach } from 'vitest';
import {
  resetStore,
  initPageStore,
  buildGroup,
  fakePage,
  buildPageConfig,
} from './helpers/harness';
import { DefaultGroupV1 } from '../src/shared/default-group-v1';
import { KtoBarTrendV1 } from '../src/pages/waardering/graphs/kto-bar-trend-v1';
import { updateGraphSegment } from '../src/stores/segment.store';
import type { IPageConfig, IGroupMappingV2 } from '../src/shared/interfaces';

const groups: Record<string, new (...args: any[]) => any> = { DefaultGroupV1 };

// Mirrors group "waardering_regelingsvarianten" in
// src/pages/waardering/config.ts (parameters authored for default regeling mw).
const GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'waardering_regelingsvarianten',
  ctrlr: 'DefaultGroupV1',
  filters: ['regelingSelect'],
  graphs: [
    {
      slug: 'regeling_trend',
      ctrlr: 'KtoBarTrendV1',
      args: [],
      filters: [],
      parameters: [
        [{ label: 'Waardering', column: 'mw_kto_score_gemiddeld', format: 'decimals' }],
      ],
      segment: { key: 'mw_kto_score_gemiddeld', regeling: 'mw', cumulative: false, periodization: 'monthly' },
    },
  ],
  segment: { key: 'mw_kto_score_gemiddeld', regeling: 'mw', cumulative: true, periodization: 'monthly' },
  functionality: [],
  endpoints: [],
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

describe('KtoBarTrendV1', () => {
  it('resolves the authored mw_* column against segment.regeling (month data)', () => {
    initPageStore(PAGE_CONFIG);
    const page = fakePage(PAGE_CONFIG);
    const group = buildGroup(page, GROUP_CONFIG, groups, 0);

    // Merged month rows as RegelingComparisonGroupV1 would produce them: every
    // period carries per-regeling prefixed columns. No graphDataWeek on
    // purpose — the variant must read graphDataMonth.
    group.data = {
      graphDataMonth: [
        {
          _year: 2025,
          _month: 3,
          _yearmonth: '2025_03',
          mw_kto_score_gemiddeld: 7.2,
          vv_kto_score_gemiddeld: 6.1,
        },
        {
          _year: 2025,
          _month: 2,
          _yearmonth: '2025_02',
          mw_kto_score_gemiddeld: 7.5,
          vv_kto_score_gemiddeld: 6.0,
        },
      ],
    };

    updateGraphSegment('waardering_regelingsvarianten', 'regeling_trend', {
      regeling: 'vv',
    });

    const trend = new KtoBarTrendV1(
      'regeling_trend',
      page,
      group,
      group.data,
      GROUP_CONFIG.graphs[0].parameters,
      [],
      [],
      0,
    );

    const out = trend.prepareData(group.data);

    // Bars are stored under the authored key but read from the vv_* source.
    expect(out['mw_kto_score_gemiddeld'].map((b: any) => b.value)).toEqual([
      6.1,
      6.0,
    ]);
  });
});
