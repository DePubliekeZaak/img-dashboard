import { describe, it, expect } from "vitest";
import {
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

  it("clamps width to the CSS max-width", () => {
    const labels = [{ left: 0, width: 500, height: 20 }];
    const r = layoutLabels(labels, 800, cfg);
    expect(r.placements[0].left).toBe(0);
  });
});
