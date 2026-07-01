// @vitest-environment jsdom
//
// coverage.test.ts — asserts every group/graph combo in any config has a
// dedicated class test.  Novel combos flag themselves, enforcing
// "test-what's-new" — the generic contract checks wiring/dimensional/etc.,
// but genuinely new class combinations need a hand-written deep test.
//
import { it, expect } from 'vitest';
import { MIGRATED_PAGES } from './pages.manifest';
import { combo } from './covered-combos';
import { COVERED_COMBOS } from './covered-combos';

it('every group/graph combo across all migrated configs has a dedicated class test', () => {
  const uncovered = new Map<string, string>(); // combo -> first page/group that introduced it
  for (const page of MIGRATED_PAGES) {
    for (const g of page.config.groups) {
      if (!g.slug || !g.ctrlr) continue;
      if (!g.graphs || g.graphs.length === 0) continue;
      const sig = combo(g as any);
      if (!COVERED_COMBOS.has(sig)) {
        if (!uncovered.has(sig)) uncovered.set(sig, `${page.slug}/${g.slug}`);
      }
    }
  }
  expect(
    uncovered.size,
    `Uncovered combos need a dedicated class test:\n` +
      [...uncovered].map(([sig, where]) => `  ${sig}  (first seen: ${where})`).join("\n"),
  ).toBe(0);
});