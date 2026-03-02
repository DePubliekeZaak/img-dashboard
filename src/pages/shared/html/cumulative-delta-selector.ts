import { drop } from "lodash";
import { breakpoints, colours } from "../../../img-modules/styleguide";
import { IParameterMapping } from "../interfaces";

export class HtmlCumulativevsDeltaSelector {
  constructor(
    private ctrlr,
    private element,
    private id: string,
  ) {}

  draw(segment, index = 0) {
    const selectEl = document.getElementById(this.id + "_" + index);

    if (selectEl && selectEl.parentNode !== null) {
      selectEl.parentNode.removeChild(selectEl);
    }

    const label = document.createElement("label");
    label.id = this.id + "_label";
    label.innerText =
      "Kies voor doorlopende data of data voor een specifieke maand";
    label.classList.add("hidden-label");
    label.setAttribute("for", this.id + "_el" + index);

    const dropdown = document.createElement("select");
    dropdown.id = this.id + "_" + index;
    dropdown.style.alignSelf = "flex-start";
    dropdown.style.maxWidth = "90vw";
    dropdown.style.marginRight =
      window.innerWidth > breakpoints.md ? "1rem" : ".5rem";
    dropdown.setAttribute("aria-described-by", this.id + "_label");

    const option_1 = document.createElement("option");
    option_1.label = "optellend";
    option_1.value = "cumulative";
    option_1.innerText = "optellend";
    if (segment.cumulative) {
      option_1.selected = true;
    }
    dropdown.appendChild(option_1);

    const option_2 = document.createElement("option");
    option_2.label = "toename";
    option_2.value = "delta";
    option_2.innerText = "toename";
    if (!segment.cumulative) {
      option_2.selected = true;
    }
    dropdown.appendChild(option_2);

    this.element.appendChild(label);
    this.element.appendChild(dropdown); // insertBefore(dropdown,headerElement.nextSibling);

    return dropdown;
  }

  redraw() {}
}
