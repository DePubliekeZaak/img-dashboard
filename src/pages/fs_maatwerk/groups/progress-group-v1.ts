
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { ImgData } from "../../shared/types";
import { TableData  } from "../../shared/types_graphs";
import { accounting, convertToCurrencyInTable } from "../../shared/_helpers";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";

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

        const { tableParams, graphParams, graphData, graphData_alt, timeline, definitions } = super.prepareData(data);

 
        
        for (let period of data[dataGroup]) {

            const row : string[] = [];
            row.push(period._year);
            row.push(period._month);
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

        for (let period of graphData) {

            period["fysieke_schade_meldingen_cvw"] = (period._yearmonth == '201811') ? period["fysieke_schade_meldingen_cvw_cumulatief"] : 0; 
        }


        const table = {
    
            headers:  ["Jaar","Maand","Periode"].concat(tableParams.map( p => p.label)), 
            rows
        };

        return {
            
            numbers: graphData[0],
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
