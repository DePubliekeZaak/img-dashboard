// @vitest-environment jsdom
//
// Regression: the BarTrendStackedMakeup popup (tooltip) showed labels but no
// numbers on waardering > respondenten_trend.
//
// Cause: the tooltip hardcoded `parameter.column + "_cumul"` / `"_aantal"` when
// looking the value up in the row. That only works when the parameter declares
// `modifiers: { cumul: "_cumul", delta: "_aantal" }` (all other pages using this
// controller do). respondenten_trend's parameters have NO modifiers — their
// columns (`mw_kto_score_totaal`, …) are already the final API columns — so the
// lookup resolved to a non-existent `*_aantal` column and thousands() rendered
// an empty string.
//
// Fix: resolve the column through graphParams variants (cumul/delta, base
// fallback), mirroring the controller's prepareData. The legacy suffix stays as
// a last-resort fallback so the modifier-based pages are untouched.
//
import { describe, it, expect, beforeEach } from 'vitest';
import {
  resetStore, initPageStore, buildGroup, fakePage, buildPageConfig, buildGraph, mountGroup,
} from './helpers/harness';
import { DefaultGroupV1 } from '../src/shared/default-group-v1';
import { BarTrendStackedMakeup } from '../src/charts/controllers/bar-trend-stacked-makeup';
import type { IGroupMappingV2, IParameterMapping } from '../src/shared/interfaces';

Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });

const groups: Record<string, new (...args: any[]) => any> = { DefaultGroupV1 };

beforeEach(() => {
  resetStore();
  document.body.innerHTML = '';
});

async function renderTooltip(
  slug: string,
  parameters: IParameterMapping[][],
  segment: any,
  rows: any[],
): Promise<{ html: string; group: any }> {
  const graphConf: any = {
    slug,
    ctrlr: 'BarTrendStackedMakeup',
    args: [],
    filters: [],
    parameters,
    segment,
  };
  const groupConf: IGroupMappingV2 = {
    slug: slug + '_group',
    ctrlr: 'DefaultGroupV1',
    filters: [],
    graphs: [graphConf],
    segment,
    functionality: [],
    endpoints: [
      'regelingen?aggregatie=eq.maand&regeling_code=eq.MW&order=periode.desc',
    ],
  };
  const pageConf = buildPageConfig('waardering', segment, [groupConf]);

  initPageStore(pageConf);
  const page = fakePage(pageConf);
  const group = buildGroup(page, groupConf, groups, 0);
  page.chartArray = [group];

  // Hand-built merged month rows (what RegelingComparisonGroupV1 emits).
  group.data = { graphDataMonth: rows, graphDataWeek: rows } as any;

  group.graphs.push({
    slug,
    ctrlr: null as any,
    header: undefined,
    classList: [],
    parameters,
    modifiers: [],
    filters: [],
    segment,
    multiples: false,
    ctrlrName: 'BarTrendStackedMakeup',
  } as any);

  const graph = buildGraph(
    BarTrendStackedMakeup as any,
    page,
    group,
    { slug, parameters, filters: [] },
    0,
  ) as any;
  group.graphs[0].ctrlr = graph;
  mountGroup(group);

  graph.html();
  await graph.init();

  const bar = group.element.querySelector('rect.bar');
  expect(bar).not.toBeNull();
  bar!.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

  const tooltip = document.querySelector('.tooltip');
  expect(tooltip).not.toBeNull();

  return { html: tooltip!.innerHTML, group };
}

describe('BarTrendStackedMakeup tooltip column resolution', () => {
  it('shows values for parameters without modifiers (waardering respondenten_trend)', async () => {
    const { html } = await renderTooltip(
      'fs_trend_respondents',
      [
        [
          { label: 'Fysieke schade', column: 'mw_kto_score_totaal', units: 'respondenten', colour: 'blue' },
          { label: 'Vaste vergoeding', column: 'vv_kto_score_totaal', units: 'respondenten', colour: 'orange' },
        ],
      ] as any,
      { key: 'mw_kto_score_totaal', cumulative: false, periodization: 'monthly' },
      [
        { _month: 9, _year: 2026, _yearmonth: '2026_09', mw_kto_score_totaal: 120, vv_kto_score_totaal: 40 },
        { _month: 8, _year: 2026, _yearmonth: '2026_08', mw_kto_score_totaal: 90, vv_kto_score_totaal: 30 },
      ],
    );

    expect(html).toContain('Fysieke schade');
    expect(html).toContain('120');
    expect(html).toContain('Vaste vergoeding');
    expect(html).toContain('40');
  });

  it('still uses the cumul/delta variants for modifier-based parameters', async () => {
    const { html } = await renderTooltip(
      'makeup_trend',
      [
        [
          {
            label: 'Waardedaling',
            column: 'wdl_ingediend',
            colour: 'moss',
            modifiers: { cumul: '_cumul', delta: '_aantal' },
          },
        ],
      ] as any,
      { key: 'wdl_ingediend', cumulative: false, periodization: 'monthly' },
      [
        {
          _month: 9,
          _year: 2026,
          _yearmonth: '2026_09',
          wdl_ingediend_aantal: 25,
          wdl_ingediend_cumul: 800,
        },
      ],
    );

    // cumulative=false → delta variant `_aantal`, not the raw column or cumul.
    expect(html).toContain('Waardedaling');
    expect(html).toContain('25');
    expect(html).not.toContain('800');
  });
});

describe('BarTrendStackedMakeup legend', () => {
  it("uses the parameter's short abbreviation, falling back to the label", async () => {
    const { group } = await renderTooltip(
      'fs_trend_respondents',
      [
        [
          { label: 'Immateriele schade: kinderen en jongeren', short: 'IMK', column: 'mw_kto_score_totaal', colour: 'blue' },
          { label: 'Fysieke schade', column: 'vv_kto_score_totaal', colour: 'orange' },
        ],
      ] as any,
      { key: 'mw_kto_score_totaal', cumulative: false, periodization: 'monthly' },
      [
        { _month: 9, _year: 2026, _yearmonth: '2026_09', mw_kto_score_totaal: 120, vv_kto_score_totaal: 40 },
      ],
    );

    const items = Array.from(group.element.querySelectorAll('div.legend > div')).map(
      (el: any) => (el.textContent || '').trim(),
    );
    expect(items).toEqual(['IMK', 'Fysieke schade']);
  });
});

describe('BarTrendStackedMakeup tooltip labels', () => {
  it('uses the short abbreviation in the tooltip when the parameter has one', async () => {
    const { html } = await renderTooltip(
      'fs_trend_respondents',
      [
        [
          { label: 'Immateriele schade: kinderen en jongeren', short: 'IMK', column: 'mw_kto_score_totaal', colour: 'blue' },
          { label: 'Fysieke schade', column: 'vv_kto_score_totaal', colour: 'orange' },
        ],
      ] as any,
      { key: 'mw_kto_score_totaal', cumulative: false, periodization: 'monthly' },
      [
        { _month: 9, _year: 2026, _yearmonth: '2026_09', mw_kto_score_totaal: 120, vv_kto_score_totaal: 40 },
      ],
    );

    expect(html).toContain('IMK : 120');
    expect(html).not.toContain('Immateriele schade: kinderen en jongeren');
    // no short → full label, as before
    expect(html).toContain('Fysieke schade : 40');
  });
});
