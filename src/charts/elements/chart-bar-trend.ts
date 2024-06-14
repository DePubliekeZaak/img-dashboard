
import { colours } from '../../img-modules/styleguide';
import { slugify } from '../../pages/shared/_helpers';
import { TrendBar } from '../../pages/shared/types_graphs';
import { IGraphControllerV3 } from '../core/graph-v3';

export default class ChartBarTrend {

    slug;

    constructor(
        private ctrlr: IGraphControllerV3
    ){}

    draw(data: TrendBar[]) {

        this.slug = (this.ctrlr.filters && this.ctrlr.filters.length > 0) ? this.ctrlr.slug : slugify(data[0].label);

        // console.log(this.slug);

        let groupSlug = data[0].name != undefined ? data[0].name  : this.ctrlr.slug;

        const group = this.ctrlr.svg.layers.data.selectAll("g." + groupSlug)
            .data([groupSlug])
            .join('g')
            .attr('class', d => d)

        // if there is a select option dont use the extra class 
        const bars = group.selectAll(".bar." + this.slug)
            .data(data, d => d.date)
            .join("rect")
            .attr("class", d => "bar " + this.slug)
            .attr("fill", d => colours[d.colour][1])
        ;
    }

    redraw(data: TrendBar[]) {

        // can be called multiple times for extra trends 
        let groupSlug = data[0].name != undefined ? data[0].name  : this.ctrlr.slug;

        let self = this;
        const group = this.ctrlr.svg.layers.data.selectAll("g." + groupSlug)
       
        const bars = group.selectAll(".bar." + this.slug)

        let tooltip = function popup(d) {

            console.log(d)

              return `
                <div>${d.label}</div>
                <div>maand ${d.meta._month} - ${d.meta._year}</div>
                <div>${d.meta._startdatum} t/m ${d.meta._einddatum}</div>
                <div>${d.value}</div>
              `;
          }

        let barWidth = (this.ctrlr.dimensions.graphWidth / (data.length - 1)) - 4;

        bars
            .attr("x", (d: TrendBar, i: number)  => {
                return self.ctrlr.scales.x.fn(d.date)
            })
            .attr("y", self.ctrlr.dimensions.svgHeight)
            .attr("height", 0)
            .attr("width", barWidth)
            .transition()
            .duration(300)
            .attr("y", (d) => self.ctrlr.scales.y.fn(d.value))
            .attr("height", (d) => {      
                const h = self.ctrlr.dimensions.svgHeight - self.ctrlr.scales.y.fn(d.value);
                return (h > 0) ? h : 0;   
            })

        bars
            .on("mouseover", (event: any, d: any) => {

                self.ctrlr.svg.layers.data.selectAll(".bar")
                    .style("fill", b => (b !== d) ? colours[b.colour][1] : colours[b.colour][0]);

                window.d3.select('.tooltip')
                    .html(tooltip(d))
                    .style("left", (event.pageX - 20) + "px")
                    .style("top", (event.pageY - 0) + "px")
                    .transition()
                    .duration(250)
                    .style("opacity", 1);
            })
            .on("mouseout", (d) => {

                self.ctrlr.svg.layers.data.selectAll(".bar")
                    .style("fill", b => colours[b.colour][1]);

                window.d3.select('.tooltip')
                    .transition()
                    .duration(250)
                    .style("opacity", 0);
            })
        ;
    }
}


