// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import * as d3 from "d3";
import ChartTimeline, {
  layoutLabels,
  LABEL_CONFIG,
} from "../src/charts/renderers/chart-timeline";

const cfg = { rowGap: LABEL_CONFIG.rowGap, maxWidth: LABEL_CONFIG.maxWidth };

describe("layoutLabels (timeline label placement)", () => {
  it("keeps non-overlapping labels in the first row", () => {
    const labels = [
      { left: 0, width: 100, height: 20 },
      { left: 150, width: 100, height: 20 },
    ];
    const r = layoutLabels(labels, 800, cfg);
    expect(r.placements[0].row).toBe(0);
    expect(r.placements[1].row).toBe(0);
    expect(r.placements[1].left).toBe(150);
    expect(r.totalHeight).toBe(20);
  });

  it("stacks overlapping labels into successive rows (first row it fits)", () => {
    const labels = [
      { left: 0, width: 100, height: 20 },
      { left: 80, width: 100, height: 30 }, // overlaps row 0 -> row 1
      { left: 200, width: 100, height: 20 }, // fits row 0 again
    ];
    const r = layoutLabels(labels, 800, cfg);
    expect(r.placements[0].row).toBe(0);
    expect(r.placements[1].row).toBe(1);
    expect(r.placements[1].top).toBe(20 + cfg.rowGap);
    expect(r.placements[2].row).toBe(0);
    expect(r.totalHeight).toBe(20 + cfg.rowGap + 30);
  });

  it("row-growth: upper row grows after a lower-row label is placed -> no overlap, correct totalHeight", () => {
    const labels = [
      { left: 0, width: 100, height: 20 }, // row 0
      { left: 80, width: 100, height: 30 }, // row 1
      { left: 110, width: 100, height: 40 }, // row 0, taller
    ];
    const r = layoutLabels(labels, 800, cfg);

    // No overlap: a label in a lower row must sit below the grown row above.
    expect(r.placements[1].row).toBe(1);
    expect(r.placements[1].top).toBe(40 + cfg.rowGap); // pushed below grown row 0
    expect(r.placements[1].top).toBeGreaterThanOrEqual(
      r.placements[2].top + labels[2].height,
    );
    expect(r.totalHeight).toBe(73); // true stack height
  });

  it("clamps right-edge labels so left + width never overflows (B1)", () => {
    const labels = [{ left: 750, width: 100, height: 20 }];
    const r = layoutLabels(labels, 800, cfg);
    expect(r.placements[0].left).toBe(700);
    expect(r.placements[0].left + 100).toBeLessThanOrEqual(800);
  });

  it("accounts for the clamped rightmost label's width when choosing its row (B3)", () => {
    const labels = [
      { left: 650, width: 100, height: 20 }, // right edge 750
      { left: 720, width: 100, height: 20 }, // clamped to 700 -> overlaps row 0 -> row 1
    ];
    const r = layoutLabels(labels, 800, cfg);
    expect(r.placements[1].left).toBe(700);
    expect(r.placements[1].row).toBe(1);
  });

  it("counts tall top:0 labels in the total height (C3)", () => {
    const labels = [{ left: 0, width: 100, height: 60 }];
    const r = layoutLabels(labels, 800, cfg);
    expect(r.totalHeight).toBe(60);
  });

  it("clamps width to the CSS max-width and uses it for the left clamp", () => {
    // width 500 > maxWidth 200 -> width clamped to 200, so left is clamped
    // to 800 - 200 = 600 instead of overflowing.
    const labels = [{ left: 650, width: 500, height: 20 }];
    const r = layoutLabels(labels, 800, cfg);
    expect(r.placements[0].left).toBe(600);
    expect(r.placements[0].left + 200).toBeLessThanOrEqual(800);
  });

  it("empty input -> 0 placements, totalHeight 0", () => {
    const r = layoutLabels([], 800, cfg);
    expect(r.placements).toHaveLength(0);
    expect(r.totalHeight).toBe(0);
  });

  it("containerWidth 0 -> no crash, clamping disabled (left preserved)", () => {
    const labels = [{ left: 900, width: 100, height: 20 }];
    const r = layoutLabels(labels, 0, cfg);
    expect(r.placements[0].left).toBe(900); // B1 disabled, documented
    expect(r.totalHeight).toBe(20);
  });

  it("label wider than container -> left + width <= containerWidth after clamp", () => {
    const labels = [{ left: 50, width: 200, height: 20 }];
    const r = layoutLabels(labels, 100, cfg);
    expect(r.placements[0].left).toBe(0);
    expect(r.placements[0].left + 100).toBeLessThanOrEqual(100);
  });
});

describe("ChartTimeline redraw (DOM)", () => {
  function makeChart() {
    const element = document.createElement("div");
    element.style.width = "800px";
    document.body.appendChild(element);
    const svg = d3.select(element).append("svg");
    const dataLayer = svg.append("g");
    const ctrlr: any = {
      element,
      svg: { layers: { data: dataLayer } },
      dimensions: { coreWidth: 800, svgHeight: 300 },
      scales: { x1: { fn: (d: Date) => d.getTime() } },
      config: { innerPadding: { left: 0 } },
    };
    const chart = new ChartTimeline(ctrlr);
    return { chart, ctrlr, element };
  }

  const data = [
    {
      date: "2025-11-13",
      label: "Zeerijp",
      html: "Zeerijp",
      description: "",
      category: "beving",
    },
    {
      date: "2025-11-14",
      label: "Zeerijp",
      html: "Zeerijp",
      description: "",
      category: "beving",
    },
  ];

  it("C1: redraw runs without throwing and arrow heights are set via the fixed selector", () => {
    const { chart, ctrlr } = makeChart();
    chart.draw(data, 0);
    expect(() => chart.redraw(data, 0)).not.toThrow();
    const arrows = ctrlr.svg.layers.data.selectAll("rect.arrow");
    expect(arrows.size()).toBe(2);
    arrows.each(function () {
      const h = parseFloat(d3.select(this).attr("height"));
      expect(h).toBeGreaterThanOrEqual(16);
    });
  });

  it("C2: label divs are keyed on the unique date", () => {
    const { chart, ctrlr } = makeChart();
    chart.draw(data, 0);
    chart.redraw(data, 0);
    const labels = ctrlr.element.querySelectorAll("div.html_label");
    expect(labels.length).toBe(2);
    expect(labels[0].getAttribute("data_label")).toBe("2025-11-13");
    expect(labels[1].getAttribute("data_label")).toBe("2025-11-14");
  });
});
