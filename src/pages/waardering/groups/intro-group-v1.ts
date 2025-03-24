import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { ImgData } from "../../shared/types";
import { TableData, Definitions } from "../../shared/types_graphs";
import { convertToCurrencyInTable } from "../../shared/_helpers";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";

export class IntroGroupV1 extends GroupControllerV1 { 

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

        const rows: string[][] = []; 

        // console.log("x",data[dataGroup]);

        data[dataGroup] = data[dataGroup].filter( p => p.complete ==  true);

        const { tableParams, graphParams, graphData, timeline, definitions, graphData_alt } = super.prepareData(data);
        const incremental: Array<{[key: number]: string}> = [];
        const cumulative: Array<{[key: number]: string}> = [];

        for (let i = 0; i < this.config.graphs[0].parameters[0].length; i++) {

            incremental.push({ 
                0: String(data[dataGroup][0][this.config.graphs[0].parameters[0][i].column]),
                1: String(data[dataGroup][0][this.config.graphs[0].parameters[1][i].column])
            });

            cumulative.push({ 
                0: String(data[dataGroup][0][this.config.graphs[0].parameters[0][i].column + '_cumulatief']),
                1: String(data[dataGroup][0][this.config.graphs[0].parameters[1][i].column])
            });
        }

        const regelingen = this.config.graphs[0].parameters[0].map( p => p.label);
        
        for (let period of data[dataGroup]) {

            const row : string[] = [];
            row.push(period._year);
            row.push(period._month);
            // row.push(new Date(period._startdatum).toLocaleDateString('nl-NL',{'dateStyle':'short'}) + ' t/m ' + new Date(period._einddatum).toLocaleDateString('nl-NL',{'dateStyle':'short'})); 

            for (let r of regelingen) {     

                const cijfer = this.config.graphs[0].parameters[1].find( p => p.label == r);

                if (!cijfer) {
                    continue;
                }       

                row.push(period[cijfer.column]);  

                const respondents = this.config.graphs[0].parameters[0].find( p => p.label == r);
                if (!respondents) {
                    continue;
                }

                row.push(period[respondents.column]);
            }

            rows.push(row);
        }

        

        const pre_headers: any[] = [];
        const headers: string[] = []

        regelingen.forEach( r => {
            pre_headers.push({label: r, length: 2});
            headers.push("cijfer","respondenten");
        });

        const table = {
            pre_headers: [{label: "", length: 2}].concat(pre_headers),
            headers:  ["Jaar","Maand"].concat(headers), //  ["Betaalstroom"].concat(uniqueYears.map( y => y.toString())),
            rows
        };

        return {
            numbers: graphData[0],
            graphData,
            graphData_alt,
            incremental,
            cumulative,
            table,
            definitions
        }
       }
    
    populateTable(tableData: TableData) {

        super.populateTable(tableData);
    } 
}
