import { core, elements } from "../../../charts";
import breakpoints from "../../../img-modules/styleguide/breakpoints";
import { parseSegment } from "../factories/segment";
import { HtmlHeader } from "../html/html-header";
import type { GroupObject, IParameterMapping } from "../interfaces";
import type { IPageController } from "../page.controller";
import type { DataObject, Segment } from "../types";

export class NumbersMultiplesTitledV1 extends core.GraphControllerV3 {
  el;
  number;
  header;

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

    if (this.page.segment)
      this.segment = parseSegment(this.page, this.group.slug, this.slug);

    this.pre();
  }

  pre() {
    let top = 0;
    let bottom = 0;

    if (window.innerWidth < breakpoints.sm) {
      top = this.index === 0 ? 15 : 0;
      bottom = 15;
    } else {
      top = 15;
      bottom = 45;
    }

    this._addMargin(top, bottom, 0, 0);
  }

  html() {
    let elClass = "";

    switch (this.parameters[0].length) {
      case 1:
        elClass = "graph-container-12";
        break;
      case 2:
        elClass = "graph-container-6";
        break;
      case 3:
        elClass = "graph-container-4";
        break;
      case 4:
        elClass = "graph-container-3";
        break;
      default:
        elClass = "graph-container-4";
        break;
    }

    this.el = super._html([elClass]);
  }

  async init() {
    this.number = new elements.HtmlNumberTitled(
      this,
      [this.parameters[0][this.index], this.parameters[1][this.index]],
      this.el,
    );
    await this.update(this.group.data, false);
    return;
  }

  prepareData(data: DataObject): DataObject {
    data.numbers = this.segment.cumulative ? data.cumulative : data.incremental;
    return data;
  }

  async draw(data: DataObject) {
    this.number.draw();
  }

  async redraw(data: any, range: number[]) {
    this.number.redraw(data.numbers[this.index]);
  }

  async update(data: DataObject, update: boolean, range?: number[]) {
    await super._update(data, update, range);
  }
}
