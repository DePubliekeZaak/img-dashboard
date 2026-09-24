import type { IDashboardController } from "./dashboard.controller";
import type { Version } from "./types";

/**
 * Webpack-native route map.
 *
 * Each nav slug maps to a *lazy* dynamic import of its page entry module. Because
 * these are real `import()` statements (no `webpackIgnore`), webpack treats every
 * page as an async chunk and emits it as a separate file that is fetched on demand
 * by the scaffold's webpack runtime. Shared code (src/charts, src/shared, src/stores,
 * src/widgets) and node_modules shared across pages are extracted into shared/vendor
 * chunks by `optimization.splitChunks` — see webpack.config.js. The chunk URLs are
 * resolved automatically via output.publicPath, so no script-scan heuristic is needed.
 *
 * The default export of each page entry is the page controller class; the scaffold
 * instantiates it with the same `new PageController(dashboardController)` signature
 * as the old `window[<topic>]` contract (see DashboardController.call).
 */
export interface PageModule {
  default: new (main: IDashboardController) => {
    init(version: Version): Promise<void> | void;
    destroy?(): void;
  };
}

// Default topic when none is requested or the requested slug is unknown.
export const DEFAULT_TOPIC = "regelingen";

export const routes: Record<string, () => Promise<PageModule>> = {
  actueel: () => import("../../pages/actueel/index"),
  regelingen: () => import("../../pages/regelingen/index"),
  fs_overzicht: () => import("../../pages/fs_overzicht/index"),
  fs_maatwerk: () => import("../../pages/fs_maatwerk/index"),
  fs_vaste_vergoeding: () => import("../../pages/fs_vaste_vergoeding/index"),
  aos: () => import("../../pages/aos/index"),
  "ims-overzicht": () => import("../../pages/ims-overzicht/index"),
  "ims-volwassenen": () => import("../../pages/ims-volwassenen/index"),
  "ims-kinderen-jongeren": () =>
    import("../../pages/ims-kinderen-jongeren/index"),
  "wd-overzicht": () => import("../../pages/wd-overzicht/index"),
  "wd-wonen": () => import("../../pages/wd-wonen/index"),
  "wd-nietwonen": () => import("../../pages/wd-nietwonen/index"),
  "wd-namco": () => import("../../pages/wd-namco/index"),
  waardering: () => import("../../pages/waardering/index"),
  bezwaren: () => import("../../pages/bezwaren/index"),
  specials: () => import("../../pages/specials/index"),
  gemeente: () => import("../../pages/gemeente/index"),
  correcties: () => import("../../pages/correcties/index"),
};

/**
 * Resolve a topic slug to its lazy loader, falling back to the default topic so an
 * unknown/empty `?topic=` never produces a broken import. This preserves the old
 * behaviour of defaulting to the first nav item while being robust to unknown slugs.
 */
export const resolveTopic = (
  slug: string,
): (() => Promise<PageModule>) => routes[slug] ?? routes[DEFAULT_TOPIC];
