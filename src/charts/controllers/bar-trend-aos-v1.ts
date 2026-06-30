import { core, elements } from "../index";
import type { KeyValue } from "../core/types";
import { breakpoints } from "../../img-modules/styleguide";
import { trimStart } from "../../shared/factories/trend";
import type { GroupObject, IParameterMapping } from "../../shared/interfaces";
import type { IPageController } from "../../shared/page.controller";
import { type DataObject, Segment } from "../../shared/types";
import type { TrendBar } from "../../shared/types_graphs";
import {
  getGraphSegment,
  getActiveColumn,
} from "../../stores/segment.store";

export class BarTrendAOSV1 extends core.GraphControllerV3 {
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

    // No more parseSegment here
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

    const periodization = this.segment?.periodization || "weekly";

    let _data =
      data.graphDataMonth !== undefined &&
      this.group.config.endpoints!.length === 2
        ? this.group.config.endpoints![1] !== undefined &&
          periodization === "monthly"
          ? data.graphDataMonth
          : data.graphDataWeek
        : data.graphDataWeek;

    const _period = periodization === "weekly" ? "_yearweek" : "_yearmonth";

    _data = _data.filter(
      (p) => new Date(p._einddatum) > new Date("2021-12-31"),
    );

    const createBars = (
      prop: string,
      param: IParameterMapping,
      data: KeyValue[],
    ) => {
      const bs: TrendBar[] = [];
      ``;

      for (const period of data) {
        bs.push({
          label: param?.label || "",
          name: "main",
          date: period[_period].toString(),
          colour: param !== undefined ? param.colour : "orange",
          meta: period,
          value:
            period[prop] === null ? 0 : parseFloat(period[prop].toString()),
          format: param?.format || undefined,
        });
      }

      return bs;
    };

    
    for (const pg of this.parameters) {
      for (const p of pg) {
        data[p.column] = createBars(p.column, p, _data);
        if (this.modifiers !== undefined) {
          for (const mg of this.modifiers) {
            for (const m of mg) {
              if (m.column !== "{}") {
                const prop = m.column.replace("{}", p.column);
                data[prop] = createBars(prop, p, _data);
              }
            }
          }
        }
      }
    }

    return data;
  }

  async draw(data: DataObject) {
    const key = this.segment?.key || this.parameters[0][0].column;

    this.chartBar.draw(data[key]);
    this.timeline_1?.draw(data.timeline, 0);
  }

  async redraw(data: any) {
    const key = this.segment?.key || this.parameters[0][0].column;
    const periodization = this.segment?.periodization || "weekly";

    this.scales.x.set(data[key].map((d) => d.date));
    this.scales.x1.set(
      data[key]
        .map((d) => d.meta._startdatum)
        .filter((d) => d !== null),
    );
    this.scales.y.set(
      data[key]
        .map((d) => (d.value > 0 ? d.value : 0))
        .concat([0]),
    );

    await super.redraw(data[key], []);

    this.chartBar.redraw(data[key], periodization);
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
