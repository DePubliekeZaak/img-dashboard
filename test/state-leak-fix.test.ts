// @vitest-environment jsdom
//
// Regression tests for the "real state-leak fix" (fix #2) of the BarTrendV1
// resize crash.
//
// Root cause: BarTrendV1.draw/redraw pass `this.segment` (a getter reading the
// shared graphSegments$ singleton). A STALE `_resizeHandler` attached to window
// by GraphControllerV3._update survives a topic switch when destroy() is not
// reached, and then reads a store that was blind-replaced by page.controller
// init → initSegments for a different topic → `segment` undefined → the
// TypeError "Cannot read properties of undefined (reading 'baseKey')".
//
// Fix #2 has two parts, both covered here:
//   2a) lifecycle — chart/controller destroy() reliably removes the window
//       resize listener (the seam every navigation path funnels through is
//       DashboardController.call → _currentController.destroy()).
//   2b) store — initSegments merges rather than blind-replaces, so a chart
//       that survives navigation keeps its segment (computed baseKey).
//
// The store-merge behavior itself is asserted in segment.store.test.ts; this
// file focuses on the destroy()/resize-listener lifecycle.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { resetStore, fakeMain } from './helpers/harness';
import { GraphControllerV3 } from '../src/charts/core/graph-v3';
import PageController from '../src/shared/page.controller';

beforeEach(() => {
  resetStore();
  vi.restoreAllMocks();
});

describe('state-leak fix #2a — chart destroy() removes the resize handler', () => {
  it('GraphControllerV3.destroy removes the window resize listener added by _update', async () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    // Minimal group/chart stubs — base redraw()/draw() short-circuit without
    // touching the DOM, so _update() only wires the resize handler.
    const graph = new GraphControllerV3(
      'gr',
      {} as any,
      { slug: 'g' } as any,
      {},
      [[]],
      [[]],
      [],
      0,
    );
    // A stub svg object (no `.body`) makes base redraw() short-circuit without
    // touching the DOM, so _update() only wires the resize handler.
    (graph as any).svg = {};

    await graph._update({}, false);

    const addedResize = addSpy.mock.calls.filter(([t]) => t === 'resize');
    expect(addedResize).toHaveLength(1);
    expect(graph._resizeHandler).not.toBeNull();

    graph.destroy();
    expect(graph._resizeHandler).toBeNull();

    const removedResize = removeSpy.mock.calls.filter(([t]) => t === 'resize');
    expect(removedResize).toHaveLength(1);
  });

  it('destroy() is idempotent — removing an already-removed handler does not throw', async () => {
    const graph = new GraphControllerV3(
      'gr',
      {} as any,
      { slug: 'g' } as any,
      {},
      [[]],
      [[]],
      [],
      0,
    );
    (graph as any).svg = {};
    await graph._update({}, false);
    graph.destroy();
    expect(() => graph.destroy()).not.toThrow();
  });
});

describe('state-leak fix #2a — PageController.destroy reaches every chart', () => {
  it('calls destroy() on every chart controller so no resize listener survives', () => {
    const page = new PageController(fakeMain());

    const destroyA = vi.fn();
    const destroyB = vi.fn();
    const destroyC = vi.fn();
    page.chartArray = [
      { graphs: [{ ctrlr: { destroy: destroyA } }, { ctrlr: { destroy: destroyB } }] },
      { graphs: [{ ctrlr: { destroy: destroyC } }] },
    ] as any;

    page.destroy();

    expect(destroyA).toHaveBeenCalledTimes(1);
    expect(destroyB).toHaveBeenCalledTimes(1);
    expect(destroyC).toHaveBeenCalledTimes(1);
    expect(page.chartArray).toHaveLength(0);
  });
});
