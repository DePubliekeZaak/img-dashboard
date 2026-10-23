// @vitest-environment node
//
// Legacy KTO shim (src/shared/legacy-kto.ts).
//
// Fixture: test/fixtures/regelingen/all_waardering/ep1.json is a raw dump of
// the `tevredenheid` table (358 weekly rows, 2019-07-01 .. 2026-06-22) — i.e.
// exactly what an archived API serves for a pre-1.0.2 version.
import { describe, it, expect } from 'vitest';
import * as raw from './fixtures/regelingen/all_waardering/ep1.json';
import {
  LEGACY_KTO_TABLE,
  isKtoRequest,
  legacyRowsToKtoRows,
  planLegacyKto,
  type LegacyKtoPlan,
} from '../src/shared/legacy-kto';

const ROWS = ((raw as any).default ?? raw) as Record<string, any>[];

const DOMEIN_WEEK =
  'regelingen?aggregatie=eq.week&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&select=periode%2ckto_score_gemiddeld&order=periode.desc';
const DOMEIN_MONTH =
  'regelingen?aggregatie=eq.maand&domein_code=eq.WDL&regeling_code=eq.Totaal&select=periode%2ckto_score_gemiddeld_cumul&order=periode.desc';
const TOTAL_WEEK =
  'regelingen?aggregatie=eq.week&domein_code=eq.Totaal&regeling_code=eq.Totaal&select=periode%2ckto_score_totaal_cumul&order=periode.desc';
const REGELING_VV =
  'regelingen?aggregatie=eq.maand&regeling_code=eq.VV&select=periode%2ckto_score_1_aantal&order=periode.desc';

const plan = (endpoint: string): LegacyKtoPlan => planLegacyKto(endpoint, 'v100')!;

describe('planLegacyKto', () => {
  it('leaves the live version alone', () => {
    expect(planLegacyKto(DOMEIN_WEEK, 'latest')).toBeNull();
    expect(planLegacyKto(DOMEIN_WEEK, undefined)).toBeNull();
  });

  it('rewrites KTO requests on archived versions to the legacy table', () => {
    const p = plan(DOMEIN_WEEK);
    expect(p.table).toBe(LEGACY_KTO_TABLE);
    expect(p.aggregatie).toBe('week');
    expect(p.prefix).toBe('fysieke_schade_');
    expect(p.supported).toBe(true);
  });

  it('ignores non-KTO aggregation requests even on archived versions', () => {
    const money =
      'regelingen?aggregatie=eq.maand&domein_code=eq.Totaal&regeling_code=eq.Totaal&select=periode%2cbedrag_betaald_totaal_cumul_eur&order=periode.desc';
    expect(isKtoRequest(money)).toBe(false);
    expect(planLegacyKto(money, 'v100')).toBeNull();
  });

  it('maps domein codes to legacy column families', () => {
    expect(plan(TOTAL_WEEK).prefix).toBe('');
    expect(plan(DOMEIN_WEEK).prefix).toBe('fysieke_schade_');
    expect(plan(DOMEIN_MONTH).prefix).toBe('waardedaling_');
  });

  it('maps regeling codes to legacy column families and marks MW unsupported', () => {
    expect(plan(REGELING_VV).prefix).toBe('ves_');
    const mw =
      'regelingen?aggregatie=eq.maand&regeling_code=eq.MW&select=periode%2ckto_score_gemiddeld&order=periode.desc';
    expect(plan(mw).supported).toBe(false);
  });
});

describe('legacyRowsToKtoRows — weekly', () => {
  const rows = legacyRowsToKtoRows(ROWS, plan(TOTAL_WEEK));

  it('maps every legacy row one-to-one', () => {
    expect(rows).toHaveLength(ROWS.length);
  });

  it('translates the legacy column names to kto_score_*', () => {
    const src = ROWS[0];
    const out = rows[0];
    expect(out.kto_score_gemiddeld).toBe(src.maandcijfer);
    expect(out.kto_score_totaal).toBe(src.aantal_respondenten_maand);
    expect(out.kto_score_gemiddeld_cumul).toBe(src.doorlopend_cijfer);
    expect(out.kto_score_totaal_cumul).toBe(src.aantal_respondenten);
  });

  it('emits the fields the aggregatie guard requires', () => {
    for (const field of ['aggregatie', 'periode', 'periode_vanaf', 'periode_totenmet']) {
      expect(rows[0]).toHaveProperty(field);
    }
    expect(rows[0].periode).toMatch(/^\d{4}_\d{2}$/);
    expect(rows[0].aggregatie).toBe('week');
  });

  it('uses the base columns for Totaal and prefixed columns per domein', () => {
    const fysiek = legacyRowsToKtoRows(ROWS, plan(DOMEIN_WEEK));
    const src = ROWS[0];
    expect(fysiek[0].kto_score_gemiddeld).toBe(src.fysieke_schade_maandcijfer);
    expect(fysiek[0].kto_score_totaal).toBe(src.fysieke_schade_aantal_respondenten);
    expect(fysiek[0].kto_score_gemiddeld_cumul).toBe(src.fysieke_schade_doorlopend_cijfer);
    expect(fysiek[0].kto_score_3_aantal).toBe(src.fysieke_schade_maand_rapportcijfer_3);
    expect(fysiek[0].kto_score_3_aantal_cumul).toBe(
      src.fysieke_schade_doorlopend_rapportcijfer_3,
    );
  });

  it('uses the week period, not the month', () => {
    expect(rows[0].periode).toBe('2026_25');
  });

  it('normalises legacy zero scores (no respondents) to null', () => {
    // Fixture row for 2026-06-15 (week 24) has ims_maandcijfer 0.0 with 0 respondents.
    const ims = legacyRowsToKtoRows(
      ROWS,
      plan(
        'regelingen?aggregatie=eq.week&domein_code=eq.IMS&regeling_code=eq.Totaal&select=periode%2ckto_score_gemiddeld&order=periode.desc',
      ),
    );
    const row = ims.find((r) => r.periode === '2026_24')!;
    expect(row.kto_score_gemiddeld).toBeNull();
  });
});

describe('legacyRowsToKtoRows — monthly', () => {
  const rows = legacyRowsToKtoRows(ROWS, plan(DOMEIN_MONTH));
  const completeRows = ROWS.filter((r) => r.complete === true);

  it('keeps only rows the legacy table flagged complete', () => {
    expect(rows.length).toBeLessThan(completeRows.length);
    expect(rows.every((r) => r.complete === true)).toBe(true);
  });

  it('emits one row per completed month', () => {
    const periods = rows.map((r) => r.periode);
    expect(new Set(periods).size).toBe(periods.length);
  });

  it('collapses the duplicated 2025-12 publication to a single month', () => {
    expect(rows.filter((r) => r.periode === '2025_12')).toHaveLength(1);
  });

  it('represents the completed month, not the publication week', () => {
    const row = rows.find((r) => r.periode === '2026_05')!;
    expect(row.periode_vanaf).toBe('2026-05-01');
    expect(row.periode_totenmet).toBe('2026-05-31');
  });

  it('sorts newest first, like the API does', () => {
    const periods = rows.map((r) => String(r.periode));
    expect(periods).toEqual([...periods].sort().reverse());
  });

  it('carries the month figure, not the week figure', () => {
    const out = rows[0];
    const src = completeRows.find(
      (r) => `2026_${String(r.completed_month).padStart(2, '0')}` === out.periode,
    )!;
    // 0.0 in the legacy payload means "no respondents", so it comes out null.
    const expected = src.waardedaling_maandcijfer > 0 ? src.waardedaling_maandcijfer : null;
    expect(out.kto_score_gemiddeld).toBe(expected);
    expect(out.kto_score_totaal).toBe(src.waardedaling_aantal_respondenten);
  });
});

describe('legacyRowsToKtoRows — unsupported series', () => {
  it('returns an empty series for regelingen that had no KTO before 1.0.2', () => {
    const mw =
      'regelingen?aggregatie=eq.maand&regeling_code=eq.MW&select=periode%2ckto_score_gemiddeld&order=periode.desc';
    expect(legacyRowsToKtoRows(ROWS, plan(mw))).toEqual([]);
  });
});
