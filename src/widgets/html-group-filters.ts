import type { IGroupCtrlr } from "../shared/interfaces";
import { segmentParse } from "../shared/segment";
import type { Segment } from "../shared/types";
import { HtmlMappingGroupSelector } from "./mapping-group-selector";
import { HtmlMonthSelector } from "./month-selector";
import { HtmlMunicipalitySelector } from "./municipality-selector";
import { HtmlDomeinSelector } from "./domein-selector";
import { HtmlRegelingSelector } from "./regeling-selector";
import { HtmlPeriodSelector } from "./period-selector";
import { HtmlSpecialsSelector } from "./specials-selector";
import { HtmlTotalvsRecentSelector } from "./total-recent-selector";
import {
  getGroupSegment,
  getGraphSegment,
  updateGraphSegment,
  cascadeGroupSegmentUpdate,
  pageSegment$,
  updatePageSegment,
} from "../stores/segment.store";
import { getAllData } from "../stores/data.store";
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
          case "cumulativeVsDelta": {
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

              cascadeGroupSegmentUpdate(groupSlug, {
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
                cascadeGroupSegmentUpdate(groupSlug, {
                  periodization: __selectEl.value,
                });

                this.ctrlr.update(getAllData(), undefined, true);
              }
            });

            break;
          }

          case "mappingSelect":
            break;

          case "domeinSelect": {
            // Graphs opt into the group-level domein selector by declaring
            // `domein` in their config segment (e.g. fs_cijfer_domein,
            // domein_trend). Graphs without it — like the all-domains numbers
            // comparison — are deliberately excluded: the selector never
            // touches their segment.
            const optIns = (this.ctrlr.config.graphs ?? []).filter(
              (g: any) => g.segment?.domein,
            );
            const firstOptIn = optIns.length ? optIns[0].slug : undefined;

            const selector = new HtmlDomeinSelector(
              this.ctrlr as any, // ctrlr is unused by the selector itself
              li,
              this.ctrlr.slug,
            );
            const initial =
              (firstOptIn
                ? getGraphSegment(groupSlug, firstOptIn)?.domein
                : undefined) ??
              getGroupSegment(groupSlug)?.domein;
            const selectEl = selector.draw(initial);

            if (selectEl === null) break;

            selectEl.addEventListener("change", () => {
              if (selectEl === null) return;

              for (const g of optIns) {
                const current = getGraphSegment(groupSlug, g.slug);
                if (!current) continue;
                updateGraphSegment(groupSlug, g.slug, {
                  domein: selectEl.value,
                });
              }

              this.ctrlr.update(getAllData(), undefined, true);
            });

            break;
          }

          case "regelingSelect": {
            // Same pattern as domeinSelect: graphs opt into the group-level
            // regeling selector by declaring `regeling` in their config
            // segment (mw_cijfer_regeling + regeling_trend here). Every
            // opted-in graph's segment.regeling is rewritten on change — the
            // merged data already carries the per-regeling columns, so no
            // refetch happens.
            const optIns = (this.ctrlr.config.graphs ?? []).filter(
              (g: any) => g.segment?.regeling,
            );
            const firstOptIn = optIns.length ? optIns[0].slug : undefined;

            const selector = new HtmlRegelingSelector(
              this.ctrlr as any, // ctrlr is unused by the selector itself
              li,
              this.ctrlr.slug,
            );
            const initial =
              (firstOptIn
                ? getGraphSegment(groupSlug, firstOptIn)?.regeling
                : undefined) ??
              getGroupSegment(groupSlug)?.regeling;
            const selectEl = selector.draw(initial);

            if (selectEl === null) break;

            selectEl.addEventListener("change", () => {
              if (selectEl === null) return;

              for (const g of optIns) {
                const current = getGraphSegment(groupSlug, g.slug);
                if (!current) continue;
                updateGraphSegment(groupSlug, g.slug, {
                  regeling: selectEl.value,
                });
              }

              this.ctrlr.update(getAllData(), undefined, true);
            });

            break;
          }

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