import { breakpoints } from "../../../img-modules/styleguide";
import { DataObject, Segment } from "../types";
import { core, elements } from "../../../charts";
import { GroupObject, IParameterMapping } from "../interfaces";
import { IPageController } from "../page.controller";
import { createBars } from "../data.format.factory";
import { TrendBar } from "../types_graphs";
import { trimStart } from "../factories/trend";
import { parseSegment } from "../factories/segment";

export class BarTrendBedragenV1 extends core.GraphControllerV3 {
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
      // hier check cumulative and apply modifiers 
    }

    this.pre();
  }

  pre() {
    this.config.graphHeight = window.innerWidth < breakpoints.sm ? 320 : 240;

    const top = window.innerWidth < breakpoints.sm ? 30 : 10;
    const bottom = 0;

    this._addMargin(top, 0, 0, 0);
    this._addPadding(10, 30, 60, 60);

    this._addScale("x", "band", "horizontal-reverse", "date");
    this._addScale("y", "linear", "vertical", "value");
    this._addAxis("x", "x", "bottom", "month");
    this._addAxis("y", "y", "left","millions");
    this._addAxis("y2", "y", "right","millions");
  }

  html() {
    this.graphEl = super._html();
    this.graphEl.classList.remove("graph-container-12");
    this.graphEl.classList.add("graph-container-8");

    if (this.graphEl != null) {
      this.graphEl.style.overflowX = "auto";
      this.graphEl.style.marginBottom =
        window.innerWidth < breakpoints.sm ? "0" : "2rem";
    }

    this.scrollingContainer = document.createElement("section");
    this.scrollingContainer.classList.add("graph-container-8");
    this.scrollingContainer.classList.add("scrolltainer");
    this.scrollingContainer.style.height = "100%";
    this.scrollingContainer.style.minWidth =
      window.innerWidth < breakpoints.md ? "600px" : "100%";

    if (this.filters.length > 0) this.graphEl.style.paddingTop = "3rem";

    this.graphEl.appendChild(this.scrollingContainer);

    const sibling = this.graphEl.parentElement?.querySelector("section:first-of-type") as HTMLElement;
    sibling?.classList.remove("graph-container-3");
    sibling?.classList.add("graph-container-4");
    if (sibling) sibling.style.alignSelf = "center"; 

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

    if(this.modifiers.length > 0 && this.parameters[0].length < 2) {
      const copy = JSON.parse(JSON.stringify(this.parameters[0][0]));
      copy.column = copy.column + "_cumulatief"
      this.parameters[0].push(copy)
    }

    for (const pg of this.parameters) {
      for (const p of pg) {

        const bars: TrendBar[] = [];

        const periodKey = this.segment.periodization == "monthly" ? "_yearmonth" : "_yearweek";
        const _data = this.segment.periodization == "monthly" ? data.graphDataMonth : data.graphDataWeek
        // const column = this.segment.cumulative ? p.column + "_cumulatief" : p.column;

        for (let period of _data) {

          bars.push({
            label: p?.label || "",
            name: "main",
            date: period[periodKey].toString(),
            colour: p != undefined ? p.colour : "orange",
            meta: period,
            value: period[p.column] == null ? 0 : parseFloat(period[p.column].toString()),
            format: p?.format || undefined,
          });
        }

        data[p.column] = bars;
      }
    }

    return data;
  }

  async draw(data: DataObject) {

    const _d = data[this.segment.key];
  
    this.chartBarTrend.draw(_d);
  }

  async redraw(data: any) {

    const _d = data[this.segment.key];

    this.scales.x.set(_d.map((d) => d.date));
    this.scales.y.set(
      _d
        .map((d) => (d.value < 0 ? 0 : d.value))
        .concat([0, 10]),
    );

    await super.redraw(_d);

    this.chartBarTrend.redraw(
      _d   
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
