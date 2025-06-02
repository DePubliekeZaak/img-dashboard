
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { ImgData } from "../../shared/types";
import { TableData  } from "../../shared/types_graphs";
import { accounting, convertToCurrencyInTable } from "../../shared/_helpers";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";

export class VoorraadGroupV1 extends GroupControllerV1 { 

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
        const cumulative: string[] = [];

        const { tableParams, graphParams, graphData, graphData_alt, timeline, definitions } = super.prepareData(data);


        for (let p of this.config.graphs[0].parameters[0]) {

            cumulative.push(
                data[dataGroup][0][p.column + '_cumul']
            )
        }


        for (let period of data[dataGroup]) {

            const row : string[] = [];
            row.push(period._year);
            row.push(period._week);
            row.push(new Date(period._startdatum).toLocaleDateString('nl-NL',{'dateStyle':'short'}) + ' t/m ' + new Date(period._einddatum).toLocaleDateString('nl-NL',{'dateStyle':'short'})); 

            for (let p of tableParams) {

                if (p.format == "currency") {
                    row.push(convertToCurrencyInTable(period[p.column]));  
                } else {
                    row.push(accounting(period[p.column]));  
                }   
            }

            rows.push(row);
        }

    
        const table = {
    
            pre_headers: [{label: "", length: 3},{label: "Per week", length: 3},{label: "Cumulatief", length: 3}],
            headers:  ["Jaar","Week","Periode"].concat(tableParams.map( p => p.label)), 
            rows
        };

        console.log(graphData[0]);

        return {
            
            numbers: graphData[0],
            cumulative,
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
}
