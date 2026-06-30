// @vitest-environment jsdom
//
// jsdom required because this module references window via the data store import.
// Also relies on DOMAIN / APIBASE globals (set via vitest.config.ts define).
//
import { describe, it, expect, beforeEach } from 'vitest';
import { DataService } from '../src/browser/dashboard/data.service';
import { resetDataStore } from './helpers/store-reset';

let service: DataService;

beforeEach(() => {
  resetDataStore();
  service = new DataService();
});

// ---------------------------------------------------------------------------
// addVarsToEndpoint()
// ---------------------------------------------------------------------------
describe('addVarsToEndpoint', () => {
  it('replaces {GEMEENTE} with the encoded segment.gemeente', () => {
    const endpoint = '/gemeenten?gemeente=eq.{GEMEENTE}';
    const segment = {
      gemeente: 'Aa en Hunze',
      key: '',
      cumulative: true,
      periodization: 'monthly',
    };
    const result = service.addVarsToEndpoint(endpoint, segment);
    expect(result).toBe('/gemeenten?gemeente=eq.Aa%20en%20Hunze');
  });

  it('replaces {VANAF} with the encoded segment.vanaf', () => {
    const endpoint = '/data?jaar=gte.{VANAF}';
    const segment = {
      gemeente: 'all',
      vanaf: '2024-01-01',
      key: '',
      cumulative: true,
      periodization: 'monthly',
    };
    const result = service.addVarsToEndpoint(endpoint, segment);
    expect(result).toBe('/data?jaar=gte.2024-01-01');
  });

  it('leaves the endpoint untouched when the segment key is absent', () => {
    const endpoint = '/gemeenten?gemeente=eq.all';
    const segment = {
      gemeente: '',
      key: '',
      cumulative: true,
      periodization: 'monthly',
    };
    const result = service.addVarsToEndpoint(endpoint, segment);
    expect(result).toBe('/gemeenten?gemeente=eq.all');
  });

  it('encodes a municipality with spaces', () => {
    const endpoint = '/data?gemeente=eq.{GEMEENTE}';
    const segment = {
      gemeente: 'Aa en Hunze',
      key: '',
      cumulative: true,
      periodization: 'monthly',
    };
    const result = service.addVarsToEndpoint(endpoint, segment);
    // encodeURIComponent('Aa en Hunze') = 'Aa%20en%20Hunze'
    expect(result).toContain('Aa%20en%20Hunze');
    expect(result).not.toContain('{GEMEENTE}');
  });
});

// ---------------------------------------------------------------------------
// mapRow()
// ---------------------------------------------------------------------------
describe('mapRow', () => {
  it('when aggregatie is undefined → old API: _isNewApi=false, add no derived fields', () => {
    const row = { gemeente: 'Aa en Hunze', ingediend_aantal: 10 };
    const result = service.mapRow(row);
    expect(result._isNewApi).toBe(false);
    // _startdatum etc should NOT be present in the result
    expect(result).not.toHaveProperty('_startdatum');
    expect(result).not.toHaveProperty('_einddatum');
    expect(result).not.toHaveProperty('_year');
    expect(result.gemeente).toBe('Aa en Hunze');
  });

  it('when aggregatie is present → new API: derives all _ fields from periode', () => {
    const row = {
      aggregatie: 'WEEK',
      gemeente: 'Aa en Hunze',
      periode: '2024_31',
      periode_vanaf: '2024-07-29',
      periode_totenmet: '2024-08-04',
      ingediend_aantal: 10,
    };
    const result = service.mapRow(row);
    expect(result._isNewApi).toBe(true);
    expect(result._startdatum).toBe('2024-07-29');
    expect(result._einddatum).toBe('2024-08-04');
    expect(result._year).toBe(2024);
    expect(result._month).toBe(31);
    expect(result._week).toBe(31);
    expect(result._yearmonth).toBe('2024_31');
    expect(result._yearweek).toBe('2024_31');
  });

  it('preserves all original fields in the result', () => {
    const row = {
      aggregatie: 'MAAND',
      periode: '2024_7',
      periode_vanaf: '2024-07-01',
      periode_totenmet: '2024-07-31',
      ingediend_aantal: 50,
      extra_field: 'preserved',
    };
    const result = service.mapRow(row);
    expect(result.ingediend_aantal).toBe(50);
    expect(result.extra_field).toBe('preserved');
    expect(result.aggregatie).toBe('MAAND');
  });
});

// ---------------------------------------------------------------------------
// buildUrl()
// ---------------------------------------------------------------------------
describe('buildUrl', () => {
  it('latest version uses the base path', () => {
    const url = (service as any).buildUrl('/gemeenten', {
      tag: 'latest',
      slug: '',
    });
    // DOMAIN + APIBASE + endpoint
    // DOMAIN = https://img.de-publieke-zaak.nl
    // APIBASE = /open-data/api/
    expect(url).toBe('https://img.de-publieke-zaak.nl/open-data/api//gemeenten');
  });

  it('non-latest version rewrites to archives path', () => {
    const url = (service as any).buildUrl('/regelingen', {
      tag: 'archived',
      slug: 'v2',
    });
    // APIBASE.split("/")[1] = "open-data"
    // becomes: /open-data/archives/vv2/api/regelingen
    // Note: the code does `/${apibase.split("/")[1]}/archives/v${version.slug}/api/`
    // where apibase started as "/open-data/api/"
    // split("/") → ["", "open-data", "api", ""]
    // [1] → "open-data"
    // result: /open-data/archives/vv2/api/ + endpoint
    expect(url).toBe(
      'https://img.de-publieke-zaak.nl/open-data/archives/vv2/api//regelingen',
    );
  });
});