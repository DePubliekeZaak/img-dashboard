// @vitest-environment jsdom
//
// Wiring check: an archived KTO request must actually leave the browser as a
// `tevredenheid` request, and the live version must keep its original URL.
// Guards the seam in DataService.fetch — the shim itself is covered by
// test/legacy-kto.test.ts.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DataService } from '../src/browser/dashboard/data.service';

const KTO =
  'regelingen?aggregatie=eq.maand&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&select=periode%2ckto_score_gemiddeld&order=periode.desc';
const MW =
  'regelingen?aggregatie=eq.maand&regeling_code=eq.MW&select=periode%2ckto_score_gemiddeld&order=periode.desc';
const MONEY =
  'regelingen?aggregatie=eq.maand&domein_code=eq.Totaal&regeling_code=eq.Totaal&select=periode%2cbedrag_betaald_totaal_cumul_eur&order=periode.desc';

const ARCHIVE = { slug: '100', tag: 'v100', name: 'Archiefversie: maart 2026' };
const LIVE = { slug: 'v1', tag: 'latest', name: 'Actuele versie' };

let calls: string[];
let svc: DataService;

beforeEach(() => {
  calls = [];
  globalThis.fetch = vi.fn(async (url: any) => {
    calls.push(String(url));
    return { ok: true, json: async () => [] } as any;
  }) as any;
  svc = new DataService();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('DataService.fetch — archived KTO requests', () => {
  it('requests the legacy tevredenheid table under the archive base', async () => {
    await svc.fetch(KTO, ARCHIVE as any);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toContain('/archives/v100/api/');
    expect(calls[0]).toContain('tevredenheid');
    expect(calls[0]).not.toContain('kto_score');
  });

  it('leaves non-KTO requests on regelingen', async () => {
    await svc.fetch(MONEY, ARCHIVE as any);
    expect(calls[0]).toContain('/archives/v100/api/regelingen?');
  });

  it('does not call the API at all for series that never existed', async () => {
    const rows = await svc.fetch(MW, ARCHIVE as any);
    expect(rows).toEqual([]);
    expect(calls).toHaveLength(0);
  });

  it('keeps the live version untouched', async () => {
    await svc.fetch(KTO, LIVE as any);
    expect(calls[0]).toContain('/open-data/api/regelingen?');
    expect(calls[0]).not.toContain('tevredenheid');
  });
});
