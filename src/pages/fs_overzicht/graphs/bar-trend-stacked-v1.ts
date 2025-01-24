
import { breakpoints } from '../../../img-modules/styleguide';
import { Segment } from '../../shared/types';

import { DataObject } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IParameterMapping } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import { AxisArrow } from '../../../charts/elements/axis-arrow';
import { parseSegment } from '../../shared/factories/segment';


export class BarTrendStackedV1 extends core.GraphControllerV3  {

    scrollingContainer;
    chartAxis;
    chartBarStacked;
    finalRevenueLine;
    zeroLine;

    bars = {};
    timeline_1;
    timeline_2;
    // entity_svgs = {};
    // ctrlrs: any = {};

    line

    bottomAxis;
    leftAxis;

    legend;

    arrowX;
    arrowY;
    arrowY1

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

        const top = window.innerWidth < breakpoints.sm ? 90 : 90;
        const bottom = 40;

        this._addMargin(top,bottom,0,30);
        this._addPadding(0,0,60,0);

        this._addScale('x','band','horizontal-reverse','date');
        this._addScale('y','linear','vertical','value');
        this._addAxis('x','x','bottom','quarters');
        this._addAxis('y','y','left')
    }

    html() {

        this.config.graphHeight = window.innerWidth < breakpoints.sm ? 320 : 240;
      
        if(this.group.element == null ) return;

        this.graphEl = super._html();

        if(this.graphEl != null) {
            this.graphEl.style.height = (window.innerWidth < breakpoints.sm) ? this.config.graphHeight?.toString() + "px" : this.config.graphHeight?.toString() + "px";
            this.graphEl.style.overflowX = "auto";
            this.graphEl.style.marginBottom = "2rem";
            this.graphEl.style.whiteSpace = "nowrap";
        }

        this.scrollingContainer = document.createElement('section');
        this.scrollingContainer.classList.add("scrolltainer");
        if (this.filters.length > 0) this.graphEl.classList.add("has-filters");
        this.graphEl.appendChild(this.scrollingContainer);
    }

    async init() {
        
        this.config.paddingInner = .2;
        this.config.paddingOuter = .2;

        await super._init();
        if (this.graphEl != null) await super._svg(this.scrollingContainer);

        this.chartBarStacked = new elements.ChartStackedBars(this);
      //  this.line = new elements.ChartLine(this, "_yearmonth", this.parameters[1][0].column)

        this.arrowY = new AxisArrow(this,'y','aantal besluiten p.m.');
    //    this.arrowY1 = new AxisArrow(this,'y1','percentage toegekend p.m.');
        
        await this.update(this.group.data, false);

        return;
    }

    prepareData(data: DataObject) : DataObject {

        return data;
    }

    async draw(data: DataObject) {

        this.chartBarStacked.draw(data);
    //    this.line.draw(data.line);
    }


    async redraw(data: any, range: number[]) {

        this.scales.x.set(data.bars.map ( d => d.date));
   //   this.scales.x1.set(data.graphs[this.slug].map ( d => d.meta._startdatum).filter( d => d != null));
        this.scales.y.set(data.stacked[1].map( d => d[1]).concat([0]));
    //    this.scales.y1.set([0,100]);

        await super.redraw(data.stacked);

        this.chartBarStacked.redraw(data);
     //   this.line.redraw();

    //    await this.arrowX.redraw();
        await this.arrowY.redraw();
     //   await this.arrowY1.redraw();
 
    }

    
    async update(data: DataObject, update: boolean, range?: number[]) {

       await super._update(data,update, range);
    } 
}
