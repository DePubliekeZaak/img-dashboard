// @vitest-environment jsdom
//
// waardering/all_waardering (first group) — DomainComparisonGroupV1 now emits
// TWO symmetric tables: a "cumul" (Optellend) and an "incremental" (Toename)
// table with the SAME 8 columns (Totaal + 3 domeinen x score + respondenten).
// The domein metrics only have _cumul params on the graphs, so the group
// synthesizes their non-cumul twins. Column order and the pre-header bands are
// both driven by the params' `table_label` (grouped so the colspan bands match
// the columns exactly).
//
import { describe, it, expect, beforeEach } from 'vitest';
import {
  resetStore,
  initPageStore,
  buildGroup,
  fakePage,
  buildPageConfig,
} from './helpers/harness';
import { DomainComparisonGroupV1 } from '../src/pages/waardering/groups/domain-comparison-group';
import type { IPageConfig, IGroupMappingV2 } from '../src/shared/interfaces';

const groups: Record<string, new (...args: any[]) => any> = {
  DomainComparisonGroupV1,
};

beforeEach(() => {
  resetStore();
});

// Config slice — mirrors waardering/all_waardering: graphs 1 + 2 (numbers with
// totaal_*_cumul params, trend with totaal_* params) plus graph 3
// (tevredenheid_numbers_v1, the 6 domein _cumul params), and the Totaal +
// FYSIEK/IMS/WDL week/month endpoints (each select carries both cumul and
// non-cumul columns). Every param carries a table_label so the tables group
// and band by it.
const SELECT =
  'select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2ckto_score_gemiddeld_cumul%2ckto_score_totaal_cumul%2ckto_score_gemiddeld%2ckto_score_totaal&order=periode.desc';

function ep(domein: string, agg: 'week' | 'maand') {
  return `regelingen?aggregatie=eq.${agg}&domein_code=eq.${domein}&regeling_code=eq.Totaal&${SELECT}`;
}

const TOTAAL_WEEK = ep('Totaal', 'week');
const TOTAAL_MONTH = ep('Totaal', 'maand');
const DOMAINS = ['FYSIEK', 'IMS', 'WDL'];

const GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'all_waardering',
  ctrlr: 'DomainComparisonGroupV1',
  graphs: [
    {
      slug: 'a_waardering_numbers',
      ctrlr: 'NumbersPlusRespondentsV1',
      args: [],
      parameters: [
        [{ label: 'Alle regelingen', column: 'totaal_kto_score_gemiddeld_cumul', colour: 'orange', format: 'decimals', table_label: 'Totaal', table_header: 'cijfer' }],
        [{ label: 'Totaal respondenten', column: 'totaal_kto_score_totaal_cumul', colour: 'orange', table_label: 'Totaal', table_header: 'respondenten' }],
      ],
      segment: { key: 'kto_score_gemiddeld_cumul', cumulative: false, periodization: 'weekly' },
    },
    {
      slug: 'a_waardering_trend',
      ctrlr: 'BarTrendKTOV1',
      args: [],
      parameters: [
        [{ label: 'Maand cijfer', column: 'totaal_kto_score_gemiddeld', colour: 'orange', format: 'decimals', table_label: 'Totaal', table_header: 'cijfer' }],
        [{ label: 'Aantal nieuwe respondenten', column: 'totaal_kto_score_totaal', colour: 'orange', table_label: 'Totaal', table_header: 'respondenten' }],
      ],
      segment: { key: 'totaal_kto_score_gemiddeld', cumulative: false, periodization: 'monthly' },
    },
    {
      slug: 'tevredenheid_numbers_v1',
      ctrlr: 'NumbersPlusRespondentsV1',
      args: [],
      parameters: [
        [
          { label: 'Fysieke schade', column: 'fysiek_kto_score_gemiddeld_cumul', colour: 'moss', table_label: 'Fysieke schade', table_header: 'cijfer' },
          { label: 'Immateriele schade', column: 'ims_kto_score_gemiddeld_cumul', colour: 'blue', table_label: 'Immateriele schade', table_header: 'cijfer' },
          { label: 'Waardedaling', column: 'wdl_kto_score_gemiddeld_cumul', colour: 'purple', table_label: 'Waardedaling', table_header: 'cijfer' },
        ],
        [
          { label: 'Fysieke schade', column: 'fysiek_kto_score_totaal_cumul', colour: 'moss', table_label: 'Fysieke schade', table_header: 'respondenten' },
          { label: 'Immateriele schade', column: 'ims_kto_score_totaal_cumul', colour: 'blue', table_label: 'Immateriele schade', table_header: 'respondenten' },
          { label: 'Waardedaling', column: 'wdl_kto_score_totaal_cumul', colour: 'purple', table_label: 'Waardedaling', table_header: 'respondenten' },
        ],
      ],
      segment: { key: 'fysiek_kto_score_gemiddeld_cumul', cumulative: true, periodization: 'monthly' },
    },
  ],
  segment: { key: 'kto_score_gemiddeld_cumul', cumulative: false, periodization: 'monthly' },
  functionality: ['table', 'definitions', 'download'],
  endpoints: [TOTAAL_WEEK, TOTAAL_MONTH, ...DOMAINS.flatMap((d) => [ep(d, 'week'), ep(d, 'maand')])],
};

const PAGE_CONFIG: IPageConfig = buildPageConfig(
  'waardering',
  { key: 'kto_score_gemiddeld_cumul', cumulative: false, periodization: 'monthly' },
  [GROUP_CONFIG],
);

// Raw payloads. Domain endpoints return unprefixed column names —
// mergeByDomein prefixes them per domein. Each Totaal/domein block provides
// its own set of values so merged rows can be told apart.
const RAW_PAYLOADS: Record<string, any[]> = {
  [TOTAAL_WEEK]: [
    { periode: '2026_25', aggregatie: 'week', kto_score_gemiddeld_cumul: 7.4, kto_score_totaal_cumul: 1234, kto_score_gemiddeld: 7.1, kto_score_totaal: 22, _startdatum: '2026-06-15', _einddatum: '2026-06-21', _year: '2026', _week: '25', _yearweek: '2026_25' },
    { periode: '2026_24', aggregatie: 'week', kto_score_gemiddeld_cumul: 7.3, kto_score_totaal_cumul: 1212, kto_score_gemiddeld: 7.0, kto_score_totaal: 20, _startdatum: '2026-06-08', _einddatum: '2026-06-14', _year: '2026', _week: '24', _yearweek: '2026_24' },
  ],
  [TOTAAL_MONTH]: [
    { periode: '2026_06', aggregatie: 'maand', kto_score_gemiddeld_cumul: 7.5, kto_score_totaal_cumul: 4567, kto_score_gemiddeld: 7.2, kto_score_totaal: 120, _startdatum: '2026-06-01', _einddatum: '2026-06-30', _year: '2026', _week: '26', _yearmonth: '2026_06' },
    { periode: '2026_05', aggregatie: 'maand', kto_score_gemiddeld_cumul: 7.5, kto_score_totaal_cumul: 4447, kto_score_gemiddeld: 7.2, kto_score_totaal: 115, _startdatum: '2026-05-01', _einddatum: '2026-05-31', _year: '2026', _week: '22', _yearmonth: '2026_05' },
  ],
};

const DOMAIN_BASE: Record<string, number> = { FYSIEK: 300, IMS: 200, WDL: 100 };
for (const d of DOMAINS) {
  const base = DOMAIN_BASE[d];
  RAW_PAYLOADS[ep(d, 'week')] = [
    { periode: '2026_25', aggregatie: 'week', kto_score_gemiddeld_cumul: 7.6, kto_score_totaal_cumul: base, kto_score_gemiddeld: 7.3, kto_score_totaal: base / 10, _startdatum: '2026-06-15', _einddatum: '2026-06-21', _year: '2026', _week: '25', _yearweek: '2026_25' },
    { periode: '2026_24', aggregatie: 'week', kto_score_gemiddeld_cumul: 7.5, kto_score_totaal_cumul: base - 5, kto_score_gemiddeld: 7.2, kto_score_totaal: base / 10 - 1, _startdatum: '2026-06-08', _einddatum: '2026-06-14', _year: '2026', _week: '24', _yearweek: '2026_24' },
  ];
  RAW_PAYLOADS[ep(d, 'maand')] = [
    { periode: '2026_06', aggregatie: 'maand', kto_score_gemiddeld_cumul: 7.7, kto_score_totaal_cumul: base, kto_score_gemiddeld: 7.4, kto_score_totaal: base / 10, _startdatum: '2026-06-01', _einddatum: '2026-06-30', _year: '2026', _week: '26', _yearmonth: '2026_06' },
    { periode: '2026_05', aggregatie: 'maand', kto_score_gemiddeld_cumul: 7.6, kto_score_totaal_cumul: base - 5, kto_score_gemiddeld: 7.3, kto_score_totaal: base / 10 - 1, _startdatum: '2026-05-01', _einddatum: '2026-05-31', _year: '2026', _week: '22', _yearmonth: '2026_05' },
  ];
}

function buildAndPrepare(slug: string = 'all_waardering') {
  const config = { ...GROUP_CONFIG, slug, ctrlr: 'DomainComparisonGroupV1' };
  initPageStore(PAGE_CONFIG);
  const page = fakePage(PAGE_CONFIG);
  const group = buildGroup(page, config, groups, 0);
  page.chartArray = [group];

  const data: Record<string, any[]> = {};
  for (const epKey of group.resolvedEndpoints) {
    const key = Object.keys(RAW_PAYLOADS).find((k) => epKey.includes(k));
    if (key) data[epKey] = RAW_PAYLOADS[key].map((r: any) => ({ ...r, _isNewApi: true }));
  }

  const result = group.ctrlr.prepareData(data);
  return { result, group, page };
}

describe('waardering all_waardering symmetric cumul/incremental tables', () => {
  it('produces both the incremental and cumul tables (week and month)', () => {
    const { result } = buildAndPrepare();

    expect(result.weekTableInc).not.toBeNull();
    expect(result.monthTableInc).not.toBeNull();
    expect(result.weekTableCumul).not.toBeNull();
    expect(result.monthTableCumul).not.toBeNull();
  });

  it('cumul table headers read cijfer | respondenten for each band', () => {
    const { result } = buildAndPrepare();
    const headers = result.monthTableCumul!.headers;

    expect(headers[0]).toBe('Jaar');
    expect(headers[1]).toBe('Maand');
    expect(headers[2]).toBe('Periode');
    // Columns sorted by table_label (Totaal first, then each domein); the
    // regular header repeats cijfer | respondenten per band.
    expect(headers).toEqual([
      'Jaar',
      'Maand',
      'Periode',
      'cijfer',
      'respondenten',
      'cijfer',
      'respondenten',
      'cijfer',
      'respondenten',
      'cijfer',
      'respondenten',
    ]);
  });

  it('incremental table headers repeat cijfer | respondenten (non-cumul twins)', () => {
    const { result } = buildAndPrepare();
    const headers = result.monthTableInc!.headers;

    expect(headers).toEqual([
      'Jaar',
      'Maand',
      'Periode',
      'cijfer',
      'respondenten',
      'cijfer',
      'respondenten',
      'cijfer',
      'respondenten',
      'cijfer',
      'respondenten',
    ]);
  });

  it('rows carry cumul values in the cumul table and inc values in the inc table', () => {
    const { result } = buildAndPrepare();
    const cumulRows = result.monthTableCumul!.rows;
    const incRows = result.monthTableInc!.rows;

    expect(cumulRows).toHaveLength(2);
    expect(incRows).toHaveLength(2);

    // Cumul table (latest month): Totaal cumul + domein cumul values.
    expect(cumulRows[0]).toContain(4567); // totaal_kto_score_totaal_cumul
    expect(cumulRows[0]).toContain(7.5); // totaal_kto_score_gemiddeld_cumul
    expect(cumulRows[0]).toContain(300); // fysiek_kto_score_totaal_cumul
    expect(cumulRows[0]).toContain(100); // wdl_kto_score_totaal_cumul

    // Incremental table (latest month): non-cumul twins, same domein data.
    expect(incRows[0]).toContain(120); // totaal_kto_score_totaal
    expect(incRows[0]).toContain(7.2); // totaal_kto_score_gemiddeld
    expect(incRows[0]).toContain(30); // fysiek_kto_score_totaal
    expect(incRows[0]).toContain(10); // wdl_kto_score_totaal
  });

  it('emits pre_headers spanning Totaal and domein bands (fits both tables)', () => {
    const { result } = buildAndPrepare();
    const pre = result.monthTableCumul!.pre_headers;
    const incPre = result.monthTableInc!.pre_headers;

    const expected = [
      { label: '', length: 3 },
      { label: 'Totaal', length: 2 },
      { label: 'Fysieke schade', length: 2 },
      { label: 'Immateriele schade', length: 2 },
      { label: 'Waardedaling', length: 2 },
    ];
    expect(pre).toEqual(expected);
    expect(incPre).toEqual(expected);
    // Spans align with the 3 fixed + 8 data columns of each table.
    const total = (pre as any[]).reduce((sum, h) => sum + h.length, 0);
    expect(total).toBe(3 + 8);
  });

  it('other groups keep the conventional split without synthesized inc twins', () => {
    const { result } = buildAndPrepare('some_other_group');

    expect(result.monthTableInc).not.toBeNull();
    expect(result.monthTableCumul).not.toBeNull();

    // No synthesis: the inc table only carries the trend graph's 2 columns.
    const incHeaders = result.monthTableInc!.headers;
    expect(incHeaders).toEqual([
      'Jaar',
      'Maand',
      'Periode',
      'cijfer',
      'respondenten',
    ]);
    // Bands are still derived from the params' table_labels (both are Totaal).
    expect(result.monthTableInc!.pre_headers).toEqual([
      { label: '', length: 3 },
      { label: 'Totaal', length: 2 },
    ]);
  });
});
