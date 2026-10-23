// @vitest-environment jsdom
//
// Wiring check for the seam in DataService.fetch. The merge itself is covered by
// test/legacy-kto.test.ts; this file only asserts what actually leaves the
// browser and what comes back.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DataService } from '../src/browser/dashboard/data.service';
import * as rawLegacy from './fixtures/regelingen/all_waardering/ep1.json';

const AGG = 'regelingen?aggregatie=eq.week&order=periode.desc&limit=1';
const AGG_SELECT =
  'regelingen?aggregatie=eq.week&select=periode%2ckto_score_gemiddeld&order=periode.desc';
const NON_AGG = 'regelingen?regeling_code=eq.VV&order=periode.desc&limit=1';

const ARCHIVE = { slug: '100', tag: 'v100', name: 'Archiefversie: maart 2026' };
const LIVE = { slug: 'v1', tag: 'latest', name: 'Actuele versie' };

const legacy = ((rawLegacy as any).default ?? rawLegacy) as Record<string, any>[];
const archivedRow = {
  aggregatie: 'week',
  periode: '2026_25',
  periode_vanaf: '2026-06-15',
  periode_totenmet: '2026-06-22',
  domein_code: 'Totaal',
  regeling_code: 'Totaal',
  bedrag_betaald_totaal_cumul_eur: 12,
};

let calls: string[];
let respond: (url: string) => any;
let svc: DataService;

beforeEach(() => {
  calls = [];
  respond = (url) => {
    if (url.includes('tevredenheid')) return legacy;
    return [archivedRow];
  };
  globalThis.fetch = vi.fn(async (url: any) => {
    const u = String(url);
    calls.push(u);
    const body = respond(u);
    if (body === null) return { ok: false, status: 404, json: async () => ({}) } as any;
    return { ok: true, status: 200, json: async () => body } as any;
  }) as any;
  svc = new DataService();
});

describe('archived aggregation requests', () => {
  it('keeps the original URL and fetches the legacy table alongside', async () => {
    const rows = await svc.fetch(AGG, ARCHIVE as any);

    expect(calls[0]).toContain('/archives/v100/api/regelingen?');
    expect(calls[0]).not.toContain('tevredenheid');
    expect(calls[1]).toContain('/archives/v100/api/tevredenheid');
    expect(rows[0].kto_score_gemiddeld).toBeGreaterThan(0);
  });

  it('fetches the legacy table once per version, not per request', async () => {
    await svc.fetch(AGG, ARCHIVE as any);
    await svc.fetch(AGG.replace('limit=1', 'limit=2'), ARCHIVE as any);
    expect(calls.filter((c) => c.includes('tevredenheid'))).toHaveLength(1);
  });

  it('strips kto_score columns from the select before it hits the archive', async () => {
    await svc.fetch(AGG_SELECT, ARCHIVE as any);
    expect(calls[0]).not.toContain('kto_score');
    expect(calls[0]).toContain('select=');
  });

  it('returns rows unchanged when the legacy table is missing', async () => {
    respond = (url) => (url.includes('tevredenheid') ? null : [archivedRow]);
    const rows = await svc.fetch(AGG, ARCHIVE as any);
    expect(rows).toEqual([archivedRow]);
    expect(rows[0]).not.toHaveProperty('kto_score_gemiddeld');
  });

  it('does not touch non-aggregation requests', async () => {
    await svc.fetch(NON_AGG, ARCHIVE as any);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toContain('/archives/v100/api/regelingen?');
  });
});

describe('live version', () => {
  it('makes exactly one request and never asks for the legacy table', async () => {
    const rows = await svc.fetch(AGG, LIVE as any);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toContain('/open-data/api/regelingen?');
    expect(rows).toEqual([archivedRow]);
  });
});
