// @vitest-environment jsdom
//
// Regression test: the graph-level "monthSelect" filter renders its dropdown
// and updates the graph segment ("all" → cumulative, a specific month →
// non-cumulative).
//
// Bug: the `monthSelect` case was dropped from HtmlFilters.draw() during the
// "using stores" refactor (commit d76fcf5), so a graph declaring
// filters: ["monthSelect"] — e.g. waardering → fs_cijfer (KTORatingsV1) —
// rendered NO dropdown at all. The HtmlMonthSelector import survived as dead
// code. This test drives the real GraphControllerV3._html() → HtmlFilters
// wiring and asserts the select appears and mutates the graph segment store.
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
import { GraphControllerV3 } from '../src/charts/core/graph-v3';
import { getGraphSegment } from '../src/stores/segment.store';
import type { IPageConfig, IGroupMappingV2 } from '../src/shared/interfaces';

const groups: Record<string, new (...args: any[]) => any> = { DefaultGroupV1 };

// Mirrors src/pages/waardering/config.ts → group "waardering_fs" → graph
// "fs_cijfer", which declares filters: ["monthSelect"].
const GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'waardering_fs',
  ctrlr: 'DefaultGroupV1',
  filters: [],
  graphs: [
    {
      slug: 'fs_cijfer',
      ctrlr: 'KTORatingsV1',
      args: [],
      filters: ['monthSelect'],
      parameters: [
        [{ label: 'Doorlopend', column: 'kto_score_gemiddeld_cumul', colour: 'orange' }],
        [{ label: '1', column: 'kto_score_1_aantal_cumul', colour: 'orange' }],
        [{ label: '1', column: 'kto_score_1_aantal', colour: 'orange' }],
      ],
      segment: { key: 'all', cumulative: true, periodization: 'monthly' },
    },
  ],
  segment: { key: 'all', cumulative: true, periodization: 'monthly' },
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

function renderFilter(): {
  wrapper: HTMLElement;
  ctrlr: GraphControllerV3;
} {
  initPageStore(PAGE_CONFIG);
  const page = fakePage(PAGE_CONFIG);
  const group = buildGroup(page, GROUP_CONFIG, groups, 0);

  // Populate the month data the dropdown lists. In production this is set by
  // GroupControllerV1.prepareData() from the maand-aggregated endpoint before
  // initGraphs() → graph.ctrlr.html() → HtmlFilters.draw() runs.
  group.data = {
    graphDataMonth: [
      { _month: 3, _year: 2025, _yearmonth: '2025_03' },
      { _month: 2, _year: 2025, _yearmonth: '2025_02' },
    ],
  };

  document.body.appendChild(group.element);
  const wrapper = group.element;

  const ctrlr = new GraphControllerV3(
    'fs_cijfer',
    page,
    group,
    group.data,
    GROUP_CONFIG.graphs[0].parameters,
    [],
    ['monthSelect'],
    0,
  );
  ctrlr._html();

  return { wrapper, ctrlr };
}

describe('graph-level monthSelect filter', () => {
  it('renders a "Doorlopend" option plus one option per month', () => {
    const { wrapper } = renderFilter();

    const select = wrapper.querySelector(
      '.filter_list_fs_cijfer select',
    ) as HTMLSelectElement;

    expect(select).not.toBeNull();
    expect(Array.from(select.options).map((o) => o.value)).toEqual([
      'all',
      '2025_03',
      '2025_02',
    ]);
  });

  it('preselects the current graph segment (initially "all")', () => {
    const { wrapper } = renderFilter();

    const select = wrapper.querySelector(
      '.filter_list_fs_cijfer select',
    ) as HTMLSelectElement;

    expect(select.value).toBe('all');
  });

  it('selecting a specific month sets key + cumulative=false on the graph segment', () => {
    const { wrapper, ctrlr } = renderFilter();
    const select = wrapper.querySelector(
      '.filter_list_fs_cijfer select',
    ) as HTMLSelectElement;
    const updateSpy = vi.spyOn(ctrlr, 'update');

    select.value = '2025_02';
    select.dispatchEvent(new Event('change'));

    const seg = getGraphSegment('waardering_fs', 'fs_cijfer');
    expect(seg?.key).toBe('2025_02');
    expect(seg?.cumulative).toBe(false);
    expect(updateSpy).toHaveBeenCalledWith(expect.anything(), true);
  });

  it('selecting "Doorlopend" back returns key=all + cumulative=true', () => {
    const { wrapper } = renderFilter();
    const select = wrapper.querySelector(
      '.filter_list_fs_cijfer select',
    ) as HTMLSelectElement;

    select.value = '2025_03';
    select.dispatchEvent(new Event('change'));
    expect(getGraphSegment('waardering_fs', 'fs_cijfer')?.key).toBe('2025_03');

    select.value = 'all';
    select.dispatchEvent(new Event('change'));

    const seg = getGraphSegment('waardering_fs', 'fs_cijfer');
    expect(seg?.key).toBe('all');
    expect(seg?.cumulative).toBe(true);
  });
});
