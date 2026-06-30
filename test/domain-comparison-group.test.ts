// @vitest-environment jsdom
//
// DomainComparisonGroupV1 — merges data from multiple domein-specific
// endpoints (FYSIEK, IMS, WDL) into a single dataset with prefixed
// column names, then produces tables from month data only.
//
import { describe, it, expect, beforeEach } from 'vitest';
import { resetStore, initPageStore, buildGroup, fakePage, buildPageConfig } from './helpers/harness';
import { DomainComparisonGroupV1 } from '../src/pages/regelingen/groups/domain-comparison-group';
import type { IPageConfig, IGroupMappingV2 } from '../src/shared/interfaces';

const groups: Record<string, new (...args: any[]) => any> = { DomainComparisonGroupV1 };

beforeEach(() => {
  resetStore();
});

// ---------------------------------------------------------------------------
// Config slice — mirrors regelingen/all_regelingen_overzicht
// 3 domein-coded month endpoints, params with wdl_/ims_/fs_ prefixes
// ---------------------------------------------------------------------------
const GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'all_regelingen_overzicht',
  ctrlr: 'DomainComparisonGroupV1',
  filters: ['mappingGroupSelect', 'cumulativeVsDelta'],
  graphs: [
    {
      slug: 'reg_makeup_trend',
      ctrlr: 'BarTrendStackedMakeup',
      parameters: [[
        { label: 'Waardedalingsregeling', short: 'WD', column: 'wdl_ingediend', colour: 'moss', modifiers: { cumul: '_cumul', delta: '_aantal' } },
        { label: 'Immateriele schade', short: 'IMS', column: 'ims_ingediend', colour: 'blue', modifiers: { cumul: '_cumul', delta: '_aantal' } },
        { label: 'Fysieke schade', short: 'FS', column: 'fs_ingediend', colour: 'orange', modifiers: { cumul: '_cumul', delta: '_aantal' } },
      ], []],
      segment: { key: 'wdl_ingediend_aantal', cumulative: false, periodization: 'monthly' },
    },
  ],
  segment: { key: 'wdl_ingediend_aantal', cumulative: false, periodization: 'monthly' },
  functionality: ['table', 'definitions', 'download'],
  endpoints: [
    'regelingen?aggregatie=eq.maand&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cingediend_aantal%2cingediend_cumul%2cafgerond_aantal%2cafgerond_cumul&order=periode.desc',
    'regelingen?aggregatie=eq.maand&domein_code=eq.IMS&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cingediend_aantal%2cingediend_cumul%2cafgerond_aantal%2cafgerond_cumul&order=periode.desc',
    'regelingen?aggregatie=eq.maand&domein_code=eq.WDL&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cingediend_aantal%2cingediend_cumul%2cafgerond_aantal%2cafgerond_cumul&order=periode.desc',
  ],
};

const PAGE_CONFIG: IPageConfig = buildPageConfig(
  'regelingen',
  { key: 'wdl_ingediend_aantal', cumulative: false, periodization: 'monthly' },
  [GROUP_CONFIG],
  [],
);

// ---------------------------------------------------------------------------
// Hand-built data — 3 domein endpoints, each with 2 month rows
// The controller's mergeByDomein reads data[endpoint], prefixes all
// non-_ columns with fs_/ims_/wdl_, and merges by periode key.
// ---------------------------------------------------------------------------
const FYSIEK_EP = 'regelingen?aggregatie=eq.maand&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cingediend_aantal%2cingediend_cumul%2cafgerond_aantal%2cafgerond_cumul&order=periode.desc';
const IMS_EP = 'regelingen?aggregatie=eq.maand&domein_code=eq.IMS&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cingediend_aantal%2cingediend_cumul%2cafgerond_aantal%2cafgerond_cumul&order=periode.desc';
const WDL_EP = 'regelingen?aggregatie=eq.maand&domein_code=eq.WDL&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cingediend_aantal%2cingediend_cumul%2cafgerond_aantal%2cafgerond_cumul&order=periode.desc';

const RAW_PAYLOADS: Record<string, any[]> = {
  [FYSIEK_EP]: [
    { periode: '2026_05', aggregatie: 'maand', periode_vanaf: '2026-05-01', periode_totenmet: '2026-05-31', ingediend_aantal: 4490, ingediend_cumul: 396013, afgerond_aantal: 5689, afgerond_cumul: 372479, _startdatum: '2026-05-01', _einddatum: '2026-05-31', _year: '2026', _yearmonth: '2026_05' },
    { periode: '2026_04', aggregatie: 'maand', periode_vanaf: '2026-04-01', periode_totenmet: '2026-04-30', ingediend_aantal: 4200, ingediend_cumul: 391523, afgerond_aantal: 5200, afgerond_cumul: 366790, _startdatum: '2026-04-01', _einddatum: '2026-04-30', _year: '2026', _yearmonth: '2026_04' },
  ],
  [IMS_EP]: [
    { periode: '2026_05', aggregatie: 'maand', periode_vanaf: '2026-05-01', periode_totenmet: '2026-05-31', ingediend_aantal: 1200, ingediend_cumul: 98000, afgerond_aantal: 1100, afgerond_cumul: 95000, _startdatum: '2026-05-01', _einddatum: '2026-05-31', _year: '2026', _yearmonth: '2026_05' },
    { periode: '2026_04', aggregatie: 'maand', periode_vanaf: '2026-04-01', periode_totenmet: '2026-04-30', ingediend_aantal: 1150, ingediend_cumul: 96800, afgerond_aantal: 1050, afgerond_cumul: 93900, _startdatum: '2026-04-01', _einddatum: '2026-04-30', _year: '2026', _yearmonth: '2026_04' },
  ],
  [WDL_EP]: [
    { periode: '2026_05', aggregatie: 'maand', periode_vanaf: '2026-05-01', periode_totenmet: '2026-05-31', ingediend_aantal: 800, ingediend_cumul: 65000, afgerond_aantal: 750, afgerond_cumul: 62000, _startdatum: '2026-05-01', _einddatum: '2026-05-31', _year: '2026', _yearmonth: '2026_05' },
    { periode: '2026_04', aggregatie: 'maand', periode_vanaf: '2026-04-01', periode_totenmet: '2026-04-30', ingediend_aantal: 780, ingediend_cumul: 64200, afgerond_aantal: 720, afgerond_cumul: 61250, _startdatum: '2026-04-01', _einddatum: '2026-04-30', _year: '2026', _yearmonth: '2026_04' },
  ],
};

// ---------------------------------------------------------------------------
// Build helper
// ---------------------------------------------------------------------------
function buildAndPrepare() {
  initPageStore(PAGE_CONFIG);
  const page = fakePage(PAGE_CONFIG);
  const group = buildGroup(page, GROUP_CONFIG, groups, 0);
  page.chartArray = [group];

  // Resolved endpoints — addVarsToEndpoint keeps them unchanged (no placeholders)
  // buildGroup resolves endpoints and stores them in group.resolvedEndpoints.
  // fixtureData normally does mapRow, but we want raw data here (the endpoint
  // data already has _isNewApi-style fields). Pass through mapRow.
  const data: Record<string, any[]> = {};
  for (const ep of group.resolvedEndpoints) {
    const key = Object.keys(RAW_PAYLOADS).find(k => ep.includes(k));
    if (key) {
      data[ep] = RAW_PAYLOADS[key].map((r: any) => ({ ...r, _isNewApi: true }));
    }
  }

  const result = group.ctrlr.prepareData(data);
  return { result, group, page };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('DomainComparisonGroupV1', () => {
  describe('mergeByDomein', () => {
    it('merges data from multiple domein endpoints, prefixing columns', () => {
      initPageStore(PAGE_CONFIG);
      const page = fakePage(PAGE_CONFIG);
      const group = buildGroup(page, GROUP_CONFIG, groups, 0);

      // Test mergeByDomein directly with the resolved endpoints
      const ctrlr = group.ctrlr as any;
      const data: Record<string, any[]> = {};
      for (const ep of group.resolvedEndpoints) {
        const key = Object.keys(RAW_PAYLOADS).find(k => ep.includes(k));
        if (key) data[ep] = RAW_PAYLOADS[key];
      }

      const monthEps = group.resolvedEndpoints.filter((e: string) => e.includes('aggregatie=eq.maand'));
      const merged = ctrlr.mergeByDomein(data, monthEps, 'month');

      // Should have merged 2 periods (2026_05, 2026_04) from 3 endpoints
      expect(merged).toHaveLength(2);

      // First row (sorted descending by periode) should be 2026_05
      expect(merged[0].periode).toBe('2026_05');

      // Should have prefixed columns from all 3 domeinen
      expect(merged[0]).toHaveProperty('fs_ingediend_aantal');
      expect(merged[0]).toHaveProperty('ims_ingediend_aantal');
      expect(merged[0]).toHaveProperty('wdl_ingediend_aantal');

      // fs_ prefix for FYSIEK domein
      expect(merged[0].fs_ingediend_aantal).toBe(4490);
      // ims_ prefix for IMS domein
      expect(merged[0].ims_ingediend_aantal).toBe(1200);
      // wdl_ prefix for WDL domein
      expect(merged[0].wdl_ingediend_aantal).toBe(800);

      // _ prefixed fields should NOT get a domein prefix
      expect(merged[0]).toHaveProperty('_startdatum');
      expect(merged[0]._startdatum).toBe('2026-05-01');
    });
  });

  describe('prepareData', () => {
    it('returns all four tables from month-only data', () => {
      const { result } = buildAndPrepare();

      // Week passed as [] to tables → week tables should be null
      expect(result.weekTableInc).toBeNull();
      expect(result.weekTableCumul).toBeNull();

      // Month tables should be populated
      expect(result.monthTableInc).not.toBeNull();
      expect(result.monthTableCumul).not.toBeNull();
    });

    it('month inc table headers include prefixed param labels', () => {
      const { result } = buildAndPrepare();
      const headers = result.monthTableInc!.headers;
      // Headers: ["Jaar", "Maand", "Periode"] + param labels
      expect(headers[0]).toBe('Jaar');
      expect(headers[1]).toBe('Maand');
      expect(headers[2]).toBe('Periode');
      // Params have short (WD, IMS, FS) → headers use short
      expect(headers[3]).toBe('WD');
      expect(headers[4]).toBe('IMS');
      expect(headers[5]).toBe('FS');
    });

    it('merged values appear in table rows', () => {
      const { result } = buildAndPrepare();
      const rows = result.monthTableInc!.rows;
      // Should have at least the 2 merged periods
      expect(rows.length).toBeGreaterThanOrEqual(2);
    });

    it('definitions and timeline present', () => {
      const { result } = buildAndPrepare();
      expect(result).toHaveProperty('definitions');
      expect(result).toHaveProperty('timeline');
    });
  });
});