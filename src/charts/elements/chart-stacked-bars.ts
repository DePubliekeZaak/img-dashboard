import { colours } from "../../img-modules/styleguide";
import { toDutchMonths } from "../../pages/shared/_helpers";

export default class ChartStackedBars {
  bars;
  barsEnter;

  barLabels;
  barLabelsEnter;

  group;
  series;

  constructor(private ctrlr) {}

  draw(data) {
    this.series = this.ctrlr.svg.layers.data
      .selectAll("g.serie")
      .data(data.stacked)
      .join("g")
      .attr("class", (d, i) => "serie " + this.ctrlr.parameters[0][i]["colour"])
      // .attr("stroke", (d,i) => colours[this.ctrlr.parameters[0][i]['colour']][0])
      .attr(
        "fill",
        (d, i) => colours[this.ctrlr.parameters[0][i]["colour"]][1],
      );

    this.bars = this.series
      .selectAll(".bar")
      .data((d) => d)
      .join("rect")
      .attr("class", "bar");
  }

  redraw(data: any) {
    const width = this.ctrlr.dimensions.svgWidth / data.stacked[0].length - 1;

    this.bars
      .attr("x", (d: any, i: number) =>
        this.ctrlr.scales.x.scale(d.data["date"]),
      )
      .attr("y", this.ctrlr.dimensions.graphHeight)
      .attr("height", 0)
      .attr("width", width)
      .transition()
      .duration(300)
      .attr("y", (d) => this.ctrlr.scales.y.scale(d[1]))
      .attr("height", (d, i) => {
        const h =
          this.ctrlr.scales.y.scale(d[0]) - this.ctrlr.scales.y.scale(d[1]);
        return h > 0 ? h : 0;
      });

    this.bars
      .on("mouseover", (event: any, d: any) => {
        const t = window.d3
          .select(".tooltip")
          .html(() => {
            let html = "<div>" + d.data.year + "</div>";
            html +=
              "<div>" + toDutchMonths(parseFloat(d.data.month)) + "</div>";

            for (const map of this.ctrlr.parameters[0]) {
              html +=
                "<div>" + map.label + " : " + d.data[map.column] + "</div>";
            }

            // if (data.line !== undefined) {

            //     let period = data.line.find( dd => dd.time === d.data.date);

            //     if(period !== undefined) {

            //         for (let map of self.ctrlr.parameters[1]) {

            //             html +=  '<div>' + map.label + ' : ' + Math.round(period.value) + '%</div>';

            //         }
            //     }

            // }

            // for (let p of self.ctrlr.mapping.parameters[0]) {
            //         html += p.short + ': ' + d.data[p.column] + '<br/>';
            // }

            // html += 'cummulatief' + ': ' + Math.round(d.data['percentage'] * 10) / 10 + '%<br/>';

            return html;
          })
          .style("top", event.pageY + "px");

        if (event.pageX < window.innerWidth / 2) {
          t.style("left", event.pageX + "px").style("right", "auto");
        } else {
          t.style("right", window.innerWidth - event.pageX + "px").style(
            "left",
            "auto",
          );
        }

        t.transition().duration(250).style("opacity", 1);
      })
      .on("mouseout", (event: any, d: any, i: number) => {
        window.d3.select(event.target).attr("fill", "inherit");

        window.d3
          .select(".tooltip")
          .transition()
          .duration(250)
          .style("opacity", 0);
      });
  }
}
