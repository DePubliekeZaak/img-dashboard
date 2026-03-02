import type { IParameterMapping } from "../../../charts/core/types";
import { breakpoints, colours } from "../../../img-modules/styleguide";
import { convertToCurrencyInTable } from "../_helpers";
import type { PiePart } from "../types_graphs";

export default class HtmlLegendAsSumV2 {
  rowHeight = 22;
  legend;

  constructor(private ctrlr) {}

  draw(data: PiePart[]) {
    const legend = document.createElement("div");
    legend.classList.add("legend");
    legend.style.display = "flex";
    legend.style.flexDirection =
      window.innerWidth < breakpoints.xsm ? "column" : "column";
    legend.style.paddingBottom =
      window.innerWidth < breakpoints.xsm
        ? this.ctrlr.config.padding.left + "px"
        : "0";
    legend.style.justifyContent = "center";
    legend.style.width = "340px";

    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    if (window.innerWidth < breakpoints.sm) {
      legend.style.width = "calc(100vw - 2rem)";
      legend.style.marginLeft = "-1rem";
    }

    this.ctrlr.parameters[0].forEach((map: IParameterMapping, i: number) => {
      tbody.appendChild(this.createRow(data[i], i, data, false));
    });

    this.ctrlr.parameters[1].forEach((map: IParameterMapping, i: number) => {
      tbody.appendChild(
        this.createRow(
          data[this.ctrlr.parameters[0].length + i],
          i,
          data,
          true,
        ),
      );
    });

    table.appendChild(tbody);
    legend.appendChild(table);

    this.ctrlr.element.appendChild(legend); // insertBefore(legend,this.ctrlr.element.querySelector('svg'))

    return legend;
  }

  createRow(
    map: PiePart,
    index: number,
    data: PiePart[],
    border,
  ): HTMLDivElement {
    const row = document.createElement("tr");
    if (border && index === 0) {
      row.classList.add("top_border");
    } else {
      row.classList.add("no_border");
    }

    const colour = document.createElement("td");
    colour.appendChild(this.createCircle(map));
    row.appendChild(colour);

    const label = document.createElement("td");
    label.innerText = map.label;
    row.appendChild(label);

    const value = document.createElement("td");
    value.innerText =
      map.format === "currency"
        ? convertToCurrencyInTable(map.value)
        : map.value.toString();
    row.appendChild(value);

    return row;
  }

  createDiv(): HTMLDivElement {
    const item = document.createElement("div");
    item.style.display = "flex";
    item.style.flexDirection = "row";
    item.style.alignItems = "center";
    item.style.marginBottom = window.innerWidth > 700 ? ".5rem" : ".5rem";

    return item;
  }

  createCircle(map: PiePart): HTMLSpanElement {
    const circle = document.createElement("span");
    circle.style.width = window.innerWidth > 700 ? "1rem" : ".5rem";
    circle.style.height = window.innerWidth > 700 ? "1rem" : ".5rem";
    circle.style.borderRadius = "50%";
    circle.style.marginRight = window.innerWidth > 700 ? ".5rem" : ".25rem";
    circle.style.display = "flex";
    circle.style.background =
      map["colour"] !== undefined ? colours[map["colour"]][1] : "#eee";
    circle.style.borderWidth = "1px";
    circle.style.borderColor =
      map["colour"] !== undefined ? colours[map["colour"]][0] : "#ccc";
    circle.style.borderStyle = "solid";
    return circle;
  }

  createLabel(map: PiePart): HTMLSpanElement {
    const label = document.createElement("span");
    const labelText =
      this.ctrlr.page.main.params.language === "en"
        ? map["label_en"]
        : map["label"];

    if (labelText !== undefined) {
      label.style.fontFamily = "RO Sans Regular";
      label.style.fontSize = window.innerWidth > 700 ? ".8rem" : ".71em";
      label.style.lineHeight = "1.33";
      label.innerText = labelText;
    }

    return label;
  }
}
