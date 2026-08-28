// @vitest-environment jsdom
//
// REGRESSION TEST for the timeline label REAL-WIDTH overflow bug.
//
// Symptom (tech-lead verified): the label "Start Aanvullende vaste
// vergoeding" (a beving/regeling timeline label) still overflows the plot
// area and creates a horizontal scrollbar even after the PR#7 coreWidth
// clamp is active. The PR#7 clamp correctly moved the label left, but the
// visible text still spills past.
//
// Root cause: layoutLabels() computes `width = Math.min(label.width,
// config.maxWidth, cw)` with LABEL_CONFIG.maxWidth = 200, AND the stylesheet
// has `.html_label { max-width: 200px }`. The label's real rendered width is
// ~238px (title case, 0.85rem), so the layout fits a 200px box while the text
// is really ~288px wide. The clamp only guarantees left + 200 <= plotRight;
// the actual (uncapped) label box is wider, so its right edge still exceeds
// the plot area -> overflow persists.
//
// This test reproduces that exact symptom with an uncapped real width:
//   * mockLayout returns the label's NATURAL text width (no 200px cap), like
//     a real browser without the CSS max-width.
//   * A long label sits at the rightmost date so the clamp must fire.
//
// Goes RED on the pre-fix code (layout assumes a 200px box, but offsetWidth
// reports the real ~288px width -> right edge > plot area right edge), and
// GREEN after the fix (layout sizes to the real width, then clamps so
// left + realWidth <= plot area right edge).
import { describe, it, expect, beforeEach } from "vitest";
import * as d3 from "d3";
import ChartTimeline, {
  layoutLabels,
  LABEL_CONFIG,
} from "../src/charts/renderers/chart-timeline";

const MARGIN_RIGHT = 180;
const PADDING_RIGHT = 90;
const INNER_PADDING_LEFT = 50;
const INNER_PADDING_RIGHT = 50;
const ELEMENT_WIDTH = 1200;
const CORE_WIDTH =
  ELEMENT_WIDTH - MARGIN_RIGHT - PADDING_RIGHT - INNER_PADDING_LEFT - INNER_PADDING_RIGHT;
const PLOT_AREA_RIGHT_EDGE = CORE_WIDTH + INNER_PADDING_LEFT;

const LONG_LABEL = "Start Aanvullende vaste vergoeding";
// 34 chars * 8 + 16 padding = 288px natural width (> 200, > the old cap).
const LONG_LABEL_WIDTH = LONG_LABEL.length * 8 + 16;

const data = [
  { date: "2019-5-22", label: "Westerwijtwerd", html: "Westerwijtwerd", description: "", category: "beving" },
  // Rightmost date in the domain -> x1(date) == CORE_WIDTH, so the raw left
  // edges sits exactly at the plot area's right edge and the clamp must fire.
  { date: "2026-08-21", label: LONG_LABEL, html: LONG_LABEL, description: "", category: "regeling" },
];

// Real text measurement: a label's natural width is its text length (NOT
// capped at 200px, matching the real stylesheet once the 200px max-width is
// removed). The long label here reports ~288px.
function mockLayout() {
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get() {
      if (this.classList && this.classList.contains("html_label")) {
        const len = (this.textContent ?? "").length;
        return 8 * len + 16;
      }
      return 0;
    },
  });
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get() {
      return this.classList && this.classList.contains("html_label") ? 20 : 0;
    },
  });
}

function makeChart() {
  const graphEl = document.createElement("section");
  graphEl.classList.add("graph-view");
  graphEl.style.overflowX = "auto";
  document.body.appendChild(graphEl);

  const scrolltainer = document.createElement("section");
  scrolltainer.classList.add("scrolltainer");
  scrolltainer.style.width = ELEMENT_WIDTH + "px";
  graphEl.appendChild(scrolltainer);

  const svg = d3.select(scrolltainer).append("svg");
  const dataLayer = svg
    .append("g")
    .attr("class", "data")
    .attr("transform", `translate(${INNER_PADDING_LEFT},0)`);

  const x1 = d3
    .scaleTime()
    .domain([new Date("2019-05-22"), new Date("2026-08-21")])
    .range([0, CORE_WIDTH]);

  const ctrlr: any = {
    element: scrolltainer,
    svg: { layers: { data: dataLayer } },
    dimensions: { coreWidth: CORE_WIDTH, svgHeight: 300 },
    scales: { x1: { fn: (d: Date) => x1(d) } },
    config: { innerPadding: { left: INNER_PADDING_LEFT } },
  };
  const chart = new ChartTimeline(ctrlr);
  return { chart, ctrlr, graphEl, scrolltainer, x1 };
}

const cfg = { rowGap: LABEL_CONFIG.rowGap };

describe("timeline label real-width regression (user symptom, >200px label)", () => {
  beforeEach(() => {
    mockLayout();
    document.body.innerHTML = "";
  });

  it("a right-edge label wider than 200px must not exceed the plot area right edge", () => {
    expect(LONG_LABEL_WIDTH).toBeGreaterThan(200); // sanity: this is the >200px case
    const { chart, scrolltainer } = makeChart();
    chart.draw(data, 0);

    const htmlDiv = chart.htmlDiv as HTMLElement;
    Object.defineProperty(htmlDiv, "clientWidth", { configurable: true, value: ELEMENT_WIDTH });

    chart.redraw(data, 0);

    const labelDivs = Array.from(
      scrolltainer.querySelectorAll("div.html_label"),
    ) as HTMLElement[];
    const offenders: { text: string; left: number; right: number }[] = [];
    labelDivs.forEach((div) => {
      const left = parseFloat(div.style.left) || 0;
      const right = left + div.offsetWidth; // real rendered width
      if (right > PLOT_AREA_RIGHT_EDGE) {
        offenders.push({ text: div.textContent ?? "", left, right });
      }
    });

    expect(offenders).toEqual([]);
  });
});

describe("layoutLabels degrade-wider-than-container", () => {
  it("a label wider than the container clamps to the container left edge without NaN/infinity or overflow", () => {
    const labels = [{ left: 700, width: 1500, height: 24 }]; // real width > container (800)
    const r = layoutLabels(labels, 800, cfg);
    const p = r.placements[0];
    expect(Number.isFinite(p.left)).toBe(true);
    expect(Number.isFinite(p.top)).toBe(true);
    expect(Number.isFinite(r.totalHeight)).toBe(true);
    expect(p.row).toBe(0);
    // Layout caps the width at the container and clamps to the container's
    // left edge (0), so the laid-out box never exceeds the container.
    expect(p.left).toBe(0);
    expect(p.left).toBeGreaterThanOrEqual(0);
    // 800 (container) - 800 (capped width) = 0 -> laid-out right edge == container.
    expect(r.totalHeight).toBe(24);
  });

  it("clamps the rightmost real-width label so left + realWidth does not exceed the container", () => {
    // Real width 288 in an 800 container starting at 650 -> clamps left to 512
    // so 512 + 288 == 800 (no arbitrary 200px cap).
    const labels = [{ left: 650, width: 288, height: 20 }];
    const r = layoutLabels(labels, 800, cfg);
    const p = r.placements[0];
    expect(p.left).toBe(512);
    expect(p.left + 288).toBe(800);
  });
});
