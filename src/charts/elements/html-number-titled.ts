import { breakpoints, colours } from "../../img-modules/styleguide";
import { convertToCurrency, thousands } from "../../pages/shared/_helpers";

export class HtmlNumberTitled {
  constructor(
    private ctrlr,
    private parameters,
    private element?: HTMLElement,
  ) {}

  draw() {
    let element = this.element != undefined ? this.element : this.ctrlr.element;

    element.innerHTML = "";

    let marginTop = "0.75rem";

    // if (window.innerWidth < breakpoints.sm) {
    //   marginTop = "1.5rem";
    // } else if (window.innerWidth < breakpoints.lg) {
    //   marginTop = ".5rem";
    // }

    element.style.display = "flex";
    element.style.flexDirection = "column";
    element.style.alignItems = "center";
    element.style.justifyContent = "center";

    let header = document.createElement("h3");
    header.classList.add("unbold");
    header.innerText = this.parameters[0].label;
    header.style.textAlign = "center";
    header.style.margin = "0";
    // header.style.textAlign =  window.innerWidth < breakpoints.lg ? 'center' : 'left';
    element.appendChild(header);

    let miniContainer = document.createElement("div");
    miniContainer.style.display = "flex";
    miniContainer.style.flexDirection = "column";
    miniContainer.style.alignItems = "center";
    miniContainer.style.justifyContent = "center";
    // miniContainer.style.border =  '2px solid ' + colours[this.parameters[0].colour][0];
    // miniContainer.style.padding =  '2.5rem 0';
    // miniContainer.style.width = "12rem";
    // miniContainer.style.height = "12rem";
    // miniContainer.style.margin =  '0 1.5rem';
    // miniContainer.style.borderRadius = '50%';

    let topDiv = document.createElement("div");
    topDiv.classList.add("number_accented");
    topDiv.style.display = "flex";
    topDiv.style.position = "relative";
    topDiv.style.flexDirection = "column";
    topDiv.style.justifyContent = "center";
    topDiv.style.alignItems =
      window.innerWidth < breakpoints.lg ? "center" : "center";
    topDiv.style.width = "auto";
    topDiv.style.marginBottom = marginTop;
    topDiv.style.marginTop = marginTop;

    let number = document.createElement("span");
    number.classList.add("number");
    number.classList.add("accented");
    number.style.fontSize = window.innerWidth < breakpoints.sm ? "2em" : "2rem";
    number.style.lineHeight = "1.45";
    number.style.color = "black";
    number.style.fontFamily = "Sora,sans-serif";
    number.style.fontWeight = "500";
    // number.style.marginTop = ".375rem";
    number.style.borderBottom =
      "2px solid " + colours[this.parameters[0].colour][0];

    topDiv.appendChild(number);

    if (this.parameters[0].units) {
      let units = document.createElement("span");
      units.classList.add("units");
      units.innerText = this.parameters[0].units;
      units.style.color = "black";
      units.style.fontSize = ".825rem";
      units.style.display = "block";
      units.style.marginTop = ".37rem";
      units.style.textAlign =
        window.innerWidth < breakpoints.lg ? "center" : "right";

      topDiv.appendChild(units);
    }

    // let bottomDiv = document.createElement("div");
    // bottomDiv.classList.add("number_accented");
    // bottomDiv.style.display = "flex";
    // bottomDiv.style.position = "relative";
    // bottomDiv.style.flexDirection = "column";
    // bottomDiv.style.justifyContent = "center";
    // bottomDiv.style.borderBottom =
    //   "2px solid " + colours[this.parameters[0].colour][0];

    // let _number = document.createElement("span");
    // _number.classList.add("number");
    // _number.classList.add("percentage");
    // _number.style.fontSize =
    //   window.innerWidth < breakpoints.sm ? "1.6rem" : "2.4rem";
    // _number.style.lineHeight = "1";
    // _number.style.color = "black";
    // _number.style.fontFamily = "Sora,sans-serif";
    // _number.style.fontWeight = "500";
    // _number.style.marginBottom = ".375rem";
    // _number.style.textAlign = "center";

    // let units = document.createElement('span');
    // units.classList.add('units');
    // units.innerText = "bezwaarpercentage";
    // units.style.color = 'black';
    // units.style.fontSize = '.825rem';
    // units.style.display = 'block';
    // units.style.marginTop= '.5rem';
    // units.style.textAlign =  window.innerWidth < breakpoints.lg ? 'center' : 'right';

    // bottomDiv.appendChild(_number);
    // // bottomDiv.appendChild(units);

    // miniContainer.appendChild(bottomDiv);
    miniContainer.appendChild(topDiv);

    element.appendChild(miniContainer);
  }

  redraw(data: any, extraParameter: string) {
    let element = this.element != undefined ? this.element : this.ctrlr.element;

    if (this.parameters[0].format === "currency") {
      element.querySelector(".number.accented").innerText =
        convertToCurrency(data);
    } else if (this.parameters[0].format === "percentage") {
      let value = Math.round(data * 10) / 10;
      element.querySelector(".number.accented").innerText = value + "%";
    } else {
      let value = this.ctrlr.config.extra.decimal
        ? Math.round(data * 10) / 10
        : Math.round(data);
      element.querySelector(".number.accented").innerText =
        value > 9999 ? thousands(value) : value;

      // element.querySelector(".number.percentage").innerText =
      //   parseFloat(data[1]).toFixed(1) + "%";
    }
  }
}
