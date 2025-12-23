import { breakpoints } from "../../../img-modules/styleguide";
import { Segment } from "../types";

import { DataObject } from "../types";
import { core, elements } from "../../../charts";
import { GroupObject, IParameterMapping } from "../interfaces";
import { IPageController } from "../page.controller";
import { Bar, TrendBar } from "../types_graphs";
import { KeyValue } from "../../../charts/core/types";
import { trimStart } from "../factories/trend";

export class SegmentsV1 extends core.GraphControllerV3 {
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

  // yScale: any;
  // xScale: any;
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
    this.pre();
  }

  pre() {
    this.config.graphHeight = window.innerWidth > breakpoints.sm ? 320 : 320; //  this.index < 1 ? 420 : 210;

    // const marginForTimeline = 180;
    // const paddingForTimeline = 60;
    const paddingForAxis = 0;
    // const filters = (this.filters.length > 0) ? window.innerWidth < breakpoints.sm ? 60 : 100 : 0;

    this._addMargin(0, 30, 0, 0);
    this._addPadding(90, 30, paddingForAxis, paddingForAxis);

    this._addScale("x", "band", "horizontal", "label");
    this._addScale("y", "linear", "vertical", "value");
    this._addAxis("x", "x", "bottom", "");
    // this._addAxis("y", "y", "left");
    // this._addAxis("y2", "y", "right");
  }

  html() {
    if (this.group.element == null) return;

    this.graphEl = super._html();

    if (this.graphEl != null) {
      this.graphEl.style.height =
        window.innerWidth < breakpoints.sm
          ? this.config.graphHeight?.toString() + "px"
          : this.config.graphHeight?.toString() + "px";
      this.graphEl.style.overflowX = "auto";
      this.graphEl.style.marginBottom = "2rem";
      this.graphEl.style.whiteSpace = "nowrap";
    }

    // if(this.group.graphs[this.index].header != undefined) {
    //     const header = document.createElement('div');
    //     header.classList.add('graph-header');
    //     header.innerText =  this.group.graphs[this.index].header || "";
    //     this.graphEl.appendChild(header);
    // }

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
    this.config.paddingInner = 0.2;
    this.config.paddingOuter = 0.2;

    await super._init();
    if (this.scrollingContainer != null)
      await super._svg(this.scrollingContainer);

    this.chartBar = new elements.ChartBandBar(this);
    await this.update(this.group.data, false);

    return;
  }

  prepareData(data: DataObject): DataObject {
    let _data =
      this.segment.periodization == "monthly"
        ? data.graphDataMonth
        : data.graphDataWeek;

    const createBar = (
      prop: string,
      param: IParameterMapping,
      data: KeyValue[],
    ) => {
      return {
        label: param?.label || "",
        name: "_" + param?.column,
        colour: param != undefined ? param.colour : "orange",
        // meta: data,
        value: parseFloat(data[0][param?.column].toString()),
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
    this.scales.x.set(data.bars.map((d) => d.label));
    this.scales.y.set(
      data.bars.map((d) => (d.value > 0 ? d.value : 0)).concat([0]),
    );

    await super.redraw(data);
    this.chartBar.redraw(data.bars, this.segment.periodization);

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
