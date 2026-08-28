# PR #8 — Independent Review

**PR:** github.com/DePubliekeZaak/img-2/pull/8
**Branch:** fix/timeline-label-realwidth → base feat/fix-groups-placeholders
**Reviewer role:** INDEPENDENT (review-only; no edits made)
**Artifact reviewed:** /tmp/timeline-pr8.diff (4 files, ~263 lines)
**Context read (read-only, not judged):** src/charts/renderers/chart-timeline.ts, test/timeline-label-layout.test.ts, test/timeline-overflow-repro.test.ts

---

## VERDICT: READY TO MERGE

All five acceptance-contract points are satisfied. The change is minimal, correct, and well-tested. No blocking, major, or minor issues found. Only nits below.

---

## Evaluation against the acceptance contract

### 1. Real-width overflow fix at the source — PASS
`src/charts/renderers/chart-timeline.ts`:
- Old: `const width = Math.min(label.width, config.maxWidth, cw);`
- New: `const width = Math.min(label.width, cw);`
- `const left = Math.max(0, Math.min(label.left, cw - width));` is unchanged and still holds.

The arbitrary 200px hard cap is gone. Width is capped only by the container (`cw`).
- `LABEL_CONFIG.maxWidth` removed from the constant (and its `config` type parameter removed from `layoutLabels`).
- The `coreWidth` clamp (`left + width <= cw`) still holds by construction: `left <= cw - width` always.

**Wider-than-container degradation (no NaN/inf, no overflow):**
With a label `{left:700, width:1500}` and `cw=800`:
- `width = min(1500, 800) = 800`
- `left = max(0, min(700, 800-800)) = 0`
- `right = 0 + 800 = 800` → clamps to the container left edge, laid-out box equals the container, no overflow, all values finite (`cw = clampWidth>0 ? clampWidth : Infinity` keeps it positive/finite). Verified.

**Typical right-edge case:** `{left:650, width:288}`, `cw=800` → `width=288`, `left=max(0,min(650,512))=512`, `right=800`. Correct.

### 2. Two-phase row assignment + height attribution intact — PASS
The diff touches ONLY the width/left computation inside Phase 1, plus the `config` signature. The entire two-phase machinery is untouched:
- Phase 1 row-frontier assignment (`rows.findIndex(r => r.right <= left)`, `rows[row].right = right`, `rows[row].height = Math.max(...)`) — unchanged.
- Phase 2 top computation (`top += rows[r].height + rowGap`) and `totalHeight` — unchanged.
- The previously-reviewed-and-merged stale-top / height-undercount fixes (row-growth test expects `totalHeight 73`; tall top:0 label `totalHeight 60`) are still in the file and still covered by `timeline-label-layout.test.ts`, which passes unchanged otherwise.

### 3. CSS consistency — PASS
`styling/img-timeline.scss`:
- `max-width: 200px` on `.html_label` removed, consistent with the TS change.
- Replaced with `overflow-wrap: anywhere;` — a reasonable, non-layout-locking safety net that lets an over-long unbreakable token wrap instead of hard-overflowing the now-real-width box.
- The updating comment (why the cap caused the box/text mismatch) is accurate and consistent.

Grep confirms no lingering functional references to `LABEL_CONFIG.maxWidth` / `config.maxWidth` anywhere in `src/` or `test/` (remaining `maxWidth` hits are unrelated widgets and html-header, or comments).

### 4. Regression test — PASS (and genuinely RED pre-fix)
New `test/timeline-label-realwidth.test.ts`:
- `mockLayout()` reports a label's NATURAL text width (`8*len + 16`, no cap) — matching the post-fix stylesheet, so `offsetWidth` of the long label is `34*8+16 = 288` (>200).
- A DOM test puts the long label at the rightmost date (`2026-08-21`), where `x1(date) == CORE_WIDTH`, so the raw left edge sits exactly at the plot-area right edge and the clamp must fire. It asserts no label's `left + offsetWidth` (real rendered width) exceeds `PLOT_AREA_RIGHT_EDGE`.

**Empirically verified RED on pre-fix** (by tracing the old layout path in the diff):
- Pre-fix: `width = min(288, 200, cw) = 200`; `left = plotRight - 200` = `880 - 200 = 680`. Test computes `right = 680 + 288 = 968 > 880` (plotRight) → **offender recorded → test RED.**
- Post-fix: `width = min(288, 880) = 288`; `left = 880 - 288 = 592`; `right = 592 + 288 = 880` → not `> 880` → **GREEN.**

So the test genuinely fails on the old code and passes on the fix. Confirmed.

**Degrade test:** `{left:700, width:1500}` in `cw=800` → asserts `left===0`, `left>=0`, all finite, `totalHeight===24`, `row===0`. Pre-fix this would give `left=600` (width→200) → RED pre-fix; post-fix `left=0` → GREEN. Genuinely discriminating.
- Also a `{left:650, width:288}` case asserting `left===512`, `left+288===800` (no 200px cap) — RED pre-fix (600), GREEN post-fix.
- `timeline-label-layout.test.ts` existing clamp test was correctly updated to the new expectation (`left 600 → 300`, `left+500<=800`), matching the removed maxWidth semantics.

### 5. Scope — PASS
Diff is limited to exactly the 4 permitted files:
- `src/charts/renderers/chart-timeline.ts`
- `styling/img-timeline.scss`
- `test/timeline-label-layout.test.ts`
- `test/timeline-label-realwidth.test.ts` (new)

No unrelated files, no scope creep. `layoutLabels` has no other callers outside this module and its tests, so the signature change is fully contained.

---

## BLOCKING issues
None.

## MAJOR issues
None.

## MINOR issues
None.

## Nits
- `test/timeline-overflow-repro.test.ts` (pre-existing, not part of this diff) still models `offsetWidth` with a 200px cap in its `mockLayout`, so it models the OLD stylesheet and does not exercise the new real-width path. That's fine for the PR (it still guards the plot-area clamp from PR#7), but be aware the new `timeline-label-realwidth.test.ts` is the single test that actually exercises the real-width behavior. Worth a follow-up comment so future readers don't assume the repro test covers it.
- `overflow-wrap: anywhere` affects min-content sizing and can change measured `offsetWidth` for very long words; acceptable as a safety net given labels are now sized to real width, but its interaction with the measured width is worth a mental note if label widths ever look unstable.
- Cosmetic: the code comment and the SCSS comment both narrate the 200px history well; slightly verbose but accurate — no action needed.
- `LONG_LABEL_WIDTH = LONG_LABEL.length * 8 + 16` is a hard-coded estimate rather than the measured value, but it is internally consistent with `mockLayout` (same formula), so the arithmetic (`34*8+16=288`) holds. Fine.

---

## Summary
The PR cleanly fixes the root cause: labels are sized to their real rendered width (only container-capped) instead of a hard 200px box that let the text spill past. The two-phase layout/height logic is untouched, the CSS change is consistent, there is no scope creep, and the new regression test plus degrade test are provably RED on pre-fix code and GREEN post-fix. Ready to merge.
