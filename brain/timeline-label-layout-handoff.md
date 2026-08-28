# Handoff — Timeline label placement & height (PR #5)

**Status: READY TO MERGE** (independent re-review passed). Human merges; orchestrator does not merge.

## Deliverable
- **PR:** https://github.com/DePubliekeZaak/img-dashboard/pull/5
- **Branch:** `feat/timeline-label-layout` (worktree `/home/joera/code/img-timeline-labels`)
- **Base:** `feat/fix-groups-placeholders` (= local `main` @ `5dcd922`; contains the timeline code)
- **Commits:** `7b12b91` (feat) + `261350a` (fix: two-phase layout, width clamp, review fixes)
- **Files:** `src/charts/renderers/chart-timeline.ts` (+180/−99), `test/timeline-label-layout.test.ts` (new, 12 tests)

## What it does
- **A1** single left-to-right sweep with per-row frontier (`layoutLabels`, pure + exported), replacing the O(n²) collision pass.
- **Two-phase** layout: Phase 1 assigns rows + grows row heights; Phase 2 (after heights finalized) computes tops = Σ(rows[r].height + rowGap) and totalHeight = max(top + height). Fixes stale-top overlap (n2) and height undercount (n3).
- **B1/B3** width + left both clamped to container (`width = min(w, maxWidth, cw)`), so `left + width ≤ cw` even for a label wider than the container.
- **B2** collision test uses actual right edge via row frontier, not the old `offsetWidth − 60` heuristic.
- **C1** fixed invalid selector `[data_label="…"` → `[data_label="${d.date}"]` (missing `]` broke the height block in real browsers).
- **C2** `data_label` keyed on `d.date` (unique) instead of `slugify(d.html)` (duplicate "Zeerijp").
- **C3/C4** height attribution counts all labels; explicit recompute, `trim` NaN/null guard.
- **A2** batch-measure widths/heights once; dropped `distance` attribute writes.
- **C5** constants centralized in exported `LABEL_CONFIG` (nit: `offset = 0` still inline).
- Removed dead code: hidden SVG label text, `staggerTop`, `LABEL_CONFIG.tolerance`, `highest`.

## Gates (green, verified in worktree)
- `vitest run`: 361 passed / 3 skipped (incl. 12 timeline tests).
- `npx tsc --noEmit`: clean.
- `webpack build:dev`: OK (only pre-existing Sass @import deprecation warnings).
- Note: `pnpm test`'s pre-run install check fails on ignored build scripts — run vitest directly (`./node_modules/.bin/vitest run`).

## Review trail
- **Round 1** (`brain/timeline-pr5-review.md`): found 2 BLOCKING (stale-top overlap, totalHeight undercount) + minors. → Fix task `261350a`.
- **Round 2** (`brain/timeline-pr5-rereview.md`): READY TO MERGE. Both blocking verified fixed by simulation; row-growth regression test provably fails on old code. Remaining notes (non-blocking): jsdom can't reproduce the C1 selector throw (DOM test is a smoke test only); `element.style.height = svgHeight + timeLineHeight` may visibly shrink single-row charts — eyeball in browser; `layoutLabels` assumes left-sorted input (holds for date-sorted data); duplicate/missing `d.date` makes arrow lookup ambiguous (null-guarded).

## Process notes for next runs
- Sub-agent "completed" notifications are always premature (fire on first idle at startup); verify via `sys_session_get_info` + worktree/PR ground truth. Goal-mode runs never send a real completion notification.
- `solaris` is NOT launchable here (model provider fails to resolve) — reviews ran on `builder` in fresh sessions.
- Original findings doc: `brain/timeline-label-layout-findings.md`.
