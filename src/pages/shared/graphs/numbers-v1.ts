import { DataObject, Segment } from "../types";
import { core, elements } from "../../../charts";
import { GroupObject, IParameterMapping } from "../interfaces";
import { IPageController } from "../page.controller";
import { parseSegment } from "../factories/segment";

export class NumbersV1 extends core.GraphControllerV3 {
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
    public segment: Segment,
    public index: number,
    public pageSegment: any,
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
    const bottom = 45;
    this._addMargin(0, bottom, 0, 0);
  }

  html() {
    const className =
      this.parameters[0].length == 3
        ? "graph-container-4"
        : "graph-container-3";

    for (let p of this.parameters[0]) {
      this.els[p.column] = super._html([className]);
    }

    const els: HTMLElement[] = Object.values(this.els);
    els[els.length - 1].style.marginBottom = "0";

    let h = this.group.graphs[this.index].header;
    if (h != undefined) {
      const div = document.createElement("div");
      div.innerHTML = h + ":";
      div.style.width = "100%";
      div.style.margin = "1.5rem 0";
      if (Object.values(this.els)[0]) {
        const n = Object.values(this.els)[0] as HTMLElement;
        n.parentNode?.insertBefore(div, n);
      }
      // console.log(h);
    }
  }

  async init() {
    for (let p of this.parameters[0]) {

      this.numbers[p.column] = new elements.HtmlNumberAccented(
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
    for (let p of this.parameters[0]) {

      if (p.column == "---") return;
      this.numbers[p.column].draw();
    }
  }

  async redraw(data: any, range: number[]) {
    for (let p of this.parameters[0]) { 
      const column = this.page.segment.groups[this.group.slug].cumulative ? p.column.replace("_cumulatief","") + "_cumulatief" : p.column.includes("_percentage") ||  p.column.includes("_peag") ? p.column : p.column.replace("_cumulatief","")
      
      if (p.column == "---") return;
      const number = data.numbers[column];
      this.numbers[p.column].redraw(number);
    }
  }

  async update(data: DataObject, update: boolean, range?: number[]) {
    await super._update(data, update, range);
  }
}
