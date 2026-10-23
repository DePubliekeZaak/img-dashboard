// legacy-kto.ts — version-gated compatibility layer for archived KTO data.
//
// Why this exists
// ---------------
// `?version=<slug>` only swaps the API base URL (see DataService.buildUrl); the
// bundle and every page config stay current. Until 1.0.2 the KTO ("waardering")
// numbers lived in their own weekly table, `tevredenheid`, with legacy column
// names (`maandcijfer`, `doorlopend_cijfer`, `*_maand_rapportcijfer_N`, ...).
// Since 1.0.2 the same numbers are served as `kto_score_*` columns on
// `regelingen`, so archived snapshots — which still serve the old table and
// still have `regelingen` *without* any `kto_score_*` columns — leave every KTO
// graph empty.
//
// What this does — and deliberately does not do
// ---------------------------------------------
// It does NOT rewrite requests to another table. Archived `regelingen` rows are
// healthy: money, counts and period columns already use their current names.
// The only thing missing is the `kto_score_*` block. So we leave the request URL
// alone and merge the legacy numbers into the response, keyed on `periode`.
// Money and count graphs are untouched because we never remove or overwrite a
// key; KTO graphs find exactly what they expect.
//
// Consumers that ask for `kto_score_*`/`complete` in a `select=` would make
// PostgREST reject the request on an archive (unknown column), so those tokens
// are stripped first (stripKtoSelect) and the values arrive via the merge.
//
// Scope: archived versions only. `latest` is never touched.
//
// The durable fix is a per-version `config.json` emitted at archive-cut time
// (columns, endpoints, labels) so old snapshots are described by old configs and
// no request-time translation is needed at all. This file is the stopgap.

export const LEGACY_KTO_TABLE = "tevredenheid";

export type LegacyAggregatie = "week" | "maand";

type Row = Record<string, any>;

/** domein_code -> legacy column prefix. '' = the unprefixed base columns. */
const DOMEIN_PREFIX: Record<string, string> = {
  Totaal: "",
  FYSIEK: "fysieke_schade_",
  IMS: "ims_",
  WDL: "waardedaling_",
};

/**
 * regeling_code -> legacy column prefix. `null` means the series never existed
 * in the legacy table (MW, WNW, NAMTEG were introduced with 1.0.2), so there is
 * nothing to merge and the chart legitimately has no history.
 */
const REGELING_PREFIX: Record<string, string | null> = {
  Totaal: "",
  VV: "ves_",
  MW: null,
  IMK: "imkj_",
  IMS: "ims_",
  WD: "waardedaling_",
  WNW: null,
  NAMTEG: null,
};

export const isArchivedVersion = (tag?: string): boolean =>
  !!tag && tag !== "latest";

/** A request whose response rows can carry KTO columns (aggregated `regelingen`). */
export const isAggregationRequest = (endpoint: string): boolean =>
  endpoint.startsWith("regelingen?") && /[?&]aggregatie=eq\.(week|maand)/.test(endpoint);

const KTO_SELECT_TOKEN = /^(kto_score_.*|complete)$/;

/**
 * Drop `kto_score_*` / `complete` from a `select=` list. An archive has no such
 * columns, so asking for them returns 400 instead of data. If nothing is left,
 * the whole parameter is removed (select all columns).
 */
export const stripKtoSelect = (endpoint: string): string => {
  const [pathAndQuery] = endpoint.split("#");
  const qIndex = pathAndQuery.indexOf("?");
  if (qIndex === -1) return endpoint;

  const path = pathAndQuery.slice(0, qIndex);
  const params = pathAndQuery.slice(qIndex + 1).split("&");
  const out: string[] = [];

  for (const param of params) {
    const eq = param.indexOf("=");
    const key = eq === -1 ? param : param.slice(0, eq);
    const value = eq === -1 ? "" : param.slice(eq + 1);

    if (key !== "select") {
      out.push(param);
      continue;
    }

    let tokens: string[] = [];
    try {
      tokens = decodeURIComponent(value).split(",");
    } catch {
      out.push(param);
      continue;
    }
    const kept = tokens.map((t) => t.trim()).filter((t) => t && !KTO_SELECT_TOKEN.test(t));
    if (kept.length > 0) out.push(`select=${encodeURIComponent(kept.join(","))}`);
  }

  return out.length > 0 ? `${path}?${out.join("&")}` : path;
};

const pad = (n: number): string => String(n).padStart(2, "0");

/** 1-10 scale: the legacy table uses 0 for "no respondents". */
const score = (v: any): number | null =>
  typeof v === "number" && v > 0 ? v : null;

const count = (v: any): number | null =>
  typeof v === "number" ? v : null;

/**
 * The month a legacy row reports. Rows published in early January report
 * December, which belongs to the previous year.
 */
const completedYear = (row: Row): number => {
  const year = Number(row._year);
  const month = Number(row.completed_month ?? row._month);
  return month === 12 && Number(row._month) === 1 ? year - 1 : year;
};

const weekKey = (row: Row): string | null => {
  const yw = String(row._yearweek ?? "");
  if (/^\d{6}$/.test(yw)) return `${yw.slice(0, 4)}_${yw.slice(4)}`;
  if (row._year !== undefined && row._week !== undefined) {
    return `${row._year}_${pad(Number(row._week))}`;
  }
  return null;
};

const monthKey = (row: Row): string | null => {
  const month = Number(row.completed_month ?? row._month);
  if (!Number.isFinite(month) || month < 1 || month > 12) return null;
  return `${completedYear(row)}_${pad(month)}`;
};

/** Per-row legacy column prefix, from the row's own codes where available. */
const prefixFor = (row: Row): string | null | undefined => {
  const regeling = row.regeling_code;
  if (regeling && regeling !== "Totaal") {
    return REGELING_PREFIX[regeling];
  }
  const domein = row.domein_code;
  if (domein && domein !== "Totaal") {
    return DOMEIN_PREFIX[domein];
  }
  return "";
};

/**
 * The KTO columns for one legacy row, in current `kto_score_*` naming.
 * Only keys with data are included; absent ones stay absent rather than
 * becoming `undefined`, so a chart sees "no series" instead of a gap.
 */
const ktoColumns = (row: Row, prefix: string): Row => {
  const isBase = prefix === "";
  const cols: Row = {
    kto_score_gemiddeld: score(row[`${prefix}maandcijfer`]),
    kto_score_gemiddeld_cumul: score(row[`${prefix}doorlopend_cijfer`]),
    kto_score_totaal: count(
      isBase ? row.aantal_respondenten_maand : row[`${prefix}aantal_respondenten`],
    ),
    kto_score_totaal_cumul: count(
      isBase ? row.aantal_respondenten : row[`${prefix}aantal_respondenten_doorlopend`],
    ),
  };

  for (let n = 1; n <= 10; n++) {
    const maand = row[`${prefix}maand_rapportcijfer_${n}`];
    const doorlopend = row[`${prefix}doorlopend_rapportcijfer_${n}`];
    if (maand !== undefined) cols[`kto_score_${n}_aantal`] = count(maand);
    if (doorlopend !== undefined) cols[`kto_score_${n}_aantal_cumul`] = count(doorlopend);
  }

  return cols;
};

/**
 * Index the legacy table for lookup by period. Weekly rows are kept per week;
 * monthly figures only exist once a publication is flagged `complete`, and a
 * month published more than once keeps its most recent row.
 */
export const buildLegacyIndex = (
  legacyRows: Row[],
): Record<LegacyAggregatie, Map<string, Row>> => {
  const week = new Map<string, Row>();
  const maand = new Map<string, Row>();
  const maandDate = new Map<string, string>();

  for (const row of legacyRows) {
    if (row.gemeente !== undefined && row.gemeente !== "all") continue;

    const wk = weekKey(row);
    if (wk && !week.has(wk)) week.set(wk, row);

    if (row.complete !== true) continue;
    const mk = monthKey(row);
    if (!mk) continue;
    const date = String(row._date ?? "");
    const seen = maandDate.get(mk);
    if (!seen || date > seen) {
      maand.set(mk, row);
      maandDate.set(mk, date);
    }
  }

  return { week, maand };
};

/**
 * Merge legacy KTO numbers into archived `regelingen` aggregation rows.
 *
 * Never throws and never removes keys: if the legacy table is missing or a row
 * has no counterpart, the row is returned unchanged. That keeps money and count
 * graphs working on archives that predate the legacy export.
 */
export const enrichKtoRows = (
  rows: Row[],
  legacyRows: Row[],
  warn?: (message: string) => void,
): Row[] => {
  if (!Array.isArray(rows) || rows.length === 0) return rows;
  const index = buildLegacyIndex(legacyRows ?? []);

  return rows.map((row) => {
    const aggregatie = row.aggregatie === "maand" ? "maand" : "week";
    const key = String(row.periode ?? "");
    const legacy = index[aggregatie].get(key);
    if (!legacy) return row;

    const prefix = prefixFor(row);
    if (prefix === null || prefix === undefined) {
      // Series that never existed before 1.0.2 (MW, WNW, NAMTEG): nothing to add.
      if (prefix === null && warn) {
        warn(`legacy KTO: no pre-1.0.2 series for regeling_code=${row.regeling_code}`);
      }
      return row;
    }

    const cols = ktoColumns(legacy, prefix);
    const merged: Row = { ...row };
    for (const [k, v] of Object.entries(cols)) {
      if (merged[k] === undefined || merged[k] === null) merged[k] = v;
    }
    return merged;
  });
};
