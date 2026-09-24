/**
 * Reset the segment/data store atoms to baseline. Call in beforeEach() for any
 * jsdom test that touches segment.store or data.store.
 *
 * NOTE: this resets the *imported atoms* directly rather than reaching for
 * `window.__IMG_*__$`. Under vitest the store module's singleton atoms live on
 * the shared module realm, and a per-file jsdom `window` is a separate object,
 * so writing `window.__IMG_GRAPH_SEGMENTS__$` does not clear the atoms the
 * store functions actually read/write. Using the imported atoms (exactly what
 * initSegments/getGraphSegment/etc. operate on) guarantees clean state between
 * tests regardless of window realm.
 */

import {
  pageSegment$,
  groupSegments$,
  graphSegments$,
  isLoading$ as segmentLoading$,
} from '../../src/stores/segment.store';
import { rawData$, isLoading$ as dataLoading$ } from '../../src/stores/data.store';

export function resetSegmentStore(): void {
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
}

export function resetDataStore(): void {
  rawData$.set({});
  dataLoading$.set(false);
}
