import { core, elements } from "../../../charts";
import { AxisArrow } from "../../../charts/elements/axis-arrow";
import { breakpoints } from "../../../img-modules/styleguide";
import { HtmlLegendRowWithLines } from "../html/html-legend-row-with-lines";
import type { GroupObject, IParameterMapping } from "../interfaces";
import type { IPageController } from "../page.controller";
import type { DataObject, Segment } from "../types";
import {
  getGraphSegment,
  getActiveColumn,
} from "../../../stores/segment.store";

interface StackDataItem {
  category: string;
  [key: string]: string | number; // Allow for dynamic numeric properties
}

export class BarTrendStackedMakeup extends core.GraphControllerV3 {
  chartBars: any;
  legend: any;
  arrowY: any;
  scrollingContainer: any;

  constructor(
    public slug: string,
    public page: IPageController,
    public group: GroupObject,
    public data: DataObject,
    public parameters: IParameterMapping[][],
    public modifiers: IParameterMapping[][],
    public filters: string[],
    public index: number,
  ) {
    super(
      slug,
      page,
      group,
      data,
      parameters,
      modifiers,
      filters,
      index,
    );

    this.pre();
  }

  pre() {
    const topMargin = window.innerWidth < breakpoints.sm ? 30 : 0;
    const topPadding =
      window.innerWidth < breakpoints.sm
        ? 40
        : window.innerWidth < breakpoints.lg
          ? 0
          : 75;
    const bottomPadding = window.innerWidth < breakpoints.lg ? 20 : 30;
    const bottom = 0;

    this._addMargin(topMargin, bottom, 0, 0);
    this._addPadding(topPadding, bottomPadding, 50, 20);

    this._addScale("x", "band", "horizontal-reverse", "date");
    this._addScale("y", "linear", "vertical", "value");
    this._addScale("y2", "linear", "vertical", "value");
    this._addAxis("x", "x", "bottom", "quarters");
    this._addAxis("y", "y", "left");
    this._addAxis("y2", "y", "right");
  }

  html() {
    this.config.graphHeight = window.innerWidth < breakpoints.lg ? 280 : 420;

    if (this.group.element === null) return;

    this.graphEl = super._html();

    if (this.graphEl !== null) {
      //   this.graphEl.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight.toString() + "px" : graphHeight.toString() + "px";
      this.graphEl.style.overflowX = "auto";
      this.graphEl.style.marginBottom =
        window.innerWidth < breakpoints.sm ? "0" : "2rem";
      this.graphEl.style.paddingRight = "50px";
      this.graphEl.style.paddingTop =
        window.innerWidth < breakpoints.lg ? "20px" : "40px";
    }

    this.scrollingContainer = document.createElement("section");
    this.scrollingContainer.classList.add("graph-container-12");
    this.scrollingContainer.classList.add("graph-view");
    this.scrollingContainer.style.height = "100%";
    this.scrollingContainer.style.minWidth =
      window.innerWidth < breakpoints.lg ? "540px" : "800px";
    this.graphEl.appendChild(this.scrollingContainer);

    const h = this.group.graphs[this.index].header;
    if (h !== undefined) {
      const div = document.createElement("div");
      div.innerHTML = h + ":";
      div.style.width = "100%";
      div.style.margin = "1.5rem 0";
      this.graphEl.parentNode?.insertBefore(div, this.graphEl);
    }

    this.legend = new HtmlLegendRowWithLines(this);
  }

  async init() {
    this.config.paddingInner = 0;
    this.config.paddingOuter = 0;

    await super._init();
    if (this.graphEl !== null) await super._svg(this.scrollingContainer);

    this.chartBars = new elements.ChartStackedBarsV2(this);

    if (this.segment!.label !== undefined && this.segment!.label !== "") {
      this.arrowY = new AxisArrow(this, "y2", this.segment!.label);
    }

    await this.update(this.group.data, false);

    return;
  }

  prepareData(data: DataObject): DataObject {
    const segment = this.segment;
    if (!segment) return data;

    const _data =
      data.graphDataMonth !== undefined &&
      this.group.config.endpoints!.length > 1
        ? this.group.config.endpoints![1] !== undefined &&
          segment.periodization === "monthly"
          ? data.graphDataMonth
          : data.graphDataWeek
        : data.graphDataWeek;

    const _period = segment.periodization === "weekly" ? "_yearweek" : "_yearmonth";

    for (const m of _data) {
      m.date = m[_period];
    }

    const index = this.parameters.findIndex(
      (group) => group[0].column.includes(segment.baseKey!)
    );
    const ps = this.parameters[Math.max(0, index)];
    const isCumulative = segment.cumulative;
    const stack = window.d3
      .stack<StackDataItem>()
      .keys(
        ps.map((p) => {
          const entry = this.group.graphParams![p.column];
          return isCumulative
            ? (entry?.variants?.cumul?.column)
            : (entry?.variants?.delta?.column);
        }),
      );

    if (!this.segment!.normalized) {
      data.stacked = stack(_data as StackDataItem[]);
    } else {
      const normalized_data: any[] = [];

      for (const d of _data) {
        const newItem = { ...d };

        let total = 0;
        for (const p of Object.values(ps)) {
          total = total + d[p.column];
        }

        for (const p of Object.values(ps)) {
          newItem[p.column] = d[p.column] / total;
        }
        normalized_data.push(newItem);
      }

      data.stacked = stack(normalized_data);
    }

    return data;
  }

  async draw(data: DataObject) {
    this.chartBars.draw(data);
    this.legend.draw("top", this.parameters);
  }

  async redraw(data: any, range: number[]) {

    const segment = this.segment;
    if (!segment) return;

    this.scales.x.set(data.stacked[0].map((d: any) => d.data.date));
    this.scales.y.set(
      data.stacked[data.stacked.length - 1]
        .map((d: any) => (d[1] < 0 ? 0 : d[1]))
        .concat([0]),
    );
    this.scales.y2.set(
      data.stacked[data.stacked.length - 1]
        .map((d: any) => (d[1] < 0 ? 0 : d[1]))
        .concat([0]),
    );
    await super.redraw(data.stacked);

    if (segment.periodization === "weekly") {
      const w = data.graphDataWeek.length * 8;
      this.dimensions.graphWidth = w + 100; // 2 * paddingForAxis;  ????
      this.dimensions.svgWidth = w + 100;
      this.dimensions.coreWidth = w;

      await super.redraw(data.stacked, [], this.dimensions);
    } else {
      await super.redraw(data.stacked, []);
    }

    this.chartBars.redraw(data, segment);
    if (this.arrowY !== undefined) {
      await this.arrowY.redraw();
    }

    if (window.innerWidth < breakpoints.md) {
      if (this.graphEl !== null) {
        this.graphEl.scrollLeft +=
          this.graphEl.scrollWidth - this.graphEl.clientWidth;
      }
    }
  }

  async update(data: DataObject, update: boolean, range?: number[]) {
    await super._update(data, update, range);
  }
}
