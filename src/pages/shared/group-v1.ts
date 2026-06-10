// import { definitionList } from "../definitions";
import definitionList from "../../json/definitions.json";
import { getAllData } from "../../stores/data.store";
import { getGroupSegment } from "../../stores/segment.store";
import { timelineList } from "../timeline";
import {
  defaultColumns,
  removeDuplicates,
  trimColumnsAndOrder,
} from "./_helpers";
import { HTMLDefinitions } from "./html/html-definitions";
import { HtmlGroupFilters } from "./html/html-group-filters";
import { HtmlHeader } from "./html/html-header";
import { HTMLTables } from "./html/html-tables";
import { HtmlTabs } from "./html/html-tabs";
import type {
  IGroupCtrlr,
  IGroupMappingV2,
  IParameterMapping,
} from "./interfaces";
import { segmentParse } from "./segment";
import {
  type DataObject,
  ImgData,
  type Segment,
  TableData,
  type Timeline,
} from "./types";
import type { Definitions } from "./types_graphs";

export class GroupControllerV1 implements IGroupCtrlr {
  slug: string;
  element: HTMLElement | null;
  segment!: Segment;
  group: any;

  htmlHeader: any;
  tabs: any;
  table: any;
  definitions: any;
  filters: any;
  description: any;

  groupWrapper: any;
  graphWrapper: any;

  constructor(
    public page: any,
    public config: IGroupMappingV2,
    public index: number,
  ) {
    this.slug = config.slug;
    this.element = page.main.htmlContainer;
    if (config.segment) this.segment = segmentParse(config.segment);

    // if (this.segment.gemeente === "all") {
    //   this.segment.key = this.segment.cumulative
    //     ? this.segment.key.replace("_cumulatief", "") + "_cumulatief"
    //     : this.segment.key.replace("_cumulatief", "");
    // }

    if (!this.config.endpoints?.length) {
      this.config.endpoints = this.page.config.endpoints;
    }
  }

  html(groupEl?: HTMLElement) {
    if (this.element === null) return;

    if (groupEl === undefined) {
      this.groupWrapper = document.createElement("section");
      this.groupWrapper.classList.add("graph-container-12");
      this.groupWrapper.classList.add("group-wrapper");
      this.groupWrapper.setAttribute("id", this.slug);
      this.element.appendChild(this.groupWrapper);
    } else {
      this.groupWrapper = groupEl;
    }

    this.htmlHeader = new HtmlHeader(
      this.page.main.data,
      this.config.endpoints,
      this.groupWrapper,
      this.config.header,
      this.config.description,
      this.config.datum || undefined,
    );

    this.htmlHeader.draw();

    if (this.config.graphs.length > 0) {
      if (this.config.functionality) {
        this.tabs = new HtmlTabs(
          this,
          this.groupWrapper,
          this.config,
          this.segment,
          this.index,
        );
        this.tabs.draw();
      }

      // TAB PANELS

      this.graphWrapper = document.createElement("section");
      this.graphWrapper.classList.add("graph-container-12");
      this.graphWrapper.classList.add("graph-wrapper");
      this.graphWrapper.classList.add("tabpanel");
      this.graphWrapper.role = "tabpanel";
      this.graphWrapper.id = "panel_" + this.slug + "__graph";
      this.graphWrapper.setAttribute(
        "aria-labelledby",
        "tab_" + this.slug + "__graph",
      );
      this.graphWrapper.tabIndex = 0;

      this.groupWrapper.appendChild(this.graphWrapper);
    }

    if (this.config.functionality === undefined) return;

    if (
      this.config.functionality &&
      this.config.functionality.indexOf("table") > -1
    ) {
      this.table = new HTMLTables(this, this.groupWrapper, this.segment);
    }

    if (
      this.config.functionality &&
      this.config.functionality.indexOf("definitions") > -1
    ) {
      this.definitions = new HTMLDefinitions(this, this.groupWrapper);
    }

    return this.graphWrapper !== undefined ? this.graphWrapper : this.element;
  } 

  paramsAndModifiers() {
    const tableParams: IParameterMapping[] = [];
    const graphParams: Record<string, {
      base: IParameterMapping;
      variants: Record<string, IParameterMapping>;
    }> = {};

    for (const graph of this.config.graphs) {
      for (const p of graph.parameters.flat()) {
        if (!graphParams[p.column]) {
          graphParams[p.column] = {
            base: p,
            variants: {},
          };

          // Build variants from parameter's own modifiers
          if (p.modifiers) {
            for (const [variantKey, suffix] of Object.entries(p.modifiers)) {
              const variant: IParameterMapping = {
                ...p,
                column: p.column + suffix,
              };
              graphParams[p.column].variants[variantKey] = variant;

              if (!p.excludeFromTable) {
                tableParams.push(variant);
              }
            }
          } else {
            // No modifiers — base column is the only variant
            graphParams[p.column].variants["base"] = p;
            if (!p.excludeFromTable) {
              tableParams.push(p);
            }
          }
        }
      }
    }

    return { 
      tableParams: removeDuplicates(tableParams), 
      graphParams 
    };
  }

  prepareData(data: any): any {

    this.group = this.page.chartArray.find( (g: any) => g.slug === this.slug);
  
    const { tableParams, graphParams } = this.group;

    const endpoints = this.group?.resolvedEndpoints;

    const weekGroup = endpoints.find(
      (e: any) =>
        e.includes("wekelijks") ||
        e.includes("tevredenheid") ||
        e.includes("eq.week"),
    );
    
    const monthGroup = endpoints.find(
      (e: any) =>
        e.includes("maandelijks") ||
        e.includes("tevredenheid") ||
        e.includes("eq.maand"),
    );

    let graphDataWeek: any[] = [];
    let graphDataMonth: any[] = [];

    const allColumns = Object.values(graphParams)
      .flatMap((entry: any) => Object.values(entry.variants))
      .map( (v: any) => v.column);

    if (weekGroup !== undefined && data[weekGroup].length > 0) {
      graphDataWeek = trimColumnsAndOrder(
        data[weekGroup],
        allColumns.concat(defaultColumns),
      );
    }

    if (monthGroup !== undefined && data[monthGroup].length > 0) {
      graphDataMonth = trimColumnsAndOrder(
        data[monthGroup],
        allColumns.concat(defaultColumns),
      );
    }

    if (monthGroup === "tevredenheid") {
      graphDataMonth = graphDataMonth.filter((p) => p.complete === true);
    }

    let timeline: Timeline[] = [];

    if (
      (this.config.timeline !== undefined && this.config.timeline?.length > 0)
    ) {
      timeline = timelineList.filter(
        (ti: Timeline) => this.config.timeline!.indexOf(ti.label) > -1,
      );
      timeline.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    const definitions =
      this.config.definitions && this.config.definitions?.length > 0
        ? definitionList
            .filter((d) => this.config.definitions!.indexOf(d.name) > -1)
            .sort()
        : [];


    const numbers = graphDataWeek[0]

    return {
      numbers,
      tableParams,
      graphParams,
      graphDataMonth,
      graphDataWeek,
      timeline,
      definitions,
    };
  }

  populateTable(data: any) {
    if (
      this.config.functionality &&
      this.config.functionality.indexOf("table") > -1
    ) {
      this.table.draw(data);
    }
  }

  populateDefinitions(definitionData: Definitions) {
    if (
      this.config.functionality &&
      this.config.functionality.indexOf("definitions") > -1
    ) {
      this.definitions.draw(definitionData);
    }
  }

  populateDescription() {
    const endpoints = this.group?.resolvedEndpoints;
    const data = getAllData();
    
    const currentData =
      endpoints?.[0] && data[endpoints[0]]?.length > 0
        ? data[endpoints[0]][0]
        : undefined;
        
    this.htmlHeader.redraw(currentData);
  }

  armTabs() {
    if (this.config.graphs.length > 0) {
      this.tabs.handleInitialState();
      this.tabs.arm();
    }
  }

  armDownloads() {
    if (this.config.graphs.length > 0) {
      this.tabs.armDownload();
    }
  }

  setFilters() {
    if (this.config.filters !== undefined && this.config.filters.length > 0) {
      this.filters = new HtmlGroupFilters(this);
      this.filters.draw(this.segment);
    }
  }

  update(data: DataObject, segment: Segment | undefined, update: boolean) {
 

    this.config.segment = getGroupSegment(this.config.slug);

    const group = this.page.chartArray.find((i: any) => i.config.slug === this.slug);

    group.data = this.prepareData(data);

    this.tabs.redraw();

    for (const graph of group.graphs) {
      graph.ctrlr.update(group.data, true);
    }

    this.populateTable(group.data);

    this.populateDefinitions(group.data.definitions);
  }
}
