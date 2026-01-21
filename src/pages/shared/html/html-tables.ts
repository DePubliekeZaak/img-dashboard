import { thousands } from "../_helpers";
import { TableData } from "../types";

export class HTMLTables {
  container;
  scrolltainer;
  monthTable;
  monthThead;
  monthTbody;
  weekTable;
  weekThead;
  weekTbody;
  button;
  monthly;
  toggler;

  constructor(
    private ctrlr,
    private parentElement,
    private segment,
  ) {
    this.init();
  }

  init() {
    const self = this;

    this.container =
      this.ctrlr.page.main.window.document.createElement("section");
    this.container.classList.add("graph-container-12");
    this.container.classList.add("table-view");
    this.container.classList.add("tabpanel");
    this.container.role = "tabpanel";
    this.container.id = "panel_" + this.ctrlr.slug + "__table";
    this.container.setAttribute(
      "aria-labelledby",
      "tab_" + this.ctrlr.slug + "__table",
    );

    this.scrolltainer =
      this.ctrlr.page.main.window.document.createElement("div");
    this.scrolltainer.classList.add("scrolltainer");

    // Store toggler reference for conditional display
    this.toggler = this.ctrlr.page.main.window.document.createElement("div");
    this.toggler.classList.add("toggler");
    this.toggler.setAttribute("role", "group");
    this.toggler.setAttribute("aria-label", "Tabel periode selectie");
    this.monthly = this.segment.periodization == "monthly" ? true : false;
    console.log("M",this.monthly)
    this.toggler.setAttribute("data-active", this.monthly ? "month" : "week");

    // Create slider element (decorative, hidden from screen readers)
    const slider = this.ctrlr.page.main.window.document.createElement("div");
    slider.classList.add("toggler-slider");
    slider.setAttribute("aria-hidden", "true");
    this.toggler.appendChild(slider);

    // Create month option
    const monthOption =
      this.ctrlr.page.main.window.document.createElement("button");
    monthOption.classList.add("toggler-option");
    monthOption.textContent = "Maand";
    monthOption.setAttribute("type", "button");
    monthOption.setAttribute("aria-pressed", !this.monthly ? "true" : "false");
    monthOption.setAttribute("aria-label", "Toon maandelijkse data");
    monthOption.setAttribute("tabindex", "0");
    if (this.monthly) monthOption.classList.add("active");

    // Create week option
    const weekOption =
      this.ctrlr.page.main.window.document.createElement("button");
    weekOption.classList.add("toggler-option");
    weekOption.textContent = "Week";
    weekOption.setAttribute("type", "button");
    weekOption.setAttribute("aria-pressed", this.monthly ? "true" : "false");
    weekOption.setAttribute("aria-label", "Toon wekelijkse data");
    weekOption.setAttribute("tabindex", "0");
    if (!this.monthly) weekOption.classList.add("active");

    this.toggler.appendChild(monthOption);
    this.toggler.appendChild(weekOption);

    const switchToMonth = () => {
      if (!this.monthly) {
        this.monthly = true;
        this.toggler.setAttribute("data-active", "month");
        monthOption.classList.add("active");
        weekOption.classList.remove("active");
        monthOption.setAttribute("aria-pressed", "true");
        weekOption.setAttribute("aria-pressed", "false");
        this.scrolltainer
          .querySelector("#month-table")
          .classList.remove("hidden");
        this.scrolltainer.querySelector("#week-table").classList.add("hidden");

        // Announce change to screen readers
        const announcement =
          this.ctrlr.page.main.window.document.createElement("div");
        announcement.setAttribute("aria-live", "polite");
        announcement.setAttribute("aria-atomic", "true");
        announcement.className = "sr-only";
        announcement.textContent = "Maandelijkse tabel wordt getoond";
        this.scrolltainer.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
      }
    };

    const switchToWeek = () => {
      if (this.monthly) {
        this.monthly = false;
        this.toggler.setAttribute("data-active", "week");
        weekOption.classList.add("active");
        monthOption.classList.remove("active");
        weekOption.setAttribute("aria-pressed", "true");
        monthOption.setAttribute("aria-pressed", "false");
        this.scrolltainer.querySelector("#month-table").classList.add("hidden");
        this.scrolltainer
          .querySelector("#week-table")
          .classList.remove("hidden");

        // Announce change to screen readers
        const announcement =
          this.ctrlr.page.main.window.document.createElement("div");
        announcement.setAttribute("aria-live", "polite");
        announcement.setAttribute("aria-atomic", "true");
        announcement.className = "sr-only";
        announcement.textContent = "Wekelijkse tabel wordt getoond";
        this.scrolltainer.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
      }
    };

    const handleKeyDown = (event: KeyboardEvent, action: () => void) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        action();
      }
    };

    monthOption.addEventListener("click", switchToMonth);
    weekOption.addEventListener("click", switchToWeek);
    monthOption.addEventListener("keydown", (e) =>
      handleKeyDown(e, switchToMonth),
    );
    weekOption.addEventListener("keydown", (e) =>
      handleKeyDown(e, switchToWeek),
    );

    // Initially hide toggler - will be shown conditionally in draw()
    this.toggler.style.display = "none";
    this.scrolltainer.appendChild(this.toggler);

    this.monthTable = this.ctrlr.page.main.window.document.createElement("table");
    this.monthTable.setAttribute("id", "month-table");

    this.monthThead = this.ctrlr.page.main.window.document.createElement("thead");
    this.monthTbody = this.ctrlr.page.main.window.document.createElement("tbody");

    this.monthTable.appendChild(this.monthThead);
    this.monthTable.appendChild(this.monthTbody);
    if (!this.monthly) { this.monthTable.classList.add("hidden"); }
    this.scrolltainer.appendChild(this.monthTable);

    this.weekTable = this.ctrlr.page.main.window.document.createElement("table");
    this.weekTable.setAttribute("id", "week-table");
    if (this.monthly) { this.weekTable.classList.add("hidden"); }
    this.weekThead = this.ctrlr.page.main.window.document.createElement("thead");
    this.weekTbody = this.ctrlr.page.main.window.document.createElement("tbody");

    this.weekTable.appendChild(this.weekThead);
    this.weekTable.appendChild(this.weekTbody);
    this.scrolltainer.appendChild(this.weekTable);

    this.container.appendChild(this.scrolltainer);

    this.parentElement.appendChild(this.container);
  }

  draw(data: any) {
    // Clear existing table content
    this.monthThead.innerHTML = "";
    this.monthTbody.innerHTML = "";
    this.weekThead.innerHTML = "";
    this.weekTbody.innerHTML = "";

    // Check if month table has data
    const hasMonthData =
    !this.segment.weekOnly && (
      data.monthTable &&
      data.monthTable.rows &&
      data.monthTable.rows.length > 0);

    // Show/hide toggler based on whether both tables have data
    if (hasMonthData) {
      this.toggler.style.display = "inline-flex";
    } else {
      this.toggler.style.display = "none";
      // Force show week table and hide month table if no month data
      this.weekTable.classList.remove("hidden");
      this.monthTable.classList.add("hidden");
    }

    // Build month table headers and content only if data exists
    if (hasMonthData) {
      if (data.monthTable.pre_headers) {
        const tr0 = this.ctrlr.page.main.window.document.createElement("tr");
        for (const h of data.monthTable.pre_headers) {
          const th = this.ctrlr.page.main.window.document.createElement("th");
          th.colSpan = h.length;
          th.innerHTML = h.label;
          tr0.appendChild(th);
        }
        this.monthThead.appendChild(tr0);
      }

      const trm = this.ctrlr.page.main.window.document.createElement("tr");
      if (data.monthTable.headers && Array.isArray(data.monthTable.headers)) {
        for (const column of data.monthTable.headers) {
          const th = this.ctrlr.page.main.window.document.createElement("th");
          th.innerHTML = column;
          trm.appendChild(th);
        }
      }
      this.monthThead.appendChild(trm);

    
      if (data.monthTable.rows && Array.isArray(data.monthTable.rows)) {
        for (const row of data.monthTable.rows) {
          const tr = this.ctrlr.page.main.window.document.createElement("tr");
          if (Array.isArray(row)) {
            for (const value of row) {
              const td = this.ctrlr.page.main.window.document.createElement("td");
              td.innerHTML = typeof value === 'number' ? thousands(value) : value;
              tr.appendChild(td);
            }
          }
          this.monthTbody.appendChild(tr);
        }
      }
    }

    // Always build week table
    if (data.weekTable.pre_headers) {
      const tr0 = this.ctrlr.page.main.window.document.createElement("tr");
      for (const h of data.weekTable.pre_headers) {
        const th = this.ctrlr.page.main.window.document.createElement("th");
        th.colSpan = h.length;
        th.innerHTML = h.label;
        tr0.appendChild(th);
      }
      this.weekThead.appendChild(tr0);
    }

    const trw = this.ctrlr.page.main.window.document.createElement("tr");
    if (data.weekTable.headers && Array.isArray(data.weekTable.headers)) {
      for (const column of data.weekTable.headers) {
        const th = this.ctrlr.page.main.window.document.createElement("th");
        th.innerHTML = column;
        trw.appendChild(th);
      }
    }
    this.weekThead.appendChild(trw);

    if (data.weekTable.rows && Array.isArray(data.weekTable.rows)) {
      for (const row of data.weekTable.rows) {
        const tr = this.ctrlr.page.main.window.document.createElement("tr");
        if (Array.isArray(row)) {
          for (const value of row) {
            const td = this.ctrlr.page.main.window.document.createElement("td");
            td.innerHTML = value;
            tr.appendChild(td);
          }
        }
        this.weekTbody.appendChild(tr);
      }
    }

    return true;
  }

  hide() {
    this.container.style.display = "none";
  }

  show() {
    this.container.style.display = "flex";
  }
}
