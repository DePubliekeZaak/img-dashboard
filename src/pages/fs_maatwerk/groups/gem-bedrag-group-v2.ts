
import { filterUnique } from "../../shared/data.format.factory";
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2, IParameterMapping } from "../../shared/interfaces";
import { DataObject, ImgData } from "../../shared/types";
import { TrendBar, Definitions, PiePart, TableData } from "../../shared/types_graphs";
import { convertToCurrencyInTable } from "../../shared/_helpers";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";

export class GemBedragGroupV2 extends GroupControllerV1 { 

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

    prepareData(data: ImgData) : any {

       
      
        const dataGroup = this.config.endpoints[0];
        const rows: (string|number)[][] = [];  
        // const bars: TrendBar[] = [];    
    
        const { tableParams, graphParams, graphData, timeline, definitions } = super.prepareData(data);

        for (let period of data[dataGroup].filter( p => p._year > 2019)) {

            const row : (number|string)[] = [];
            row.push(period._year);
            row.push(period._month);
            row.push(new Date(period._startdatum).toLocaleDateString('nl-NL',{'dateStyle':'short'}) + ' t/m ' + new Date(period._einddatum).toLocaleDateString('nl-NL',{'dateStyle':'short'}));

            period["maatwerk_gemiddeld_schadebedrag"] = period["maatwerk_verleend_bedrag"] / period["maatwerk_afgehandeld"];


            // for (let p of tableParams) {
                
                // bars.push({
                //     label: "Gemiddeld schadebedrag",
                //     date: period._yearmonth,
                //     value: period[p.column],
                //     colour: "orange",
                //     name: "gem",
                //     meta: period,
                //     format: "currency"
                // })


            row.push(convertToCurrencyInTable(period["maatwerk_gemiddeld_schadebedrag"]));
        

            rows.push(row);
        }

        const table = {
            headers:  ["Jaar","Maand","Periode"].concat(tableParams.map( p => p.label)), //  ["Betaalstroom"].concat(uniqueYears.map( y => y.toString())),
            rows
        };

        console.log(data[dataGroup]);

        return {
            graphData: data[dataGroup],
            timeline,
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
