import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2, IParameterMapping } from "../../shared/interfaces";
import { DataObject, ImgData } from "../../shared/types";
import { Definitions, TableData } from "../../shared/types_graphs";
import { convertToCurrencyInTable, slugify } from "../../shared/_helpers";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";
import { filterUnique, uniques } from "../../shared/data.format.factory";


export class GeoGroupV1 extends GroupControllerV1 { 

    circleGroup: any;
    barProgression: any;

    funcList: any;
    table;

    htmlHeader;
    yearSelector;

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

    prepareData(data: any) : any {

        const dataGroup = this.config.endpoints[0];
        const rows: (string|number)[][] = [];  
        let grouped : any[] = [];

        // moet graphParams niet in graphCtrlr ??? 
        const { tableParams, graphParams, graphData } = super.prepareData(data);
  
        const definitions: Definitions = [];

        // let uniqueYears = filterUnique(data[dataGroup], "_year");
        let uniqueYears = ["2019","2020","2021","2022","2023"];
        let uniqueMunis = filterUnique(data[dataGroup], "gemeente")
            .filter( g => g != 'all')
            .sort();

        for (let year of uniqueYears) {
            grouped.push(graphData.filter((p: any ) => p._year == year ))
        }

        for (let muni of uniqueMunis) {

            const row : (number|string)[] = [];
            row.push(muni);
            for (let year of uniqueYears) {
                const o = data[dataGroup].find( i => i._year == year && i.gemeente == muni);
                if(o != undefined) { 
                    if(tableParams[0].format == "currency") {
                        row.push(convertToCurrencyInTable(o[tableParams[0].column]))
                    } else {
                        row.push(o[tableParams[0].column] + "%")
                    }
                } else {
                    row.push("n < 25")
                }
            }
            rows.push(row); 
        }

        tableParams.forEach( (p,i) =>  {
            
            definitions.push({
                "name" : p.label,
                "description" : p.description || "lorem ipsum"
            })
        });

        const table = {
            headers:  ["Gemeente"].concat(uniqueYears.map( y => y.toString())), 
            rows
        };

        return {
            uniqueYears,
            uniqueMunis,
            grouped,
            graphData,
            graphParams,
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
