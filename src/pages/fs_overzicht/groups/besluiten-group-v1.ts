
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { ImgData } from "../../shared/types";
import { Line, TrendBar, PiePart, TableData } from "../../shared/types_graphs";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";

export class BesluitenGroupV1 extends GroupControllerV1 { 

    circleGroup: any;
    barProgression: any;

    funcList: any;
    table;

    htmlHeader;
    yearSelector;

    constructor(
        public page: any,
        public config: IGroupMappingV2,
        public index: number
    ){
       super(page,config, index);
    }

    html() {
        const graphWrapper = super.html();
        let source = HTMLSourceV2(graphWrapper?.parentElement as HTMLElement,this.page.main.params.language,"IMG");
        return graphWrapper
    }

    async init() {}

    prepareData(data: ImgData) : any {
      
        const dataGroup = this.config.endpoints[0];
       
        const parts: PiePart[]  = [];
        const bars: TrendBar[]  = [];
        const rows: (string|number)[][] = [];     
        const forStacked: any[] = [];  
        const line: Line = [];

        let pie_params = this.config.graphs[0].parameters[0];
        let trend_params = this.config.graphs[1].parameters[0];
        
        let columns = pie_params.map( ( p => p.column));

        for (let period of data[dataGroup].filter( p => p._year > 2019)) {
 
            period["fysieke_schade_percentage_toegewezen_besluiten"] = (100 * period["fysieke_schade_toegewezen_besluiten"] / (period["fysieke_schade_toegewezen_besluiten"] + period["fysieke_schade_afgewezen_besluiten"])).toFixed(1)
            period["fysieke_schade_percentage_nieuw_toegewezen_besluiten"] = (100 * period["fysieke_schade_nieuw_toegewezen_besluiten"] / (period["fysieke_schade_nieuw_toegewezen_besluiten"]  + period["fysieke_schade_nieuw_afgewezen_besluiten"])).toFixed(1)

            if (isNaN(period["fysieke_schade_percentage_nieuw_toegewezen_besluiten"])){
                period["fysieke_schade_percentage_nieuw_toegewezen_besluiten"] = 0;
            }

            const row : (number|string)[] = [];
            row.push(period._year);
            row.push(period._week);

            let total = 0;
            for (let column of columns) {
                row.push(period[column]);  
            }
            rows.push(row);

            const o = {};

            trend_params.forEach( (p,i) =>  {

                bars.push({
                    label: p.label,
                    value: isNaN(period[p.column]) ? 0 : period[p.column],
                    colour: p.colour,
                    format: "number",
                    date: period._yearmonth
                })

                o[p.column] = period[p.column];
                o["date"] = period._yearmonth;      
                o["month"] = period._month; 
                o["year"] = period._year;         
            });

            forStacked.push(o)

            line.push({
                time: period._yearmonth,
                value: period["fysieke_schade_percentage_nieuw_toegewezen_besluiten"],
                label: this.config.graphs[1].parameters[1][0].label,
                colour: this.config.graphs[1].parameters[1][0].colour
            })   
        }

        const percentages = [{
            value: data[dataGroup][0][this.config.graphs[0].parameters[1][0].column],
            label: this.config.graphs[0].parameters[1][0].label,
            format: "percentage"
        }]

        const stack = window.d3.stack()
            .keys(trend_params.map ( p => p.column));

        pie_params.forEach( (p,i) =>  {
            parts.push({
                label: p.label,
                value:  data[dataGroup][0][p.column],
                colour: p.colour,
                accented: false,
                format: p.format
            })
        });
    
        const table = {
    
            headers:  ["Jaar","Week"].concat(pie_params.map( p => p.label)), //  ["Betaalstroom"].concat(uniqueYears.map( y => y.toString())),
            rows
        };

        return {
            percentages,
            pies: [parts],
            bars: bars,
            stacked: stack(forStacked),
            line,
            table
        }
       }
    
    populateTable(tableData: TableData) {

        super.populateTable(tableData);
    } 
}
