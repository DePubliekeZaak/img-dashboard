import { IDashboardController } from "../../browser/dashboard/dashboard.controller";
import { GroupObject, IGroupMappingV2, IGraphMappingV2 } from "./interfaces";
import { GraphControllerV3 } from "../../charts/core/graph-v3";
import cms_content from "../../json/groups.json" assert { type: "json" };
import { Version } from "../../browser/dashboard/types";

export interface IPageController {
  main: IDashboardController;
  slug: string;
  chartArray: any[];
  segment: any;
  init: (config: any, groups: any, graphs: any, version: Version) => void;
  initHtml: () => void;
  gatherData: (version: Version) => void;
  prepareData: () => void;
  tables: () => void;
  initGraphs: () => void;
}

export default class PageController implements IPageController {
  main: IDashboardController;
  slug: string;
  chartArray: any[] = [];
  segment: any;

  constructor(main: IDashboardController) {
    this.main = main;
    this.slug = main.params.topic;
    this.segment = {
      gemeente: main.params.topic == "gemeente" ? "Groningen" : "all",
      groups: {},
    };
  }

  mergeWithCMSContent(cms_content: any[], c: IGroupMappingV2) {
    let groupContent = cms_content.find((g) => g.slug.trim() == c.slug.trim());

    if (groupContent == undefined) return c;

    c.header = groupContent.header || "";
    c.description = groupContent.description || "";
    c.definitions = groupContent.definitions || [];
    c.timeline = groupContent.timeline || [];

    return c;
  }

  async init(config: any, groups: any, graphs: any, version: Version) {
    for (let c of config) {
      this.segment.groups[c.slug] = c.segment || {};
      this.segment.groups[c.slug]["graphs"] = {};

      c = this.mergeWithCMSContent(cms_content, c);

      let j = 0;

      let g: GroupObject = {
        slug: c.slug,
        splice: c.splice,
        ctrlr: new groups[c.ctrlr](this, c, j),
        graphs: [],
        filters: c.filters,
        config: c,
        element: document.createElement("div") as HTMLElement,
        data: {},
      };

      let el = g.ctrlr.html();
      if (el != undefined) {
        g.element = el;
      }

      let i = 0;

      for (const graph of c.graphs) {
        let segment = graph.segment || g.config.segment;

        if (graph.segment && graph.multiples == undefined) {
          this.segment.groups[c.slug]["graphs"][graph.slug] = graph.segment;
        }

        g.graphs.push({
          slug: graph.slug,
          multiples:
            graph.multiples == undefined || !graph.multiples
              ? false
              : graph.multiples,
          ctrlrName: graph.ctrlr,
          parameters: graph.parameters,
          modifiers: graph.modifiers,
          filters: graph.filters,
          segment: segment,
          classList: graph.classList || [],
          ctrlr: new graphs[(this, graph.ctrlr)](
            graph.slug,
            this,
            g,
            g.data,
            graph.parameters,
            graph.modifiers,
            graph.filters,
            segment,
            i,
            this.segment,
          ),
        });

        i++;
      }

      j++;

      this.chartArray.push(g);
    }

    this.initHtml();
    await this.gatherData(version);
    this.addDateToPageHeader();
    this.prepareData();
    this.tables();
    this.definitions();
    this.descriptions();
    this.setTarget();

    this.setActiveTabs();
    this.setGroupFilters();
    await this.prepareMultiples();
    await this.initGraphs();
    this.armDownloads();
  }

  initHtml() {
    for (const group of this.chartArray) {
    }
  }

  async gatherData(version: Version) {
    for (const group of this.chartArray) {
      for (const endpoint of group.config.endpoints) {
        if (endpoint != "") {
          await this.main.data.gather(endpoint, version);
        }
      }
    }
    return;
  }

  addDateToPageHeader() {
    const span = document.querySelector(
      ".page_header .datum span",
    ) as HTMLElement;

    if (span) {
      const data = this.main.data.collection();
      const endpoint = Object.keys(data).find((d) => d.includes("wekelijks"));

      if (endpoint) {
        const date = new Date(data[endpoint][0]["_einddatum"]);
        const formattedDate = new Intl.DateTimeFormat("nl-NL", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(date);

        span.innerText = formattedDate;
      }
    }
  }

  prepareData() {
    for (const group of this.chartArray) {
      group.data = group.ctrlr.prepareData(this.main.data.collection());
    }
  }

  tables() {
    for (const group of this.chartArray) {
      if (group.data != undefined && group.data.table != undefined) {
        group.ctrlr.populateTable(group.data.table);
      }
    }
  }

  definitions() {
    for (const group of this.chartArray) {
      if (group.data != undefined && group.data.definitions != undefined) {
        group.ctrlr.populateDefinitions(group.data.definitions);
      }
    }
  }

  descriptions() {
    for (const group of this.chartArray) {
      group.ctrlr.populateDescription();
    }
  }

  setActiveTabs() {
    for (const group of this.chartArray) {
      group.ctrlr.armTabs();
    }
  }

  setGroupFilters() {
    for (const group of this.chartArray) {
      group.ctrlr.setFilters();
    }
  }

  setTarget() {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.replace("#", ""));
      el?.classList.add("visible");
    }
  }

  initGraphs() {
    for (const group of this.chartArray) {
      for (const graph of group.graphs) {
        if (graph.ctrlr == null) return;

        graph.ctrlr.html();
        graph.ctrlr.init();
      }
    }
  }

  armDownloads() {
    for (const group of this.chartArray) {
      group.ctrlr.armDownloads();
    }
  }

  async prepareMultiples() {
    const { default: graphs } = await import("../" + this.slug + "/graphs/");

    for (const group of this.chartArray) {
      const newGraphs: { slug: string; ctrlr: GraphControllerV3 }[] = [];

      for (const graph of group.graphs) {
        // dit moet wel verzorgd worden in group
        if (graph.multiples && group.data[graph.multiples] != undefined) {
          let i = 0;

          for (const m of group.data[graph.multiples]) {
            const slug = graph.slug + "_mult" + i;

            const data = Object.assign({}, group.data);

            let segment = graph.segment || group.config.segment;

            newGraphs.push({
              slug,
              ctrlr: new graphs[(this, graph.ctrlrName)](
                slug,
                this,
                group,
                data,
                graph.parameters,
                graph.modifiers,
                graph.filters,
                segment,
                i,
              ),
            });

            this.segment.groups[group.slug]["graphs"][slug] = graph.segment;

            i++;
          }
        } else {
          newGraphs.push(graph);
        }
      }

      if (group.splice) {
        const half = newGraphs.length / 2;
        const odd = newGraphs.slice(0, half);
        const even = newGraphs.slice(half, newGraphs.length);

        group.graphs = [];

        for (let i = 0; i < half; i++) {
          group.graphs.push(odd[i]);
          group.graphs.push(even[i]);
        }
      } else {
        group.graphs = newGraphs;
      }
    }
  }
}
