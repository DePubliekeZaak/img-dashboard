# PR #15 handoff — preserve per-graph cumulative across gemeente selection

**Date:** 2026-09-18

## Status: READY TO MERGE (reviewed + approved)
PR: https://github.com/DePubliekeZaak/img-dashboard/pull/15 (branch `fix/gemeente-cumulative-preserve`, base `main` @ 2eb55c5).

## Bug
On the `gemeente` page the trend graphs (BarTrendV1) rendered `cumulative=false` (delta) on load, but flipped to `cumulative=true` after selecting a different gemeente, and stayed that way.

## Root cause
`GroupControllerV1.update()` (src/shared/group-v1.ts) unconditionally overwrote every graph's `segment.cumulative` (and `periodization`) with the GROUP segment's static values on every update; `update()` fires on every gemeente selection change. Gemeente groups declare `segment:{cumulative:true}` while trend graphs declare their OWN `segment:{cumulative:false}`. `initSegments` merges `{...groupSegment, ...graph.segment}` so the graph's `false` wins on first load, but the first gemeente change stomped it to the group's `true`. The rendered column is driven by the GRAPH segment's `cumulative` flag (`getActiveColumn` → `segment.cumulative ? variants.cumul : variants.delta`).

## Fix (3 coupled changes)
1. `src/shared/group-v1.ts` — `update()` cascade now propagates only `key`; no longer stomps per-graph `cumulative`/`periodization`.
2. `src/stores/segment.store.ts` — added `cascadeGroupSegmentUpdate(groupSlug, updates)` (group-scoped mirror of `cascadeSegmentUpdate`).
3. `src/widgets/html-group-filters.ts` — the `cumulativeVsDelta` and `weekVsMonth` toggle handlers now use `cascadeGroupSegmentUpdate(...)` so a deliberate toggle still propagates to the group's graphs.

## Verification
- vitest: 380 passed / 3 skipped; `tsc -p tsconfig.json` clean (both re-run by orchestrator).
- Independent review: APPROVE, no blocking findings. Two optional non-blocking nits (regression test could assert `key` cascading more strongly and an explicit `periodization`-preservation assertion) — deferred, not required.
- Regression + scoping tests added; `group-filter-cascade.test.ts` updated to the new toggle path.

## Next
Human merges PR #15. Optional future: strengthen key/periodization assertions in the regression test.
