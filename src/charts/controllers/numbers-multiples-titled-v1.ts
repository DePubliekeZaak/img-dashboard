import { core, elements } from "../index";
import breakpoints from "../../img-modules/styleguide/breakpoints";``
import type { GroupObject, IParameterMapping } from "../../shared/interfaces";
import type { IPageController } from "../../shared/page.controller";
import type { DataObject } from "../../shared/types";

export class NumbersMultiplesTitledV1 extends core.GraphControllerV3 {
  el: any;
  number: any;
  header: any;

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
    const param = this.parameters[0]?.[this.index];
    if (!param) {
      console.warn(
        `NumbersMultiplesTitledV1[${this.slug}]: no param at index ${this.index} (params[0].length=${this.parameters[0]?.length})`,
      );
      return;
    }
    this.number = new elements.HtmlNumberTitled(
      this,
      [param],
      this.el,
    );
    await this.update(this.group.data, false);
    return;
  }

  prepareData(data: DataObject): DataObject {
    const numbers = (this.segment!.cumulative ? data.cumulative : data.incremental);
    data.numbers = numbers?.length
      ? numbers
      : (data.graphDataWeek?.[0]
        ? this.parameters[0].map((p: any) => data.graphDataWeek[0][p.column])
        : []);
    return data;
  }

  async draw(data: DataObject) {
    if (!this.number) return;
    this.number.draw();
  }

  async redraw(data: any, range: number[]) {
    if (!this.number) return;
    this.number.redraw(data.numbers[this.index]);
  }

  async update(data: DataObject, update: boolean, range?: number[]) {
    await super._update(data, update, range);
  }
}
