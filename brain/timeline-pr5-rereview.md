# Re-Review — PR #5 `feat/timeline-label-layout` (img-2), round 2

**Scope:** independent re-review of the current PR diff (`/tmp/timeline-pr5-v2.diff`, branch `feat/timeline-label-layout` @ `261350a`) against the previous review (`timeline-pr5-review.md`) and the acceptance contract (C1–C5, A1–A4, B1–B3, n1–n5).

**Method:** diff read in full; current `chart-timeline.ts` (286 lines) and `test/timeline-label-layout.test.ts` (164 lines) read from the branch with line numbers; the two-phase algorithm and the old single-pass algorithm were both re-implemented and simulated empirically (row-growth scenario, edge cases); jsdom was probed directly to check whether the C1 DOM test can detect the original missing-bracket selector bug. No files modified.

---

## 1. Verdict

**READY TO MERGE.** Both blocking findings are genuinely fixed (verified by simulation, not just by reading the code), all three minor findings are addressed, and the new tests include a row-growth regression test that provably fails on the old code.

---

## 2. Previous findings — status

### Blocking

| Finding | Status | Evidence (current `chart-timeline.ts`) |
|---|---|---|
| **Stale-top overlap (n2)** — tops assigned during the sweep, before row heights are final | **RESOLVED** | Layout is now two-phase: Phase 1 (`:51-71`) assigns rows and grows `rows[r].height` but sets `top: 0` (`:70`); Phase 2 (`:73-84`) runs after all row heights are finalized and computes each label's `top = Σ(rows[r].height + rowGap)` for `r < row` (`:78-82`). Simulation of the exact review scenario (`{0,100,20},{80,100,30},{110,100,40}`): old gave row-1 top = 23 (overlap area 1190 px²), new gives top = 43 — the lower-row label is pushed below the grown 40 px row 0. No overlap. |
| **totalHeight undercount (n3/C3)** — running max with stale tops | **RESOLVED** | `totalHeight` is now computed in Phase 2 from final tops: `Math.max(totalHeight, top + labels[i].height)` (`:83`). Simulation: old returned 53, new returns 73 = true stack height (40 + 3 + 30). |

### Minor

| Finding | Status | Evidence |
|---|---|---|
| **Width clamp to container** — `width = min(label.width, maxWidth, cw)` so `left + width` never exceeds `cw` | **RESOLVED** | `:56` `const width = Math.min(label.width, config.maxWidth, cw);` and `:57` clamps `left` against `cw - width`. Verified: `{left:50,width:200}` with `cw=100` → width 100, left 0, right edge exactly 100 (no overflow). |
| **containerWidth-0 fallback** — redraw should fall back to `scrollWidth` / `getBoundingClientRect().width` | **RESOLVED** | `:248-255` tries `htmlDiv.clientWidth` → `element.clientWidth` → `scrollWidth` → `getBoundingClientRect().width` → 0. `layoutLabels` still documents the `cw = Infinity` degradation (`:39-41`, `:49`) for the case where all fallbacks yield 0. |
| **Dead code: `LABEL_CONFIG.tolerance` and `highest`** | **RESOLVED** | `tolerance: 60` is gone from `LABEL_CONFIG` (`:4-12`; present in old commit `7b12b91:6`). `highest` is removed entirely — the arrow callback no longer accumulates it (`:269-275`). (Nit: `offset = 0` remains inline at `:174` — see §3.) |

### Test gaps

| Gap | Status | Evidence (test file) |
|---|---|---|
| **Row-growth regression test** (upper row grows after lower-row label placed) asserting no overlap + correct totalHeight | **RESOLVED — and it genuinely catches the old bug** | `test:38-53` uses exactly the review's scenario. Re-simulating the old single-pass algorithm against this test: `placements[1].top` old = 23 vs expected 43 → fails; `totalHeight` old = 53 vs expected 73 → fails; the no-overlap assertion (`:49-51`) fails too. All three assertions would have caught the old bug. |
| **Empty input, containerWidth 0, label wider than container** | **RESOLVED** | `test:87-91` (empty → 0 placements, height 0), `test:93-98` (cw 0 → no crash, left preserved, documented), `test:100-105` (wider-than-container → `left + width ≤ cw`). |
| **DOM-level test for the C1 selector fix (arrow lookup with closing bracket)** | **RESOLVED with caveat** | `test:143-153` exercises the full `draw`+`redraw` path, asserts no throw and arrow heights ≥ 16 via the fixed selector. **Caveat:** this test would also pass on the old broken selector — jsdom is lenient and does not throw on `[data_label="x"` (verified empirically), so it is a smoke test for the new path, not a regression test for the missing-bracket bug. That is an environment limitation (jsdom can't reproduce the browser `SyntaxError`); the code fix itself is correct (`:271`). |
| **DOM-level test for C2 `d.date` keying** | **RESOLVED** | `test:155-163` asserts both `data_label` attributes equal the unique dates `2025-11-13`/`2025-11-14`. |

---

## 3. New issues introduced by the fix

No new blocking or major issues found.

| Severity | File:Line | Issue |
|---|---|---|
| MINOR (pre-existing, unchanged) | `chart-timeline.ts:281-282` | `element.style.height = svgHeight + timeLineHeight` replaces the old monotonic growth; since `svgHeight = graphHeight − padding.top − padding.bottom`, the element can be visibly shorter than before for single-row labels. Intended by C4 and sufficient to contain labels, but should be eyeballed in a browser (flagged in round 1, not changed). |
| NIT | `chart-timeline.ts:174` | `const offset = 0;` still inline (commented-out `i % 2` stagger). C5 centralization is otherwise complete; this one constant was not moved into `LABEL_CONFIG`. |
| NIT | `chart-timeline.ts:60-61` | The frontier invariant (`right >= row.right` always holds) relies on the input being sorted by non-decreasing `left`. This is now documented in a comment and holds for the date-sorted data the chart receives (`group-v1.ts:244-245`), but `layoutLabels` does not guard against unsorted input. Pre-existing assumption, now explicit. |
| NIT | `chart-timeline.ts:270-271` | Per-arrow whole-element `querySelector` by `d.date`; duplicate/missing dates still make the lookup ambiguous (guarded to `top = 0` via `:273`). Pre-existing, unchanged. |

---

## 4. Contract status against the current diff

### C1–C5

| Item | Status | Evidence |
|---|---|---|
| **C1** fix invalid selector (missing `]`) | ✅ | `:271` `[data_label="${d.date}"]` — closing bracket present. |
| **C2** key `data_label` on unique id | ✅ | `:230` `div.setAttribute("data_label", d.date)`. |
| **C3** all labels in height attribution | ✅ | `:83` `totalHeight = max(top + height)` over every label; correct because tops are final (two-phase). |
| **C4** explicit recompute + NaN guard | ✅ | `:279-282` recompute, no monotonic growth; `trim` guards null/NaN (`:89-93`). |
| **C5** centralize constants | ✅ (nit) | `LABEL_CONFIG` `:4-12`; `tolerance` removed. `offset = 0` (`:174`) still inline (nit). |

### A1–A4

| Item | Status | Evidence |
|---|---|---|
| **A1** single left-to-right sweep | ✅ | `layoutLabels` `:42-87`; per-row frontier, `findIndex(r => r.right <= left)` (`:62`), no O(n²) pass. Two-phase variant is a superset of the original A1 intent. |
| **A2** measure once, cache | ✅ | `:242-246` batch `offsetWidth`/`offsetHeight`; `distance` attribute writes dropped. |
| **A3** rightmost label included in collision checks | ✅ | All labels go through the same loop; no off-by-one exclusion. |
| **A4** keyed join by date | ❌ (soft) | `:223` still `innerHTML = ""` + full rebuild; only the attribute is keyed on date. Contract marks this "if straightforward" — soft miss, not a merge blocker. |

### B1–B3

| Item | Status | Evidence |
|---|---|---|
| **B1** clamp/flip right-edge labels | ✅ | `:56-57` width and left both clamped so `left + width ≤ cw`. |
| **B2** previous label's right edge in collision test | ✅ | Row frontier `r.right <= left` (`:62`) uses actual `left + width`, not the old `offsetWidth − 60` heuristic. |
| **B3** rightmost label's width in row choice | ✅ | Clamped width feeds `right = left + width` and the row-fit test (`:56-62`); covered by `test:62-70`. |

### Behavioral n1–n5

| Item | Status | Notes |
|---|---|---|
| **n1** no right-edge overflow | ✅ | Width clamped to `cw`; only degraded when `cw = Infinity` (all width fallbacks 0), documented. |
| **n2** no label overlap | ✅ | Two-phase tops; verified by simulation (row-growth scenario overlap eliminated). |
| **n3** sufficient height for all labels | ✅ | `totalHeight` from final tops = true stack height (verified 73 vs old 53). |
| **n4** valid selectors in real browsers | ✅ | `:271` closing bracket; null-guarded (`:273`). |
| **n5** no regressions (markers/bg/tooltips) | ✅ | Marker/bg code only parameterized via `LABEL_CONFIG` (`:133`, `:161-167`); tooltip block untouched (`:185-220`). |

---

## 5. Test sanity-check

- **Row-growth test (`test:38-53`) — does it really catch the old bug?** Yes. I re-implemented the old single-pass algorithm and ran the test's assertions against it: `placements[1].top` (23 vs 43) fails, the no-overlap comparison `placements[1].top >= placements[2].top + labels[2].height` (23 ≥ 40) fails, and `totalHeight` (53 vs 73) fails. All three assertions independently catch the regression. The expected `73` is the correct true stack height (40 + 3 + 30).
- **C1 DOM test (`test:143-153`)** — meaningful as a smoke test: it drives the real `draw`+`redraw` path, confirms no throw, and confirms every arrow gets a height ≥ 16 through the fixed selector. But it is **not** a regression test for the missing-bracket bug: jsdom does not throw on the malformed selector (verified empirically), so this test would pass on the old code too. The fix itself is correct by inspection; a true regression test is not feasible under jsdom.
- **C2 DOM test (`test:155-163`)** — meaningful: asserts the two `data_label` attributes are the unique dates, covering the duplicate-"Zeerijp" case that motivated C2.
- **Edge-case tests (`test:87-105`)** — correct and meaningful: empty (0/0), cw 0 (left preserved, no crash), wider-than-container (`left + width ≤ cw` after clamp). The B1/B3/maxWidth-clamp tests (`test:55-85`) all assert exact values that match the algorithm (verified by simulation).
- **Weakness (non-blocking):** in jsdom `offsetWidth`/`offsetHeight` are 0, so the DOM tests exercise the layout only degenerately (all labels width 0 → all row 0). The layout logic itself is fully covered by the pure-function tests, which is the right split.

---

## Summary

Both blocking bugs (stale-top overlap, totalHeight undercount) are resolved with the two-phase layout and are backed by a regression test that provably fails on the old code. All three minor findings and the remaining test gaps (except the inherently-untestable-in-jsdom C1 selector throw) are addressed. No new blocking or major issues. **Verdict: READY TO MERGE.**
