// @vitest-environment jsdom
//
// Feature test: the group-level "domeinSelect" filter renders one option per
// KTO domein and, on change, writes segment.domein to every graph in the group
// whose config segment opts in via `domein` — while leaving graphs without it
// (the all-domains numbers comparison) untouched. Plus: KtoBarTrendV1, the
// domain-aware trend controller, resolves its authored fysiek_* column against
// the selected domein and draws from the merged month data.
//
// Example group: waardering → waardering_regelingen (DomainComparisonGroupV1
// merges FYSIEK/IMS/WDL endpoints; group-level domeinSelect governs
// fs_cijfer_domein + domein_trend, excluding tevredenheid_numbers_v1).
//
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  resetStore,
  initPageStore,
  buildGroup,
  fakePage,
  buildPageConfig,
} from './helpers/harness';
import { DefaultGroupV1 } from '../src/shared/default-group-v1';
import { HtmlGroupFilters } from '../src/widgets/html-group-filters';
import { KtoBarTrendV1 } from '../src/pages/waardering/graphs/kto-bar-trend-v1';
import { NumbersPlusRespondentsV1 } from '../src/charts/controllers/numbers-respondents-v1';
import { elements } from '../src/charts';
import { getGraphSegment, updateGraphSegment } from '../src/stores/segment.store';
import type { IPageConfig, IGroupMappingV2 } from '../src/shared/interfaces';

const groups: Record<string, new (...args: any[]) => any> = { DefaultGroupV1 };

// Mirrors group "waardering_regelingen" in src/pages/waardering/config.ts.
// Parameters are authored for the default domein (fysiek_*) and resolved
// against segment.domein by KTORatingsV1 / KtoBarTrendV1.
const GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'waardering_regelingen',
  ctrlr: 'DefaultGroupV1',
  filters: ['domeinSelect'],
  graphs: [
    {
      slug: 'tevredenheid_numbers_v1',
      ctrlr: 'NumbersPlusRespondentsV1',
      args: [],
      filters: [],
      parameters: [
        [{ label: 'Fysieke schade', column: 'fysiek_kto_score_gemiddeld_cumul', colour: 'moss' }],
        [{ label: 'Fysieke schade', column: 'fysiek_kto_score_totaal_cumul', units: 'respondenten' }],
      ],
      // No `domein` → excluded from the group-level selector.
      segment: { key: 'fysiek_kto_score_gemiddeld_cumul', cumulative: true, periodization: 'monthly' },
    },
    {
      slug: 'fs_cijfer_domein',
      ctrlr: 'KTORatingsV1',
      args: [],
      filters: ['monthSelect'],
      parameters: [
        [{ label: 'Doorlopend', column: 'fysiek_kto_score_gemiddeld_cumul' }],
      ],
      segment: { key: 'all', domein: 'fysiek', cumulative: true, periodization: 'monthly' },
    },
    {
      slug: 'domein_trend',
      ctrlr: 'KtoBarTrendV1',
      args: [],
      filters: [],
      parameters: [
        [{ label: 'Waardering', column: 'fysiek_kto_score_gemiddeld', format: 'decimals' }],
      ],
      segment: { key: 'fysiek_kto_score_gemiddeld', domein: 'fysiek', cumulative: false, periodization: 'monthly' },
    },
  ],
  segment: { key: 'fysiek_kto_score_gemiddeld', domein: 'fysiek', cumulative: true, periodization: 'monthly' },
  functionality: [],
  endpoints: [],
};

const PAGE_CONFIG: IPageConfig = buildPageConfig(
  'waardering',
  { key: 'all', cumulative: true, periodization: 'monthly' },
  [GROUP_CONFIG],
);

beforeEach(() => {
  resetStore();
  document.body.innerHTML = '';
});

function renderGroupFilter(): { wrapper: HTMLElement; ctrlr: DefaultGroupV1 } {
  initPageStore(PAGE_CONFIG);
  const page = fakePage(PAGE_CONFIG);
  const group = buildGroup(page, GROUP_CONFIG, groups, 0);

  // HtmlGroupFilters.init() anchors the filter list after .source_attribution
  // inside this.ctrlr.groupWrapper, so give the controller a wrapper with one.
  const wrapper = document.createElement('div');
  const srcAttr = document.createElement('div');
  srcAttr.classList.add('source_attribution');
  wrapper.appendChild(srcAttr);
  document.body.appendChild(wrapper);

  (group.ctrlr as any).groupWrapper = wrapper;
  const filters = new HtmlGroupFilters(group.ctrlr);
  filters.draw(group.ctrlr.segment);

  return { wrapper, ctrlr: group.ctrlr };
}

describe('group-level domeinSelect filter', () => {
  it('renders one option per KTO domein and preselects the config domein', () => {
    const { wrapper } = renderGroupFilter();

    const select = wrapper.querySelector(
      '#waardering_regelingen_domein_0',
    ) as HTMLSelectElement;

    expect(select).not.toBeNull();
    expect(Array.from(select.options).map((o) => o.value)).toEqual([
      'totaal',
      'fysiek',
      'ims',
      'wdl',
    ]);
    expect(select.value).toBe('fysiek');
  });

  it('updates opted-in graphs and leaves the numbers graph untouched', () => {
    const { wrapper, ctrlr } = renderGroupFilter();
    const updateSpy = vi.spyOn(ctrlr, 'update');

    const select = wrapper.querySelector(
      '#waardering_regelingen_domein_0',
    ) as HTMLSelectElement;
    select.value = 'ims';
    select.dispatchEvent(new Event('change'));

    expect(
      getGraphSegment('waardering_regelingen', 'fs_cijfer_domein')?.domein,
    ).toBe('ims');
    expect(
      getGraphSegment('waardering_regelingen', 'domein_trend')?.domein,
    ).toBe('ims');

    // Excluded: the numbers graph never receives the domain update.
    expect(
      getGraphSegment('waardering_regelingen', 'tevredenheid_numbers_v1')
        ?.domein,
    ).toBe('fysiek');

    // Orthogonal fields survive (composes with graph-level monthSelect).
    expect(
      getGraphSegment('waardering_regelingen', 'fs_cijfer_domein')?.key,
    ).toBe('all');
    expect(updateSpy).toHaveBeenCalled();
  });
});

describe('NumbersPlusRespondentsV1 circle dedup', () => {
  it('draw() renders a single circle even when called repeatedly', async () => {
    initPageStore(PAGE_CONFIG);
    const page = fakePage(PAGE_CONFIG);
    const group = buildGroup(page, GROUP_CONFIG, groups, 0);

    const ctrlr = new NumbersPlusRespondentsV1(
      'tevredenheid_numbers_v1',
      page,
      group,
      group.data,
      GROUP_CONFIG.graphs[0].parameters,
      [],
      [],
      0,
    );
    // els (one element per parameter column + label) is built by html(), not
    // _html().
    ctrlr.html();

    // init() would also run update()→redraw() against empty data, so seed the
    // per-column circle renderers exactly like NumbersPlusRespondentsV1.init():
    for (const p of GROUP_CONFIG.graphs[0].parameters[0]) {
      ctrlr.numbers[p.column] = new elements.HtmlNumberCircleRespondents(
        ctrlr,
        p,
        ctrlr.els[p.column],
      );
    }

    const col = GROUP_CONFIG.graphs[0].parameters[0][0].column;
    const el: HTMLElement = ctrlr.els[col];

    // _update() calls draw() once per segment/filter change — each call used
    // to append a fresh circle. draw() must be idempotent.
    await ctrlr.draw(group.data);
    await ctrlr.draw(group.data);
    await ctrlr.draw(group.data);

    expect(el.querySelectorAll('.number_circle_wrap').length).toBe(1);
  });
});

describe('KtoBarTrendV1', () => {
  it('resolves the authored fysiek_* column against segment.domein (month data)', () => {
    initPageStore(PAGE_CONFIG);
    const page = fakePage(PAGE_CONFIG);
    const group = buildGroup(page, GROUP_CONFIG, groups, 0);

    // Merged month rows as DomainComparisonGroupV1 would produce them: every
    // period carries per-domein prefixed columns. No graphDataWeek on purpose —
    // the variant must read graphDataMonth (6-endpoint domein groups have
    // week rows limit=1 per domein, useless for a trend).
    group.data = {
      graphDataMonth: [
        {
          _year: 2025,
          _month: 3,
          _yearmonth: '2025_03',
          fysiek_kto_score_gemiddeld: 7.2,
          ims_kto_score_gemiddeld: 6.1,
          wdl_kto_score_gemiddeld: 8.0,
        },
        {
          _year: 2025,
          _month: 2,
          _yearmonth: '2025_02',
          fysiek_kto_score_gemiddeld: 7.5,
          ims_kto_score_gemiddeld: 6.0,
          wdl_kto_score_gemiddeld: 8.3,
        },
      ],
    };

    updateGraphSegment('waardering_regelingen', 'domein_trend', {
      domein: 'ims',
    });

    const trend = new KtoBarTrendV1(
      'domein_trend',
      page,
      group,
      group.data,
      GROUP_CONFIG.graphs[2].parameters,
      [],
      [],
      0,
    );

    const out = trend.prepareData(group.data);

    // Bars are stored under the authored key but read from the ims_* source.
    expect(out['fysiek_kto_score_gemiddeld'].map((b: any) => b.value)).toEqual([
      6.1,
      6.0,
    ]);
  });
});
