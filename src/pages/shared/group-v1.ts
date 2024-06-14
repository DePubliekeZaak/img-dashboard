import { HtmlTabs } from "./html/html-tabs";
import { HtmlHeader } from "./html/html-header";
import { HTMLTable } from "./html/html-table";
import { HTMLDefinitions } from "./html/html-definitions";
import { IGroupCtrlr, IGroupMappingV2, IParameterMapping } from "./interfaces";
import { DataObject, ImgData, TableData } from "./types";
import { Definitions } from "./types_graphs";
import { trimColumnsAndOrder } from "./_helpers";
import { HtmlGroupFilters } from "./html/html-group-filters";

export class GroupControllerV1 implements IGroupCtrlr {

    slug: string;
    element: HTMLElement | null;
    segment: string;

    htmlHeader;
    tabs;
    table;
    definitions;
    filters: any;
    description;

    groupWrapper;
    graphWrapper;

    constructor(
        public page: any,
        public config: IGroupMappingV2,
        public index: number,
    ){
        this.slug = config.slug;
        this.element = page.main.htmlContainer;
        this.segment = config.segment;
    }

    html(groupEl?: HTMLElement) {

        if (this.element == null) return;

        if (groupEl == undefined) {

            this.groupWrapper = document.createElement('section');
            this.groupWrapper.classList.add('graph-container-12');
            this.groupWrapper.classList.add('group-wrapper');

            this.element.appendChild(this.groupWrapper);

        } else {

            this.groupWrapper = groupEl;
        }
        
        this.htmlHeader = new HtmlHeader(
            this.groupWrapper,  
            this.page.main.params.language == 'nl' ? this.config.header : this.config.header_en,
            this.page.main.params.language == 'nl' ? this.config.description : this.config.description_en,
        );

        this.htmlHeader.draw(); 

        if (this.config.functionality) {
            this.tabs = new HtmlTabs(this,this.groupWrapper,this.config,this.segment, this.index);
            this.tabs.draw();
        }

        // TAB PANELS

        this.graphWrapper = document.createElement('section');
        this.graphWrapper.classList.add('graph-container-12');
        this.graphWrapper.classList.add('graph-wrapper');
        this.graphWrapper.classList.add("tabpanel");
        this.graphWrapper.role = "tabpanel";
        this.graphWrapper.id = "panel_" + this.slug + "__graph";
        this.graphWrapper.setAttribute("aria-labelledby","tab_" + this.slug + "__graph");
        this.graphWrapper.tabIndex = 0

        this.groupWrapper.appendChild(this.graphWrapper);

        if (this.config.functionality == undefined) return;

        if (this.config.functionality && this.config.functionality.indexOf('table') > -1) {
            this.table = new HTMLTable(this,this.groupWrapper);
        }

        if (this.config.functionality && this.config.functionality.indexOf('definitions') > -1) {
            this.definitions = new HTMLDefinitions(this, this.groupWrapper);
        }

        // if (this.config.functionality && this.config.functionality.indexOf('description') > -1) {
        //     this.description = new HTMLDescription(this,this.groupWrapper);
        // }


        return this.graphWrapper;
    }

    prepareData(data: ImgData) : any {

        const dataGroup = this.config.endpoints[0];
        const defaultColumns = ["_yearmonth","_month","_year","_startdatum","_einddatum","gemeente"];

        let tableParams = ([] as IParameterMapping[]);
        let graphParams = ([] as IParameterMapping[]);
        
        for (const graph of this.config.graphs) {
            for (const pg of graph.parameters) {
                for (const p of pg) {
                    if (tableParams.indexOf(p) < 0 && !p.excludeFromTable) {
                        tableParams.push(p);
                    }
                    if (graphParams.indexOf(p) < 0) {
                        graphParams.push(p)
                    }
                }
            }
            if (graph.modifiers != undefined) {
                for (const mg of graph.modifiers) {
                    for (const m of mg) {
                        if (m.column != "{}") {
                            for (const p of JSON.parse(JSON.stringify(graphParams))) {
                                let n: IParameterMapping = Object.assign({},m);
                                n.column = n.column.replace('{}',p.column);
                                n.label = p.label;
                                graphParams.push(n)
                            }
                        }
                    }
                }
            }
        }

        const graphData =  trimColumnsAndOrder(data[dataGroup], graphParams.map( p => p.column).concat(defaultColumns));

        return { 
            tableParams, graphParams, graphData
        } 
    }

    populateTable(tableData: TableData) {

        if (this.config.functionality && this.config.functionality.indexOf('table') > -1) {
            this.table.draw(tableData);
        }
   }

   populateDefinitions(definitionData: Definitions) {

        if (this.config.functionality && this.config.functionality.indexOf('definitions') > -1) {
            this.definitions.draw(definitionData);
        }
    }

    populateDescription() {

        if (this.config.functionality && this.config.functionality.indexOf('description') > -1) {
            this.description.draw();
        }
    }

    armTabs() {

        this.tabs.handleInitialState();
        this.tabs.arm();
    }

    armDownloads() {
        this.tabs.armDownload();
    }

    setFilters() {

        if(this.config.filters != undefined && this.config.filters.length > 0) {

            this.filters = new HtmlGroupFilters(this);
            this.filters.draw(this.segment);
        }
    }


   update(data: DataObject, segment: string, update: boolean) {

        // console.log('hello');

        this.segment = segment;
        const group = this.page.chartArray.find( (i) => i.config.slug === this.slug );

        group.data = this.prepareData(this.page.main.data.collection());

        this.tabs.redraw();

        // console.log(group);

        for (const graph of group.graphs) {
            graph.ctrlr.update(group.data, segment, false)
        }

        this.populateTable(group.data.table);

        this.populateDefinitions(group.data.definitions);

   }  

}