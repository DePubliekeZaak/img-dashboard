import { core, elements } from "../index";
import { breakpoints } from "../../img-modules/styleguide";
import HtmlLegend from "../renderers/html-legend";
import {
  type GroupObject,
  IGraphMappingV2,
  type IParameterMapping,
} from "../../shared/interfaces";
import type { IPageController } from "../../shared/page.controller";
import type { DataObject, Segment } from "../../shared/types";


export class PieChartV1 extends core.GraphControllerV3 {
  chartAxis;
  parts = {};
  entity_svgs = {};
  ctrlrs: any = {};
  chartPie;
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

    this.pre();
  }

  pre() {}

  html() {
    this.config.graphRatio = 1;

    if (window.innerWidth < breakpoints.sm) {
      this.config.graphHeight = 320;
    } else if (window.innerWidth < breakpoints.md) {
      this.config.graphHeight = 320;
    } else {
      this.config.graphHeight = 320;
    }

    if (this.group.element === null) return;

    this.graphEl = super._html();
    if (this.graphEl === null) return;
    this.graphEl.style.flexDirection =
      window.innerWidth < breakpoints.sm ? "column" : "row";
    this.graphEl.style.justifyContent =
      window.innerWidth < breakpoints.sm ? "space-between" : "space-around";

    this.legend = new HtmlLegend(this);
  }

  async init() {
    await super._init();
    if (this.graphEl !== null) await super._svg(this.graphEl);

    this.config.extra.innerRadius = 50;
    this.config.extra.maxRadius = 0.5 * (this.config.graphHeight || 0);

    this.chartPie = new elements.ChartPieV1(this);
    await this.update(this.group.data, false);

    return;
  }

  prepareData(data: DataObject): any {
    return data;
  }

  async draw(data: DataObject) {
    this.chartPie.draw(data.pies[this.index]);
    this.legend.draw(data);
  }

  async redraw(data: any, range: number[]) {
    await super.redraw(data.graphs);
    this.chartPie.redraw(data);
  }

  async update(data: DataObject, update: boolean, range?: number[]) {
    await super._update(data, update, range);
  }
}
