// @vitest-environment jsdom
//
// jsdom required because data.factory.ts imports:
//   - getGroupSegment from stores/segment.store (touches window)
//   - NumbersV1 from graphs/numbers-v1 (touches window via d3/charts)
//
import { describe, it, expect, beforeEach } from 'vitest';
import {
  groupByPrefix,
  incVsCum,
  tables,
} from '../src/shared/data.factory';
import { resetSegmentStore } from './helpers/store-reset';

beforeEach(() => {
  resetSegmentStore();
});

// -------------------------------------------------------------------------
// Fixture helpers
// -------------------------------------------------------------------------

function weekRow(overrides: Record<string, any> = {}) {
  return {
    _year: '2024',
    _week: '31',
    _startdatum: '2024-07-29T00:00:00',
    _einddatum: '2024-08-04T23:59:59',
    _yearweek: '2024_31',
    _yearmonth: '2024_31',
    ...overrides,
  };
}

function monthRow(overrides: Record<string, any> = {}) {
  return {
    _year: '2024',
    _month: '7',
    _week: '7',
    _startdatum: '2024-07-01T00:00:00',
    _einddatum: '2024-07-31T23:59:59',
    _yearmonth: '2024_7',
    _yearweek: '2024_7',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// groupByPrefix()
// ---------------------------------------------------------------------------
describe('groupByPrefix', () => {
  it('splits keys matching distinct prefixes into the right buckets', () => {
    const obj = {
      bz_ingediend: 1,
      bz_afgerond: 2,
      fs_toegekend: 3,
      totaal: 4,
    };
    const { grouped, ungrouped } = groupByPrefix(obj, ['bz', 'fs']);
    expect(grouped.bz).toEqual({ bz_ingediend: 1, bz_afgerond: 2 });
    expect(grouped.fs).toEqual({ fs_toegekend: 3 });
    expect(ungrouped).toEqual({ totaal: 4 });
  });

  it('a key matching no prefix lands in ungrouped', () => {
    const obj = { bz_ingediend: 1, totaal: 2 };
    const { grouped, ungrouped } = groupByPrefix(obj, ['fs']);
    expect(grouped).toEqual({});  // no fs_ keys
    expect(ungrouped).toEqual({ bz_ingediend: 1, totaal: 2 });
  });

  it('boundary: "bz_" prefix matches "bz_ingediend" but not "bzx_foo"', () => {
    const obj = { bz_ingediend: 1, bzx_foo: 2 };
    const { grouped, ungrouped } = groupByPrefix(obj, ['bz']);
    expect(grouped.bz).toEqual({ bz_ingediend: 1 });
    expect(ungrouped).toEqual({ bzx_foo: 2 });
  });

  it('empty obj returns empty grouped and ungrouped', () => {
    const { grouped, ungrouped } = groupByPrefix({}, ['bz']);
    expect(grouped).toEqual({});
    expect(ungrouped).toEqual({});
  });

  it('empty prefixes puts everything in ungrouped', () => {
    const obj = { bz_ingediend: 1, totaal: 2 };
    const { grouped, ungrouped } = groupByPrefix(obj, []);
    expect(grouped).toEqual({});
    expect(ungrouped).toEqual(obj);
  });

  it('first matching prefix wins via .find (order matters)', () => {
    const obj = { ab_foo: 1, a_bar: 2 };
    const { grouped } = groupByPrefix(obj, ['ab', 'a']); // 'ab' comes first
    expect(grouped.ab).toEqual({ ab_foo: 1 });
    expect(grouped.a).toEqual({ a_bar: 2 });
  });
});

// ---------------------------------------------------------------------------
// incVsCum()
// ---------------------------------------------------------------------------
describe('incVsCum', () => {
  const baseGraphParams = {
    ingediend: {
      base: { column: 'ingediend_base', label: 'Ingediend', colour: '#000' },
      variants: {
        delta: { column: 'ingediend_aantal', label: 'Ingediend', colour: '#000' },
        cumul: { column: 'ingediend_cumul', label: 'Ingediend (cumul)', colour: '#000' },
      },
    },
  };

  it('pulls delta values into incremental, cumul values into cumulative', () => {
    const data = [{ ingediend_aantal: 10, ingediend_cumul: 100 }];
    const { incremental, cumulative } = incVsCum(data, baseGraphParams);
    expect(incremental).toEqual([10]);
    expect(cumulative).toEqual([100]);
  });

  it('a base variant does not contribute (base variant check was removed from incVsCum)', () => {
    const graphParams = {
      totaal: {
        base: { column: 'totaal_col', label: 'Totaal', colour: '#000' },
        variants: {
          base: { column: 'totaal_col', label: 'Totaal', colour: '#000' },
        },
      },
    };
    const data = [{ totaal_col: 42 }];
    const { incremental, cumulative } = incVsCum(data, graphParams);
    // incVsCum only processes delta and cumul variants; base is ignored.
    // Both arrays remain empty because totaal has no delta/cumul variants.
    expect(incremental).toEqual([]);
    expect(cumulative).toEqual([]);
  });

  it('order follows Object.values(graphParams) iteration order', () => {
    const graphParams = {
      first: {
        base: { column: 'col', label: 'F', colour: '#000' },
        variants: { delta: { column: 'a', label: 'F', colour: '#000' } },
      },
      second: {
        base: { column: 'col', label: 'S', colour: '#000' },
        variants: { delta: { column: 'b', label: 'S', colour: '#000' } },
      },
    };
    const data = [{ a: 1, b: 2 }];
    const { incremental } = incVsCum(data, graphParams);
    expect(incremental).toEqual([1, 2]);
  });

  it('throws when data is empty (reads data[0] with no guard)', () => {
    expect(() => incVsCum([], baseGraphParams)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// tables()  — the headline transform
// ---------------------------------------------------------------------------
describe('tables', () => {
  // Deep-clone fixtures so .sort() mutations don't cross tests
  function clone<T>(x: T): T {
    return JSON.parse(JSON.stringify(x));
  }

  const baseWeekRows = [
    weekRow({
      ingediend_aantal: 10,
      ingediend_cumul: 100,
      toegekend_aantal: 3,
      toegekend_cumul: 30,
    }),
    weekRow({
      _year: '2024',
      _week: '30',
      _startdatum: '2024-07-22T00:00:00',
      _einddatum: '2024-07-28T23:59:59',
      _yearweek: '2024_30',
      _yearmonth: '2024_30',
      ingediend_aantal: 8,
      ingediend_cumul: 90,
      toegekend_aantal: 2,
      toegekend_cumul: 27,
    }),
  ];

  const baseMonthRows = [
    monthRow({
      ingediend_aantal: 50,
      ingediend_cumul: 500,
      toegekend_aantal: 15,
      toegekend_cumul: 150,
    }),
  ];

  const baseTableParams = [
    { column: 'ingediend_aantal', label: 'Ingediend', short: 'Ing.' },
    { column: 'ingediend_cumul', label: 'Ingediend (cumul)', short: 'Ing. cum' },
    { column: 'toegekend_aantal', label: 'Toegekend' }, // no short — uses label
    { column: 'toegekend_cumul', label: 'Toegekend (cumul)' },
  ];

  it('produces all four tables when both week and month data are present', () => {
    const result = tables(
      clone(baseWeekRows),
      clone(baseMonthRows),
      baseTableParams,
      null, // pre_headers explicitly null
    );
    expect(result.weekTableInc).not.toBeNull();
    expect(result.weekTableCumul).not.toBeNull();
    expect(result.monthTableInc).not.toBeNull();
    expect(result.monthTableCumul).not.toBeNull();
    expect(result.showToggle).toBe(true);
    expect(result.hasAny).toBe(true);
  });

  it('argument order is week-first, month-second', () => {
    // If swapped, week data would be empty and month data would populate week tables
    const noWeek = tables([], clone(baseMonthRows), baseTableParams, null);
    expect(noWeek.weekTableInc).toBeNull();
    expect(noWeek.monthTableInc).not.toBeNull();
  });

  describe('inc/cumul split', () => {
    it('columns with _cumul go to cumul tables; others to inc tables', () => {
      const result = tables(
        clone(baseWeekRows),
        clone(baseMonthRows),
        baseTableParams,
        [[], []],
      );

      // week inc headers include ingediend_aantal and toegekend_aantal only
      const incHeaders = result.weekTableInc!.headers;
      expect(incHeaders).toContain('Ing.');
      expect(incHeaders).toContain('Toegekend');
      expect(incHeaders).not.toContain('Ing. cum');
      expect(incHeaders).not.toContain('Toegekend (cumul)');

      // week cumul headers include cumul columns only
      const cumulHeaders = result.weekTableCumul!.headers;
      expect(cumulHeaders).toContain('Ing. cum');
      expect(cumulHeaders).toContain('Toegekend (cumul)');
      expect(cumulHeaders).not.toContain('Ing.');
      expect(cumulHeaders).not.toContain('Toegekend');
    });
  });

  describe('header construction', () => {
    it('week headers start with ["Jaar", "Week", "Periode"]', () => {
      const result = tables(
        clone(baseWeekRows),
        [],
        [baseTableParams[0]],
        [[], []],
      );
      expect(result.weekTableInc!.headers.slice(0, 3)).toEqual([
        'Jaar', 'Week', 'Periode',
      ]);
    });

    it('month headers start with ["Jaar", "Maand", "Periode"]', () => {
      const result = tables(
        [],
        clone(baseMonthRows),
        [baseTableParams[0]],
        [[], []],
      );
      expect(result.monthTableInc!.headers.slice(0, 3)).toEqual([
        'Jaar', 'Maand', 'Periode',
      ]);
    });

    it('uses short when available, falls back to label', () => {
      const result = tables(
        clone(baseWeekRows),
        [],
        [baseTableParams[0], baseTableParams[2]], // has short, no short
        [[], []],
      );
      const headers = result.weekTableInc!.headers;
      // header[3] = first param's short ("Ing.")
      expect(headers[3]).toBe('Ing.');
      // header[4] = second param's label fallback ("Toegekend")
      expect(headers[4]).toBe('Toegekend');
    });
  });

  describe('empty-period handling', () => {
    it('empty week data → both week tables null, showToggle false', () => {
      const result = tables([], clone(baseMonthRows), baseTableParams, null);
      expect(result.weekTableInc).toBeNull();
      expect(result.weekTableCumul).toBeNull();
      expect(result.showToggle).toBe(false);
      expect(result.hasAny).toBe(true); // month side still has data
    });

    it('both empty → all null, showToggle false, hasAny false', () => {
      const result = tables([], [], baseTableParams, null);
      expect(result.weekTableInc).toBeNull();
      expect(result.weekTableCumul).toBeNull();
      expect(result.monthTableInc).toBeNull();
      expect(result.monthTableCumul).toBeNull();
      expect(result.showToggle).toBe(false);
      expect(result.hasAny).toBe(false);
    });
  });

  describe('pre_headers routing', () => {
    it('index [0] feeds week tables, [1] feeds month tables', () => {
      const pre = [
        [{ label: 'Week header', length: 1 }],
        [{ label: 'Month header', length: 1 }],
      ];
      const result = tables(
        clone(baseWeekRows),
        clone(baseMonthRows),
        [baseTableParams[0], baseTableParams[2]], // inc only
        pre,
      );
      expect(result.weekTableInc!.pre_headers).toEqual(pre[0]);
      expect(result.monthTableInc!.pre_headers).toEqual(pre[1]);
    });
  });

  describe('pre_headers null vs undefined (gotcha #3)', () => {
    it('passing explicit null does not throw', () => {
      expect(() =>
        tables(clone(baseWeekRows), clone(baseMonthRows), baseTableParams, null),
      ).not.toThrow();
    });

    it('passing undefined throws because the guard checks !== null', () => {
      expect(() =>
        tables(clone(baseWeekRows), clone(baseMonthRows), baseTableParams, undefined),
      ).toThrow();
    });

    it('omitting pre_headers entirely throws (defaults to undefined)', () => {
      expect(() =>
        tables(clone(baseWeekRows), clone(baseMonthRows), baseTableParams),
      ).toThrow();
    });
  });

  describe('row gating (length > 3 check)', () => {
    it('if every param is a cumul column, inc tables have empty rows', () => {
      const cumulOnlyParams = [
        { column: 'ingediend_cumul', label: 'Ing. cum' },
      ];
      const result = tables(
        clone(baseWeekRows),
        [],
        cumulOnlyParams,
        [[], []],
      );
      // inc headers have only the 3 fixed columns (no inc params passed the !_cumul filter)
      expect(result.weekTableInc!.headers).toHaveLength(3);
      // Actually, headers filter !_cumul so inc headers = 3 fixed only
      expect(result.weekTableInc!.headers).toEqual(['Jaar', 'Week', 'Periode']);
      // rows.length > 3 is false for inc (only 3 cells: Jaar, Week, Periode), so no rows
      expect(result.weekTableInc!.rows).toHaveLength(0);
    });
  });

  describe('percentage format', () => {
    it('renders percentage as (round(value*10)/10).toFixed(1) + "%"', () => {
      const rows = [weekRow({ pct_col: 12.345 })];
      const params = [
        { column: 'pct_col', label: 'Pct', format: 'percentage' },
      ];
      const result = tables(
        rows,
        [],
        params,
        [[], []],
      );
      // 12.345 → round(123.45)/10 = 12.3 → "12.3" + "%" = "12.3%"
      expect(result.weekTableInc!.rows[0][3]).toBe('12.3%');
    });

    it('percentage 0.04 rounds correctly', () => {
      const rows = [weekRow({ pct_col: 0.04 })];
      const params = [
        { column: 'pct_col', label: 'Pct', format: 'percentage' },
      ];
      const result = tables(rows, [], params, [[], []]);
      // 0.04 → round(0.4)/10 = 0.0 → "0.0%"
      expect(result.weekTableInc!.rows[0][3]).toBe('0.0%');
    });
  });

  describe('sorted output (descending by _yearweek / _yearmonth)', () => {
    it('week rows sorted descending by _yearweek', () => {
      const unsorted = [
        weekRow({
          _yearweek: '2024_30',
          ingediend_aantal: 8,
        }),
        weekRow({
          _yearweek: '2024_31',
          ingediend_aantal: 10,
        }),
      ];
      const params = [{ column: 'ingediend_aantal', label: 'Ing.' }];
      const result = tables(unsorted, [], params, [[], []]);
      // Should be sorted: 2024_31 first, then 2024_30
      expect(result.weekTableInc!.rows[0][0]).toBe('2024');
      expect(result.weekTableInc!.rows[0][3]).toBe(10); // ingediend_aantal for 2024_31
      expect(result.weekTableInc!.rows[1][3]).toBe(8);
    });
  });
});
