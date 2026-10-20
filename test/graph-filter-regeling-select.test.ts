// @vitest-environment jsdom
//
// Regression/feature test: the graph-level "regelingSelect" filter renders one
// option per compensated regeling and swaps segment.regeling (mw | vv | imk |
// ims | wd | wnw) without refetching, and KTORatingsV1 resolves its prefixed
// parameter columns against that regeling. Like domeinSelect it composes with
// monthSelect because `regeling` is orthogonal to `key`.
//
// Example group: waardering → waardering_regeling → mw_cijfer_regeling
// (KTORatingsV1, filters ["regelingSelect", "monthSelect"],
// RegelingComparisonGroupV1 merges the per-regeling endpoints into prefixed
// columns in the already-fetched data).
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
import { KTORatingsV1 } from '../src/pages/waardering/graphs/kto-ratings-v1';
import { REGELINGEN } from '../src/widgets/regeling-selector';
import { getGraphSegment } from '../src/stores/segment.store';
import type { IPageConfig, IGroupMappingV2 } from '../src/shared/interfaces';

const groups: Record<string, new (...args: any[]) => any> = { DefaultGroupV1 };

// Mirrors group "waardering_regeling" in src/pages/waardering/config.ts.
// Parameters are authored for the default regeling (mw_*) and resolved
// against segment.regeling inside KTORatingsV1.
const GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'waardering_regeling',
  ctrlr: 'DefaultGroupV1',
  filters: [],
  graphs: [
    {
      slug: 'mw_cijfer_regeling',
      ctrlr: 'KTORatingsV1',
      args: [],
      filters: ['regelingSelect', 'monthSelect'],
      parameters: [
        [
          { label: 'Doorlopend', column: 'mw_kto_score_gemiddeld_cumul', colour: 'orange' },
          { label: 'Maandcijfer', column: 'mw_kto_score_gemiddeld', colour: 'orange' },
          { label: 'Respondenten doorlopend', column: 'mw_kto_score_totaal_cumul', colour: 'orange', excludeFromTable: true },
          { label: 'Respondenten', column: 'mw_kto_score_totaal', colour: 'orange' },
        ],
        [{ label: '1', column: 'mw_kto_score_1_aantal_cumul', colour: 'orange' }],
        [{ label: '1', column: 'mw_kto_score_1_aantal', colour: 'orange' }],
      ],
      segment: { key: 'all', regeling: 'mw', cumulative: true, periodization: 'monthly' },
    },
  ],
  segment: { key: 'all', regeling: 'mw', cumulative: true, periodization: 'monthly' },
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

function renderFilter(): {
  wrapper: HTMLElement;
  ctrlr: KTORatingsV1;
} {
  initPageStore(PAGE_CONFIG);
  const page = fakePage(PAGE_CONFIG);
  const group = buildGroup(page, GROUP_CONFIG, groups, 0);

  // Merged regeling data as RegelingComparisonGroupV1 would produce it: the
  // same periods with per-regeling prefixed columns, plus the _yearmonth key
  // the month selector + selectedMonth look up.
  group.data = {
    graphDataMonth: [
      {
        _month: 3,
        _year: 2025,
        _yearmonth: '2025_03',
        mw_kto_score_1_aantal_cumul: 5,
        vv_kto_score_1_aantal_cumul: 6,
        imk_kto_score_1_aantal_cumul: 2,
        ims_kto_score_1_aantal_cumul: 7,
        wd_kto_score_1_aantal_cumul: 4,
        wnw_kto_score_1_aantal_cumul: 3,
        mw_kto_score_gemiddeld_cumul: 7.2,
        ims_kto_score_gemiddeld_cumul: 6.1,
      },
      {
        _month: 2,
        _year: 2025,
        _yearmonth: '2025_02',
        mw_kto_score_1_aantal_cumul: 3,
        ims_kto_score_1_aantal_cumul: 9,
      },
    ],
  };

  document.body.appendChild(group.element);
  const wrapper = group.element;

  const ctrlr = new KTORatingsV1(
    'mw_cijfer_regeling',
    page,
    group,
    group.data,
    GROUP_CONFIG.graphs[0].parameters,
    [],
    ['regelingSelect', 'monthSelect'],
    { key: 'all', cumulative: true, periodization: 'monthly', regeling: 'mw' },
    0,
  );
  ctrlr._html();

  return { wrapper, ctrlr };
}

describe('graph-level regelingSelect filter', () => {
  it('renders one option per compensated regeling (mw/vv/imk/ims/wd/wnw)', () => {
    const { wrapper } = renderFilter();

    const select = wrapper.querySelector(
      '#mw_cijfer_regeling_regeling_0',
    ) as HTMLSelectElement;

    expect(select).not.toBeNull();
    expect(Array.from(select.options).map((o) => o.value)).toEqual(
      REGELINGEN.map((r) => r.prefix),
    );
    expect(REGELINGEN.map((r) => r.prefix)).toEqual([
      'mw',
      'vv',
      'ims',
      'imk',
      'wd',
      'wnw',
    ]);
  });

  it('preselects the graph segment regeling (initially mw)', () => {
    const { wrapper } = renderFilter();
    const select = wrapper.querySelector(
      '#mw_cijfer_regeling_regeling_0',
    ) as HTMLSelectElement;

    expect(select.value).toBe('mw');
  });

  it('selecting a regeling updates segment.regeling and resolves prefixed columns', () => {
    const { wrapper, ctrlr } = renderFilter();
    const select = wrapper.querySelector(
      '#mw_cijfer_regeling_regeling_0',
    ) as HTMLSelectElement;

    // Baseline: authored mw_* columns, cumulative=true → dataIndex 1,
    // read from the first (most recent) month row.
    expect(ctrlr.prepareData(ctrlr.group.data).numbers[0].value).toBe(5);

    const updateSpy = vi.spyOn(ctrlr, 'update');
    select.value = 'ims';
    select.dispatchEvent(new Event('change'));

    const seg = getGraphSegment('waardering_regeling', 'mw_cijfer_regeling');
    expect(seg?.regeling).toBe('ims');

    // key is untouched → composes with monthSelect.
    expect(seg?.key).toBe('all');
    expect(updateSpy).toHaveBeenCalledWith(expect.anything(), true);

    // prepareData now resolves the mw_* authored column to ims_*.
    expect(ctrlr.prepareData(ctrlr.group.data).numbers[0].value).toBe(7);
  });

  it('switching regeling does not clobber a selected month', () => {
    const { wrapper, ctrlr } = renderFilter();
    vi.spyOn(ctrlr, 'update');
    const regeling = wrapper.querySelector(
      '#mw_cijfer_regeling_regeling_0',
    ) as HTMLSelectElement;
    const month = wrapper.querySelector(
      '#mw_cijfer_regeling_0',
    ) as HTMLSelectElement;

    // Pick a specific month first (cumulative=false).
    month.value = '2025_02';
    month.dispatchEvent(new Event('change'));
    expect(getGraphSegment('waardering_regeling', 'mw_cijfer_regeling')?.key).toBe(
      '2025_02',
    );

    // Now pick a regeling — the month selection must survive.
    regeling.value = 'wd';
    regeling.dispatchEvent(new Event('change'));

    const seg = getGraphSegment('waardering_regeling', 'mw_cijfer_regeling');
    expect(seg?.key).toBe('2025_02');
    expect(seg?.regeling).toBe('wd');
    expect(seg?.cumulative).toBe(false);
  });
});
