import type { IPageController } from "../shared/page.controller";
import { HtmlDateSelector } from "./date-selector";
import { HtmlMunicipalitySelector } from "./municipality-selector";
import {
  pageSegment$,
  updatePageSegment,
  cascadeSegmentUpdate,
} from "../stores/segment.store";

/**
 * Renders the page-level filters underneath the page title block.
 *
 * Two filter blocks are supported:
 *   1. An always-visible block built from `config.default_filters`.
 *   2. A collapsible block hidden behind a filter-icon toggle built from
 *      `config.filters` — only rendered when `default_filters` is present
 *      (i.e. the split is in effect).
 *
 * Backwards compatibility: when `default_filters` is ABSENT the legacy
 * behaviour is kept — all of `config.filters` are rendered in the
 * always-visible block and no toggle is shown.
 */
export class HtmlPageFilters {
  listElement!: HTMLElement;
  hiddenListElement!: HTMLElement;
  toggleElement!: HTMLButtonElement;

  constructor(private ctrlr: IPageController) {
    this.ctrlr = ctrlr;
    this.init();
  }

  init() {
    const container = document.querySelector(".page_header");

    if (container !== null) {
      const prevElements = container.querySelectorAll(
        ".page_filter_list_group, .page_filter_toggle",
      );
      prevElements.forEach((el) => el.remove());

      // Always-visible block (current spot, under the title block).
      this.listElement = this.ctrlr.main.window.document.createElement("div");
      this.listElement.classList.add("page_filter_list_group");
      const ul = this.ctrlr.main.window.document.createElement("ul");
      this.listElement.appendChild(ul);
      container.appendChild(this.listElement);

      // Hidden-behind-icon block — only when the split is in effect.
      if (this.ctrlr.config.default_filters !== undefined) {
        this.toggleElement = this.ctrlr.main.window.document.createElement(
          "button",
        );
        this.toggleElement.type = "button";
        this.toggleElement.classList.add("page_filter_toggle");
        this.toggleElement.setAttribute("aria-expanded", "false");
        this.toggleElement.setAttribute("aria-label", "Toon meer filters");
        this.toggleElement.appendChild(this.createIcon());
        this.toggleElement.addEventListener("click", () =>
          this.toggleHidden(),
        );

        this.hiddenListElement = this.ctrlr.main.window.document.createElement(
          "div",
        );
        this.hiddenListElement.classList.add(
          "page_filter_list_group",
          "page_filter_list_group--collapsible",
        );
        this.hiddenListElement.id = "page_filter_collapsible";
        this.hiddenListElement.setAttribute("hidden", "");
        this.toggleElement.setAttribute(
          "aria-controls",
          this.hiddenListElement.id,
        );
        const ulHidden = this.ctrlr.main.window.document.createElement("ul");
        this.hiddenListElement.appendChild(ulHidden);

        container.appendChild(this.toggleElement);
        container.appendChild(this.hiddenListElement);
      }
    }

    return true;
  }

  /** Create a simple funnel/filter icon for the toggle button. */
  createIcon(): SVGElement {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute(
      "d",
      "M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z",
    );
    svg.appendChild(path);
    return svg;
  }

  strip(s: string) {
    return s.replace(/_cumulatief$/, "");
  }

  /** Toggle the hidden-behind-icon filter panel open/closed. */
  toggleHidden() {
    const expanded = this.toggleElement.getAttribute("aria-expanded") === "true";
    this.toggleElement.setAttribute("aria-expanded", String(!expanded));
    if (expanded) {
      this.hiddenListElement.setAttribute("hidden", "");
    } else {
      this.hiddenListElement.removeAttribute("hidden");
    }
  }

  /**
   * Render one filter func ("gemeenten" | "vanaf") into the given li element
   * and wire the change handler, mirroring the original switch logic.
   */
  renderSelector(li: HTMLElement, func: string) {
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
  }

  /** Populate a ul with one li per filter func. */
  drawFiltersInto(ul: HTMLUListElement, funcs: string[]) {
    for (const func of funcs) {
      const li = this.ctrlr.main.window.document.createElement("li");
      this.renderSelector(li, func);
      ul.appendChild(li);
    }
  }

  draw() {
    const ul = this.listElement.querySelector("ul");
    if (!ul) return;

    const defaultFilters = this.ctrlr.config.default_filters;

    if (defaultFilters !== undefined) {
      // Split in effect: always-visible block from default_filters,
      // hidden block from filters.
      this.drawFiltersInto(ul as HTMLUListElement, defaultFilters);

      const hiddenUl = this.hiddenListElement.querySelector("ul");
      if (hiddenUl) {
        this.drawFiltersInto(hiddenUl as HTMLUListElement, this.ctrlr.config.filters);
      }
    } else if (this.ctrlr.config.filters !== undefined) {
      // Legacy: all filters always-visible.
      this.drawFiltersInto(ul as HTMLUListElement, this.ctrlr.config.filters);
    }
  }

  redraw() {}
}
