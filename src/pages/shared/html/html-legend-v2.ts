import { IParameterMapping } from "../../../charts/core/types";
import { breakpoints, colours } from "../../../img-modules/styleguide";
import { convertToCurrencyInTable } from "../_helpers";
import type { PiePart } from "../types_graphs";

export default class HtmlLegendV2 {
  rowHeight = 22;
  legend;

  constructor(private ctrlr) {}

  draw(data) {
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
    legend.style.width = "360px";

    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    data.forEach((map: PiePart, i: number) => {
      tbody.appendChild(this.createRow(map, i, data, false));
    });

    const p = {
      label: "Bezwaarpercentage",
      value: Math.round(((10 * data[0].value) / data[1].value) * 100) / 10,
      colour: "gray",
      accented: false,
      format: "percentage",
    };

    tbody.appendChild(this.createRow(p, 2, data, true));

    table.appendChild(tbody);
    legend.appendChild(table);

    this.ctrlr.element.appendChild(legend); // insertBefore(legend,this.ctrlr.element.querySelector('svg'))

    return legend;
  }

  format(value: string | number, format: string = "") {
    switch (format) {
      case "currency":
        return convertToCurrencyInTable(parseFloat(value?.toString()));

        break;

      case "percentage":
        if (value !== undefined) {
          return (
            (Math.round(10 * parseFloat(value.toString())) / 10).toString() +
            "%"
          );
        } else {
          return "0";
        }

        break;

      default:
        return value?.toString();
    }
  }

  createRow(
    map: PiePart,
    index: number,
    data: PiePart[],
    border: boolean,
  ): HTMLDivElement {
    const row = document.createElement("tr");

    if (border) {
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
    value.innerText = this.format(map.value, map.format);
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
