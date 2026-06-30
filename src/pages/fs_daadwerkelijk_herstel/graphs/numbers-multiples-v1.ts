import { core, elements } from "../../../charts";
import { parseSegment } from "../../../shared/factories/segment";
import type { GroupObject, IParameterMapping } from "../../../shared/interfaces";
import type { IPageController } from "../../../shared/page.controller";
import type { DataObject, Segment } from "../../../shared/types";

export class NumbersMultiplesV1 extends core.GraphControllerV3 {
  el;
  number;

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
    this._addMargin(0, 45, 0, 0);
  }

  html() {
    this.el = super._html(["graph-container-4"]);
  }

  async init() {
    this.number = new elements.HtmlNumberSimple(
      this,
      this.parameters[0][this.index],
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
