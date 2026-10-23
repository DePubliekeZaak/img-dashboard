/**
 * Legacy KTO (klanttevredenheid / waardering) compatibility shim.
 *
 * WHY THIS EXISTS
 * ---------------
 * Until version 1.0.2 (published 12/10/2026) the waarderingscijfers were served
 * from a dedicated `tevredenheid` table. From 1.0.2 on they live on the
 * `regelingen` aggregation table as `kto_score_*` columns, and the frontend was
 * migrated to that schema (commits 8898e16 / 8625074 / e159dd8, 20–21/10/2026):
 * every `tevredenheid` endpoint reference and every legacy column name was
 * removed from the page configs.
 *
 * Archived versions (`?version=100`, ...) still serve the OLD payload, because
 * `?version=` only swaps the API base URL (see `DataService.buildUrl`); config
 * and bundle stay current. So archived KTO groups request `kto_score_*`
 * columns that a pre-1.0.2 snapshot cannot have and render empty.
 *
 * This module translates a KTO aggregation request into the legacy
 * `tevredenheid` request and normalises the legacy rows into the shape the
 * current graphs expect. It is version-gated: for the live version it is a
 * no-op, so the current pipeline is untouched.
 *
 * DURABILITY
 * ----------
 * This is a translation layer at the seam where old data meets new code. The
 * durable fix is to version the *config* alongside the data (emit
 * `<version>/config.json` at archive-cut time) and keep one bundle. This shim
 * is deliberately dependency-free and pure so it can be deleted in one move
 * once archived configs exist.
 */

/** Table that served KTO before version 1.0.2. */
export const LEGACY_KTO_TABLE = "tevredenheid";

/**
 * Legacy column prefixes per `domein_code`. `""` means the unprefixed base
 * columns (doorlopend_cijfer, maandcijfer, aantal_respondenten, ...).
 */
const DOMEIN_PREFIX: Record<string, string> = {
  Totaal: "",
  FYSIEK: "fysieke_schade_",
  IMS: "ims_",
  WDL: "waardedaling_",
};

/**
 * Legacy column prefixes per `regeling_code`. Note that the legacy table was
 * keyed by domein only; per-regeling series are recovered from the prefixed
 * column families that already existed on it. MW (maatwerk) and the
 * specifieke-regelingen codes never had KTO series.
 */
const REGELING_PREFIX: Record<string, string> = {
  VV: "ves_",
  IMK: "imkj_",
  IMS: "ims_",
  WD: "waardedaling_",
};

export type LegacyAggregatie = "week" | "maand";

export interface LegacyKtoPlan {
  /** Endpoint to fetch instead of the requested one. */
  table: string;
  /** Legacy column prefix for this request ( `""` = base columns). */
  prefix: string;
  /** Aggregation of the request; drives the row synthesis. */
  aggregatie: LegacyAggregatie;
  /** False when this domein/regeling had no KTO series in the legacy table. */
  supported: boolean;
}

type Row = Record<string, any>;

const queryParams = (endpoint: string): Record<string, string> => {
  const q = endpoint.includes("?") ? endpoint.slice(endpoint.indexOf("?") + 1) : "";
  const out: Record<string, string> = {};
  for (const part of q.split("&")) {
    if (!part) continue;
    const [key, value = ""] = part.split("=");
    if (!key) continue;
    try {
      out[key] = decodeURIComponent(value);
    } catch {
      out[key] = value;
    }
  }
  return out;
};

const eqValue = (value?: string): string | undefined =>
  value && value.startsWith("eq.") ? value.slice(3) : undefined;

/**
 * True when `endpoint` is a KTO aggregation request against `regelingen`,
 * i.e. its `select` asks for `kto_score_*` columns. Any other request (money,
 * volumes, counts) is left alone.
 */
export const isKtoRequest = (endpoint: string): boolean => {
  if (!endpoint.startsWith("regelingen?")) return false;
  const raw = endpoint.includes("select=")
    ? endpoint.slice(endpoint.indexOf("select="))
    : "";
  try {
    return decodeURIComponent(raw).includes("kto_score");
  } catch {
    return raw.includes("kto_score");
  }
};

/**
 * Decide whether a request must be served from the legacy table.
 *
 * @param endpoint aggregation endpoint as written in a page config
 * @param versionTag `Version.tag` — anything but `"latest"` is an archive
 */
export const planLegacyKto = (
  endpoint: string,
  versionTag: string | undefined,
): LegacyKtoPlan | null => {
  if (!versionTag || versionTag === "latest") return null;
  if (!isKtoRequest(endpoint)) return null;

  const params = queryParams(endpoint);
  const aggregatie: LegacyAggregatie =
    eqValue(params.aggregatie) === "maand" ? "maand" : "week";

  const regeling = eqValue(params.regeling_code);
  const domein = eqValue(params.domein_code);

  // Per-regeling requests take precedence: they carry their own prefix family.
  let prefix: string | undefined;
  if (regeling && regeling !== "Totaal") {
    prefix = REGELING_PREFIX[regeling];
  } else if (domein) {
    prefix = DOMEIN_PREFIX[domein];
  }

  return {
    table: LEGACY_KTO_TABLE,
    prefix: prefix ?? "",
    aggregatie,
    supported: prefix !== undefined,
  };
};

/**
 * Legacy scores use 0 for "no respondents this period" (the scale is 1–10),
 * which would otherwise draw a real zero on the chart. Normalise to null.
 */
const score = (value: any): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (Number.isNaN(n) || n <= 0) return null;
  return n;
};

const count = (value: any): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
};

const pad = (n: number): string => String(n).padStart(2, "0");

/**
 * Year that a completed month belongs to. The legacy table publishes a month's
 * figure in the first week AFTER that month, so a row dated in January with
 * `completed_month = 12` belongs to the previous year.
 */
const completedYear = (row: Row): number => {
  const year = Number(row._year);
  const month = Number(row.completed_month);
  if (!Number.isFinite(year) || !Number.isFinite(month)) return year;
  return month === 12 && Number(row._month) === 1 ? year - 1 : year;
};

const periodFor = (row: Row, aggregatie: LegacyAggregatie): string => {
  if (aggregatie === "maand") {
    return `${completedYear(row)}_${pad(Number(row.completed_month))}`;
  }
  // `_yearweek` is "202625" in the legacy payload; the current API uses
  // "2026_25". Fall back to year + week for rows without it.
  const yw = String(row._yearweek ?? "");
  if (/^\d{4}\d{2}$/.test(yw)) return `${yw.slice(0, 4)}_${yw.slice(4)}`;
  return `${row._year}_${pad(Number(row._week))}`;
};

/**
 * First and last day of the completed month, as ISO dates. The legacy row's
 * `_startdatum`/`_einddatum` describe the publication week, which is not the
 * period a monthly aggregation row represents.
 */
const monthBounds = (row: Row): { vanaf: string; totenmet: string } => {
  const year = completedYear(row);
  const month = Number(row.completed_month);
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return {
    vanaf: `${year}-${pad(month)}-01`,
    totenmet: `${year}-${pad(month)}-${pad(lastDay)}`,
  };
};

/**
 * Build one row in the current `regelingen` aggregation shape.
 */
const toKtoRow = (
  row: Row,
  prefix: string,
  aggregatie: LegacyAggregatie,
): Row => {
  const periode = periodFor(row, aggregatie);
  const monthScore = score(row[`${prefix}maandcijfer`]);
  const monthCount =
    prefix === ""
      ? count(row.aantal_respondenten_maand)
      : count(row[`${prefix}aantal_respondenten`]);
  const cumulScore = score(row[`${prefix}doorlopend_cijfer`]);
  const cumulCount =
    prefix === ""
      ? count(row.aantal_respondenten)
      : count(row[`${prefix}aantal_respondenten_doorlopend`]);

  const out: Row = {
    aggregatie,
    periode,
    periode_vanaf:
      aggregatie === "maand" ? monthBounds(row).vanaf : (row._startdatum ?? null),
    periode_totenmet:
      aggregatie === "maand"
        ? monthBounds(row).totenmet
        : (row._einddatum ?? row._date ?? null),
    domein_code: null,
    regeling_code: null,
    complete: row.complete === true,
    completed_month: row.completed_month ?? null,
    kto_score_gemiddeld: monthScore,
    kto_score_totaal: monthCount,
    kto_score_gemiddeld_cumul: cumulScore,
    kto_score_totaal_cumul: cumulCount,
  };

  // Score distribution (1–10) only exists per domein/regeling, not for the
  // unprefixed total. Missing entries stay null so charts can skip them.
  for (let i = 1; i <= 10; i++) {
    out[`kto_score_${i}_aantal`] = count(row[`${prefix}maand_rapportcijfer_${i}`]);
    out[`kto_score_${i}_aantal_cumul`] = count(
      row[`${prefix}doorlopend_rapportcijfer_${i}`],
    );
  }

  return out;
};

const mostRecent = (a: Row, b: Row): Row =>
  String(a._date ?? "") >= String(b._date ?? "") ? a : b;

/**
 * Normalise legacy `tevredenheid` rows into current aggregation rows.
 *
 * Weekly requests map one-to-one. Monthly requests keep only rows flagged
 * `complete` (the legacy table marks the first publication after a month ends)
 * and collapse duplicates per completed month, keeping the most recently
 * published row. This reproduces the old `complete === true` filter, which
 * `group-v1.ts` can no longer apply because it string-matches the endpoint
 * name `"tevredenheid"`.
 */
export const legacyRowsToKtoRows = (
  rows: Row[],
  plan: LegacyKtoPlan,
): Row[] => {
  if (!Array.isArray(rows) || !plan.supported) return [];

  if (plan.aggregatie === "week") {
    return rows.map((row) => toKtoRow(row, plan.prefix, "week"));
  }

  const byMonth = new Map<string, Row>();
  for (const row of rows) {
    if (row.complete !== true) continue;
    const key = periodFor(row, "maand");
    const existing = byMonth.get(key);
    byMonth.set(key, existing ? mostRecent(existing, row) : row);
  }

  return Array.from(byMonth.values())
    .map((row) => toKtoRow(row, plan.prefix, "maand"))
    .sort((a, b) => String(b.periode).localeCompare(String(a.periode)));
};
