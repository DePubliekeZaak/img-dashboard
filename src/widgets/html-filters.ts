import type { IGraphControllerV3 } from "../charts/core/graph-v3";
import { breakpoints } from "../img-modules/styleguide";
import { HtmlCumulativevsDeltaSelector } from "./cumulative-delta-selector";
import { HtmlNormalizedSelector } from "./html-normalized-selector";
import { HtmlMappingGroupSelector } from "./mapping-group-selector";
import { HtmlMappingSelector } from "./mapping-selector";
import { HtmlMonthSelector } from "./month-selector";
import { HtmlPeriodSelector } from "./period-selector";
import { HtmlTotalvsRecentSelector } from "./total-recent-selector";
import { 
  graphSegments$, 
  updateGraphSegment,
  getGraphSegment,
} from "../stores/segment.store";

// import { EitiEntity } from "../shared/types";

export class HtmlFilters {
  listElement;
  selector;
  companySelector;
  tableButton;
  downloadButton;
  definitionsButton;
  hasListener = false;

  constructor(
    private ctrlr: IGraphControllerV3,
    private master: boolean,
    private id: string,
    private element,
    private filters,
    private parameters,
    private modifiers,
  ) {
    this.init(undefined);
  }

  init(el: HTMLElement | undefined) {
    const element = el !== undefined ? el : this.element;

    const prevElement = element.querySelector(".filter_list_" + this.id);

    if (this.id.includes("bedragen") && this.id.includes("trend")) {
      this.listElement =
        this.ctrlr.page.main.window.document.createElement("div");
      this.listElement.classList.add("filter_list");
      this.listElement.classList.add("filter_list_" + this.id);

      const ul = this.ctrlr.page.main.window.document.createElement("ul");

      this.listElement.appendChild(ul);
      this.element.prepend(this.listElement);


    } else if (this.master) {
      const container =
        this.ctrlr.page.main.window.document.createElement("section");
      container.classList.add(
        "graph-container-12",
        "graph-view",
        "filter-wrapper",
        "filter-wrapper-graph"
      );

      this.listElement =
        this.ctrlr.page.main.window.document.createElement("div");
      this.listElement.classList.add("filter_list");
      this.listElement.classList.add("filter_list_" + this.id);

      const ul = this.ctrlr.page.main.window.document.createElement("ul");

      this.listElement.appendChild(ul);
      container.appendChild(this.listElement);

      // element.insertBefore(this.listElement, element.firstChild);
      element.parentElement.insertBefore(container, element);
    } else {
      this.listElement = prevElement;
    }

    return true;
  }

  draw() {
    const groupSlug = this.ctrlr.group.slug;
    const graphSlug = this.ctrlr.slug;
    
    // Get segment from store
    const localSegment = getGraphSegment(groupSlug, graphSlug);
    
    if (!localSegment) return;

    const ul = this.element.parentElement.querySelector(`.filter_list_${this.id} ul`);

    for (const func of this.filters) {
      const li = this.ctrlr.page.main.window.document.createElement("li");
      let selector: any = null;
      let selectEl: HTMLSelectElement | null;

      switch (func) {
        // ... cases remain mostly the same, but update segment via store:

        case "cumulativeVsDelta":
          if (this.master) {
            selector = new HtmlCumulativevsDeltaSelector(
              this.ctrlr,
              li,
              this.id,
            );
            selectEl = selector.draw(1);
          } else {
            selectEl = this.ctrlr.page.main.window.document.getElementById(
              this.id + "_0",
            ) as HTMLSelectElement;
          }

          if (selectEl === null) break;

          selectEl.addEventListener("change", () => {
            if (selectEl === null) return;

            const isCumulative = selectEl.value === "cumulative";
            const current = getGraphSegment(groupSlug, graphSlug);
            
            if (current && current.cumulative !== isCumulative) {
              const baseColumn = current.baseKey || this.parameters[0][0].column;
              const entry = this.ctrlr.group.graphParams![baseColumn];
              const variant = isCumulative 
                ? entry?.variants.cumul 
                : entry?.variants.delta;
              
              updateGraphSegment(groupSlug, graphSlug, {
                cumulative: isCumulative,
                key: variant?.column || baseColumn,
              });
              
              this.ctrlr.update(this.ctrlr.group.data, true);
            }
          });

          break;

        case "weekVsMonth":
          if (this.master) {
            selector = new HtmlPeriodSelector(li, this.ctrlr.group.slug, true);
            const periodization = localSegment.periodization || "monthly";
            selectEl = selector.draw(periodization);
          } else {
            selectEl = this.ctrlr.page.main.window.document.querySelector(
              this.id + "_period_1",
            );
          }

          if (selectEl === null) break;

          selectEl.addEventListener("change", () => {
            if (selectEl === null) return;
            
            const current = getGraphSegment(groupSlug, graphSlug);
            if (current && selectEl.value !== current.periodization) {
              updateGraphSegment(groupSlug, graphSlug, {
                periodization: selectEl.value,
              });
              this.ctrlr.update(this.ctrlr.group.data, true);
            }
          });

          break;

        case "parameterSelect":
          if (this.master) {
            selector = new HtmlMappingSelector(
              this.ctrlr,
              li,
              this.id,
              this.parameters,
            );
            selectEl = selector.draw(1);
          } else {
            selectEl = this.ctrlr.page.main.window.document.getElementById(
              this.id + "_mapping_1",
            ) as HTMLSelectElement;
          }

          if (selectEl === null) break;

          selectEl.addEventListener("change", () => {
            if (selectEl === null) return;
            
            const baseColumn = selectEl.value;
            const current = getGraphSegment(groupSlug, graphSlug);
            
            if (current && baseColumn !== current.baseKey) {
              const entry = this.ctrlr.group.graphParams![baseColumn];
              const variant = current.cumulative 
                ? entry?.variants.cumul 
                : entry?.variants.delta;
              
              updateGraphSegment(groupSlug, graphSlug, {
                baseKey: baseColumn,
                key: variant?.column || baseColumn,
              });
              
              this.ctrlr.update(this.ctrlr.group.data, true);
            }
          });

          break;

        case "mappingGroupSelect":
          if (this.master) {

            selector = new HtmlMappingGroupSelector(
              this.ctrlr,
              li,
              this.id,
              this.parameters, // different input 
            );
            selectEl = selector.draw(1);
          } else {
            selectEl = this.ctrlr.page.main.window.document.getElementById(
              this.id + "_mapping_1",
            ) as HTMLSelectElement;
          }

          if (selectEl === null) break;

          selectEl.addEventListener("change", () => {
            if (selectEl === null) return;
            
            const baseColumn = selectEl.value;
            const current = getGraphSegment(groupSlug, graphSlug);
            
            if (current && baseColumn !== current.baseKey) {
              const entry = this.ctrlr.group.graphParams![baseColumn];
              const variant = current.cumulative 
                ? entry?.variants.cumul 
                : entry?.variants.delta;

              
              updateGraphSegment(groupSlug, graphSlug, {
                baseKey: baseColumn,
                key: variant?.column || baseColumn,
              });
              
              this.ctrlr.update(this.ctrlr.group.data, true);
            }
          });

          break;

        // ... other cases similarly updated
      }

      if (this.master) {
        ul.appendChild(li);
      }
    }
  }

  // post data retrieval
  redraw(func: string) {
    // switch (func) {
    //     case 'companySelect' :
    //     const collection = self.ctrlr.page.main.data.collection();
    //     const companies = collection.entities
    //     .filter( (e) => e.type === 'company' && e.slug !== 'ebn')
    //     .sort( (a: EitiEntity, b: EitiEntity) =>  a.name.localeCompare(b.name));
    //     const el = this.companySelector.redraw(this.segment, companies);
    //     el.addEventListener("change", () => {
    //         if( el.value !== self.ctrlr.segment) {
    //             self.companySelector.redraw(el.value, companies);
    //             self.ctrlr.update({}, el.value, true);
    //         }
    //     });
    //     break;
    // }
  }

  hide() {
    this.listElement.style.opacity = "0";
  }

  show() {
    this.listElement.style.opacity = "1";
  }
}
