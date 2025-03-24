import { breakpoints } from '../../../img-modules/styleguide';
import {  DataObject, Segment } from '../types';
import { core, elements } from '../../../charts';
import { GroupObject, IParameterMapping } from '../interfaces';
import { IPageController } from '../page.controller';
import HtmlLegendAsSum from '../html/html-legend-sum';
import { parseSegment } from '../factories/segment';

export class PieChartSumV1 extends core.GraphControllerV3  {

    chartAxis;

    parts = {};
    entity_svgs = {};
    ctrlrs: any = {};

    chartPie

    legend;

    constructor(
        public slug:  string,
        public page: IPageController, 
        public group: GroupObject, 
        public data: DataObject,
        public parameters: IParameterMapping[][],
        public modifiers: IParameterMapping[][],
        public filters: string[],
        public segment: Segment, 
        public index: number
    ){
        super(slug,page,group,data,parameters,modifiers,filters,segment,index);

        if (this.page.segment) {
            this.segment = parseSegment(this.page, this.group.slug, this.slug);
        }
        
        this.pre();
    }

    pre() {}

    html() {

        this.config.graphRatio = 1;

        if (window.innerWidth < breakpoints.sm) {
            this.config.graphHeight = 320

        } else if (window.innerWidth < breakpoints.md) {
            this.config.graphHeight = 320
        } else {
            this.config.graphHeight = 320
        }
        
        if(this.group.element == null ) return;

        this.graphEl = super._html();
        if(this.graphEl == null) return;
        this.graphEl.style.flexDirection = (window.innerWidth < breakpoints.sm) ? "column" : "row";
        this.graphEl.style.justifyContent = (window.innerWidth < breakpoints.sm) ? "space-between" : "space-around";

        if (this.group.graphs[this.index].classList && this.group.graphs[this.index].classList.length > 0) {
            this.graphEl.classList.add(...this.group.graphs[this.index].classList);
            this.graphEl.classList.remove("graph-container-12");
            this.graphEl.style.flexDirection = "column"
        }

        this.legend = new HtmlLegendAsSum(this,true);
    }

    async init() {

        await super._init();
        if (this.graphEl != null) await super._svg(this.graphEl);

        this.config.extra.innerRadius = 30;
        this.config.extra.maxRadius = .5 * (this.config.graphHeight || 0);

        this.chartPie = new elements.ChartPieV1(this);
        await this.update(this.group.data, false);

        return;
    }

    prepareData(data: DataObject) : any {
        
        return data;
    }

    async draw(data: DataObject) {

        this.chartPie.draw(data.pies[this.index].filter( (d,i) => i != data.pies[this.index].length - 1));
        this.legend.draw(data.pies[this.index]);
    }


    async redraw(data: any, range: number[]) {

        await super.redraw(data.pies[this.index]);
        this.chartPie.redraw(data.pies[this.index]);
    }

    
    async update(data: DataObject, update: boolean, range?: number[]) {

        await super._update(data, update, range);
    } 
}
