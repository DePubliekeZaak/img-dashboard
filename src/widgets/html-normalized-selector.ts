import { drop } from "lodash";
import { colours } from "../img-modules/styleguide";
import { toDutchMonths } from "../shared/_helpers";
import { IParameterMapping } from "../shared/interfaces";

export class HtmlNormalizedSelector {
  constructor(
    private ctrlr,
    private element,
    private id: string,
    private data: any[],
  ) {}

  draw(segment, index = 0) {
    const selectEl = document.getElementById(this.id + "_normalized_" + index);

    if (selectEl && selectEl.parentNode !== null) {
      selectEl.parentNode.removeChild(selectEl);
    }

    const label = document.createElement("label");
    label.id = this.id + "_label";
    label.innerText = "Kies absolute waardes of genormaliseerde waardes";
    label.classList.add("hidden-label");
    label.setAttribute("for", this.id + "_el" + index);

    const dropdown = document.createElement("select");
    dropdown.id = this.id + "_normalized_" + index;
    dropdown.style.alignSelf = "flex-start";
    dropdown.style.maxWidth = "90vw";
    dropdown.style.marginRight = "1rem";
    dropdown.setAttribute("aria-described-by", this.id + "_label");

    let option = document.createElement("option");
    option.label = "absolute waardes";
    option.value = "absolute";
    option.innerText = "absolute waardes";
    if ("absolute" === segment) {
      option.selected = true;
    }
    dropdown.appendChild(option);

    option = document.createElement("option");
    option.label = "genormaliseerde waardes";
    option.value = "normalized";
    option.innerText = "genormaliseerde waardes";
    if ("normalized" === segment) {
      option.selected = true;
    }
    dropdown.appendChild(option);

    this.element.appendChild(label);
    this.element.appendChild(dropdown); // insertBefore(dropdown,headerElement.nextSibling);

    return dropdown;
  }

  redraw() {}
}
