import { core, elements } from "../../../charts";
import { ChartBarsHorizontalV1 } from "../../../charts/elements/chart-bars-horizontal-v1";
import { parseSegment } from "../../shared/factories/segment";
import { GroupObject, IParameterMapping } from "../../shared/interfaces";
import { IPageController } from "../../shared/page.controller";
import { segmentParse } from "../../shared/segment";
import { DataObject, DataPart, Segment } from "../../shared/types";
import { GraphData } from "../../shared/types_graphs";


export class KTORatingsV1 extends core.GraphControllerV3  {

    circleEl;
    trendEl;
    chartBar;
    htmlCircle;
    htmlPeriodSelector;

    constructor(
        public slug:  string,
        public page: IPageController, 
        public group: GroupObject, 
        public data: DataObject,
        public parameters: IParameterMapping[][],
        public modifiers: IParameterMapping[][],
        public filters: string[],
        segment: Segment, 
        public index: number
    ){
        super(slug,page,group,data,parameters,modifiers,filters, segment,index) 
        
        if (this.page.segment) {
            this.segment = parseSegment(this.page, this.group.slug, this.slug);
        }

        this.pre();
    }

    pre() {

        this._addScale("x","linear","horizontal","value");
        this._addScale("y","band","vertical","label");

        this._addPadding(0,0,20,80);
        this._addMargin(0,60,0,0);
    }

    html() {

        this.circleEl = super._html();
        this.circleEl.classList.remove("graph-container-12");
        this.circleEl.classList.add("graph-container-6");
        this.circleEl.style.height = "320px";

        this.graphEl = document.createElement('section');
        this.graphEl.classList.add("graph-container-6");
        this.graphEl.style.height = "320px";
        this.graphEl.style.display = "flex";
        this.graphEl.style.alignItems = "center";
        this.graphEl.style.justifyContent = "center";


        if (this.element) {
            this.element.appendChild(this.graphEl);
            // this.element.style.flexDirection = "row-reverse";
        }
    }

    async init() {

        const self = this;

        super._init();
        if (this.graphEl != null) await super._svg(this.graphEl);

        this.config.paddingInner = 0.25;
        this.config.paddingOuter = 0.25;

        this.htmlCircle = new elements.HtmlNumberCircleRespondents(this,this.parameters[0][0],this.circleEl);
        this.htmlCircle.draw();

        this.chartBar = new ChartBarsHorizontalV1(this);

        await this.update(this.group.data, false);
    }

    prepareData(data: DataObject) : DataObject {


        const cumulative = (this.segment.key === 'all') ? true : false;
        data.selectedMonth = cumulative ? data.graphData[0] : data.graphData.find( (m) => m['_yearmonth'] === this.segment.key);
        const dataIndex  = cumulative ? 1 : 2;
        data.numbers = [];

        for (let mapping of this.parameters[dataIndex]) {

            let column = Array.isArray(mapping.column) ? mapping.column[0] : mapping.column;

            let cijfer = {
                label: mapping.label,
                colour: mapping.colour,
                value: data.selectedMonth[column]
            }
                
            data.numbers.push(cijfer);
            
        }

     

        return data;
    }

    async redraw(data: any, range: number[] | undefined) {

        // @ts-ignore
        let parameter = (this.segment.key === 'all') ? this.parameters[0][0].column : this.parameters[0][1].column;
        // @ts-ignore
        let extraParameter = (this.segment.key === 'all') ? this.parameters[0][2].column : this.parameters[0][3].column;
        this.htmlCircle.redraw(data.selectedMonth, parameter, extraParameter);

        super.redraw(data);
        
        this.chartBar.redraw(data.numbers);
    }

    async draw(data : DataObject) {

        let self = this;
        this.xScale = this.scales.x.set(data.numbers.map(d => d['value']).concat([0,100]));
        this.yScale = this.scales.y.set(data.numbers.map(d => d['label']));

        this.chartBar.draw(data.numbers);
    }

    async update(data: DataObject, update: boolean) {
        await super._update(data, update);
    }
}