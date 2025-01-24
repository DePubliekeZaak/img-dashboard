
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { ImgData } from "../../shared/types";
import { TableData } from "../../shared/types_graphs";
import { convertToCurrencyInTable } from "../../shared/_helpers";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";
import { relyOnCompleted } from "../../shared/factories/group";
import { trimStart } from "../../shared/factories/trend";

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
        const filteredData = data[dataGroup]
            .filter( p => p.complete)
            .filter ( p => {
                return p._yearmonth > '202403';
            });

        const { tableParams, graphParams, graphData } = super.prepareData(data);
        let { rows, _data } = relyOnCompleted(filteredData, tableParams, graphParams);

        
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
        //         else {
        //             if (period[p.column] != null) {
        //                 row.push(period[p.column].toFixed(2)); 
        //             } 
        //         }     
        //     }

        //     rows.push(row);
        // }
    
        const table = {
    
            headers:  ["Jaar","Periode"].concat(tableParams.map( p => p.label)), 
            rows
        };

        const timeline = [
         
            {
                date: "2019-5-22",
                label: "Westerwijdwerd",
                html: "Westerwijdwerd",
                description: "Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
                category: "beving"
            },
            {
                date: "2021-11-16",
                label: "Garrelsweer",
                html: "Garrelsweer",
                description: "(magnitude 3.2)",
                category: "beving"
            },
            {
                date: "2022-09-24",
                label: "Uithuizermeeden en Uithuizen",
                html: "Uithuizermeeden en Uithuizen",
                description: "(magnitude 2.7 en 1.7)",
                category: "beving"

            },
            {
                date: "2022-10-8",
                label: "Wirdum",
                html: "Wirdum",
                description: "(magnitude 3.1)",
                category: "beving"
            }
        ];

        timeline.sort( (a,b) => Date.parse(a.date) - Date.parse(b.date))
                
        const definitions = [];

        

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
