import { colours } from "../../img-modules/styleguide";
import { convertToCurrency } from "../../pages/shared/_helpers";
import { PiePart } from "../../pages/shared/types_graphs";

export class ChartBlocksV1 {

    share: number;
    constructor(
        private ctrlr
    ){}

    draw(data: PiePart[]) {


        const config = this.ctrlr.config ? this.ctrlr.config : this.ctrlr.graphObject.config;

        let self = this;

        const percentage = Math.round((10 * data[0].value / data[1].value) * 100) / 10;

        this.share = data[0].value / data[1].value;

        this.ctrlr.svg.bigBlock = this.ctrlr.svg.layers.data.append("rect")
            .attr("fill", data[0].colour ? colours[data[1].colour][1] : '#ccc')
            .attr("stroke", data[0].colour ? colours[data[1].colour][0] : '#ccc');


            // Draw the inner square
        this.ctrlr.svg.smallBlock = this.ctrlr.svg.layers.data.append("rect")
               .attr("fill", data[0].colour ? colours[data[0].colour][1] : '#ccc')
               .attr("stroke", data[0].colour ? colours[data[0].colour][0] : '#ccc');

        this.ctrlr.svg.desc = this.ctrlr.svg.layers.data.append("text")
               .text("bezwaarpercentage")
               .attr("text-anchor", "end")
               .style("font-size", "1rem")
               .style("font-weight", "500")
               .style("line-height", "1")
               .style("font-family", "Sora, sans-serif");
       
        this.ctrlr.svg.text = this.ctrlr.svg.layers.data.append("text")
                .text(percentage + "%")
                .attr("text-anchor", "end")
                .style("font-size", "2rem")
                .style("font-weight", "500")
                .style("line-height", "1")
                .style("font-family", "Sora, sans-serif");


    }       

    redraw(data) {

        const size = this.ctrlr.config.graphHeight - 30;


        this.ctrlr.svg.bigBlock
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", size)
            .attr("height", size);

        const innerSize = this.ctrlr.config.graphHeight * Math.sqrt(this.share);  // area proportional to the share

            // Calculate the position to center the inner square
        const xOffset = 30; // (this.ctrlr.config.graphHeight - innerSize) / 2;
        const yOffset = 30; // (this.ctrlr.config.graphHeight - innerSize) / 2;
            
            // Draw the inner square
            this.ctrlr.svg.smallBlock
               .attr("x", xOffset)
               .attr("y", yOffset)
               .attr("width", innerSize)
               .attr("height", innerSize)
       
        this.ctrlr.svg.text 
                .attr("x", size - xOffset)
                .attr("y", size - yOffset - 28)

        this.ctrlr.svg.desc 
                .attr("x", size - xOffset)
                .attr("y", size - yOffset + 0)
    }
    
}