// @vitest-environment node
//
// Legacy KTO shim (src/shared/legacy-kto.ts).
//
// Both sides are real payloads from the v100 archive:
//   test/fixtures/regelingen/all_waardering/ep1.json   — `tevredenheid`, 358 weekly rows
//   test/fixtures/regelingen/all_waardering/week.json  — `regelingen?aggregatie=eq.week`
//   test/fixtures/regelingen/all_waardering/month.json — `regelingen?aggregatie=eq.maand`
// The archive's `regelingen` rows carry current money/count columns and no
// `kto_score_*` at all, which is exactly the gap the shim fills.
import { describe, it, expect } from 'vitest';
import * as rawLegacy from './fixtures/regelingen/all_waardering/ep1.json';
import * as rawWeek from './fixtures/regelingen/all_waardering/week.json';
import * as rawMonth from './fixtures/regelingen/all_waardering/month.json';
import {
  buildLegacyIndex,
  enrichKtoRows,
  isAggregationRequest,
  isArchivedVersion,
  stripKtoSelect,
} from '../src/shared/legacy-kto';

const legacy = ((rawLegacy as any).default ?? rawLegacy) as Record<string, any>[];
const week = ((rawWeek as any).default ?? rawWeek) as Record<string, any>[];
const month = ((rawMonth as any).default ?? rawMonth) as Record<string, any>[];

const legacyWeek = (key: string) =>
  legacy.find((r) => {
    const yw = String(r._yearweek ?? '');
    return /^\d{6}$/.test(yw) && `${yw.slice(0, 4)}_${yw.slice(4)}` === key;
  })!;

const legacyMonth = (monthKey: string) =>
  legacy
    .filter((r) => r.complete === true)
    .filter((r) => `${r._year}_${String(r.completed_month).padStart(2, '0')}` === monthKey)
    .sort((a, b) => String(b._date).localeCompare(String(a._date)))[0];

const row = (over: Record<string, any>) => ({
  aggregatie: 'week',
  periode: '2026_25',
  domein_code: 'Totaal',
  regeling_code: 'Totaal',
  ...over,
});

describe('request classification', () => {
  it('only treats archived versions as legacy', () => {
    expect(isArchivedVersion('v100')).toBe(true);
    expect(isArchivedVersion('v101')).toBe(true);
    expect(isArchivedVersion('latest')).toBe(false);
    expect(isArchivedVersion(undefined)).toBe(false);
  });

  it('recognises aggregated regelingen requests, with or without select', () => {
    expect(isAggregationRequest('regelingen?aggregatie=eq.week&order=periode.desc')).toBe(true);
    expect(isAggregationRequest('regelingen?aggregatie=eq.maand&regeling_code=eq.MW&order=periode.desc&limit=1')).toBe(true);
    expect(
      isAggregationRequest(
        'regelingen?aggregatie=eq.week&select=periode%2ckto_score_gemiddeld&order=periode.desc',
      ),
    ).toBe(true);
    expect(isAggregationRequest('gemeenten?aggregatie=eq.week')).toBe(false);
    expect(isAggregationRequest('regelingen?regeling_code=eq.VV')).toBe(false);
  });
});

describe('stripKtoSelect', () => {
  it('removes columns an archive does not have, keeping the rest', () => {
    const out = stripKtoSelect(
      'regelingen?aggregatie=eq.week&select=periode%2ckto_score_gemiddeld%2cbedrag_betaald_totaal_eur&order=periode.desc',
    );
    expect(out).toContain('aggregatie=eq.week');
    expect(out).toContain('order=periode.desc');
    expect(out).not.toContain('kto_score');
    expect(decodeURIComponent(out.split('select=')[1].split('&')[0])).toBe(
      'periode,bedrag_betaald_totaal_eur',
    );
  });

  it('drops the select itself when nothing is left', () => {
    const out = stripKtoSelect('regelingen?aggregatie=eq.week&select=kto_score_gemiddeld');
    expect(out).toBe('regelingen?aggregatie=eq.week');
  });

  it('also strips the legacy `complete` flag', () => {
    const out = stripKtoSelect('regelingen?aggregatie=eq.maand&select=complete%2cperiode');
    expect(decodeURIComponent(out.split('select=')[1])).toBe('periode');
  });

  it('leaves requests without a select alone', () => {
    const ep = 'regelingen?aggregatie=eq.week&order=periode.desc&limit=1';
    expect(stripKtoSelect(ep)).toBe(ep);
  });
});

describe('enrichKtoRows — weekly', () => {
  const src = legacyWeek('2026_25');
  const out = enrichKtoRows([row({})], legacy);

  it('fills the total series from the unprefixed legacy columns', () => {
    expect(src).toBeDefined();
    expect(out[0].kto_score_gemiddeld).toBe(src.maandcijfer);
    expect(out[0].kto_score_gemiddeld_cumul).toBe(src.doorlopend_cijfer);
    expect(out[0].kto_score_totaal).toBe(src.aantal_respondenten_maand);
    expect(out[0].kto_score_totaal_cumul).toBe(src.aantal_respondenten);
  });

  it('keeps every key of a real archived row', () => {
    const real = week.find((r) => r.periode === '2026_25')!;
    const enriched = enrichKtoRows([{ ...real }], legacy)[0];
    for (const k of Object.keys(real)) {
      expect(enriched).toHaveProperty(k);
      expect(enriched[k]).toEqual(real[k]);
    }
    expect(Object.keys(enriched).length).toBeGreaterThan(Object.keys(real).length);
  });

  it('uses the domein prefix for sub-domeins', () => {
    const fysiek = enrichKtoRows(
      [row({ domein_code: 'FYSIEK' })],
      legacy,
    )[0];
    expect(fysiek.kto_score_gemiddeld).toBe(src.fysieke_schade_maandcijfer);
    expect(fysiek.kto_score_gemiddeld_cumul).toBe(src.fysieke_schade_doorlopend_cijfer);
    expect(fysiek.kto_score_totaal).toBe(src.fysieke_schade_aantal_respondenten);
    expect(fysiek.kto_score_totaal_cumul).toBe(
      src.fysieke_schade_aantal_respondenten_doorlopend,
    );
  });

  it('uses the regeling prefix for regeling rows', () => {
    // Pick a week where VV actually has respondents: the fixture stores 0 for
    // weeks without any, and 0 legitimately normalises to null.
    const withVv = legacy
      .filter((r) => r.ves_maandcijfer > 0)
      .sort((a, b) => String(b._date).localeCompare(String(a._date)))[0];
    const yw = String(withVv._yearweek);
    const periode = `${yw.slice(0, 4)}_${yw.slice(4)}`;
    const vv = enrichKtoRows(
      [{ aggregatie: 'week', periode, domein_code: null, regeling_code: 'VV' }],
      legacy,
    )[0];
    expect(vv.kto_score_gemiddeld).toBe(withVv.ves_maandcijfer);
    expect(vv.kto_score_totaal_cumul).toBe(withVv.ves_aantal_respondenten_doorlopend);
  });

  it('maps the 1-10 respondent distribution', () => {
    const ims = enrichKtoRows([row({ domein_code: 'IMS' })], legacy)[0];
    expect(ims.kto_score_8_aantal).toBe(src.ims_maand_rapportcijfer_8);
    expect(ims.kto_score_8_aantal_cumul).toBe(src.ims_doorlopend_rapportcijfer_8);
    expect(ims.kto_score_1_aantal).toBe(src.ims_maand_rapportcijfer_1);
  });

  it('normalises a 0 score (no respondents) to null', () => {
    const zeroWeek = legacy.find(
      (r) => r.ims_maandcijfer === 0 && r.ims_aantal_respondenten === 0,
    );
    expect(zeroWeek, 'fixture should contain an empty IMS week').toBeDefined();
    const yw = String(zeroWeek!._yearweek);
    const out2 = enrichKtoRows(
      [row({ periode: `${yw.slice(0, 4)}_${yw.slice(4)}`, domein_code: 'IMS' })],
      legacy,
    )[0];
    expect(out2.kto_score_gemiddeld).toBeNull();
  });

  it('leaves rows with no legacy counterpart untouched', () => {
    const before = row({ periode: '2015_01' });
    const after = enrichKtoRows([{ ...before }], legacy)[0];
    expect(after).toEqual(before);
  });

  it('adds nothing for series that never existed (MW)', () => {
    const before = row({ domein_code: null, regeling_code: 'MW' });
    const after = enrichKtoRows([{ ...before }], legacy)[0];
    expect(after).toEqual(before);
    expect(after).not.toHaveProperty('kto_score_gemiddeld');
  });

  it('does not overwrite values the archive already has', () => {
    const out3 = enrichKtoRows([row({ kto_score_gemiddeld: 9.9 })], legacy)[0];
    expect(out3.kto_score_gemiddeld).toBe(9.9);
  });
});

describe('enrichKtoRows — monthly', () => {
  it('uses the monthly legacy figure, only for complete publications', () => {
    const key = '2019_07';
    const src = legacyMonth(key);
    expect(src, 'fixture should have a complete 2019-07 publication').toBeDefined();

    const out = enrichKtoRows(
      [{ aggregatie: 'maand', periode: key, domein_code: 'Totaal', regeling_code: 'Totaal' }],
      legacy,
    )[0];
    expect(out.kto_score_gemiddeld).toBe(src!.maandcijfer);
    expect(out.kto_score_totaal).toBe(src!.aantal_respondenten_maand);
  });

  it('does not enrich a month the legacy table never flagged complete', () => {
    const index = buildLegacyIndex(legacy);
    const completeKeys = new Set(index.maand.keys());
    const incomplete = month.map((r) => String(r.periode)).find((p) => !completeKeys.has(p));
    expect(incomplete, 'fixture should contain an incomplete month').toBeDefined();

    const before = { aggregatie: 'maand', periode: incomplete, domein_code: 'Totaal', regeling_code: 'Totaal' };
    expect(enrichKtoRows([{ ...before }], legacy)[0]).toEqual(before);
  });

  it('keeps one row per completed month when a month was published twice', () => {
    const index = buildLegacyIndex(legacy);
    // 2025-12 was published more than once in the legacy table.
    const dubbel = legacy.filter(
      (r) => r.complete === true && r._year === 2025 && r.completed_month === 12,
    );
    if (dubbel.length > 1) {
      const kept = index.maand.get('2025_12')!;
      const newest = dubbel.sort((a, b) => String(b._date).localeCompare(String(a._date)))[0];
      expect(kept._date).toBe(newest._date);
    }
  });
});

describe('safety', () => {
  it('is a no-op without legacy rows', () => {
    const rows = [row({})];
    expect(enrichKtoRows(rows, [])).toEqual(rows);
  });

  it('is a no-op on an empty response', () => {
    expect(enrichKtoRows([], legacy)).toEqual([]);
  });

  it('tolerates rows without periode', () => {
    const rows = [row({ periode: undefined })];
    expect(enrichKtoRows(rows, legacy)).toEqual(rows);
  });
});
