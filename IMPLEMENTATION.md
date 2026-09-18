# Implementation Report — Preserve per-graph cumulative across gemeente selection

## Summary
Fixed a bug where trend graphs on the `gemeente` page flipped from `cumulative=false` (delta) to `cumulative=true` whenever the user selected a different gemeente, and stayed that way.

## Branch / Commit / PR
- **Branch:** `fix/gemeente-cumulative-preserve` (based on `origin/main` @ `2eb55c5`)
- **Commit:** `36c09bf` — `fix: preserve per-graph cumulative across gemeente selection`
- **PR:** https://github.com/DePubliekeZaak/img-dashboard/pull/15 (base `main`)
- **Worktree:** `/home/joera/code/worktrees/img-gemeente-cumulative-fix`

## Root cause
`GroupControllerV1.update()` (`src/shared/group-v1.ts`) unconditionally overwrote every graph's `segment.cumulative` and `periodization` with the GROUP segment's values on every update. `update()` fires on each gemeente selection change (both page-level and group-level municipality selectors).

All gemeente groups declare `segment: { cumulative: true, ... }`, while trend graphs declare their **own** `segment: { cumulative: false, ... }`. On first load `initSegments` builds each graph segment as `{ ...groupSegment, ...graph.segment }` so the graph's own `false` wins. On the first gemeente change `update()` stomped that `false` with the group's `true`, and it stuck.

The rendered column is driven by the GRAPH segment's cumulative flag (`getActiveColumn` → `segment.cumulative ? variants.cumul : variants.delta`), so the graph segment's cumulative must be preserved.

## Changes (3 coupled)
1. `src/shared/group-v1.ts` — `GroupControllerV1.update()` now only cascades the group segment **`key`** to graph segments; it no longer overwrites each graph's `cumulative`/`periodization` with the group's static values.
2. `src/stores/segment.store.ts` — added `cascadeGroupSegmentUpdate(groupSlug, updates)`: updates that one group's segment **and** all its graph segments (group-scoped mirror of `cascadeSegmentUpdate`).
3. `src/widgets/html-group-filters.ts` — the `cumulativeVsDelta` and `weekVsMonth` toggle handlers now call `cascadeGroupSegmentUpdate(...)` instead of `updateGroupSegment(...)`, so a deliberate toggle still propagates to the group's graphs explicitly.

## Tests
- `test/group-controller.test.ts` — regression: after `initSegments` with group `cumulative:true` / graph `cumulative:false`, calling the group `update()` (plain gemeente change) does NOT change the graph's cumulative (stays `false`); and `cascadeGroupSegmentUpdate` DOES propagate cumulative to graph segments (toggle path).
- `test/segment.store.test.ts` — `cascadeGroupSegmentUpdate` updates only the target group and its graphs (other groups untouched).
- `test/group-filter-cascade.test.ts` — updated to exercise the real `cascadeGroupSegmentUpdate` toggle path instead of manually re-stomping group values onto graphs.

## Gates (all green)
- Full vitest suite: **380 passed, 3 skipped**.
- `tsc -p tsconfig.json` (repo build gate): **clean**.
- Lint: **not configured** in this repo (no eslint config).
- Pre-existing unrelated TS errors exist in `src/charts/renderers/html-popup.ts` under a broader compile; these are untouched by this change and not part of the repo's build gate.
