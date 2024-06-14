
import { breakpoints } from '../../../img-modules/styleguide';
import { ImgData } from '../../shared/types';

import { DataObject } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IGraphMappingV2, IParameterMapping } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import { AxisArrow } from '../../../charts/elements/axis-arrow';
import { HtmlLegendRowWithLines } from '../../shared/html/html-legend-row-with-lines';

export class BarTrendStackedMakeupV2 extends core.GraphControllerV3  {

    chartBars;
    legend;
    arrowY;

    constructor(
        public slug:  string,
        public page: IPageController, 
        public group: GroupObject, 
        public data: DataObject,
        public parameters: IParameterMapping[][],
        public modifiers: IParameterMapping[][],
        public filters: string[],
        public segment: string, 
        public index: number
    ){
        super(slug,page,group,data,parameters,modifiers,filters,segment,index) 
        this.pre();
    }

    pre() {

        const top = window.innerWidth < breakpoints.sm ? 30 : 0;
        const bottom = 0;

        this._addMargin(top,bottom,0,30);
        this._addPadding(60,0,70,0);

        this._addScale('x','band','horizontal-reverse','date');
        this._addScale('y','linear','vertical','value');
        this._addAxis('x','x','bottom','quarters');
        this._addAxis('y','y','left')
    }

    html() {

        this.config.graphHeight = window.innerWidth < breakpoints.sm ? 320 : 320;
      
        if(this.group.element == null ) return;

        this.graphEl = super._html();

        this.legend = new HtmlLegendRowWithLines(this);
    }

    async init() {

        this.config.paddingInner = 0;
        this.config.paddingOuter =  0;

        await super._init();
        if (this.graphEl != null) await super._svg(this.graphEl);

        this.chartBars = new elements.ChartStackedBarsV2(this);

        this.arrowY = new AxisArrow(this,'y','aantal besluiten');
        
        await this.update(this.group.data,this.segment, false);

        return;
    }

    prepareData(data: DataObject) : DataObject {

        for (let m of data.graphData) {
            m.date = m._yearmonth
        }

        const ps = this.parameters[0];

        const stack = window.d3.stack()
            .keys(ps.map( p => p.column));

        data.stacked = stack(data.graphData);

        return data;
    }

    async draw(data: DataObject) {

        this.chartBars.draw(data);
        this.legend.draw("top");
    }


    async redraw(data: any, range: number[]) {

        this.scales.x.set(data.graphData.map ( d => d._yearmonth));
        this.scales.y.set(data.stacked[data.stacked.length - 1].map( d => d[1]).concat([0]));
        await super.redraw(data.stacked);
        this.chartBars.redraw(data);
        await this.arrowY.redraw(); 
    }

    
    async update(data: DataObject, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
