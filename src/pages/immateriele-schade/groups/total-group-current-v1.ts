
import { filterUnique } from "../../shared/data.format.factory";
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2, IParameterMapping } from "../../shared/interfaces";
import { DataObject, ImgData } from "../../shared/types";
import { TrendBar, TableData } from "../../shared/types_graphs";
import { convertToCurrencyInTable } from "../../shared/_helpers";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";

export class TotalGroupCurrentV1 extends GroupControllerV1 { 

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
        let params: IParameterMapping[] = []
        for (let graph of this.config.graphs) {
            for (let p of graph.parameters) {
                params = params.concat(p);
            }
        }
       
        const bars: TrendBar[]  = [];
        const rows: (string|number)[][] = [];     

        for (let week of data[dataGroup]) {

            const row: string[]  = [];
            row.push(week._year,week._week)
            for (let p of params) {

                let value = p.format == "currency" ? convertToCurrencyInTable(week[p.column]) : week[p.column];
                row.push(value);

            }
            rows.push(row);
            
        }

        const table = {
    
            headers:  ["Jaar","Week"].concat(params.map( p => p.label)), 
            rows
        };

        return {
            current: data[dataGroup][0],
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
