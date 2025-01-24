
import { breakpoints } from '../../../img-modules/styleguide';
import { Segment } from '../../shared/types';

import { DataObject } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IParameterMapping } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import { HTMLSource } from '../../shared/html/html-source';
import HtmlLegendAsSum from '../../shared/html/html-legend-sum';
import { parseSegment } from '../../shared/factories/segment';


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
        super(slug,page,group,data,parameters,modifiers,filters, segment,index) 

        if (this.page.segment) {
            this.segment = parseSegment(this.page, this.group.slug, this.slug);
        }

        this.pre();
    }

    pre() {

        // const bottom = 100;

        // this._addMargin(60,bottom,0,0);
        // this._addPadding(0,0,30,0);

    }

    html() {

        const graphHeight = 500

        if(this.group.element == null ) return;

        this.graphEl = super._html();
        if(this.graphEl == null) return;
        this.graphEl.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight.toString() + "px" : graphHeight.toString() + "px";
        this.graphEl.style.display = "flex";
        this.graphEl.style.flexDirection = "row";
        this.graphEl.style.justifyContent = "space-around";
        
        if (this.graphEl != null && this.group.graphs.length -1 == this.index) {
            let source = HTMLSource(this.graphEl.parentElement as HTMLElement,this.page.main.params.language,"IMG");
            if (source != undefined) {
                source.style.marginTop = "-6rem"; 
                source.style.position = "absolute";
                source.style.bottom = "0";
            }
        }

        this.legend = new HtmlLegendAsSum(this);
    }

    async init() {

        await super._init();
        if (this.graphEl != null) await super._svg(this.graphEl);

        this.config.extra.innerRadius = 50;
        this.config.extra.maxRadius = 200;

        this.chartPie = new elements.ChartPieV1(this);
        await this.update(this.group.data, false);

        return;
    }

    prepareData(data: DataObject) : any {
        
        return data;
    }

    async draw(data: DataObject) {

        console.log(data);

        this.chartPie.draw(data.pies[0]);
        this.legend.draw(data.pies[0]);
    }


    async redraw(data: any, range: number[]) {

        this.chartPie.redraw(data.graphs);
    }

    
    async update(data: DataObject, update: boolean, range?: number[]) {

       await super._update(data,update, range);
    } 
}
