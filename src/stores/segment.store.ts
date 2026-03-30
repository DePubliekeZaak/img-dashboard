// stores/segment.store.ts
import { atom } from 'nanostores';
import type { Segment } from '../pages/shared/types';
import type { GraphParamEntry } from '../pages/shared/interfaces';

export const pageSegment$ = atom<Segment>({
  gemeente: 'all',
  vanaf: '2025-01-01',
  key: '',
  baseKey: '',
  cumulative: true,
  periodization: 'monthly',
});

export const groupSegments$ = atom<Record<string, Segment>>({});
export const graphSegments$ = atom<Record<string, Record<string, Segment>>>({});
export const isLoading$ = atom<boolean>(false);

export function initSegments(config: any) {
  const pageSegment = { ...pageSegment$.get(), ...config.segment };
  pageSegment$.set(pageSegment);

  const groups: Record<string, Segment> = {};
  const graphs: Record<string, Record<string, Segment>> = {};

  for (const group of config.groups) {
    const groupSegment = { ...pageSegment, ...group.segment };
    groups[group.slug] = groupSegment;
    graphs[group.slug] = {};

    for (const graph of group.graphs) {
      graphs[group.slug][graph.slug] = { ...groupSegment, ...graph.segment };
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