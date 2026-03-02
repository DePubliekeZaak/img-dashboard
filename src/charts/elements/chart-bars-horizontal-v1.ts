import { breakpoints, colours } from "../../img-modules/styleguide";

export class ChartBarsHorizontalV1 {
  series;
  seriesEnter;

  bars;
  barsEnter;

  barLabels;
  barLabelsEnter;

  barValues;
  barValuesEnter;

  constructor(private ctrlr) {}

  draw(data) {
    this.bars = this.ctrlr.svg.layers.data
      .selectAll(".bar")
      .data(data.filter((d) => d.colour))
      .join("rect")
      .attr("class", "bar")
      .attr("fill", (d) => colours[d.colour][1])
      .attr("stroke", (d) => colours[d.colour][0]);

    this.barLabels = this.ctrlr.svg.layers.data
      .selectAll(".barLabel")
      .data(data.filter((d) => d.label))
      .join("text")
      .attr("class", "barLabel small-label")
      .attr("x", 0)
      .attr("dx", "12px")
      .attr("dy", "-6px")
      .style("text-anchor", "end");

    this.barValues = this.ctrlr.svg.layers.data
      .selectAll(".barValue")
      .data(data)
      .join("text")
      .attr("class", "barValue small-label")
      .attr("x", 0)
      .attr("dx", "0px")
      .attr("dy", "-6px")
      .style("text-anchor", "start");
  }

  redraw() {
    //   let no_respondents = data.slice[0][this.ctrlr.graphObject.config.extra.columnForAverage]

    this.bars
      .attr("x", 0)
      .attr("y", (d) => this.ctrlr.scales.y.scale(d.label))
      .attr("height", this.ctrlr.yScale.bandwidth())
      .transition()
      .duration(500)
      .attr("width", (d) => this.ctrlr.scales.x.scale(d.value));

    this.barLabels
      .text((d: any) => {
        return d.label;
      })
      .attr("transform", (d) => {
        const offset =
          window.innerWidth > breakpoints.bax
            ? -(this.ctrlr.scales.y.scale.bandwidth() * 0.15)
            : 0;
        return (
          "translate(" +
          -this.ctrlr.config.padding.left +
          "," +
          (this.ctrlr.scales.y.scale(d.label) +
            (this.ctrlr.scales.y.scale.bandwidth() + offset)) +
          ")"
        );
      });

    this.barValues
      .text((d) => {
        let text = d.value === 0 ? "" : d.value;

        if (d.no_respondents) {
          const avg =
            (
              Math.round(10 * 100 * (d.value / d.no_respondents)) / 10
            ).toString() + "%";
          text = text + " (" + avg + ")";
        }

        return text;
      })
      .attr("transform", (d) => {
        const offset =
          window.innerWidth > breakpoints.bax
            ? -(this.ctrlr.scales.y.scale.bandwidth() * 0.15)
            : 0;
        return (
          "translate(" +
          (this.ctrlr.scales.x.scale(d.value) + 6) +
          "," +
          (this.ctrlr.scales.y.scale(d.label) +
            (this.ctrlr.scales.y.scale.bandwidth() + offset)) +
          ")"
        );
      })
      .attr("fill-opacity", 0)
      .transition()
      .delay(500)
      .duration(500)
      .attr("fill-opacity", 1);
    // .attr('fill-opacity', 0)
    // .transition()
    // .delay(500)
    // .duration(500)
    // .attr('fill-opacity', 1)
  }
}
