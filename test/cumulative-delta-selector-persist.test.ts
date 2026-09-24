// @vitest-environment jsdom
//
// Regression test for the cumulativeVsDelta filter disappearing on cold first
// load of the regelingen page.
//
// Root cause (reproduced): the `<select id="all_total_numbers_0">` was rendered
// inside the graph's own <section> (graphEl). GraphControllerV3._html()
// (non-multiple branch) hosted HtmlFilters inside graphEl, and then
// NumbersMultiplesV1.init() -> HtmlNumberSimple.draw() ran `element.innerHTML
// = ""` on that same graphEl, wiping the just-rendered filter.
//
// Two fixes are covered here:
//   * OPTION 1 — host the filter in the graph *wrapper* (graphEl.parentElement)
//     on the non-multiple branch, so the number renderer's innerHTML="" can
//     never wipe it (asserted by the "cold path" test below).
//   * OPTION 3 — prepareMultiples splits deterministically whenever the
//     `multiples` field is declared, regardless of data readiness, so the graph
//     always takes the multiples path on cold and warm loads and never throws on
//     an empty / not-yet-loaded payload (asserted by the "cold empty data" test).
//
import { describe, it, expect, beforeEach } from 'vitest';
import { resetStore, initPageStore, buildGroup, fakePage, fixtureData, buildPageConfig } from './helpers/harness';
import { DefaultGroupV1 } from '../src/shared/default-group-v1';
import { NumbersMultiplesV1 } from '../src/charts/controllers/numbers-multiples-v1';
import PageController from '../src/shared/page.controller';
import type { IPageConfig, IGroupMappingV2, GroupObject } from '../src/shared/interfaces';
import type { IPageController } from '../src/shared/page.controller';
import * as weekRaw from './fixtures/regelingen/all_totals/week.json';
import * as monthRaw from './fixtures/regelingen/all_totals/month.json';

const groups: Record<string, new (...args: any[]) => any> = { DefaultGroupV1 };
// Graph registry, the way PageController.init passes it to prepareMultiples.
const graphClasses: Record<string, new (...args: any[]) => any> = {
  NumbersMultiplesV1,
};

beforeEach(() => {
  resetStore();
});

// ---------------------------------------------------------------------------
// Config — mirrors src/pages/regelingen/config.ts "all_totals" group, whose
// graph declares multiples: "cumulative" and filters: ["cumulativeVsDelta"].
// ---------------------------------------------------------------------------
const GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'all_totals',
  ctrlr: 'DefaultGroupV1',
  filters: [],
  graphs: [
    {
      slug: 'all_total_numbers',
      ctrlr: 'NumbersMultiplesV1',
      args: [],
      filters: ['cumulativeVsDelta'],
      multiples: 'cumulative',
      parameters: [
        [
          { label: 'Aanvragen', column: 'ingediend', colour: 'orange', units: 'aanvragen', modifiers: { cumul: '_cumul', delta: '_aantal' } },
          { label: 'Afgehandeld', column: 'afgerond', colour: 'moss', units: 'afgehandeld', modifiers: { cumul: '_cumul', delta: '_aantal' } },
          { label: 'Uitbetaald', column: 'bedrag_betaald_totaal', colour: 'blue', format: 'currency', units: 'totaal uitbetaalde bedrag', modifiers: { cumul: '_cumul_eur', delta: '_eur' } },
        ],
        [],
      ],
      segment: { key: 'ingediend', cumulative: true, periodization: 'weekly' },
    },
  ],
  segment: { key: 'ingediend', cumulative: true, periodization: 'weekly' },
  functionality: ['table', 'definitions', 'download'],
  endpoints: [],
};

const PAGE_CONFIG: IPageConfig = buildPageConfig(
  'regelingen',
  { key: 'ingediend', cumulative: true, periodization: 'weekly' },
  [GROUP_CONFIG],
  [
    'regelingen?aggregatie=eq.week&domein_code=eq.Totaal&regeling_code=eq.Totaal&order=periode.desc&periode_vanaf=gte.{VANAF}',
    'regelingen?aggregatie=eq.maand&domein_code=eq.Totaal&regeling_code=eq.Totaal&order=periode.desc',
  ],
);

const RAW_PAYLOADS: Record<string, any[]> = {
  'aggregatie=eq.week': (weekRaw as any).default ?? weekRaw as any,
  'aggregatie=eq.maand': (monthRaw as any).default ?? monthRaw as any,
};

// ---------------------------------------------------------------------------
// Helpers — construct the group the way PageController does, then mount its
// graphWrapper into a connected tree so document.getElementById resolves the
// select the way it does in production.
// ---------------------------------------------------------------------------
function buildColdGroup(): { group: GroupObject; page: IPageController } {
  initPageStore(PAGE_CONFIG);
  const page = fakePage(PAGE_CONFIG);
  const group = buildGroup(page, GROUP_CONFIG, groups, 0);
  page.chartArray = [group];
  return { group, page };
}

/**
 * Populate group.graphs the way PageController.init does (lines ~135-165): one
 * entry per declared graph, carrying `multiples`, `ctrlrName`, params and a
 * real controller. buildGroup only sets up the group shell (graphs: []).
 */
function populateGraphs(group: GroupObject, page: IPageController) {
  const graphConfig = GROUP_CONFIG.graphs[0];
  group.graphs.push({
    slug: graphConfig.slug,
    multiples: graphConfig.multiples ?? false,
    ctrlrName: graphConfig.ctrlr!,
    header: graphConfig.header ?? undefined,
    parameters: graphConfig.parameters,
    modifiers: graphConfig.modifiers,
    filters: graphConfig.filters,
    segment: graphConfig.segment,
    classList: graphConfig.classList || [],
    ctrlr: new NumbersMultiplesV1(
      graphConfig.slug,
      page,
      group,
      group.data,
      graphConfig.parameters,
      graphConfig.modifiers ?? [],
      graphConfig.filters ?? [],
      0,
    ),
  });
}

/** Mount the group's graphWrapper and point group.element at it (mirrors
 *  PageController.init: `g.element = g.ctrlr.html()`). */
function mountGraphWrapper(group: GroupObject, page: IPageController) {
  document.body.appendChild(page.main.htmlContainer);
  group.ctrlr.html();
  group.element = group.ctrlr.graphWrapper;
}

/**
 * Construct a NumbersMultiplesV1 the way PageController does and run the full
 * html() -> init() lifecycle. `slug` selects which branch GraphControllerV3._html()
 * takes: the non-multiple (cold) branch for the plain slug, the multiples branch
 * for a "_multN" slug.
 */
async function buildAndInitGraph(
  group: GroupObject,
  page: IPageController,
  slug: string,
  index: number,
) {
  const graph = new NumbersMultiplesV1(
    slug,
    page,
    group,
    group.data,
    GROUP_CONFIG.graphs[0].parameters,
    GROUP_CONFIG.graphs[0].modifiers ?? [],
    GROUP_CONFIG.graphs[0].filters ?? [],
    index,
  );
  graph.html();
  await graph.init();
  return graph;
}

// ---------------------------------------------------------------------------
// COLD PATH — non-multiple branch (OPTION 1)
//
// On a cold first load the graph stays a single, non-multiple `all_total_numbers`
// (in the pre-fix code because data.cumulative isn't ready). The filter was
// hosted inside graphEl and HtmlNumberSimple's innerHTML="" wiped it. With the
// filter hosted in the graph wrapper, the select must survive full init().
// ---------------------------------------------------------------------------
describe('cumulativeVsDelta select persists after init on the COLD (non-multiple) path', () => {
  it('select #all_total_numbers_0 is present after html() + init()', async () => {
    const { group, page } = buildColdGroup();

    // Give the group prepared data (the graph itself is forced onto the
    // non-multiple branch via the plain slug, which is what the buggy cold
    // load produced).
    const data = fixtureData(RAW_PAYLOADS, group.resolvedEndpoints);
    group.data = group.ctrlr.prepareData(data);

    mountGraphWrapper(group, page);
    await buildAndInitGraph(group, page, 'all_total_numbers', 0);

    const select = document.getElementById('all_total_numbers_0') as HTMLSelectElement | null;
    expect(select).not.toBeNull();
    expect(select!.tagName.toLowerCase()).toBe('select');

    // The filter wrapper must live OUTSIDE the graph's own section (the number
    // renderer owns that section's innerHTML and clears it).
    const graphSection = group.element.querySelector('section.graph-view.all_total_numbers');
    expect(graphSection).not.toBeNull();
    expect(graphSection!.querySelector('.filter_list_all_total_numbers')).toBeNull();
  });

  it('number value is rendered inside the graph section (renderer still works)', async () => {
    const { group, page } = buildColdGroup();
    const data = fixtureData(RAW_PAYLOADS, group.resolvedEndpoints);
    group.data = group.ctrlr.prepareData(data);

    mountGraphWrapper(group, page);
    await buildAndInitGraph(group, page, 'all_total_numbers', 0);

    const graphSection = group.element.querySelector('section.graph-view.all_total_numbers');
    expect(graphSection!.querySelector('.number.accented')).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// WARM PATH — multiples branch (unchanged behaviour, guarded)
// ---------------------------------------------------------------------------
describe('cumulativeVsDelta select on the WARM (multiples) path', () => {
  it('master multiple (all_total_numbers_mult0) renders #all_total_numbers_0 after init', async () => {
    const { group, page } = buildColdGroup();
    populateGraphs(group, page);

    // Warm store: cumulative defined -> multiples split. Set the graph registry
    // so the real prepareMultiples can construct the multiples controllers.
    (page as any).graphs = graphClasses;
    const data = fixtureData(RAW_PAYLOADS, group.resolvedEndpoints);
    group.data = group.ctrlr.prepareData(data);
    // Drive the real prepareMultiples implementation (fakePage only stubs
    // surface methods, so bind the real PageController prototype method).
    PageController.prototype.prepareMultiples.call(page);

    expect(group.graphs.length).toBe(3);
    expect(group.graphs[0].slug).toBe('all_total_numbers_mult0');
    expect(group.graphs[0].ctrlr).toBeInstanceOf(NumbersMultiplesV1);

    mountGraphWrapper(group, page);

    // The multiples controllers were built by prepareMultiples with group.element
    // as their host — run the full lifecycle on the master.
    const master = group.graphs[0].ctrlr;
    master.html();
    await master.init();

    const select = document.getElementById('all_total_numbers_0') as HTMLSelectElement | null;
    expect(select).not.toBeNull();
    expect(select!.tagName.toLowerCase()).toBe('select');
  });
});

// ---------------------------------------------------------------------------
// OPTION 3 — deterministic multiples split, robust to empty / not-yet-loaded data
// ---------------------------------------------------------------------------
describe('prepareMultiples is deterministic and empty-data safe (OPTION 3)', () => {
  it('splits into multiples even when group.data is empty (cold first load)', () => {
    const { group, page } = buildColdGroup();
    populateGraphs(group, page);
    (page as any).graphs = graphClasses;

    // Cold load: no week/month data has been fetched yet -> group.data = {}.
    // Pre-fix this left the graph as a single non-multiple (data.cumulative
    // undefined); post-fix it must still deterministically take the multiples
    // path, one multiple per declared parameter, and never throw.
    group.data = {};
    expect(() => PageController.prototype.prepareMultiples.call(page)).not.toThrow();

    expect(group.graphs.length).toBe(3);
    group.graphs.forEach((g: any, i: number) => {
      expect(g.slug).toBe(`all_total_numbers_mult${i}`);
    });
  });

  it('does not throw when the week payload is empty (incVsCum guard)', () => {
    const { group, page } = buildColdGroup();
    populateGraphs(group, page);
    (page as any).graphs = graphClasses;

    // Empty raw payload -> prepareData must not crash reading data[0].
    const emptyPayloads: Record<string, any[]> = {
      'aggregatie=eq.week': [],
      'aggregatie=eq.maand': [],
    };
    const data = fixtureData(emptyPayloads, group.resolvedEndpoints);
    let result: any;
    expect(() => { result = group.ctrlr.prepareData(data); }).not.toThrow();

    // cumulative/incremental are empty arrays, not a crash — safe to seed the
    // multiples split.
    expect(Array.isArray(result.cumulative)).toBe(true);
    expect(result.cumulative).toHaveLength(0);
    expect(Array.isArray(result.incremental)).toBe(true);

    group.data = result;
    expect(() => PageController.prototype.prepareMultiples.call(page)).not.toThrow();
    expect(group.graphs.length).toBe(3);
  });
});
