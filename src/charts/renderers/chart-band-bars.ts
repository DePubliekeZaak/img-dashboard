import { colours } from "../../img-modules/styleguide";
import { convertToCurrency, thousands } from "../../shared/_helpers";
import type { Bar, Bars } from "../../shared/types_graphs";

export class ChartBandBar {
  bars: any;
  barsEnter: any;

  barLabels: any;
  barLabelsEnter: any;

  constructor(private ctrlr: any) {}

  draw(data: any) {
    this.bars = this.ctrlr.svg.layers.data
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("fill", (d: any) => colours[d.colour][1])
      .attr("stroke", (d: any) => colours[d.colour][0]);

    this.barLabels = this.ctrlr.svg.layers.data
      .selectAll(".barLabel")
      .data(data)
      .join("text")
      .attr("class", "barLabel smallest-label")
      .attr("x", 0)
      .attr("dx", "0px")
      .attr("dy", "-10px")
      .style("text-anchor", "middle");
  }

  redraw(data: Bars) {
    this.bars
      .attr("x", (d: Bar) => {
        return this.ctrlr.scales.x.fn(d.label);
      })
      .attr("y", this.ctrlr.dimensions.height)
      .attr("height", 0)
      .attr(
        "width",
        this.ctrlr.scales.x.config.type === "band"
          ? this.ctrlr.scales.x.scale.bandwidth()
          : this.ctrlr.dimensions.width / data.length - 1,
      )
      // .transition()
      // .duration(500)
      .attr("y", (d: any) =>
        this.ctrlr.config.extra.privacySensitive && d.value < 25
          ? this.ctrlr.dimensions.height
          : this.ctrlr.scales.y.fn(d.value),
      )
      .attr(
        "height",
        (d: any) =>
          this.ctrlr.dimensions.svgHeight - this.ctrlr.scales.y.fn(d.value),
      );

    this.bars.on("mouseover", (event: any, d: any) => {
      // console.log(d);
    });

    this.barLabels
      .text((d: any) => {
        if (d.format === "currency") {
          return convertToCurrency(d.value);
        } else if (d.format === "percentage") {
          return d.value + "%";
        } else {
          return this.ctrlr.config.extra.privacySensitive && d.value < 25
            ? "< 25"
            : thousands(d.value);
        }
      })
      .attr("transform", (d: any) => {
        if (this.ctrlr.scales.x.config.type === "band") {
          return (
            "translate(" +
            (this.ctrlr.scales.x.fn(d.label) +
              this.ctrlr.scales.x.scale.bandwidth() / 2) +
            "," +
            (this.ctrlr.config.extra.privacySensitive && d.value < 25
              ? this.ctrlr.dimensions.svgHeight
              : this.ctrlr.scales.y.fn(d.value)) +
            ")"
          );
        } else {
          return (
            "translate(" +
            this.ctrlr.dimensions.width / 2 +
            "," +
            (this.ctrlr.config.extra.privacySensitive && d.value < 25
              ? this.ctrlr.dimensions.svgHeight
              : this.ctrlr.scales.y.fn(d.value)) +
            ")"
          );
        }
      })
      .attr("fill-opacity", 0)
      .transition()
      .delay(500)
      .duration(500)
      .attr("fill-opacity", 1);
  }
}
