
import { filterUnique } from "../../shared/data.format.factory";
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2, IParameterMapping } from "../../shared/interfaces";
import { DataObject, ImgData } from "../../shared/types";
import { Bar, Bars, Line, PeriodBar, PiePart, TableData } from "../../shared/types_graphs";
import { convertToCurrencyInTable } from "../../shared/_helpers";
import { HTMLSource } from "../../shared/html/html-source copy";

export class GroupV1 extends GroupControllerV1 { 

    constructor(
        public page: any,
        public config: IGroupMappingV2,
        public index: number
    ){
       super(page,config, index);
    }

    html() {
        const graphWrapper = super.html();
        let source = HTMLSource(graphWrapper?.parentElement as HTMLElement,this.page.main.params.language,"IMG");
        return graphWrapper
    }

    async init() {}

    prepareData(data: ImgData) : any {
      
        const dataGroup = this.config.endpoints[0];
        const params: IParameterMapping[] = []
        for (let graph of this.config.graphs) {
            for (let p of graph.parameters) {
                params.concat(p);
            }
        }
       
        const bars: PeriodBar[]  = [];
        const rows: (string|number)[][] = [];     
   
        const table = {
    
            headers:  ["Jaar","Week"].concat(params.map( p => p.label)), 
            rows
        };

        return {
            bars: bars,
            table
        }
       }
    
    populateTable(tableData: TableData) {

        super.populateTable(tableData);
    }

    update(data: DataObject, segment: string, update: boolean) {

        super.update(data,segment,update)
    }  
}
