import { breakpoints } from "../../img-modules/styleguide";

// Centralized layout constants (C5).
export const LABEL_CONFIG = {
  bandOffset: 30, // vertical band offset per timeline index
  arrowPad: 16, // arrow height / label padding
  rowGap: 3, // gap between label rows
  htmlDivTop: -36, // htmlDiv top offset
  bgHeight: 10,
  circleRadius: 5,
} as const;

export interface LabelLayoutInput {
  left: number; // raw left edge (x1(date) + innerPadding.left)
  width: number; // measured offsetWidth
  height: number; // measured offsetHeight
}

export interface LabelPlacement {
  left: number; // final (clamped) left edge
  top: number; // row top
  row: number; // row index
}

export interface LabelLayoutResult {
  placements: LabelPlacement[];
  totalHeight: number; // max(top + height) over all labels, rows included
}

// Single left-to-right sweep (A1). Each label is clamped to the right-edge
// clamp target (B1/B3), then placed in the first row whose occupied right edge
// is left of it (B2) — a row frontier per row, no O(n^2) pass.
//
// Two phases: Phase 1 assigns rows and grows the per-row heights; Phase 2
// runs after all row heights are finalized, so tops and totalHeight are
// computed from final heights (no stale-top overlap, no height undercount).
//
// Note: when clampWidth <= 0, clamping (B1) is disabled (cw = Infinity)
// and labels keep their raw left — the caller should fall back to a real
// width measurement before calling this if clamping must apply.
//
// clampWidth should be the right edge of the VISIBLE graph space (the plot
// area), not the full chart element width — see ChartTimeline.redraw().
export function layoutLabels(
  labels: LabelLayoutInput[],
  clampWidth: number,
  config: { rowGap: number },
): LabelLayoutResult {
  const rows: { right: number; height: number }[] = [];
  const placements: LabelPlacement[] = [];
  const cw = clampWidth > 0 ? clampWidth : Infinity;

  // Phase 1: assign each label to the first row it fits; update the row
  // frontier (right edge) and the row's max height. Tops are NOT fixed here.
  for (const label of labels) {
    // Size each label to its REAL rendered width — never hard-cap it with an
    // arbitrary constant (e.g. the old 200px maxWidth). The only width cap is
    // the container itself, so left + width can never exceed cw. If a single
    // label is wider than the container, width is capped at cw and left is
    // clamped to the container's left edge, so it degrades without overflow.
    const width = Math.min(label.width, cw);
    const left = Math.max(0, Math.min(label.left, cw - width));
    const right = left + width;

    // right >= row.right always holds here (left >= frontier, width >= 0),
    // so assigning rows[row].right = right only ever extends the frontier.
    let row = rows.findIndex((r) => r.right <= left);
    if (row === -1) {
      row = rows.length;
      rows.push({ right, height: label.height });
    } else {
      rows[row].right = right;
      rows[row].height = Math.max(rows[row].height, label.height);
    }
    placements.push({ left, top: 0, row });
  }

  // Phase 2: row heights are finalized — compute each label's top from the
  // rows above it, and totalHeight from the final tops.
  let totalHeight = 0;
  for (let i = 0; i < placements.length; i++) {
    const p = placements[i];
    let top = 0;
    for (let r = 0; r < p.row; r++) {
      top += rows[r].height + config.rowGap;
    }
    p.top = top;
    totalHeight = Math.max(totalHeight, top + labels[i].height);
  }

  return { placements, totalHeight };
}

function trim(value: string | null | undefined): number {
  if (value == null) return 0;
  const n = parseFloat(String(value).replace("px", ""));
  return Number.isNaN(n) ? 0 : n;
}

export default class ChartTimeline {
  htmlDiv;

  constructor(private ctrlr) {
    this.html();
  }

  html() {
    this.htmlDiv = document.createElement("div");
    this.htmlDiv.classList.add("timeline_html_div");
    this.ctrlr.element.appendChild(this.htmlDiv);
  }

  draw(data: any[], index: number) {
    if (data.length === 0) return;

    this.ctrlr.svg.layers.data
      .selectAll("g.timeline_" + index.toString())
      .remove();

    const group = this.ctrlr.svg.layers.data
      .append("g")
      .attr("class", "timeline_" + index.toString());

    group
      .append("rect")
      .attr("class", "timeline_bg" + index.toString())
      .style("fill", "#eee");

    const groups = group
      .selectAll("g.timeline_item")
      .data(data)
      .join("g")
      .attr("class", "timeline_item");

    groups
      .append("circle")
      .filter((d) => d.category !== "beving")
      .attr("r", LABEL_CONFIG.circleRadius)
      .attr("cy", 5)
      .attr("stroke", "#eee")
      .attr("fill", "white");

    groups
      .append("svg:image")
      .filter((d) => d.category === "beving")
      .attr("xlink:href", "https://graphs.publikaan.nl/graphs/icons/beving.svg")
      .attr("width", 24)
      .attr("height", 24)
      .attr("x", -10)
      .attr("y", -5);

    groups
      .append("rect")
      .attr("class", "arrow")
      .attr("width", 1)
      .attr("fill", "#eee")
      .attr("x", -0.5)
      .attr("y", 10);
  }

  redraw(data: any[], index: number) {
    const bg = this.ctrlr.svg.layers.data.select(
      "rect.timeline_bg" + index.toString(),
    );

    bg.attr("x", 0)
      .attr("width", this.ctrlr.dimensions.coreWidth)
      .attr(
        "y",
        this.ctrlr.dimensions.svgHeight + LABEL_CONFIG.bandOffset * (index + 1),
      )
      .attr("height", LABEL_CONFIG.bgHeight);

    const groups = this.ctrlr.svg.layers.data.selectAll(
      "g.timeline_" + index.toString() + " g.timeline_item",
    );

    groups.attr("transform", (d, i) => {
      const offset = 0; /// i % 2 === 0 ? 0 : 15;

      const x = this.ctrlr.scales.x1.fn(new Date(d.date));
      const y =
        this.ctrlr.dimensions.svgHeight +
        LABEL_CONFIG.bandOffset * (index + 1) +
        offset;

      return "translate(" + x + "," + y + ")";
    });

    const tooltip = function popup(d) {
      return `
                    <div>${d.date}</div>
                    <b>${d.label}</b>
                    <div>${d.description}</div>
              `;
    };

    groups
      .on("mouseover", (event: any, d: any) => {
        const t = window.d3
          .select(".tooltip")
          .html(tooltip(d))
          .style("top", event.pageY - 0 + "px");

        if (event.pageX <= window.innerWidth / 2) {
          t.style("left", event.pageX - 0 + "px").style("right", "auto");
        } else {
          let w =
            this.ctrlr.element === null ||
            this.ctrlr.element.parentElement === null
              ? window.innerWidth
              : this.ctrlr.element.parentElement.getBoundingClientRect().width;
          if (window.innerWidth > breakpoints.md) w = window.innerWidth;
          t.style("right", w - event.pageX + 0 + "px").style("left", "auto");
        }

        t.transition().duration(250).style("opacity", 1);
      })
      .on("mouseout", (d) => {
        window.d3
          .select(".tooltip")
          .transition()
          .duration(250)
          .style("opacity", 0);
      });

    // Build label divs, keyed on the unique date (C2) instead of slugify(d.html).
    this.htmlDiv.innerHTML = "";
    const divs: HTMLElement[] = [];

    groups.each((d, i) => {
      if (d !== undefined) {
        const div = document.createElement("div");
        div.classList.add("html_label");
        div.setAttribute("data_label", d.date);
        div.innerHTML = d.html;
        div.style.left =
          this.ctrlr.scales.x1.fn(new Date(d.date)) +
          this.ctrlr.config.innerPadding.left +
          "px";
        this.htmlDiv.appendChild(div);
        divs.push(div);
      }
    });

    // Batch-measure widths/heights once (A2) — no per-iteration offsetWidth reads.
    const measured: LabelLayoutInput[] = divs.map((div) => ({
      left: trim(div.style.left),
      width: div.offsetWidth,
      height: div.offsetHeight,
    }));

    let containerWidth =
      this.htmlDiv.clientWidth || this.ctrlr.element.clientWidth || 0;
    if (containerWidth <= 0) {
      containerWidth =
        this.ctrlr.element.scrollWidth ||
        this.ctrlr.element.getBoundingClientRect().width ||
        0;
    }

    // Clamp against the graph plot area, not the full element width: the plot
    // area (markers/band) ends at coreWidth + innerPadding.left, which is
    // narrower than the element by the right margin/padding. Clamping to the
    // element width lets a long label near the rightmost date extend past the
    // graph space (and past the visible element -> horizontal scrollbar).
    // Only when coreWidth is actually measured (> 0); otherwise keep the
    // element-width clamp as a fallback.
    if (this.ctrlr.dimensions.coreWidth > 0 && containerWidth > 0) {
      const plotRight =
        this.ctrlr.dimensions.coreWidth +
        (this.ctrlr.config.innerPadding?.left ?? 0);
      containerWidth = Math.min(containerWidth, plotRight);
    }

    const layout = layoutLabels(measured, containerWidth, LABEL_CONFIG);

    divs.forEach((div, i) => {
      const p = layout.placements[i];
      div.style.left = p.left + "px";
      div.style.top = p.top + "px";
    });

    const timeLineHeight = layout.totalHeight;

    const arrows = this.ctrlr.svg.layers.data.selectAll("rect.arrow");

    arrows.attr("height", (d: any) => {
      const div = this.ctrlr.element.querySelector(
        `[data_label="${d.date}"]`,
      );
      const top = div !== null ? trim(div.style.top) : 0;
      return LABEL_CONFIG.arrowPad + top;
    });

    // height op svg zetten .. niet parent el
    // Explicit recompute (C4): no monotonic growth, guarded against NaN.
    this.htmlDiv.style.height = timeLineHeight + "px";
    this.htmlDiv.style.top = LABEL_CONFIG.htmlDivTop + "px";
    this.ctrlr.element.style.height =
      this.ctrlr.dimensions.svgHeight + timeLineHeight + "px";

    return timeLineHeight;
  }
}
