/**
 * Graph-level "domein" selector.
 *
 * Renders one option per KTO domein (prefix) and writes the active choice to
 * the graph segment's `domein` field via the segment store. The graph
 * controller resolves its prefixed columns against `segment.domein`, so the
 * chart swaps between Totaal / Fysieke schade / Immateriële schade /
 * Waardedaling without refetching (DomainComparisonGroupV1 merges the domein
 * endpoints into prefixed columns in the already-fetched data).
 *
 * Labels + colours mirror the `waardering_alle_regelingen` group in
 * src/pages/waardering/config.ts.
 */
import type { IGraphControllerV3 } from "../charts/core/graph-v3";

export const DOMEINEN: { label: string; prefix: string; colour: string }[] = [
  { label: "Totaal", prefix: "totaal", colour: "orange" },
  { label: "Fysieke schade", prefix: "fysiek", colour: "moss" },
  { label: "Immateriële schade", prefix: "ims", colour: "blue" },
  { label: "Waardedaling", prefix: "wdl", colour: "purple" },
];

export class HtmlDomeinSelector {
  constructor(
    private ctrlr: IGraphControllerV3,
    private element: HTMLElement,
    private id: string,
  ) {}

  draw(segment?: string, index = 0) {
    const selectEl = document.getElementById(this.id + "_domein_" + index);

    if (selectEl && selectEl.parentNode !== null) {
      selectEl.parentNode.removeChild(selectEl);
    }

    const label = document.createElement("label");
    label.id = this.id + "_domein_label";
    label.innerText = "Kies een regeling";
    label.classList.add("hidden-label");
    label.setAttribute("for", this.id + "_domein_el" + index);

    const dropdown = document.createElement("select");
    dropdown.id = this.id + "_domein_" + index;
    dropdown.style.alignSelf = "flex-start";
    dropdown.style.maxWidth = "90vw";
    dropdown.setAttribute("aria-described-by", this.id + "_domein_label");

    for (const d of DOMEINEN) {
      const option = document.createElement("option");
      option.label = d.label;
      option.value = d.prefix;
      option.innerText = d.label;
      if (d.prefix === segment) {
        option.selected = true;
      }
      dropdown.appendChild(option);
    }

    this.element.appendChild(label);
    this.element.appendChild(dropdown);

    return dropdown;
  }

  redraw() {}
}
