// @vitest-environment jsdom
//
// jsdom required because segment.store.ts guards singletons via window.__IMG_*__
//
import { describe, it, expect, beforeEach } from 'vitest';
import { resetSegmentStore } from './helpers/store-reset';

// Must import after reset helper is defined, so the singleton guards run with
// a clean window.
import {
  pageSegment$,
  groupSegments$,
  graphSegments$,
  initSegments,
  cascadeSegmentUpdate,
  cascadeGroupSegmentUpdate,
  getActiveColumn,
  getGraphSegment,
  updateGraphSegment,
} from '../src/stores/segment.store';

beforeEach(() => {
  resetSegmentStore();
});

// Minimal graphParams used by the re-init merge tests (defined here so it is
// not subject to the TDZ of the `graphParams` const declared in the
// getActiveColumn describe block below).
const ingediendGraphParams = {
  ingediend: {
    variants: {
      cumul: { column: 'ingediend_cumul' },
      delta: { column: 'ingediend_aantal' },
    },
  },
};

// ---------------------------------------------------------------------------
// initSegments() – three-level precedence
// ---------------------------------------------------------------------------
describe('initSegments', () => {
  const config = {
    segment: {
      key: 'page',
      cumulative: true,
      periodization: 'monthly',
      vanaf: '2025-01-01',
    },
    groups: [
      {
        slug: 'group_a',
        segment: {
          key: 'group_a',
          cumulative: false, // override page
        },
        graphs: [
          {
            slug: 'graph_1',
            segment: {
              vanaf: '2024-01-01', // override page & group
            },
          },
        ],
      },
    ],
  };

  it('page segment = defaults merged with config.segment', () => {
    initSegments(config);
    const page = pageSegment$.get();
    expect(page.key).toBe('page');
    expect(page.cumulative).toBe(true);
    expect(page.periodization).toBe('monthly');
  });

  it('group inherits from page then overlays its own segment', () => {
    initSegments(config);
    const group = groupSegments$.get().group_a;
    expect(group.key).toBe('group_a');
    expect(group.periodization).toBe('monthly'); // from page
    expect(group.cumulative).toBe(false); // overridden by group
  });

  it('graph wins: overrides page and group', () => {
    initSegments(config);
    const graph = graphSegments$.get().group_a.graph_1;
    expect(graph.vanaf).toBe('2024-01-01'); // from graph segment
    expect(graph.key).toBe('group_a');     // inherited from group
    expect(graph.cumulative).toBe(false);  // inherited from group
  });

  it('group without segment inherits page fully', () => {
    const cfg = {
      segment: { key: 'page', cumulative: true, periodization: 'monthly' },
      groups: [
        { slug: 'bare_group', segment: {}, graphs: [{ slug: 'g1', segment: {} }] },
      ],
    };
    initSegments(cfg);
    const group = groupSegments$.get().bare_group;
    expect(group.cumulative).toBe(true);
    expect(group.periodization).toBe('monthly');
  });
});

// ---------------------------------------------------------------------------
// initSegments() merge across re-init — state-leak fix #2b
//
// A chart/group that persists across navigation (same slug in the old and new
// config) must keep its segment when the store is re-initialized on a topic
// switch. Blind-replacing the store wipes the computed `baseKey` of a surviving
// chart, so its (still-attached) resize handler resolves `getGraphSegment` to
// undefined and BarTrendV1.redraw throws. Merging retains the segment.
// ---------------------------------------------------------------------------
describe('initSegments merge across re-init', () => {
  it('keeps a surviving chart\'s computed baseKey across a re-init so the resize path resolves', () => {
    // First topic: group g / chart gr with a baseKey computed by page.controller
    initSegments({
      segment: { key: 'ingediend', cumulative: true, periodization: 'weekly' },
      groups: [
        { slug: 'g', segment: {}, graphs: [{ slug: 'gr', segment: { key: 'ingediend' } }] },
      ],
    });
    updateGraphSegment('g', 'gr', { baseKey: 'ingediend' });
    expect(getGraphSegment('g', 'gr')?.baseKey).toBe('ingediend');

    // Re-init (topic switch) with a config that keeps the same chart
    initSegments({
      segment: { key: 'ingediend', cumulative: true, periodization: 'weekly' },
      groups: [
        { slug: 'g', segment: {}, graphs: [{ slug: 'gr', segment: { key: 'ingediend' } }] },
      ],
    });

    // baseKey survives — a chart that persists across navigation keeps its segment
    expect(getGraphSegment('g', 'gr')?.baseKey).toBe('ingediend');

    // and the resize path (getActiveColumn) resolves without throwing
    const col = getActiveColumn('g', 'gr', ingediendGraphParams, 'fallback');
    expect(col).toBe('ingediend_cumul');
  });

  it('drops segments whose chart no longer exists in the new config', () => {
    initSegments({
      segment: { key: 'a', cumulative: true, periodization: 'monthly' },
      groups: [
        { slug: 'g', segment: {}, graphs: [{ slug: 'old', segment: {} }] },
      ],
    });
    initSegments({
      segment: { key: 'b', cumulative: true, periodization: 'monthly' },
      groups: [
        { slug: 'g', segment: {}, graphs: [{ slug: 'new', segment: {} }] },
      ],
    });
    expect(getGraphSegment('g', 'old')).toBeUndefined();
    expect(getGraphSegment('g', 'new')).toBeDefined();
  });

  it('fresh config values win over preserved ones on re-init', () => {
    initSegments({
      segment: { key: 'a', cumulative: true, periodization: 'weekly' },
      groups: [
        { slug: 'g', segment: {}, graphs: [{ slug: 'gr', segment: { key: 'a', periodization: 'weekly' } }] },
      ],
    });
    initSegments({
      segment: { key: 'a', cumulative: true, periodization: 'monthly' },
      groups: [
        { slug: 'g', segment: {}, graphs: [{ slug: 'gr', segment: { key: 'a', periodization: 'monthly' } }] },
      ],
    });
    expect(getGraphSegment('g', 'gr')?.periodization).toBe('monthly');
    expect(getGraphSegment('g', 'gr')?.key).toBe('a');
  });
});

// ---------------------------------------------------------------------------
// cascadeSegmentUpdate()
// ---------------------------------------------------------------------------
describe('cascadeSegmentUpdate', () => {
  it('applies updates to page, every group, and every graph', () => {
    initSegments({
      segment: { key: 'p', cumulative: true, periodization: 'monthly' },
      groups: [
        {
          slug: 'g1',
          segment: {},
          graphs: [{ slug: 'gr1', segment: {} }, { slug: 'gr2', segment: {} }],
        },
        {
          slug: 'g2',
          segment: {},
          graphs: [{ slug: 'gr3', segment: {} }],
        },
      ],
    });

    cascadeSegmentUpdate({ cumulative: false, vanaf: '2023-01-01' });

    // Page
    expect(pageSegment$.get().cumulative).toBe(false);
    expect(pageSegment$.get().vanaf).toBe('2023-01-01');

    // All groups
    for (const slug of ['g1', 'g2']) {
      expect(groupSegments$.get()[slug].cumulative).toBe(false);
    }

    // All graphs
    for (const gSlug of ['g1', 'g2']) {
      const groupGraphs = graphSegments$.get()[gSlug];
      for (const grSlug of Object.keys(groupGraphs)) {
        expect(groupGraphs[grSlug].cumulative).toBe(false);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// cascadeGroupSegmentUpdate()
// ---------------------------------------------------------------------------
describe('cascadeGroupSegmentUpdate', () => {
  it('updates the group segment and cascades to only that group\'s graphs', () => {
    initSegments({
      segment: { key: 'p', cumulative: true, periodization: 'monthly' },
      groups: [
        {
          slug: 'g1',
          segment: {},
          graphs: [{ slug: 'gr1', segment: {} }, { slug: 'gr2', segment: {} }],
        },
        {
          slug: 'g2',
          segment: {},
          graphs: [{ slug: 'gr3', segment: {} }],
        },
      ],
    });

    cascadeGroupSegmentUpdate('g1', { cumulative: false });

    // g1 and its graphs updated
    expect(groupSegments$.get().g1.cumulative).toBe(false);
    expect(graphSegments$.get().g1.gr1.cumulative).toBe(false);
    expect(graphSegments$.get().g1.gr2.cumulative).toBe(false);

    // g2 unaffected
    expect(groupSegments$.get().g2.cumulative).toBe(true);
    expect(graphSegments$.get().g2.gr3.cumulative).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// getActiveColumn()
// ---------------------------------------------------------------------------
describe('getActiveColumn', () => {
  const graphParams = {
    ingediend: {
      base: { column: 'ingediend_base', label: 'Ingediend', colour: '#000' },
      variants: {
        delta: { column: 'ingediend_aantal', label: 'Ingediend', colour: '#000' },
        cumul: { column: 'ingediend_cumul', label: 'Ingediend (cumul)', colour: '#000' },
      },
    },
    base_only: {
      base: { column: 'base_only_col', label: 'Base', colour: '#000' },
      variants: {
        // no delta or cumul
      },
    },
  };

  it('cumulative=true picks the cumul variant column', () => {
    initSegments({
      segment: { cumulative: true, periodization: 'monthly', key: '' },
      groups: [
        {
          slug: 'g',
          segment: {},
          graphs: [{ slug: 'gr', segment: { baseKey: 'ingediend' } }],
        },
      ],
    });
    const col = getActiveColumn('g', 'gr', graphParams, 'fallback');
    expect(col).toBe('ingediend_cumul');
  });

  it('cumulative=false picks the delta variant column', () => {
    initSegments({
      segment: { cumulative: false, periodization: 'monthly', key: '' },
      groups: [
        {
          slug: 'g',
          segment: {},
          graphs: [{ slug: 'gr', segment: { baseKey: 'ingediend' } }],
        },
      ],
    });
    const col = getActiveColumn('g', 'gr', graphParams, 'fallback');
    expect(col).toBe('ingediend_aantal');
  });

  it('unknown baseKey returns baseKey directly (not the graphParams base or fallback)', () => {
    initSegments({
      segment: { cumulative: true, periodization: 'monthly', key: '' },
      groups: [
        {
          slug: 'g',
          segment: {},
          graphs: [{ slug: 'gr', segment: { baseKey: 'nonexistent' } }],
        },
      ],
    });
    // getActiveColumn: baseKey='nonexistent', graphParams['nonexistent'] is
    // undefined → returns 'nonexistent' (the baseKey), not the fallback.
    const col = getActiveColumn('g', 'gr', graphParams, 'fallback_col');
    expect(col).toBe('nonexistent');
  });

  it('missing variant falls back to the baseKey (not base.column from graphParams)', () => {
    initSegments({
      segment: { cumulative: true, periodization: 'monthly', key: '' },
      groups: [
        {
          slug: 'g',
          segment: {},
          graphs: [{ slug: 'gr', segment: { baseKey: 'base_only' } }],
        },
      ],
    });
    // entry.variants.cumul is undefined → variant?.column || baseColumn
    // returns 'base_only' (the baseKey value), not 'base_only_col'.
    const col = getActiveColumn('g', 'gr', graphParams, 'fallback');
    expect(col).toBe('base_only');
  });

  it('no graph segment returns the fallback', () => {
    // Graphs empty → no segment for this graph
    initSegments({
      segment: { cumulative: true, periodization: 'monthly', key: '' },
      groups: [{ slug: 'g', segment: {}, graphs: [] }],
    });
    const col = getActiveColumn('g', 'nonexistent', graphParams, 'fallback_col');
    expect(col).toBe('fallback_col');
  });
});