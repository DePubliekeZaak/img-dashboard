import { breakpoints, colours } from "../../img-modules/styleguide";
import type { IParameterMapping } from "../../shared/interfaces";

export class HtmlLegendRowWithLines {
  constructor(private ctrlr: any) {}

  draw(location: string = "bottom", parameters?: any[]) {
    const prevLegend = this.ctrlr.element.querySelector("div.legend");
    // console.log(prevLegend)
    if (prevLegend) {
      this.ctrlr.element.removeChild(prevLegend);
    }

    const legend = document.createElement("div");
    legend.classList.add("legend");
    legend.style.position =
      window.innerWidth < breakpoints.sm ? "absolute" : "relative";
    legend.style.display = "flex";
    legend.style.flexDirection =
      window.innerWidth < breakpoints.xsm ? "column" : "row";
    legend.style.justifyContent = "center";
    legend.style.width = "100%";

    // console.log("index", this.ctrlr.index);
    // console.log(this.ctrlr.group.graphs);

    if (parameters === undefined) {
      parameters = this.ctrlr.group.graphs[this.ctrlr.index].parameters[0];
    }

    if (parameters && parameters[0] !== undefined) {
      parameters[0].forEach((map: any, i: number) => {
        const item = this.createDiv();
        item.appendChild(this.createCircle(map));
        item.appendChild(this.createLabel(map));
        legend.appendChild(item);
      });
    }

    // if (parameters && parameters[1] !== undefined) {
    //   parameters[1].forEach((map: any, i: number) => {
    //     let item = this.createDiv();
    //     item.appendChild(this.createRect(map));
    //     item.appendChild(this.createLabel(map));
    //     legend.appendChild(item);
    //   });
    // }

    if (location === "bottom") {
      this.ctrlr.element.appendChild(legend);
    } else {
      this.ctrlr.element.insertBefore(
        legend,
        this.ctrlr.element.querySelector("svg"),
      );
    }
  }

  createDiv(): HTMLDivElement {
    const item = document.createElement("div");
    item.style.display = "flex";
    item.style.flexDirection = "row";
    item.style.alignItems = "center";
    item.style.marginRight = window.innerWidth > 700 ? ".5rem" : ".5rem";

    return item;
  }

  createCircle(map: IParameterMapping): HTMLSpanElement {
    const circle = document.createElement("span");
    circle.style.width = window.innerWidth > 700 ? "1rem" : ".5rem";
    circle.style.height = window.innerWidth > 700 ? "1rem" : ".5rem";
    circle.style.borderRadius = "50%";
    circle.style.marginRight = window.innerWidth > 700 ? ".5rem" : ".25rem";
    circle.style.display = "inline-block";
    circle.style.background = colours[map["colour"]][1];
    circle.style.borderWidth = "1px";
    circle.style.borderColor = colours[map["colour"]][0];
    circle.style.borderStyle = "solid";
    return circle;
  }

  createRect(map: IParameterMapping): HTMLSpanElement {
    const rect = document.createElement("span");
    rect.style.width = window.innerWidth > 700 ? "1rem" : ".5rem";
    rect.style.height = window.innerWidth > 700 ? "1px" : "1px";
    // circle.style.borderRadius = '50%';
    rect.style.marginRight = window.innerWidth > 700 ? ".5rem" : ".25rem";
    rect.style.display = "inline-block";
    rect.style.background = colours[map["colour"]][0];
    // rect.style.borderWidth = '1px';
    // rect.style.borderColor = colours[map['colour']][0];
    // rect.style.borderStyle = 'solid';
    return rect;
  }

  createLabel(map: IParameterMapping): HTMLSpanElement {
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
