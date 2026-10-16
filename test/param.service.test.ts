// @vitest-environment jsdom
//
// Regression tests for the query-param hardening (pen-test prep):
//   1. malformed percent-encoding (?foo=%zz%) must not throw on load
//   2. an unknown ?version= must fall back to the latest version instead of
//      leaving this._version undefined (which crashed DataService.buildUrl)
//
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ParamService } from '../src/browser/dashboard/param.service';

describe('ParamService query hardening', () => {
  const originalUrl = window.location.href;

  const setQuery = (search: string) => {
    window.history.replaceState(null, '', window.location.pathname + search);
  };

  beforeEach(() => {
    setQuery('');
  });

  afterEach(() => {
    window.history.replaceState(null, '', originalUrl);
  });

  it('does not throw on malformed percent-encoding in the query string', () => {
    setQuery('?topic=regelingen&foo=%zz%');
    const p = new ParamService();
    expect(() => p.renew()).not.toThrow();
    // topic still parsed from the well-formed param
    expect(p.topic).toBe('regelingen');
    expect(p.language).toBe('nl');
  });

  it('falls back to the latest version for an unknown ?version=', () => {
    setQuery('?version=doesnotexist');
    const p = new ParamService();
    p.renew();
    expect(p.version).toBeDefined();
    expect(p.version.tag).toBe('latest');
    expect(p.version.slug).toBe('v1');
  });

  it('parses a normal topic param', () => {
    setQuery('?topic=gemeente');
    const p = new ParamService();
    p.renew();
    expect(p.topic).toBe('gemeente');
  });

  it('defaults to regelingen when no query string is present', () => {
    setQuery('');
    const p = new ParamService();
    p.renew();
    expect(p.topic).toBe('regelingen');
  });
});
