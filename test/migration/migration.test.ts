// @vitest-environment jsdom
//
// migration.test.ts — loops MIGRATED_PAGES → groups → applies generic contract.
//
// No page-specific code.  Adding a new migrated page = one entry in
// pages.manifest.ts + a recorded fixture.  That's it.
//
import { describe } from 'vitest';
import { MIGRATED_PAGES } from './pages.manifest';
import { runGroupContract } from './group.contract';

// Pin window.innerWidth so layout branching doesn't differ between machines
Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });

for (const page of MIGRATED_PAGES) {
  describe(`migration: ${page.slug}`, () => {
    page.config.groups.forEach((groupConfig: any, i: number) => {
      // Skip commented-out groups (those with only whitespace in their slug or
      // graph entries that are incomplete — the loop handles real config entries)
      if (!groupConfig.slug || !groupConfig.ctrlr) return;
      if (!groupConfig.graphs || groupConfig.graphs.length === 0) return;
      runGroupContract(page, groupConfig, i);
    });
  });
}