
import { breakpoints } from '../../../img-modules/styleguide';
import { DataObject } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IGraphMappingV2, IParameterMapping } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import { AxisArrow } from '../../../charts/elements/axis-arrow';
import { createBars } from '../../shared/data.format.factory';
import { TrendBar } from '../../shared/types_graphs';

export class BarTrend extends core.GraphControllerV3  {

    chartBarTrend;

    legend;
    arrowX;
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
        super(slug,page,group,data,parameters,modifiers, filters, segment,index) 
        this.pre();
    }

    pre() {

        this.config.graphHeight = window.innerWidth < breakpoints.sm ? 320 : 240;

        const top = window.innerWidth < breakpoints.sm ? 30 : 30;
        const bottom = 0;

        this._addMargin(top,bottom,0,30);
        // have a look at hortizontal margins and paddings 
        this._addPadding(0,0,70,0); 

        this._addScale('x','band','horizontal-reverse','date');
        this._addScale('y','linear','vertical','value');
        this._addAxis('x','x','bottom','quarters');
        this._addAxis('y','y','left')
    }

    html() {

        this.graphEl = super._html();
    }

    async init() {
        
        this.config.paddingInner = 0;
        this.config.paddingOuter =  0;

        await super._init();
        if (this.graphEl != null) await super._svg(this.graphEl);

        this.chartBarTrend = new elements.ChartBarTrend(this);        
        await this.update(this.group.data,this.segment, false);

        return;
    }

    prepareData(data: DataObject) : DataObject {

        const bars: { [key : string] : TrendBar[] } = {};

        for (const pg of this.parameters) {

            for (const p of pg) {

                data[p.column] = createBars(p.column, p, data.graphData)

                if (this.modifiers != undefined) {
                    
                    for (const mg of this.modifiers){
                        
                        for (const m of mg) {
                            if (m.column != "{}") {
                                const prop = m.column.replace("{}",p.column);
                                data[prop] = createBars(prop, p, data.graphData)
                            }
                        }
                    }
                }
            }
        }

        return data;
    }

    async draw(data: DataObject) {

        this.chartBarTrend.draw(data[this.segment]);
    }


    async redraw(data: any) {

        this.scales.x.set(data[this.segment].map ( d => d.date));
        this.scales.y.set(data[this.segment].map( d => d.value).concat([0]));

        await super.redraw(data[this.segment]);

        this.chartBarTrend.redraw(data[this.segment]);
        // await this.arrowY.redraw();
    }

    
    async update(data: DataObject, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
