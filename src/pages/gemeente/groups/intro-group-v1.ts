import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { ImgData } from "../../shared/types";
import { TableData, Definitions, PiePart } from "../../shared/types_graphs";
import { convertToCurrencyInTable } from "../../shared/_helpers";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";

export class IntroGroupV1 extends GroupControllerV1 { 

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

        const _data = JSON.parse(JSON.stringify(data)); 
        const muniData = {};
        for (let endpoint of this.config.endpoints) {
            muniData[endpoint] = _data[endpoint].filter( p => p.gemeente == this.page.segment.gemeente);
        }

        const rows: string[][] = []; 

        let { tableParams, graphParams, graphData, timeline, definitions, graphData_alt } = super.prepareData(muniData);
        const incremental: string[] = [];
        const cumulative: string[] = [];

        let index = 1; // this.segment.periodization == "monthly" ? 1 : 0;    

        for (let p of this.config.graphs[0].parameters[0]) {

            incremental.push(
                muniData[this.config.endpoints[0]][index][p.column]
            )

            cumulative.push(
                muniData[this.config.endpoints[0]][index][p.column + '_cumulatief']
            )
        }

        const parts: PiePart[] = [];

        this.config.graphs[2].parameters[0].concat(...this.config.graphs[2].parameters[1]).forEach( (p,i) =>  {

            parts.push({
                label: p.label,
                value:  graphData_alt[0][p.column],
                colour: p.colour,
                accented: false,
                format: "",
            })
        });



        tableParams = tableParams.filter( p => p.column.includes("cumulatief"));
        
        for (let period of muniData[this.config.endpoints[0]]) {

            const row : string[] = [];
            row.push(period._year);
            row.push(period._month);
            row.push(period.gemeente); 

            for (let p of tableParams) {

                if (p.format == "currency") {
                    row.push(convertToCurrencyInTable(period[p.column]));  

                } else if (p.format == "percentage") {
                    row.push((0.1 * (Math.round(period[p.column] * 10))).toString() + "%");  
                }
                else {
                    row.push(period[p.column]);  
                }     
            }

            rows.push(row);
        }
    
        const table = {
    
            headers:  ["Jaar","Maand","Gemeente"].concat(tableParams.map( p => p.label)), //  ["Betaalstroom"].concat(uniqueYears.map( y => y.toString())),
            rows
        };

        return {
            pies: [parts,parts,parts],
            numbers: graphData[0],
            graphData,
            graphData_alt,
            incremental,
            cumulative,
            table,
            definitions,
            timeline: []
        }
    }
    
    populateTable(tableData: TableData) {

        super.populateTable(tableData);
    } 
}