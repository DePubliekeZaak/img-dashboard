import type { IPageController } from "../shared/page.controller";
import { HtmlDateSelector } from "./date-selector";
import { HtmlMunicipalitySelector } from "./municipality-selector";
import {
  pageSegment$,
  updatePageSegment,
  cascadeSegmentUpdate,
} from "../stores/segment.store";

/**
 * Renders the page-level filters for a page.
 *
 * Two filter blocks are supported:
 *   1. An ALWAYS-VISIBLE block built from `config.filters`, rendered
 *      underneath the page title block (inside `div.page_header`).
 *   2. A TOGGLABLE block built from `config.default_filters`, hidden behind a
 *      filter-icon toggle button and rendered ABOVE `div.page_header` — only
 *      present when `default_filters` is defined (i.e. the split is in
 *      effect).
 *
 * Backwards compatibility: when `default_filters` is ABSENT the legacy
 * behaviour is kept — all of `config.filters` are rendered always-visible and
 * NO filter-icon toggle is shown (there is no `default_filters` block to
 * reveal).
 */
export class HtmlPageFilters {
  listElement!: HTMLElement;
  hiddenListElement!: HTMLElement;
  toggleElement!: HTMLButtonElement;
  wrapperElement!: HTMLElement;

  constructor(private ctrlr: IPageController) {
    this.ctrlr = ctrlr;
    this.init();
  }

  init() {
    const container = document.querySelector(".page_header");

    if (container !== null) {
      const parent = container.parentNode;

      // Remove any previously rendered blocks (always-visible inside the
      // header, plus any toggle/collapsible wrapper inserted above it).
      const prevElements =
        parent?.querySelectorAll(
          ".page_filter_list_group, .page_filter_toggle, .page_filter_above_header",
        ) ?? [];
      prevElements.forEach((el) => el.remove());

      // Always-visible block (filters) — under the title block, inside the
      // page header.
      this.listElement = this.ctrlr.main.window.document.createElement("div");
      this.listElement.classList.add("page_filter_list_group");
      const ul = this.ctrlr.main.window.document.createElement("ul");
      this.listElement.appendChild(ul);
      container.appendChild(this.listElement);

      // Togglable block (default_filters) — ABOVE .page_header, behind a
      // filter-icon toggle. Only rendered when the split is in effect. The
      // toggle button and the collapsible list are wrapped together in a
      // full-width wrapper div.
      if (this.ctrlr.config.default_filters !== undefined && parent !== null) {
        this.wrapperElement = this.ctrlr.main.window.document.createElement(
          "div",
        );
        this.wrapperElement.classList.add("page_filter_above_header");

        this.toggleElement = this.ctrlr.main.window.document.createElement(
          "button",
        );
        this.toggleElement.type = "button";
        this.toggleElement.classList.add(
          "page_filter_toggle",
          "page_filter_toggle--above-header",
        );
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
          "page_filter_list_group--above-header",
        );
        this.hiddenListElement.id = "page_filter_collapsible";
        this.hiddenListElement.setAttribute("hidden", "");
        this.toggleElement.setAttribute(
          "aria-controls",
          this.hiddenListElement.id,
        );
        const ulHidden = this.ctrlr.main.window.document.createElement("ul");
        this.hiddenListElement.appendChild(ulHidden);

        this.wrapperElement.appendChild(this.toggleElement);
        this.wrapperElement.appendChild(this.hiddenListElement);
        parent.insertBefore(this.wrapperElement, container);
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
      // Split in effect: filters always-visible under the title,
      // default_filters togglable above the header.
      this.drawFiltersInto(ul as HTMLUListElement, this.ctrlr.config.filters);

      const hiddenUl = this.hiddenListElement.querySelector("ul");
      if (hiddenUl) {
        this.drawFiltersInto(hiddenUl as HTMLUListElement, defaultFilters);
      }
    } else if (this.ctrlr.config.filters !== undefined) {
      // Legacy: all filters always-visible.
      this.drawFiltersInto(ul as HTMLUListElement, this.ctrlr.config.filters);
    }
  }

  redraw() {}
}
