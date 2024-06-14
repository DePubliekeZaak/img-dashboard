
import { filterUnique } from "../../shared/data.format.factory";
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2, IParameterMapping } from "../../shared/interfaces";
import { DataObject, ImgData } from "../../shared/types";
import { TableData, TrendBar } from "../../shared/types_graphs";
import { convertToCurrencyInTable, trimColumnsAndOrder } from "../../shared/_helpers";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";
import { breakpoints } from "../../../img-modules/styleguide";

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

        const { tableParams, graphParams, graphData } = super.prepareData(data);
        
        for (let period of data[dataGroup]) {

            const row : string[] = [];
            row.push(period._year);
            row.push(period._month);
            row.push(new Date(period._startdatum).toLocaleDateString('nl-NL',{'dateStyle':'short'}) + ' t/m ' + new Date(period._einddatum).toLocaleDateString('nl-NL',{'dateStyle':'short'})); 

            for (let p of tableParams) {

                if (p.format == "currency") {
                    row.push(convertToCurrencyInTable(period[p.column]));  
                } else {
                    row.push(period[p.column]);  
                }   
            }

            rows.push(row);
        }

        for (let period of graphData) {

            period["fysieke_schade_meldingen_cvw"] = (period._yearmonth == '201811') ? period["fysieke_schade_meldingen_cvw_cumulatief"] : 0; 
     
        }

    
    
        const table = {
    
            headers:  ["Jaar","Maand","Periode"].concat(tableParams.map( p => p.label)), //  ["Betaalstroom"].concat(uniqueYears.map( y => y.toString())),
            rows
        };

        const timeline = [
         
            {   
                date: "2020-09-01",
                label: "Start waardedalingsregeling",
                html: "Start waardedalingsregeling",
                description: "",
                category: "regeling"
            },
            {
                date: "2021-11-01",
                label: "Start vaste vergoeding van 5000 euro",
                html: "Start vaste vergoeding",
                description: "",
                category: "regeling"
            },
            {
                date: "2021-11-15",
                label: "Start regeling Immateriële schade",
                html: "Start  Immateriële schade",
                description: "",
                category: "regeling"
            },
            {
                date: "2023-02-24",
                label: "Publicatie rapport Parlementaire enquête aardgaswinning Groningen",
                html: "Rapport Parlementaire enquête",
                description: "",
                category: "regeling"
            },
            {
                date: "2023-04-25",
                label: "Kabinetsmaatregelen Nij begun: op weg naar erkenning, herstel en perspectief",
                html: "Kabinetsmaatregelen",
                description: "",
                category: "regeling"
            },
            {
                date: "2023-10-6",
                label: "Kamerbrief over verandering schadeafhandeling aardbevingsgebied Groningen en Noord-Drenthe",
                html: "Kamerbrief",
                description: "",
                category: "regeling"
            },
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
            
            graphData,
            timeline,
            definitions,
            table
        }
       }
    
    populateTable(tableData: TableData) {

        super.populateTable(tableData);
    }
}
