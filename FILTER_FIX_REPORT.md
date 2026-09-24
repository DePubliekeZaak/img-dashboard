# Filter Fix Completion Report — anchor graph filters to their own graph section

## Summary

Fixed the bug where, on the gemeente page, each graph's filter was hosted in the
shared group wrapper and `HtmlFilters.init` used `element.prepend(container)`,
injecting each later graph's filter as the **first** child of the wrapper. In
`RegelingComparisonGroupV1` groups (which have two graphs that each declare
filters), the second graph's filter (the trend's `parameterSelect`/`cumulativeVsDelta`)
was rendered **above the first graph**.

The fix anchors each filter to its own graph section: `GraphControllerV3._html`
passes the graph's own `<section>` (`graphEl`) as an anchor to `HtmlFilters`,
which inserts the `filter-wrapper-graph` container immediately **before** that
graph's section. Each filter now renders directly above the graph it controls.

## Commit

- **Commit hash:** `2956878` — `fix: anchor graph filters to their own graph section`
- **Branch:** `fix/graph-filter-anchor-to-own-section` (pushed to origin)
- **Files changed:**
  - `src/charts/core/graph-v3.ts`
  - `src/widgets/html-filters.ts`
  - `test/graph-filter-anchor-to-own-section.test.ts` (new regression test)

## PR

- **PR URL:** https://github.com/DePubliekeZaak/img-dashboard/pull/23
- **Title:** `fix: anchor graph filters to their own graph section`
- **Base:** `main` · **Head:** `fix/graph-filter-anchor-to-own-section`

## Gate results (exact counts)

| Gate | Result |
|------|--------|
| `npx tsc --noEmit` | **clean, 0 errors** (exit 0; TypeScript 5.9.3) |
| `npm test` (vitest run) | **23 test files passed / 1 skipped; 401 tests passed / 3 skipped** |

> Note: the worktree does not contain `node_modules`; the project's pinned
> TypeScript (5.9.3) and vitest binaries from the shared install were used.
> A bare `npx tsc` resolves the latest TypeScript 7.x, which is incompatible
> with this project's `moduleResolution: "node"` tsconfig (pre-existing
> environment/tooling issue, unrelated to this change). With the project's
> pinned tsc 5.9.3 the check is clean.

## Regression test

`test/graph-filter-anchor-to-own-section.test.ts`:
- Constructs a group with **two master graphs that each declare filters**
  (mirrors the gemeente `RegelingComparisonGroupV1` shape) and asserts the
  second graph's filter is positioned directly above its own graph — after the
  first graph and immediately before the trend section.
- Asserts multiple `_mult` variants of one graph still share a **single** filter
  (no duplicate emitted by `_mult1`).
- **Verified it fails on the pre-fix code** (1 of 2 tests failed when the
  `html-filters.ts` change was reverted).

## Root cause reference

See `/home/joera/brain/reviews/filter-above-graph-explore/REPORT.md` for the full
render trace.
