
import { filterUnique } from "../../shared/data.format.factory";
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2, IParameterMapping } from "../../shared/interfaces";
import { DataObject, ImgData } from "../../shared/types";
import { Bars, Definitions, Line, PiePart, TableData } from "../../shared/types_graphs";
import { convertToCurrencyInTable } from "../../shared/_helpers";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";

export class DuurGroupV1 extends GroupControllerV1 { 

    circleGroup: any;
    barProgression: any;
    keys;
    stack;

    funcList: any;
    // table;

    // htmlHeader;
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
      
        const dataGroup = "historie";
        data[dataGroup] = data[dataGroup].filter ( p => p._yearmonth < '202305')

        // const parts: PiePart[]  = [];
        const rows: (string|number)[][] = [];  
        // const months: any[] = [];   
        const line: Line = [];  

        // let params = ([] as IParameterMapping[]);

        

        const { tableParams, graphData, definitions, graphData_alt } = super.prepareData(data);
        
        // for (let graph of this.config.graphs) {
        //     params = params.concat(...graph.parameters[0]);
        // }

        // let columns = params.map( ( p => p.column));

        

        for (let period of data[dataGroup]) {

            const row: (number|string)[] = [];
            row.push(period._year);
            row.push(period._month);
            row.push(new Date(period._einddatum).toLocaleDateString('nl-NL',{'dateStyle':'short'}));

            // let total = 0;
            for (let param of tableParams) {
                // console.log(param, period[param.column]);
                row.push(period[param.column]);  
                // total = total + period[column]  
            }

            rows.push(row);

    
        }

        const table = {
            headers:  ["Jaar","Maand","Datum"].concat(tableParams.map( p => p.label)), //  ["Betaalstroom"].concat(uniqueYears.map( y => y.toString())),
            rows
        };

// const definitions: Definitions = [];

        definitions.push({
            name: "Percentage binnen half jaar afgehandeld",
            description: "Het percentage schademeldingen dat in minder dan een half jaar tijd sinds de binnenkomst van een schademelding is afgehandeld. Het IMG streeft ernaar alle reguliere schademeldingen binnen een half jaar (182 dagen) af te handelen. Het percentage wordt berekend over de laatste 2.500 besluiten over schademeldingen. Het vertoont daarmee een voortschrijdend gemiddelde"
        })

        return {
            graphData,
            graphData_alt,
            line,
            table,
            definitions
        }
       }
    
    populateTable(tableData: TableData) {

        super.populateTable(tableData);
    }

    // update(data: DataObject, segment: string, update: boolean) {

    //     super.update(data,segment,update)
    // }  
}
