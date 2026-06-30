// @vitest-environment jsdom
//
// ComparisonGroupV1 — regelingen-only group that aggregates multiple
// regeling-code endpoints into a single row, then groups columns
// by prefix (mw, vv, ims, imk, wd, wnw) into a comparison table.
//
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { resetStore, initPageStore, buildGroup, fakePage, buildPageConfig } from './helpers/harness';
import { ComparisonGroupV1 } from '../src/pages/regelingen/groups/comparison-group';
import type { IPageConfig, IGroupMappingV2 } from '../src/shared/interfaces';

const groups: Record<string, new (...args: any[]) => any> = { ComparisonGroupV1 };

beforeEach(() => {
  resetStore();
});

// ---------------------------------------------------------------------------
// Config slice — mirrors regelingen/all_vergelijk
// Uses one graph with 4 params (Duur, Toekenningspercentage, Bezwaarpercentage, Waardering)
// each with column prefix mw_ → resolves to regeling_code=eq.MW
// ---------------------------------------------------------------------------
const GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'all_vergelijk',
  ctrlr: 'ComparisonGroupV1',
  graphs: [
    {
      slug: 'vergelijk_numbers',
      ctrlr: 'NumbersV1',
      header: 'Fysieke schade: maatwerk',
      parameters: [[
        { label: 'Duur', column: 'mw_dlt_gerealiseerd_mediaan_dagen', colour: 'orange', units: 'mediaan dagen tot besluit' },
        { label: 'Toekenningspercentage', column: 'mw_toegekend_cumul_perc', colour: 'moss', format: 'percentage', units: 'toegekend' },
        { label: 'Bezwaarpercentage', column: 'mw_bz_vertraagd_jaar_perc', colour: 'blue', format: 'percentage', units: 'bezwaar gemaakt' },
        { label: 'Waardering', column: 'fysieke_schade_doorlopend_cijfer', colour: 'purple', format: 'decimals', units: 'waardering' },
      ], []],
      segment: { key: 'mw_dlt_gerealiseerd_mediaan_dagen', cumulative: false, periodization: 'weekly' },
    },
  ],
  segment: { key: 'mw_dlt_gerealiseerd_mediaan_dagen', cumulative: false, periodization: 'weekly' },
  functionality: ['table'],
  endpoints: [],
};

const PAGE_CONFIG: IPageConfig = buildPageConfig(
  'regelingen',
  { key: 'mw_dlt_gerealiseerd_mediaan_dagen', cumulative: false, periodization: 'weekly' },
  [GROUP_CONFIG],
  [],
);

// ---------------------------------------------------------------------------
// Raw data with fields that mapRow can derive _year, _week, _startdatum, etc. from
// ---------------------------------------------------------------------------

const MW_ENDPOINT = 'regelingen?aggregatie=eq.week&regeling_code=eq.MW&order=periode.desc&limit=1';
const TEVREDENHEID = 'tevredenheid';

const RAW_PAYLOADS: Record<string, any[]> = {
  [MW_ENDPOINT]: [
    {
      aggregatie: 'week',
      periode: '2025_12',
      periode_vanaf: '2025-03-24',
      periode_totenmet: '2025-03-30',
      // mapRow-derived fields that aggregateDataForPeriod copies into merged row
      _isNewApi: true,
      _year: '2025',
      _yearmonth: '2025_03',
      _yearweek: '2025_12',
      _month: '03',
      _week: '12',
      _startdatum: '2025-03-24',
      _einddatum: '2025-03-30',
      dlt_gerealiseerd_mediaan_dagen: 38,
      toegekend_cumul_perc: 61,
      bz_vertraagd_jaar_perc: 4,
      doorlopend_cijfer: 7.1,
    },
  ],
  [TEVREDENHEID]: [
    {
      _date: '2026-06-22',
      doorlopend_cijfer: 6.8,
      aantal_respondenten: 85279,
    },
  ],
};

// ---------------------------------------------------------------------------
// Build helper — uses fixtureData so rows go through mapRow
// ---------------------------------------------------------------------------
function buildAndPrepare() {
  initPageStore(PAGE_CONFIG);
  const page = fakePage(PAGE_CONFIG);
  const group = buildGroup(page, GROUP_CONFIG, groups, 0);
  page.chartArray = [group];

  // Stub console.log (the stray one in ComparisonGroupV1.prepareData)
  vi.spyOn(console, 'log').mockImplementation(() => {});

  // Go through fixtureData so mapRow derives _year, _week, _startdatum, _einddatum
  // But note: ComparisonGroupV1 generates endpoints via getAggregationEndpoints, so
  // resolvedEndpoints is empty and fixtureData won't match.  We pass raw payloads
  // directly (they already carry mapRow-derived _ fields above).
  const data = (group.ctrlr as any).prepareData(RAW_PAYLOADS);

  return { result: data, group, page };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('ComparisonGroupV1', () => {
  describe('getAggregationEndpoints', () => {
    it('builds endpoints from column prefixes — one per prefix', () => {
      initPageStore(PAGE_CONFIG);
      const page = fakePage(PAGE_CONFIG);
      const group = buildGroup(page, GROUP_CONFIG, groups, 0);

      const ctrlr = group.ctrlr as any;
      const eps = ctrlr.getAggregationEndpoints('week');

      expect(eps).toHaveLength(1);
      expect(eps[0]).toContain('regeling_code=eq.MW');
      expect(eps[0]).toContain('aggregatie=eq.week');
    });
  });

  describe('prepareData', () => {
    it('calls super.prepareData and builds data from aggregated endpoints', () => {
      const { result, group } = buildAndPrepare();

      expect(result).toHaveProperty('numbers');
      expect(result).toHaveProperty('graphDataWeek');
      expect(result).toHaveProperty('weekTableCumul');
    });

    it('weekTableCumul is populated (from the custom tables() call)', () => {
      const { result } = buildAndPrepare();
      expect(result.weekTableCumul).toBeDefined();
      expect(result.weekTableCumul).not.toBeNull();
    });

    it('renders the cumul table into the DOM without undefined/Invalid Date', () => {
      const { result, group, page } = buildAndPrepare();

      // Mount the group and populate the table into the DOM
      // Mount the htmlContainer (GroupControllerV1.html() builds into page.main.htmlContainer)
      document.body.appendChild(page.main.htmlContainer);
      group.ctrlr.html();
      group.ctrlr.populateTable(result);

      // Check the cumul table by ID — it has the actual comparison data
      const cumulTable = document.querySelector('#week-table-cumul') as HTMLTableElement;
      expect(cumulTable).toBeDefined();
      expect(cumulTable.classList.contains('hidden')).toBe(true); // hidden by toggler, not by data

      // The cumul table's thead shows headers from the comparison group
      const headers = cumulTable.querySelectorAll('th');
      expect(headers.length).toBeGreaterThan(0);

      // The tbody rows contain actual cell values
      const cells = cumulTable.querySelectorAll('td');
      expect(cells.length).toBeGreaterThan(0);

      // None of the rendered values should be "undefined" or "Invalid Date"
      for (const cell of Array.from(cells)) {
        expect(cell.textContent).not.toBe('undefined');
        expect(cell.textContent).not.toContain('Invalid Date');
      }
    });

    it('overrides weekTableInc, monthTableInc, monthTableCumul to empty arrays', () => {
      const { result } = buildAndPrepare();
      expect(result.weekTableInc).toEqual([]);
      expect(result.monthTableInc).toEqual([]);
      expect(result.monthTableCumul).toEqual([]);
    });

    it('definitions and timeline are present', () => {
      const { result } = buildAndPrepare();
      expect(result).toHaveProperty('definitions');
      expect(result).toHaveProperty('timeline');
    });
  });
});