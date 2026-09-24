import { core, elements } from "../index";
import type { KeyValue } from "../core/types";
import { breakpoints } from "../../img-modules/styleguide";
import { getGroupSegment } from "../../stores/segment.store";
import type { GroupObject, IParameterMapping } from "../../shared/interfaces";
import type { IPageController } from "../../shared/page.controller";
import type { DataObject, Segment } from "../../shared/types";

export class SegmentsV1 extends core.GraphControllerV3 {
  scrollingContainer: any;
  chartAxis: any;
  chartBar: any;
  finalRevenueLine: any;
  zeroLine: any;

  bars = {};
  timeline_1: any;
  timeline_2: any;
  entity_svgs = {};
  ctrlrs: any = {};
  bottomAxis: any;
  leftAxis: any;

  legend: any;

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
    this.config.graphHeight = window.innerWidth > breakpoints.sm ? 320 : 320; //  this.index < 1 ? 420 : 210;
    const paddingForAxis = 2;

    this._addMargin(0, 0, 0, 0);
    this._addPadding(30, 30, paddingForAxis, paddingForAxis);

    this._addScale("x", "band", "horizontal", "label");
    this._addScale("y", "linear", "vertical", "value");
    this._addAxis("x", "x", "bottom", "");

  }

  html() {
    if (this.group.element === null) return;

    this.graphEl = super._html();

    if (this.graphEl !== null) {
      this.graphEl.style.height =
        window.innerWidth < breakpoints.sm
          ? (this.config.graphHeight! + (4 * 18)).toString() + "px"
          : (this.config.graphHeight! + (4 * 18)).toString() + "px";
      this.graphEl.style.overflowX = "auto";
      this.graphEl.style.marginBottom = "2rem";
      this.graphEl.style.whiteSpace = "nowrap";
    }

    this.scrollingContainer = document.createElement("section");
    this.scrollingContainer.style.height = '100%';
    // this.scrollingContainer.classList.add("scrolltainer");
    if (this.filters.length > 0) this.graphEl.classList.add("has-filters");
    this.graphEl.appendChild(this.scrollingContainer);
  }

  async init() {
    this.config.paddingInner = 0.2;
    this.config.paddingOuter = 0;

    await super._init();
    if (this.scrollingContainer !== null)
      await super._svg(this.scrollingContainer);

    this.chartBar = new elements.ChartBandBar(this);
    await this.update(this.group.data, false);

    return;
  }

  prepareData(data: DataObject): DataObject {

    const segment = getGroupSegment(this.group.slug)

    const _data =
      segment!.periodization === "monthly"
        ? data.graphDataMonth
        : data.graphDataWeek;

    const createBar = (
      prop: string,
      param: IParameterMapping,
      data: KeyValue[],
    ) => {

      const entry = this.group.graphParams![prop];
      const variant = this.segment?.cumulative
        ? entry?.variants?.cumul
        : entry?.variants?.delta;
      const column = variant?.column ?? entry?.base?.column ?? prop;

      const rawVal = data?.[0]?.[column];
      if (rawVal === undefined) {
        console.warn(`SegmentsV1[${this.slug}]: column "${column}" not in data row`, {
          dataKeys: data?.[0] ? Object.keys(data[0]) : 'no rows',
          graphParams: this.group.graphParams,
        });
      }

      return {
        label: ( param?.short != undefined && window.innerWidth < breakpoints.sm ) ? param.short : param?.label || "",
        name: "_" + column,
        colour: param !== undefined ? param.colour : "orange",
        // meta: data,
        value: rawVal !== undefined ? parseFloat(rawVal.toString()) : 0,
      };
    };

    // types voor line en bar samenvoegen -- alles time based / trend
    data.bars = [];

    for (const pg of this.parameters) {
      for (const p of pg) {
        data.bars.push(createBar(p.column, p, _data));
      }
    }

    return data;
  }

  async draw(data: DataObject) {
    this.chartBar.draw(data.bars);
  }

  async redraw(data: any) {
    this.scales.x.set(data.bars.map((d: any) => d.label));
    this.scales.y.set(
      data.bars.map((d: any) => (d.value > 0 ? d.value : 0)).concat([0]),
    );

    await super.redraw(data);
    this.chartBar.redraw(data.bars, this.segment!.periodization);

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
