import { breakpoints } from "../../../img-modules/styleguide";
import { DataObject, Segment } from "../types";
import { core, elements } from "../../../charts";
import { GroupObject, IParameterMapping } from "../interfaces";
import { IPageController } from "../page.controller";
import { createBars } from "../data.format.factory";
import { TrendBar } from "../types_graphs";
import { trimStart } from "../factories/trend";
import { parseSegment } from "../factories/segment";

export class BarTrendKTOV1 extends core.GraphControllerV3 {
  scrollingContainer;
  chartBarTrend;
  legend;
  arrowX;
  arrowY;

  constructor(
    public slug: string,
    public page: IPageController,
    public group: GroupObject,
    public data: DataObject,
    public parameters: IParameterMapping[][],
    public modifiers: IParameterMapping[][],
    public filters: string[],
    public segment: Segment,
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
      segment,
      index,
    );

    if (this.page.segment) {
      this.segment = parseSegment(this.page, this.group.slug, this.slug);
    }

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

    if (this.graphEl != null) {
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
    if (this.scrollingContainer != null)
      await super._svg(this.scrollingContainer);

    this.chartBarTrend = new elements.ChartBarTrend(this);
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
        data[p.column] = createBars(
          p.column,
          p,
          data.graphDataMonth,
          this.segment,
        ); // .filter(b => b.value > 0)
      }
    }

    return data;
  }

  async draw(data: DataObject) {
    this.chartBarTrend.draw(data[this.segment.key]);
  }

  async redraw(data: any) {
    this.scales.x.set(data[this.segment.key].map((d) => d.date));
    this.scales.y.set(
      data[this.segment.key]
        .map((d) => (d.value < 0 ? 0 : d.value))
        .concat([0, 10]),
    );

    await super.redraw(data[this.segment.key]);

    this.chartBarTrend.redraw(
      data[this.segment.key],
      this.parameters[1][0].column,
    );

    if (window.innerWidth < breakpoints.md) {
      if (this.graphEl != null) {
        this.graphEl.scrollLeft +=
          this.graphEl.scrollWidth - this.graphEl.clientWidth;
      }
    }
  }

  async update(data: DataObject, update: boolean, range?: number[]) {
    await super._update(data, update, range);
  }
}
