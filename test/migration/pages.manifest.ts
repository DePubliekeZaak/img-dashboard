// pages.manifest.ts — the ONE hand-maintained list of migrated pages.
// Each entry: a live IPageConfig, the registries exactly as PageController.init
// receives them, and recorded fixtures.
//
// Adding a page = add one object here + record its fixture. No new test file.
import type { IPageConfig } from "../../src/shared/interfaces";

// ── fs_overzicht ──
import fsOverzichtConfig from "../../src/pages/fs_overzicht/config";
import fsOverzichtGroups from "../../src/pages/fs_overzicht/groups";
import fsOverzichtGraphs from "../../src/pages/fs_overzicht/graphs";
import fsOverzichtWeek from "../fixtures/fs_overzicht/fs_totals/week.json";
import fsOverzichtMonth from "../fixtures/fs_overzicht/fs_totals/month.json";

// ── fs_maatwerk ──
import fsMaatwerkConfig from "../../src/pages/fs_maatwerk/config";
import fsMaatwerkGroups from "../../src/pages/fs_maatwerk/groups";
import fsMaatwerkGraphs from "../../src/pages/fs_maatwerk/graphs";
import fsMaatwerkWeek from "../fixtures/fs_maatwerk/fs_totals/week.json";
import fsMaatwerkMonth from "../fixtures/fs_maatwerk/fs_totals/month.json";
import fsMaatwerkKTO from "../fixtures/regelingen/all_waardering/ep1.json";

// ── fs_vaste_vergoeding ──
import fsVVConfig from "../../src/pages/fs_vaste_vergoeding/config";
import fsVVGroups from "../../src/pages/fs_vaste_vergoeding/groups";
import fsVVGraphs from "../../src/pages/fs_vaste_vergoeding/graphs";
import fsVVWeek from "../fixtures/fs_vaste_vergoeding/vv_totals/week.json";
import fsVVMonth from "../fixtures/fs_vaste_vergoeding/vv_totals/month.json";
import fsVVKTO from "../fixtures/regelingen/all_waardering/ep1.json";

// ── ims-overzicht ──
import imsConfig from "../../src/pages/ims-overzicht/config";
import imsGroups from "../../src/pages/ims-overzicht/groups";
import imsGraphs from "../../src/pages/ims-overzicht/graphs";
import imsWeek from "../fixtures/ims-overzicht/ims_data/week.json";
import imsMonth from "../fixtures/ims-overzicht/ims_data/month.json";
import imsKTO from "../fixtures/regelingen/all_waardering/ep1.json";

// ── wd-overzicht ──
import wdOverzichtConfig from "../../src/pages/wd-overzicht/config";
import wdOverzichtGroups from "../../src/pages/wd-overzicht/groups";
import wdOverzichtGraphs from "../../src/pages/wd-overzicht/graphs";

// ── ims-kinderen-jongeren ──
import imsKJConfig from "../../src/pages/ims-kinderen-jongeren/config";
import imsKJGroups from "../../src/pages/ims-kinderen-jongeren/groups";
import imsKJGraphs from "../../src/pages/ims-kinderen-jongeren/graphs";

export interface MigratedPage {
  /** Human label / page slug */
  slug: string;
  /** The live IPageConfig (default export) */
  config: IPageConfig;
  /** Live groups registry object */
  groups: Record<string, new (...args: any[]) => any>;
  /** Live graphs registry object */
  graphs: Record<string, new (...args: any[]) => any>;
  /**
   * Fixtures keyed by endpoint fragment.
   * The contract calls fixtureData(payloads, group.resolvedEndpoints) where
   * payloads is built from this map by matching each group's endpoints.
   */
  fixtures: Record<string, { week?: any[]; month?: any[]; single?: any[] }>;
  /** Groups that generate their own endpoints — fed direct data instead */
  directData?: Record<string, Record<string, any[]>>;
  /** Groups whose functionality lacks "table" — skip table assertions */
  skipTableAssertions?: string[];
}

export const MIGRATED_PAGES: MigratedPage[] = [
  // ═══════════════════════════════════════════
  // fs_overzicht
  // ═══════════════════════════════════════════
  {
    slug: "fs_overzicht",
    config: fsOverzichtConfig as unknown as IPageConfig,
    groups: fsOverzichtGroups,
    graphs: fsOverzichtGraphs,
    fixtures: {
      "regeling_code=eq.Totaal": { week: fsOverzichtWeek as any[], month: fsOverzichtMonth as any[] },
    },
  },

  // ═══════════════════════════════════════════
  // fs_maatwerk
  // ═══════════════════════════════════════════
  {
    slug: "fs_maatwerk",
    config: fsMaatwerkConfig as unknown as IPageConfig,
    groups: fsMaatwerkGroups,
    graphs: fsMaatwerkGraphs,
    fixtures: {
      "regeling_code=eq.MW": { week: fsMaatwerkWeek as any[], month: fsMaatwerkMonth as any[] },
      "tevredenheid": { single: fsMaatwerkKTO as any[] },
    },
  },

  // ═══════════════════════════════════════════
  // fs_vaste_vergoeding
  // ═══════════════════════════════════════════
  {
    slug: "fs_vaste_vergoeding",
    config: fsVVConfig as unknown as IPageConfig,
    groups: fsVVGroups,
    graphs: fsVVGraphs,
    fixtures: {
      "regeling_code=eq.VV": { week: fsVVWeek as any[], month: fsVVMonth as any[] },
      "tevredenheid": { single: fsVVKTO as any[] },
    },
  },

  // ═══════════════════════════════════════════
  // ims-overzicht
  // ═══════════════════════════════════════════
  {
    slug: "ims-overzicht",
    config: imsConfig as unknown as IPageConfig,
    groups: imsGroups,
    graphs: imsGraphs,
    skipTableAssertions: ["ims_totaal_keuzepaden"],
    fixtures: {
      "regeling_code=eq.Totaal": { week: imsWeek as any[], month: imsMonth as any[] },
      "tevredenheid": { single: imsKTO as any[] },
    },
  },

  // ═══════════════════════════════════════════
  // wd-overzicht
  // ═══════════════════════════════════════════
  {
    slug: "wd-overzicht",
    config: wdOverzichtConfig as unknown as IPageConfig,
    groups: wdOverzichtGroups,
    graphs: wdOverzichtGraphs,
    skipTableAssertions: ["wd_totaal_varianten"],
    fixtures: {
      "regeling_code=eq.Totaal": { week: imsWeek as any[], month: imsMonth as any[] },
      "tevredenheid": { single: imsKTO as any[] },
    },
  },

  // ═══════════════════════════════════════════
  // ims-kinderen-jongeren
  // ═══════════════════════════════════════════
  {
    slug: "ims-kinderen-jongeren",
    config: imsKJConfig as unknown as IPageConfig,
    groups: imsKJGroups,
    graphs: imsKJGraphs,
    fixtures: {
      "regeling_code=eq.IMK": { week: imsWeek as any[], month: imsMonth as any[] },
      "tevredenheid": { single: imsKTO as any[] },
    },
  },
];