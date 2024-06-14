
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { ImgData } from "../../shared/types";
import { TableData } from "../../shared/types_graphs";
import { convertToCurrencyInTable } from "../../shared/_helpers";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";

export class KTOGroupV1 extends GroupControllerV1 { 

    constructor(
        public page: any,
        public config: IGroupMappingV2,
        public index: number
    ){
       super(page,config, index);
    }

    html() {
        const graphWrapper = super.html();
        if(graphWrapper != undefined) {
            graphWrapper.style.marginTop = "2rem";
        }
        let source = HTMLSourceV2(graphWrapper?.parentElement as HTMLElement,this.page.main.params.language,"IMG");
        return graphWrapper
    }

    async init() {}

    prepareData(data: ImgData) : any {

        const dataGroup = this.config.endpoints[0];
        const rows: string[][] = []; 

        data[dataGroup] = data[dataGroup].filter( p => p.complete);

        const { tableParams, graphParams, graphData } = super.prepareData(data);

        for (let period of data[dataGroup]) {

            const row : string[] = [];
            row.push(period._year);
            row.push(period._month);
            // row.push(new Date(period._startdatum).toLocaleDateString('nl-NL',{'dateStyle':'short'}) + ' t/m ' + new Date(period._einddatum).toLocaleDateString('nl-NL',{'dateStyle':'short'})); 

            for (let p of tableParams) {

                if (p.format == "currency") {
                    row.push(convertToCurrencyInTable(period[p.column]));  

                } else if (p.format == "percentage") {
                    row.push((0.1 * (Math.round(period[p.column] * 10))).toString() + "%");  
                }
                else {
                    if (period[p.column] != null) {
                        row.push((Math.round(period[p.column] * 100) / 100).toString()); 
                    } 
                }     
            }

            rows.push(row);
        }
    
        const table = {
    
            headers:  ["Jaar","Maand"].concat(tableParams.map( p => p.label)), 
            rows
        };
                
        const definitions = [];

        return {
            
            graphData,
            definitions,
            table
        }
    }
    
    populateTable(tableData: TableData) {

        super.populateTable(tableData);
    }

}
