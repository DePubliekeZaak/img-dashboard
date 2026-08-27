// @vitest-environment jsdom
//
// REGRESSION TEST for the timeline label horizontal-overflow bug.
//
// User symptom (uncommitted edits in the main checkout, NOT applied here):
//   with long labels near the right edge of the timeline ("Start Aanvullende
//   vaste vergoeding" @ 2025-10-21, "Start vaste herhaalvergoeding" @
//   2026-04-08, plus new right-edge dates), a label's right edge extends
//   beyond the graph plot area and creates a horizontal scrollbar.
//
// Geometry modelled from the real chart (bar-trend-v1.ts pre()):
//   margin.right = 180, padding.right = 90,
//   innerPadding.left = 50, innerPadding.right = 50
//   -> coreWidth = elementWidth - 370
//   Labels are positioned at left = x1(date) + innerPadding.left, so the
//   rightmost date's label starts exactly at the plot area's right edge
//   (coreWidth + innerPadding.left in element coordinates).
//
// Root cause (H1): redraw() clamped labels against the full element width
// (htmlDiv.clientWidth), but the visible graph space is the plot area, which
// ends at coreWidth + innerPadding.left — ~320px narrower than the element.
// A label clamped to the element width can therefore extend past the plot
// area (and past the visible element -> horizontal scrollbar).
//
// Goes RED on the old code (labels right edge > plot area right edge),
// GREEN on the fix (clamp target = plot area right edge).
import { describe, it, expect, beforeEach } from "vitest";
import * as d3 from "d3";
import ChartTimeline from "../src/charts/renderers/chart-timeline";

const MARGIN_RIGHT = 180;
const PADDING_RIGHT = 90;
const INNER_PADDING_LEFT = 50;
const INNER_PADDING_RIGHT = 50;
const ELEMENT_WIDTH = 1200; // scrolltainer width (min-width 800, fills page on desktop)
const CORE_WIDTH =
  ELEMENT_WIDTH - MARGIN_RIGHT - PADDING_RIGHT - INNER_PADDING_LEFT - INNER_PADDING_RIGHT;
// The plot area's right edge, in the label coordinate system (htmlDiv at
// element x=0), is coreWidth + innerPadding.left.
const PLOT_AREA_RIGHT_EDGE = CORE_WIDTH + INNER_PADDING_LEFT;

// The user's long label near the right edge.
const LONG_LABEL = "Start Aanvullende vaste vergoeding";

const data = [
  { date: "2019-5-22", label: "Westerwijtwerd", html: "Westerwijtwerd", description: "", category: "beving" },
  { date: "2025-11-13", label: "Zeerijp", html: "Zeerijp", description: "", category: "beving" },
  { date: "2025-10-21", label: LONG_LABEL, html: LONG_LABEL, description: "", category: "regeling" },
  { date: "2026-04-08", label: "Start vaste herhaalvergoeding", html: "Start vaste herhaalvergoeding", description: "", category: "regeling" },
  { date: "2026-3-14", label: "Geelbroek", html: "Geelbroek", description: "", category: "beving" },
  { date: "2026-8-21", label: "Zandeweer", html: "Zandeweer", description: "", category: "beving" },
];

// jsdom reports offsetWidth/offsetHeight = 0 for everything. Simulate real
// text measurement: a label's natural width is proportional to its text
// length, capped at the CSS max-width (200px) like the real stylesheet.
function mockLayout() {
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get() {
      if (this.classList && this.classList.contains("html_label")) {
        const len = (this.textContent ?? "").length;
        return Math.min(200, 8 * len + 16);
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
  // Real page structure: graphEl > scrolltainer (ctrlr.element) > [svg, htmlDiv]
  const graphEl = document.createElement("section");
  graphEl.classList.add("graph-view");
  graphEl.style.paddingRight = MARGIN_RIGHT + "px";
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

describe("timeline label overflow regression (user symptom)", () => {
  beforeEach(() => {
    mockLayout();
    document.body.innerHTML = "";
  });

  it("label right edge must not exceed the plot area right edge (coreWidth)", () => {
    const { chart, scrolltainer } = makeChart();
    chart.draw(data, 0);

    // Simulate real layout: htmlDiv fills the scrolltainer, so clientWidth
    // reports the full element width (jsdom reports 0 for everything).
    const htmlDiv = chart.htmlDiv as HTMLElement;
    Object.defineProperty(htmlDiv, "clientWidth", { configurable: true, value: ELEMENT_WIDTH });

    chart.redraw(data, 0);

    const labelDivs = Array.from(
      scrolltainer.querySelectorAll("div.html_label"),
    ) as HTMLElement[];
    const offenders: { text: string; left: number; right: number }[] = [];
    labelDivs.forEach((div) => {
      const left = parseFloat(div.style.left) || 0;
      const right = left + div.offsetWidth;
      if (right > PLOT_AREA_RIGHT_EDGE) {
        offenders.push({ text: div.textContent ?? "", left, right });
      }
    });

    expect(offenders).toEqual([]);
  });

  it("label right edge must not overflow the element (no horizontal scrollbar)", () => {
    const { chart, scrolltainer } = makeChart();
    chart.draw(data, 0);

    const htmlDiv = chart.htmlDiv as HTMLElement;
    Object.defineProperty(htmlDiv, "clientWidth", { configurable: true, value: ELEMENT_WIDTH });

    chart.redraw(data, 0);

    // The element scrolls (graphEl has overflowX: auto); a label whose right
    // edge exceeds the element's clientWidth creates a horizontal scrollbar.
    const labelDivs = Array.from(
      scrolltainer.querySelectorAll("div.html_label"),
    ) as HTMLElement[];
    const overflowers: { text: string; left: number; right: number }[] = [];
    labelDivs.forEach((div) => {
      const left = parseFloat(div.style.left) || 0;
      const right = left + div.offsetWidth;
      if (right > ELEMENT_WIDTH) {
        overflowers.push({ text: div.textContent ?? "", left, right });
      }
    });

    expect(overflowers).toEqual([]);
  });
});
