# Findings Report: Timeline Label Placement & Height Calculations

**File under review:** `src/charts/renderers/chart-timeline.ts` (248 lines)
**Context files:** `src/charts/renderers/chart-bar-trend.ts`, `src/charts/controllers/bar-trend-v1.ts` (+ `bar-trend-v1R.ts`, `bar-trend-aos-v1.ts`, `bar-trend-bedragen-v2.ts`, `bar-trend-stacked-makeup-v2.ts`), `src/charts/index.ts`, `src/charts/core/chart-dimensions.ts`, `src/charts/core/graph-v3.ts`, `styling/img-timeline.scss` (compiled at `public/styles/main.css:1137-1150`), `src/pages/timeline.ts`, `src/shared/group-v1.ts`.
**Date:** 2026-08-27 · **Read-only investigation — no files were modified.**

---

## 0. Data flow & context (for orientation)

- **Timeline data** is a small, date-ascending list of events `{date, label, html, description, category}` — defined in `src/pages/timeline.ts` (14 hardcoded entries, e.g. "Zeerijp" appears **twice**), filtered/sorted in `src/shared/group-v1.ts:233-242`.
- **Instantiation**: each trend controller creates `new elements.ChartTimeline(this)` in `init()` and always calls `draw(data.timeline, 0)` / `redraw(data.timeline, 0)` with `index = 0` (`bar-trend-v1.ts:192,223`; also `bar-trend-v1R.ts`, `bar-trend-aos-v1.ts`, `bar-trend-bedragen-v2.ts`, `bar-trend-stacked-makeup-v2.ts`). `timeline_2` is declared in every controller but **never instantiated**.
- **Controller consumption**: `const timeLineHeight = this.timeline_1?.redraw(...)` then `this.graphEl.style.paddingBottom = (30 + timeLineHeight) + "px"` (`bar-trend-v1.ts:223,234`). So the *only* height signal the container actually uses is the returned `timeLineHeight`.
- **DOM structure**: `htmlDiv` (`.timeline_html_div`) is appended to `ctrlr.element` (the `.scrolltainer`), which is a flex column containing the SVG. Labels are absolutely-positioned `<div class="html_label">` inside it. The SVG markers (circle/beving icon + arrow rect) live in `g.timeline_0`.
- **CSS** (`styling/img-timeline.scss`, compiled at `public/styles/main.css:1137-1150`):
  ```scss
  .timeline_html_div {
      position: relative;
      .html_label {
          max-width: 200px;
          line-height: 1.25;
          font-size: .85rem;
          position: absolute;
          background: #eee;
          border-radius: 5px 5px 0 0;
          padding: .25rem .5rem;
      }
  }
  ```
  No `width`/`white-space`/`overflow` rules — labels can be up to 200px wide and can wrap.

---

## 1. Exact label-placement algorithm

### 1a. SVG markers (`draw`, lines 17–72)
`draw()` builds a `g.timeline_<index>` group with a background rect (lines 28–31), and per datum a `g.timeline_item` containing a circle (`r=5`, `cy=5`) or a 24×24 beving image, a 1px-wide arrow rect (`x=-0.5`, `y=10`, lines 56–62), and a **hidden** SVG `<text class="label">` (`opacity: 0`, lines 64–71) that is never used for display — the real label is the HTML div.

```ts
17:  draw(data: any[], index: number) {
18:    if (data.length === 0) return;
...
28:    group
29:      .append("rect")
30:      .attr("class", "timeline_bg" + index.toString())
31:      .style("fill", "#eee");
...
56:    groups
57:      .append("rect")
58:      .attr("class", "arrow")
59:      .attr("width", 1)
60:      .attr("fill", "#eee")
61:      .attr("x", -0.5)
62:      .attr("y", 10);
...
64:    groups
65:      .append("text")
66:      .attr("class", "label")
67:      .attr("x", 0)
68:      .attr("y", (d, i) => {})
69:      .style("font-size", ".66rem")
70:      .style("opacity", 0)
71:      .text((d) => d.label);
72:  }
```

### 1b. Marker positioning (`redraw`, lines 90–97)
```ts
90:    groups.attr("transform", (d, i) => {
91:      const offset = 0; /// i % 2 === 0 ? 0 : 15;
92:
93:      const x = this.ctrlr.scales.x1.fn(new Date(d.date));
94:      const y = this.ctrlr.dimensions.svgHeight + 30 * (index + 1) + offset;
95:
96:      return "translate(" + x + "," + y + ")";
97:    });
```
- **x** = time scale `x1` output for the event date.
- **y** = `svgHeight + 30 * (index + 1)` — the `30*(index+1)` is the **vertical band offset per timeline index** (index 0 → 30px below the SVG bottom; index 1 would be 60px, etc.). All markers sit on one horizontal line.
- **`offset` is hardcoded to 0** (line 91). The commented `i % 2 === 0 ? 0 : 15` is a leftover from an earlier "alternating rows" design — **per-item vertical staggering is disabled**. This is the origin of the "rows" concept: rows were originally explicit alternating offsets, but are now implicit (see 1d).

The background rect is placed at the same y, `height: 10`, `width: coreWidth` (lines 81–84):
```ts
81:    bg.attr("x", 0)
82:      .attr("width", this.ctrlr.dimensions.coreWidth)
83:      .attr("y", this.ctrlr.dimensions.svgHeight + 30 * (index + 1))
84:      .attr("height", 10);
```

### 1c. HTML label creation (lines 139–157)
```ts
139:    const items = this.ctrlr.svg.layers.data.selectAll(
140:      "g.timeline_" + index.toString() + " text.label",
141:    );
142:
143:    this.htmlDiv.innerHTML = "";
144:
145:    items.each((d, i) => {
146:      if (d !== undefined) {
147:        const div = document.createElement("div");
148:        div.classList.add("html_label");
149:        div.setAttribute("data_label", slugify(d.html));
150:        div.innerHTML = d.html;
151:        div.style.left =
152:          this.ctrlr.scales.x1.fn(new Date(d.date)) +
153:          this.ctrlr.config.innerPadding.left +
154:          "px";
155:        this.html.htmlDiv.appendChild(div);
156:      }
157:    });
```
Each label's **x** = `x1(date) + innerPadding.left` (the innerPadding.left is added because the SVG content is offset by it inside the padded SVG). **No `top` is set yet** — all labels initially stack at the the top of the relative container.

### 1d. The "rows" / collision pass (lines 178–226) — the core algorithm
```ts
178:    const div = [].slice.call(
179:      this.ctrlr.element.querySelectorAll("div.html_label"),
180:    );
181:    const trim = ( (s)) => parseFloat(s.replace("px", ""));
182:    let staggerTop = 0;
183:
184:    divs.reverse().forEach((d, i) => {
187:      if (i < ) {
188:         d.style.top = 0;
189:      } else {
190:         const prevEl: HTMLElement[] = [];
191:         for (let j = 1; j < divs.length - 1; j++) {
192::           if (divs[i - j] !== undefined) {
193:             prevEls.push(divs[i - j]);
194:           }
195:         }
196:
197:         prevEls.forEach((el) =>
198:           el.setAttribute(
199::             " "distance",
200:             (trim(el.style.left) - trim(d.style.left)).toString(),
201:           ),
202:         );
203:
204:         const collusions = prevEls.filter((el) => {
205:           const distance = el.getAttribute("distance");
206:           if (distance !== null) {
207::             return parseFloat(distance) < d.offsetWidth - 60;
208:           }
209:         });
210:
211::         coll.sort((a, b) => {
212:           return trim(b.style.top) - trim(a.style.top);
213:         });
214:
215:         if (collusions.length > 0) {
216:           const o = coll
217::             .map((el) => el.offsetHeight)
218:             .reduce((acc, height) => => acc + height + 3, 0);
219::           if (o > timeLineHeight) timeLineHeight = o;
220:           d.style.top = o.toString() + "px";
221:         } else {
222:           d.style.top = 0;
223:           staggerTop = 0;
224::         }
225::       }
226:    });
```
Mechanics:
- `divs.reverse()` → processes **rightmost label first** (labels are in ascending date order, so reverse = most recent first).
- The rightmost label is unconditionally placed at `top: 0` (lines 187–188) — it's the "top row".
- For every subsequent (more-leftward) label, it gathers **all** previously-placed (more-rightward) labels (`prevEls`), computes `distance = prevLeft − thisLeft` (positive when prev is to the right), and flags a **collision** when `distance < d.offsetWidth − 60` (line 207). The `60` is a magic horizontal tolerance; the test uses **only the current label's width** and ignores the previous label's actual right edge (`prevLeft + prevWidth`).
- If any collisions: the new label's `top` = **sum of `offsetHeight + 3` of every colliding label** (lines 216–218). The `sort` at 211–213 is effectively dead — the reduce sums all heights regardless of order.
- If no collisions: `top: 0`.

**What "rows" means here**: there is no explicit row data structure. A "row" is an implicit vertical stack level created greedily by the collision pass — each colliding label is pushed below the entire stack of labels it overlaps. `timeLineHeight` (line 219) tracks the maximum stack height.

**Bugs / gaps in the collision logic**:
- **Off-by-one in the inner loop bound** (line 191: `j < divs.length - 1`): for the leftmost label (`i = divs.length − 1`), `divs[i-j]` ranges over indices `divs.length−2 … 1`, so **`divs[0]` (the rightmost label) is never checked as a collision source against the leftmost label**. The rightmost label is invisible to collision detection for the last label processed.
- **Asymmetric collision test**: uses `d.offsetWidth − 60` only; a very wide previous label can overlap the current label without being detected (if `prevLeft − thisLeft ≥ thisWidth − 60`), and conversely two narrow labels far apart can be flagged if `thisWidth` is large.
- **`staggerTop` is dead** (declared line 182, written line 223, never read) — leftover from the disabled row-stagger design.
- **Collision is one-directional** (only vs. more-rightward labels). It never re-checks whether the new `top` collides with *other rows* or with labels to the left — pure greedy stacking, no global overlap resolution.

---

## 2. Exact height attribution (lines 75–246)

There are **two independent height mechanisms**, and one of them is broken:

### 2a. `timeLineHeight` (lines 75, 219, 246) — the one that actually works
```ts
75:    let timeLineHeight = 0;
...
219:          if (o > timeLineHeight) timeLineHeight = o;
...
246:    return timeLineHeight;
```
It accumulates the max collision-stack height (`o`) and is returned to the controller, which sets `graphEl.style.paddingBottom = (30 + timeLineHeight) + "px"` (`bar-trend-v1.ts:234`). **Critical limitation**: it only counts labels that *collided*. A tall non-colliding label (e.g., one that wraps to 3 lines at `top: 0`) contributes **0** to `timeLineHeight`, so the container only gets 30px of padding for it — insufficient. Note `bar-trend-stacked-makeup-v2.ts:185` even guards `if (timeLineHeight === 0 …)`.

### 2b. `highest` / element-height block (lines 228–244) — broken in real browsers
```ts
228:    const arrows = this.ctrlr.svg.layers.data.selectAll("rect.arrow");
229:
230:    let highest = 0;
231:
232:    arrows.attr("height", (d: any, i: number) => {
233:      const div = this.ctrlr.element.querySelector(
234:        `[data_label="${slugify(d.html)}"`,
235:      );
236:      highest = trim(div.style.top) > highest ? trim(div.style.top) : highest;
237:      return 16 + trim(div.style.top);
238:    });
239:
240:    // height op svg zetten .. niet parent el
241:    this.ctrlr.element.style.height =
242:      (trim(this.ctrlr.element.style.height) + highest + 16).toString() + "px";
243:    this.htmlDiv.style.height = (highest + 16).toString() + "px";
244:    this.htmlDiv.style.top = "-36px"; // changed after adding more padding
```
- **Line 234 is an invalid CSS selector — missing the closing `]`** (`[data_label="…"` instead of `[data_label="…"]`). In standards-compliant browsers `querySelector` throws a `SyntaxError` DOMException for this. (Verified: jsdom's engine is lenient and even matches, so it's masked in tests, but Chrome/Firefox/Safari throw.) Because `arrows.attr("height", fn)` invokes `fn` for every arrow, **this throws on the first arrow whenever any timeline item exists**, aborting `redraw` at line 232 — so lines 240–244 (element height, htmlDiv height, htmlDiv `top:-36px`) are **effectively dead code in production**. There is no try/catch in the controller (`bar-trend-v1.ts:223`), so the rejection propagates into the controller's async `redraw`.
- **Duplicate `data_label`**: `data_label` is keyed on `slugify(d.html)`, and "Zeerijp" appears twice in `timeline.ts` (lines 36 & 101) → two labels share slug `zeerijp`. `querySelector` returns the **first** match, so the second arrow reads the wrong div's `top` (even after the `]` fix).
- **`trim` of an unset inline height → NaN**: `trim(this.ctrlr.element.style.height)` (line 242) reads the inline height of `ctrlr.element` (the `.scrolltainer`), which is **not set inline** (only `graphEl` gets an inline height in `bar-trend-v1.html()`). If it ever runs, `trim("") = NaN` → `"NaNpx"`.
- **Monotonic growth, never shrinks**: line 241–242 *adds* `highest + 16` to the existing height on every redraw. If a later redraw has fewer/shorter labels, the height stays inflated.
- **Hardcoded constants** scattered throughout: `30` (band), `60` (tolerance), `16` (arrow/label padding), `3` (inter-label gap), `36` (htmlDiv top offset), `10` (bg height), `5` (circle radius).
- **Measure-before-layout / font fragility**: `offsetWidth`/`offsetHeight` are read synchronously right after `innerHTML` is set (lines 145–157 → 204–218). The browser is forced into a synchronous reflow to satisfy each read (correct values, but costly), and if the webfont ("Sora") hasn't finished loading at first paint, widths/heights are wrong and the stacking is computed against fallback-font metrics.

---

## 3. Right-side handling (very recent labels)

**There is none.** Findings:

- Labels are placed purely by `left = x1(date) + innerPadding.left` (lines 151–154). The rightmost label sits near `coreWidth + innerPadding.left`; with `max-width: 200px` its right edge can extend **beyond the container's right edge**. There is no clamp, no flip-to-left, no test against `element.clientWidth`/`scrollWidth`.
- The collision pass (lines 184–226) only detects **label-vs-label** overlap; it never checks **label-vs-container-edge**. The rightmost label is always placed at `top: 0` (line 187–188) regardless of how far it overhangs the right edge.
- The container has `overflowX: auto` (`bar-trend-v1.html()`), so on small screens the graph scrolls horizontally and the rightmost label is only reachable by scrolling; on wide screens it can be clipped by the container edge or overlap the axis/legend area. There is no logic to shift the last label left, shorten it, or move it to the left side of its marker.
- Because the rightmost label is processed first and never collides with anything to its right, it's always on the top row — correct in spirit, but it's also the one most likely to overflow the right edge.

---

## 4. Efficiency concerns

1. **O(n²) collision pass** (lines 184–226): for each of `n` labels, an inner loop iterates over up to `n−1` previous labels. For the current dataset (≤14 items) this is trivial, but it's quadratic and would degrade with longer timelines.
2. **Forced reflows**: `d.offsetWidth` (line 207) and `d.offsetHeight` (line 217) are read inside the loop, forcing a synchronous layout per label. Combined with `innerHTML = ""` + `appendChild` (lines 143–155), there are multiple layout invalidations per redraw.
3. **Redundant DOM writes**: the `distance` attribute is written to the *same* previous elements over and over (lines 197–202) — each element's `distance` is overwritten once per later label. All of this could be computed in memory.
4. **Redundant re-querying**: the code builds the divs (lines 145–157), then re-queries the DOM with `querySelectorAll("div.html_label")` (lines 178–179) instead of reusing the created array; then does one `querySelector` per arrow (lines 232–238).
5. **Dead code / cruft**: hidden SVG `<text class="label">` (lines 64–71), `staggerTop` (182/223), the commented-out tooltip handlers (159–176), and the unused `colours`/`breakpoints` import (line 1).
6. **Whole-redraw rebuild**: every redraw clears and recreates all label divs (`innerHTML = ""`, line 143) rather than keyed joins.

---

## 5. Improvement opportunities (mapped to the three goals)

### ( (a)) Efficient label placement
| # | Change | Effffort | Impact |
|---|--------|--------|--------|
| A1 | Replace the O(n²) inner loop with a **single left-to-right sweep** using pre-measured widths: keep a running "occupied rows" list (per-row right-edge), place each label in the first row it fits, and only compare against the current row frontier. | M | High |
| A2 | **Measure once, cache**: read `offsetWidth`/`offsetHeight` in one batch (or use `ResizeObserver`), store in a map, drop the per-iteration `offsetWidth` reads and the `distance` attribute writes. | M | Medium |
| A3 | Fix the off-by-one loop bound (line 191) so the rightmost label is included in collision checks. | S | Medium |
| A4 | Use a proper keyed join (by `date`) instead of `innerHTML=""` + full rebuild. | S | Low |

### ( (b)) Right-side handling for very recent labels
| # | Change | Effffort | Impact |
|---|--------|--------|--------|
| B1 | **Clamp/flip right-edge labels**: if `left + labelWidth > containerWidth`, shift the label left (or render it to the left of its marker). Measure against `element.clientWidth`/`scrollWidth`. | S–M | High |
| B2 | Include the **previous label's right edge** (`prevLeft + prevWidth`) in the collision test instead of only `this.offsetWidth − 60`. | S | Medium |
| B3 | Treat the rightmost label's width specially when choosing its row (currently always `top: 0`), so it doesn't overhang the container. | S | Medium |

### (c) Sufficient height attribution
| # | Change | Effort | Impact |
|---|--------|--------|--------|
| C1 | **Fix the invalid selector** at line 234 (add the missing `]`) — this restores the `highest` / element-height / `htmlDiv top:-36px` logic that is currently dead in browsers. | S | High |
| C2 | Key `data_label` on a **unique id** (e.g., `date`) instead of `slugify(d.html)` to avoid the duplicate "Zeerijp" collision. | S | Medium |
| C3 | Include **all** labels (not just collided ones) in the height attribution — e.g., `timeLineHeight` should also account for tall `top:0` labels, or the controller should use `max(highest, timeLineHeight)`. | S | Medium |
| C4 | Replace the **monotonic** `style.height = current + highest + 16` growth with an explicit recompute (and guard `trim()` against empty/`NaN`). | S | Medium |
| C5 | Centralize the magic constants (30/60/16/3/36/10/5) into a named config. | S | Low |

**Recommended priority**: C1 first (it's a latent runtime bug that kills the entire height block and can reject the controller's redraw), then B1 + A1 (the two user-facing goals), then the smaller correctness fixes (A3, B2, C2, C3).

---

*No files were modified — this is a read-only investigation.*
