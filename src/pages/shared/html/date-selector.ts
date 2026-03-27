import breakpoints from "../../../img-modules/styleguide/breakpoints";
import { Segment } from "../types";

export class HtmlDateSelector {
  constructor(
    private ctrlr: any,
    private element: any,
    private id: string,
  ) {}

  draw(segment: Segment, index = 0, defaultValue = "2025-01-01") {
    const selectEl = document.getElementById(this.id + "_date_" + index);

    if (selectEl && selectEl.parentNode !== null) {
      selectEl.parentNode.removeChild(selectEl);
    }

    const label = document.createElement("label");
    label.id = this.id + "_date_label";
    label.innerText = "Kies een startdatum voor weekcijfers";
    label.classList.add("hidden-label");
    label.setAttribute("for", this.id + "_date_el" + index);

    const input = document.createElement("input");
    input.type = "date";
    input.id = this.id + "_date_" + index;
    input.value = segment.vanaf ?? defaultValue;
    input.style.alignSelf = "flex-start";
    input.style.maxWidth = "90vw";
    input.style.marginRight =
      window.innerWidth > breakpoints.md ? "1rem" : ".5rem";
    input.setAttribute("aria-described-by", this.id + "_date_label");

    this.element.appendChild(label);
    this.element.appendChild(input);

    return input;
  }

  redraw() {}
}