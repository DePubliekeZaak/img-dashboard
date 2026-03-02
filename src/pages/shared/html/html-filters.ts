import type { IGraphControllerV3 } from "../../../charts/core/graph-v3";
import { breakpoints } from "../../../img-modules/styleguide";
import { HtmlCumulativevsDeltaSelector } from "./cumulative-delta-selector";
import { HtmlNormalizedSelector } from "./html-normalized-selector";
import { HtmlMappingGroupSelector } from "./mapping-group-selector";
import { HtmlMappingSelector } from "./mapping-selector";
import { HtmlMonthSelector } from "./month-selector";
import { HtmlPeriodSelector } from "./period-selector";
import { HtmlTotalvsRecentSelector } from "./total-recent-selector";

// import { EitiEntity } from "../types";

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

    const prevElement = element.querySelector(".filter_list");

    if (this.id.includes("bedragen") && this.id.includes("trend")) {
      console.log(this.id);
      this.listElement =
        this.ctrlr.page.main.window.document.createElement("div");
      this.listElement.classList.add("filter_list");

      const ul = this.ctrlr.page.main.window.document.createElement("ul");

      this.listElement.appendChild(ul);
      console.log(this.element);
      this.element.prepend(this.listElement);
    } else if (this.master) {
      const container =
        this.ctrlr.page.main.window.document.createElement("section");
      container.classList.add(
        "graph-container-12",
        "graph-view",
        "filter-wrapper",
      );

      this.listElement =
        this.ctrlr.page.main.window.document.createElement("div");
      this.listElement.classList.add("filter_list");

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
    // Ensure segment structure exists
    if (!this.ctrlr.page.segment.groups[this.ctrlr.group.slug]) {
      this.ctrlr.page.segment.groups[this.ctrlr.group.slug] = { graphs: {} };
    }
    if (!this.ctrlr.page.segment.groups[this.ctrlr.group.slug].graphs) {
      this.ctrlr.page.segment.groups[this.ctrlr.group.slug].graphs = {};
    }

    const localSegment =
      this.ctrlr.page.segment.groups[this.ctrlr.group.slug].graphs[
        this.ctrlr.slug
      ];
    const ul = this.element.parentElement.querySelector(".filter_list ul");

    for (const func of this.filters) {
      const li = this.ctrlr.page.main.window.document.createElement("li");
      let selector: any = null;
      let selectEl: HTMLSelectElement | null;

      switch (func) {
        case "modifier":
          if (this.modifiers !== undefined) {
            if (this.master) {
              selector = new HtmlMappingSelector(
                this.ctrlr,
                li,
                this.id,
                this.modifiers,
              );
              selectEl = selector.draw(this.ctrlr.page.segment, 1);
            }

            selectEl = this.ctrlr.page.main.window.document.querySelector(
              this.id + "_1",
            );

            if (selectEl === null) break;

            selectEl.addEventListener("change", () => {
              // @ts-expect-error
              const newValue = selectEl.value.replace("{}", this.segment.key);

              if (newValue !== this.ctrlr.segment.key) {
                this.ctrlr.update(this.ctrlr.group.data, true);
              }
            });
          }

          break;

        case "totaalVsRecent": {
          // fixed
          if (this.master) {
            selector = new HtmlTotalvsRecentSelector(this.ctrlr, li, this.id);
            selectEl = selector.draw(1);
          } else {
            selectEl = this.ctrlr.page.main.window.document.getElementById(
              this.id + "_1",
            ) as HTMLSelectElement;
          }

          if (selectEl === null) break;

          function strip(s: string) {
            return s.replace(/_cumulatief$/, "");
          }

          selectEl.addEventListener("change", () => {
            if (selectEl !== null) {
              if (localSegment.cumulative !== selectEl.value) {
                localSegment.cumulative =
                  selectEl.value === "cumulative" ? true : false;
                localSegment.key =
                  selectEl.value === "cumulative"
                    ? strip(localSegment.key) + "_cumulatief"
                    : strip(localSegment.key);
                this.ctrlr.update(this.ctrlr.group.data, true);
              }
            }
          });

          break;
        }

        case "cumulativeVsDelta": // fixed
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
            if (selectEl !== null) {
              if (localSegment.cumulative !== selectEl.value) {
                if (localSegment.key.includes("voorraad")) {
                  localSegment.cumulative = true;
                  localSegment.key =
                    localSegment.key.replace("_cumulatief", "") + "_cumulatief";
                } else {
                  localSegment.cumulative =
                    selectEl.value === "cumulative" ? true : false;
                  localSegment.key =
                    selectEl.value === "cumulative"
                      ? localSegment.key.replace("_cumulatief", "") +
                        "_cumulatief"
                      : localSegment.key.replace("_cumulatief", "");

                  this.ctrlr.update(this.ctrlr.group.data, true);
                }
              }
            }
          });

          break;

        // could this and follwing both be done with above, using modifiers as mapping
        case "monthSelect":
          if (this.master) {
            selector = new HtmlMonthSelector(
              this.ctrlr,
              li,
              this.ctrlr.group.slug,
              this.ctrlr.group.data.graphDataMonth,
            );
            selectEl = selector.draw();
          } else {
            selectEl = this.ctrlr.page.main.window.document.querySelector(
              this.id + "_0",
            );
          }

          if (selectEl === null) break;

          selectEl.addEventListener("change", () => {
            if (selectEl !== null) {
              if (selectEl.value !== this.ctrlr.segment.key) {
                if (selectEl.value === "all") {
                  localSegment.cumulative = true;
                  localSegment.key = "all";
                } else {
                  localSegment.cumulative = false;
                  localSegment.key = selectEl.value;
                }
                this.ctrlr.update(this.ctrlr.group.data, true);
              }
            }
          });

          break;

        case "weekVsMonth": // fixed
          if (this.master) {
            selector = new HtmlPeriodSelector(li, this.ctrlr.group.slug, true);
            const periodization = localSegment
              ? localSegment.periodization
              : "monthly";
            selectEl = selector.draw(periodization);
          } else {
            selectEl = this.ctrlr.page.main.window.document.querySelector(
              this.id + "_period_1",
            );
          }

          if (selectEl === null) break;

          selectEl.addEventListener("change", () => {
            if (selectEl !== null) {
              if (selectEl.value !== localSegment.periodization) {
                localSegment.periodization = selectEl.value;
                this.ctrlr.update(this.ctrlr.group.data, true);
              }
            }
          });

          break;

        case "parameterSelect": // fixed
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
            if (selectEl !== null) {
              if (selectEl.value !== localSegment.key) {
                if (
                  localSegment.cumulative ||
                  selectEl.value.includes("voorraad")
                ) {
                  localSegment.key = selectEl.value + "_cumulatief";
                } else {
                  localSegment.key = selectEl.value.replace("_cumulatief", "");
                }

                this.ctrlr.update(this.ctrlr.group.data, true);
              }
            }
          });

          break;

        case "mappingGroupSelect": {
          // fixed
          const __selector = new HtmlMappingGroupSelector(
            this.ctrlr,
            li,
            this.ctrlr.slug,
            this.parameters,
          );
          const __selectEl = __selector.draw(1);

          __selectEl.addEventListener("change", () => {
            if (localSegment.parameterIndex !== parseInt(__selectEl.value)) {
              localSegment.parameterIndex = parseInt(__selectEl.value);
              this.ctrlr.update(this.ctrlr.group.data, true);
            }
          });

          break;
        }

        case "absoluteVsNormalized": {
          // fixed
          const ___selector = new HtmlNormalizedSelector(
            this.ctrlr,
            li,
            this.ctrlr.slug,
            this.parameters,
          );
          const ___selectEl = ___selector.draw(1);

          ___selectEl.addEventListener("change", () => {
            const b = ___selectEl.value === "normalized" ? true : false;

            if (localSegment.normalized !== b) {
              localSegment.normalized = b;
              this.ctrlr.update(this.ctrlr.group.data, true);
            }
          });

          break;
        }
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
