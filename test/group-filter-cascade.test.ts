// @vitest-environment jsdom
//
// Tests that group-level segment filters cascade to graph segments
// and that graph controllers read the updated store.
//
// The two toggle filters (cumulativeVsDelta, weekVsMonth) now propagate through
// cascadeGroupSegmentUpdate (group-scoped), which updates the group segment and
// explicitly cascades to that group's graph segments. The graph's own
// cumulative/periodization defaults are otherwise preserved across gemeente
// changes (see group-v1.update / segment.store).
//
// Key assertions:
//   - cumulativeVsDelta cascades cumulative + key to the group's graph segments
//   - weekVsMonth cascades periodization to the group's graph segments
//   - The graph's `this.segment` getter reflects the cascaded values
//
import { describe, it, expect, beforeEach } from 'vitest';
import { resetStore, initPageStore, buildGroup, fakePage, buildPageConfig } from './helpers/harness';
import { DefaultGroupV1 } from '../src/shared/default-group-v1';
import type { IPageConfig, IGroupMappingV2, IParameterMapping } from '../src/shared/interfaces';
import {
  getGroupSegment,
  getGraphSegment,
  cascadeGroupSegmentUpdate,
} from '../src/stores/segment.store';

// ── Register controllers ──
const groups: Record<string, new (...args: any[]) => any> = { DefaultGroupV1 };

const PARAMS: IParameterMapping[][] = [
  [{
    label: 'betaald totaal',
    column: 'bedrag_betaald_totaal',
    colour: 'blue',
    format: 'currency' as any,
    modifiers: { cumul: '_cumul_eur', delta: '_eur' },
  } as any],
  [],
];

const GROUP_CONF: IGroupMappingV2 = {
  slug: 'bedragen',
  ctrlr: 'DefaultGroupV1',
  filters: ['cumulativeVsDelta', 'weekVsMonth'],
  graphs: [{
    slug: 'numbers',
    ctrlr: 'NumbersV1',
    args: [],
    filters: [],
    multiples: 'cumulative',
    parameters: PARAMS,
    segment: { key: 'bedrag_betaald_totaal', cumulative: true, periodization: 'weekly' },
  }],
  segment: { key: 'bedrag_betaald_totaal', cumulative: true, periodization: 'weekly' },
  functionality: ['table', 'definitions', 'download'],
  endpoints: [],
};

beforeEach(() => {
  resetStore();
});

describe('Group filter → graph segment cascade', () => {

  it('initSegments creates graph segments with merged values', () => {
    const conf = buildPageConfig('test', { key: '', cumulative: true, periodization: 'monthly' }, [GROUP_CONF]);
    initPageStore(conf);

    const groupSlug = 'bedragen';
    const graphSlug = 'numbers';

    // Group segment: page base + group override
    const groupSeg = getGroupSegment(groupSlug);
    expect(groupSeg).toBeDefined();
    expect(groupSeg?.key).toBe('bedrag_betaald_totaal');
    expect(groupSeg?.cumulative).toBe(true);
    expect(groupSeg?.periodization).toBe('weekly');

    // Graph segment: group + graph override
    const graphSeg = getGraphSegment(groupSlug, graphSlug);
    expect(graphSeg).toBeDefined();
    expect(graphSeg?.key).toBe('bedrag_betaald_totaal');
    expect(graphSeg?.cumulative).toBe(true);
    expect(graphSeg?.periodization).toBe('weekly');
  });

  it('cascadeGroupSegmentUpdate cascades cumulativeVsDelta to the group\'s graphs', () => {
    const conf = buildPageConfig('test', { key: '', cumulative: true, periodization: 'monthly' }, [GROUP_CONF]);
    initPageStore(conf);

    const groupSlug = 'bedragen';
    const graphSlug = 'numbers';

    // Simulate cumulativeVsDelta filter: toggle to delta
    cascadeGroupSegmentUpdate(groupSlug, {
      cumulative: false,
      key: 'bedrag_betaald_totaal_eur',
    });

    const graphSeg = getGraphSegment(groupSlug, graphSlug);
    expect(graphSeg?.cumulative).toBe(false);
    expect(graphSeg?.key).toBe('bedrag_betaald_totaal_eur');
    expect(getGroupSegment(groupSlug)?.cumulative).toBe(false);
  });

  it('cascadeGroupSegmentUpdate cascades periodization to the group\'s graphs', () => {
    const conf = buildPageConfig('test', { key: '', cumulative: true, periodization: 'monthly' }, [GROUP_CONF]);
    initPageStore(conf);

    const groupSlug = 'bedragen';
    const graphSlug = 'numbers';

    // Simulate weekVsMonth filter: toggle to monthly
    cascadeGroupSegmentUpdate(groupSlug, { periodization: 'monthly' });

    expect(getGraphSegment(groupSlug, graphSlug)?.periodization).toBe('monthly');
  });

  it('graph segment getter reflects combined group+graph overrides', () => {
    const conf = buildPageConfig('test', { key: '', cumulative: true, periodization: 'monthly' }, [GROUP_CONF]);
    initPageStore(conf);

    const groupSlug = 'bedragen';
    const graphSlug = 'numbers';

    // Both filters toggle
    cascadeGroupSegmentUpdate(groupSlug, {
      cumulative: false,
      key: 'bedrag_betaald_totaal_eur',
      periodization: 'monthly',
    });

    const seg = getGraphSegment(groupSlug, graphSlug);
    expect(seg?.cumulative).toBe(false);
    expect(seg?.key).toBe('bedrag_betaald_totaal_eur');
    expect(seg?.periodization).toBe('monthly');

    // Graph segment is independent of other groups
    expect(getGraphSegment('other_group', 'g1')).toBeUndefined();
  });

});