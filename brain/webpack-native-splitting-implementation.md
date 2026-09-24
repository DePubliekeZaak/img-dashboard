# Webpack-native code splitting — implementation report

**Branch:** `refactor/webpack-native-splitting`
**Commit:** (final commit hash below)
**Base/PR target:** `main`
**Date:** 2026-09-24

## Verdict

The refactor is complete. The build now uses ONE webpack entry (the scaffold,
`scripts/dashboard-bundle.js`), a real topic→dynamic-import route map, and
`optimization.splitChunks` to extract shared source and node_modules into
webpack-managed async chunks. All gates are green at the final commit, and one PR
from `refactor/webpack-native-splitting` → `main` is open. This is a long-lived
working branch and is intentionally NOT deleted and the PR NOT closed.

---

## 1. What changed

### 1a. Collapse to one entry + route map
- `webpack.config.js`: removed the ~20 topic entries (each previously a
  `library:{name,type:"window",export:"default"}` bundle) and the vestigial
  `charts` / `css` entries. The only entry is the scaffold
  (`./src/browser/index.ts` → `scripts/dashboard-bundle.js`, the host-referenced
  name). The stylesheet still emits via `MiniCssExtractPlugin` → `./styles/main.css`
  because the scaffold imports `main.scss`.
- New `src/browser/dashboard/routes.ts`: maps every topic slug (all 18 pages,
  including `actueel`/`specials` which are built but not in the nav) to a lazy
  `() => import('../../pages/<topic>/index')`. Each page becomes a real webpack
  async chunk. `resolveTopic()` falls back to `regelingen` for unknown slugs.
- `dashboard.controller.ts`: replaced the `webpackIgnore` string import +
  `new window[this.params.topic](this)` with
  `const mod = await loader(); const ctrlr = new mod.default(this)`. The
  constructor signature (`new PageController(dashboardController)` +
  `init(version)`) is unchanged. Removed `getScriptBaseUrl()` (script-scan
  heuristic) — chunk URLs are now resolved by the webpack runtime via
  `output.publicPath`.

### 1b. splitChunks
```js
splitChunks: {
  chunks: "async",          // leaves the initial scaffold bundle self-contained
  cacheGroups: {
    defaultVendors: { test: /[\\/]node_modules[\\/]/, name: "vendors", priority: 10 },
    shared: { test: /[\\/]src[\\/](charts|shared|stores|widgets)[\\/]/, name: "shared",
              priority: 5, minChunks: 2, minSize: 0 },
  },
}
```
`chunks:"async"` is the key correctness choice: it splits only the per-page async
chunks, so the initial scaffold bundle (d3 + styling) stays one self-contained file
and the host still needs exactly ONE script tag. Shared/vendor chunks are ASYNC and
are fetched on demand by the scaffold's webpack runtime. This is precisely what the
old PR #19 splitChunks attempt could not do — there pages were separate *entry*
bundles and the vendor chunk was an *initial* chunk with no chunk-loader in any
bundle, so `window[<topic>]` was never set. With a single entry owning the runtime
+ chunk loader, that failure mode no longer applies.

### 1c. publicPath / chunk naming
- `output.publicPath` unchanged: prod `https://graphs.publikaan.nl/graphs/`,
  dev `/`. The runtime resolves hashed chunk URLs from there, so no script-scan is
  needed.
- `output.chunkFilename` is now `scripts/[name].[contenthash].js` — async chunks are
  content-hashed so cache-busting is automatic (they're only referenced by the
  runtime, never by name). `dashboard-bundle.js` keeps its fixed name.

### 1d. Routing (popstate)
- Added a `window.addEventListener("popstate", ...)` listener in
  `DashboardController.init()` that re-reads query params (`params.renew()`),
  re-mounts the topic (`call(false)`), and refreshes the active nav item.
  `pushState` (in-app nav) does not fire `popstate`, so there is no double-trigger.
  Back/forward now switches topics; it previously updated the URL with no reaction.
- Preserved `?topic= ?version= ?language=` query routing and the version-switch
  behavior (v001 injects the hardcoded
  `https://graphs.publikaan.nl/v001/scripts/dashboard-bundle.js`; new slugs
  pushState + reload).

### 1e. ParamService latent bug
Left untouched and noted: `param.service.ts` has
`if (primValue === "undefined" || "language")` which is always truthy (the string
literal `"language"` is truthy). Net effect is `_topic = "regelingen"` is always
set first, then overridden when `primKey === "topic"` — functionally benign today.
Changing it was judged not clearly low-risk (it would alter the no-param default
path), so it is left as-is.

---

## 2. Precondition audit (host / external contract)

Grepped the whole repo (`src/`, `public/`, `scripts/`, `*.md`, `package.json`,
`deploy_*.sh`, `webpack.config.js`, git log) for dependencies on the old contract:

- `window[<topic>]` → only referenced in `dashboard.controller.ts` (now removed).
- `<topic>.bundle.js` direct references → only in the old `webpack.config.js`
  (now removed). No `src/`, `public/`, `scripts/`, `deploy_*.sh`, `*.md`, or host
  file references any per-topic bundle.
- `scripts/dashboard-bundle.js` (host contract) → still emitted under the same
  name; `public/index.html` and the external host keep referencing it by name.
- Stale slugs `fs_historie`, `fs_daadwerkelijk_herstel`, `ims-herbeoordeling`,
  `fs_aanvullende_vaste_vergoeding` → only appear as commented-out nav entries in
  `nav.service.ts` and as data tags in `src/json/groups.json`; no page dir, no
  webpack entry, no script ref. Nothing depends on their bundles.
- `actueel` / `specials` → have page dirs and were built as entries but are NOT in
  the nav tree. Kept in the route map so they remain loadable via `?topic=…`; no
  external dependency found.

**No genuine external dependency on the removed per-topic bundles or `window[<topic>]`
was found.** The only externally-referenced artifact is `scripts/dashboard-bundle.js`,
which is preserved. **Follow-up for the human:** the external host should confirm it
loads only `dashboard-bundle.js` (no vendor preload) — with this change that is now
sufficient, and any cached `?v=` buster on `dashboard-bundle.js` should be bumped on
deploy.

---

## 3. Chunk-size reduction evidence (prod build)

### Old (self-contained, per PR #19 revert)
18 topic bundles, each inlining all shared code + node_modules:
- Range: **443–548 KiB per topic** (actueel 132 KiB is the only small one).
- **Total ≈ 9,111 KiB (8.9 MiB)** for the topic bundles alone.
- Every page navigation re-downloads ~533 KiB with no shared-cache benefit.

### New (webpack-native code splitting)
| Asset | Size |
|---|---|
| `scripts/dashboard-bundle.js` (scaffold + runtime) | 299.9 KiB |
| `scripts/vendors.*.js` (shared node_modules, loaded once) | 271.6 KiB |
| `scripts/shared.*.js` (src/charts+shared+stores+widgets) | 134.1 KiB |
| `scripts/8.*.js` (common chart controllers, shared) | 119.1 KiB |
| 18 per-page async chunks | 0.6 – 36.0 KiB each |
| **Total all JS** | **≈ 1,173 KiB (1.15 MiB)** |

Per-topic async chunk sizes:
`actueel 0.6 · correcties 12.4 · specials 13.5 · fs_overzicht 15.3 · wd-namco 16.9 ·
aos 18.5 · wd-wonen 19.4 · wd-nietwonen 19.5 · wd-overzicht 19.6 · ims-kinderen-jongeren
20.2 · ims-volwassenen 20.2 · fs_vaste_vergoeding 20.7 · ims-overzicht 21.7 · bezwaren
22.2 · fs_maatwerk 22.8 · gemeente 23.6 · regelingen 25.6 · waardering 36.0 (KiB)`

**Reduction:**
- Total shipped JS: **~9,111 KiB → ~1,173 KiB (≈ 7.8× smaller)**.
- Per-page code is **~15–40× smaller** than the old ~533 KiB self-contained bundles
  (e.g. regelingen 25.6 KiB vs 533 KiB).
- On-demand behaviour: first load fetches scaffold + vendors + shared + page
  (≈ 845 KiB), but `vendors`/`shared` are cached, so every subsequent page switch
  downloads only the tiny page chunk (≈ 13–36 KiB) instead of ~533 KiB.

---

## 4. Gates (all green at the final commit)

| Gate | Command | Result |
|---|---|---|
| TypeScript | `tsc -p tsconfig.json` | **clean** (0 errors; `noEmit: true` added so the gate is pure type-check) |
| Tests | `vitest run` | **401 passed, 3 skipped** (23 files passed, 1 skipped) — all green |
| Production build | `npm run build:prod` | **succeeds** (`webpack 5.111.1 compiled`; only non-fatal size/perf warnings: xlsx is 272 KiB, scaffold 300 KiB) |

Note on the test baseline: prior baseline was 380 passed / 3 skipped; current run is
401 passed / 3 skipped — the higher count reflects test additions that landed on
`main` since that baseline was collected (the suite here passes in full).

---

## 5. Follow-ups / risks (for the human)

1. **Host confirmation (recommended).** External host loads one script tag
   (`dashboard-bundle.js`) — now sufficient and correct. Bump the `?v=` cache-buster
   on that tag at deploy.
2. **Hardcoded domain cleanup.** Prod `publicPath` and the v001 version-switch both
   hardcode `graphs.publikaan.nl` / `img.publikaan.nl`. Left as-is (matches existing
   deploy), but could be derived from `DOMAIN`/deploy env in a future pass.
3. **Stale-bundle cleanup.** `public/scripts/*.bundle.js` for removed pages, plus
   older `fs_historie` / `fs_aanvullende_vaste_vergoeding` / `ims-herbeoordeling`
   bundles in the deployed output, are now obsolete and could be purged on the server.
4. **ParamService bug.** `if (primValue === "undefined" || "language")` is always
   truthy; left as-is (benign), documented above.
5. **Perf warnings.** `dashboard-bundle.js` (300 KiB) and `vendors` (272 KiB, mostly
   xlsx) exceed webpack's 244 KiB perf suggestion. Non-fatal. Optional future work:
   lazy-load `xlsx` only on the download path.
6. **`runtimeChunk`.** webpack suggests extracting the runtime to its own chunk for
   cache efficiency; intentionally NOT done because the host relies on a single
   script tag and the runtime must live in `dashboard-bundle.js`.

---

## 6. Files changed

- `webpack.config.js` — single entry + splitChunks + content-hashed chunkFilename + rewritten architecture comment.
- `src/browser/dashboard/routes.ts` — **new** route map (slug → lazy import).
- `src/browser/dashboard/dashboard.controller.ts` — route-map mounting, removed `getScriptBaseUrl`/`webpackIgnore`, added popstate listener.
- `public/index.html` — updated architecture comment; bumped `?v=` buster to 28.
- `.pi/skills/img-dashboard.md` — documented the new webpack-native architecture.
- `tsconfig.json` — added `noEmit: true` (tsc used as a type-check gate; prevents emitting `.js` beside `.ts`).
- `brain/webpack-native-splitting-implementation.md` — this report.
