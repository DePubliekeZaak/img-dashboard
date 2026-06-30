import { core, elements } from "../index";
import breakpoints from "../../img-modules/styleguide/breakpoints";
import type { GroupObject, IParameterMapping } from "../../shared/interfaces";
import type { IPageController } from "../../shared/page.controller";
import type { DataObject, Segment } from "../../shared/types";
import {
  getGraphSegment,
  getActiveColumn,
  getGroupSegment,
} from "../../stores/segment.store";

export class NumbersMultiplesV1 extends core.GraphControllerV3 {
  el!: HTMLElement;
  number!: any;
  header!: HTMLElement;

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
    // this.el.parentElement.style.paddingTop = "5rem";

    // if(this.index === 0) {

    //     const header = document.createElement('h3');
    //     header.innerText = "Aanvullende vaste vergoeding"
    //     this.el.parentElement.parentElement.insertBefore(header, this.el.parentElement);
    // }
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

    const segment = getGroupSegment(this.group.slug)
    data.numbers = segment!.cumulative ? data.cumulative : data.incremental;
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
