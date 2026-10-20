// @vitest-environment jsdom
//
// Regression/feature test: the graph-level "domeinSelect" filter renders one
// option per KTO domein and swaps segment.domein (totaal | fysiek | ims | wdl)
// without refetching, and KTORatingsV1 resolves its prefixed parameter columns
// against that domein. The domein selector composes with monthSelect because
// `domein` is orthogonal to `key`.
//
// Example group: waardering → waardering_domein → fs_cijfer_domein
// (KTORatingsV1, filters ["domeinSelect", "monthSelect"], DomainComparisonGroupV1
// merges Totaal/FYSIEK/IMS/WDL endpoints into prefixed columns).
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
import { getGraphSegment } from '../src/stores/segment.store';
import type { IPageConfig, IGroupMappingV2 } from '../src/shared/interfaces';

const groups: Record<string, new (...args: any[]) => any> = { DefaultGroupV1 };

// Mirrors group "waardering_domein" in src/pages/waardering/config.ts.
// Parameters are authored for the default domein (fysiek_*) and resolved
// against segment.domein inside KTORatingsV1.
const GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'waardering_domein',
  ctrlr: 'DefaultGroupV1',
  filters: [],
  graphs: [
    {
      slug: 'fs_cijfer_domein',
      ctrlr: 'KTORatingsV1',
      args: [],
      filters: ['domeinSelect', 'monthSelect'],
      parameters: [
        [
          { label: 'Doorlopend', column: 'fysiek_kto_score_gemiddeld_cumul', colour: 'orange' },
          { label: 'Maandcijfer', column: 'fysiek_kto_score_gemiddeld', colour: 'orange' },
          { label: 'Respondenten doorlopend', column: 'fysiek_kto_score_totaal_cumul', colour: 'orange', excludeFromTable: true },
          { label: 'Respondenten', column: 'fysiek_kto_score_totaal', colour: 'orange' },
        ],
        [{ label: '1', column: 'fysiek_kto_score_1_aantal_cumul', colour: 'orange' }],
        [{ label: '1', column: 'fysiek_kto_score_1_aantal', colour: 'orange' }],
      ],
      segment: { key: 'all', domein: 'fysiek', cumulative: true, periodization: 'monthly' },
    },
  ],
  segment: { key: 'all', domein: 'fysiek', cumulative: true, periodization: 'monthly' },
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

  // Merged domein data as DomainComparisonGroupV1 would produce it: the same
  // periods with per-domein prefixed columns, plus the _yearmonth key the
  // month selector + selectedMonth look up.
  group.data = {
    graphDataMonth: [
      {
        _month: 3,
        _year: 2025,
        _yearmonth: '2025_03',
        fysiek_kto_score_1_aantal_cumul: 5,
        ims_kto_score_1_aantal_cumul: 7,
        wdl_kto_score_1_aantal_cumul: 2,
        totaal_kto_score_1_aantal_cumul: 14,
        fysiek_kto_score_gemiddeld_cumul: 7.2,
        ims_kto_score_gemiddeld_cumul: 6.1,
      },
      {
        _month: 2,
        _year: 2025,
        _yearmonth: '2025_02',
        fysiek_kto_score_1_aantal_cumul: 3,
        ims_kto_score_1_aantal_cumul: 9,
      },
    ],
  };

  document.body.appendChild(group.element);
  const wrapper = group.element;

  const ctrlr = new KTORatingsV1(
    'fs_cijfer_domein',
    page,
    group,
    group.data,
    GROUP_CONFIG.graphs[0].parameters,
    [],
    ['domeinSelect', 'monthSelect'],
    { key: 'all', cumulative: true, periodization: 'monthly', domein: 'fysiek' },
    0,
  );
  ctrlr._html();

  return { wrapper, ctrlr };
}

describe('graph-level domeinSelect filter', () => {
  it('renders one option per KTO domein (totaal/fysiek/ims/wdl)', () => {
    const { wrapper } = renderFilter();

    const select = wrapper.querySelector(
      '#fs_cijfer_domein_domein_0',
    ) as HTMLSelectElement;

    expect(select).not.toBeNull();
    expect(Array.from(select.options).map((o) => o.value)).toEqual([
      'totaal',
      'fysiek',
      'ims',
      'wdl',
    ]);
  });

  it('preselects the graph segment domein (initially fysiek)', () => {
    const { wrapper } = renderFilter();
    const select = wrapper.querySelector(
      '#fs_cijfer_domein_domein_0',
    ) as HTMLSelectElement;

    expect(select.value).toBe('fysiek');
  });

  it('selecting a domein updates segment.domein and resolves prefixed columns', () => {
    const { wrapper, ctrlr } = renderFilter();
    const select = wrapper.querySelector(
      '#fs_cijfer_domein_domein_0',
    ) as HTMLSelectElement;

    // Baseline: authored fysiek_* columns, cumulative=true → dataIndex 1,
    // read from the first (most recent) month row.
    expect(ctrlr.prepareData(ctrlr.group.data).numbers[0].value).toBe(5);

    const updateSpy = vi.spyOn(ctrlr, 'update');
    select.value = 'ims';
    select.dispatchEvent(new Event('change'));

    const seg = getGraphSegment('waardering_domein', 'fs_cijfer_domein');
    expect(seg?.domein).toBe('ims');

    // key is untouched → composes with monthSelect.
    expect(seg?.key).toBe('all');
    expect(updateSpy).toHaveBeenCalledWith(expect.anything(), true);

    // prepareData now resolves the fysiek_* authored column to ims_*.
    expect(ctrlr.prepareData(ctrlr.group.data).numbers[0].value).toBe(7);
  });

  it('switching domein does not clobber a selected month', () => {
    const { wrapper, ctrlr } = renderFilter();
    vi.spyOn(ctrlr, 'update');
    const domein = wrapper.querySelector(
      '#fs_cijfer_domein_domein_0',
    ) as HTMLSelectElement;
    const month = wrapper.querySelector(
      '#fs_cijfer_domein_0',
    ) as HTMLSelectElement;

    // Pick a specific month first (cumulative=false).
    month.value = '2025_02';
    month.dispatchEvent(new Event('change'));
    expect(getGraphSegment('waardering_domein', 'fs_cijfer_domein')?.key).toBe(
      '2025_02',
    );

    // Now pick a domein — the month selection must survive.
    domein.value = 'wdl';
    domein.dispatchEvent(new Event('change'));

    const seg = getGraphSegment('waardering_domein', 'fs_cijfer_domein');
    expect(seg?.key).toBe('2025_02');
    expect(seg?.domein).toBe('wdl');
    expect(seg?.cumulative).toBe(false);
  });
});
