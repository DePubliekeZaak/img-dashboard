import { colours } from "../../img-modules/styleguide";
import type { Line } from "../../pages/shared/types_graphs";

export class ChartLine {
  line;
  lineEnter;

  constructor(
    public ctrlr: any,
    public xParameter: string,
    public yParameter: string,
  ) {}

  draw(data: Line) {
    this.line = this.ctrlr.svg.layers.data
      .selectAll(".line-" + this.yParameter)
      .data([data])
      .join("path")
      .attr("class", "line-" + this.yParameter)
      .attr("fill", "transparent")
      .attr("stroke", (d) => colours[data[0].colour || "purple"][0])
      .attr("stroke-width", 1);
  }

  lineMaker(): any {
    return window.d3
      .line()
      .x((d) => this.ctrlr.scales.x.scale(d["time"] || d["date"]))
      .y((d) =>
        this.ctrlr.scales.y1 !== undefined
          ? this.ctrlr.scales.y1.scale(d["value"])
          : this.ctrlr.scales.y.scale(d["value"]),
      )
      .curve(window.d3.curveStepBefore);
  }

  redraw() {
    this.line.transition().duration(250).attr("d", this.lineMaker());
  }
}
