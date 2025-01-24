
import { filterUnique } from "../../shared/data.format.factory";
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2, IParameterMapping } from "../../shared/interfaces";
import { DataObject, ImgData } from "../../shared/types";
import { Bar, Bars, Line, PiePart, TableData } from "../../shared/types_graphs";
import { convertToCurrencyInTable } from "../../shared/_helpers";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";
import { relyOnCompleted } from "../../shared/factories/group";

export class KTOTrendV1 extends GroupControllerV1 { 

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
        let filteredData = data[dataGroup].filter( p => p.complete);
        const { tableParams, graphParams, graphData, timeline, definitions } = super.prepareData(data);
        let { rows, _data }= relyOnCompleted(filteredData, tableParams, graphParams);

        
        // for (let period of filteredData) {

        //     const row : string[] = [];
        //     row.push(period._year);
        //     row.push(period._month);
        //     row.push(new Date(period._startdatum).toLocaleDateString('nl-NL',{'dateStyle':'short'}) + ' t/m ' + new Date(period._einddatum).toLocaleDateString('nl-NL',{'dateStyle':'short'})); 

        //     for (let p of tableParams) {

        //         if (p.format == "currency") {
        //             row.push(convertToCurrencyInTable(period[p.column]));  

        //         } else if (p.format == "percentage") {
        //             row.push((0.1 * (Math.round(period[p.column] * 10))).toString() + "%");  
        //         }
        //         else  if (p.format == "decimals") {
        //             if (period[p.column] != null) {
        //                 row.push(period[p.column].toFixed(1)); 
        //             } else {
        //                 row.push("0")
        //             }
        //         } else {
        //             if (period[p.column] != null) {
        //                 row.push(period[p.column].toFixed(0)); 
        //             } else {
        //                 row.push("0")
        //             }
        //         }  
        //     }

        //     rows.push(row);
        // }
    
        const table = {
    
            headers:  ["Jaar","Periode"].concat(tableParams.map( p => p.label)), 
            rows
        };

      
        return {
            
            graphData: filteredData,
            timeline,
            definitions,
            table
        }
    }
    
    populateTable(tableData: TableData) {

        super.populateTable(tableData);
    }

}
