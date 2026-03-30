import { core, elements } from "../../../charts";
import type { KeyValue } from "../../../charts/core/types";
import { breakpoints } from "../../../img-modules/styleguide";
import type { GroupObject, IParameterMapping } from "../interfaces";
import type { IPageController } from "../page.controller";
import { type DataObject, Segment } from "../types";
import type { TrendBar } from "../types_graphs";
import {
  getGraphSegment,
  getActiveColumn,
} from "../../../stores/segment.store";
import { resolveActiveColumn } from "../factories/segment";

export class BarTrendV1 extends core.GraphControllerV3 {
  scrollingContainer;
  chartAxis;
  chartBar;
  finalRevenueLine;
  zeroLine;

  bars = {};
  timeline_1;
  timeline_2;
  entity_svgs = {};
  ctrlrs: any = {};

  // yScale;
  // xScale;
  bottomAxis;
  leftAxis;

  legend;

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
    this.config.graphHeight = window.innerWidth > breakpoints.sm ? 380 : 400; //  this.index < 1 ? 420 : 210;

    const marginForTimeline = 180;
    const paddingForTimeline = 90;
    const paddingForAxis = 50;
    // const filters = (this.filters.length > 0) ? window.innerWidth < breakpoints.sm ? 60 : 100 : 0;

    this._addMargin(0, marginForTimeline, 0, 0);
    this._addPadding(10, paddingForTimeline, 0, 0);
    this._addInnerPadding(0, 0, paddingForAxis, paddingForAxis);

    this._addScale("x", "band", "horizontal-reverse", "label");
    this._addScale("x1", "time", "horizontal", "date");
    this._addScale("y", "linear", "vertical", "value");
    this._addAxis("x", "x", "bottom", "quarters");
    this._addAxis("y", "y", "left");

    const yFormat =
      this.parameters[0][0].format !== undefined
        ? this.parameters[0][0].format
        : "linear";
    this._addAxis("y2", "y", "right", yFormat);
  }

  html() {
    if (this.group.element === null) return;

    this.graphEl = super._html();

    if (this.graphEl !== null) {
      this.graphEl.style.height =
        window.innerWidth < breakpoints.sm
          ? this.config.graphHeight?.toString() + "px"
          : this.config.graphHeight?.toString() + "px";
      this.graphEl.style.overflowX = "auto";
      this.graphEl.style.overflowY = "hidden";
      this.graphEl.style.marginBottom = "2rem";
      this.graphEl.style.whiteSpace = "nowrap";
    }

    // if group has more then one graph scrollcontainer should get position relative

    this.scrollingContainer = document.createElement("section");
    this.scrollingContainer.classList.add("scrolltainer");
    if (this.filters.length > 0) this.graphEl.classList.add("has-filters");
    this.graphEl.appendChild(this.scrollingContainer);

    const h = this.group.graphs[this.index].header;
    if (h !== undefined) {
      const div = document.createElement("div");
      div.innerHTML = h + ":";
      div.style.width = "100%";
      div.style.margin = "1.5rem 0";
      this.graphEl.parentNode?.insertBefore(div, this.graphEl);
    }
  }

  async init() {
    this.config.paddingInner = 0;
    this.config.paddingOuter = 0;

    await super._init();
    if (this.scrollingContainer !== null)
      await super._svg(this.scrollingContainer);

    // if (window.innerWidth > breakpoints.sm) {
    this.timeline_1 = new elements.ChartTimeline(this);
    // }

    this.chartBar = new elements.ChartBarTrend(this);
    await this.update(this.group.data, false);

    return;
  }

  prepareData(data: DataObject): DataObject {

    const sourceData = this.selectDataSource(data);
    const periodKey = this.segment?.periodization === "weekly" 
      ? "_yearweek" 
      : "_yearmonth";

    for (const param of this.parameters.flat()) {
      // Create bars for each variant defined in param.modifiers
      if (param.modifiers) {
        for (const [variantKey, suffix] of Object.entries(param.modifiers)) {
          const col = param.column + suffix;
          data[col] = this.createBars(param, sourceData, periodKey, col);
        }
      } else {
        // No modifiers — just use base column
        data[param.column] = this.createBars(param, sourceData, periodKey);
      }
    }

    return data;
  }

  private selectDataSource(data: DataObject): KeyValue[] {
    const wantsMonthly = this.segment?.periodization === "monthly";
    const hasMonthlyData = data.graphDataMonth !== undefined;
    const hasMonthlyEndpoint = this.group.config.endpoints?.length === 2;

    if (wantsMonthly && hasMonthlyData && hasMonthlyEndpoint) {
      return data.graphDataMonth;
    }
    return data.graphDataWeek;
  }

  private createBars(
    param: IParameterMapping,
    data: KeyValue[],
    periodKey: string,
    columnOverride?: string
  ): TrendBar[] {
    const col = columnOverride ?? param.column;
    
    return data.map(period => ({
      label: param.label ?? "",
      name: "main",
      date: period[periodKey].toString(),
      colour: param.colour ?? "orange",
      meta: period,
      value: period[col] == null ? 0 : parseFloat(period[col].toString()),
      format: param.format,
    }));
  }

  async draw(data: DataObject) {

    const column = resolveActiveColumn(this.segment!, this.group.graphParams!, this.parameters[0][0].column);
  
    this.chartBar.draw(data[column]);

    this.timeline_1?.draw(data.timeline, 0);
  }

  async redraw(data: any) {
    const column = resolveActiveColumn(this.segment!, this.group.graphParams!, this.parameters[0][0].column);
    const periodization = this.segment?.periodization || "weekly";

    this.scales.x.set(data[column].map((d: any) => d.date));
    this.scales.x1.set(
      data[column]
        .map((d: any) => d.meta._startdatum)
        .filter((d: any) => d !== null),
    );
    this.scales.y.set(
      data[column]
        .map((d: any) => (d.value > 0 ? d.value : 0))
        .concat([0]),
    );

    if (periodization === "weekly") {
      const w = data.graphDataWeek.length * 8;
      this.dimensions.graphWidth = w + 100;
      this.dimensions.svgWidth = w + 100;
      this.dimensions.coreWidth = w;

      await super.redraw(data[column], [], this.dimensions);
    } else {
      await super.redraw(data[column], []);
    }

    this.chartBar.redraw(data[column], periodization);
    const timeLineHeight = this.timeline_1?.redraw(data.timeline, 0);

    if (window.innerWidth < breakpoints.md) {
      if (this.graphEl !== null) {
        this.graphEl.scrollLeft +=
          this.graphEl.scrollWidth - this.graphEl.clientWidth;
      }
    }

    if (this.graphEl !== null) {
      this.graphEl.style.paddingBottom =
        (30 + timeLineHeight).toString() + "px";
    }
  }

  async update(data: DataObject, update: boolean, range?: number[]) {
    await super._update(data, update, range);
  }
}
