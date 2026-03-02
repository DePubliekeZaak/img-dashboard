import { drop } from "lodash";
import { colours } from "../../../img-modules/styleguide";
import { toDutchMonths } from "../_helpers";
import { IParameterMapping } from "../interfaces";

export class HtmlMonthSelector {
  constructor(
    private ctrlr,
    private element,
    private id: string,
    private data: any[],
  ) {
    // this.data = data
  }

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
    dropdown.setAttribute("aria-described-by", this.id + "_label");

    const option = document.createElement("option");
    option.label = "Doorlopend";
    option.value = "all";
    option.innerText = "Doorlopend";
    if ("all" === segment) {
      option.selected = true;
    }
    dropdown.appendChild(option);

    for (const m of this.data) {
      const option = document.createElement("option");
      option.label = `${toDutchMonths(m._month)} - ${m._year}`;
      option.value = m._yearmonth;
      option.innerText = `${m._month} + (${m._year})`;
      if (m._yearmonth === segment) {
        option.selected = true;
      }
      dropdown.appendChild(option);
    }

    this.element.appendChild(label);
    this.element.appendChild(dropdown); // insertBefore(dropdown,headerElement.nextSibling);

    return dropdown;
  }

  redraw() {}
}
