
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { ImgData } from "../../shared/types";
import { TableData } from "../../shared/types_graphs";
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
        const filteredData = data[dataGroup].filter( p => p.complete);
        const { tableParams, graphParams, graphData, timeline, definitions } = super.prepareData(data);
        let { rows, _data } = relyOnCompleted(filteredData, tableParams, graphParams);

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
