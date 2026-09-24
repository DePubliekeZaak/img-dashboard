// @vitest-environment jsdom
//
// Regression test: a graph's filter must render directly ABOVE ITS OWN graph
// section, not hoisted to the top of the shared group wrapper.
//
// Bug (topic=gemeente): GraphControllerV3._html passed the shared group wrapper
// (graphEl.parentElement) as the filter host and HtmlFilters.init did
// `element.prepend(container)`. Each later graph's filter was injected as the
// FIRST child of the wrapper, so in a group with two graphs that each declare
// filters, the SECOND graph's filter ended up rendered ABOVE the FIRST graph.
//
// Fix: the filter wrapper is now anchored immediately BEFORE the graph's own
// <section> (its own graph element), so each filter sits above the graph it
// controls and ordering no longer depends on other graphs in the group.
//
// This test constructs two master graphs in one group — both declaring filters
// — and asserts the second graph's filter is positioned directly above the
// second graph (and after the first graph), which fails on the pre-fix code.
//
import { describe, it, expect, beforeEach } from 'vitest';
import { resetStore, buildGroup, fakePage, buildPageConfig } from './helpers/harness';
import { DefaultGroupV1 } from '../src/shared/default-group-v1';
import { GraphControllerV3 } from '../src/charts/core/graph-v3';
import type { IPageConfig, IGroupMappingV2, GroupObject } from '../src/shared/interfaces';
import type { IPageController } from '../src/shared/page.controller';

const groups: Record<string, new (...args: any[]) => any> = { DefaultGroupV1 };

// Two master graphs in the SAME group, both declaring filters — the exact
// shape that triggers the bug (mirrors the gemeente RegelingComparisonGroupV1
// groups: a numbers graph + a trend graph).
const GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'gemeenten_test',
  ctrlr: 'DefaultGroupV1',
  filters: [],
  graphs: [
    {
      slug: 'gemeente_numbers',
      ctrlr: 'NumbersMultiplesV1',
      args: [],
      filters: ['cumulativeVsDelta'],
      parameters: [[]],
    },
    {
      slug: 'gemeente_trend',
      ctrlr: 'BarTrendV1',
      args: [],
      filters: ['parameterSelect', 'cumulativeVsDelta'],
      parameters: [[]],
    },
  ],
  segment: { key: 'ingediend', cumulative: true, periodization: 'weekly' },
  functionality: [],
  endpoints: [],
};

const PAGE_CONFIG: IPageConfig = buildPageConfig(
  'gemeente',
  { key: 'ingediend', cumulative: true, periodization: 'weekly' },
  [GROUP_CONFIG],
);

beforeEach(() => {
  resetStore();
  document.body.innerHTML = '';
});

/**
 * Mirror the way PageController renders each graph: group.graphs in config
 * order, each graph's ctrlr.html() appends its section to the shared group
 * wrapper and (when it declares filters) anchors a filter wrapper to it.
 */
function renderGroup(): {
  group: GroupObject;
  page: IPageController;
  wrapper: HTMLElement;
} {
  const page = fakePage(PAGE_CONFIG);
  const group = buildGroup(page, GROUP_CONFIG, groups, 0);
  // group.element is the shared wrapper that graph sections are appended to.
  document.body.appendChild(group.element);
  const wrapper = group.element;

  // Render graph 1 (numbers) then graph 2 (trend), both with filters.
  const g1 = new GraphControllerV3(
    'gemeente_numbers',
    page,
    group,
    group.data,
    [[]],
    [],
    ['cumulativeVsDelta'],
    0,
  );
  g1._html();

  const g2 = new GraphControllerV3(
    'gemeente_trend',
    page,
    group,
    group.data,
    [[]],
    [],
    ['parameterSelect', 'cumulativeVsDelta'],
    1,
  );
  g2._html();

  return { group, page, wrapper };
}

describe('graph filters anchor to their own graph section', () => {
  it('renders each graph’s filter immediately above its OWN graph, not above a sibling graph', () => {
    const { wrapper } = renderGroup();

    const children = Array.from(wrapper.children) as HTMLElement[];

    const indexOfGraph = (slug: string) =>
      children.findIndex((el) => el.classList.contains(slug));
    const indexOfFilter = (slug: string) =>
      children.findIndex((el) => !!el.querySelector(`.filter_list_${slug}`));

    const numGraph = indexOfGraph('gemeente_numbers');
    const numFilter = indexOfFilter('gemeente_numbers');
    const trendGraph = indexOfGraph('gemeente_trend');
    const trendFilter = indexOfFilter('gemeente_trend');

    // Both graphs and both filters must be present.
    expect(numGraph).toBeGreaterThanOrEqual(0);
    expect(numFilter).toBeGreaterThanOrEqual(0);
    expect(trendGraph).toBeGreaterThanOrEqual(0);
    expect(trendFilter).toBeGreaterThanOrEqual(0);

    // Each filter is the immediate predecessor of its own graph section.
    expect(numFilter + 1).toBe(numGraph);
    expect(trendFilter + 1).toBe(trendGraph);

    // The 2nd graph's filter is NOT above the 1st graph: it sits after the
    // 1st graph (and after its own graph's position is reserved).
    expect(trendFilter).toBeGreaterThan(numGraph);
    // And it precedes its own graph.
    expect(trendFilter).toBeLessThan(trendGraph);

    // Full expected layout: [numFilter, numGraph, trendFilter, trendGraph].
    expect([numFilter, numGraph, trendFilter, trendGraph]).toEqual([
      0, 1, 2, 3,
    ]);
  });

  it('keeps a single shared filter for multiple variants of one graph (mult1 does not duplicate)', () => {
    // _mult0 and _mult1 share ONE filter placed above the _mult0 graph.
    const page = fakePage(PAGE_CONFIG);
    const group = buildGroup(page, GROUP_CONFIG, groups, 0);
    document.body.appendChild(group.element);
    const wrapper = group.element;

    const mult0 = new GraphControllerV3(
      'gemeente_numbers_mult0',
      page,
      group,
      group.data,
      [[]],
      [],
      ['cumulativeVsDelta'],
      0,
    );
    mult0._html();

    // _mult1 reuses the master's filter; it must NOT emit a second copy.
    const mult1 = new GraphControllerV3(
      'gemeente_numbers_mult1',
      page,
      group,
      group.data,
      [[]],
      [],
      ['cumulativeVsDelta'],
      1,
    );
    mult1._html();

    const children = Array.from(wrapper.children) as HTMLElement[];
    const filters = children.filter((el) =>
      el.querySelector('.filter_list_gemeente_numbers'),
    );

    // Exactly ONE filter wrapper for the whole multiples family.
    expect(filters.length).toBe(1);

    // It is anchored directly above the _mult0 graph section.
    const filterIndex = children.indexOf(filters[0]);
    const mult0Index = children.findIndex((el) =>
      el.classList.contains('gemeente_numbers_mult0'),
    );
    expect(filterIndex + 1).toBe(mult0Index);
  });
});
