//
import { thousands } from "../_helpers";

export class HtmlHeader {
  headerElement;

  constructor(
    private dataCtrlr,
    private endpoints,
    private element,
    private header,
    private description,
    private datum,
  ) {}

  async draw() {
    const prevHeaderElement = this.element.querySelector(".article_header");

    this.headerElement = document.createElement("div");
    this.headerElement.classList.add("article_header");
    this.headerElement.style.position = "relative";

    if (!this.element.classList.contains("graph-view")) {
      this.headerElement.style.paddingBottom = "1rem";
      this.headerElement.style.paddingTop = "1rem";
    }

    this.headerElement.style.width = "calc(100% - 0px)";

    if (this.header) {
      const h = document.createElement("h3");
      h.innerText = this.header;
      this.headerElement.appendChild(h);
    }

    if (this.datum) {
      const d = document.createElement("span");
      d.style.display = "block";
      d.style.marginTop = "-.5rem";
      d.style.marginBottom = ".75rem";
      d.innerText = this.datum;
      this.headerElement.appendChild(d);
    }

    if (this.description) {
      const d = document.createElement("div");
      d.style.maxWidth = "640px";

      const p = document.createElement("p");
      // p.innerHTML = await marked(this.description);
      p.innerHTML = this.description;

      d.style.color = "white";

      d.appendChild(p);
      this.headerElement.appendChild(d);
    }

    this.element.appendChild(this.headerElement);
    return true;
  }

  redraw(currentData: any | undefined) {
    if (this.headerElement === null) return;

    const hasPattern = /{(\w+)}/.test(this.description);
    const descEl = this.headerElement.querySelector("div");
    let description = "";

    // Helper function to format euro amounts
    const formatEuro = (value: number): string => {
      if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(2).replace(".", ",")} miljard`;
      } else if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1).replace(".", ",")} miljoen`;
      } else {
        return `€${thousands(value)}`;
      }
    };

    // Helper function to check if a key represents a euro amount
    const isEuroAmount = (key: string): boolean => {
      return (
        key.toLowerCase().includes("bedrag") ||
        key.toLowerCase().includes("euro")
      );
    };

    if (hasPattern && currentData) {
      if (currentData._yearweek !== undefined) {
        description = this.description
          .replace(
            "{week}",
            parseInt(currentData._yearweek.slice(5)).toString(),
          )
          .replace(/{\s*(\w+)\s*}/g, (_, key) => {
            const value = currentData[key];

            if (value === null || value === undefined) {
              return "-";
            } else if (isEuroAmount(key) && typeof value === "number") {
              return formatEuro(value);
            } else {
              return thousands(value) || `{${key}}`;
            }
          });
      }

      descEl.innerHTML = description;
    }

    if (descEl !== null) {
      descEl.style.color = "black";
      descEl.style.background = "white";
    }
  }

  hide() {
    this.headerElement.style.opacity = "0";
  }

  show() {
    this.headerElement.style.opacity = "1";
  }
}
