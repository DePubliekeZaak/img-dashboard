
import { breakpoints } from '../../../img-modules/styleguide';
import { ImgData, Segment } from '../types';

import { DataObject } from '../types';
import { core, elements } from '../../../charts';
import { GroupObject, IGraphMappingV2, IParameterMapping } from '../interfaces';
import { IPageController } from '../page.controller';
import { AxisArrow } from '../../../charts/elements/axis-arrow';
import { HtmlLegendRowWithLines } from '../html/html-legend-row-with-lines';
import { HtmlLegendRow } from '../html/html-legend-row';
import { parseSegment } from '../factories/segment';


export class BarTrendStackedMakeupV2 extends core.GraphControllerV3  {

    chartBars;
    legend;
    arrowY;
    scrollingContainer;
    timeline_1;

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

    pre() {

        const top = window.innerWidth < breakpoints.sm ? 30 : 0;
        const bottom = 0;

        const marginForTimeline = 360;
        const paddingForTimeline = 60;

        this._addMargin(top,marginForTimeline,30,30);
        this._addPadding(30,paddingForTimeline,50,0);

        this._addScale('x','band','horizontal-reverse','date');
        this._addScale('x1','time','horizontal','date');
        this._addScale('y','linear','vertical','value');
        this._addScale('y2','linear','vertical','value');
        this._addAxis('x','x','bottom','quarters');
        this._addAxis('y','y','left')
        this._addAxis('y2','y','right')
    }

    html() {

        this.config.graphHeight = window.innerWidth < breakpoints.sm ? 420 : 420;
      
        if(this.group.element == null ) return;

        this.graphEl = super._html();

        if(this.graphEl != null) {
        //   this.graphEl.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight.toString() + "px" : graphHeight.toString() + "px";
            this.graphEl.style.overflowX = "auto";
            this.graphEl.style.marginBottom = (window.innerWidth < breakpoints.sm) ? "0" : "2rem";
            this.graphEl.style.paddingRight = "50px";
            this.graphEl.style.paddingTop = "40px";
        }

        this.scrollingContainer = document.createElement('section');
        this.scrollingContainer.classList.add("graph-container-12")
        this.scrollingContainer.classList.add("graph-view")
        this.scrollingContainer.style.height = "100%";
        this.scrollingContainer.style.minWidth = "800px";
        this.graphEl.appendChild(this.scrollingContainer);

        this.legend = new HtmlLegendRow(this);
    }

    async init() {

        this.config.paddingInner = 0;
        this.config.paddingOuter =  0;

        await super._init();
        if (this.graphEl != null) await super._svg(this.scrollingContainer);

        this.chartBars = new elements.ChartStackedBarsV2(this);

        this.timeline_1 = new elements.ChartTimeline(this);


        // this.arrowY = new AxisArrow(this,'y2','aantal meldingen');
        
        await this.update(this.group.data, false);

        return;
    }

    prepareData(data: DataObject) : DataObject {

        let _data = (this.segment.periodization == "weekly") ? data.graphData : data.graphData_alt

        const period = (this.segment.periodization == "weekly") ? "_yearweek" : "_yearmonth";

        // console.log(_data)

        for (let m of _data) {
            m.date = m[period]
        }

        const index = this.segment.parameterIndex != null ? this.segment.parameterIndex : 0

        const ps = this.parameters[index];

        const stack = window.d3.stack()
            .keys(ps.map( p => this.segment.cumulative ? p.column + '_cumulatief': p.column));

        data.stacked = stack(_data);

        return data;
    }

    async draw(data: DataObject) {

        this.chartBars.draw(data);
        this.legend.draw("top");
        this.timeline_1?.draw(data.timeline, 0); 
    }


    async redraw(data: any, range: number[]) {

        const period = (this.segment.periodization == "weekly") ? "_yearweek" : "_yearmonth";

        this.scales.x.set(data.graphData.map ( d => d[period]));
        this.scales.x1.set(data.graphData.map ( (d) =>  { return d._startdatum }).filter( d => d != null));
        this.scales.y.set(data.stacked[data.stacked.length - 1].map( d => d[1] < 0 ? 0 : d[1]).concat([0]));
        this.scales.y2.set(data.stacked[data.stacked.length - 1].map( d => d[1] < 0 ? 0 : d[1]).concat([0]));
        await super.redraw(data.stacked);

        this.chartBars.redraw(data, this.segment);
        this.timeline_1?.redraw(data.timeline, 0);  
        // await this.arrowY.redraw(); 

        if (window.innerWidth < breakpoints.md) {
            if(this.graphEl != null) {
                this.graphEl.scrollLeft += this.graphEl.scrollWidth - this.graphEl.clientWidth;
            }   
        }
    }

    
    async update(data: DataObject, update: boolean, range?: number[]) {

        await super._update(data, update, range);
    } 
}
