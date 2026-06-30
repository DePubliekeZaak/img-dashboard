import { breakpoints, colours } from "../../img-modules/styleguide";
import { convertToCurrency, thousands } from "../../shared/_helpers";
import type { IParameterMapping } from "../core/types";

export class HtmlNumberSimple {
  constructor(
    private ctrlr: any,
    private parameter: IParameterMapping,
    private element?: HTMLElement,
  ) {}

  draw() {

    if (this.parameter == undefined) return;

    const element =
      this.element !== undefined ? this.element : this.ctrlr.element;

    element.innerHTML = "";

    let marginTop = "0";

    if (window.innerWidth < breakpoints.sm) {
      marginTop = "1.5rem";
    } else if (window.innerWidth < breakpoints.lg) {
      marginTop = ".5rem";
    }

    const miniContainer = document.createElement("div");
    miniContainer.style.display = "flex";
    miniContainer.style.flexDirection = "column";
    miniContainer.style.alignItems = "center";

    const div = document.createElement("div");
    div.classList.add("number_accented");
    div.style.display = "flex";
    div.style.position = "relative";
    div.style.flexDirection = "column";
    div.style.justifyContent = "center";
    div.style.alignItems =
      window.innerWidth < breakpoints.lg ? "center" : "center";
    div.style.width = "auto";
    div.style.marginBottom = marginTop;
    div.style.marginTop = marginTop;

    const number = document.createElement("span");
    number.classList.add("number");
    number.classList.add("accented");
    number.style.fontSize =
      window.innerWidth < breakpoints.sm ? "1.6rem" : "2rem";
    number.style.lineHeight = "1.45";
    number.style.color = "black";
    number.style.fontFamily = "Sora,sans-serif";
    number.style.fontWeight = "500";
    let c = colours[this.parameter?.colour!];
    number.style.borderBottom =
      "2px solid " + c != undefined ? c[0] : "black";

    div.appendChild(number);

    if (this.parameter.units) {
      const units = document.createElement("span");
      units.classList.add("units");
      units.innerText = this.parameter.units;
      units.style.color = "black";
      units.style.fontFamily = "Sora,sans-serif";
      units.style.fontSize = ".875rem";
      units.style.display = "block";
      units.style.marginTop = ".37rem";
      units.style.textAlign =
        window.innerWidth < breakpoints.lg ? "center" : "right";
      div.appendChild(units);
    }

    miniContainer.appendChild(div);
    element.appendChild(miniContainer);
  }

  redraw(data: any, extraParameter: string) {

    if (this.parameter == undefined) return;

    const element =
      this.element !== undefined ? this.element : this.ctrlr.element;

    if (this.parameter.format === "currency") {
      element.querySelector(".number.accented").innerText =
        convertToCurrency(data);
    } else if (this.parameter.format === "percentage") {
      const value = Math.round(data * 10) / 10;
      element.querySelector(".number.accented").innerText = value + "%";
    } else {
      const value = this.ctrlr.config.extra.decimal
        ? Math.round(data * 10) / 10
        : Math.round(data);
      element.querySelector(".number.accented").innerText =
        value > 999 ? thousands(value) : value;
    }
  }
}
