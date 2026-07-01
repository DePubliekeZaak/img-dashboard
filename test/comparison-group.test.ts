// @vitest-environment jsdom
//
// ComparisonGroupV1 — regelingen-only group that aggregates multiple
// regeling-code endpoints into a single merged row, then renders a
// per-regeling comparison table (rows = regeling types, columns = parameters).
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
// Helper: build the endpoint URL that getAggregationEndpoints generates
// ---------------------------------------------------------------------------
function ep(regelingCode: string, aggregatie = 'week'): string {
  return `regelingen?aggregatie=eq.${aggregatie}&regeling_code=eq.${regelingCode}&order=periode.desc&limit=1`;
}

// ---------------------------------------------------------------------------
// Endpoint keys used in RAW_PAYLOADS
// ---------------------------------------------------------------------------
const MW_EP = ep('MW');
const VV_EP = ep('VV');
const IMS_EP = ep('IMS');
const IMK_EP = ep('IMK');
const WD_EP = ep('WD');
const WNW_EP = ep('WNW');
const TEVREDENHEID = 'tevredenheid';

// ---------------------------------------------------------------------------
// Config slice — mirrors regelingen/all_vergelijk
// 6 graphs, one per regeling type (mw, vv, ims, imk, wd, wnw)
// Each with 4 parameters (Duur, Toekenningspercentage, Bezwaarpercentage, Waardering)
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
    {
      slug: 'vergelijk_numbers',
      ctrlr: 'NumbersV1',
      header: 'Fysieke schade: vaste vergoeding',
      parameters: [[
        { label: 'Duur', column: 'vv_dlt_gerealiseerd_mediaan_dagen', colour: 'orange', units: 'mediaan dagen tot besluit' },
        { label: 'Toekenningspercentage', column: 'vv_toegekend_cumul_perc', colour: 'moss', format: 'percentage', units: 'toegekend' },
        { label: 'Bezwaarpercentage', column: 'vv_bz_vertraagd_jaar_perc', colour: 'blue', format: 'percentage', units: 'bezwaar gemaakt' },
        { label: 'Waardering', column: 'ves_doorlopend_cijfer', colour: 'purple', format: 'decimals', units: 'waardering' },
      ], []],
      segment: { key: 'vv_mediaan_dagen', cumulative: false, periodization: 'weekly' },
    },
    {
      slug: 'vergelijk_numbers',
      ctrlr: 'NumbersV1',
      header: 'Immateriele schade: volwassenen',
      parameters: [[
        { label: 'Duur', column: 'ims_dlt_gerealiseerd_mediaan_dagen', colour: 'orange', units: 'mediaan dagen tot besluit' },
        { label: 'Toekenningspercentage', column: 'ims_toegekend_cumul_perc', colour: 'moss', format: 'percentage', units: 'toegekend' },
        { label: 'Bezwaarpercentage', column: 'ims_bz_vertraagd_jaar_perc', colour: 'blue', format: 'percentage', units: 'bezwaar gemaakt' },
        { label: 'Waardering', column: 'ims_doorlopend_cijfer', colour: 'purple', format: 'decimals', units: 'waardering' },
      ], []],
      segment: { key: 'vv_mediaan_dagen', cumulative: false, periodization: 'weekly' },
    },
    {
      slug: 'vergelijk_numbers',
      ctrlr: 'NumbersV1',
      header: 'Immateriele schade: kinderen en jongeren',
      parameters: [[
        { label: 'Duur', column: 'imk_dlt_gerealiseerd_mediaan_dagen', colour: 'orange', units: 'mediaan dagen tot besluit' },
        { label: 'Toekenningspercentage', column: 'imk_toegekend_cumul_perc', colour: 'moss', format: 'percentage', units: 'toegekend' },
        { label: 'Bezwaarpercentage', column: 'imk_bz_vertraagd_jaar_perc', colour: 'blue', format: 'percentage', units: 'bezwaar gemaakt' },
        { label: 'Waardering', column: 'imkj_doorlopend_cijfer', colour: 'purple', format: 'decimals', units: 'waardering' },
      ], []],
      segment: { key: 'ims_kj_mediaan_dagen', cumulative: false, periodization: 'weekly' },
    },
    {
      slug: 'vergelijk_numbers',
      ctrlr: 'NumbersV1',
      header: 'Waardedaling: woningen',
      parameters: [[
        { label: 'Duur', column: 'wd_dlt_gerealiseerd_mediaan_dagen', colour: 'orange', units: 'mediaan dagen tot besluit' },
        { label: 'Toekenningspercentage', column: 'wd_toegekend_cumul_perc', colour: 'moss', format: 'percentage', units: 'toegekend' },
        { label: 'Bezwaarpercentage', column: 'wd_bz_vertraagd_jaar_perc', colour: 'blue', format: 'percentage', units: 'bezwaar gemaakt' },
        { label: 'Waardering', column: 'waardedaling_doorlopend_cijfer', colour: 'purple', format: 'decimals', units: 'waardering' },
      ], []],
      segment: { key: 'wdw_mediaan_dagen', cumulative: false, periodization: 'weekly' },
    },
    {
      slug: 'vergelijk_numbers',
      ctrlr: 'NumbersV1',
      header: 'Waardedaling: niet woningen',
      parameters: [[
        { label: 'Duur', column: 'wnw_dlt_gerealiseerd_mediaan_dagen', colour: 'orange', units: 'mediaan dagen tot besluit' },
        { label: 'Toekenningspercentage', column: 'wnw_toegekend_cumul_perc', colour: 'moss', format: 'percentage', units: 'toegekend' },
        { label: 'Bezwaarpercentage', column: 'wnw_bz_vertraagd_jaar_perc', colour: 'blue', format: 'percentage', units: 'bezwaar gemaakt' },
        { label: 'Waardering', column: 'waardedaling_doorlopend_cijfer', colour: 'purple', format: 'decimals', units: 'waardering' },
      ], []],
      segment: { key: 'wdnw_mediaan_dagen', cumulative: false, periodization: 'weekly' },
    },
  ],
  segment: { key: 'mw_dlt_gerealiseerd_mediaan_dagen', cumulative: true, periodization: 'weekly' },
  functionality: ['table', 'definitions', 'download'],
  endpoints: [],
};

const PAGE_CONFIG: IPageConfig = buildPageConfig(
  'regelingen',
  { key: 'mw_dlt_gerealiseerd_mediaan_dagen', cumulative: false, periodization: 'weekly' },
  [GROUP_CONFIG],
  [],
);

// ---------------------------------------------------------------------------
// Raw payloads — one row per regeling type.
// Each row has the metadata fields mapRow would derive, plus clean column
// names that aggregateDataForPeriod looks up (prefix stripped).
// ---------------------------------------------------------------------------
const RAW_PAYLOADS: Record<string, any[]> = {
  [MW_EP]: [{
    aggregatie: 'week',
    periode: '2025_12',
    periode_vanaf: '2025-03-24',
    periode_totenmet: '2025-03-30',
    _year: '2025',
    _yearmonth: '2025_03',
    _yearweek: '2025_12',
    _month: '03',
    _week: '12',
    _startdatum: '2025-03-24',
    _einddatum: '2025-03-30',
    // clean column names for mw_ prefix: dlt_gerealiseerd_mediaan_dagen,
    // toegekend_cumul_perc, bz_vertraagd_jaar_perc, schade_doorlopend_cijfer
    dlt_gerealiseerd_mediaan_dagen: 38,
    toegekend_cumul_perc: 61,
    bz_vertraagd_jaar_perc: 4,
    schade_doorlopend_cijfer: 7.1,
  }],
  [VV_EP]: [{
    _year: '2025',
    _week: '12',
    _startdatum: '2025-03-24',
    _einddatum: '2025-03-30',
    periode: '2025_12',
    dlt_gerealiseerd_mediaan_dagen: 15,
    toegekend_cumul_perc: 72.5,
    bz_vertraagd_jaar_perc: 3.1,
    doorlopend_cijfer: 6.5,
  }],
  [IMS_EP]: [{
    _year: '2025',
    _week: '12',
    _startdatum: '2025-03-24',
    _einddatum: '2025-03-30',
    periode: '2025_12',
    dlt_gerealiseerd_mediaan_dagen: 42,
    toegekend_cumul_perc: 68,
    bz_vertraagd_jaar_perc: 2.5,
    doorlopend_cijfer: 6.8,
  }],
  [IMK_EP]: [{
    _year: '2025',
    _week: '12',
    _startdatum: '2025-03-24',
    _einddatum: '2025-03-30',
    periode: '2025_12',
    dlt_gerealiseerd_mediaan_dagen: 35,
    toegekend_cumul_perc: 74.2,
    bz_vertraagd_jaar_perc: 1.8,
    doorlopend_cijfer: 7.0,
  }],
  [WD_EP]: [{
    _year: '2025',
    _week: '12',
    _startdatum: '2025-03-24',
    _einddatum: '2025-03-30',
    periode: '2025_12',
    dlt_gerealiseerd_mediaan_dagen: 28,
    toegekend_cumul_perc: 59.3,
    bz_vertraagd_jaar_perc: 5.2,
    doorlopend_cijfer: 6.2,
  }],
  [WNW_EP]: [{
    _year: '2025',
    _week: '12',
    _startdatum: '2025-03-24',
    _einddatum: '2025-03-30',
    periode: '2025_12',
    dlt_gerealiseerd_mediaan_dagen: 45,
    toegekend_cumul_perc: 55,
    bz_vertraagd_jaar_perc: 6.0,
    doorlopend_cijfer: 5.8,
  }],
  [TEVREDENHEID]: [{
    _date: '2026-06-22',
    doorlopend_cijfer: 6.8,
    aantal_respondenten: 85279,
  }],
};

// ---------------------------------------------------------------------------
// Build helper — constructs page + group, passes raw payloads to prepareData
// ---------------------------------------------------------------------------
function buildAndPrepare() {
  initPageStore(PAGE_CONFIG);
  const page = fakePage(PAGE_CONFIG);
  const group = buildGroup(page, GROUP_CONFIG, groups, 0);
  page.chartArray = [group];

  vi.spyOn(console, 'log').mockImplementation(() => {});

  const data = (group.ctrlr as any).prepareData(RAW_PAYLOADS);
  return { result: data, group, page };
}

// ---------------------------------------------------------------------------
// Expected table content — per regeling type
// ---------------------------------------------------------------------------
const EXPECTED_HEADERS = [
  'Regeling',
  'mediaan dagen tot besluit',
  'toegekend',
  'bezwaar gemaakt',
  'waardering',
];

const EXPECTED_ROWS: [string, string, string, string, string][] = [
  ['Fysieke schade: maatwerk',         '38',   '61.0%', '4.0%', '7.1'],
  ['Fysieke schade: vaste vergoeding',  '15',  '72.5%', '3.1%', '6.5'],
  ['Immateriele schade: volwassenen',   '42',  '68.0%', '2.5%', '6.8'],
  ['Immateriele schade: kinderen en jongeren', '35', '74.2%', '1.8%', '7.0'],
  ['Waardedaling: woningen',            '28',  '59.3%', '5.2%', '6.2'],
  ['Waardedaling: niet woningen',       '45',  '55.0%', '6.0%', '5.8'],
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('ComparisonGroupV1', () => {
  describe('getAggregationEndpoints', () => {
    it('builds one endpoint per prefix — 6 regeling codes', () => {
      initPageStore(PAGE_CONFIG);
      const page = fakePage(PAGE_CONFIG);
      const group = buildGroup(page, GROUP_CONFIG, groups, 0);

      const ctrlr = group.ctrlr as any;
      const eps = ctrlr.getAggregationEndpoints('week');

      expect(eps).toHaveLength(6);
      expect(eps).toContain(ep('MW'));
      expect(eps).toContain(ep('VV'));
      expect(eps).toContain(ep('IMS'));
      expect(eps).toContain(ep('IMK'));
      expect(eps).toContain(ep('WD'));
      expect(eps).toContain(ep('WNW'));
    });
  });

  describe('prepareData', () => {
    it('super.prepareData works and returns structure', () => {
      const { result, group } = buildAndPrepare();
      expect(result).toHaveProperty('numbers');
      expect(result).toHaveProperty('graphDataWeek');
      expect(result).toHaveProperty('weekTableCumul');
    });

    it('merges one row per regeling into a single periods row', () => {
      const { result } = buildAndPrepare();
      expect(result.graphDataWeek).toHaveLength(1);
      const row = result.graphDataWeek[0];

      // MW columns
      expect(row.mw_dlt_gerealiseerd_mediaan_dagen).toBe(38);
      expect(row.mw_toegekend_cumul_perc).toBe(61);
      expect(row.mw_bz_vertraagd_jaar_perc).toBe(4);

      // VV columns
      expect(row.vv_dlt_gerealiseerd_mediaan_dagen).toBe(15);
      expect(row.vv_toegekend_cumul_perc).toBe(72.5);
      expect(row.vv_bz_vertraagd_jaar_perc).toBe(3.1);

      // IMS columns
      expect(row.ims_dlt_gerealiseerd_mediaan_dagen).toBe(42);
      expect(row.ims_doorlopend_cijfer).toBe(6.8);

      // IMK columns
      expect(row.imk_dlt_gerealiseerd_mediaan_dagen).toBe(35);
      expect(row.imk_toegekend_cumul_perc).toBe(74.2);

      // WD columns
      expect(row.wd_dlt_gerealiseerd_mediaan_dagen).toBe(28);

      // WNW columns
      expect(row.wnw_dlt_gerealiseerd_mediaan_dagen).toBe(45);
      expect(row.wnw_toegekend_cumul_perc).toBe(55);

      // Metadata from first row
      expect(row._week).toBe('12');
      expect(row._startdatum).toBe('2025-03-24');
    });

    it('overrides weekTableInc, monthTableInc to empty arrays; weekTableCumul has merged data', () => {
      const { result } = buildAndPrepare();
      expect(result.weekTableInc).toEqual([]);
      expect(result.monthTableInc).toEqual([]);
      expect(result.weekTableCumul).not.toBeNull();
      expect(result.weekTableCumul!.headers.length).toBeGreaterThan(0);
      expect(result.weekTableCumul!.rows.length).toBeGreaterThan(0);
    });

    it('definitions and timeline are present', () => {
      const { result } = buildAndPrepare();
      expect(result).toHaveProperty('definitions');
      expect(result).toHaveProperty('timeline');
    });
  });

  describe('populateTable — per-regeling rendering', () => {
    // NOTE: this group feeds data directly, bypassing fixtureData, because
    // ComparisonGroupV1 generates its own endpoint URLs via getAggregationEndpoints()
    // rather than using group.resolvedEndpoints.  fixtureData matches by resolved
    // endpoint, which is empty here, so we construct the data object manually
    // with the endpoint keys the generator produces.

    it('renders a table with 6 rows (one per regeling type)', () => {
      const { result, group, page } = buildAndPrepare();

      document.body.appendChild(page.main.htmlContainer);
      group.ctrlr.html();
      group.ctrlr.populateTable(result);

      const cumulTable = document.querySelector('#week-table-cumul') as HTMLTableElement;
      expect(cumulTable).toBeDefined();

      const headers = cumulTable.querySelectorAll('th');
      expect(headers).toHaveLength(EXPECTED_HEADERS.length);
      headers.forEach((th, i) => {
        expect(th.textContent).toBe(EXPECTED_HEADERS[i]);
      });

      const rows = cumulTable.querySelectorAll('tbody tr');
      expect(rows).toHaveLength(6);

      rows.forEach((tr, rowIdx) => {
        const cells = tr.querySelectorAll('td');
        expect(cells).toHaveLength(5);
        const expected = EXPECTED_ROWS[rowIdx];
        cells.forEach((td, cellIdx) => {
          expect(td.textContent).toBe(expected[cellIdx]);
        });
      });
    });

    it('renders without "undefined" or "Invalid Date" in any cell', () => {
      const { result, group, page } = buildAndPrepare();

      document.body.appendChild(page.main.htmlContainer);
      group.ctrlr.html();
      group.ctrlr.populateTable(result);

      const cumulTable = document.querySelector('#week-table-cumul') as HTMLTableElement;
      const cells = cumulTable.querySelectorAll('td');

      for (const cell of Array.from(cells)) {
        expect(cell.textContent).not.toBe('undefined');
        expect(cell.textContent).not.toContain('Invalid Date');
      }
    });

    it('dimensional check — 1 row × 9 columns (data.factory tables() for merged period)', () => {
      const { result } = buildAndPrepare();
      expect(result.weekTableCumul).not.toBeNull();
      const table = result.weekTableCumul!;
      // From data.factory.ts tables(): 3 fixed headers (Jaar, Week, Periode) + 6 cumul params
      expect(table.headers.length).toBe(9);
      // 1 row because aggregateDataForPeriod merges all periods into a single object
      expect(table.rows.length).toBe(1);
    });

    it('first column of each row contains the regeling header', () => {
      const { result, group, page } = buildAndPrepare();

      document.body.appendChild(page.main.htmlContainer);
      group.ctrlr.html();
      group.ctrlr.populateTable(result);

      const cumulTable = document.querySelector('#week-table-cumul') as HTMLTableElement;
      const rows = cumulTable.querySelectorAll('tbody tr');

      EXPECTED_ROWS.forEach((expected, i) => {
        const firstCell = rows[i].querySelector('td');
        expect(firstCell?.textContent).toBe(expected[0]);
      });
    });
  });

  describe('interaction with NumbersV1 graphs', () => {
    it('numbers (merged row) contains all 6 regelingen prefixed columns', () => {
      const { result } = buildAndPrepare();

      // Each graph reads its own prefixed columns from the merged row
      const graphConfigs = GROUP_CONFIG.graphs;

      // Graph 0 (mw) reads mw_dlt_gerealiseerd_mediaan_dagen etc.
      expect(result.numbers).toHaveProperty('mw_dlt_gerealiseerd_mediaan_dagen');
      expect(result.numbers).toHaveProperty('mw_toegekend_cumul_perc');
      expect(result.numbers).toHaveProperty('mw_bz_vertraagd_jaar_perc');

      // Graph 1 (vv) reads vv_dlt_gerealiseerd_mediaan_dagen etc.
      expect(result.numbers).toHaveProperty('vv_dlt_gerealiseerd_mediaan_dagen');
      expect(result.numbers).toHaveProperty('vv_toegekend_cumul_perc');

      // Graph 5 (wnw) reads wnw_dlt_gerealiseerd_mediaan_dagen etc.
      expect(result.numbers).toHaveProperty('wnw_dlt_gerealiseerd_mediaan_dagen');
      expect(result.numbers).toHaveProperty('wnw_bz_vertraagd_jaar_perc');
    });
  });
});
