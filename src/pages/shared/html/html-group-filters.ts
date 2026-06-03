import type { IGroupCtrlr } from "../interfaces";
import { segmentParse } from "../segment";
import type { Segment } from "../types";
import { HtmlMappingGroupSelector } from "./mapping-group-selector";
import { HtmlMonthSelector } from "./month-selector";
import { HtmlMunicipalitySelector } from "./municipality-selector";
import { HtmlPeriodSelector } from "./period-selector";
import { HtmlSpecialsSelector } from "./specials-selector";
import { HtmlTotalvsRecentSelector } from "./total-recent-selector";
import {
  getGroupSegment,
  updateGroupSegment,
  pageSegment$,
  updatePageSegment,
} from "../../../stores/segment.store";
import { getAllData } from "../../../stores/data.store";
import { AnyNode } from "postcss";

export class HtmlGroupFilters {
  listElement: HTMLElement | null = null;
  selector: any;
  companySelector: any;
  tableButton: any;
  downloadButton: any;
  definitionsButton: any;
  hasListener = false;

  constructor(private ctrlr: IGroupCtrlr) {
    this.init(undefined);
  }

  init(el: HTMLElement | undefined, place?: string) {
    const element = el !== undefined ? el : this.ctrlr.groupWrapper;

    if (element !== null) {
      const prevElement = element.querySelector(".filter_list_group");

      if (prevElement) {
        prevElement.remove();
      }
      this.listElement =
        this.ctrlr.page.main.window.document.createElement("div");
      this.listElement.classList.add("filter_list_group");

      const ul = this.ctrlr.page.main.window.document.createElement("ul");

      this.listElement.appendChild(ul);

      element.querySelector(".source_attribution")?.after(this.listElement);
    }

    return true;
  }

  strip(s: string) {
    return s.replace(/_cumulatief$/, "");
  }

  draw(segment: string | Segment) {
    if (!this.listElement) return;
    
    const ul = this.listElement.querySelector("ul");
    if (!ul) return;

    const groupSlug = this.ctrlr.slug;

    if (this.ctrlr.config.filters !== undefined) {
      for (const func of this.ctrlr.config.filters) {
        const li = this.ctrlr.page.main.window.document.createElement("li");

        let selectEl;

        switch (func) {
          case "totaalVsRecent": {
            const _selector = new HtmlTotalvsRecentSelector(
              this.ctrlr,
              li,
              this.ctrlr.slug,
            );
            const _selectEl = _selector.draw(1);

            _selectEl.addEventListener("change", () => {
              const current = getGroupSegment(groupSlug);
              if (!current) return;

              const isCumulative = _selectEl.value === "cumulative";
              const baseKey = this.strip(current.key);
           
              const entry = this.ctrlr.group.graphParams[baseKey];
              const newKey = isCumulative
                ? (entry?.variants?.cumul?.column ?? baseKey + "_cumulatief")
                : (entry?.variants?.delta?.column ?? baseKey);

              updateGroupSegment(groupSlug, {
                key: newKey,
                cumulative: isCumulative,
              });

              this.ctrlr.update(getAllData(), undefined, true);
            });

            break;
          }

          case "weekVsMonth": {
            const __selector = new HtmlPeriodSelector(li, this.ctrlr.slug);

            const current = getGroupSegment(groupSlug);
            const periodization = current?.periodization || "monthly";
            const __selectEl = __selector.draw(periodization);

            if (__selectEl === null) break;

            __selectEl.addEventListener("change", () => {
              const current = getGroupSegment(groupSlug);
              if (!current) return;

              if (__selectEl.value !== current.periodization) {
                updateGroupSegment(groupSlug, {
                  periodization: __selectEl.value,
                });

                this.ctrlr.update(getAllData(), undefined, true);
              }
            });

            break;
          }

          case "mappingSelect":
            break;

          case "monthSelect": {
            const data = getAllData();
            const selector = new HtmlMonthSelector(
              this.ctrlr,
              li,
              this.ctrlr.slug,
              data.graphDataMonth,
            );
            const selectEl = selector.draw(segment);

            selectEl.addEventListener("change", () => {
              const current = getGroupSegment(groupSlug);
              if (!current) return;

              if (selectEl.value !== current.key) {
                this.ctrlr.update(
                  getAllData(),
                  segmentParse(selectEl.value),
                  true,
                );
              }
            });

            break;
          }

          case "gemeente": {
            const pageSegment = pageSegment$.get();

            const muniSelector = new HtmlMunicipalitySelector(
              this.ctrlr,
              li,
              this.ctrlr.slug,
            );
            const muniSelectEl = muniSelector.draw(pageSegment, 1);

            muniSelectEl.addEventListener("change", () => {
              const currentPage = pageSegment$.get();

              if (muniSelectEl.value !== currentPage.gemeente) {
                updatePageSegment({ gemeente: muniSelectEl.value });

                this.ctrlr.update(getAllData(), undefined, true);
              }
            });

            break;
          }

          case "specials": {
            const pageSegment = pageSegment$.get();

            const spSelector = new HtmlSpecialsSelector(
              this.ctrlr,
              li,
              this.ctrlr.slug,
            );
            const spSelectEl = spSelector.draw(pageSegment, 0);

            spSelectEl.addEventListener("change", () => {
              const currentPage = pageSegment$.get();

              if (spSelectEl.value !== currentPage.specials) {
                updatePageSegment({ specials: spSelectEl.value });

                this.ctrlr.update(getAllData(), undefined, true);
              }
            });

            break;
          }
        }

        ul.appendChild(li);
      }
    }
  }

  redraw(func: string) {}

  hide() {
    if (this.listElement) {
      this.listElement.style.opacity = "0";
    }
  }

  show() {
    if (this.listElement) {
      this.listElement.style.opacity = "1";
    }
  }
}