// @vitest-environment jsdom
//
// Regression: changing the group-level domein/regeling selector on the
// waardering page reset the graph-level month selector from "Doorlopend"
// (key "all") to the latest month.
//
// Cause: the group-level filters write segment.domein / segment.regeling to the
// opted-in graphs and then call GroupControllerV1.update(), which blindly
// cascaded the group's static key (a base-column name like
// "fysiek_kto_score_gemiddeld") onto every graph — including graphs that author
// their own key ("all" or a year-month) for the monthSelect filter. KTORatingsV1
// then fell out of its cumulative/Doorlopend branch and rendered the latest
// month's Maandcijfer column.
//
// Fix: update() skips the key cascade for graphs that author their own key.
//
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { resetStore, initPageStore, buildGroup, fakePage } from './helpers/harness';
import { DefaultGroupV1 } from '../src/shared/default-group-v1';
import { DomainComparisonGroupV1 } from '../src/pages/waardering/groups/domain-comparison-group';
import { RegelingComparisonGroupV1 } from '../src/pages/waardering/groups/regeling-comparison-group';
import pageConfig from '../src/pages/waardering/config';
import { getGraphSegment, updateGraphSegment } from '../src/stores/segment.store';

const groups: Record<string, new (...args: any[]) => any> = {
  DefaultGroupV1,
  DomainComparisonGroupV1,
  RegelingComparisonGroupV1,
};

beforeEach(() => {
  resetStore();
  document.body.innerHTML = '';
});

// Construct a real waardering group the way PageController.init does, then
// stub the parts of update() that need a fully mounted page (tabs, table,
// definitions, data preparation) so the segment cascade is what gets exercised.
function mountGroup(slug: string) {
  initPageStore(pageConfig);
  const page = fakePage(pageConfig);
  const cfg = pageConfig.groups.find((g) => g.slug === slug)!;
  const group = buildGroup(page, cfg, groups, 0);

  page.chartArray = [group];
  (group.ctrlr as any).tabs = { redraw: vi.fn() };
  (group.ctrlr as any).populateTable = vi.fn();
  (group.ctrlr as any).populateDefinitions = vi.fn();
  (group.ctrlr as any).prepareData = (d: any) => d;

  group.graphs = cfg.graphs.map((g: any) => ({
    slug: g.slug,
    ctrlr: { slug: g.slug, update: vi.fn() },
  })) as any;

  return group;
}

describe('waardering group update preserves the per-graph month key', () => {
  it('domeinSelect path: fs_cijfer_domein stays on Doorlopend ("all")', () => {
    const group = mountGroup('waardering_regelingen');

    const before = getGraphSegment('waardering_regelingen', 'fs_cijfer_domein');
    expect(before?.key).toBe('all');
    expect(before?.cumulative).toBe(true);

    // What the group-level domein selector does, then the group update.
    updateGraphSegment('waardering_regelingen', 'fs_cijfer_domein', {
      domein: 'ims',
    });
    group.ctrlr.update({}, undefined, true);

    const after = getGraphSegment('waardering_regelingen', 'fs_cijfer_domein');
    expect(after?.key).toBe('all');
    expect(after?.cumulative).toBe(true);
    expect(after?.domein).toBe('ims');
  });

  it('regelingSelect path: mw_cijfer_regeling stays on Doorlopend ("all")', () => {
    const group = mountGroup('waardering_regelingsvarianten');

    expect(
      getGraphSegment('waardering_regelingsvarianten', 'mw_cijfer_regeling')
        ?.key,
    ).toBe('all');

    updateGraphSegment('waardering_regelingsvarianten', 'mw_cijfer_regeling', {
      regeling: 'vv',
    });
    group.ctrlr.update({}, undefined, true);

    const after = getGraphSegment(
      'waardering_regelingsvarianten',
      'mw_cijfer_regeling',
    );
    expect(after?.key).toBe('all');
    expect(after?.cumulative).toBe(true);
    expect(after?.regeling).toBe('vv');
  });

  it('a specifically selected month is preserved across the same change', () => {
    const group = mountGroup('waardering_regelingen');

    updateGraphSegment('waardering_regelingen', 'fs_cijfer_domein', {
      key: '2025_02',
      cumulative: false,
    });

    updateGraphSegment('waardering_regelingen', 'fs_cijfer_domein', {
      domein: 'wdl',
    });
    group.ctrlr.update({}, undefined, true);

    const after = getGraphSegment('waardering_regelingen', 'fs_cijfer_domein');
    expect(after?.key).toBe('2025_02');
    expect(after?.cumulative).toBe(false);
  });

  it('graphs that do NOT author a key still follow the group key cascade', () => {
    const inheritedConfig = {
      slug: 'inherited_group',
      ctrlr: 'DefaultGroupV1',
      filters: [],
      graphs: [
        {
          slug: 'inherited_graph',
          ctrlr: 'NumbersV1',
          filters: [],
          parameters: [
            [{ label: 'A', column: 'kolom_a', colour: 'blue' }],
          ],
          // No `key` → inherits from the group.
          segment: { cumulative: true, periodization: 'monthly' as const },
        },
      ],
      segment: {
        key: 'kolom_a',
        cumulative: true,
        periodization: 'monthly' as const,
      },
      functionality: [],
      endpoints: [],
    };

    initPageStore({
      slug: 'test',
      segment: { key: '', cumulative: true, periodization: 'monthly' } as any,
      filters: [],
      endpoints: [],
      groups: [inheritedConfig],
    });
    const page = fakePage({
      slug: 'test',
      segment: { key: '', cumulative: true, periodization: 'monthly' } as any,
      filters: [],
      endpoints: [],
      groups: [inheritedConfig],
    });
    const group = buildGroup(page, inheritedConfig as any, groups, 0);

    page.chartArray = [group];
    (group.ctrlr as any).tabs = { redraw: vi.fn() };
    (group.ctrlr as any).populateTable = vi.fn();
    (group.ctrlr as any).populateDefinitions = vi.fn();
    (group.ctrlr as any).prepareData = (d: any) => d;
    group.graphs = [
      { slug: 'inherited_graph', ctrlr: { slug: 'inherited_graph', update: vi.fn() } },
    ] as any;

    group.ctrlr.update({}, undefined, true);

    expect(
      getGraphSegment('inherited_group', 'inherited_graph')?.key,
    ).toBe('kolom_a');
  });
});
