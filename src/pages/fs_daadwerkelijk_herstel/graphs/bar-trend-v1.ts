import { core, elements } from "../../../charts";
import { KeyValue } from "../../../charts/core/types";
import { breakpoints } from "../../../img-modules/styleguide";
import { createBars } from "../../shared/data.format.factory";
import { parseSegment } from "../../shared/factories/segment";
import { HtmlLegendCustom } from "../../shared/html/html-legend-custom";
import { HtmlRadio } from "../../shared/html/html-radio";
import {
  type GroupObject,
  IGraphMappingV2,
  type IParameterMapping,
} from "../../shared/interfaces";
import type { IPageController } from "../../shared/page.controller";
import {
  type DataObject,
  DataPart,
  ImgData,
  type Segment,
} from "../../shared/types";
import { TrendBar } from "../../shared/types_graphs";

export class BarTrendV1 extends core.GraphControllerV3 {
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
    this.config.graphHeight = window.innerWidth > breakpoints.sm ? 420 : 320; //  this.index < 1 ? 420 : 210;

    const bottom = window.innerWidth > breakpoints.sm ? 60 : 15;

    this._addMargin(0, 0, 0, 0);
    this._addPadding(0, bottom, 30, 30);

    this._addScale("x", "band", "horizontal-reverse", "label");
    this._addScale("x1", "time", "horizontal", "date");
    this._addScale("y", "linear", "vertical", "value");
    this._addAxis("x", "x", "bottom", "quarters");
    this._addAxis("y", "y", "left");
  }

  html() {
    const graphHeight = this.index < 1 ? 420 : 210;

    if (this.group.element === null) return;

    this.graphEl = super._html();

    // if (window.innerWidth > breakpoints.sm && this.graphEl.parentElement && this.mapping[2]) {
    //     let radiobuttons = new HtmlRadio(this, this.mapping[2],this.graphEl.parentElement);
    // }
  }

  async init() {
    this.config.paddingInner = 0.2;
    this.config.paddingOuter = 0.2;

    await super._init();
    if (this.graphEl !== null) await super._svg(this.graphEl);

    if (window.innerWidth > breakpoints.sm) {
      this.timeline_1 = new elements.ChartTimeline(this);
    }

    this.chartBar = new elements.ChartBarTrend(this);
    await this.update(this.group.data, false);

    return;
  }

  prepareData(data: DataObject): DataObject {
    //   let _data = (this.segment.periodization === "weekly") ? data.graphData : data.graphData_alt

    for (const pg of this.parameters) {
      for (const p of pg) {
        data[p.column] = createBars(p.column, p, data.graphData, this.segment);

        if (this.modifiers !== undefined) {
          for (const mg of this.modifiers) {
            for (const m of mg) {
              if (m.column !== "{}") {
                const prop = m.column.replace("{}", p.column);
                data[prop] = createBars(prop, p, data.graphData, this.segment);
              }
            }
          }
        }
      }
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
    this.scales.y.set(data[this.segment.key].map((d) => d.value).concat([0]));

    await super.redraw(data[this.segment.key]);

    this.chartBar.redraw(data[this.segment.key]);
    this.timeline_1?.redraw(data.timeline, 0);
  }

  async update(data: DataObject, update: boolean, range?: number[]) {
    await super._update(data, update, range);
  }
}
