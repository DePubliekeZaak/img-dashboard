// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { thousands, convertToCurrencyInTable } from '../src/shared/_helpers';

// ---------------------------------------------------------------------------
// thousands()
// ---------------------------------------------------------------------------
describe('thousands', () => {
  it('formats 1234 with nl-NL grouping (dot separator)', () => {
    expect(thousands(1234)).toBe('1.234');
  });

  it('formats 1234567 with nl-NL grouping', () => {
    expect(thousands(1234567)).toBe('1.234.567');
  });

  it('passes small numbers through unchanged (no separator needed)', () => {
    expect(thousands(0)).toBe('0');
    expect(thousands(1)).toBe('1');
    expect(thousands(999)).toBe('999');
  });

  it('returns empty string for undefined input', () => {
    expect(thousands(undefined)).toBe('');
  });

  it('handles negative numbers', () => {
    expect(thousands(-500)).toBe('-500');
    expect(thousands(-1234)).toBe('-1.234');
  });
});

// ---------------------------------------------------------------------------
// convertToCurrencyInTable()
// ---------------------------------------------------------------------------
describe('convertToCurrencyInTable', () => {
  it('formats a positive integer as EUR currency with nl-NL formatting', () => {
    // ceil(1234567) → 1234567 → "€ 1.234.567" (note: non-breaking space after €)
    const result = convertToCurrencyInTable(1234567);
    expect(result).toContain('€');
    expect(result).toContain('1.234.567');
  });

  it('formats a value needing rounding up via Math.ceil', () => {
    // ceil(1234.1) → 1235
    const result = convertToCurrencyInTable(1234.1);
    expect(result).toContain('€');
    expect(result).toContain('1.235');
  });

  it('wraps negative amounts in parentheses', () => {
    // ceil(-500) → -500 → "(-€ 500)"
    const result = convertToCurrencyInTable(-500);
    expect(result).toMatch(/^\(.*€.*500.*\)$/);
  });

  it('returns a dash for NaN input', () => {
    expect(convertToCurrencyInTable(NaN)).toBe('-');
  });
});