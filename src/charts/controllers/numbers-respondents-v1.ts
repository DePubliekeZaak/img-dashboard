import { core, elements } from "../index";
import { breakpoints } from "../../img-modules/styleguide";
import {
  type GroupObject,
  IGraphMappingV2,
  type IParameterMapping,
} from "../../shared/interfaces";
import type { IPageController } from "../../shared/page.controller";
import type { DataObject, Segment } from "../../shared/types";


export class NumbersPlusRespondentsV1 extends core.GraphControllerV3 {
  els = {};
  numbers = {};

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
    const marginBottom = window.innerWidth < breakpoints.lg ? 0 : 60;
    this._addMargin(0, marginBottom, 0, 0);
  }

  html() {
    const count = this.parameters[0].length;
    const className = count === 2 ? "graph-container-6" : "graph-container-4";

    for (const p of this.parameters[0]) {
      this.els[p.column] = super._html([className]);

      const label = document.createElement("div");
      label.style.display = "flex";
      label.style.justifyContent = "center";
      label.classList.add("label");
      label.style.color = "black";
      label.style.fontSize = "1.375rem";
      label.style.fontFamily = "RO Sans Bold, sans-serif";
      label.style.marginBottom = ".66rem";
      label.style.textAlign =
        window.innerWidth < breakpoints.lg ? "center" : "right";
      this.els[p.column].appendChild(label);
    }
  }

  async init() {
    for (const p of this.parameters[0]) {
      this.numbers[p.column] = new elements.HtmlNumberCircleRespondents(
        this,
        p,
        this.els[p.column],
      );
    }

    await this.update(this.group.data, false);

    return;
  }

  prepareData(data: DataObject): DataObject {
    return data;
  }

  async draw(data: DataObject) {
    for (const p of this.parameters[0]) {
      this.numbers[p.column].draw();
      this.els[p.column].querySelector(".label").innerText = p.label;
    }
  }

  async redraw(data: any, range: number[]) {
    let i = 0;
    for (const p of this.parameters[0]) {
      this.numbers[p.column].redraw(
        data.graphDataWeek[0],
        this.parameters[0][i]["column"],
        this.parameters[1][i]["column"],
      );
      i++;
    }
  }

  async update(data: DataObject, update: boolean, range?: number[]) {
    await super._update(data, update, range);
  }
}
