import * as d3 from "d3";
import { colours } from "../../img-modules/styleguide";
import { convertToCurrency, slugify } from "../../pages/shared/_helpers";

export default class MapV1 {
  projection;
  path;
  map;
  values;

  constructor(private ctrlr) {
    this.init();
  }

  init() {
    this.projection = window.d3.geoMercator();
    this.path = window.d3.geoPath().projection(this.projection);

    var b = [
        [0.114, -1.101],
        [0.12022108488117365, -1.105],
      ],
      s =
        0.15 /
        Math.max(
          (b[1][0] - b[0][0]) / this.ctrlr.dimensions.svgWidth,
          (b[1][1] - b[0][1]) / this.ctrlr.dimensions.graphHeight,
        ),
      t = [
        (this.ctrlr.dimensions.svgWidth - s * (b[1][0] + b[0][0])) / 2 + 80,
        (this.ctrlr.dimensions.graphHeight - s * (b[1][1] + b[0][1])) / 2 - 60,
      ];

    this.projection.scale(s).translate(t);
  }

  draw(features) {
    //  console.log(features.find( f => f.properties.gemeentenaam === "Het Hogeland").properties.value)
    this.map = this.ctrlr.svg.layers.data
      .selectAll("path.i-" + this.ctrlr.index)
      .data(
        features,
        (d) => d.properties.gemeentenaam + "_" + d.properties.year,
      )
      .join("path")
      .attr("d", this.path)
      .attr("class", (d: any, i: number) => slugify(d.properties.gemeentenaam))
      .attr("class", "i-" + this.ctrlr.index)
      .attr("fill", "#eee")
      .attr("stroke", "#fff")
      .attr("fill", (d) => {
        const c = d.properties.colour;
        return d.properties.value > 0 ? colours[c][0] || colours[c][0] : "#eee";
      })
      .attr("fill-opacity", (d) => {
        return d.properties.value > 0
          ? this.ctrlr.scales.y.scale(d.properties.value)
          : 1;
      });

    this.map
      .on("mouseover", (event: any, d: any) => {
        let html =
          "<div class='uppercase'>" +
          d.properties.gemeentenaam +
          "</div><div>" +
          d.properties.value +
          "</div>";

        if (d.properties.format === "currency") {
          html =
            "<div class='uppercase'>" +
            d.properties.gemeentenaam +
            "</div><div>" +
            convertToCurrency(d.properties.value) +
            "</div>";
        } else if (d.properties.format === "percentage") {
          html =
            "<div class='uppercase'>" +
            d.properties.gemeentenaam +
            "</div><div>" +
            d.properties.value +
            "%</div>";
        }

        if (d.properties.value && d.properties.value > 0) {
          window.d3.select(event.target).attr("fill-opacity", 1);

          window.d3
            .select(".tooltip")
            .html(html)
            .style("left", event.pageX + 5 + "px")
            .style("top", event.pageY - 5 + "px")
            .transition()
            .duration(250)
            .style("opacity", 1);
        }
      })
      .on("mouseout", (event, d) => {
        window.d3
          .select(event.target)
          .attr("fill-opacity", (e: any) =>
            e.properties.value > 0
              ? this.ctrlr.scales.y.fn(d.properties.value)
              : 1,
          );

        window.d3
          .select(".tooltip")
          .transition()
          .duration(250)
          .style("opacity", 0);
      });
  }

  redraw(property, colour) {
    this.ctrlr.svg.layers.data.selectAll("path.i-" + this.ctrlr.index);
  }

  highlight(segment) {
    this.map.attr("fill", (d) => {
      return segment === d.properties.gemeenteSlug ? colours["red"][0] : "#eee";
    });
  }
}
