import { colours } from "../../img-modules/styleguide";
import {
  convertToCurrency,
  thousands,
  toDutchMonths,
} from "../../pages/shared/_helpers";
import type { Segment } from "../../pages/shared/types";

export default class ChartStackedBarsV2 {
  bars: any;
  barsEnter: any;

  barLabels: any;
  barLabelsEnter: any;

  group: any;
  series: any;

  constructor(private ctrlr: any) {}

  draw(data) {
    this.series = this.ctrlr.svg.layers.data
      .selectAll("g.serie")
      .data(data.stacked)
      .join("g")
      .attr("class", (d, i) => "serie " + this.ctrlr.parameters[0][i]["colour"])
      //.attr("stroke", (d,i) => colours[this.ctrlr.parameters[0][i]['colour']][0])
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

  redraw(data: any, segment: Segment) {
    const width = this.ctrlr.dimensions.svgWidth / data.stacked[0].length - 2;

    this.bars
      .attr("x", (d: any, i: number) =>
        this.ctrlr.scales.x.scale(d.data["date"]),
      )
      .attr("width", width)
      .transition()
      .duration(100)
      .attr("y", (d) => this.ctrlr.scales.y.scale(d[1]))
      .attr("height", (d, i) => {
        const h =
          this.ctrlr.scales.y.scale(d[0]) - this.ctrlr.scales.y.scale(d[1]);
        return h > 0 ? h : 0;
      });

    this.bars
      .on("mouseover", (event: any, d: any) => {
        // console.log(segment?.normalized)

        const t = window.d3
          .select(".tooltip")
          .html(() => {
            const tijdsbepaling =
              segment.periodization === "monthly"
                ? toDutchMonths(parseFloat(d.data._month))
                : "week " + d.data._week;

            let html = "<div>" + d.data._year + "</div>";
            html += "<div>" + tijdsbepaling + "</div>";

            for (const map of this.ctrlr.parameters[
              segment?.parameterIndex || 0
            ]) {
              const c =
                segment && segment.cumulative
                  ? map.column + "_cumul"
                  : map.column + "_aantal"
              let v = d.data[c];
              v = v === null ? 0 : v;

              if (map.format === "currency") {
                v = convertToCurrency(v);
              }

              if (segment?.normalized) {
                v = (v * 100).toFixed(1) + "%";
              }

              html += "<div>" + map.label + " : " + thousands(v) + "</div>";
            }

            // if (data.line !== undefined) {
            //   let period = data.line.find((dd) => dd.time === d.data.date);

            //   if (period !== undefined) {
            //     for (let map of self.ctrlr.parameters[1]) {
            //       html +=
            //         "<div>" +
            //         map.label +
            //         " : " +
            //         Math.round(period.value) +
            //         "%</div>";
            //     }
            //   }
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
