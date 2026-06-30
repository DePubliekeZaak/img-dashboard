import { core, elements } from "../index";
import { breakpoints } from "../../img-modules/styleguide";
import { trimStart } from "../../shared/factories/trend";
import type { GroupObject, IParameterMapping } from "../../shared/interfaces";
import type { IPageController } from "../../shared/page.controller";
import type { DataObject, Segment } from "../../shared/types";
import type { TrendBar } from "../../shared/types_graphs";
import {
  getGraphSegment,
  getActiveColumn,
} from "../../stores/segment.store";

export class BarTrendBedragenV1 extends core.GraphControllerV3 {
  scrollingContainer!: HTMLElement;
  chartBarTrend: any;
  legend: any;
  arrowX: any;
  arrowY: any;

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
    this.config.graphHeight = window.innerWidth < breakpoints.sm ? 320 : 260;

    const top = window.innerWidth < breakpoints.sm ? 30 : 10;
    const bottom = 0;

    this._addMargin(top, 0, 0, 0);
    this._addPadding(30, 30, 60, 60);

    this._addScale("x", "band", "horizontal-reverse", "date");
    this._addScale("y", "linear", "vertical", "value");
    this._addAxis("x", "x", "bottom", "month");
    this._addAxis("y", "y", "left", "millions");
    this._addAxis("y2", "y", "right", "millions");
  }

  html() {
    this.graphEl = super._html();
    this.graphEl.classList.remove("graph-container-12");
    this.graphEl.classList.add("graph-container-8");

    if (this.graphEl !== null) {
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

    const sibling = this.graphEl.parentElement?.querySelector(
      "section:first-of-type",
    ) as HTMLElement;
    sibling?.classList.remove("graph-container-3");
    sibling?.classList.add("graph-container-4");
    if (sibling) sibling.style.alignSelf = "center";
  }

  async init() {
    this.config.paddingInner = 0;
    this.config.paddingOuter = 0;

    await super._init();
    if (this.scrollingContainer !== null)
      await super._svg(this.scrollingContainer);

    this.chartBarTrend = new elements.ChartBarTrend(this);
    await this.update(this.group.data, false);

    return;
  }

  prepareData(data: DataObject): DataObject {

    // console.log(data)

    // only months

    // should be 12 months only 

    data.graphDataWeek = trimStart(data.graphDataWeek, this.parameters, 2);
    data.graphDataMonth = trimStart(data.graphDataMonth, this.parameters, 2);

    data.graphDataMonth = data.graphDataMonth.slice(0,12);

    const periodKey = this.segment!.periodization === "monthly" ? "_yearmonth" : "_yearweek";
    const _data = this.segment!.periodization === "monthly"
      ? data.graphDataMonth
      : data.graphDataWeek;

    // // Iterate over all variants in graphParams
    for (const entry of Object.values(this.group.graphParams!)) {
      for (const variant of Object.values(entry.variants)) {
        const bars: TrendBar[] = [];

        for (const period of _data) {

          bars.push({
            label: variant.label || "",
            name: "main",
            date: period[periodKey].toString(),
            colour: variant.colour || "orange",
            meta: period,
            value: period[variant.column] === null || period[variant.column] === undefined
              ? 0
              : parseFloat(period[variant.column].toString()),
            format: variant.format || undefined,
          });
        }

        data[variant.column] = bars;
      }
    }

    return data;
  }

  segmentKeyToColumn() {

    const entry = this.group.graphParams![this.parameters[0][0].column];
    const variant = this.segment!.cumulative ? entry?.variants.cumul : entry?.variants.delta;
    const column = variant?.column || this.segment!.key;

    return column;
  }

  async draw(data: DataObject) {

    const column = this.segmentKeyToColumn();

    this.chartBarTrend.draw(data[column]);
  }

  async redraw(data: any) {

    const column = this.segmentKeyToColumn();
    const _d = data[column];

    this.scales.x.set(_d.map((d: any) => d.date));
    this.scales.y.set(
      _d.map((d: any) => (d.value < 0 ? 0 : d.value)).concat([0, 10]),
    );

    await super.redraw(_d);

    this.chartBarTrend.redraw(_d, this.segment!.periodization);

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
