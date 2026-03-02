import { core, elements } from "../../../charts";
import { ChartBarsHorizontalV1 } from "../../../charts/elements/chart-bars-horizontal-v1";
import ChartTimeline from "../../../charts/elements/chart-timeline";
import type { HtmlNumberCircleRespondents } from "../../../charts/elements/html-number-circle-respondents";
import { breakpoints } from "../../../img-modules/styleguide";
import { parseSegment } from "../../shared/factories/segment";
import type { HtmlPeriodSelector } from "../../shared/html/period-selector";
import type { GroupObject, IParameterMapping } from "../../shared/interfaces";
import type { IPageController } from "../../shared/page.controller";
import type { DataObject, Segment } from "../../shared/types";

export class KTORatingsV1 extends core.GraphControllerV3 {
  circleEl: HTMLElement;
  trendEl: HTMLElement;
  chartBar: ChartBarsHorizontalV1;
  htmlCircle: HtmlNumberCircleRespondents;
  htmlPeriodSelector: HtmlPeriodSelector;

  constructor(
    public slug: string,
    public page: IPageController,
    public group: GroupObject,
    public data: DataObject,
    public parameters: IParameterMapping[][],
    public modifiers: IParameterMapping[][],
    public filters: string[],
    segment: Segment,
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
    // const marginForTimeline = 360;
    // const paddingForTimeline = 60;

    this._addScale("x", "linear", "horizontal", "value");
    this._addScale("y", "band", "vertical", "label");

    this._addPadding(0, 0, 20, 80);
    this._addMargin(0, 60, 0, 0);
  }

  html() {
    this.circleEl = super._html();
    this.circleEl.classList.remove("graph-container-12");
    this.circleEl.classList.add("graph-container-6");
    this.circleEl.style.height = "320px";

    this.graphEl = document.createElement("section");
    this.graphEl.classList.add("graph-container-6");
    this.graphEl.style.height = "320px";
    this.graphEl.style.display = "flex";
    this.graphEl.style.alignItems = "center";
    this.graphEl.style.justifyContent = "center";

    if (this.element) {
      this.element.appendChild(this.graphEl);
      // this.element.style.flexDirection = "row-reverse";
    }
  }

  async init() {
    super._init();
    if (this.graphEl !== null) await super._svg(this.graphEl);

    this.config.paddingInner = 0.25;
    this.config.paddingOuter = 0.25;

    this.htmlCircle = new elements.HtmlNumberCircleRespondents(
      this,
      this.parameters[0][0],
      this.circleEl,
    );
    this.htmlCircle.draw();

    this.chartBar = new ChartBarsHorizontalV1(this);

    await this.update(this.group.data, false);
  }

  prepareData(data: DataObject): DataObject {
    data.selectedMonth = this.segment.cumulative
      ? data.graphDataMonth[0]
      : data.graphDataMonth.find((m) => m["_yearmonth"] === this.segment.key);
    const dataIndex = this.segment.cumulative ? 1 : 2;
    data.numbers = [];

    for (const mapping of this.parameters[dataIndex]) {
      const column = Array.isArray(mapping.column)
        ? mapping.column[0]
        : mapping.column;

      const cijfer = {
        label: mapping.label,
        colour: mapping.colour,
        value: data.selectedMonth[column],
      };

      data.numbers.push(cijfer);
    }

    return data;
  }

  async redraw(data: any, range: number[] | undefined) {
    const parameter = this.segment.key.startsWith("all")
      ? this.parameters[0][0].column
      : this.parameters[0][1].column;

    const extraParameter = this.segment.key.startsWith("all")
      ? this.parameters[0][2].column
      : this.parameters[0][3].column;
    this.htmlCircle.redraw(data.selectedMonth, parameter, extraParameter);

    super.redraw(data);
    this.chartBar.redraw();
  }

  async draw(data: DataObject) {
    this.xScale = this.scales.x.set(
      data.numbers.map((d) => d["value"]).concat([0]),
    );
    this.yScale = this.scales.y.set(data.numbers.map((d) => d["label"]));

    this.chartBar.draw(data.numbers);
  }

  async update(data: DataObject, update: boolean) {
    await super._update(data, update);
  }
}
