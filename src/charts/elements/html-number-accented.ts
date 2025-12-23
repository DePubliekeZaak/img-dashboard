import { breakpoints, colours } from "../../img-modules/styleguide";
import { convertToCurrency, thousands } from "../../pages/shared/_helpers";

export class HtmlNumberAccented {
  constructor(
    private ctrlr,
    private parameter,
    private element?,
  ) {}

  draw() {
    let element = this.element != undefined ? this.element : this.ctrlr.element;

    element.innerHTML = "";
  
    let marginTop = "0";

    if (window.innerWidth < breakpoints.sm) {
      marginTop = "1.5rem";
    } else if (window.innerWidth < breakpoints.lg) {
      marginTop = ".5rem";
    }

    let miniContainer = document.createElement("div");
    miniContainer.style.display = "flex";
    miniContainer.style.flexDirection = "column";
    miniContainer.style.alignItems = "center";

    let div = document.createElement("div");
    div.classList.add("number_accented");
    div.style.display = "flex";
    div.style.position = "relative";
    div.style.flexDirection = "column";
    div.style.justifyContent = "center";
    div.style.alignItems =
      window.innerWidth < breakpoints.lg ? "center" : "center";
    div.style.width = "auto";
    //  div.style.height = (this.ctrlr.config.extra.circleRadius) ? this.ctrlr.config.extra.circleRadius.toString() + 'rem' : '7.5rem';
    div.style.marginBottom = marginTop;
    div.style.marginTop = marginTop;

    let number = document.createElement("span");
    number.classList.add("number");
    number.classList.add("accented");
    number.style.fontSize =
      window.innerWidth < breakpoints.sm ? "1.6rem" : "2rem";
    number.style.lineHeight = "1.45";
    number.style.color = "black";
    number.style.fontFamily = "Sora,sans-serif";
    number.style.fontWeight = "500";
    number.style.borderBottom =
      "2px solid " + colours[this.parameter.colour][0];

    div.appendChild(number);

    if (this.parameter.units) {
      let units = document.createElement("span");
      units.classList.add("units");
      units.innerText = this.parameter.units;
      units.style.color = "black";
      // units.style.fontFamily = 'NotoSans Regular';
      units.style.fontSize = ".825rem";
      // units.style.textTransform = 'uppercase'
      units.style.display = "block";
      units.style.marginTop = ".37rem";
      units.style.textAlign =
        window.innerWidth < breakpoints.lg ? "center" : "right";
      div.appendChild(units);
    }

    miniContainer.appendChild(div);
    element.appendChild(miniContainer);
  }

  redraw(data, extraParameter) {



    let element = this.element != undefined ? this.element : this.ctrlr.element;

    if (this.parameter.format === "currency") {
      element.querySelector(".number.accented").innerText = convertToCurrency(
        data
      );
    } else if (this.parameter.format === "percentage") {
      let value = Math.round(data * 10) / 10;
      element.querySelector(".number.accented").innerText = value + "%";
    } else if (this.parameter.format === "decimals") {
      let value = Math.round(data * 10) / 10;
      element.querySelector(".number.accented").innerText = value.toFixed(1);
    } else {
      let value =
        this.ctrlr.config.extra && this.ctrlr.config.extra.decimal
          ? Math.round(data * 10) / 10
          : Math.round(data);
      element.querySelector(".number.accented").innerText =
        value > 999 ? thousands(value) : value;
    }
  }
}
