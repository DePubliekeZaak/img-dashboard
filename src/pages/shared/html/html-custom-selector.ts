import type { SelectorOption } from "../types";

export class HtmlCustomSelector {
  constructor(
    private element,
    private id: string,
  ) {}

  draw(segment: string, options: SelectorOption[]) {
    const selectEl = document.getElementById(this.id);

    if (selectEl && selectEl.parentNode) {
      selectEl.parentNode.removeChild(selectEl);
    }

    const dropdown = document.createElement("select");
    dropdown.id = this.id;
    dropdown.style.alignSelf = "flex-start";

    for (const o of options) {
      const option = document.createElement("option");
      option.label = o.label.toString();
      option.value = o.slug.toString();
      option.innerText = o.label.toString();
      if (o.slug === segment) {
        option.selected = true;
      }
      dropdown.appendChild(option);
    }

    this.element.appendChild(dropdown); // insertBefore(dropdown,headerElement.nextSibling);

    return dropdown;
  }

  redraw() {}
}
