import { drop } from "lodash";
import { breakpoints, colours } from "../img-modules/styleguide";
import type { IParameterMapping } from "../shared/interfaces";
import { getGroupSegment } from "../stores/segment.store";

export class HtmlMappingGroupSelector {
  constructor(
    private ctrlr,
    private element,
    private id: string,
    private parameters: IParameterMapping[][],
  ) {}

  draw(index = 0) {
    const selectEl = document.getElementById(this.id + "_mapping_" + index);

    if (selectEl && selectEl.parentNode !== null) {
      selectEl.parentNode.removeChild(selectEl);
    }

    const label = document.createElement("label");
    label.id = this.id + "_label";
    label.innerText = "Kies voor een datapunt";
    label.classList.add("hidden-label");
    label.setAttribute("for", this.id + "_el" + index);

    const dropdown = document.createElement("select");
    dropdown.id = this.id + "_mapping_" + index;
    dropdown.style.alignSelf = "flex-start";
    dropdown.style.maxWidth = "90vw";
    dropdown.style.marginRight =
      window.innerWidth > breakpoints.md ? "1rem" : ".5rem";
    dropdown.setAttribute("aria-described-by", this.id + "_label");

    this.parameters.forEach((group: any, i: number) => {
      let label = "";

      const arr = group[0].column.split("_");

      // console.log(arr[arr.length - 1]);

      switch (arr[arr.length - 1]) {
        case "ingediend":
          label = "ingediend";
          break;
        case "meldingen":
          label = "meldingen en aanvragen";
          break;
        case "aanvragen":
          label = "meldingen en aanvragen";
          break;
        case "afgehandeld":
        case "afgerond":
          label = "afgehandeld";
          break;
        case "uitgekeerd":
          label = "totaal verleend";
          break;
        case "schade":
          label = "verleende schade";
        case "totaal":
          label = "uitbetaald bedrag";
          break;
      }

      const option = document.createElement("option");
      option.label = label;
      option.value = option.value = group[0].column.split("_").slice(1).join("_");
      option.innerText = label;
      const segment = getGroupSegment(this.ctrlr.slug);
      if (group[0].column.split("_").slice(1).join("_") === segment?.baseKey) {
        option.selected = true;
      }-
      dropdown.appendChild(option);
    });

    this.element.appendChild(label);
    this.element.appendChild(dropdown); // insertBefore(dropdown,headerElement.nextSibling);

    return dropdown;
  }

  redraw() {}
}
