import type { IDashboardController } from "../../browser/dashboard/dashboard.controller";
import type { Version } from "../../browser/dashboard/types";
import type { GraphControllerV3 } from "../../charts/core/graph-v3";
import cms_content from "../../json/groups.json";
import { HtmlPageFilters } from "./html/html-page-filters";
import {
  type GroupObject,
  type IGroupMappingV2,
  type IPageConfig,
} from "./interfaces";
import { Segment } from "./types";
import {
  initSegments,
  cascadeSegmentUpdate,
  pageSegment$,
  isLoading$,
  updateGraphSegment,
  getGraphSegment,
} from "../../stores/segment.store";
import {
  getAllData,
  clearData,
} from "../../stores/data.store";

export interface IPageController {
  main: IDashboardController;
  slug: string;
  config: IPageConfig;
  chartArray: any[];
  init: (config: any, groups: any, graphs: any, version: Version) => void;
  initHtml: () => void;
  gatherData: (version: Version) => void;
  prepareData: () => void;
  tables: () => void;
  initGraphs: () => void;
  onFilterChange: (updates: Partial<Segment>) => void;
}

export default class PageController implements IPageController {
  main: IDashboardController;
  slug: string;
  config!: IPageConfig;
  chartArray: any[] = [];
  pageFilters!: HtmlPageFilters;

  constructor(main: IDashboardController) {
    this.main = main;
    this.slug = main.params.topic;
  }

  mergeWithCMSContent(cms_content: any, c: IGroupMappingV2) {
    const groupContent = cms_content.find(
      (g: any) => g.slug.trim() === c.slug.trim(),
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

    // Initialize segment store from config
    initSegments(config);

    for (let c of config.groups) {
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
        tableParams: [],
        graphParams: {},
        resolvedEndpoints: [],
      };

      const { tableParams, graphParams } = g.ctrlr.paramsAndModifiers();
      g.tableParams = tableParams;
      g.graphParams = graphParams;

      const el = g.ctrlr.html();
      if (el !== undefined) {
        g.element = el;
      }

      let i = 0;

      for (const graph of c.graphs) {
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
          segment: graph.segment,  
          classList: graph.classList || [],
          ctrlr: new graphs[graph.ctrlr](
            graph.slug,
            this,
            g,
            g.data,
            graph.parameters,
            graph.modifiers,
            graph.filters,
            i,
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
      // Setup if needed
    }
  }

  initPageFilters() {
    const segment = pageSegment$.get();
    if (segment.gemeente !== undefined) {
      this.pageFilters = new HtmlPageFilters(this);
      this.pageFilters.draw();
    }
  }

  async gatherData(version: Version) {
    const segment = pageSegment$.get();

    for (const group of this.chartArray) {
      const endpoints = group.config.endpoints?.length
        ? group.config.endpoints
        : this.config.endpoints;

      // Store resolved endpoints on the group for later lookup
      group.resolvedEndpoints = endpoints.map((ep: string) =>
        this.main.data.addVarsToEndpoint(ep, segment)
      );

      for (const endpoint of group.resolvedEndpoints) {
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
      const data = getAllData();
      const endpoint = Object.keys(data).find((d) => d.includes("eq.week"));

      if (endpoint && data[endpoint]?.[0]) {
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
    const data = getAllData();
    for (const group of this.chartArray) {
      group.data = group.ctrlr.prepareData(data);
    }
  }

  tables() {
    for (const group of this.chartArray) {
      if (group.data !== undefined) {
        group.ctrlr.populateTable(group.data);
      }
    }
  }

  definitions() {
    for (const group of this.chartArray) {
      if (group.data?.definitions !== undefined) {
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
    const { default: graphs } = await import("../" + this.slug + "/graphs/");

    for (const group of this.chartArray) {
      const newGraphs: { slug: string; ctrlr: GraphControllerV3 }[] = [];

      for (const graph of group.graphs) {
        if (graph.multiples && group.data[graph.multiples] !== undefined) {
          let i = 0;

          // Get the original graph's segment as template
          const templateSegment = getGraphSegment(group.slug, graph.slug);

          for (const m of group.data[graph.multiples]) {
            const slug = graph.slug + "_mult" + i;
            const data = Object.assign({}, group.data);

            // Initialize segment for this multiple
            if (templateSegment) {
              updateGraphSegment(group.slug, slug, { ...templateSegment });
            }

            newGraphs.push({
              slug,
              ctrlr: new graphs[graph.ctrlrName](
                slug,
                this,
                group,
                data,
                graph.parameters,
                graph.modifiers,
                graph.filters,
                i,
              ),
            });

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
    // Show loading state
    isLoading$.set(true);
    for (const group of this.chartArray) {
      group.element.style.opacity = "0.5";
      group.element.style.pointerEvents = "none";
    }

    // Cascade segment updates through store
    cascadeSegmentUpdate(updates);

    // Clear and refetch data
    clearData();
    await this.gatherData(this.main.params.version);

    // Re-render
    this.prepareData();

    // Update each group
    for (const group of this.chartArray) {
      group.ctrlr.update(group.data, true);
      group.element.style.opacity = "1";
      group.element.style.pointerEvents = "auto";
    }

    isLoading$.set(false);
  }
}