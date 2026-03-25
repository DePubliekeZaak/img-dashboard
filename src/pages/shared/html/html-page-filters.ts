
import { IPageController } from "../page.controller";
import { HtmlMunicipalitySelector } from "./municipality-selector";


export class HtmlPageFilters {
  // ctrlr: IPageController
  listElement : HTMLElement;
  // selector;
  // hasListener = false;

  constructor(private ctrlr: IPageController) {
    this.ctrlr = ctrlr;
    this.init();
  }

  init() {
    const container = document.querySelector(".page_header")

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

    console.log(this.ctrlr.config);

    if (this.ctrlr.config.filters !== undefined) {
      for (const func of this.ctrlr.config.filters) {
        const li = this.ctrlr.main.window.document.createElement("li");

        let selectEl;

        switch (func) {

          case "gemeenten": {

            console.log("inside html page filter", this.ctrlr.segment)

            const muniSelector = new HtmlMunicipalitySelector(
              this.ctrlr,
              li,
              this.ctrlr.slug,
            );
            const muniSelectEl = muniSelector.draw(this.ctrlr.segment, 1);

            muniSelectEl.addEventListener("change", () => {
             
              if (muniSelectEl.value !== this.ctrlr.segment.gemeente) {
                this.ctrlr.onFilterChange({ gemeente: muniSelectEl.value })
              }
            });

          break;
          }
        }
         ul!.appendChild(li);
      }
    }
  }

  // post data retrieval
  redraw() {}

  // hide() {
  //   this.listElement.style.opacity = "0";
  // }

  // show() {
  //   this.listElement.style.opacity = "1";
  // }
}
