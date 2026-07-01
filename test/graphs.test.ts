// @vitest-environment jsdom
//
// Layer 2 graph-controller tests — per-graph render contract.
// Two tiers:
//   Tier A (numbers family): NumbersV1, plain DOM, no SVG
//   Tier B (SVG family): BarTrendV1, scales, axes, tooltips
//
// Pilot phase: one class per tier. Do NOT start all ~21 classes at once.
//
import { describe, it, expect, beforeEach } from 'vitest';
import { resetStore, initPageStore, buildGroup, fakePage, fixtureData, buildPageConfig, buildGraph, mountGroup } from './helpers/harness';
import { DefaultGroupV1 } from '../src/shared/default-group-v1';
import { KTOGroupV1 } from '../src/shared/kto-group-v1';
import { DomainComparisonGroupV1 } from '../src/pages/regelingen/groups/domain-comparison-group';
import { NumbersV1 } from '../src/charts/controllers/numbers-v1';
import { BarTrendV1 } from '../src/charts/controllers/bar-trend-v1';
import { NumbersPlusRespondentsV1 } from '../src/charts/controllers/numbers-respondents-v1';
import { BarTrendKTOV1 } from '../src/charts/controllers/bar-trend-kto-v1';
import { BarTrendStackedMakeup } from '../src/charts/controllers/bar-trend-stacked-makeup';
import { NumbersMultiplesV1 } from '../src/charts/controllers/numbers-multiples-v1';
import { BarTrendBedragenV1 } from '../src/charts/controllers/bar-trend-bedragen-v1';
import { SegmentsV1 } from '../src/charts/controllers/segments-v1';
import { PieChartSumV1 } from '../src/charts/controllers/pie-chart-sum-v1';
import type { IPageConfig, IGroupMappingV2, IParameterMapping } from '../src/shared/interfaces';

// Pin innerWidth so layout branching doesn't differ between machines
Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });

beforeEach(() => {
  resetStore();
});

// Register what the group layer knows
const groups: Record<string, new (...args: any[]) => any> = { DefaultGroupV1, KTOGroupV1, DomainComparisonGroupV1 };

// =============================================================================
// Anchor values — picked from the first period (most recent) of the
// regelingen all_waardering fixture (week: 2026_25).
// =============================================================================
const ANCHOR = {
  ingediend_aantal: 1299,
  ingediend_cumul: 713197,
  afgerond_aantal: 1728,
  afgerond_cumul: 687342,
  periode: '2026_25',
};

// =============================================================================
// Shared config
// =============================================================================

const BASE_ENDPOINTS = [
  'regelingen?aggregatie=eq.week&domein_code=eq.Totaal&regeling_code=eq.Totaal&order=periode.desc&periode_vanaf=gte.{VANAF}',
  'regelingen?aggregatie=eq.maand&domein_code=eq.Totaal&regeling_code=eq.Totaal&order=periode.desc',
];

// =============================================================================
// BarTrendV1 graph config
// =============================================================================

const BARTREND_GRAPH_CONF = {
  slug: 'test_trend',
  ctrlr: 'BarTrendV1',
  args: [],
  filters: [],
  parameters: [
    [
      { label: 'Ingediend', column: 'ingediend', colour: 'orange', units: 'ingediend',
        modifiers: { cumul: '_cumul', delta: '_aantal' } } as any,
    ] as any,
    [] as any,
  ] as any,
  segment: { key: 'ingediend', cumulative: true, periodization: 'weekly' },
};

const BARTREND_GROUP_CONF: IGroupMappingV2 = {
  slug: 'test_trend_group',
  ctrlr: 'DefaultGroupV1',
  filters: [],
  graphs: [BARTREND_GRAPH_CONF as any],
  segment: { key: 'ingediend', cumulative: true, periodization: 'weekly' },
  functionality: ['table', 'definitions', 'download'],
  endpoints: BASE_ENDPOINTS,
};

const BARTREND_PAGE_CONF: IPageConfig = buildPageConfig(
  'regelingen',
  { key: 'ingediend', cumulative: true, periodization: 'weekly' },
  [BARTREND_GROUP_CONF],
);

// =============================================================================
// Tier B — BarTrendV1 tests
// =============================================================================

describe('BarTrendV1 (Tier B)', () => {
  async function buildBarTrendGraph() {
    initPageStore(BARTREND_PAGE_CONF);
    const page = fakePage(BARTREND_PAGE_CONF);
    const group = buildGroup(page, BARTREND_GROUP_CONF, groups, 0);
    page.chartArray = [group];

    const rawPayloads = await loadFixtures();
    const mappedData = fixtureData(rawPayloads, group.resolvedEndpoints);
    group.data = { ...group.data, ...mappedData };

    const processed = group.ctrlr.prepareData(group.data);
    group.data = { ...group.data, ...processed };

    pushGraphStub(group, 'test_trend', BARTREND_GRAPH_CONF.parameters);

    const graph = buildGraph(
      BarTrendV1, page, group,
      { slug: 'test_trend', parameters: BARTREND_GRAPH_CONF.parameters, modifiers: [], filters: [] },
      0,
    ) as BarTrendV1;
    group.graphs[0].ctrlr = graph;

    mountGroup(group);

    return { page, group, graph };
  }

  it('html() is sync, init() is async — confirms render sequence', async () => {
    const { group, graph } = await buildBarTrendGraph();

    graph.html();
    expect(graph.scrollingContainer).toBeDefined();

    await graph.init();
    // After init, SVG should be present
    const svg = group.element.querySelector('svg');
    expect(svg).toBeDefined();
  });

  it('renders bars matching data length and axes exist', async () => {
    const { group, graph } = await buildBarTrendGraph();

    graph.html();
    await graph.init();

    // Assert axes groups exist
    const svg = group.element.querySelector('svg')!;
    const axesGroup = svg.querySelector('.axes');
    expect(axesGroup).toBeDefined();

    // x-axis and y-axis groups
    const xAxis = svg.querySelector('.x-axis');
    const yAxis = svg.querySelector('.y-axis');
    expect(xAxis).toBeDefined();
    expect(yAxis).toBeDefined();

    // Count bars
    const bars = group.element.querySelectorAll('rect.bar');
    // Should match the number of week data rows
    const column = 'ingediend_cumul';
    const trendData = (graph as any).preparedData?.[column];
    expect(bars.length).toBeGreaterThan(0);
    if (trendData) {
      expect(bars.length).toBe(trendData.length);
    }
  });

  it('dispatching mouseover on a bar sets tooltip content', async () => {
    const { group, graph } = await buildBarTrendGraph();

    graph.html();
    await graph.init();

    const bar = group.element.querySelector('rect.bar');
    expect(bar).toBeDefined();

    // Dispatch mouseover
    bar!.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    // Tooltip should exist and contain formatted value
    const tooltip = document.querySelector('.tooltip');
    expect(tooltip).toBeDefined();
    expect(tooltip?.innerHTML).toContain('713.197');  // ingediend_cumul from first row
    expect(tooltip?.innerHTML).toContain('week 25 - 2026');
  });

  it('flipping cumulative toggles which column is plotted — values change from cumul to delta', async () => {
    // Build with cumulative=false
    const deltaPageConf = buildPageConfig(
      'regelingen',
      { key: 'ingediend', cumulative: false, periodization: 'weekly' },
      [{
        ...BARTREND_GROUP_CONF,
        segment: { key: 'ingediend', cumulative: false, periodization: 'weekly' },
        // Also override the graph's segment — initSegments merges group.segment
        // first, then overrides with graph.segment, so the graph config's
        // segment.cumulative=true was winning over the group override.
        graphs: [{
          ...BARTREND_GRAPH_CONF,
          segment: { key: 'ingediend', cumulative: false, periodization: 'weekly' },
        } as any],
      }],
    );

    initPageStore(deltaPageConf);
    const page = fakePage(deltaPageConf);
    const group = buildGroup(page, deltaPageConf.groups[0], groups, 0);
    page.chartArray = [group];

    const rawPayloads = await loadFixtures();
    const mappedData = fixtureData(rawPayloads, group.resolvedEndpoints);
    group.data = { ...group.data, ...mappedData };
    const processed = group.ctrlr.prepareData(group.data);
    group.data = { ...group.data, ...processed };

    pushGraphStub(group, 'test_trend', BARTREND_GRAPH_CONF.parameters);

    const graph = buildGraph(
      BarTrendV1, page, group,
      { slug: 'test_trend', parameters: BARTREND_GRAPH_CONF.parameters, modifiers: [], filters: [] },
      0,
    ) as BarTrendV1;
    group.graphs[0].ctrlr = graph;
    mountGroup(group);

    graph.html();
    await graph.init();

    const bar = group.element.querySelector('rect.bar') as any;
    expect(bar).toBeDefined();
    const datum = bar.__data__;
    expect(datum).toBeDefined();
    // In delta mode, the bar uses ingediend_aantal → first week value is 1299
    expect(datum.value).toBe(1299);
    // Compare: in cumulative mode (existing test), the value would be 713197
    // This proves the column selection changed
  });
});
// =============================================================================

/** Load fixtures from disk */
async function loadFixtures() {
  const { default: weekRaw } = await import('./fixtures/regelingen/all_waardering/week.json') as any;
  const { default: monthRaw } = await import('./fixtures/regelingen/all_waardering/month.json') as any;
  return {
    'aggregatie=eq.week&domein_code=eq.Totaal': weekRaw,
    'aggregatie=eq.maand&domein_code=eq.Totaal': monthRaw,
  };
}

/**
 * Push a graph object onto group.graphs — same shape PageController.init
 * uses — so graph html() methods can read this.group.graphs[this.index].
 *
 * CONDITIONAL: only needed if the graph class reads
 * `this.group.graphs[this.index].header` in its html() method.
 * Grep for that pattern before adding this call to a new graph test;
 * if absent, no stub is required.
 */
function pushGraphStub(
  group: any,
  slug: string,
  params: IParameterMapping[][],
  opts?: { header?: string; filters?: string[]; segment?: any },
) {
  group.graphs.push({
    slug,
    ctrlr: null as any,
    header: opts?.header,
    classList: [],
    parameters: params as any,
    modifiers: [] as any,
    filters: opts?.filters ?? [],
    segment: opts?.segment ?? { key: 'ingediend', cumulative: true, periodization: 'monthly' },
    multiples: false,
    ctrlrName: slug,
  });
}

/** Build the NumbersV1 graph with fixture-backed data */
async function buildNumbersGraph(
  groupConfig: IGroupMappingV2,
  pageConfig: IPageConfig,
  graphParams: IParameterMapping[][],
  _options?: { cumulative?: boolean },
) {
  initPageStore(pageConfig);
  const page = fakePage(pageConfig);
  const group = buildGroup(page, groupConfig, groups, 0);
  page.chartArray = [group];

  // Feed fixture data through the group
  const rawPayloads = await loadFixtures();
  const mappedData = fixtureData(rawPayloads, group.resolvedEndpoints);
  group.data = { ...group.data, ...mappedData };

  // Run group controller prepareData to get numbers, tables, etc.
  const processed = group.ctrlr.prepareData(group.data);
  group.data = { ...group.data, ...processed };

  // Populate group.graphs (NumbersV1 reads this.group.graphs[this.index].header)
  pushGraphStub(group, 'test_numbers', graphParams);

  const graph = buildGraph(
    NumbersV1, page, group,
    { slug: 'test_numbers', parameters: graphParams, modifiers: [], filters: [] },
    0,
    page.segment,
  ) as NumbersV1;
  group.graphs[0].ctrlr = graph;

  // Mount to body so innerText/layout-dependent properties work
  mountGroup(group);

  return { page, group, graph };
}

// =============================================================================
// NumbersV1 graph config
// =============================================================================

const NUMBERS_PARAMS: IParameterMapping[][] = [
  [
    { label: 'Ingediend', column: 'ingediend', colour: 'orange', units: 'ingediend',
      modifiers: { cumul: '_cumul', delta: '_aantal' } } as any,
    { label: 'Afgehandeld', column: 'afgerond', colour: 'moss', units: 'afgehandeld',
      modifiers: { cumul: '_cumul', delta: '_aantal' } } as any,
  ] as any,
  [] as any,
];

const NUMBERS_GROUP_CONF: IGroupMappingV2 = {
  slug: 'test_group',
  ctrlr: 'DefaultGroupV1',
  filters: [],
  graphs: [{
    slug: 'test_numbers',
    ctrlr: 'NumbersV1',
    args: [],
    parameters: NUMBERS_PARAMS,
    segment: { key: 'ingediend', cumulative: true, periodization: 'monthly' },
  } as any],
  segment: { key: 'ingediend', cumulative: true, periodization: 'monthly' },
  functionality: ['table', 'definitions', 'download'],
  endpoints: BASE_ENDPOINTS,
};

const NUMBERS_PAGE_CONF: IPageConfig = buildPageConfig(
  'regelingen',
  { key: 'ingediend', cumulative: true, periodization: 'monthly' },
  [NUMBERS_GROUP_CONF],
);

// =============================================================================
// Tier A — NumbersV1 tests
// =============================================================================

describe('NumbersV1 (Tier A)', () => {
  it('html() is sync, init() is async — confirms sync/async contract', async () => {
    const { group, graph } = await buildNumbersGraph(
      NUMBERS_GROUP_CONF, NUMBERS_PAGE_CONF, NUMBERS_PARAMS,
    );

    // html() is sync — no await needed
    graph.html();
    // init() IS async — we await it
    await graph.init();
    // After init, sections exist
    expect(document.body.contains(group.element)).toBe(true);
    expect(group.element.querySelectorAll('section.graph-view').length).toBe(2);
  });

  it('renders one section per parameter and number blocks count matches param count', async () => {
    const { group, graph } = await buildNumbersGraph(
      NUMBERS_GROUP_CONF, NUMBERS_PAGE_CONF, NUMBERS_PARAMS,
    );

    graph.html();
    await graph.init();

    // Assert sections — one <section> per parameter[0] entry
    const sections = group.element.querySelectorAll('section.graph-view');
    expect(sections.length).toBe(2);

    // Assert number-block elements exist
    const numberBlocks = group.element.querySelectorAll('.number_accented');
    expect(numberBlocks.length).toBe(2);

    // Assert formatted values from anchor period
    const numbers = group.data.numbers as Record<string, number>;
    expect(numbers['ingediend_cumul']).toBe(ANCHOR.ingediend_cumul);
    expect(numbers['afgerond_cumul']).toBe(ANCHOR.afgerond_cumul);

    // Text content should contain formatted numbers (nl-NL thousands separator)
    // NOTE: jsdom v29 implements innerText as a synthetic property that does
    // not create child text nodes, so textContent is empty. Read via innerText
    // which returns the set value correctly in both jsdom and real browsers.
    const firstSpan = group.element.querySelector('.number.accented');
    expect(firstSpan?.innerText).toContain('713.197');
    const spans = group.element.querySelectorAll('.number.accented');
    expect(spans[1]?.innerText).toContain('687.342');
  });

  it('handles cumulative=false and renders delta values', async () => {
    const deltaPageConf = buildPageConfig(
      'regelingen',
      { key: 'ingediend', cumulative: false, periodization: 'weekly' },
      [{
        ...NUMBERS_GROUP_CONF,
        segment: { key: 'ingediend', cumulative: false, periodization: 'weekly' },
      }],
    );

    const { group, graph } = await buildNumbersGraph(
      deltaPageConf.groups[0], deltaPageConf, NUMBERS_PARAMS,
      { cumulative: false },
    );

    graph.html();
    await graph.init();

    // Text should show delta (aantal) values from first week row
    const spans = group.element.querySelectorAll('.number.accented');
    expect(spans[0]?.innerText).toContain('1.299');
    expect(spans[1]?.innerText).toContain('1.728');
  });
});

// =============================================================================
// KTO graph config — shared by both NumbersPlusRespondentsV1 and BarTrendKTOV1
// =============================================================================

const KTO_GRAPH_PARAMS_A: IParameterMapping[][] = [
  [{ label: 'Sinds start', column: 'doorlopend_cijfer', colour: 'orange', format: 'decimals' }] as any,
  [{ label: 'Totaal respondenten', column: 'aantal_respondenten', units: 'respondenten sinds start', colour: 'orange' }] as any,
];

const KTO_GRAPH_CONF_B: IParameterMapping[][] = [
  [{ label: 'Maand cijfer', column: 'maandcijfer', colour: 'orange', format: 'decimals' }] as any,
  [{ label: 'Aantal nieuwe respondenten', column: 'aantal_respondenten_maand', colour: 'orange', units: 'respondenten' }] as any,
];

const KTO_GROUP_CONF: IGroupMappingV2 = {
  slug: 'all_waardering',
  ctrlr: 'KTOGroupV1',
  filters: [],
  graphs: [
    { slug: 'a_waardering_numbers', ctrlr: 'NumbersPlusRespondentsV1', args: [], parameters: KTO_GRAPH_PARAMS_A, segment: { key: 'doorlopend_cijfer', cumulative: false, periodization: 'latest' } } as any,
    { slug: 'a_waardering_trend', ctrlr: 'BarTrendKTOV1', args: [], filters: [], parameters: KTO_GRAPH_CONF_B, segment: { key: 'maandcijfer', cumulative: false, periodization: 'monthly' } } as any,
  ],
  segment: { key: 'maandcijfer', cumulative: false, periodization: 'monthly' },
  functionality: ['table', 'definitions', 'download'],
  endpoints: ['tevredenheid'],
};

const KTO_PAGE_CONF: IPageConfig = buildPageConfig(
  'regelingen',
  { key: 'maandcijfer', cumulative: false, periodization: 'monthly' },
  [KTO_GROUP_CONF],
);

/** Load KTO fixtures (tevredenheid endpoint) */
async function loadKTOFixtures() {
  const { default: ep1Raw } = await import('./fixtures/regelingen/all_waardering/ep1.json') as any;
  return { 'tevredenheid': ep1Raw };
}

async function buildKTOGraph<T>(
  CtrlrClass: new (...args: any[]) => T,
  graphSlug: string,
  graphParams: IParameterMapping[][],
): Promise<{ group: any; graph: T }> {
  initPageStore(KTO_PAGE_CONF);
  const page = fakePage(KTO_PAGE_CONF);
  const group = buildGroup(page, KTO_GROUP_CONF, groups, 0);
  page.chartArray = [group];

  const rawPayloads = await loadKTOFixtures();
  const mappedData = fixtureData(rawPayloads, group.resolvedEndpoints);
  group.data = { ...group.data, ...mappedData };
  const processed = group.ctrlr.prepareData(group.data);
  group.data = { ...group.data, ...processed };

  pushGraphStub(group, graphSlug, graphParams);
  const graph = buildGraph(CtrlrClass as any, page, group, { slug: graphSlug, parameters: graphParams, filters: [] }, 0) as T;
  group.graphs[0].ctrlr = graph;
  mountGroup(group);
  return { group, graph };
}

// =============================================================================
// NumbersPlusRespondentsV1 — Tier A KTO variant
// =============================================================================

describe('NumbersPlusRespondentsV1 (Tier A — KTO)', () => {
  it('renders primary number and respondent count from first graphDataWeek row', async () => {
    const { group, graph } = await buildKTOGraph(NumbersPlusRespondentsV1, 'a_waardering_numbers', KTO_GRAPH_PARAMS_A);

    (graph as any).html();
    await (graph as any).init();

    const sections = group.element.querySelectorAll('section.graph-view');
    expect(sections.length).toBe(1);

    // Primary number (doorlopend_cijfer = 6.8 → decimals format: toFixed(1) = "6.8")
    const primarySpan = group.element.querySelector('.number.accented');
    expect(primarySpan?.innerText).toContain('6.8');

    // Secondary number (aantal_respondenten = 85279 → formatted as "85.279")
    const secondSpan = group.element.querySelector('.second_number');
    expect(secondSpan?.innerText).toContain('85.279');
  });
});

// =============================================================================
// BarTrendKTOV1 — Tier B KTO variant (first atypical checkpoint)
// =============================================================================

describe('BarTrendKTOV1 (Tier B — KTO checkpoint)', () => {
  it('renders bars with axes and tooltip content', async () => {
    const { group, graph } = await buildKTOGraph(BarTrendKTOV1, 'a_waardering_trend', KTO_GRAPH_CONF_B);

    (graph as any).html();
    await (graph as any).init();

    const svg = group.element.querySelector('svg');
    expect(svg).toBeDefined();

    // Axis groups exist
    const xAxis = svg!.querySelector('.x-axis');
    const yAxis = svg!.querySelector('.y-axis');
    expect(xAxis).toBeDefined();
    expect(yAxis).toBeDefined();

    // Bars rendered matching data length
    const bars = group.element.querySelectorAll('rect.bar');
    expect(bars.length).toBeGreaterThan(0);
    const trendData = (graph as any).preparedData?.maandcijfer;
    if (trendData) {
      expect(bars.length).toBe(trendData.length);
    }

    // Tooltip on mouseover
    const bar = bars[0];
    bar!.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    const tooltip = document.querySelector('.tooltip');
    expect(tooltip).toBeDefined();
    // Tooltip should contain a formatted decimal value from the row's maandcijfer
    expect(tooltip?.innerHTML.length).toBeGreaterThan(0);
  });
});

// =============================================================================
// BarTrendStackedMakeup — stacked bar variant (DomainComparisonGroupV1's graph)
// =============================================================================

/** Hand-built month rows with per-domain columns for stacked makeup */
const STACKED_RAW_WEEK_ROWS = [{
  aggregatie: 'WEEK',
  periode: '2026_01',
  periode_vanaf: '2026-01-01',
  periode_totenmet: '2026-01-04',
  ingediend_aantal: 800,
  ingediend_cumul: 3200,
}];

const STACKED_RAW_MONTH_ROWS = [
  {
    aggregatie: 'MAAND',
    periode: '2026_01',
    periode_vanaf: '2026-01-01',
    periode_totenmet: '2026-01-31',
    ingediend_aantal: 3200,
    ingediend_cumul: 3200,
  },
  {
    aggregatie: 'MAAND',
    periode: '2026_02',
    periode_vanaf: '2026-02-01',
    periode_totenmet: '2026-02-28',
    ingediend_aantal: 2800,
    ingediend_cumul: 6000,
  },
];

const STACKED_GRAPH_CONF = {
  slug: 'reg_makeup_trend',
  ctrlr: 'BarTrendStackedMakeup',
  args: [],
  filters: [],
  parameters: [
    [
      { label: 'Waardedaling', short: 'WD', column: 'wdl_ingediend', colour: 'moss',
        modifiers: { cumul: '_cumul', delta: '_aantal' } },
      { label: 'Immateriele schade', short: 'IMS', column: 'ims_ingediend', colour: 'blue',
        modifiers: { cumul: '_cumul', delta: '_aantal' } },
      { label: 'Fysieke schade', short: 'FS', column: 'fs_ingediend', colour: 'orange',
        modifiers: { cumul: '_cumul', delta: '_aantal' } },
    ],
    [],
  ] as any,
  segment: { key: 'wdl_ingediend', cumulative: false, periodization: 'monthly', parameterIndex: 0 },
};

const STACKED_GROUP_CONF: IGroupMappingV2 = {
  slug: 'all_regelingen_overzicht',
  ctrlr: 'DomainComparisonGroupV1',
  filters: [],
  graphs: [STACKED_GRAPH_CONF as any],
  segment: { key: 'wdl_ingediend', cumulative: false, periodization: 'monthly', parameterIndex: 0 },
  functionality: ['table', 'definitions', 'download'],
  endpoints: [
    'regelingen?aggregatie=eq.week&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&order=periode.desc',
    'regelingen?aggregatie=eq.maand&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&order=periode.desc',
    'regelingen?aggregatie=eq.maand&domein_code=eq.WDL&regeling_code=eq.Totaal&order=periode.desc',
  ],
};

const STACKED_PAGE_CONF: IPageConfig = buildPageConfig(
  'regelingen',
  { key: 'wdl_ingediend', cumulative: false, periodization: 'monthly' },
  [STACKED_GROUP_CONF],
);

describe('BarTrendStackedMakeup (Tier B — stacked)', () => {
  async function buildStackedGraph() {
    initPageStore(STACKED_PAGE_CONF);
    const page = fakePage(STACKED_PAGE_CONF);
    const group = buildGroup(page, STACKED_GROUP_CONF, groups, 0);
    page.chartArray = [group];

    // Hand-built data → mapRow → group.data
    const rawPayloads: Record<string, any[]> = {
      'aggregatie=eq.week': STACKED_RAW_WEEK_ROWS,
      'aggregatie=eq.maand': STACKED_RAW_MONTH_ROWS,
    };
    const mappedData = fixtureData(rawPayloads, group.resolvedEndpoints);
    group.data = { ...group.data, ...mappedData };

    // DefaultGroupV1 prepareData produces tables, etc.
    const processed = group.ctrlr.prepareData(group.data);
    group.data = { ...group.data, ...processed };

    pushGraphStub(group, 'reg_makeup_trend', STACKED_GRAPH_CONF.parameters);

    const graph = buildGraph(
      BarTrendStackedMakeup, page, group,
      { slug: 'reg_makeup_trend', parameters: STACKED_GRAPH_CONF.parameters, filters: [] },
      0,
    ) as any;
    group.graphs[0].ctrlr = graph;
    mountGroup(group);
    return { group, graph };
  }

  it('renders stacked bars, axes, and tooltip with domain values', async () => {
    const { group, graph } = await buildStackedGraph();

    graph.html();
    await graph.init();

    const svg = group.element.querySelector('svg');
    expect(svg).toBeDefined();

    // Axes exist
    const xAxis = svg!.querySelector('.x-axis');
    const yAxis = svg!.querySelector('.y-axis');
    expect(xAxis).toBeDefined();
    expect(yAxis).toBeDefined();

    // Stacked bar groups (<g class="serie">) exist, one per parameter[0] entry
    const series = svg!.querySelectorAll('g.serie');
    expect(series.length).toBe(3);

    // Each serie has <rect class="bar"> for each data row
    series.forEach(s => {
      expect(s.querySelectorAll('rect.bar').length).toBe(2);
    });

    // Tooltip on mouseover of a bar
    const bar = svg!.querySelector('rect.bar');
    expect(bar).toBeDefined();
    bar!.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    const tooltip = document.querySelector('.tooltip');
    expect(tooltip).toBeDefined();
    // Tooltip should contain domain labels from parameters
    expect(tooltip!.innerHTML).toContain('Waardedaling');
    expect(tooltip!.innerHTML).toContain('Immateriele schade');
    expect(tooltip!.innerHTML).toContain('Fysieke schade');

    // Tooltip should contain a formatted value from the first (most recent) row
    // Sorted descending by periode → 2026_02 is first, ingediend_aantal=2800
    expect(tooltip!.innerHTML).toContain('2.800');
  });

  it('flipping cumulative toggles which column values appear in tooltip', async () => {
    // Build with cumulative=true
    const cumulPageConf = buildPageConfig(
      'regelingen',
      { key: 'wdl_ingediend', cumulative: true, periodization: 'monthly' },
      [{
        ...STACKED_GROUP_CONF,
        segment: { key: 'wdl_ingediend', cumulative: true, periodization: 'monthly', parameterIndex: 0 },
        graphs: [{
          ...STACKED_GRAPH_CONF,
          segment: { key: 'wdl_ingediend', cumulative: true, periodization: 'monthly', parameterIndex: 0 },
        }],
      }],
    );

    initPageStore(cumulPageConf);
    const page = fakePage(cumulPageConf);
    const group = buildGroup(page, cumulPageConf.groups[0], groups, 0);
    page.chartArray = [group];

    const rawPayloads: Record<string, any[]> = {
      'aggregatie=eq.week': STACKED_RAW_WEEK_ROWS,
      'aggregatie=eq.maand': STACKED_RAW_MONTH_ROWS,
    };
    const mappedData = fixtureData(rawPayloads, group.resolvedEndpoints);
    group.data = { ...group.data, ...mappedData };
    const processed = group.ctrlr.prepareData(group.data);
    group.data = { ...group.data, ...processed };

    pushGraphStub(group, 'reg_makeup_trend', STACKED_GRAPH_CONF.parameters);
    const graph = buildGraph(
      BarTrendStackedMakeup, page, group,
      { slug: 'reg_makeup_trend', parameters: STACKED_GRAPH_CONF.parameters, filters: [] },
      0,
    ) as any;
    group.graphs[0].ctrlr = graph;
    mountGroup(group);

    graph.html();
    await graph.init();

    // Tooltip should show cumul values
    const bar = group.element.querySelector('rect.bar')!;
    bar.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    const tooltip = document.querySelector('.tooltip');
    expect(tooltip!.innerHTML).toContain('6.000'); // wdl_ingediend_cumul for periode 2026_02
  });
});

// =============================================================================
// fs_overzicht tests — NumbersMultiplesV1, BarTrendBedragenV1, SegmentsV1
// =============================================================================

const FS_ENDPOINTS = [
  'regelingen?aggregatie=eq.week&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&order=periode.desc&periode_vanaf=gte.{VANAF}',
  'regelingen?aggregatie=eq.maand&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&order=periode.desc',
];

const FS_ANCHOR = {
  ingediend_cumul: 398810,
  voorraad_cumul: 21622,
  afgerond_cumul: 377188,
  ingediend_aantal: 717,
  voorraad_verschil: -301,
  afgerond_aantal: 1018,
  bedrag_betaald_totaal_eur: 9519643.23,
  bedrag_betaald_totaal_cumul_eur: 2551493107.25,
};

const FS_PARAMS_3: IParameterMapping[][] = [
  [
    { label: 'Ingediend', column: 'ingediend', colour: 'orange', units: 'ingediend',
      modifiers: { cumul: '_cumul', delta: '_aantal' } } as any,
    { label: 'Voorraad', column: 'voorraad', colour: 'purple', units: 'voorraad',
      modifiers: { cumul: '_cumul', delta: '_verschil' } } as any,
    { label: 'Afgehandeld', column: 'afgerond', colour: 'moss', units: 'afgehandeld',
      modifiers: { cumul: '_cumul', delta: '_aantal' } } as any,
  ],
  [],
];

const FS_BEDRAGEN_PARAMS: IParameterMapping[][] = [
  [
    { label: 'betaald totaal', column: 'bedrag_betaald_totaal', colour: 'blue', format: 'currency', units: 'betaald totaalbedrag',
      modifiers: { cumul: '_cumul_eur', delta: '_eur' } } as any,
  ],
  [],
];

const FS_KEUZE_PARAMS: IParameterMapping[][] = [
  [
    { label: 'Maatwerk (MW)', column: 'toegekend_mv', colour: 'blue', units: 'toegekend als maatwerk',
      modifiers: { cumul: '_cumul', delta: '_aantal' } } as any,
    { label: 'Vaste Vergoeding (VES)', column: 'toegekend_ves', colour: 'orange', units: 'toegekend als vaste vergoeding',
      modifiers: { cumul: '_cumul', delta: '_aantal' } } as any,
  ],
  [],
];

describe('NumbersMultiplesV1 (Tier A — fs_overzicht)', () => {
  async function buildNumbersMultiplesGraph() {
    const groupConf: IGroupMappingV2 = {
      slug: 'fs_totals', ctrlr: 'DefaultGroupV1', filters: ['totaalVsRecent'], graphs: [
        { slug: 'fs_numbers_v1', ctrlr: 'NumbersMultiplesV1', args: [], multiples: 'cumulative',
          parameters: FS_PARAMS_3, segment: { key: 'ingediend', cumulative: true, periodization: 'monthly' } } as any,
      ],
      segment: { key: 'ingediend', cumulative: true, periodization: 'monthly' },
      functionality: ['table', 'definitions', 'download'], endpoints: FS_ENDPOINTS,
    };
    const pageConf = buildPageConfig('regelingen', { key: 'ingediend', cumulative: true, periodization: 'monthly' }, [groupConf]);
    initPageStore(pageConf);
    const page = fakePage(pageConf);
    const group = buildGroup(page, groupConf, groups, 0);
    page.chartArray = [group];

    const { default: weekRaw } = await import('./fixtures/fs_overzicht/fs_totals/week.json') as any;
    const { default: monthRaw } = await import('./fixtures/fs_overzicht/fs_totals/month.json') as any;
    const rawPayloads: Record<string, any[]> = {
      'aggregatie=eq.week&domein_code=eq.FYSIEK': weekRaw,
      'aggregatie=eq.maand&domein_code=eq.FYSIEK': monthRaw,
    };
    const mappedData = fixtureData(rawPayloads, group.resolvedEndpoints);
    group.data = { ...group.data, ...mappedData };
    const processed = group.ctrlr.prepareData(group.data);
    group.data = { ...group.data, ...processed };

    pushGraphStub(group, 'fs_numbers_v1', FS_PARAMS_3);
    const graph = buildGraph(NumbersMultiplesV1, page, group,
      { slug: 'fs_numbers_v1', parameters: FS_PARAMS_3, modifiers: [], filters: [] }, 0) as NumbersMultiplesV1;
    group.graphs[0].ctrlr = graph;
    mountGroup(group);
    return { group, graph };
  }

  it('renders number from the first parameter (ingediend) at index 0', async () => {
    const { group, graph } = await buildNumbersMultiplesGraph();
    graph.html();
    await graph.init();

    const sections = group.element.querySelectorAll('section.graph-view');
    expect(sections.length).toBe(1);

    const span = group.element.querySelector('.number');
    expect(span?.innerText).toContain('398.810'); // ingediend_cumul
  });
});

describe('BarTrendBedragenV1 (Tier B — fs_overzicht)', () => {
  async function buildBedragenGraph() {
    const groupConf: IGroupMappingV2 = {
      slug: 'fs_bedragen', ctrlr: 'DefaultGroupV1', filters: [], graphs: [
        { slug: 'fs_bedragen_trend', ctrlr: 'BarTrendBedragenV1', args: [], filters: [],
          parameters: FS_BEDRAGEN_PARAMS, segment: { key: 'bedrag_betaald_totaal', cumulative: true, periodization: 'monthly' } } as any,
      ],
      segment: { key: 'bedrag_betaald_totaal', cumulative: true, periodization: 'monthly' },
      functionality: ['table', 'definitions', 'download'], endpoints: FS_ENDPOINTS,
    };
    const pageConf = buildPageConfig('regelingen', { key: 'bedrag_betaald_totaal', cumulative: true, periodization: 'monthly' }, [groupConf]);
    initPageStore(pageConf);
    const page = fakePage(pageConf);
    const group = buildGroup(page, groupConf, groups, 0);
    page.chartArray = [group];

    const { default: weekRaw } = await import('./fixtures/fs_overzicht/fs_totals/week.json') as any;
    const { default: monthRaw } = await import('./fixtures/fs_overzicht/fs_totals/month.json') as any;
    const rawPayloads: Record<string, any[]> = {
      'aggregatie=eq.week&domein_code=eq.FYSIEK': weekRaw,
      'aggregatie=eq.maand&domein_code=eq.FYSIEK': monthRaw,
    };
    const mappedData = fixtureData(rawPayloads, group.resolvedEndpoints);
    group.data = { ...group.data, ...mappedData };
    const processed = group.ctrlr.prepareData(group.data);
    group.data = { ...group.data, ...processed };

    pushGraphStub(group, 'fs_bedragen_trend', FS_BEDRAGEN_PARAMS);
    const graph = buildGraph(BarTrendBedragenV1, page, group,
      { slug: 'fs_bedragen_trend', parameters: FS_BEDRAGEN_PARAMS, modifiers: [], filters: [] }, 0) as BarTrendBedragenV1;
    group.graphs[0].ctrlr = graph;
    mountGroup(group);
    return { group, graph };
  }

  it('renders bars with axes and tooltip for bedragen (currency) variant', async () => {
    const { group, graph } = await buildBedragenGraph();
    graph.html();
    await graph.init();

    const svg = group.element.querySelector('svg');
    expect(svg).toBeDefined();

    const xAxis = svg!.querySelector('.x-axis');
    expect(xAxis).toBeDefined();

    const bars = group.element.querySelectorAll('rect.bar');
    expect(bars.length).toBeGreaterThan(0);

    const bar = bars[0];
    bar!.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    const tooltip = document.querySelector('.tooltip');
    expect(tooltip).toBeDefined();
  });
});

describe('SegmentsV1 (Tier B — fs_overzicht)', () => {
  async function buildSegmentsGraph() {
    const groupConf: IGroupMappingV2 = {
      slug: 'fs_keuzepaden', ctrlr: 'DefaultGroupV1', filters: [], graphs: [
        { slug: 'fs_peag_afgerond', ctrlr: 'SegmentsV1', args: [], filters: [], header: 'test header',
          parameters: FS_KEUZE_PARAMS, segment: { key: 'toegekend_mv', cumulative: true, periodization: 'weekly' } } as any,
      ],
      segment: { key: 'toegekend_mv', cumulative: true, periodization: 'weekly' },
      functionality: ['table', 'definitions', 'download'], endpoints: FS_ENDPOINTS,
    };
    const pageConf = buildPageConfig('regelingen', { key: 'toegekend_mv', cumulative: true, periodization: 'weekly' }, [groupConf]);
    initPageStore(pageConf);
    const page = fakePage(pageConf);
    const group = buildGroup(page, groupConf, groups, 0);
    page.chartArray = [group];

    const { default: weekRaw } = await import('./fixtures/fs_overzicht/fs_totals/week.json') as any;
    const rawPayloads: Record<string, any[]> = {
      'aggregatie=eq.week&domein_code=eq.FYSIEK': weekRaw,
    };
    const mappedData = fixtureData(rawPayloads, group.resolvedEndpoints);
    group.data = { ...group.data, ...mappedData };
    const processed = group.ctrlr.prepareData(group.data);
    group.data = { ...group.data, ...processed };

    pushGraphStub(group, 'fs_peag_afgerond', FS_KEUZE_PARAMS, { header: 'test header' });
    const graph = buildGraph(SegmentsV1, page, group,
      { slug: 'fs_peag_afgerond', parameters: FS_KEUZE_PARAMS, modifiers: [], filters: [] }, 0) as SegmentsV1;
    group.graphs[0].ctrlr = graph;
    mountGroup(group);
    return { group, graph };
  }

  it('renders segment bars from graphDataWeek data', async () => {
    const { group, graph } = await buildSegmentsGraph();
    graph.html();
    await graph.init();

    const svg = group.element.querySelector('svg');
    expect(svg).toBeDefined();

    // Segments uses only x-axis (y-axis commented out)
    const xAxis = svg!.querySelector('.x-axis');
    expect(xAxis).toBeDefined();

    // Bars rendered matching segments count (one per parameter)
    const bars = group.element.querySelectorAll('rect.bar');
    expect(bars.length).toBe(2); // toegekend_mv + toegekend_ves
  });
});

// =============================================================================
// PieChartSumV1 (Tier B — pie with legend + sum row)
// =============================================================================

describe('PieChartSumV1 (Tier B — pie with legend + sum)', () => {
  async function buildPieGraph() {
    // Full group with a PieChartSumV1 graph so the SVG infra is wired
    const pieParams: IParameterMapping[][] = [
      [
        { label: 'Toegekend', column: 'toegekend', colour: 'moss',
          modifiers: { cumul: '_cumul', delta: '_aantal' } } as any,
        { label: 'Afgewezen', column: 'afgewezen', colour: 'orange',
          modifiers: { cumul: '_cumul', delta: '_aantal' } } as any,
      ],
      [
        { label: 'Besluiten', column: 'beschikt', colour: 'gray',
          modifiers: { cumul: '_cumul', delta: '_aantal' } } as any,
      ],
    ];
    const groupConf: IGroupMappingV2 = {
      slug: 'test_pie', ctrlr: 'DefaultGroupV1', filters: [], graphs: [
        { slug: 'test_pie_taart', ctrlr: 'PieChartSumV1', args: [], filters: [],
          parameters: pieParams, segment: { key: 'beschikt', cumulative: true, periodization: 'weekly' } } as any,
      ],
      segment: { key: 'beschikt', cumulative: true, periodization: 'weekly' },
      functionality: ['table', 'definitions', 'download'],
      endpoints: [
        'regelingen?aggregatie=eq.week&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&order=periode.desc&periode_vanaf=gte.{VANAF}',
      ],
    };
    const pageConf = buildPageConfig('regelingen', { key: 'beschikt', cumulative: true, periodization: 'weekly' }, [groupConf]);
    initPageStore(pageConf);
    const page = fakePage(pageConf);
    const group = buildGroup(page, groupConf, groups, 0);
    page.chartArray = [group];

    // Minimal fixture — just need the cumul columns for pieParts to resolve
    const rawWeekRow = {
      aggregatie: 'week', periode: '2026_25', domein_code: 'FYSIEK', regeling_code: 'Totaal',
      toegekend_cumul: 270307, afgewezen_cumul: 56644, beschikt_cumul: 326951,
    };
    const rawPayloads: Record<string, any[]> = {
      'aggregatie=eq.week&domein_code=eq.FYSIEK': [rawWeekRow],
    };
    const mappedData = fixtureData(rawPayloads, group.resolvedEndpoints);
    group.data = { ...group.data, ...mappedData };
    const processed = group.ctrlr.prepareData(group.data);
    group.data = { ...group.data, ...processed };

    // Inject pies data directly — pieParts() is only called inside group.html()
    // which this test doesn't invoke.  The pie values match the fixture row above:
    //   toegekend_cumul=270307, afgewezen_cumul=56644, beschikt_cumul=326951
    // These satisfy: 270307 + 56644 = 326951
    group.data.pies = [
      [
        { label: 'Toegekend', value: 270307, colour: 'moss', accented: false, format: '' },
        { label: 'Afgewezen', value: 56644, colour: 'orange', accented: false, format: '' },
        { label: 'Besluiten', value: 326951, colour: 'gray', accented: false, format: '' },
      ],
    ];

    pushGraphStub(group, 'test_pie_taart', pieParams, { segment: { key: 'beschikt', cumulative: true, periodization: 'weekly' } });
    const graph = buildGraph(PieChartSumV1, page, group,
      { slug: 'test_pie_taart', parameters: pieParams, modifiers: [], filters: [] }, 0) as PieChartSumV1;
    group.graphs[0].ctrlr = graph;
    mountGroup(group);
    return { group, graph };
  }

  it('renders pie arcs and legend with sum row (2nd param array)', async () => {
    const { group, graph } = await buildPieGraph();

    graph.html();
    await graph.init();

    // SVG exists
    const svg = group.element.querySelector('svg');
    expect(svg).toBeDefined();

    // Pie slices: N-1 paths (excludes the last item — the sum/total)
    const arcs = svg!.querySelectorAll('path.arc');
    expect(arcs.length).toBe(2); // toegekend + afgewezen = 2 parts, beschikt is the sum

    // Legend exists with a table
    const legend = group.element.querySelector('.legend');
    expect(legend).toBeDefined();
    const rows = legend!.querySelectorAll('tr');
    expect(rows.length).toBe(3); // toegekend + afgewezen + beschikt (sum)

    // Last row is the sum — has top_border class
    const lastRow = rows[rows.length - 1];
    expect(lastRow.classList.contains('top_border')).toBe(true);
    const nonSumRows = rows[0];
    expect(nonSumRows.classList.contains('no_border')).toBe(true);

    // Row labels match the parameter labels
    expect((rows[0].querySelector('td:nth-child(2)') as any)?.innerText).toBe('Toegekend');
    expect((rows[1].querySelector('td:nth-child(2)') as any)?.innerText).toBe('Afgewezen');
    expect((lastRow.querySelector('td:nth-child(2)') as any)?.innerText).toBe('Besluiten');

    // Values formatted with thousands separator + percentage (withPercentage=true)
    expect((rows[0].querySelector('td:nth-child(3)') as any)?.innerText).toBe('270.307 (82.7%)');
    expect((rows[1].querySelector('td:nth-child(3)') as any)?.innerText).toBe('56.644 (17.3%)');
    expect((lastRow.querySelector('td:nth-child(3)') as any)?.innerText).toBe('326.951 (100%)');
  });
});