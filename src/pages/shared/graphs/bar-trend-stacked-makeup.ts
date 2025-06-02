import { breakpoints } from '../../../img-modules/styleguide';
import { Segment } from '../types';

import { DataObject } from '../types';
import { core, elements } from '../../../charts';
import { GroupObject, IParameterMapping } from '../interfaces';
import { IPageController } from '../page.controller';
import { AxisArrow } from '../../../charts/elements/axis-arrow';
import { HtmlLegendRowWithLines } from '../html/html-legend-row-with-lines';
import { parseSegment } from '../factories/segment';

interface StackDataItem {
    category: string;
    [key: string]: string | number;  // Allow for dynamic numeric properties
}

export class BarTrendStackedMakeup extends core.GraphControllerV3  {

    chartBars;
    legend;
    arrowY;
    scrollingContainer;

    constructor(
        public slug:  string,
        public page: IPageController, 
        public group: GroupObject, 
        public data: DataObject,
        public parameters: IParameterMapping[][],
        public modifiers: IParameterMapping[][],
        public filters: string[],
        public segment: Segment, 
        public index: number,
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

        this._addMargin(top,bottom,30,30);
        this._addPadding(75,30,50,0);

        this._addScale('x','band','horizontal-reverse','date');
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

        this.legend = new HtmlLegendRowWithLines(this);
    }

    async init() {

        this.config.paddingInner = 0;
        this.config.paddingOuter =  0;

        await super._init();
        if (this.graphEl != null) await super._svg(this.scrollingContainer);

        this.chartBars = new elements.ChartStackedBarsV2(this);

        const label = this.segment.label || 'aantal meldingen';

        this.arrowY = new AxisArrow(this,'y2', label);
        
        await this.update(this.group.data, false);

        return;
    }

    prepareData(data: DataObject): DataObject {

        let monthFirst = (data.graphData[0].periodization == "monthly") ? true : false;

        let _data;

        if (monthFirst) {
            _data = (this.segment.periodization == "weekly") ? data.graphData_alt : data.graphData
        } else {
            _data = (this.segment.periodization == "weekly") ? data.graphData : data.graphData_alt
        }

        const period = (this.segment.periodization == "weekly") ? "_yearweek" : "_yearmonth";

        for (let m of _data) {
            m.date = m[period]
        }

        const index = this.segment.parameterIndex != null ? this.segment.parameterIndex : 0

        const ps = this.parameters[index];

        const stack = window.d3.stack<StackDataItem>()
            .keys(ps.map( p => this.segment.cumulative ? p.column + '_cumul': p.column));

        if (!this.segment.normalized) {

            data.stacked = stack(_data as StackDataItem[]);

        } else {

            const normalized_data: any[] =  [];
            
            for (let d of _data) {

                const newItem = { ...d };

                let total = 0;
                for (let p of Object.values(ps)) {
                    total = total + d[p.column]; 
                }

                for (let p of Object.values(ps)) {
                    newItem[p.column] = d[p.column] / total;
                }
                normalized_data.push(newItem);
            }

            data.stacked = stack(normalized_data);
        }

        return data;
    }

    async draw(data: DataObject) {

        this.chartBars.draw(data);
        this.legend.draw("top");
    }


    async redraw(data: any, range: number[]) {

        this.scales.x.set(data.stacked[0].map ( d => d.data.date));
        this.scales.y.set(data.stacked[data.stacked.length - 1].map( d => d[1] < 0 ? 0 : d[1]).concat([0]));
        this.scales.y2.set(data.stacked[data.stacked.length - 1].map( d => d[1] < 0 ? 0 : d[1]).concat([0]));
        await super.redraw(data.stacked);
        this.chartBars.redraw(data, this.segment);
        await this.arrowY.redraw(); 

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
