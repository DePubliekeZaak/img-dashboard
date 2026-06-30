// @vitest-environment jsdom
//
// Tests the all_totals mutation: overwrites bedrag_betaald_totaal_cumul_eur
// on every week row, then copies the last month row's value into row 0.
//
import { describe, it, expect, beforeEach } from 'vitest';
import { resetStore, initPageStore, buildGroup, fakePage, fixtureData, buildPageConfig } from './helpers/harness';
import { DefaultGroupV1 } from '../src/shared/default-group-v1';
import type { IPageConfig, IGroupMappingV2 } from '../src/shared/interfaces';
import * as weekRaw from './fixtures/regelingen/all_totals/week.json';
import * as monthRaw from './fixtures/regelingen/all_totals/month.json';

const groups: Record<string, new (...args: any[]) => any> = { DefaultGroupV1 };

beforeEach(() => {
  resetStore();
});

const PAGE_CONFIG: IPageConfig = buildPageConfig(
  'regelingen',
  { key: 'ingediend_aantal', cumulative: true, periodization: 'monthly' },
  [],
  [
    'regelingen?aggregatie=eq.maand&domein_code=eq.Totaal&regeling_code=eq.Totaal',
    'regelingen?aggregatie=eq.week&domein_code=eq.Totaal&regeling_code=eq.Totaal&order=periode.desc&periode_vanaf=gte.{VANAF}',
  ],
);

const GROUP_CONFIG: IGroupMappingV2 = {
  slug: 'all_totals',
  ctrlr: 'DefaultGroupV1',
  filters: ['totaalVsRecent'],
  graphs: [
    {
      slug: 'all_total_numbers',
      ctrlr: 'NumbersV1',
      parameters: [[
        { label: 'Aanvragen', column: 'ingediend', colour: 'orange', units: 'aanvragen', modifiers: { cumul: '_cumul', delta: '_aantal' } },
        { label: 'Afgehandeld', column: 'afgerond', colour: 'moss', units: 'afgehandeld', modifiers: { cumul: '_cumul', delta: '_aantal' } },
        { label: 'Uitbetaald', column: 'bedrag_betaald_totaal', colour: 'blue', format: 'currency', units: 'totaal uitbetaalde bedrag', modifiers: { cumul: '_cumul_eur', delta: '_eur' } },
      ], []],
      segment: { key: 'ingediend_aantal', cumulative: true, periodization: 'monthly' },
    },
  ],
  segment: { key: 'ingediend_aantal', cumulative: true, periodization: 'monthly' },
  functionality: ['table', 'definitions', 'download'],
  endpoints: [],
};

const RAW_PAYLOADS: Record<string, any[]> = {
  'aggregatie=eq.week': (weekRaw as any).default ?? weekRaw as any,
  'aggregatie=eq.maand': (monthRaw as any).default ?? monthRaw as any,
};

describe('DefaultGroupV1 — all_totals mutation', () => {
  it('overwrites bedrag_betaald_totaal_cumul_eur to "-" on all week rows except row 0', () => {
    initPageStore(PAGE_CONFIG);
    const page = fakePage(PAGE_CONFIG);
    const group = buildGroup(page, GROUP_CONFIG, groups, 0);
    page.chartArray = [group];

    const data = fixtureData(RAW_PAYLOADS, group.resolvedEndpoints);
    const result = group.ctrlr.prepareData(data);

    const weekData = result.graphDataWeek;
    expect(weekData.length).toBeGreaterThan(1);

    // Rows after row 0 should have "-"
    for (let i = 1; i < weekData.length; i++) {
      expect(weekData[i]['bedrag_betaald_totaal_cumul_eur']).toBe('-');
    }
  });

  it('copies last month row bedrag_betaald_totaal_cumul_eur into weekData[0]', () => {
    initPageStore(PAGE_CONFIG);
    const page = fakePage(PAGE_CONFIG);
    const group = buildGroup(page, GROUP_CONFIG, groups, 0);
    page.chartArray = [group];

    const data = fixtureData(RAW_PAYLOADS, group.resolvedEndpoints);
    const result = group.ctrlr.prepareData(data);

    // The mutation reads graphDataMonth[graphDataMonth.length - 1] BEFORE
    // tables() sorts it in place. At that point the month data is in API
    // order (desc by periode), so [length-1] is the most recent period.
    // from the fixture: 2026_05 has bedrag_betaald_totaal_cumul_eur = 3417869775.23
    expect(result.graphDataWeek[0]['bedrag_betaald_totaal_cumul_eur']).toBe(3417869775.23);
  });

  it('numbers = graphDataWeek[0] when NumbersV1 is present', () => {
    initPageStore(PAGE_CONFIG);
    const page = fakePage(PAGE_CONFIG);
    const group = buildGroup(page, GROUP_CONFIG, groups, 0);
    page.chartArray = [group];

    const data = fixtureData(RAW_PAYLOADS, group.resolvedEndpoints);
    const result = group.ctrlr.prepareData(data);

    // Group has NumbersV1 at nIndex → numbers = graphDataWeek[0]
    expect(result.numbers).toBe(result.graphDataWeek[0]);
    expect(result.numbers.bedrag_betaald_totaal_cumul_eur).toBe(
      result.graphDataWeek[0]['bedrag_betaald_totaal_cumul_eur'],
    );
  });
});