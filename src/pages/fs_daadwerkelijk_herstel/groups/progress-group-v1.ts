
import { filterUnique } from "../../shared/data.format.factory";
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2, IParameterMapping } from "../../shared/interfaces";
import { DataObject, ImgData } from "../../shared/types";
import { TableData, TrendBar } from "../../shared/types_graphs";
import { convertToCurrencyInTable, trimColumnsAndOrder } from "../../shared/_helpers";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";
import { breakpoints } from "../../../img-modules/styleguide";

export class ProgressGroupV1 extends GroupControllerV1 { 

    constructor(
        public page: any,
        public config: IGroupMappingV2,
        public index: number
    ){
       super(page,config, index);
    }

    async init() {}

    html() {
        const graphWrapper = super.html();
        let source = HTMLSourceV2(graphWrapper?.parentElement as HTMLElement,this.page.main.params.language,"IMG");
        return graphWrapper
    }

    prepareData(data: ImgData) : any {

        const dataGroup = this.config.endpoints[0];
        const rows: string[][] = []; 

        const { tableParams, graphParams, graphData, definitions, timeline, graphData_alt } = super.prepareData(data);

        // console.log(tableParams);
        
        for (let period of data[dataGroup]) {

            const row : string[] = [];
            row.push(period._year);
            row.push(period._month);
            row.push(new Date(period._startdatum).toLocaleDateString('nl-NL',{'dateStyle':'short'}) + ' t/m ' + new Date(period._einddatum).toLocaleDateString('nl-NL',{'dateStyle':'short'})); 

            for (let p of tableParams) {

                if (p.format == "currency") {
                    row.push(convertToCurrencyInTable(period[p.column]));  
                } else {
                    row.push(period[p.column]);  
                }     
            }

            rows.push(row);
        }
    
        const table = {
    
            headers:  ["Jaar","Maand","Periode"].concat(tableParams.map( p => p.label)), //  ["Betaalstroom"].concat(uniqueYears.map( y => y.toString())),
            rows
        };

        return {
            
            graphData,
            graphData_alt,
            timeline,
            definitions,
            table
        }
       }
    
    populateTable(tableData: TableData) {

        super.populateTable(tableData);
    }

    // update(data: DataObject, segment: string, update: boolean) {

    //     super.update(data,segment,update)
    // }  
}
