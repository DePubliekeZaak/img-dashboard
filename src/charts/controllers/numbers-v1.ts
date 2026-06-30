import { core, elements } from "../index";
import breakpoints from "../../img-modules/styleguide/breakpoints";
import type { GroupObject, IParameterMapping } from "../../shared/interfaces";
import type { IPageController } from "../../shared/page.controller";
import type { DataObject, Segment } from "../../shared/types";

export class NumbersV1 extends core.GraphControllerV3 {
  els: any = {};
  numbers: any = {};

  constructor(
    public slug: string,
    public page: IPageController,
    public group: GroupObject,
    public data: DataObject,
    public parameters: IParameterMapping[][],
    public modifiers: IParameterMapping[][],
    public filters: string[],
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
      index,
    );
    

    this.pre();
  }

  pre() {
    const bottomMargin = window.innerWidth < breakpoints.lg ? 0 : 45;
    this._addMargin(0, bottomMargin, 0, 0);
  }

  html() {
    const className =
      this.parameters[0].length === 3
        ? "graph-container-4"
        : "graph-container-3";

    for (const p of this.parameters[0]) {
      this.els[p.column] = super._html([className]);
    }

    const els: HTMLElement[] = Object.values(this.els);
    els[els.length - 1].style.marginBottom = "0";

    const h = this.group.graphs[this.index].header;
    if (h !== undefined) {
      const div = document.createElement("div");
      div.innerHTML = h + ":";
      div.style.width = "100%";
      div.style.margin =
        window.innerWidth < breakpoints.sm
          ? "1.5rem"
          : window.innerWidth < breakpoints.lg
            ? "1.5rem 0 .75rem 0"
            : "1.5rem 0";
      if (Object.values(this.els)[0]) {
        const n = Object.values(this.els)[0] as HTMLElement;
        n.parentNode?.insertBefore(div, n);
      }
      // console.log(h);
    }
  }

  async init() {
    for (const p of this.parameters[0]) {
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
    for (const p of this.parameters[0]) {
      if (p.column === "---") return;
      this.numbers[p.column].draw();
    }
  }

  async redraw(data: any, range?: number[]) {
    for (const p of this.parameters[0]) {
      if (p.column === "---") return;
      const entry = this.group.graphParams?.[p.column];
      const seg = this.group.config.segment;
      const isCumulative = typeof seg === 'object' && seg?.cumulative;

      const variant = isCumulative
        ? entry?.variants.cumul
        : entry?.variants.delta;

      const column = variant?.column || p.column;
      this.numbers[p.column]?.redraw(data.numbers[column]);
    }
  }

  async update(data: DataObject, update: boolean, range?: number[]) {
    await super._update(data, update, range);
  }
}
