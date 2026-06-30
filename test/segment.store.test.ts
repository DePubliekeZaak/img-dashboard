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
  getActiveColumn,
} from '../src/stores/segment.store';

beforeEach(() => {
  resetSegmentStore();
});

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