import { core, elements } from "../index";
import { breakpoints } from "../../img-modules/styleguide";
import { createBars, createBarsForKTO } from "../../shared/data.format.factory";
import { parseSegment } from "../../shared/factories/segment";
import { trimStart } from "../../shared/factories/trend";
import type { GroupObject, IParameterMapping } from "../../shared/interfaces";
import type { IPageController } from "../../shared/page.controller";
import type { DataObject, Segment } from "../../shared/types";
import type { TrendBar } from "../../shared/types_graphs";

export class BarTrendKTOV1 extends core.GraphControllerV3 {
  scrollingContainer!: any;
  chartBarTrend!: any;
  legend!: any;
  arrowX!: any;
  arrowY!: any;

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
    this.config.graphHeight = window.innerWidth < breakpoints.sm ? 320 : 240;

    const topMargin = window.innerWidth < breakpoints.sm ? 30 : 10;
    const bottom = 0;

    this._addMargin(topMargin, 0, 0, 0);
    this._addPadding(10, 30, 20, 20);

    this._addScale("x", "band", "horizontal-reverse", "date");
    this._addScale("y", "linear", "vertical", "value");
    this._addAxis("x", "x", "bottom", "quarters");
    this._addAxis("y", "y", "left");
    this._addAxis("y2", "y", "right");
  }

  html() {
    this.graphEl = super._html();
    this.graphEl.classList.remove("graph-container-12");
    this.graphEl.classList.add("graph-container-8");

    if (this.graphEl !== null) {
      this.graphEl.style.overflowX = "auto";
      this.graphEl.style.marginBottom =
        window.innerWidth < breakpoints.lg ? "0" : "2rem";
    }

    this.scrollingContainer = document.createElement("section");
    this.scrollingContainer.classList.add("graph-container-8");
    this.scrollingContainer.classList.add("scrolltainer");
    this.scrollingContainer.style.height = "100%";
    this.scrollingContainer.style.minWidth =
      window.innerWidth < breakpoints.md ? "420px" : "100%";

    if (this.filters.length > 0) this.graphEl.style.paddingTop = "3rem";

    this.graphEl.appendChild(this.scrollingContainer);
  }

  async init() {
    this.config.paddingInner = 0;
    this.config.paddingOuter = 0;

    await super._init();
    if (this.scrollingContainer !== null)
      await super._svg(this.scrollingContainer);

    this.chartBarTrend = new elements.ChartBarTrendKTOV1(this);
    await this.update(this.group.data, false);

    return;
  }

  prepareData(data: DataObject): DataObject {
    data.graphDataWeek = trimStart(data.graphDataWeek, this.parameters, 2);
    data.graphDataMonth = trimStart(data.graphDataMonth, this.parameters, 2);

    const bars: { [key: string]: TrendBar[] } = {};

    const newArray: any[] = [];

    for (const pg of this.parameters) {
      for (const p of pg) {
        data[p.column] = createBarsForKTO(
          p.column,
          p,
          data.graphDataMonth,
          this.segment!,
        ); // .filter(b => b.value > 0)
      }
    }

    return data;
  }

  async draw(data: DataObject) {
    if (!this.segment) return;
    this.chartBarTrend.draw(data[this.segment.key]);
  }

  async redraw(data: any) {
    if (!this.segment) return;
    this.scales.x.set(data[this.segment.key].map((d: any) => d.date));
    this.scales.y.set(
      data[this.segment.key]
        .map((d: any) => (d.value < 0 ? 0 : d.value))
        .concat([0, 10]),
    );

    await super.redraw(data[this.segment.key]);

    this.chartBarTrend.redraw(
      data[this.segment.key],
      this.parameters[1][0].column,
    );

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
