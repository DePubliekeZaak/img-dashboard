import { drop } from "lodash";
import { breakpoints, colours } from "../img-modules/styleguide";
import { slugify } from "../shared/_helpers";
import { IParameterMapping } from "../shared/interfaces";
import { Segment } from "../shared/types";

const munis = [
  "Groningen",
  "Midden-Groningen",
  "Eemsdelta",
  "Het Hogeland",
  "Oldambt",
  "Westerkwartier",
  "Veendam",
  "Tynaarlo",
  "Noordenveld",
  "Pekela",
  "Aa en Hunze",
  "Westerwolde",
  "Stadskanaal",
  "Noardeast-Fryslan",
  "Ooststellingwerf",
  // "Achtkarspelen",
  // "Midden-Drenthe"
];

munis.sort();

export class HtmlMunicipalitySelector {
  constructor(
    private ctrlr: any,
    private element: any,
    private id: string,
  ) {}

  draw(segment: Segment, index = 0) {
    const selectEl = document.getElementById(this.id + "_" + index);

    if (selectEl && selectEl.parentNode !== null) {
      selectEl.parentNode.removeChild(selectEl);
    }

    const label = document.createElement("label");
    label.id = this.id + "_label";
    label.innerText = "Kies een gemeente";
    label.classList.add("hidden-label");
    label.setAttribute("for", this.id + "_el" + index);

    const dropdown = document.createElement("select");
    dropdown.id = this.id + "_" + index;
    dropdown.style.alignSelf = "flex-start";
    dropdown.style.maxWidth = "90vw";
    dropdown.style.marginRight =
      window.innerWidth > breakpoints.md ? "1rem" : ".5rem";
    dropdown.setAttribute("aria-described-by", this.id + "_label");

    for (const muni of munis) {
      const option = document.createElement("option");
      option.label = muni;
      option.value = muni;
      option.innerText = muni;
      if (segment.gemeente === muni) {
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
