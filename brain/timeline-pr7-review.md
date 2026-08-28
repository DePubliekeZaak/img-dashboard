# PR #7 Review — timeline label overflow fix

**Date:** 2026-08-27
**Reviewer:** fresh `builder` session `9498f49fa24040f0a2540bc1b206e041` (independent; diff-only, no worktree access)
**PR:** https://github.com/DePubliekeZaak/img-dashboard/pull/7 — `fix/timeline-label-overflow-v2` → `feat/fix-groups-placeholders`

## Verdict: READY TO MERGE

No blocking or major issues. The clamp target is geometrically correct, the two-phase layout is untouched, and the regression test genuinely goes RED on the old code (verified by running it against `main`'s version in a throwaway copy) and GREEN on the fix.

## Context / root cause (confirmed)

Labels are positioned at `left = x1(date) + innerPadding.left`; the old clamp targeted the full chart element width (`htmlDiv.clientWidth`), which is wider than the graph plot area (`coreWidth`). A long label (~200px CSS max-width) at a rightmost date therefore extended past the plot area — and past the visible element — producing the horizontal scrollbar. Fix clamps against the plot area's right edge (`coreWidth + innerPadding.left`).

## Verification performed by reviewer

- Diff matches branch exactly (`git diff main...HEAD` == `/tmp/timeline-pr7.diff`).
- Geometry traced through `svg-service.ts` / `axes.service.ts` / `chart-dimensions.ts` / `graph-v3.ts` / SCSS.
- Full suite run: **363 passed / 3 skipped**; tsc clean.
- New test run against old code (RED) and new code (GREEN).

## Issues (all non-blocking)

**Minor**
- `test/timeline-overflow-repro.test.ts:12,31-32` — geometry rationale in comments is factually wrong: `_addMargin(0,180,0,0)` / `_addPadding(10,90,0,0)` use `(top,bottom,left,right)` order, so 180/90 are `margin.bottom`/`padding.bottom` (not right). Real `coreWidth` = `elementWidth − 100` (monthly path) or data-driven `w` (weekly path, bar-trend-v1.ts:215) — plot area ~50px narrower than element, not ~320px. Test is internally self-consistent and still catches the bug; comment misleads future maintainers.

**Nits**
- `chart-timeline.ts:271` — caller variable still named `containerWidth` but now holds the clamp target (`min(elementWidth, plotRight)`); `layoutLabels`' `clampWidth` rename is good — consider matching here.
- `test/timeline-overflow-repro.test.ts:143-168` — test 2 ("no element overflow") also passes on old code (rights ≈ 917-1037 < 1200); defensive guard only, not a bug-catcher. Test 1 is the real catcher.
- `chart-timeline.ts:267-271` — `plotRight = coreWidth + innerPadding.left` derivation (see minor for real geometry).

## Gates (orchestrator-verified at clean commit `5446948`)

- `vitest run`: 363 passed / 3 skipped (18 files passed, 1 skipped).
- `tsc --noEmit`: clean.
- webpack build: OK (verified by implementer earlier).

## PR history note

PR #6 (same fix, branch `fix/timeline-label-overflow`) was closed because its diff was polluted: the branch was based on local `main` whose history included `caa5883 "brain implant"` (brain/ docs + the user's pre-existing WIP changes to `numbers-v1.ts`, `regelingen/config.ts`, `default-group-v1.ts`). Cleanup rebased the fix onto `feat/fix-groups-placeholders`; force-push was hard-blocked by the blast-radius policy, so the clean state was pushed as `fix/timeline-label-overflow-v2` and PR #7 opened. PR #7's diff is exactly 2 files.
