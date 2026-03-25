import type { IDashboardController } from "../../browser/dashboard/dashboard.controller";
import type { Version } from "../../browser/dashboard/types";
import type { GraphControllerV3 } from "../../charts/core/graph-v3";
import cms_content from "../../json/groups.json";
import { HtmlPageFilters } from "./html/html-page-filters";
import {
  type GroupObject,
  IGraphMappingV2,
  type IGroupMappingV2,
  type IPageConfig,
} from "./interfaces";
import { Segment } from "./types";

export interface IPageController {
  main: IDashboardController;
  slug: string;
  config: IPageConfig;
  chartArray: any[];
  segment: any;
  init: (config: any, groups: any, graphs: any, version: Version) => void;
  initHtml: () => void;
  gatherData: (version: Version) => void;
  prepareData: () => void;
  tables: () => void;
  initGraphs: () => void;
  onFilterChange: (updates: Partial<Segment>) => void
}

export default class PageController implements IPageController {
  main: IDashboardController;
  slug: string;
  config: IPageConfig; // nieuw
  chartArray: any[] = [];
  segment: any;
  pageFilters: HtmlPageFilters;

  constructor(main: IDashboardController) {
    this.main = main;
    this.slug = main.params.topic;
  }

  mergeWithCMSContent(cms_content: any, c: IGroupMappingV2) {
    const groupContent = cms_content.find(
      (g) => g.slug.trim() === c.slug.trim(),
    );

    if (groupContent === undefined) return c;

    c.header = groupContent.header || "";
    c.datum = groupContent.datum || undefined;
    c.description = groupContent.description || "";
    c.definitions = groupContent.definitions || [];
    c.timeline = groupContent.timeline || [];

    return c;
  }

  async init(config: any, groups: any, graphs: any, version: Version) {
    this.config = config;
    

    // Page-level segment met groups object
    this.segment = {
      ...config.segment,
      groups: {},
    };

    for (let c of config.groups) {
      // Merge page -> group segment
      const groupSegment = {
        ...config.segment,
        ...(typeof c.segment === "object" ? c.segment : {}),
      };

      this.segment.groups[c.slug] = {
        ...groupSegment,
        graphs: {},
      };

      c = this.mergeWithCMSContent(cms_content.groups, c);

      let j = 0;

      const g: GroupObject = {
        slug: c.slug,
        splice: c.splice,
        ctrlr: new groups[c.ctrlr](this, c, j),
        graphs: [],
        filters: c.filters,
        config: c,
        element: document.createElement("div") as HTMLElement,
        data: {},
      };

      const el = g.ctrlr.html();
      if (el !== undefined) {
        g.element = el;
      }

      let i = 0;

      for (const graph of c.graphs) {
        // Merge page -> group -> graph segment
        const graphSegment = {
          ...groupSegment,
          ...(graph.segment || {}),
        };

        this.segment.groups[c.slug].graphs[graph.slug] = graphSegment;

        g.graphs.push({
          slug: graph.slug,
          multiples:
            graph.multiples === undefined || !graph.multiples
              ? false
              : graph.multiples,
          ctrlrName: graph.ctrlr,
          header: graph.header ?? undefined,
          parameters: graph.parameters,
          modifiers: graph.modifiers,
          filters: graph.filters,
          segment: graphSegment,
          classList: graph.classList || [],
          ctrlr: new graphs[graph.ctrlr](
            graph.slug,
            this,
            g,
            g.data,
            graph.parameters,
            graph.modifiers,
            graph.filters,
            graphSegment,
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
    this.initPageFilters();
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

  initPageFilters() {
    if (this.segment.gemeente !== undefined) {
      this.pageFilters = new HtmlPageFilters(this);
      this.pageFilters.draw();
    }
  }

  async gatherData(version: Version) {
    for (const group of this.chartArray) {
      const endpoints = group.config.endpoints || this.config.endpoints;
      
      for (const endpoint of endpoints) {
        if (endpoint !== "") {
          await this.main.data.gather(endpoint, version);
        }
      }
    }
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
      if (group.data !== undefined && group.data !== undefined) {
        group.ctrlr.populateTable(group.data);
      }
    }
  }

  definitions() {
    for (const group of this.chartArray) {
      if (group.data !== undefined && group.data.definitions !== undefined) {
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
        if (graph.ctrlr === null) return;

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
    // dit zorgt voor die wildwas aan files .. is dit wel nodig?
    const { default: graphs } = await import("../" + this.slug + "/graphs/");

    for (const group of this.chartArray) {
      const newGraphs: { slug: string; ctrlr: GraphControllerV3 }[] = [];

      for (const graph of group.graphs) {
        // dit moet wel verzorgd worden in group
        if (graph.multiples && group.data[graph.multiples] !== undefined) {
          let i = 0;

          for (const m of group.data[graph.multiples]) {
            const slug = graph.slug + "_mult" + i;

            const data = Object.assign({}, group.data);

            const segment = graph.segment || group.config.segment;

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

            // Ensure segment.groups[group.slug] and graphs property exist
            if (!this.segment.groups[group.slug]) {
              this.segment.groups[group.slug] = {};
            }
            if (!this.segment.groups[group.slug].graphs) {
              this.segment.groups[group.slug].graphs = {};
            }

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


  async onFilterChange(updates: Partial<Segment>) {
    // Update page segment
    Object.assign(this.segment, updates);

    
    // Cascade naar groups/graphs
    for (const groupSlug of Object.keys(this.segment.groups)) {
      Object.assign(this.segment.groups[groupSlug], updates);
      const graphs = this.segment.groups[groupSlug].graphs;
      if (graphs) {
        for (const graphSlug of Object.keys(graphs)) {
          Object.assign(graphs[graphSlug], updates);
        }
      }
    }
   
    this.main.data.clear();
    await this.gatherData(this.main.params.version);
    
    // Re-render met bestaande graphs
    this.prepareData();
    
    // Update elke group
    for (const group of this.chartArray) {
      group.ctrlr.update(group.data, this.segment, true);
    }
  }
}
