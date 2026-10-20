import { core, elements } from "../../../charts";
import { ChartBarsHorizontalV1 } from "../../../charts/renderers/chart-bars-horizontal-v1";
import type { HtmlNumberCircleRespondents } from "../../../charts/renderers/html-number-circle-respondents";
import type { GroupObject, IParameterMapping } from "../../../shared/interfaces";
import type { IPageController } from "../../../shared/page.controller";
import type { DataObject, Segment } from "../../../shared/types";


export class KTORatingsV1 extends core.GraphControllerV3 {
  circleEl!: HTMLElement;
  trendEl!: HTMLElement;
  chartBar!: ChartBarsHorizontalV1;
  htmlCircle!: HtmlNumberCircleRespondents;

  // Known KTO domein prefixes. Matches the `domein` options offered by the
  // HtmlDomeinSelector widget (see src/widgets/domein-selector.ts). When a
  // segment carries `domein`, prefixed parameter columns are resolved against
  // that prefix; otherwise columns are used verbatim (back-compatible with the
  // plain fs_cijfer graph, which has no `domein`).
  private static readonly DOMAIN_PREFIXES = ["totaal", "fysiek", "ims", "wdl"];

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
      index,
    );

    this.pre();
  }

  pre() {
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

  private resolveColumn(column: string): string {
    const active = this.segment?.domein;
    if (!active || !KTORatingsV1.DOMAIN_PREFIXES.includes(active)) {
      return column;
    }
    for (const prefix of KTORatingsV1.DOMAIN_PREFIXES) {
      if (column === prefix || column.startsWith(prefix + "_")) {
        return column.replace(prefix + "_", active + "_");
      }
    }
    return column;
  }

  prepareData(data: DataObject): DataObject {
  
    const isCumulative = this.segment?.cumulative ?? true;
    const key = this.segment?.key || "all";

    data.selectedMonth = isCumulative
      ? data.graphDataMonth[0]
      : data.graphDataMonth.find((m) => m["_yearmonth"] === key);

    const dataIndex = isCumulative ? 1 : 2;
    data.numbers = [];

    for (const mapping of this.parameters[dataIndex]) {
      const column = this.resolveColumn(
        Array.isArray(mapping.column) ? mapping.column[0] : mapping.column,
      );

      const cijfer = {
        label: mapping.label,
        colour: mapping.colour,
        value: data.selectedMonth?.[column] ?? 0,
      };

      data.numbers.push(cijfer);
    }

    return data;
  }

  async redraw(data: any, range?: number[]) {

    const key = this.segment?.key || "all";

    const parameter = this.resolveColumn(
      key.startsWith("all")
        ? this.parameters[0][0].column
        : this.parameters[0][1].column,
    );

    const extraParameter = this.resolveColumn(
      key.startsWith("all")
        ? this.parameters[0][2].column
        : this.parameters[0][3].column,
    );

    this.htmlCircle.redraw(data.selectedMonth, parameter, extraParameter);

    super.redraw(data);
    this.chartBar.redraw();
  }

  async draw(data: DataObject) {
    this.xScale = this.scales.x.set(
      data.numbers.map((d: any) => d["value"]).concat([0]),
    );
    this.yScale = this.scales.y.set(data.numbers.map((d: any) => d["label"]));

    this.chartBar.draw(data.numbers);
  }

  async update(data: DataObject, update: boolean) {
    await super._update(data, update);
  }
}