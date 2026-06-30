/**
 * Reset the window.__IMG_*__ singleton atoms to baseline.
 * Call in beforeEach() for any jsdom test that touches
 * segment.store or data.store.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = (): any => window;

export function resetSegmentStore(): void {
  const page = w().__IMG_PAGE_SEGMENT__$;
  const groups = w().__IMG_GROUP_SEGMENTS__$;
  const graphs = w().__IMG_GRAPH_SEGMENTS__$;
  const loading = w().__IMG_SEGMENT_LOADING__$;
  if (!page) return; // store not yet imported

  page.set({
    gemeente: 'all',
    vanaf: '2025-01-01',
    key: '',
    baseKey: '',
    cumulative: true,
    periodization: 'monthly',
  });
  groups.set({});
  graphs.set({});
  loading.set(false);
}

export function resetDataStore(): void {
  const raw = w().__IMG_RAW_DATA__$;
  const loading = w().__IMG_IS_LOADING__$;
  if (!raw) return;

  raw.set({});
  loading.set(false);
}
