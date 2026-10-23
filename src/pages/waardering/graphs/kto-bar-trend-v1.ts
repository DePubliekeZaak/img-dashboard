import { BarTrendV1 } from "../../../charts/controllers/bar-trend-v1";
import type { KeyValue } from "../../../charts/core/types";
import type { IParameterMapping } from "../../../shared/interfaces";
import type { DataObject } from "../../../shared/types";
import type { TrendBar } from "../../../shared/types_graphs";
import { resolveKtoColumn } from "./kto-ratings-v1";

// BarTrendV1 variant shared by the domein- and regeling-comparison groups
// (config graphs domein_trend + regeling_trend, one controller for both).
// Three things differ from the base class:
//
// 1. Column resolution — BarTrendV1 builds bars from `param.column` verbatim,
//    so a fysiek_- or mw_-authored trend never follows the group selector.
//    Here each parameter column is resolved against the graph segment's
//    `domein` or `regeling` via the shared resolveKtoColumn() (the same
//    mechanism KTORatingsV1 uses), so the trend follows the group-level
//    domeinSelect / regelingSelect.
//
// 2. Data source — BarTrendV1.selectDataSource only uses graphDataMonth when
//    the group has exactly two endpoints; a comparison group has more
//    (6 domeinen x week/maand, 10 regelingen x week/maand), so the base class
//    would fall back to graphDataWeek, whose rows are limit=1 — useless for
//    a trend. This variant reads the merged graphDataMonth for monthly plots.
//
// 3. Rendering — compact 280px chart (base class is 380/400px) with the
//    bottom margin removed (the HTML timeline labels still expand padding via
//    the inherited redraw()) and the .scrolltainer min-width removed, so no
//    forced 800px scroll container => no horizontal scrollbar.
//
// BarTrendV1.selectDataSource / createBars are private, so this subclass
// re-implements the two tiny helpers under its own names. Bars are stored
// under the authored column key, which keeps BarTrendV1.draw()/redraw()
// (resolveActiveColumn on the segment key) working unchanged.
export class KtoBarTrendV1 extends BarTrendV1 {
  // Compact rendering for the comparison trends: a 280px chart instead of the
  // base class's 380/400px. No bottom margin — the SVG timeline band is
  // dropped entirely (the HTML timeline labels still expand padding below the
  // svg via the inherited redraw() paddingBottom).
  pre() {
    super.pre();
    this.config.graphHeight = 280;
    this.config.margin = { ...this.config.margin, bottom: 0 };
    // this.config.padding = { ...this.config.padding, bottom: 0 };
  }

  // BarTrendV1.html() builds a .scrolltainer with the global min-width: 800px,
  // which forces a horizontal scrollbar once the chart is narrower than 800px.
  // These compact trends are meant to fill their container, so drop it.
  html() {
    super.html();
    if (this.scrollingContainer !== null) {
      this.scrollingContainer.style.minWidth = "0";
    }
  }

  private sourceFor(data: DataObject): KeyValue[] {
    return this.segment?.periodization === "weekly"
      ? data.graphDataWeek
      : data.graphDataMonth;
  }

  prepareData(data: DataObject): DataObject {
    const sourceData = this.sourceFor(data);
    const periodKey =
      this.segment?.periodization === "weekly" ? "_yearweek" : "_yearmonth";

    for (const param of this.parameters.flat()) {
      const col = resolveKtoColumn(param.column, this.segment);
      data[param.column] = this.buildBars(param, sourceData, periodKey, col);
    }

    return data;
  }

  private buildBars(
    param: IParameterMapping,
    data: KeyValue[],
    periodKey: string,
    col: string,
  ): TrendBar[] {
    return data.map((period) => ({
      label: param.label ?? "",
      name: "main",
      date: period[periodKey]?.toString() ?? "",
      colour: param.colour ?? "orange",
      meta: period,
      value: period[col] == null ? 0 : parseFloat(period[col].toString()),
      format: param.format,
    }));
  }
}
