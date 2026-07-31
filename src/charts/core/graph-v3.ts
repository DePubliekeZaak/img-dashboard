import {
  fixMultiple,
  graphIsMultiple,
} from "../../shared/factories/multiples";
import { HtmlFilters } from "../../widgets/html-filters";
import type { GroupObject } from "../../shared/interfaces";
import type { IPageController } from "../../shared/page.controller";
import type { DataObject, Segment } from "../../shared/types";
import { getGraphSegment } from "../../stores/segment.store";
import { AxesService } from "./axes.service";
import { ChartDimensions, type IChartDimensions } from "./chart-dimensions";
import { ChartObject } from "./chart-init-objects";
import { IScaleService, ScaleService } from "./scale.service";
import { type ISvgService, SvgService } from "./svg-service";
import {
  type Dimensions,
  type IGraphConfig,
  type IParameterMapping,
  IScale,
  type IScales,
} from "./types";

/**
 * Controllers (subclasses under `charts/controllers/`, both shared and
 * page-local) own lifecycle and segment/data wiring — construct, prepareData,
 * draw, redraw, update. Renderers (under `charts/renderers/`) own SVG/DOM
 * drawing and are shared across multiple controllers — see each controller's
 * `html()` / `_svg()` for which renderer(s) it uses. Cardinality is many-to-one:
 * e.g. `ChartBarTrend` renders 6 different controller variants.
 */
export type IGraphControllerV3 = {
  element: HTMLElement | null;
  slug: string;
  page: IPageController;
  group: GroupObject;
  data: any;
  svgWrapper?: HTMLElement;
  parameters: IParameterMapping[][];
  modifiers: IParameterMapping[][];
  filters: string[];
  config: IGraphConfig;
  segment: Segment | undefined;
  dimensions: Dimensions;
  scales: IScales;
  svg: any;
  chartDimensions: IChartDimensions;

  init: () => void;
  _html: (classList?: string[]) => HTMLElement;
  prepareData: (data: DataObject) => void;
  draw: (data: any) => Promise<void>;
  redraw: (data?: any, range?: number[]) => Promise<void>;
  update: (
    data: DataObject,
    update: boolean,
    range?: number[],
  ) => Promise<void>;
};

export class GraphControllerV3 implements IGraphControllerV3 {
  config: IGraphConfig;
  graphEl!: HTMLElement | null;
  dimensions!: Dimensions;
  svg: any;
  yScale!: IScaleService;
  xScale!: IScaleService;
  chartDimensions!: IChartDimensions;
  svgService!: ISvgService;
  scales: any;
  axes: any;
  htmlHeader!: HTMLElement;
  htmlSegment!: HTMLElement;
  element!: HTMLElement | null;
  popup!: any;
  preparedData!: DataObject;
  filter!: any;
  _resizeHandler: (() => void) | null = null;

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
    this.scales = {};
    this.axes = {};
    this.config = {
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      innerPadding: { top: 0, bottom: 0, left: 0, right: 0 },
      scales: [],
      axes: [],
      extra: {},
    };
  }

  // Getter for segment from store
  get segment(): Segment | undefined {
    return getGraphSegment(this.group.slug, this.slug);
  }

  init() {}

  _init() {
    const chartObject = ChartObject();
    this.config = Object.assign(chartObject.config(), this.config);
    this.dimensions = chartObject.dimensions();
    this.svg = chartObject.svg();

    return;
  }

  _html(classList?: string[]) {
    this.element = this.group.element;
    const classes = classList?.join(",") || "graph-container-12";

    const graphEl = document.createElement("section");
    graphEl.classList.add(classes);
    graphEl.classList.add("graph-view");
    graphEl.classList.add(this.slug);
    if (this.element !== null) {
      this.element.appendChild(graphEl);
      graphEl.style.paddingTop = this.config.margin.top + "px";
      graphEl.style.paddingBottom = this.config.margin.bottom + "px";
      graphEl.style.paddingLeft = this.config.margin.left + "px";
      graphEl.style.paddingRight = this.config.margin.right + "px";
    }

    if (graphIsMultiple(this.slug)) {
      const graph = this.group.config.graphs.find(
        (g) => g.slug === fixMultiple(this.slug),
      );
      const master = this.slug.endsWith("0");

      if (
        graph !== undefined &&
        graph.filters !== undefined &&
        graph.filters.length > 0
      ) {
        this.filter = new HtmlFilters(
          this,
          master,
          graph.slug,
          graphEl.parentElement,
          graph.filters,
          this.parameters,
          this.modifiers,
        );
        this.filter.draw();
      }
    } else {
      const graph = this.group.config.graphs.find((g) => g.slug === this.slug);

      if (
        graph !== undefined &&
        graph.filters !== undefined &&
        graph.filters.length > 0
      ) {
        this.filter = new HtmlFilters(
          this,
          true,
          graph.slug,
          graphEl,
          graph.filters,
          this.parameters,
          this.modifiers,
        );
        this.filter.draw();
      }
    }

    return graphEl;
  }

  async _svg(svgWrapper?: HTMLElement) {
    this.element = window.d3
      .select(svgWrapper ? svgWrapper : this.element)
      .node();

    if (this.element === null) return;
    this.chartDimensions = new ChartDimensions(this.element, this.config);
    this.dimensions = this.chartDimensions.measure(this.dimensions);

    this.svgService = new SvgService(
      this.element,
      this.config,
      this.dimensions,
      this.svg,
    );

    for (const c of this.config.scales) {
      this.scales[c.slug] = new ScaleService(this, c);
    }

    for (const c of this.config.axes) {
      this.axes[c.slug] = new AxesService(this, c);
    }

    return;
  }

  async redraw(data?: any, range?: number[], dimensions?: Dimensions) {
    if (this.svg && this.svg.body === undefined) return;

    this.dimensions = dimensions
      ? dimensions
      : this.chartDimensions.measure(this.dimensions);

    this.svgService.redraw(this.dimensions);

    if (this.config.scales) {
      for (const c of this.config.scales) {
        this.scales[c.slug].reset();
      }
    }

    const segment = this.segment;
    if (segment?.baseKey) {
      const entry = this.group.graphParams?.[segment.baseKey];
      const param = this.parameters[0].find((p) => p.column === segment.baseKey); // will thjis nwork accross all graphs? 
      
      for (const a of this.config.axes) {
        this.axes[a.slug].redraw(
          this.dimensions,
          this.scales[a.scale].scale,
          data.slice,
          segment,
          param?.format,
        );
      }
    }

    return;
  }

  async draw(data: DataObject): Promise<void> {
    return;
  }

  prepareData(data: DataObject): DataObject {
    return data;
  }

  async update(data: DataObject, update: boolean) {
    return;
  }

  async _update(newData: DataObject, update: boolean, range?: number[]) {
    // No more parseSegment — segment comes from store via getter

    if (update && this.config.extra.noUpdate) {
      return;
    }

    const d = Object.assign({}, newData);
    const data = this.prepareData(d);
    this.preparedData = Object.assign({}, data);
    await this.draw(this.preparedData);
    await this.redraw(this.preparedData, range);

    // Remove stale resize listener before adding a fresh one
    if (this._resizeHandler) {
      window.removeEventListener("resize", this._resizeHandler);
    }
    this._resizeHandler = () => this.redraw(this.preparedData);
    window.addEventListener("resize", this._resizeHandler, false);

    return;
  }

  _addScale(slug: string, type: string, direction: string, parameter?: string) {
    this.config.scales.push({
      slug,
      type,
      direction,
      parameter,
    });
  }

  _addAxis(
    slug: string,
    scale: string,
    position: string,
    format?: string,
    extra?: string,
    label?: string,
  ) {
    this.config.axes.push({
      slug,
      scale,
      position,
      format,
      extra,
      label,
    });
  }

  _addMargin(top: number, bottom: number, left: number, right: number) {
    this.config.margin = {
      top,
      bottom,
      left,
      right,
    };
  }

  _addPadding(top: number, bottom: number, left: number, right: number) {
    this.config.padding = {
      top,
      bottom,
      left,
      right,
    };
  }

  _addInnerPadding(top: number, bottom: number, left: number, right: number) {
    this.config.innerPadding = {
      top,
      bottom,
      left,
      right,
    };
  }

  destroy() {
    if (this._resizeHandler) {
      window.removeEventListener("resize", this._resizeHandler);
      this._resizeHandler = null;
    }
  }
}