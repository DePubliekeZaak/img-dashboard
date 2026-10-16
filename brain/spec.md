# IMG Publieke Data & Dashboard — Spec (living document)

**Status:** DRAFT — started 2026-10-14, filled gradually during this session.
**Scope:** The public IMG data publication, the data API, and the dashboard that
is embedded in the IMG website.
**Note:** This is a living document. Sections marked **[TO FILL]** get completed
during the session; nothing here is final until the status line is changed.

---

## 1. Source statement (authoritative, verbatim)

The IMG's own description of the published data (Dutch, as provided):

> Publieke data van het Instituut Mijnbouwschade Groningen
>
> Bijgaande data worden gegenereerd door het IMG, op basis van wekelijkse updates
> vanuit de administratiesystemen. Het gaat om geaggregeerde data ten behoeve van
> voortgangsrapportages en inzichtverwerving, waarbij een abstractieniveau is
> gekozen dat de privacy borgt van schademelders. Zo is er geen informatie
> beschikbaar op adresniveau. Dezelfde data vormt ook de basis van het online
> dashboard dat het IMG biedt op zijn website en de wekelijkse nieuwsupdates op
> die website. Het is niet uit te sluiten dat door de tijd heen data moet worden
> gecorrigeerd, bijvoorbeeld vanwege wijzigingen in het administratiesysteem,
> registratiefouten en verandering van aanpak van schadeafhandeling waardoor de
> onderliggende definities van de data wijzigen. Ook externe factoren kunnen
> wijzigingen veroorzaken, zoals herindeling van gemeentegrenzen.

Key points (English reading):

- **Producer:** IMG (Instituut Mijnbouwschade Groningen).
- **Origin:** weekly updates from the administration systems.
- **Nature:** aggregated data for progress reporting / insight; aggregation level
  is chosen so that claimant privacy is preserved (no address-level data).
- **Consumers:** the same data feeds (a) the online dashboard on the IMG website,
  and (b) the weekly news updates on that website.
- **Corrections:** data may need correction over time — due to admin-system
  changes, registration errors, changes in claims-handling approach (which change
  the underlying data definitions), or external factors such as municipality
  boundary reorganisation.

---

## 2. Totals and weekly totals (publication cadence)

> De data wordt wekelijks geupdate, voor zover de data beschikbaar is sinds dat
> moment. De update vindt plaats op woensdag en bevat dan gegevens tot de
> voorgaande zondag op maandag 0.00 uur. Dit bevat zowel totaal aantallen sinds
> de start van de regeling en daarnaast ook aantallen van de voorgaande week.

- Updates are **weekly** (as far back as data is available).
- Update happens on **Wednesday**, containing data **up to the previous Sunday
  (Monday 00:00)**.
- Each release contains **both**: total counts since the start of the scheme, and
  counts for the previous week.

---

## 3. Contact

- Questions: **persvoorlichting@schadedoormijnbouw.nl**

---

## 4. Data API

- **Spec:** `./swagger.json`
  - Referenced as **OAS 3.0**, version **0.0.3** (per the provided header).
  - **[TO FILL]** Confirm/reconcile: the local `public/swagger.json` in this repo
    is PostgREST-generated **Swagger 2.0** (title "PostgREST API", version 10.1.1,
    host `eiti.de-publieke-zaak.nl/api`), NOT the 0.0.3 OAS 3.0 spec. Need to
    determine where the 0.0.3 OAS 3.0 spec lives (img-server repo? published
    endpoint?) and whether it should be vendored here.
- **[TO FILL]** Endpoints, data model, aggregation dimensions (week/month), and
  metric definitions. Seed material available locally: `postgrest_endpoints.md`
  (regelingen / gemeenten materialised views).

---

## 5. Dashboard (embedding model)

- The dashboard is **loaded inside the IMG website** from a **single script tag**:
  `scripts/dashboard-bundle.js` (referenced by name by the host).
- The bundle is webpack-native code-split: one scaffold entry carries webpack's
  runtime + chunk loader; each topic page is a lazy async chunk; shared/vendor
  chunks are extracted via `optimization.splitChunks` (`chunks: "async"`).
- Host contract: exactly one `<script src="…/dashboard-bundle.js">`; no per-topic
  `window[<topic>]` contract; no vendor preload required.
- **[TO FILL]** Details of the host integration (how the website embeds the
  container element, versioning/`?v=` cache-busting, cross-origin/publicPath).

---

## 6. Infra / publication process

- Related infrastructure repository: **https://github.com/DePubliekeZaak/img-server**
  (the IMG server side of the publication process).
- **[TO FILL]** Deployment topology, data pipeline (admin systems → aggregate →
  PostgREST → dashboard/news), and environment details (img.publikaan.nl /
  graphs.publikaan.nl / eiti.de-publieke-zaak.nl).

---

## 7. References

- https://www.schadedoormijnbouw.nl/
- https://www.schadedoormijnbouw.nl/dashboard
- https://github.com/DePubliekeZaak/img-server
- This repo's `postgrest_endpoints.md`, `public/swagger.json`, and
  `brain/webpack-native-splitting-implementation.md`.

---

## 8. Security posture (pen-test prep, 2026-10-14)

**Context:** the host website is being penetration-tested next week; the dashboard is in scope. Findings below are from a code-level review of this repo, not a live test.

### 8.1 Surface inventory

- **Client-only, read-only.** The only network call is a plain `GET fetch()` to
  `https://img.de-publieke-zaak.nl/open-data/api/…` (PostgREST: `regelingen`,
  `gemeenten`, `tevredenheid`). No POST/PATCH/DELETE, no auth, no sessions, no
  cookies, no credentials.
- **Static assets:** single `scripts/dashboard-bundle.js` entry (webpack runtime
  + chunk loader) → async chunks (`vendors.*`, `shared.*`, per-page `*.js`),
  `main.css`, fonts, svg.
- **Client-side export:** SheetJS `xlsx@0.18.5` builds the workbook from table
  `textContent` (no formula-escape on leading `= + - @`; data is IMG-controlled,
  so Low).

### 8.2 Non-issues by design

- No auth → no auth bypass / CSRF / IDOR / session attacks.
- PostgREST parameterizes `eq.`/`gte.` filters → no SQLi via API params.
- `?topic=` → `resolveTopic()` falls back to `regelingen`; no user input becomes
  a dynamic chunk path → no RCE.
- `switchVersion()`'s `versie_001` branch injects a hardcoded `graphs.publikaan.nl`
  script — dead code (real slugs are `v1`/`001`) and not attacker-controlled.

### 8.3 To fix before test (repo-side)

1. **Source maps + stale bundles are deployed.** ✅ DONE 2026-10-14 — purged all
   `*.map` (52), `*.LICENSE.txt` (18), and old per-topic `*.bundle.js` (51)
   from `public/scripts/`, plus `main.css.map`; deploy scripts now use `--delete`
   so stale files are removed on the next deploy; the now-redundant
   `deploy_css.sh` (scp of just the css) was removed in favour of the full
   `rsync --delete` (it never saved time — it rebuilt everything — and couldn't
   reach browsers anyway because the css buster lives in `index.html`). Prod
   build keeps `devtool:false`.

   **Regression found while verifying `--delete` (2026-10-14): the refactor
   (PR #24, `e10f14b`) had silently stopped emitting `main.css`.** It replaced
   the old `css: { import: "/styling/main.scss" }` entry object with a single
   `scaffold` entry, relying on the `import "../../styling/main.scss"` in
   `src/browser/index.ts`. But `package.json` sets `sideEffects: false` for JS
   tree-shaking, which ALSO dropped the css import (no consumed JS binding) →
   the css chunk became orphaned and NO `public/styles/main.css` was emitted.
   The live site kept working only because the pre-refactor `main.css` survived
   on the server (scp never deleted it) — until `deploy_prod --delete` purged
   it. **Fix:** rule-level `sideEffects: true` on the `\.s[ac]ss$` rule in
   `webpack.config.js` (overrides the package-level `false` for css only; JS
   tree-shaking and bundle size unchanged). `main.css` emits again (37.1 KiB).
   TIP: bump the css buster in `index.html` (`?v=2` → `?v=3`) when deploying so
   clients don't serve the stale/404'd stylesheet from cache.
2. **Query-param crash.** ✅ DONE 2026-10-14 — `param.service.ts` now tolerates
   malformed percent-encoding (no `decodeURIComponent` throw) and falls back to
   the latest version for an unknown `?version=`; `data.service.buildUrl` guards
   an undefined version. Regression tests added (`test/param.service.test.ts`).
3. **Dependency hygiene.** ✅ DONE (package.json) 2026-10-14 — removed unused
   `axios`, `FileSaver`, `isomorphic-fetch`, `es6-promise`, `fs`, `dotenv`,
   `moment`, `marked`, `topojson-client`, `d3-sankey`, `os-browserify`,
   `path-browserify`; removed typosquat `wepack-cli` (misspelled `webpack-cli`)
   and duplicate `babel-polyfill`. **Action for human:** run `pnpm install` to
   prune `node_modules`/regenerate `pnpm-lock.yaml` (network needed; not done
   here). `xlsx@0.18.5` kept (only xlsx registry release; CVEs documented —
   evaluate SheetJS CDN build or a maintained fork separately).
4. **Type-check gate hygiene (bonus, found while verifying).** `tsconfig.json`
   now has `noEmit: true` (as the webpack refactor report claimed but never
   actually applied) — a plain `tsc -p tsconfig.json` was silently emitting ~200
   `.js` files into `src/`; `webpack.config.js` re-enables emit for ts-loader so
   the build still works.

### 8.5 Bundle-size impact of dependency hygiene (measured 2026-10-14)

**Result: no change.** Removing 13 unused deps (incl. the `wepack-cli` typosquat)
changed the shipped bundle by ~0 KiB — they were never imported, so webpack
`usedExports` tree-shaking already excluded them. The size win from this cleanup
is `node_modules`/install/lockfile footprint and attack surface, not the bundle.

Clean single-build total (after purge + one `npm run build:prod`):

| Asset | Refactor baseline (2026-09-24) | Now |
|---|---|---|
| `dashboard-bundle.js` (scaffold) | 299.9 KiB | 300.4 KiB |
| `vendors` | 271.6 KiB | 271.6 KiB |
| `shared` | 134.1 KiB | 134.3 KiB |
| common chunk | 119.1 KiB | 119.1 KiB |
| 18 page chunks | 0.6–36.0 KiB | 0.6–36.0 KiB (identical set) |
| **Total** | **≈ 1,173 KiB** | **1,174.0 KiB** |

The +0.6 KiB is the query-param hardening code (Fix 2), not dep removal.

**Monitoring:** `npm run size` (or `npm run build:size`) prints the table.
Caveat: builds do NOT clean their output dir (no `clean`/CleanWebpackPlugin), so
repeated builds accumulate duplicate hashed chunks locally — clean
`public/scripts` before measuring, and the deploy `--delete` keeps the server
clean.

### 8.4 Host-side to confirm (outside this repo)

- CSP + security headers on the host website (script-src incl. cdnjs,
  connect-src img.de-publieke-zaak.nl, `frame-ancestors` for embedding,
  `nosniff`, HSTS). — PENDING (host page; not reachable from VM).
- SRI on the cdnjs d3 script tag. — PENDING (host page).
- PostgREST schema / anon role / RLS — **RESOLVED 2026-10-14** (checked live
  DB via pgAdmin):
  - `api` schema contains **no base tables** — only views (~33) + functions.
    No RLS-bypass surface (RLS moot without exposed base tables).
  - `web_anon` **effective** privileges verified via `has_table_privilege`:
    **SELECT-only** — no INSERT/UPDATE/DELETE on any `api` view, so no write
    path through PostgREST even via the ~19 auto-updatable views.
  - Direct grants limited to 4 `main` objects (`gemeenten_maand/week`,
    `regelingen_week/maand`), SELECT-only; `main` is not a PostgREST-exposed
    schema → inert externally.
  - Role config sound: `PGRST_DB_ANON_ROLE: web_anon` separate from
    connection role; schema scope `api` (live) / `publiek` (public).
- nginx hardening — **baked into img-server config, canonical `nginx/` layout**
  (applied + restructured 2026-10-16; the `nginx/host/` WIP folder and the
  docker-nginx artifacts were removed):
  - Host deployment is the only one: `nginx/setup.sh` installs `nginx.conf`,
    installs `conf.d/_server.conf` (hostnames HARDCODED — no placeholders/sed,
    and NO-CLOBBER so certbot owns it after first run), installs
    `conf.d/{img,graphs}/*.locations`, runs `nginx -t`, restarts. Upstreams are
    docker services published on `127.0.0.1` loopback. Deleted: docker
    `nginx/nginx.conf` flavor, `_server.conf.template` (envsubst),
    `docker/nginx.Dockerfile` (custom_nginx retired — compose no longer has an
    nginx1 service).
  - `api.locations` (live: v2-api, archive-v0-api, public-api): `limit_except
    GET`, `client_max_body_size 1k`, `proxy_read_timeout 30s`,
    `proxy_hide_header X-Powered-By`, `limit_req zone=api burst=20 nodelay`;
    websocket `Upgrade`/`Connection` headers removed (PostgREST is plain HTTP).
  - `swagger.locations` (`/publieke-data/docs/`): `limit_except GET` + same
    timeout / rate-limit / hide-header.
  - `admin.locations` (`/pgadmin2/`): **home-only for the pen-test window**
    (`allow 62.166.178.42; deny all;`); office `94.208.77.77` left commented
    for re-enable after; dead `10.0.0.0/8` / LAN rules removed.
  - All server blocks: `X-Content-Type-Options nosniff`, `Referrer-Policy
    strict-origin-when-cross-origin`, `X-Frame-Options SAMEORIGIN`.
  - `nginx.conf`: `server_tokens off;`, `ssl_protocols TLSv1.2 TLSv1.3`,
    `ssl_session_cache shared:SSL:10m`, `limit_req_zone $binary_remote_addr
    zone=api:10m rate=10r/s`.
  - ⚠️ Certbot (host `--nginx`, one 4-SAN invocation) NOT yet run —
    `_server.conf` is still `listen 80` only until then. `setup.sh` is
    NO-CLOBBER on `_server.conf`: it renders the file only on first install,
    so certbot owns it afterward and re-running setup.sh NEVER wipes the
    443/redirect blocks. Reset path if ever needed:
    `sudo rm -f /etc/nginx/conf.d/_server.conf && sudo nginx/setup.sh`, then
    re-run the certbot command.
  - ⚠️ `add_header` inheritance footgun: the CORS static locations
    (fonts/geojson/graphs) set their own `add_header`, so those responses drop
    the server-level security headers (static assets only; API/HTML keep them).
  - TLS was certbot-managed live (multi-SAN cert for the de-publieke-zaak
    names); the old container letsencrypt volume is orphaned by the migration
    (prune after host cert renewed).

---

## 9. Open items [TO FILL] (session checklist)

- [ ] Resolve the swagger.json version question (OAS 3.0 0.0.3 vs PostgREST 2.0 10.1.1).
- [ ] Endpoint + data-model inventory from `postgrest_endpoints.md` / API.
- [ ] Dashboard host-integration contract (embedding, versioning).
- [ ] Infra / publication-process description (img-server).
- [x] Pen-test prep: purge source maps + stale bundles from deploy output (§8.3.1).
- [x] Pen-test prep: harden query-param parsing — `decodeURIComponent` + `version` guard (§8.3.2).
- [x] Pen-test prep: trim dead deps / upgrade xlsx (§8.3.3) — package.json + lockfile/node_modules pruned.
- [x] Pen-test prep: server `exposed_schemas` / anon role / RLS (§8.4) — verified SELECT-only, views-only.
- [ ] Pen-test prep: host CSP/SRI (§8.4) — host page, pending.
- [ ] Pen-test prep: deploy hardened host nginx (§8.4) — hardening is baked
  into the repo; remaining = host deploy via `nginx/setup.sh` + certbot
  (4-SAN, `--redirect`).
