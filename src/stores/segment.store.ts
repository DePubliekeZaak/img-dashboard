// stores/segment.store.ts
import { atom } from 'nanostores';
import type { Segment } from '../shared/types';
import type { GraphParamEntry } from '../shared/interfaces';

// Singletons across all bundles
if (!(window as any).__IMG_PAGE_SEGMENT$__) {
  (window as any).__IMG_PAGE_SEGMENT$__ = atom<Segment>({
    gemeente: 'all',
    vanaf: '2025-01-01',
    key: '',
    baseKey: '',
    cumulative: true,
    periodization: 'monthly',
  });
}
if (!(window as any).__IMG_GROUP_SEGMENTS$__) {
  (window as any).__IMG_GROUP_SEGMENTS$__ = atom<Record<string, Segment>>({});
}
if (!(window as any).__IMG_GRAPH_SEGMENTS$__) {
  (window as any).__IMG_GRAPH_SEGMENTS$__ = atom<Record<string, Record<string, Segment>>>({});
}
if (!(window as any).__IMG_SEGMENT_LOADING$__) {
  (window as any).__IMG_SEGMENT_LOADING$__ = atom<boolean>(false);
}

export const pageSegment$ = (window as any).__IMG_PAGE_SEGMENT$__;
export const groupSegments$ = (window as any).__IMG_GROUP_SEGMENTS$__;
export const graphSegments$ = (window as any).__IMG_GRAPH_SEGMENTS$__;
export const isLoading$ = (window as any).__IMG_SEGMENT_LOADING$__;

export function initSegments(config: any) {
  const pageSegment = { ...pageSegment$.get(), ...config.segment };
  pageSegment$.set(pageSegment);

  // Capture the current store so a chart/group that persists across
  // navigation (same slug in the old and new config) keeps its segment
  // instead of being blind-replaced. The fresh config still wins for any
  // field it re-declares, but fields the config does not re-emit — most
  // importantly the computed `baseKey` assigned by page.controller.init —
  // are retained. Without this, re-initializing the store on a topic switch
  // wipes a surviving chart's segment, and its (still-attached) resize
  // handler resolves `getGraphSegment(...)` to undefined.
  const prevGroups = groupSegments$.get();
  const prevGraphs = graphSegments$.get();

  const groups: Record<string, Segment> = {};
  const graphs: Record<string, Record<string, Segment>> = {};

  for (const group of config.groups) {
    const groupSegment = { ...pageSegment, ...group.segment };
    const prevGroup = prevGroups[group.slug];
    // Config-authored fields win; the derived `baseKey` (never authored in
    // config — it is assigned by page.controller.init after initSegments) is
    // preserved from the previous store so a surviving group keeps its segment
    // instead of being reset to the empty sentinel.
    groups[group.slug] = prevGroup
      ? { ...groupSegment, baseKey: prevGroup.baseKey || groupSegment.baseKey }
      : groupSegment;
    graphs[group.slug] = {};

    for (const graph of group.graphs) {
      const graphSegment = { ...groupSegment, ...graph.segment };
      const prevGraph = prevGraphs[group.slug]?.[graph.slug];
      graphs[group.slug][graph.slug] = prevGraph
        ? { ...graphSegment, baseKey: prevGraph.baseKey || graphSegment.baseKey }
        : graphSegment;
    }
  }

  groupSegments$.set(groups);
  graphSegments$.set(graphs);
}

export function updatePageSegment(updates: Partial<Segment>) {
  pageSegment$.set({ ...pageSegment$.get(), ...updates });
}

export function updateGroupSegment(groupSlug: string, updates: Partial<Segment>) {
  const current = groupSegments$.get();
  groupSegments$.set({
    ...current,
    [groupSlug]: { ...current[groupSlug], ...updates },
  });
}

export function updateGraphSegment(groupSlug: string, graphSlug: string, updates: Partial<Segment>) {
  const current = graphSegments$.get();
  const groupGraphs = current[groupSlug] || {};
  graphSegments$.set({
    ...current,
    [groupSlug]: {
      ...groupGraphs,
      [graphSlug]: { ...groupGraphs[graphSlug], ...updates },
    },
  });
}

export function cascadeGroupSegmentUpdate(groupSlug: string, updates: Partial<Segment>) {
  updateGroupSegment(groupSlug, updates);

  const graphs = graphSegments$.get()[groupSlug] || {};
  for (const graphSlug of Object.keys(graphs)) {
    updateGraphSegment(groupSlug, graphSlug, updates);
  }
}

export function cascadeSegmentUpdate(updates: Partial<Segment>) {
  updatePageSegment(updates);

  const groups = groupSegments$.get();
  for (const groupSlug of Object.keys(groups)) {
    updateGroupSegment(groupSlug, updates);

    const graphs = graphSegments$.get()[groupSlug] || {};
    for (const graphSlug of Object.keys(graphs)) {
      updateGraphSegment(groupSlug, graphSlug, updates);
    }
  }
}

export function getGroupSegment(groupSlug: string): Segment | undefined {
  return groupSegments$.get()[groupSlug];
}

export function getGraphSegment(groupSlug: string, graphSlug: string): Segment | undefined {
  return graphSegments$.get()[groupSlug]?.[graphSlug];
}

export function getActiveColumn(
  groupSlug: string,
  graphSlug: string,
  graphParams: Record<string, GraphParamEntry>,
  fallbackBaseColumn: string,
): string {
  const segment = getGraphSegment(groupSlug, graphSlug);
  if (!segment) return fallbackBaseColumn;

  const baseColumn = segment.baseKey || fallbackBaseColumn;
  const entry = graphParams[baseColumn];

  if (!entry) return baseColumn;

  const variant = segment.cumulative
    ? entry.variants.cumul
    : entry.variants.delta;

  return variant?.column || baseColumn;
}