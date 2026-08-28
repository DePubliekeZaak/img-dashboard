# Review — PR #5 `feat/timeline-label-layout` (img-2)

**Scope:** independent review of https://github.com/DePubliekeZaak/img-2/pull/5 against the acceptance contract (C1–C5, A1–A4, B1–B3) and behavioral requirements (n1–n5).

**Files reviewed:**
- `src/charts/renderers/chart-timeline.ts` (commit `7b12b91`)
- `test/timeline-label-layout.test.ts` (6 new tests)
- `src/pages/timeline.ts` (data: 14 entries, dates unique, two "Zeerijp" labels)
- `src/shared/group-v1.ts:244-245` (timeline data is date-sorted before reaching the chart)
- `styling/img-timeline.scss` (`.html_label { max-width: 200px; position: absolute; }`)
- `src/charts/core/chart-dimensions.ts` (`svgHeight = graphHeight − padding.top − padding.bottom`)

**Method:** diff reconstructed from git (`git show 7b12b91`), full-file read, and empirical verification of the sweep algorithm via an inline `tsx` simulation (no repo files modified).

---

## Verdict

**Not ready to merge as-is.** The diff correctly implements most of the contract (C1, C2, C4, A2, A3, B2, B3), but the A1 sweep has a genuine correctness bug in how it assigns `top` and `totalHeight`: row heights are finalized only at the end, while tops/totalHeight are computed incrementally during the sweep. This produces **real label overlap** and **insufficient height** in a reachable scenario, violating the two core behavioral requirements (n2 "no label overlaps another" and n3 "returned timeLineHeight and container height are sufficient for ALL labels"). Both blocking findings share one root cause and one fix.

---

## 1. Correctness issues

| Severity | File:Line | Issue |
|---|---|---|
| **BLOCKING** | `chart-timeline.ts:55-65` | **Stale `top` causes visual overlap (violates n2).** A label's `top` is fixed at placement time (lines 59-63), but `rows[row].height` can grow later (line 56) when a taller label lands in an upper row; already-placed lower-row labels keep their old top and can overlap the taller upper-row label. |
| **BLOCKING** | `chart-timeline.ts:59-65` | **`totalHeight` undercounts (violates n3/C3).** `totalHeight` is a running max of `top + height` using stale tops; when an upper row grows after a lower-row label was placed, the returned height is too small, so `htmlDiv.style.height` (line 258) and `element.style.height` (line 260) are insufficient. |
| MINOR | `chart-timeline.ts:47` | **Label wider than container overflows (violates n1/B1 in that case).** `Math.max(0, Math.min(label.left, cw - width))` → when `width > cw`, `cw - width < 0`, so `left=0` and `right = width > cw`. Should also clamp `width` to `cw`. |
| MINOR | `chart-timeline.ts:231` + `:46` | **containerWidth 0 silently disables all clamping.** If `htmlDiv.clientWidth` and `element.clientWidth` are both 0, `cw = Infinity` and B1/n1 are silently dropped. |
| NIT | `chart-timeline.ts:55` | **`rows[row].right = right` is only safe because `right >= r.right` always holds** (left ≥ frontier, width ≥ 0). Correct today, but an unstated invariant worth a comment. |

### Empirical verification (inline tsx simulation, no repo edits)

Scenario A — sorted lefts, upper row grows after lower-row label placed:

```ts
layoutLabels([
  { left: 0,   width: 100, height: 20 },
  { left: 80,  width: 100, height: 30 },  // row 1
  { left: 110, width: 100, height: 40 },  // row 0, taller
], 800, { rowGap: 3, maxWidth: 200 })
```

Result:
- placements: `(left=0,top=0,row=0)`, `(left=80,top=23,row=1)`, `(left=110,top=0,row=0)`
- `totalHeight = 53`, **true stack height = 73** (undercount)
- **Visual overlap confirmed:** label B (row 1, top=23, h=30) vs label D (row 0, top=0, h=40) overlap in x[80,180] × y[23,40] ��� `overlapX=70, overlapY=17`.

This is reachable with the date-sorted data the chart actually receives (`group-v1.ts:244-245`).

Scenario B — edge cases:

```ts
// label wider than container -> overflow
layoutLabels([{ left: 50, width: 200, height: 20 }], 100, cfg)
// left=0, right=200 > 100  => overflow: true

// containerWidth 0 -> Infinity fallback, no clamp
layoutLabels([{ left: 900, width: 100, height: 20 }], 0, cfg)
// left=900, right=1000 (no clamp)

// negative left -> clamped to 0 (correct)
// empty data -> 0 placements, totalHeight 0 (correct)
```

---

## 2. Contract violations

| Item | Status | Notes |
|---|---|---|
| **C1** | ✅ | Selector now `[data_label="${d.date}"]` with closing `]` (`:249`); old missing-bracket selector threw in real browsers. |
| **C2** | ✅ | Keyed on `d.date` (`:212`); unique in `timelineList` (both "Zeerijp" entries have distinct dates 2025-11-13/14). Caveat: duplicate/missing dates break the arrow lookup (see edge cases). |
| **C3** | ⚠️ | Intent implemented (`totalHeight = max(top+height)`, `:65`) but undercounts in the row-growth case (blocking bug), so not reliably satisfied. |
| **C4** | ✅ | Explicit recompute (`:258-261`); `trim` guards null/NaN (`:71-75`). |
| **A1** | ⚠️ | Sweep + per-row frontier implemented (`:40-69`); `findIndex(r => r.right <= left)` correctly returns the first row that fits (frontier is the max right edge, so a wider earlier label is accounted for). Horizontal fit is correct; the failure is vertical `top` assignment (blocking bug). |
| **A2** | ✅ | Batch measure once (`:227-230`); `distance` attribute writes dropped. |
| **A3** | ✅ | Rightmost label goes through the same loop; `arrows.attr` covers all arrows. |
| **B1** | ⚠️ | Clamp works for `width <= cw`, fails for `width > cw`, and is disabled when containerWidth measures 0. |
| **B2** | ✅ | Collision test uses actual `prevLeft + prevWidth` via the frontier. |
| **B3** | ✅ | Clamped rightmost width feeds `right = left + width` and the row-fit test. |
| **A4** | ❌ | Still `innerHTML = ""` + full rebuild (`:209`); only the attribute is keyed on date, not a keyed join. Soft miss (contract says "if straightforward"). |
| **C5** | ⚠️ | Constants centralized in `LABEL_CONFIG` (`:4-15`), but `tolerance: 60` is dead (never referenced anywhere) and `offset = 0` (`:157`) remains inline. |

---

## 3. Regression risks

| Severity | File:Line | Issue |
|---|---|---|
| NIT | `chart-timeline.ts` (removed block) | **Removed hidden SVG text**: safe — it was `opacity: 0` with a no-op `y` attr; divs now built from `groups.each` carrying the same data binding. |
| NIT | `chart-timeline.ts` (removed block) | **Removed `distance` logic**: intended (A2); old collision pass was O(n²) and buggy. |
| MINOR | `chart-timeline.ts:212,249` | **`slugify(d.html)` → `d.date`**: `d.date` exists and is unique on all current data, but if any future dataset has duplicate or missing dates, the arrow lookup `[data_label="${d.date}"]` returns the first/`undefined` div → wrong arrow heights. |
| MINOR | `chart-timeline.ts:260` | **`element.style.height` change**: old was monotonic growth from `graphHeight`; new is `svgHeight + timeLineHeight`. Since `svgHeight = graphHeight − padding.top − padding.bottom`, the element can now be *shorter* than before (single-row labels: old ≈ graphHeight+16, new ≈ graphHeight − padding + labelHeight). Sufficient to contain labels, and intended by C4, but a visible shrink — eyeball in the browser. |
| NIT | `chart-timeline.ts:245,252` | **`highest` is now dead**: assigned, never read. |
| NIT | `chart-timeline.ts:247-249` | **`arrows.attr` selects all `rect.arrow` in the SVG** with a whole-element per-date lookup — pre-existing pattern, low risk since each controller has one timeline. |

---

## 4. Edge cases

| Case | Result |
|---|---|
| Empty data | `draw()` early-returns; `layoutLabels([])` → 0 placements, 0 height (verified). Fine. |
| containerWidth 0 | `cw=Infinity`, no clamping (n1 degraded). Minor. |
| Negative left | Clamped to 0 (`:47`). Fine. |
| Label wider than container | Overflows (see correctness). Minor. |
| Duplicate dates | Sweep stacks them in separate rows (no overlap), but DOM `data_label` collision makes the arrow lookup ambiguous. Minor. |
| Missing `d.date` | `data_label="undefined"` → valid selector, returns first such div or null → top=0; no crash, wrong arrow heights. Minor. |
| `d.date` with quotes/special chars | Would break the attribute selector — not applicable to current data. |

---

## 5. Test quality

The 6 tests pass and cover: first-row placement, overlap→row stacking with a later label returning to row 0, B1 clamp, B3 rightmost width, C3 tall top:0, maxWidth clamp.

**Gaps:**
- **No test for the row-growth scenario** (upper row grows after a lower-row label is placed) — this is exactly the bug, so the suite misses both blocking issues.
- No test asserting the **no-overlap invariant** (n2) over a multi-row, mixed-height set.
- No test for **totalHeight with multiple rows where an upper row grows** (n3).
- No test for **empty input**, **containerWidth 0**, or **label wider than container**.
- **No test for the C1 selector fix** — the actual browser-breaking bug has zero coverage (the arrow-lookup path isn't tested at all).
- No test for the **trim NaN/null guard** (C4) or **duplicate/missing `d.date`**.
- Test 6 ("clamps width to max-width") is weak — only asserts `left === 0`, doesn't verify the width clamp's effect on row choice or the right edge.
- No integration check that markers/background/tooltips survive (n5), though those are untouched pre-existing code.

---

## Recommended fixes

1. **BLOCKING — finalize row heights before assigning tops / computing totalHeight.** Do the sweep in two phases:
   - Phase 1: assign each label to a row and update the frontier + `rows[row].height` (as now).
   - Phase 2: after all row heights are known, compute each label's `top = Σ(rows[r].height + rowGap)` for `r < row`, and `totalHeight = max(top + label.height)`.
   This eliminates both the stale-top overlap and the totalHeight undercount in one change.

2. **MINOR — clamp width to the container.** In `layoutLabels`, also clamp `width` to `cw` (e.g. `const width = Math.min(label.width, config.maxWidth, cw)`), so `left + width` never exceeds `cw` even when a single label is wider than the container.

3. **MINOR — make the containerWidth-0 fallback explicit.** When `containerWidth <= 0`, either keep `cw = Infinity` but document that B1 is disabled, or fall back to `element.scrollWidth`/`getBoundingClientRect().width` before giving up.

4. **Add regression tests for the row-growth scenario** (both overlap and totalHeight), plus empty-input, containerWidth-0, wider-than-container, and a DOM-level test for the C1 selector/arrow lookup.

5. **Cleanup (nits):** remove dead `LABEL_CONFIG.tolerance`, dead `highest`, and inline `offset = 0`.

---

## Summary table

| Requirement | Status |
|---|---|
| n1 (no right-edge overflow) | ⚠️ fails when label wider than container / containerWidth 0 |
| n2 (no overlap) | ❌ blocked by stale-top bug |
| n3 (sufficient height) | ❌ blocked by totalHeight undercount |
| n4 (valid selectors in real browsers) | ✅ C1 fixed |
| n5 (no regressions: markers/bg/tooltips) | ✅ untouched |
