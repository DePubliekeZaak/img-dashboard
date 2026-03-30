import { core, elements } from "../../../charts";
import { breakpoints } from "../../../img-modules/styleguide";
import HtmlLegendV2 from "../../shared/html/html-legend-v2";
import type { GroupObject, IParameterMapping } from "../../shared/interfaces";
import type { IPageController } from "../../shared/page.controller";
import type { DataObject, Segment } from "../../shared/types";

export class BlockShareV1 extends core.GraphControllerV3 {
  chartAxis;

  parts = {};
  entity_svgs = {};
  ctrlrs: any = {};

  blocks;

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

  pre() {
    this._addMargin(40, 0, 0, 0);
  }

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
    this.graphEl.classList.remove("graph-container-12");
    this.graphEl.classList.add("graph-container-6");
    this.graphEl.style.flexDirection;
    this.graphEl.style.flexDirection =
      window.innerWidth < breakpoints.sm ? "column" : "column";
    this.graphEl.style.justifyContent =
      window.innerWidth < breakpoints.sm ? "space-between" : "space-around";
    this.graphEl.style.alignItems = "center";

    this.legend = new HtmlLegendV2(this);
  }

  async init() {
    await super._init();
    if (this.graphEl !== null) await super._svg(this.graphEl);

    this.config.extra.innerRadius = 50;
    this.config.extra.maxRadius = 0.5 * (this.config.graphHeight || 0);

    this.blocks = new elements.ChartBlocksV1(this);
    await this.update(this.group.data, false);

    return;
  }

  prepareData(data: DataObject): any {
    return data;
  }

  async draw(data: DataObject) {
    this.blocks.draw(data.pies[this.index]);
    const legendEl = this.legend.draw(data.pies[this.index]);
    legendEl.style.marginTop = "3.3rem";
  }

  async redraw(data: any, range: number[]) {
    await super.redraw(data.pies[this.index]);
    this.blocks.redraw(data.pies[this.index]);
  }

  async update(data: DataObject, update: boolean, range?: number[]) {
    await super._update(data, update, range);
  }
}
