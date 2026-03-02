import { core, elements } from "../../../charts";
import type { KeyValue } from "../../../charts/core/types";
import { breakpoints } from "../../../img-modules/styleguide";
import { parseSegment } from "../../shared/factories/segment";
import { trimStart } from "../../shared/factories/trend";
import type { GroupObject, IParameterMapping } from "../../shared/interfaces";
import type { IPageController } from "../../shared/page.controller";
import type { DataObject } from "../../shared/types";
import type { TrendBar } from "../../shared/types_graphs";

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
    public segment: any,
    public index: number,
    public pageSegment: any,
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
    this.config.graphHeight = window.innerWidth > breakpoints.sm ? 360 : 400; //  this.index < 1 ? 420 : 210;

    const marginForTimeline = 180;
    const paddingForTimeline = 60;
    const paddingForAxis = 50;
    // const filters = (this.filters.length > 0) ? window.innerWidth < breakpoints.sm ? 60 : 100 : 0;

    this._addMargin(0, marginForTimeline, 0, 0);
    this._addPadding(0, paddingForTimeline, paddingForAxis, paddingForAxis);

    this._addScale("x", "band", "horizontal-reverse", "label");
    this._addScale("x1", "time", "horizontal", "date");
    this._addScale("y", "linear", "vertical", "value");
    this._addAxis("x", "x", "bottom", "quarters");
    this._addAxis("y", "y", "left");
    this._addAxis("y2", "y", "right");
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
      this.graphEl.style.marginBottom = "2rem";
      this.graphEl.style.whiteSpace = "nowrap";
    }

    // if group has more then one graph scrollcontainer should get position relative

    this.scrollingContainer = document.createElement("section");
    this.scrollingContainer.classList.add("scrolltainer");
    if (this.filters.length > 0) this.graphEl.classList.add("has-filters");
    this.graphEl.appendChild(this.scrollingContainer);

    // if (window.innerWidth > breakpoints.sm && this.graphEl.parentElement && this.mapping[2]) {
    //     let radiobuttons = new HtmlRadio(this, this.mapping[2],this.graphEl.parentElement);
    // }
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

    this.chartBar = new elements.ChartBarTrendV2(this);
    await this.update(this.group.data, false);

    return;
  }

  prepareData(data: DataObject): DataObject {
    let _data =
      data.graphData_alt !== undefined &&
      this.group.config.endpoints!.length === 2
        ? this.group.config.endpoints![1] !== undefined &&
          this.segment.periodization === "monthly"
          ? data.graphData_alt
          : data.graphData
        : data.graphData;

    const _period =
      this.segment.periodization === "weekly" ? "_yearweek" : "_yearmonth";

    _data = trimStart(_data, this.parameters, 2);

    const createBars = (
      prop: string,
      param: IParameterMapping,
      data: KeyValue[],
    ) => {
      const bs: TrendBar[] = [];

      for (const period of data) {
        // console.log(data);
        // console.log("param",param);

        if (this.parameters[1]) {
          const no_respondents = parseInt(
            period[this.parameters[1][0].column].toString(),
          );

          bs.push({
            label: param?.label || "",
            name: "main",
            date: period[_period].toString(),
            colour: param !== undefined ? param.colour : "orange",
            meta: period,
            value:
              period[prop] === null || no_respondents < 5
                ? 0
                : parseFloat(period[prop].toString()),
            format: no_respondents.toString() + " respondenten",
          });
        } else {
          bs.push({
            label: param?.label || "",
            name: "main",
            date: period[_period].toString(),
            colour: param !== undefined ? param.colour : "orange",
            meta: period,
            value:
              period[prop] === null ? 0 : parseFloat(period[prop].toString()),
          });
        }
      }

      return bs;
    };

    // types voor line en bar samenvoegen -- alles time based / trend
    const bars: { [key: string]: TrendBar[] } = {};

    for (const p of this.parameters[0]) {
      // for (const p of pg) {
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
      //}
    }

    return data;
  }

  async draw(data: DataObject) {
    this.chartBar.draw(data[this.segment.key]);
    this.timeline_1?.draw(data.timeline, 0);
  }

  async redraw(data: any) {
    this.scales.x.set(data[this.segment.key].map((d) => d.date));
    this.scales.x1.set(
      data[this.segment.key]
        .map((d) => d.meta._startdatum)
        .filter((d) => d !== null),
    );
    this.scales.y.set(
      data[this.segment.key]
        .map((d) => (d.value > 0 ? d.value : 0))
        .concat([0]),
    );

    await super.redraw(data[this.segment.key]);
    this.chartBar.redraw(data[this.segment.key], this.segment.periodization);
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
