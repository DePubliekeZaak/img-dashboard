import { breakpoints, colours } from "../../img-modules/styleguide";
import {
  convertToCurrencyInMillions,
  convertToCurrency,
  slugify,
  thousands,
} from "../../pages/shared/_helpers";
import { TrendBar } from "../../pages/shared/types_graphs";
import { IGraphControllerV3 } from "../core/graph-v3";

export default class ChartBarTrend {
  slug;

  constructor(private ctrlr: IGraphControllerV3) {}

  draw(data: TrendBar[]) {
    let self = this;

    this.slug =
      this.ctrlr.filters && this.ctrlr.filters.length > 0
        ? this.ctrlr.slug
        : slugify(data[0].label);

    let groupSlug = data[0].name != undefined ? data[0].name : this.ctrlr.slug;

    const group = this.ctrlr.svg.layers.data
      .selectAll("g." + groupSlug)
      .data([groupSlug])
      .join("g")
      .attr("class", (d) => d);

    // if there is a select option dont use the extra class
    const bars = group
      .selectAll(".bar." + this.slug)
      .data(data, (d) => d.date)
      .join("rect")
      .attr("class", (d) => "bar " + this.slug)
      .attr("y", self.ctrlr.dimensions.svgHeight)
      .attr("height", 0);
  }

  redraw(data: TrendBar[], period?: string) {
    let self = this;
    // can be called multiple times for extra trends
    let groupSlug = data[0].name != undefined ? data[0].name : this.ctrlr.slug;

    const group = this.ctrlr.svg.layers.data.selectAll("g." + groupSlug);

    const bars = group.selectAll(".bar." + this.slug);

    let tooltip = function popup(d) {
      let value = "0";

      switch (d.format) {
        case "number":
          value = d.value;
          break;
        case "percentage":
          value = d.value + "%";
          break;
        case "currency":self.ctrlr.config.innerPadding.right
          value = convertToCurrency(d.value);
          break;
        default:
          value = thousands(d.value);
      }

      if (period == "weekly") {
        return `
          <div>${d.label}</div>
          <div>week ${d.meta._week} - ${d.meta._year}</div>
          <div>${value}</div>
      `;
      } else {
         console.log(d.meta)
        return `
          <div>${d.label}</div>
          <div>maand ${d.meta._month} - ${d.meta._year}</div>
          <div>${value}</div>
      `;
      }
    };

    // const space =
    // period == 'weekly'
    // ? 6
    // : data.length < 10
    // ? 6
    // : 1;



    const space = data.length < 10 ? 6 : 1;

    let barWidth = (this.ctrlr.dimensions.coreWidth / (data.length)) - 2;

    bars
      .attr("x", (d: TrendBar, i: number) => {
        return self.ctrlr.scales.x.fn(d.date);
      })

      .attr("width", barWidth)
      .transition()
      .duration(300)
      .attr("y", (d) => self.ctrlr.scales.y.fn(d.value))
      .attr("height", (d) => {
        const h =
          self.ctrlr.dimensions.svgHeight - self.ctrlr.scales.y.fn(d.value);
        return h > 0 ? h : 0;
      })
      .attr("fill", (d) => colours[d.colour][1]);

    bars
      .on("mouseover", (event: any, d: any) => {
        self.ctrlr.svg.layers.data
          .selectAll(".bar")
          .style("fill", (b) =>
            b !== d ? colours[b.colour][1] : colours[b.colour][0],
          );

        const t = window.d3.select(".tooltip");

        t.html(tooltip(d))
          .style("top", event.pageY - 0 + "px")
          .transition()
          .duration(250)
          .style("opacity", 1);

        if (event.pageX <= window.innerWidth / 2) {
          t.style("left", event.pageX - 0 + "px").style("right", "auto");
        } else {
          let w =
            this.ctrlr.element == null ||
            this.ctrlr.element.parentElement == null
              ? window.innerWidth
              : this.ctrlr.element.parentElement.getBoundingClientRect().width;
          if (window.innerWidth > breakpoints.md) w = window.innerWidth;
          t.style("right", w - event.pageX + 0 + "px").style("left", "auto");
        }
      })
      .on("mouseout", (d) => {
        self.ctrlr.svg.layers.data
          .selectAll(".bar")
          .style("fill", (b) => colours[b.colour][1]);

        window.d3
          .select(".tooltip")
          .transition()
          .duration(250)
          .style("opacity", 0);
      });
  }
}
