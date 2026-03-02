import { core, elements } from "../../../charts";
import { AxisArrow } from "../../../charts/elements/axis-arrow";
import { breakpoints } from "../../../img-modules/styleguide";
import { parseSegment } from "../../shared/factories/segment";
import { HtmlLegendRowWithLines } from "../../shared/html/html-legend-row-with-lines";
import { HTMLYear } from "../../shared/html/html-year";
import {
  type GroupObject,
  IGraphMappingV2,
  type IParameterMapping,
} from "../../shared/interfaces";
import type { IPageController } from "../../shared/page.controller";
import type { DataObject, Segment } from "../../shared/types";

export class SMBandBarsOrdes extends core.GraphControllerV3 {
  header;
  chartAxis;
  chart;
  finalRevenueLine;
  zeroLine;

  bars = {};
  timeline_1;
  timeline_2;

  line;
  lines: any = {};

  // yScale;
  // xScale;
  bottomAxis;
  leftAxis;

  legend;

  arrowX;
  arrowY;
  arrowY1;

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
    const top = window.innerWidth < breakpoints.sm ? 0 : 0;
    const bottom = 0;

    this._addMargin(top, bottom, 0, 0);
    this._addPadding(45, 45, 30, 30);

    this._addScale("x", "band", "horizontal-reverse", "label");
    this._addScale("y", "linear", "vertical", "value");
    this._addAxis("x", "x", "bottom", "short");
    this._addAxis("y", "y", "left", "hidden");
  }

  html() {
    this.config.graphHeight = window.innerWidth < breakpoints.sm ? 240 : 240;

    if (this.group.element === null) return;

    this.graphEl = super._html();
    if (this.graphEl.parentElement)
      this.graphEl.parentElement.style.justifyContent = "flex-start";
    this.graphEl.classList.remove("graph-container-12");
    this.graphEl.classList.add("graph-container-4");
    this.graphEl.style.width = "33%";

    this.header = new HTMLYear(this, this.graphEl);
  }

  async init() {
    this.config.paddingInner = 0.2;
    this.config.paddingOuter = 0.2;

    await super._init();
    if (this.graphEl !== null) await super._svg(this.graphEl);

    this.chart = new elements.ChartBandBar(this);
    this.arrowY = new AxisArrow(this, "y", "aantal besluiten");

    await this.update(this.group.data, false);

    return;
  }

  prepareData(data: DataObject): DataObject {
    return data;
  }

  async draw(data: DataObject) {
    this.chart.draw(data.years[this.index]);
    this.header.draw(data.years[this.index][0].meta._year);
  }

  async redraw(data: any, range: number[]) {
    this.scales.x.set(data.years[this.index].map((d) => d.label));
    this.scales.y.set(data.years[this.index].map((d) => d.value).concat([0]));

    await super.redraw(data.years[this.index]);

    this.chart.redraw(data.years[this.index]);
    await this.arrowY.redraw();
  }

  async update(data: DataObject, update: boolean, range?: number[]) {
    await super._update(data, update, range);
  }
}
