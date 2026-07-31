import { drop } from "lodash";
import { colours } from "../img-modules/styleguide";
import { IParameterMapping } from "../shared/interfaces";

export class HtmlTotalvsRecentSelector {
  constructor(
    private ctrlr: any,
    private element: HTMLElement,
    private id: string,
  ) {}

  draw(index = 0) {
    const selectEl = document.getElementById(this.id + "_" + index);

    if (selectEl && selectEl.parentNode !== null) {
      selectEl.parentNode.removeChild(selectEl);
    }

    const label = document.createElement("label");
    label.id = this.id + "_label";
    label.innerText = "Kies doorlopende data of data van afgelopen week";
    label.classList.add("hidden-label");
    label.setAttribute("for", this.id + "_el" + index);

    const dropdown = document.createElement("select");
    dropdown.id = this.id + "_" + index;
    dropdown.style.alignSelf = "flex-start";
    dropdown.style.maxWidth = "90vw";
    dropdown.setAttribute("aria-described-by", this.id + "_label");

    const option_1 = document.createElement("option");
    option_1.label = "doorlopend";
    option_1.value = "cumulative";
    option_1.innerText = "doorlopend";
    option_1.selected = true;
    dropdown.appendChild(option_1);

    const option_2 = document.createElement("option");
    option_2.label = "laatste periode";
    option_2.value = "recent";
    option_2.innerText = "laatste periode";
    // if (!segment.cumulative) { option_2.selected = true }
    dropdown.appendChild(option_2);

    this.element.appendChild(label);
    this.element.appendChild(dropdown); // insertBefore(dropdown,headerElement.nextSibling);

    return dropdown;
  }

  redraw() {}
}
