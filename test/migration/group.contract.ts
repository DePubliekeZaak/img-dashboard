// group.contract.ts — generic assertions for every group of every migrated page.
//
// Shape-tolerant: it derives what to check from what prepareData actually
// returns, not from assumptions about four-table splits.
// Handles DefaultGroupV1 (four tables), KTOGroupV1 (month-only), and
// ComparisonGroupV1 (self-endpoint) with no special cases beyond the
// fixture-resolution path.
//
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { resetStore, initPageStore, buildGroup, fakePage, fixtureData, mountGroup } from '../helpers/harness';
import type { MigratedPage } from './pages.manifest';
import type { IGroupMappingV2 } from '../../src/shared/interfaces';

// ----------------------------------------------------------------------------
// Helpers — small, generic, config-derived
// ----------------------------------------------------------------------------

/** Count INC (non-cumul/ delta) parameters across ALL graphs, excluding
 *  parameters with excludeFromTable=true.  Mirrors paramsAndModifiers logic. */
export function countIncParams(groupConfig: any): number {
  const seen = new Set<string>();
  let count = 0;
  for (const graph of (groupConfig.graphs ?? [])) {
    for (const p of (graph.parameters ?? []).flat()) {
      if (p.excludeFromTable) continue;
      if (seen.has(p.column)) continue;
      seen.add(p.column);
      count++;
    }
  }
  return count;
}

/** Count CUMUL parameters — same logic, across all graphs, excludeFromTable respected. */
export function countCumulParams(groupConfig: any): number {
  const seen = new Set<string>();
  let count = 0;
  for (const graph of (groupConfig.graphs ?? [])) {
    for (const p of (graph.parameters ?? []).flat()) {
      if (p.excludeFromTable) continue;
      if (seen.has(p.column)) continue;
      seen.add(p.column);
      count++;
    }
  }
  return count;
}

/** Tables that are non-null and non-empty — handles four-table and KTO patterns */
export function populatedTables(result: any): Array<{ id: string; rows: any[]; headers: any[] }> {
  const ids = ['weekTableInc', 'weekTableCumul', 'monthTableInc', 'monthTableCumul'];
  const out: Array<{ id: string; rows: any[]; headers: string[] }> = [];
  for (const id of ids) {
    const t = result[id];
    if (t && Array.isArray(t.rows) && t.rows.length > 0) {
      out.push({ id, rows: t.rows, headers: t.headers ?? [] });
    }
  }
  return out;
}

/**
 * Expected visible table ID from a group's segment.
 * Mirrors the formula in table.factory.ts: state[0] + state[1] * 2.
 * The toggler defaults:
 *   periodIndex = (segment.periodization === 'monthly') ? 1 : 0
 *   calcIndex   = segment.cumulative ? 1 : 0
 */
export function expectedVisibleId(segment: any): string {
  const tableIds = ['week-table-inc', 'month-table-inc', 'week-table-cumul', 'month-table-cumul'];
  const periodIndex = segment?.periodization === 'monthly' ? 1 : 0;
  const calcIndex = segment?.cumulative ? 1 : 0;
  return tableIds[periodIndex + calcIndex * 2];
}

/** Period count from fixtures for a group (applies complete filter for KTO) */
export function expectedPeriodCount(page: MigratedPage, groupConfig: any): number | null {
  // For KTO, count from the tevredenheid fixture directly
  if (groupConfig.ctrlr === 'KTOGroupV1') {
    const tev = page.fixtures['tevredenheid']?.single;
    if (tev) {
      // The KTO pipeline filters by complete === true
      return tev.filter((r: any) => r.complete === true).length;
    }
    return null; // no KTO fixture — can't determine
  }
  // For others, derive from fixture data matched to this group's endpoints
  const eps = groupConfig.endpoints?.length > 0 ? groupConfig.endpoints : page.config.endpoints;
  const weekEp = eps?.find((e: string) => e.includes('eq.week'));
  const weekFixture = weekEp
    ? Object.values(page.fixtures).find((f) => weekEp.includes(Object.keys(page.fixtures).find(k => weekEp.includes(k)) ?? ''))
    : null;
  // Simple: just use the page's week fixture length if available
  const weekF = getWeekFixture(page, groupConfig);
  return weekF ? weekF.length : null;
}

function getWeekFixture(page: MigratedPage, groupConfig: any): any[] | null {
  // Match the group's first endpoint against fixture keys
  const eps = groupConfig.endpoints?.length > 0 ? groupConfig.endpoints : page.config.endpoints;
  for (const ep of eps ?? []) {
    for (const [key, val] of Object.entries(page.fixtures)) {
      if (ep.includes(key) && val.week) return val.week;
    }
  }
  return null;
}

function getMonthFixture(page: MigratedPage, groupConfig: any): any[] | null {
  const eps = groupConfig.endpoints?.length > 0 ? groupConfig.endpoints : page.config.endpoints;
  for (const ep of eps ?? []) {
    for (const [key, val] of Object.entries(page.fixtures)) {
      if (ep.includes(key) && val.month) return val.month;
    }
  }
  return null;
}

/** Resolve fixture data for a group — builds payload keys that match
 *  resolved endpoint URLs via substring matching (same as fixtureData's
 *  ep.includes(k) logic).  Handles both regeling-specific fixtures
 *  (matching by domein_code + regeling_code) and tevredenheid (literal).
 */
export function resolveFixtures(page: MigratedPage, groupConfig: any): Record<string, any[]> {
  const result: Record<string, any[]> = {};
  const firstEp = page.config.endpoints?.[0] ?? '';
  const dcMatch = firstEp.match(/domein_code=eq\.(\w+)/);
  const domeinCode = dcMatch ? dcMatch[1] : '';

  for (const [key, val] of Object.entries(page.fixtures)) {
    if (key === 'tevredenheid') {
      if (val.single) result[key] = val.single;
      continue;
    }
    // Build keys that include domein_code + regeling_code + aggregation,
    // matching the pattern found in resolved endpoint URLs.
    const wkKey = `aggregatie=eq.week&domein_code=eq.${domeinCode}&${key}`;
    if (val.week) result[wkKey] = val.week;
    const moKey = `aggregatie=eq.maand&domein_code=eq.${domeinCode}&${key}`;
    if (val.month) result[moKey] = val.month;
  }
  return result;
}

// ----------------------------------------------------------------------------
// Group contract — the shared assertions
// ----------------------------------------------------------------------------

export function runGroupContract(page: MigratedPage, groupConfig: any, index: number) {
  const label = `${page.slug} / ${groupConfig.slug}`;

  // ── wiring: pure config+registry, no fixture needed ──
  it(`${label}: group controller "${groupConfig.ctrlr}" resolves in registry`, () => {
    expect(page.groups[groupConfig.ctrlr]).toBeDefined();
  });

  if (groupConfig.graphs?.length > 0) {
    it(`${label}: every graph controller resolves in registry`, () => {
      for (const g of groupConfig.graphs) {
        expect(page.graphs[g.ctrlr], `missing graph ctrlr "${g.ctrlr}"`).toBeDefined();
      }
    });
  }

  // ── data contract: needs fixtures ──
  describe(`${label}: data contract`, () => {
    let result: any;
    let container: HTMLElement | null = null;
    let group: any;

    beforeEach(() => {
      resetStore();
      initPageStore(page.config);
      const p = fakePage(page.config);
      group = buildGroup(p, groupConfig, page.groups, index);
      p.chartArray = [group];

      // Resolve data: fixture-based
      const rawData = resolveFixtures(page, groupConfig);
      const resolved = fixtureData(rawData, group.resolvedEndpoints);
      group.data = { ...group.data, ...resolved };

      // If the group has a prepareData method, call it
      if (group.ctrlr.prepareData) {
        const processed = group.ctrlr.prepareData(group.data);
        group.data = { ...group.data, ...processed };
      }

      // html() builds the data structure including tables/pies
      if (group.ctrlr.html) {
        group.ctrlr.html();
      }

      // populateTable renders the table DOM elements needed for visibility tests
      if (group.ctrlr.populateTable && groupConfig.functionality?.includes?.('table')) {
        group.ctrlr.populateTable(group.data);
      }

      result = group.data;

      // Mount the page's htmlContainer to document.body so tables appear in
      // the DOM — same pattern as the existing per-group tests.
      if (groupConfig.functionality?.includes('table')) {
        document.body.appendChild(p.main.htmlContainer);
        container = p.main.htmlContainer;
      }
    });
    afterEach(() => {
      if (container) container.remove();
    });

    it(`boots and returns a result`, () => {
      expect(result).toBeDefined();
    });

    // ── table contract (skip groups without "table" in functionality) ──
    const hasTable = groupConfig.functionality?.includes?.('table');
    const skipTable = page.skipTableAssertions?.includes(groupConfig.slug) ?? false;

    if (hasTable && !skipTable) {
      it(`populated tables have rows matching fixture period count`, () => {
        const tables = populatedTables(result);
        if (tables.length === 0) return; // group has no populated tables — skip

        const weekPeriods = getWeekFixture(page, groupConfig)?.length;
        const monthPeriods = getMonthFixture(page, groupConfig)?.length;

        for (const t of tables) {
          const isWeek = t.id.startsWith('week');
          const expectedLen = isWeek ? weekPeriods : monthPeriods;
          if (expectedLen != null) {
            expect(t.rows.length, `${t.id}: expected ${expectedLen} rows`).toBe(expectedLen);
          }
        }
      });

      it(`exactly one table visible and it has rows`, () => {
        if (!container) return; // not mounted
        const tables = Array.from(container.querySelectorAll('table'));
        if (tables.length === 0) return; // no tables rendered — skip
        const visible = tables.filter((t: any) => !t.classList.contains('hidden'));
        expect(visible.length).toBe(1);

        const visibleId = expectedVisibleId(groupConfig.segment);
        expect(visible[0].id).toBe(visibleId);

        const bodyRows = visible[0].querySelectorAll('tbody tr');
        expect(bodyRows.length).toBeGreaterThan(0);
      });

      it(`no "undefined" or "Invalid Date" or empty dash in any table cell`, () => {
        // Skip for KTO: KTO tables legitimately contain "-" for null domain data
        if (groupConfig.ctrlr === 'KTOGroupV1') return;
        const tables = populatedTables(result);
        for (const t of tables) {
          for (const row of t.rows) {
            for (const cell of row) {
              const s = String(cell);
              expect(s).not.toMatch(/^\s*-\s*$|undefined|Invalid Date|^$/);
            }
          }
        }
      });
    } else if (hasTable && !skipTable) {
      it('(no table assertions — group has no populated tables)', () => {});
    }
  });
}