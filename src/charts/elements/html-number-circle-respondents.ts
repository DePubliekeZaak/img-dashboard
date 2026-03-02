import { breakpoints, colours } from "../../img-modules/styleguide";
import { convertToCurrency, thousands } from "../../pages/shared/_helpers";
import { IParameterMapping } from "../core/types";

export class HtmlNumberCircleRespondents {
  constructor(
    private ctrlr: any,
    private parameter: any,
    private element?: HTMLElement,
  ) {}

  draw() {
    const element =
      this.element !== undefined ? this.element : this.ctrlr.element;
    element.style.justifyContent = "center";

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
    div.style.width = "10rem";
    div.style.height = "10rem";
    div.style.borderRadius = "50%";
    div.style.border = "2px solid " + colours[this.parameter.colour][0];
    div.style.marginBottom = marginTop;
    div.style.marginTop = marginTop;

    const number = document.createElement("span");
    number.classList.add("number");
    number.classList.add("accented");
    number.style.fontSize =
      window.innerWidth < breakpoints.sm ? "1.6rem" : "2rem";
    number.style.lineHeight = "1.45";
    number.style.color = "black";
    number.style.fontFamily = "Sora, sans-serif";
    number.style.fontWeight = "500";
    number.style.borderBottom =
      "2px solid " + colours[this.parameter.colour][0];

    div.appendChild(number);

    // if(this.parameter.units) {
    const secondNumber = document.createElement("span");
    secondNumber.classList.add("second_number");
    secondNumber.style.color = "black";
    secondNumber.style.fontSize = ".825rem";
    secondNumber.style.display = "block";
    secondNumber.style.marginTop = ".37rem";
    secondNumber.style.textAlign =
      window.innerWidth < breakpoints.lg ? "center" : "right";
    div.appendChild(secondNumber);

    const units = document.createElement("span");
    units.classList.add("units");
    units.innerText = "respondenten";
    units.style.color = "black";
    units.style.fontSize = ".825rem";
    units.style.display = "block";
    units.style.marginTop = "-.25rem";
    units.style.textAlign =
      window.innerWidth < breakpoints.lg ? "center" : "right";
    div.appendChild(units);

    // }

    miniContainer.appendChild(div);
    element.appendChild(miniContainer);
  }

  redraw(data: any, parameter: string, extraParameter: string) {
    const element =
      this.element !== undefined ? this.element : this.ctrlr.element;

    element.querySelector(".second_number").innerText = thousands(
      data[extraParameter],
    );

    const value = Math.round(data[parameter] * 10) / 10;
    element.querySelector(".number.accented").innerText = value.toFixed(1);
  }
}
