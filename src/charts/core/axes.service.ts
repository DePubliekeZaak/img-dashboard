import { localTime, monthAbbrevs, monthNames } from "./_formats";
import {
  convertToCurrency,
  convertToCurrencyInMillions,
  convertToMillions,
  thousands,
} from "../../pages/shared/_helpers";
import { Dimensions } from "./types";
import { DataPart, Segment } from "../../pages/shared/types";
import { breakpoints } from "../../img-modules/styleguide";
import { Bars } from "../../pages/shared/types_graphs";
export class AxesService {
  axis;
  axisGroup;

  constructor(
    private ctrlr,
    private config,
  ) {
    this.draw();
  }

  draw() {
    this.axisGroup = this.ctrlr.svg.layers.axes.append("g");

    switch (this.config.position) {
      case "bottom":
      case "belowBottom":
        this.axisGroup.attr("class", "x-axis");

        this.axis = window.d3.axisBottom(this.ctrlr.scales[this.config.scale]);

        break;

      case "center":
        this.axisGroup.attr("class", "x-axis");

        this.axis = window.d3.axisBottom(this.ctrlr.scales[this.config.scale]);

        break;

      case "top":
        this.axisGroup.attr("class", "x-axis");

        this.axis = window.d3.axisTop(this.ctrlr.scales[this.config.scale]);

        break;

      case "left":
        this.axisGroup.attr("class", "y-axis");

        this.axis = window.d3.axisLeft(this.ctrlr.scales[this.config.scale]);

        break;

      case "right":
        this.axisGroup.attr("class", "y-axis");

        this.axis = window.d3.axisRight(this.ctrlr.scales[this.config.scale]);

        break;

      default:
        return false;
    }
  }

  redraw(
    dimensions: Dimensions,
    scale: any,
    data: any[],
    segment: Segment,
    format: string,
  ) {
    switch (this.ctrlr.scales[this.config.scale].config.type) {
      case "band":
        if (this.config.format == "quarters") {
          let year;

          this.axis.tickFormat((d, i) => {
            let v = "";
            if (d == undefined || d == null) {
              return;
            }
            let newyear = d.slice(0, 4);
            if (year != newyear && i != 0) {
              // console.log("new year: " + newyear)
              v = year;
            }
            year = newyear;
            return v;
          });
        } else if (this.config.format == "month") {
          this.axis.tickFormat((d, i) => {
        
            if (segment.periodization == 'weekly') {

              const week = parseInt(d.slice(-2));
              const monthStartWeeks = [1, 5, 9, 14, 18, 22, 27, 31, 36, 40, 44, 48];
              const monthIndex = monthStartWeeks.findIndex((w, idx) => 
                week >= w && (idx === 11 || week < monthStartWeeks[idx + 1])
              );
              
              // Only show label at month start
              if (monthStartWeeks.includes(week)) {
                return monthAbbrevs[monthIndex];
              }
              return '';
              
            } else {

              return monthAbbrevs[parseInt(d.slice(-2)) - 1]
                         
            }

            
          });
        } else {
          this.axis.tickFormat((d, i) => {
            return d;
          });
        }
        break;

      case "linear":
        if (this.config.format === "percentage" || segment.normalized) {
          this.axis
            .ticks(5)
            .tickFormat((d) => (segment.normalized ? 100 * d + "%" : d + "%"));
        } else if (this.config.format === "currency") {
          this.axis.ticks(4).tickFormat((d) => convertToCurrency(d));
        } else if (this.config.format === "millions") {
          this.axis.ticks(4).tickFormat((d) => convertToMillions(d));
        } else if (this.config.format === "hidden") {
          this.axis.ticks(0);
        } else {
          if (format === "currency") {
            this.axis.ticks(4).tickFormat((d) => {
              return convertToCurrencyInMillions(d.toString());
            });
          } else {
            this.axis.ticks(4).tickFormat((d) => {
              return thousands(d.toString());
            });
          }
        }

        break;

      case "log":
        this.axis.ticks(4);

        break;

      case "time":
        let tickOrder, tickSpread;

        //    if(this.ctrlr.config.extra.xScaleTicks === 'quarterly') {

        tickOrder = "timeMonth";
        tickSpread = window.innerWidth < breakpoints.sm ? 12 : 3;

        //    } else {

        //        tickOrder = this.ctrlr.config.extra.xScaleTicks;
        //
        //    }

        this.axis
          .ticks(window.d3[tickOrder].every(tickSpread))
          .tickFormat((date) =>
            window.d3.timeYear(date) < date
              ? localTime.format("%b")(date)
              : localTime.format("%Y")(date),
          );

        break;

      case "bandTime":
        this.axis
          .ticks(window.d3[this.ctrlr.config.extra.xScaleTicks].every(1))
          .tickFormat((date) => localTime.format("%d %b")(new Date(date)));
        break;

      case "stacked":
        this.axis.ticks(10, "%");
        break;

      case "stackedNormalized":
        this.axis.ticks(10, "%");
        break;

      default:
    }

    switch (this.config.position) {
      case "bottom":
        this.axisGroup.attr(
          "transform",
          "translate(" + this.ctrlr.config.innerPadding.left + "," + dimensions.svgHeight + ")",
        );
        break;

      case "belowBottom":
        this.axisGroup.attr(
          "transform",
          "translate(" + 0 + "," + (dimensions.svgHeight + 0) + ")",
        );
        break;

      case "top":
        this.axisGroup.attr("transform", "translate(" + 0 + "," + 0 + ")");
        break;

      case "left":
        this.axisGroup.attr("transform", "translate(" + this.ctrlr.config.innerPadding.left + "," + 0 + ")");
        break;

      case "right":
        this.axisGroup.attr(
          "transform",
          "translate(" + (this.ctrlr.config.innerPadding.left + dimensions.coreWidth) + "," + 0 + ")",
        );
        break;

      default:
    }

    this.axisGroup.transition().duration(10).call(this.axis.scale(scale));

    // if(this.ctrlr.mapping.args && this.ctrlr.mapping.args[0] === "alternateTicks") {

    //     if (window.innerWidth < breakpoints.sm) {

    //         this.ctrlr.svg.layers.axes.selectAll("g.x-axis g.tick text")
    //         .attr("text-anchor","end")
    //         .attr("transform","translate(-10,0) rotate(-45)")
    //         // .attr("dy", (d,i) => {
    //         //     return (i % 2 == 0 ) ? 16 : 32
    //         // } );

    //     } else {

    //         this.ctrlr.svg.layers.axes.selectAll("g.x-axis g.tick text")
    //         .attr("dy", (d,i) => {
    //             return (i % 2 == 0 ) ? 16 : 32
    //         } );
    //     }

    // }

    if (
      ["weekly", "monthly", "quarterly", "yearly"].indexOf(this.config.format) >
      -1
    ) {
      const offset = this.ctrlr.dimensions.svgWidth / data.length / 2;

      this.ctrlr.svg.layers.axes
        .selectAll("g.x-axis g.tick text")
        .attr("dx", offset);

      this.ctrlr.svg.layers.axes
        .selectAll("g.x-axis g.tick line")
        .attr("x1", offset)
        .attr("x2", offset);
    }
  }
}
