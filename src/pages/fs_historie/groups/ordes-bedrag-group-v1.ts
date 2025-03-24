
import { filterUnique } from "../../shared/data.format.factory";
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2, IParameterMapping } from "../../shared/interfaces";
import { DataObject, ImgData } from "../../shared/types";
import { Bars, Definitions, PiePart, TableData } from "../../shared/types_graphs";
import { convertToCurrencyInTable } from "../../shared/_helpers";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";

export class OrdesBedragGroupV1 extends GroupControllerV1 { 

    circleGroup: any;
    barProgression: any;

    funcList: any;
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

    prepareData(data: ImgData) : any {
      
        const dataGroup = "vergoedingen_jaarlijks?gemeente=eq.all";
        const rows: (string|number)[][] = [];  
        const years: any[] = [];    
        const definitions: Definitions = [];

        let params = ([] as IParameterMapping[]);
        
        let graph_1 = this.config.graphs[0];
        let params_1 = graph_1.parameters[0].concat(...graph_1.parameters[1]);
        let columns_1 = params_1.map( ( p => p.column));

        for (let period of data[dataGroup]) {

            const row : (number|string)[] = [];
            row.push(period._year);
            // row.push(period._month);
            // row.push(new Date(period._startdatum).toLocaleDateString('nl-NL',{'dateStyle':'short'}) + ' t/m ' + new Date(period._einddatum).toLocaleDateString('nl-NL',{'dateStyle':'short'}));

            const year : Bars = [];

            params_1.forEach( (p,i) =>  {

                year.push(
                    {
                        label: p.label,
                        value: period[p.column],
                        colour: p.colour,
                        name: "orde",
                        meta: period,
                        format: ""
                    }
                )
            });

            years.push(year);

            console.log(columns_1);

            for (let column of columns_1) {
                row.push(period[column]);
            }

            rows.push(row);
        }


        params_1.forEach( (p,i) =>  {
            
            definitions.push({
                "name" : p.label,
                "description" : p.description || "lorem ipsum"
            })
        });

        const table = {
            headers:  ["Jaar"].concat(params_1.map( p => p.label)), //  ["Betaalstroom"].concat(uniqueYears.map( y => y.toString())),
            rows
        };

        return {
            years,
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
