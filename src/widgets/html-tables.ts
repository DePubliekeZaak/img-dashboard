import { thousands } from "../shared/_helpers";
import { Segment, TableData } from "../shared/types";
import { createTable, createToggler, populateTable, getState } from "./table.factory";

export class HTMLTables {
  container: any;
  scrolltainer: any;
  monthTable: any; 
  monthThead: any; 
  monthTbody: any; 
  weekTable: any; 
  weekThead: any; 
  weekTbody: any; 
  button: any; 
  monthly: any; 
  periodToggler: any; 
  calcToggler: any;

  constructor(
    private ctrlr: any,
    private parentElement: HTMLElement,
    private segment: Segment,
  ) {
    this.init();
  }

  init() {
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

    const toggleGroup = this.ctrlr.page.main.window.document.createElement("div");
    toggleGroup.classList.add('toggle-group');
    this.scrolltainer.appendChild(toggleGroup)

    this.scrolltainer.appendChild(createTable(this.ctrlr.page.main.window.document, "week-table-inc", true));
    this.scrolltainer.appendChild(createTable(this.ctrlr.page.main.window.document, "month-table-inc", true));
    this.scrolltainer.appendChild(createTable(this.ctrlr.page.main.window.document, "week-table-cumul", true));

    this.scrolltainer.appendChild(createTable(this.ctrlr.page.main.window.document, "month-table-cumul", true));

    // Store toggler reference for conditional display
    let options = [
       {
        label: "Week",
        aria: "Toon wekelijkse data",
        announcement: "Wekelijkse tabel wordt getoond"
      },
      {
        label: "Maand",
        aria: "Toon maandelijkse data",
        announcement: "Maandelijkse tabel wordt getoond"
      }
    ]

    this.periodToggler = createToggler(this.ctrlr.page.main.window.document, this.scrolltainer, toggleGroup, this.segment.periodization === "monthly" ? 1 : 0, options, 'Keuze maand of week', 0);

    options = [
      {
        label: "Toename",
        aria: "Toon verschil in data",
        announcement: "tabel met verschillen wordt getoond"
      },
      {
        label: "Optellend",
        aria: "Toon cumulatieve data",
        announcement: "Cumulatieve tabel wordt getoond"
      }
    ]


    this.calcToggler = createToggler(this.ctrlr.page.main.window.document, this.scrolltainer, toggleGroup, this.segment.cumulative ? 1 : 0, options, 'Keuze cumulatief of verschil', 1);
    

    this.container.appendChild(this.scrolltainer);
    this.parentElement.appendChild(this.container);
  }

  draw(data: any) {

    const hasWeekIncData = !!(data.weekTableInc && data.weekTableInc.rows && data.weekTableInc.rows.length > 0);
    const hasMonthIncData = !!(data.monthTableInc && data.monthTableInc.rows && data.monthTableInc.rows.length > 0);

    const hasWeekCumulData = !!(data.weekTableCumul && data.weekTableCumul.rows && data.weekTableCumul.rows.length > 0);
    const hasMonthCumulData = !!(data.monthTableCumul && data.monthTableCumul.rows && data.monthTableCumul.rows.length > 0);


    // Clear existing table content
    const tables = Array.from(this.scrolltainer.querySelectorAll('table')) as HTMLElement[];

    // Determine which table to highlight based on toggler state
    const state = getState(this.scrolltainer) || [0, 0];
    const tableIndex = state[0] + state[1] * 2;
    const tableIds = [
      "week-table-inc",
      "month-table-inc",
      "week-table-cumul",
      "month-table-cumul",
    ];

    // Find the right table — prefer state-matching, fall back to first with data
    const activeTableId = (() => {
      const preferred = tableIds[tableIndex];
      const hasDataFor = (id: string) =>
        (id === "week-table-inc" && hasWeekIncData) ||
        (id === "month-table-inc" && hasMonthIncData) ||
        (id === "week-table-cumul" && hasWeekCumulData) ||
        (id === "month-table-cumul" && hasMonthCumulData);
      if (hasDataFor(preferred)) return preferred;
      return tableIds.find(hasDataFor) || preferred;
    })();

    tables.forEach((t: any) => {
      t.querySelector("thead")!.innerHTML = "";
      t.querySelector("tbody")!.innerHTML = "";

      if (!hasWeekIncData && t.getAttribute("id") == "week-table-inc")
        t.classList.add("hidden");
      if (!hasMonthIncData && t.getAttribute("id") == "month-table-inc")
        t.classList.add("hidden");
      if (!hasWeekCumulData && t.getAttribute("id") == "week-table-cumul")
        t.classList.add("hidden");
      if (!hasMonthCumulData && t.getAttribute("id") == "month-table-cumul")
        t.classList.add("hidden");

      // Only show the table that matches the current toggler positions
      if (t.getAttribute("id") === activeTableId) {
        if (
          (t.getAttribute("id") === "week-table-inc" && hasWeekIncData) ||
          (t.getAttribute("id") === "month-table-inc" && hasMonthIncData) ||
          (t.getAttribute("id") === "week-table-cumul" && hasWeekCumulData) ||
          (t.getAttribute("id") === "month-table-cumul" && hasMonthCumulData)
        ) {
          t.classList.remove("hidden");
        }
      } else {
        t.classList.add("hidden");
      }
    });

    // data.monthTable.rows.sort((a, b) => a._yearweek.localeCompare(b._yearweek));
    // data.weekTable.rows.sort((a, b) => a._yearweek.localeCompare(b._yearweek));

    // Show toggler only when both week and month data exist
    if ((hasWeekIncData && hasMonthIncData) || (hasWeekCumulData && hasMonthCumulData) ) {
      this.periodToggler.style.display = "inline-flex";
    } else {
      this.periodToggler.style.display = "none";
    }

    if ((hasWeekIncData && hasWeekCumulData) || (hasMonthIncData && hasMonthCumulData) ) {
      this.calcToggler.style.display = "inline-flex";
    } else {
      this.calcToggler.style.display = "none";
    }

    const weekTableIncEl = tables.find(
      (t: HTMLElement) => t.getAttribute("id") == "week-table-inc",
    ) as HTMLElement;
    const weekTableCumulEl = tables.find(
      (t: HTMLElement) => t.getAttribute("id") == "week-table-cumul",
    ) as HTMLElement;
    const monthTableIncEl = tables.find(
      (t: HTMLElement) => t.getAttribute("id") == "month-table-inc",
    ) as HTMLElement;
    const monthTableCumulEl = tables.find(
      (t: HTMLElement) => t.getAttribute("id") == "month-table-cumul",
    ) as HTMLElement;

    if (data.weekTableInc) populateTable(this.ctrlr.page.main.window.document, data.weekTableInc, weekTableIncEl ) 
    if (data.weekTableCumul) populateTable(this.ctrlr.page.main.window.document, data.weekTableCumul, weekTableCumulEl)
    if (data.monthTableInc) populateTable(this.ctrlr.page.main.window.document, data.monthTableInc, monthTableIncEl)
    if (data.monthTableCumul) populateTable(this.ctrlr.page.main.window.document, data.monthTableCumul, monthTableCumulEl)


    return true;
  }

  hide() {
    this.container.style.display = "none";
  }

  show() {
    this.container.style.display = "flex";
  }
}
