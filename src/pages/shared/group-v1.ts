// import { definitionList } from "../definitions";
import definitionList from "../../json/definitions.json";
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
  segment: Segment;

  htmlHeader;
  tabs;
  table;
  definitions;
  filters: any;
  description;

  groupWrapper;
  graphWrapper;

  constructor(
    public page: any,
    public config: IGroupMappingV2,
    public index: number,
  ) {
    this.slug = config.slug;
    this.element = page.main.htmlContainer;
    if (config.segment) this.segment = segmentParse(config.segment);

    if (this.segment.gemeente === "all") {
      this.segment.key = this.segment.cumulative
        ? this.segment.key.replace("_cumulatief", "") + "_cumulatief"
        : this.segment.key.replace("_cumulatief", "");
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

  prepareData(data: any): any {
    const weekGroup = this.config.endpoints!.find(
      (e) =>
        e.includes("wekelijks") ||
        e.includes("tevredenheid") ||
        e.includes("eq.week"),
    );
    const monthGroup = this.config.endpoints!.find(
      (e) =>
        e.includes("maandelijks") ||
        e.includes("tevredenheid") ||
        e.includes("eq.maand"),
    );

    let tableParams = [] as IParameterMapping[];
    let graphParams = [] as IParameterMapping[];

    for (const graph of this.config.graphs) {
      for (const pg of graph.parameters) {
        for (const p of pg) {
          const columnNames = tableParams.map((p) => p.column);
          if (!columnNames.includes(p.column)) {
            if (tableParams.indexOf(p) < 0 && !p.excludeFromTable) {
              tableParams.push(p);
            }
            if (graphParams.indexOf(p) < 0) {
              graphParams.push(p);
            }
          }
        }
      }

      if (graph.modifiers !== undefined) {
        for (const mg of graph.modifiers) {
          for (const m of mg) {
            // Skip de basis {} modifier
            if (m.column === "{}") continue;

            for (const p of JSON.parse(JSON.stringify(graphParams))) {
              // Skip als parameter al een suffix heeft
              if (
                p.column.includes("_cumul") ||
                p.column.includes("_cumulatief") ||
                p.column.includes("_aantal")
              )
                continue;

              const n: IParameterMapping = Object.assign({}, m);
              n.column = m.column.replace("{}", p.column);
              n.label = p.label;
              if (p.format !== "" || p.format !== undefined)
                n.format = p.format;

              graphParams.push(n);

              const columnNames = tableParams.map((p) => p.column);
              if (!columnNames.includes(n.column)) {
                tableParams.push(n);
              }
            }
          }
        }
      }
    }

    tableParams = removeDuplicates(tableParams);
    graphParams = removeDuplicates(graphParams);

    // console.log(tableParams)

    // tableParams = tableParams.filter ( p => !p.column.includes("_cumulatief"))

    let graphDataWeek: any[] = [];
    let graphDataMonth: any[] = [];

    if (weekGroup !== undefined && data[weekGroup].length > 0) {
      graphDataWeek = trimColumnsAndOrder(
        data[weekGroup],
        graphParams.map((p) => p.column).concat(defaultColumns),
      );
    }

    if (monthGroup !== undefined && data[monthGroup].length > 0) {
      graphDataMonth = trimColumnsAndOrder(
        data[monthGroup],
        graphParams.map((p) => p.column).concat(defaultColumns),
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

    return {
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
    const collection = this.page.main.data.collection();
    const currentData =
      this.config.endpoints![0] &&
      collection[this.config.endpoints![0]].length > 0
        ? collection[this.config.endpoints![0]][0]
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
    // if (segment !== undefined) {
    //   this.config.segment = segment;
    // }

    const group = this.page.chartArray.find((i) => i.config.slug === this.slug);

    group.data = this.prepareData(this.page.main.data.collection());

    this.tabs.redraw();

    for (const graph of group.graphs) {
      graph.ctrlr.update(group.data, true);
    }

    this.populateTable(group.data);

    this.populateDefinitions(group.data.definitions);
  }
}
