import { HtmlTabs } from "./html/html-tabs";
import { HtmlHeader } from "./html/html-header";
import { HTMLTable } from "./html/html-table";
import { HTMLDefinitions } from "./html/html-definitions";
import { IGroupCtrlr, IGroupMappingV2, IParameterMapping } from "./interfaces";
import { DataObject, ImgData, Segment, TableData, Timeline } from "./types";
import { Definitions } from "./types_graphs";
import { removeDuplicates, trimColumnsAndOrder } from "./_helpers";
import { HtmlGroupFilters } from "./html/html-group-filters";
// import { definitionList } from "../definitions";
import definitionList from "../../json/definitions.json" assert { type: "json" };
import { timelineList } from "../timeline";
import { segmentParse } from "./segment";

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
  }

  html(groupEl?: HTMLElement) {
    if (this.element == null) return;

    if (groupEl == undefined) {
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
      this.page.main.params.language == "nl"
        ? this.config.header
        : this.config.header_en,
      this.page.main.params.language == "nl"
        ? this.config.description
        : this.config.description_en,
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

    if (this.config.functionality == undefined) return;

    if (
      this.config.functionality &&
      this.config.functionality.indexOf("table") > -1
    ) {
      this.table = new HTMLTable(this, this.groupWrapper);
    }

    if (
      this.config.functionality &&
      this.config.functionality.indexOf("definitions") > -1
    ) {
      this.definitions = new HTMLDefinitions(this, this.groupWrapper);
    }

    return this.graphWrapper != undefined ? this.graphWrapper : this.element;
  }

  prepareData(data: any): any {
    // console.log(data);

    const dataGroup = this.config.endpoints[0];
    const defaultColumns = [
      "_yearmonth",
      "_yearweek",
      "_month",
      "_week",
      "_year",
      "_startdatum",
      "_einddatum",
      "gemeente",
      "complete",
      "periodization",
    ];

    let tableParams = [] as IParameterMapping[];
    let graphParams = [] as IParameterMapping[];

    for (const graph of this.config.graphs) {
      for (const pg of graph.parameters) {
        for (const p of pg) {
          let columnNames = tableParams.map((p) => p.column);
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
      if (graph.modifiers != undefined) {
        for (const mg of graph.modifiers) {
          for (const m of mg) {
            if (m.column != "{}") {
              for (const p of JSON.parse(JSON.stringify(graphParams))) {
                if (p.column.includes("_cumulatief")) continue;
                let n: IParameterMapping = Object.assign({}, m);
                n.column = n.column.replace("{}", p.column);
                n.label = p.label;
                if (p.format != "" || p.format != undefined)
                  n.format = p.format;
                graphParams.push(n);
                let columnNames = tableParams.map((p) => p.column);
                if (!columnNames.includes(n.column)) {
                  tableParams.push(n);
                }
              }
            }
          }
        }
      }
    }

    tableParams = removeDuplicates(tableParams);

    // tableParams = tableParams.filter ( p => !p.column.includes("_cumulatief"))

    let graphData: any[] = [];
    let graphData_alt: any[] = [];

    if (dataGroup != undefined && data[dataGroup].length > 0) {
      graphData = trimColumnsAndOrder(
        data[dataGroup],
        graphParams.map((p) => p.column).concat(defaultColumns),
      );

      if (this.config.endpoints[1]) {
        graphData_alt = trimColumnsAndOrder(
          data[this.config.endpoints[1]],
          graphParams.map((p) => p.column).concat(defaultColumns),
        );
      } else {
        graphData_alt = graphData;
      }
    }

    let timeline: Timeline[] = [];

    if (
      this.config.timeline !== undefined &&
      this.config.timeline?.length > 0
    ) {
      // @ts-ignore
      timeline = timelineList.filter(
        (ti: Timeline) => this.config.timeline.indexOf(ti.label) > -1,
      );
      timeline.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    // @ts-ignore
    const definitions =
      this.config.definitions && this.config.definitions?.length > 0
        ? definitionList
            .filter((d) => this.config.definitions?.indexOf(d.name) > -1)
            .sort()
        : [];

    return {
      tableParams,
      graphParams,
      graphData,
      timeline,
      definitions,
      graphData_alt,
    };
  }

  populateTable(tableData: TableData) {
    if (
      this.config.functionality &&
      this.config.functionality.indexOf("table") > -1
    ) {
      this.table.draw(tableData);
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
    let currentData =
      this.config.endpoints[0] &&
      collection[this.config.endpoints[0]].length > 0
        ? collection[this.config.endpoints[0]][0]
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
    if (this.config.filters != undefined && this.config.filters.length > 0) {
      this.filters = new HtmlGroupFilters(this);
      this.filters.draw(this.segment);
    }
  }

  update(data: DataObject, segment: Segment | undefined, update: boolean) {
    console.log("update group new segment object", this.page.segment);

    if (segment != undefined) {
      this.segment = segment;
    }

    const group = this.page.chartArray.find((i) => i.config.slug === this.slug);

    group.data = this.prepareData(this.page.main.data.collection());

    this.tabs.redraw();

    this.htmlHeader.redraw(group.data);

    for (const graph of group.graphs) {
      graph.ctrlr.update(group.data, segment, false);
    }

    this.populateTable(group.data.table);

    this.populateDefinitions(group.data.definitions);
  }
}
