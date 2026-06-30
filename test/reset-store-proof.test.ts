// @vitest-environment jsdom
//
// Proves that resetStore clears state across tests. Without it, test B
// would inherit test A's segments — the exact cross-page bleed the suite
// exists to catch at the unit level.
//
// This file also documents the exact baseline shape of each store atom
// after reset, so any future test can assert "back to baseline".
//
import { describe, it, expect, beforeEach } from 'vitest';
import { resetStore, initPageStore, fakePage, buildPageConfig } from './helpers/harness';
import { DefaultGroupV1 } from '../src/shared/default-group-v1';
import { pageSegment$, groupSegments$, graphSegments$ } from '../src/stores/segment.store';
import { rawData$, isLoading$ as dataLoading$ } from '../src/stores/data.store';

const groups: Record<string, new (...args: any[]) => any> = { DefaultGroupV1 };

beforeEach(() => {
  resetStore();
});

describe('resetStore baseline', () => {
  // These three tests confirm the baseline shape right after reset.
  // They run first because they're in the first describe block.

  it('page segment has default values after reset', () => {
    expect(pageSegment$.get()).toMatchObject({
      key: '',
      baseKey: '',
      cumulative: true,
      periodization: 'monthly',
      gemeente: 'all',
      vanaf: '2025-01-01',
    });
  });

  it('group segments empty after reset', () => {
    expect(Object.keys(groupSegments$.get())).toHaveLength(0);
  });

  it('graph segments empty after reset', () => {
    expect(Object.keys(graphSegments$.get())).toHaveLength(0);
  });

  it('rawData$ empty after reset', () => {
    expect(rawData$.get()).toEqual({});
  });
});

describe('state modification and isolation', () => {
  const GROUP_CONFIG = {
    slug: 'test_group',
    ctrlr: 'DefaultGroupV1',
    filters: [],
    graphs: [
      {
        slug: 'g1',
        ctrlr: 'NumbersMultiplesV1',
        parameters: [[], []],
        segment: { key: 'x', cumulative: true, periodization: 'monthly' as const },
      },
    ],
    segment: { key: 'x', cumulative: true, periodization: 'monthly' as const },
    functionality: [],
    endpoints: [],
  };

  it('sets page segment key to "first" and groupSegments to non-empty', () => {
    const config = buildPageConfig('p1',
      { key: 'first', cumulative: true, periodization: 'monthly' },
      [GROUP_CONFIG],
    );
    initPageStore(config);

    expect(pageSegment$.get().key).toBe('first');
    expect(Object.keys(groupSegments$.get()).length).toBeGreaterThan(0);
  });

  it('is back to baseline after beforeEach — page.key is "" not "first"', () => {
    // If the previous test's state bled through, key would be 'first'.
    // Since resetStore runs in beforeEach, it should be empty string.
    expect(pageSegment$.get().key).toBe('');
  });

  it('group segments empty after reset — does not carry "x" from previous test', () => {
    expect(Object.keys(groupSegments$.get())).toHaveLength(0);
  });
});