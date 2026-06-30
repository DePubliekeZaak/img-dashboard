/**
 * Test harness for Layer 2 — per-group and per-graph class tests.
 *
 * Constructs controllers the same way PageController.init does,
 * so tests exercise real wiring, not fake mocks.
 *
 * @vitest-environment jsdom
 */
import { vi } from 'vitest';
import { DataService } from '../../src/browser/dashboard/data.service';
import {
  initSegments,
  getGroupSegment,
  getGraphSegment,
  pageSegment$,
  groupSegments$,
  graphSegments$,
  isLoading$ as segmentLoading$,
  updateGroupSegment,
  updateGraphSegment,
} from '../../src/stores/segment.store';
import { rawData$, isLoading$ as dataLoading$ } from '../../src/stores/data.store';
import type { IDashboardController } from '../../src/browser/dashboard/dashboard.controller';
import type { IGraphControllerV3 } from '../../src/charts/core/graph-v3';
import type { IPageController } from '../../src/shared/page.controller';
import type { IPageConfig, IGroupMappingV2, GroupObject, IParameterMapping } from '../../src/shared/interfaces';
import type { Segment } from '../../src/shared/types';

// -------------------------------------------------------------------------
// Store lifecycle
// -------------------------------------------------------------------------

/**
 * Reset both segment + data stores to baseline. Call in beforeEach.
 *
 * Uses the exported store atoms directly (not window accessors) so the
 * reference is the same atom that every other import in-process sees.
 */
export function resetStore() {
  pageSegment$.set({
    gemeente: 'all',
    vanaf: '2025-01-01',
    key: '',
    baseKey: '',
    cumulative: true,
    periodization: 'monthly',
  });
  groupSegments$.set({});
  graphSegments$.set({});
  segmentLoading$.set(false);

  rawData$.set({});
  dataLoading$.set(false);
}

/** Initialise the segment store from a page config. */
export function initPageStore(config: IPageConfig) {
  initSegments(config);
}

// -------------------------------------------------------------------------
// fakeMain — minimal IDashboardController stub
// -------------------------------------------------------------------------
export function fakeMain(
  dataService?: DataService,
): IDashboardController {
  return {
    window,
    params: {
      topic: 'regelingen',
      language: 'nl',
      version: { slug: 'v1', tag: 'latest', name: 'Actuele versie' },
      renew: vi.fn(),
    },
    data: dataService ?? new DataService(),
    nav: {} as any,
    htmlContainer: document.createElement('div') as HTMLScriptElement,
    close_btn: document.createElement('div'),
    open_btn: document.createElement('div'),
    _reloadHtml: vi.fn(),
  } as unknown as IDashboardController;
}

// -------------------------------------------------------------------------
// fakePage — minimal IPageController stub
// -------------------------------------------------------------------------
export function fakePage(config: IPageConfig): IPageController {
  return {
    main: fakeMain(),
    slug: config.slug,
    config,
    segment: pageSegment$.get(),
    chartArray: [],
    init: vi.fn() as any,
    initHtml: vi.fn(),
    gatherData: vi.fn() as any,
    prepareData: vi.fn(),
    tables: vi.fn(),
    initGraphs: vi.fn(),
    onFilterChange: vi.fn() as any,
  } as unknown as IPageController;
}

// -------------------------------------------------------------------------
// buildGroup — mirrors PageController.init group construction (lines 75–121)
// -------------------------------------------------------------------------
export function buildGroup(
  page: IPageController,
  groupConfig: IGroupMappingV2,
  groups: Record<string, new (...args: any[]) => any>,
  index: number = 0,
): GroupObject {
  const CtrlrClass = groups[groupConfig.ctrlr!];
  if (!CtrlrClass) throw new Error(`Unknown group controller "${groupConfig.ctrlr}"`);

  // 1. Construct the controller
  const ctrlr = new CtrlrClass(page, groupConfig, index);

  // 2. Resolve params
  const { tableParams, graphParams } = ctrlr.paramsAndModifiers();

  // 3. Build GroupObject (mirrors PageController.init lines 80–92)
  const g: GroupObject = {
    slug: groupConfig.slug,
    splice: groupConfig.splice,
    ctrlr,
    graphs: [],
    filters: groupConfig.filters,
    config: groupConfig,
    element: document.createElement('div') as HTMLElement,
    data: {},
    tableParams,
    graphParams,
    resolvedEndpoints: (groupConfig.endpoints ?? page.config.endpoints ?? []).map(
      (ep: string) => page.main.data.addVarsToEndpoint(ep, page.segment),
    ),
  };

  // 4. Base-key resolution (mirrors lines 99–121)
  const groupSeg = getGroupSegment(g.slug);
  if (groupSeg) {
    const baseKey = graphParams[groupSeg.key]
      ? groupSeg.key
      : Object.keys(graphParams).find(k =>
          Object.values(graphParams[k].variants).some(
            (v: any) => v.column === groupSeg.key,
          ),
        ) ?? groupSeg.key;

    updateGroupSegment(g.slug, { baseKey });

    for (const graph of groupConfig.graphs) {
      const graphSeg = getGraphSegment(g.slug, graph.slug);
      if (graphSeg) {
        const gBaseKey = graphParams[graphSeg.key]
          ? graphSeg.key
          : Object.keys(graphParams).find(k =>
              Object.values(graphParams[k].variants).some(
                (v: any) => v.column === graphSeg.key,
              ),
            ) ?? graphSeg.key;
        updateGraphSegment(g.slug, graph.slug, { baseKey: gBaseKey });
      }
    }
  }

  // 5. Set ctrlr.group back-reference (prepareData reads this.group)
  (ctrlr as any).group = g;

  return g;
}

// -------------------------------------------------------------------------
// fixtureData — raw JSON through real mapRow, keyed by resolved endpoints
// -------------------------------------------------------------------------
export function fixtureData(
  payloads: Record<string, any[]>,
  resolvedEndpoints: string[],
): Record<string, any[]> {
  const service = new DataService();
  const result: Record<string, any[]> = {};
  const endpointKeys = Object.keys(payloads);

  for (const ep of resolvedEndpoints) {
    const matchingKey = endpointKeys.find(k => ep.includes(k));
    if (matchingKey) {
      const raw = payloads[matchingKey];
      const mapped = raw.map((r: any) => service.mapRow(r));
      result[ep] = mapped;
    } else {
      result[ep] = [];
    }
  }

  return result;
}

// -------------------------------------------------------------------------
// installSvgStubs — jsdom lacks SVG measurement methods
// -------------------------------------------------------------------------
export function installSvgStubs() {
  const proto = (window as any).SVGGraphicsElement?.prototype;
  if (proto && !proto.getBBox) {
    proto.getBBox = () => ({ x: 0, y: 0, width: 100, height: 20 });
  }
  if (proto && !proto.getCTM) {
    proto.getCTM = () => null;
  }
  if (proto && !proto.getScreenCTM) {
    proto.getScreenCTM = () => null;
  }

  const textProto = (window as any).SVGTextContentElement?.prototype;
  if (textProto && !textProto.getComputedTextLength) {
    textProto.getComputedTextLength = () => 50;
  }
}

// -------------------------------------------------------------------------
// buildGraph — construct a graph controller the way PageController.init does
// -------------------------------------------------------------------------
export function buildGraph(
  CtrlrClass: new (...args: any[]) => any,
  page: IPageController,
  group: GroupObject,
  graphConfig: {
    slug: string;
    parameters: IParameterMapping[][];
    modifiers?: IParameterMapping[][];
    filters?: string[];
  },
  index: number,
  ...extra: any[]
): IGraphControllerV3 {
  return new CtrlrClass(
    graphConfig.slug,
    page,
    group,
    group.data,
    graphConfig.parameters,
    graphConfig.modifiers ?? [],
    graphConfig.filters ?? [],
    index,
    ...extra,
  );
}

// -------------------------------------------------------------------------
// mountGroup — attach a group's element tree to document.body so that
// innerText works (jsdom requires a connected tree for layout-dependent
// properties), and the test exercises the same DOM path as production.
// -------------------------------------------------------------------------
export function mountGroup(group: GroupObject) {
  document.body.appendChild(group.element);
}

// -------------------------------------------------------------------------
// Build a page config from slug + segment + groups
// -------------------------------------------------------------------------
export function buildPageConfig(
  slug: string,
  segment: Partial<Segment>,
  groups: IGroupMappingV2[],
  endpoints: string[] = [],
): IPageConfig {
  return {
    slug,
    segment: {
      key: segment.key ?? '',
      cumulative: segment.cumulative ?? true,
      periodization: segment.periodization ?? 'monthly',
      gemeente: segment.gemeente ?? 'all',
      vanaf: segment.vanaf ?? '2025-01-01',
    } as Segment,
    filters: [],
    endpoints,
    groups,
  };
}