// @vitest-environment jsdom
//
// RegelingComparisonGroupV1 — merges rows from a single endpoint that
// returns data for multiple regeling_codes (IMS, IMK, Totaal) into one
// row per periode with prefixed column names, then produces tables.
//
import { describe, it, expect, beforeEach } from 'vitest';
import { resetStore, initPageStore, buildGroup, fakePage, buildPageConfig } from './helpers/harness';
import { RegelingComparisonGroupV1 } from '../src/pages/ims-overzicht/groups/regeling-comparison-group';
import { DataService } from '../src/browser/dashboard/data.service';
import type { IPageConfig, IGroupMappingV2 } from '../src/shared/interfaces';

const groups: Record<string, new (...args: any[]) => any> = { RegelingComparisonGroupV1 };

const DOMEIN_CODE = 'IMS';

const WEEK_EP = `regelingen?aggregatie=eq.week&domein_code=eq.${DOMEIN_CODE}&select=aggregatie%2Cperiode%2Cperiode_totenmet%2Cperiode_vanaf%2Cdomein_code%2Cregeling_code%2Cingediend_aantal%2Cafgerond_aantal%2Cingediend_cumul%2Cafgerond_cumul%2Cbedrag_betaald_totaal_cumul_eur%2Cbedrag_betaald_totaal_eur&periode_vanaf=gte.{VANAF}&order=periode.desc`;

const MONTH_EP = `regelingen?aggregatie=eq.maand&domein_code=eq.${DOMEIN_CODE}&select=aggregatie%2Cperiode%2Cperiode_totenmet%2Cperiode_vanaf%2Cdomein_code%2Cregeling_code%2Cingediend_aantal%2Cafgerond_aantal%2Cingediend_cumul%2Cafgerond_cumul%2Cbedrag_betaald_totaal_cumul_eur%2Cbedrag_betaald_totaal_eur&order=periode.desc`;

beforeEach(() => {
  resetStore();
});

// ---------------------------------------------------------------------------
// Config slice — mirrors ims-overzicht's ims_totaal_keuzepaden
// ---------------------------------------------------------------------------
const GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'ims_totaal_keuzepaden',
  ctrlr: 'RegelingComparisonGroupV1',
  filters: [],
  graphs: [
    {
      slug: 'ims_totaal_numbers_volw',
      ctrlr: 'NumbersV1',
      parameters: [[
        { label: 'Ingediend', column: 'ims_ingediend', colour: 'blue', units: 'aanvragen', modifiers: { cumul: '_cumul', delta: '_aantal' } },
        { label: 'Afgehandeld', column: 'ims_afgerond', colour: 'blue', units: 'afgehandeld', modifiers: { cumul: '_cumul', delta: '_aantal' } },
        { label: 'Betaald bedrag', column: 'ims_bedrag_betaald_totaal', colour: 'blue', units: 'betaald bedrag', format: 'currency', modifiers: { cumul: '_cumul_eur', delta: '_eur' } },
      ], []],
      segment: { key: 'ims_ingediend', cumulative: true, periodization: 'weekly' },
    },
  ],
  segment: { key: 'ims_ingediend', cumulative: true, periodization: 'weekly' },
  functionality: ['table', 'definitions', 'download'],
  endpoints: [WEEK_EP, MONTH_EP],
};

const PAGE_CONFIG: IPageConfig = buildPageConfig(
  'ims-overzicht',
  { key: '', cumulative: false, periodization: 'monthly', gemeente: 'all', vanaf: '2025-01-01' },
  [GROUP_CONFIG],
);

// ---------------------------------------------------------------------------
// Raw payloads — one endpoint returning rows for multiple regeling_codes
// ---------------------------------------------------------------------------
const WEEK_ROWS = [
  { aggregatie: 'week', periode: '2026_29', periode_vanaf: '2026-07-13', periode_totenmet: '2026-07-19', domein_code: 'IMS', regeling_code: 'Totaal', ingediend_aantal: 577, afgerond_aantal: 696, ingediend_cumul: 183645, afgerond_cumul: 180013, bedrag_betaald_totaal_cumul_eur: 321679952.23, bedrag_betaald_totaal_eur: 696822 },
  { aggregatie: 'week', periode: '2026_29', periode_vanaf: '2026-07-13', periode_totenmet: '2026-07-19', domein_code: 'IMS', regeling_code: 'IMS', ingediend_aantal: 498, afgerond_aantal: 594, ingediend_cumul: 153451, afgerond_cumul: 150333, bedrag_betaald_totaal_cumul_eur: 257729684.7, bedrag_betaald_totaal_eur: 512322 },
  { aggregatie: 'week', periode: '2026_29', periode_vanaf: '2026-07-13', periode_totenmet: '2026-07-19', domein_code: 'IMS', regeling_code: 'IMK', ingediend_aantal: 79, afgerond_aantal: 102, ingediend_cumul: 30194, afgerond_cumul: 29680, bedrag_betaald_totaal_cumul_eur: 63950267.53, bedrag_betaald_totaal_eur: 184500 },
  { aggregatie: 'week', periode: '2026_28', periode_vanaf: '2026-07-06', periode_totenmet: '2026-07-12', domein_code: 'IMS', regeling_code: 'Totaal', ingediend_aantal: 526, afgerond_aantal: 726, ingediend_cumul: 183068, afgerond_cumul: 179317, bedrag_betaald_totaal_cumul_eur: 320983130.23, bedrag_betaald_totaal_eur: 695500 },
  { aggregatie: 'week', periode: '2026_28', periode_vanaf: '2026-07-06', periode_totenmet: '2026-07-12', domein_code: 'IMS', regeling_code: 'IMS', ingediend_aantal: 439, afgerond_aantal: 643, ingediend_cumul: 152953, afgerond_cumul: 149739, bedrag_betaald_totaal_cumul_eur: 257217362.7, bedrag_betaald_totaal_eur: 526000 },
  { aggregatie: 'week', periode: '2026_28', periode_vanaf: '2026-07-06', periode_totenmet: '2026-07-12', domein_code: 'IMS', regeling_code: 'IMK', ingediend_aantal: 87, afgerond_aantal: 83, ingediend_cumul: 30115, afgerond_cumul: 29578, bedrag_betaald_totaal_cumul_eur: 63765767.53, bedrag_betaald_totaal_eur: 169500 },
];

const MONTH_ROWS = [
  { aggregatie: 'maand', periode: '2026_06', periode_vanaf: '2026-06-01', periode_totenmet: '2026-06-30', domein_code: 'IMS', regeling_code: 'Totaal', ingediend_aantal: 2600, afgerond_aantal: 3100, ingediend_cumul: 183068, afgerond_cumul: 179317, bedrag_betaald_totaal_cumul_eur: 320983130.23, bedrag_betaald_totaal_eur: 2700000 },
  { aggregatie: 'maand', periode: '2026_06', periode_vanaf: '2026-06-01', periode_totenmet: '2026-06-30', domein_code: 'IMS', regeling_code: 'IMS', ingediend_aantal: 2100, afgerond_aantal: 2500, ingediend_cumul: 152953, afgerond_cumul: 149739, bedrag_betaald_totaal_cumul_eur: 257217362.7, bedrag_betaald_totaal_eur: 2100000 },
  { aggregatie: 'maand', periode: '2026_06', periode_vanaf: '2026-06-01', periode_totenmet: '2026-06-30', domein_code: 'IMS', regeling_code: 'IMK', ingediend_aantal: 500, afgerond_aantal: 600, ingediend_cumul: 30115, afgerond_cumul: 29578, bedrag_betaald_totaal_cumul_eur: 63765767.53, bedrag_betaald_totaal_eur: 600000 },
];

// Resolved endpoint keys after addVarsToEndpoint resolves {VANAF}
const RESOLVED_WEEK = WEEK_EP.replace('{VANAF}', '2025-01-01');
const RESOLVED_MONTH = MONTH_EP;

// ---------------------------------------------------------------------------
// mergeByRegeling tests
// ---------------------------------------------------------------------------
describe('RegelingComparisonGroupV1', () => {
  describe('mergeByRegeling', () => {
    it('prefixes columns by regeling_code and merges by periode', () => {
      initPageStore(PAGE_CONFIG);
      const page = fakePage(PAGE_CONFIG);
      const group = buildGroup(page, GROUP_CONFIG, groups, 0);
      const ctrlr = group.ctrlr as any;

      const data: Record<string, any[]> = {
        [RESOLVED_WEEK]: WEEK_ROWS,
      };

      const weekEps = [RESOLVED_WEEK];
      const merged = ctrlr.mergeByRegeling(data, weekEps);

      // 2 periods merged
      expect(merged).toHaveLength(2);

      // First row = 2026_29 (descending)
      expect(merged[0].periode).toBe('2026_29');

      // Should have prefixed columns from all three regeling_codes
      expect(merged[0]).toHaveProperty('totaal_ingediend_aantal');
      expect(merged[0]).toHaveProperty('ims_ingediend_aantal');
      expect(merged[0]).toHaveProperty('imk_ingediend_aantal');

      // Values from each code
      expect(merged[0].totaal_ingediend_aantal).toBe(577);
      expect(merged[0].ims_ingediend_aantal).toBe(498);
      expect(merged[0].imk_ingediend_aantal).toBe(79);

      // Second row = 2026_28
      expect(merged[1].periode).toBe('2026_28');
      expect(merged[1].ims_ingediend_aantal).toBe(439);
      expect(merged[1].imk_ingediend_aantal).toBe(87);
    });

    it('skips internal / shared fields (domein_code, regeling_code)', () => {
      initPageStore(PAGE_CONFIG);
      const page = fakePage(PAGE_CONFIG);
      const group = buildGroup(page, GROUP_CONFIG, groups, 0);
      const ctrlr = group.ctrlr as any;

      const data: Record<string, any[]> = {
        [RESOLVED_WEEK]: WEEK_ROWS,
      };

      const merged = ctrlr.mergeByRegeling(data, [RESOLVED_WEEK]);

      // domein_code and regeling_code should not end up in output
      expect(merged[0]).not.toHaveProperty('domein_code');
      expect(merged[0]).not.toHaveProperty('regeling_code');
      expect(merged[0]).not.toHaveProperty('ims_domein_code');
      expect(merged[0]).not.toHaveProperty('totaal_regeling_code');

      // aggregatie should be present once (first-writer)
      expect(merged[0]).toHaveProperty('aggregatie');
    });

    it('preserves _-prefixed fields without prefix (first writer)', () => {
      initPageStore(PAGE_CONFIG);
      const page = fakePage(PAGE_CONFIG);
      const group = buildGroup(page, GROUP_CONFIG, groups, 0);
      const ctrlr = group.ctrlr as any;

      // Feed rows through mapRow first to get _startdatum / _einddatum etc.
      const svc = new DataService();
      const mapped = WEEK_ROWS.map((r: any) => svc.mapRow(r));

      const data: Record<string, any[]> = {
        [RESOLVED_WEEK]: mapped,
      };

      const merged = ctrlr.mergeByRegeling(data, [RESOLVED_WEEK]);

      expect(merged[0]).toHaveProperty('_startdatum');
      expect(merged[0]).toHaveProperty('_einddatum');
      // Should not be prefixed
      expect(merged[0]).not.toHaveProperty('ims__startdatum');
    });
  });

  describe('prepareData', () => {
    it('returns tables from month-only data', () => {
      initPageStore(PAGE_CONFIG);
      const page = fakePage(PAGE_CONFIG);
      const group = buildGroup(page, GROUP_CONFIG, groups, 0);
      page.chartArray = [group];

      const data: Record<string, any[]> = {
        [RESOLVED_WEEK]: WEEK_ROWS,
        [RESOLVED_MONTH]: MONTH_ROWS,
      };

      const result = group.ctrlr.prepareData(data);

      // Week table passed as [] → null
      expect(result.weekTableInc).toBeNull();
      expect(result.weekTableCumul).toBeNull();

      // Month tables should be populated
      expect(result.monthTableInc).not.toBeNull();
      expect(result.monthTableCumul).not.toBeNull();

      // graphDataMonth should be the merged data
      expect(result.graphDataMonth).toHaveLength(1); // 1 month period
      expect(result.graphDataMonth[0].periode).toBe('2026_06');
      expect(result.graphDataMonth[0]).toHaveProperty('ims_ingediend_aantal');
      expect(result.graphDataMonth[0]).toHaveProperty('imk_ingediend_aantal');
      expect(result.graphDataMonth[0]).toHaveProperty('totaal_ingediend_aantal');
    });

    it('month inc table headers include prefixed param labels', () => {
      initPageStore(PAGE_CONFIG);
      const page = fakePage(PAGE_CONFIG);
      const group = buildGroup(page, GROUP_CONFIG, groups, 0);
      page.chartArray = [group];

      const data: Record<string, any[]> = {
        [RESOLVED_WEEK]: WEEK_ROWS,
        [RESOLVED_MONTH]: MONTH_ROWS,
      };

      const result = group.ctrlr.prepareData(data);
      const headers = result.monthTableInc!.headers;

      expect(headers[0]).toBe('Jaar');
      expect(headers[1]).toBe('Maand');
      expect(headers[2]).toBe('Periode');
      // Params use labels from config
      expect(headers).toContain('Ingediend');
      expect(headers).toContain('Afgehandeld');
      expect(headers).toContain('Betaald bedrag');
    });

    it('merged values appear in table rows', () => {
      initPageStore(PAGE_CONFIG);
      const page = fakePage(PAGE_CONFIG);
      const group = buildGroup(page, GROUP_CONFIG, groups, 0);
      page.chartArray = [group];

      const data: Record<string, any[]> = {
        [RESOLVED_WEEK]: WEEK_ROWS,
        [RESOLVED_MONTH]: MONTH_ROWS,
      };

      const result = group.ctrlr.prepareData(data);
      const rows = result.monthTableInc!.rows;

      // At least 1 period
      expect(rows.length).toBeGreaterThanOrEqual(1);
    });

    it('definitions and timeline present', () => {
      initPageStore(PAGE_CONFIG);
      const page = fakePage(PAGE_CONFIG);
      const group = buildGroup(page, GROUP_CONFIG, groups, 0);
      page.chartArray = [group];

      const data: Record<string, any[]> = {
        [RESOLVED_WEEK]: WEEK_ROWS,
        [RESOLVED_MONTH]: MONTH_ROWS,
      };

      const result = group.ctrlr.prepareData(data);
      expect(result).toHaveProperty('definitions');
      expect(result).toHaveProperty('timeline');
    });
  });
});