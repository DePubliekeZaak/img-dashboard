// @vitest-environment jsdom
//
// Tests the base GroupControllerV1 class — not a specific subclass.
// Covers the shared mechanics every group inherits:
//   - week/month endpoint detection via eq.week / eq.maand
//   - complete === true month-row filter
//   - trimColumnsAndOrder — relevant columns preserved, extras dropped
//   - tableParams / graphParams construction incl. removeDuplicates
//
// Uses hand-built data (not recorded fixtures) because these tests assert
// *mechanism*, not production-value correctness.
//
import { describe, it, expect, beforeEach } from 'vitest';
import { resetStore, initPageStore, buildGroup, fakePage, fixtureData, buildPageConfig } from './helpers/harness';
import { GroupControllerV1 } from '../src/shared/group-v1';
import type { IPageConfig, IGroupMappingV2 } from '../src/shared/interfaces';

// Register GroupControllerV1 directly (not through a page registry)
const groups: Record<string, new (...args: any[]) => any> = { GroupControllerV1 };

beforeEach(() => {
  resetStore();
});

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

function rawWeekPeriod(overrides: Record<string, any> = {}) {
  return {
    aggregatie: 'WEEK',
    periode: '2025_12',
    periode_vanaf: '2025-03-24',
    periode_totenmet: '2025-03-30',
    ingediend_aantal: 100,
    ingediend_cumul: 5000,
    extra_field: 'should_be_stripped',
    ...overrides,
  };
}

function rawMonthPeriod(overrides: Record<string, any> = {}) {
  return {
    aggregatie: 'MAAND',
    periode: '2025_03',
    periode_vanaf: '2025-03-01',
    periode_totenmet: '2025-03-31',
    ingediend_aantal: 400,
    ingediend_cumul: 20000,
    complete: overrides.complete !== undefined ? overrides.complete : true,
    extra_field: 'should_be_stripped',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Helper: build a minimal group config
// ---------------------------------------------------------------------------

function makeGroupConfig(overrides: Partial<IGroupMappingV2> = {}): IGroupMappingV2 {
  return {
    slug: 'test_group',
    ctrlr: 'GroupControllerV1',
    filters: [],
    graphs: [
      {
        slug: 'g1',
        ctrlr: 'BarTrendV1',
        parameters: [
          [
            {
              label: 'Ingediend',
              column: 'ingediend',
              colour: 'blue',
              modifiers: { cumul: '_cumul', delta: '_aantal' },
            },
          ],
          [],
        ],
        segment: { key: 'ingediend', cumulative: true, periodization: 'monthly' as const },
      },
    ],
    segment: { key: 'ingediend', cumulative: true, periodization: 'monthly' as const },
    functionality: ['table'],
    endpoints: [
      'regelingen?aggregatie=eq.week&order=periode.desc',
      'regelingen?aggregatie=eq.maand&order=periode.desc',
    ],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('GroupControllerV1 — endpoint detection', () => {
  it('detects week endpoint by "eq.week" in the resolved endpoint string', () => {
    const config = buildPageConfig('test', { key: '', cumulative: true, periodization: 'monthly' }, [
      makeGroupConfig(),
    ]);
    initPageStore(config);
    const page = fakePage(config);
    const group = buildGroup(page, config.groups[0], groups, 0);
    page.chartArray = [group];

    // Only provide week data
    const data = fixtureData({ 'aggregatie=eq.week': [rawWeekPeriod()] }, group.resolvedEndpoints);
    const result = group.ctrlr.prepareData(data);

    // Week data present, month data absent
    expect(result.graphDataWeek).toHaveLength(1);
    expect(result.graphDataMonth).toHaveLength(0);
  });

  it('detects month endpoint by "eq.maand" in the resolved endpoint string', () => {
    const config = buildPageConfig('test', { key: '', cumulative: true, periodization: 'monthly' }, [
      makeGroupConfig(),
    ]);
    initPageStore(config);
    const page = fakePage(config);
    const group = buildGroup(page, config.groups[0], groups, 0);
    page.chartArray = [group];

    const data = fixtureData({ 'aggregatie=eq.maand': [rawMonthPeriod()] }, group.resolvedEndpoints);
    const result = group.ctrlr.prepareData(data);

    expect(result.graphDataMonth).toHaveLength(1);
    expect(result.graphDataWeek).toHaveLength(0);
  });

  it('handles both week and month endpoints simultaneously', () => {
    const config = buildPageConfig('test', { key: '', cumulative: true, periodization: 'monthly' }, [
      makeGroupConfig(),
    ]);
    initPageStore(config);
    const page = fakePage(config);
    const group = buildGroup(page, config.groups[0], groups, 0);
    page.chartArray = [group];

    const data = fixtureData(
      {
        'aggregatie=eq.week': [rawWeekPeriod()],
        'aggregatie=eq.maand': [rawMonthPeriod()],
      },
      group.resolvedEndpoints,
    );
    const result = group.ctrlr.prepareData(data);

    expect(result.graphDataWeek).toHaveLength(1);
    expect(result.graphDataMonth).toHaveLength(1);
  });
});

describe('GroupControllerV1 — complete === true filter', () => {
  it('excludes month rows where complete is false — filter fires when monthGroup === "tevredenheid" exactly', () => {
    // The filter in group-v1.ts checks monthGroup === "tevredenheid" (not .includes()).
    // This is intentional: it only matches the literal endpoint string "tevredenheid",
    // which is a legacy API view name still actively used by KTO/waardering groups.
    // Endpoints like "regelingen?aggregatie=eq.maand&..." match via "eq.maand" and
    // produce a longer monthGroup string, so the === check correctly skips them.
    // The filter fires when monthGroup === "tevredenheid" exactly.
    // To avoid the week detection also matching "tevredenheid", the week
    // endpoint must not contain that string.
    const config = buildPageConfig('test', { key: '', cumulative: true, periodization: 'monthly' }, [
      {
        ...makeGroupConfig(),
        endpoints: [
          'regelingen?aggregatie=eq.week&order=periode.desc',
          'tevredenheid', // bare string — triggers the monthGroup === "tevredenheid" filter
        ],
        graphs: [
          {
            slug: 'g1',
            ctrlr: 'BarTrendV1',
            parameters: [
              [
                {
                  label: 'Ingediend',
                  column: 'ingediend',
                  colour: 'blue',
                  modifiers: { cumul: '_cumul', delta: '_aantal' },
                },
              ],
              [],
            ],
            segment: { key: 'ingediend', cumulative: true, periodization: 'monthly' as const },
          },
        ],
      },
    ]);
    initPageStore(config);
    const page = fakePage(config);
    const group = buildGroup(page, config.groups[0], groups, 0);
    page.chartArray = [group];

    const data = fixtureData(
      {
        'aggregatie=eq.week': [rawWeekPeriod()],
        'tevredenheid': [
          rawMonthPeriod({ complete: true }),
          rawMonthPeriod({ complete: false, periode: '2025_02' }),
        ],
      },
      group.resolvedEndpoints,
    );
    const result = group.ctrlr.prepareData(data);

    // Only the complete:true row survives (2025_03)
    expect(result.graphDataMonth).toHaveLength(1);
    expect(result.graphDataMonth[0]._yearmonth).toBe('2025_03');
  });

  it('does not filter month rows for non-tevredenheid endpoints', () => {
    const config = buildPageConfig('test', { key: '', cumulative: true, periodization: 'monthly' }, [
      makeGroupConfig({
        endpoints: [
          'regelingen?aggregatie=eq.week&order=periode.desc',
          'regelingen?aggregatie=eq.maand&order=periode.desc',
        ],
      }),
    ]);
    initPageStore(config);
    const page = fakePage(config);
    const group = buildGroup(page, config.groups[0], groups, 0);
    page.chartArray = [group];

    const data = fixtureData(
      {
        'aggregatie=eq.week': [rawWeekPeriod()],
        'aggregatie=eq.maand': [
          rawMonthPeriod({ complete: true }),
          rawMonthPeriod({ complete: false, periode: '2025_02' }),
        ],
      },
      group.resolvedEndpoints,
    );
    const result = group.ctrlr.prepareData(data);

    // Both rows survive because the endpoint doesn't trigger the filter
    expect(result.graphDataMonth).toHaveLength(2);
  });
});

describe('GroupControllerV1 — trimColumnsAndOrder', () => {
  it('preserves param columns and defaultColumns, strips extra fields', () => {
    const config = buildPageConfig('test', { key: '', cumulative: true, periodization: 'monthly' }, [
      makeGroupConfig(),
    ]);
    initPageStore(config);
    const page = fakePage(config);
    const group = buildGroup(page, config.groups[0], groups, 0);
    page.chartArray = [group];

    const weekData = [rawWeekPeriod({ extra_field: 'should_be_stripped', ingediend_aantal: 42 })];
    const data = fixtureData({ 'aggregatie=eq.week': weekData }, group.resolvedEndpoints);
    const result = group.ctrlr.prepareData(data);

    const row = result.graphDataWeek[0];
    // Default columns that should be present: _isNewApi, _yearmonth, _yearweek,
    // _month, _week, _year, _startdatum, _einddatum
    expect(row._isNewApi).toBe(true);
    expect(row._year).toBe('2025');  // trimColumnsAndOrder stringifies defaultColumns
    expect(row._yearmonth).toBe('2025_12');

    // Param column preserved
    expect(row.ingediend_aantal).toBe(42);

    // Extra field stripped
    expect(row.extra_field).toBeUndefined();
  });
});

describe('GroupControllerV1 — tableParams / graphParams construction', () => {
  it('paramsAndModifiers builds graphParams with variants from modifiers', () => {
    const config = buildPageConfig('test', { key: '', cumulative: true, periodization: 'monthly' }, [
      makeGroupConfig(),
    ]);
    initPageStore(config);
    const page = fakePage(config);
    const group = buildGroup(page, config.groups[0], groups, 0);

    // graphParams should have 'ingediend' with cumul and delta variants
    const gp = group.graphParams.ingediend;
    expect(gp).toBeDefined();
    expect(gp.base.column).toBe('ingediend');
    expect(gp.variants.cumul.column).toBe('ingediend_cumul');
    expect(gp.variants.delta.column).toBe('ingediend_aantal');
  });

  it('tableParams contains all variant entries', () => {
    const config = buildPageConfig('test', { key: '', cumulative: true, periodization: 'monthly' }, [
      makeGroupConfig(),
    ]);
    initPageStore(config);
    const page = fakePage(config);
    const group = buildGroup(page, config.groups[0], groups, 0);

    const columns = group.tableParams.map((p: any) => p.column);
    expect(columns).toContain('ingediend_cumul');
    expect(columns).toContain('ingediend_aantal');
  });

  it('removeDuplicates eliminates duplicate params from multiple graphs', () => {
    const config = buildPageConfig('test', { key: '', cumulative: true, periodization: 'monthly' }, [
      {
        ...makeGroupConfig(),
        graphs: [
          {
            slug: 'g1',
            ctrlr: 'BarTrendV1',
            parameters: [
              [
                {
                  label: 'Ingediend',
                  column: 'ingediend',
                  colour: 'blue',
                  modifiers: { cumul: '_cumul', delta: '_aantal' },
                },
              ],
              [],
            ],
            segment: { key: 'ingediend', cumulative: true, periodization: 'monthly' as const },
          },
          {
            slug: 'g2',
            ctrlr: 'NumbersV1',
            parameters: [
              [
                {
                  label: 'Ingediend',
                  column: 'ingediend',
                  colour: 'blue',
                  modifiers: { cumul: '_cumul', delta: '_aantal' },
                },
              ],
              [],
            ],
            segment: { key: 'ingediend', cumulative: true, periodization: 'monthly' as const },
          },
        ],
      },
    ]);
    initPageStore(config);
    const page = fakePage(config);
    const group = buildGroup(page, config.groups[0], groups, 0);

    // Even though two graphs define the same param, tableParams should dedupe
    expect(group.tableParams).toHaveLength(2); // ingediend_cumul + ingediend_aantal
  });
});