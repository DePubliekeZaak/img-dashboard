
import { filterUnique } from "../../shared/data.format.factory";
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2, IParameterMapping } from "../../shared/interfaces";
import { DataObject, ImgData } from "../../shared/types";
import { Bar, Bars, Line, TrendBar, PiePart, TableData, Definitions } from "../../shared/types_graphs";
import { convertToCurrencyInTable } from "../../shared/_helpers";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";

export class MakeupGroupTrendV1 extends GroupControllerV1 { 

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
        const rows: string[][] = []; 

        const { tableParams, graphData, definitions, graphData_alt, timeline } = super.prepareData(data);
        
        for (let period of data[dataGroup]) {

            const row : string[] = [];
            row.push(period._year);
            row.push(period._month);
            row.push(new Date(period._startdatum).toLocaleDateString('nl-NL',{'dateStyle':'short'}) + ' t/m ' + new Date(period._einddatum).toLocaleDateString('nl-NL',{'dateStyle':'short'})); 

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
    
            pre_headers: [{label: "", length: 3},{label: "Aanvragen en meldingen", length: 3},{label: "Afgehandeld", length: 3},{label: "Totaal verleend", length: 3}],
            headers:  ["Jaar","Maand","Periode"].concat(tableParams.map( p => p.label)), //  ["Betaalstroom"].concat(uniqueYears.map( y => y.toString())),
            rows
        };

        return {
            graphData,
            graphData_alt,
            table,
            definitions,
            timeline
        }
       }
    
    populateTable(tableData: TableData) {
        super.populateTable(tableData);
    }
}
