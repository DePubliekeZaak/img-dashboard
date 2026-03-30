import type { IPageController } from "../page.controller";
import { HtmlDateSelector } from "./date-selector";
import { HtmlMunicipalitySelector } from "./municipality-selector";
import {
  pageSegment$,
  updatePageSegment,
  cascadeSegmentUpdate,
} from "../../../stores/segment.store";

export class HtmlPageFilters {
  listElement!: HTMLElement;

  constructor(private ctrlr: IPageController) {
    this.ctrlr = ctrlr;
    this.init();
  }

  init() {
    const container = document.querySelector(".page_header");

    if (container !== null) {
      const prevElement = container.querySelector(".page_filter_list_group");

      if (prevElement) {
        prevElement.remove();
      }
      this.listElement = this.ctrlr.main.window.document.createElement("div");
      this.listElement.classList.add("page_filter_list_group");
      const ul = this.ctrlr.main.window.document.createElement("ul");
      this.listElement.appendChild(ul);
      container.appendChild(this.listElement);
    }

    return true;
  }

  strip(s: string) {
    return s.replace(/_cumulatief$/, "");
  }

  draw() {
    const ul = this.listElement.querySelector("ul");
    if (!ul) return;

    if (this.ctrlr.config.filters !== undefined) {
      for (const func of this.ctrlr.config.filters) {
        const li = this.ctrlr.main.window.document.createElement("li");

        switch (func) {
          case "gemeenten": {
            const pageSegment = pageSegment$.get();

            const muniSelector = new HtmlMunicipalitySelector(
              this.ctrlr,
              li,
              this.ctrlr.slug,
            );
            const muniSelectEl = muniSelector.draw(pageSegment, 1);

            muniSelectEl.addEventListener("change", () => {
              const current = pageSegment$.get();

              if (muniSelectEl.value !== current.gemeente) {
                this.ctrlr.onFilterChange({ gemeente: muniSelectEl.value });
              }
            });

            break;
          }

          case "vanaf": {
            const pageSegment = pageSegment$.get();

            const startDateSelector = new HtmlDateSelector(
              this.ctrlr,
              li,
              this.ctrlr.slug,
            );
            const startDateSelectorEl = startDateSelector.draw(pageSegment, 1);

            startDateSelectorEl.addEventListener("change", () => {
              const current = pageSegment$.get();

              if (startDateSelectorEl.value !== current.vanaf) {
                this.ctrlr.onFilterChange({ vanaf: startDateSelectorEl.value });
              }
            });

            break;
          }
        }

        ul.appendChild(li);
      }
    }
  }

  redraw() {}
}