// @vitest-environment jsdom
//
// Feature test: the group-level "regelingSelect" filter renders one option per
// compensated regeling and, on change, writes segment.regeling to every graph
// in the group whose config segment opts in via `regeling` (mw_cijfer_regeling
// + regeling_trend) — the mirror image of the group-level domeinSelect test.
//
// Example group: waardering → waardering_regelingsvarianten
// (RegelingComparisonGroupV1 merges per-regeling endpoints; group-level
// regelingSelect governs both graphs).
//
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  resetStore,
  initPageStore,
  buildGroup,
  fakePage,
  buildPageConfig,
} from './helpers/harness';
import { DefaultGroupV1 } from '../src/shared/default-group-v1';
import { HtmlGroupFilters } from '../src/widgets/html-group-filters';
import { getGraphSegment, updateGraphSegment } from '../src/stores/segment.store';
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
      slug: 'mw_cijfer_regeling',
      ctrlr: 'KTORatingsV1',
      args: [],
      filters: ['monthSelect'],
      parameters: [
        [{ label: 'Doorlopend', column: 'mw_kto_score_gemiddeld_cumul' }],
      ],
      segment: { key: 'all', regeling: 'mw', cumulative: true, periodization: 'monthly' },
    },
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

function renderGroupFilter(): { wrapper: HTMLElement; ctrlr: DefaultGroupV1 } {
  initPageStore(PAGE_CONFIG);
  const page = fakePage(PAGE_CONFIG);
  const group = buildGroup(page, GROUP_CONFIG, groups, 0);

  // HtmlGroupFilters.init() anchors the filter list after .source_attribution
  // inside this.ctrlr.groupWrapper, so give the controller a wrapper with one.
  const wrapper = document.createElement('div');
  const srcAttr = document.createElement('div');
  srcAttr.classList.add('source_attribution');
  wrapper.appendChild(srcAttr);
  document.body.appendChild(wrapper);

  (group.ctrlr as any).groupWrapper = wrapper;
  const filters = new HtmlGroupFilters(group.ctrlr);
  filters.draw(group.ctrlr.segment);

  return { wrapper, ctrlr: group.ctrlr };
}

describe('group-level regelingSelect filter', () => {
  it('renders one option per compensated regeling and preselects the config regeling', () => {
    const { wrapper } = renderGroupFilter();

    const select = wrapper.querySelector(
      '#waardering_regelingsvarianten_regeling_0',
    ) as HTMLSelectElement;

    expect(select).not.toBeNull();
    expect(Array.from(select.options).map((o) => o.value)).toEqual([
      'mw',
      'vv',
      'ims',
      'imk',
      'wd',
    ]);
    expect(select.value).toBe('mw');
  });

  it('updates every opted-in graph and preserves orthogonal segment fields', () => {
    const { wrapper, ctrlr } = renderGroupFilter();
    const updateSpy = vi.spyOn(ctrlr, 'update');

    const select = wrapper.querySelector(
      '#waardering_regelingsvarianten_regeling_0',
    ) as HTMLSelectElement;
    select.value = 'ims';
    select.dispatchEvent(new Event('change'));

    expect(
      getGraphSegment('waardering_regelingsvarianten', 'mw_cijfer_regeling')
        ?.regeling,
    ).toBe('ims');
    expect(
      getGraphSegment('waardering_regelingsvarianten', 'regeling_trend')
        ?.regeling,
    ).toBe('ims');

    // Orthogonal fields survive (composes with graph-level monthSelect).
    expect(
      getGraphSegment('waardering_regelingsvarianten', 'mw_cijfer_regeling')
        ?.key,
    ).toBe('all');
    expect(
      getGraphSegment('waardering_regelingsvarianten', 'regeling_trend')?.key,
    ).toBe('mw_kto_score_gemiddeld');
    expect(updateSpy).toHaveBeenCalled();
  });

  it('writes segment.regeling to the graph the selector governs', () => {
    const { wrapper } = renderGroupFilter();
    const select = wrapper.querySelector(
      '#waardering_regelingsvarianten_regeling_0',
    ) as HTMLSelectElement;
    select.value = 'wd';
    select.dispatchEvent(new Event('change'));

    // The KtoBarTrendV1 trend resolves its authored mw_* column against
    // the updated segment.regeling (covered in group-regeling-bar-trend.test.ts
    // via prepareData).
    expect(
      getGraphSegment('waardering_regelingsvarianten', 'regeling_trend')
        ?.regeling,
    ).toBe('wd');
  });
});
