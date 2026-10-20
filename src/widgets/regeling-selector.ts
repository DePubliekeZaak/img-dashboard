/**
 * Graph-level "regeling" selector.
 *
 * Renders one option per compensated regeling (prefix) and writes the active
 * choice to the graph segment's `regeling` field via the segment store. The
 * graph controller resolves its prefixed columns against `segment.regeling`,
 * so the chart swaps between regelingen without refetching
 * (RegelingComparisonGroupV1 merges the per-regeling endpoints into prefixed
 * columns in the already-fetched data).
 *
 * Regeling codes/names mirror the comparison groups in
 * src/pages/waardering/groups/comparison-group.ts and the per-regeling page
 * configs (fs_maatwerk=MW, fs_vaste_vergoeding=VV, ims-volwassenen=IMS,
 * ims-kinderen-jongeren=IMK, wd-wonen=WD, wd-nietwonen=WNW).
 */
import type { IGraphControllerV3 } from "../charts/core/graph-v3";

export const REGELINGEN: { label: string; prefix: string; colour: string }[] = [
  { label: "Maatwerk", prefix: "mw", colour: "orange" },
  { label: "Vaste vergoeding", prefix: "vv", colour: "moss" },
  { label: "Immateriële schade: volwassenen", prefix: "ims", colour: "blue" },
  { label: "Immateriële schade: kinderen en jongeren", prefix: "imk", colour: "yellow" },
  { label: "Waardedaling wonen", prefix: "wd", colour: "purple" },
  { label: "Waardedaling niet wonen", prefix: "wnw", colour: "moss" },
];

export class HtmlRegelingSelector {
  constructor(
    private ctrlr: IGraphControllerV3,
    private element: HTMLElement,
    private id: string,
  ) {}

  draw(segment?: string, index = 0) {
    const selectEl = document.getElementById(this.id + "_regeling_" + index);

    if (selectEl && selectEl.parentNode !== null) {
      selectEl.parentNode.removeChild(selectEl);
    }

    const label = document.createElement("label");
    label.id = this.id + "_regeling_label";
    label.innerText = "Kies een regeling";
    label.classList.add("hidden-label");
    label.setAttribute("for", this.id + "_regeling_el" + index);

    const dropdown = document.createElement("select");
    dropdown.id = this.id + "_regeling_" + index;
    dropdown.style.alignSelf = "flex-start";
    dropdown.style.maxWidth = "90vw";
    dropdown.setAttribute("aria-described-by", this.id + "_regeling_label");

    for (const r of REGELINGEN) {
      const option = document.createElement("option");
      option.label = r.label;
      option.value = r.prefix;
      option.innerText = r.label;
      if (r.prefix === segment) {
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
