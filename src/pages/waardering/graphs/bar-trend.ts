import { breakpoints } from '../../../img-modules/styleguide';
import { DataObject, Segment } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IGraphMappingV2, IParameterMapping } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import { AxisArrow } from '../../../charts/elements/axis-arrow';
import { createBars } from '../../shared/data.format.factory';
import { TrendBar } from '../../shared/types_graphs';
import { segmentParse } from '../../shared/segment';
import { parseSegment } from '../../shared/factories/segment';

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
        segment: Segment, 
        public index: number
    ){
        super(slug,page,group,data,parameters,modifiers,filters,segment,index) 
        
        if (this.page.segment) {
            this.segment = parseSegment(this.page, this.group.slug, this.slug);
        }

        this.pre();
    }

    pre() {

        this.config.graphHeight = window.innerWidth < breakpoints.sm ? 320 : 240;

        const top = window.innerWidth < breakpoints.sm ? 30 : 30;
        const bottom = 0;

        this._addMargin(top,bottom,0,30);
        this._addPadding(0,0,30,0);

        this._addScale('x','band','horizontal-reverse','date');
        this._addScale('y','linear','vertical','value');
        this._addAxis('x','x','bottom','quarters');
        this._addAxis('y','y','left')
    }

    html() {

        this.graphEl = super._html();
        // this.graphEl.classList.remove("graph-container-12");
        // this.graphEl.classList.add("graph-container-9");
    }

    async init() {
        
        this.config.paddingInner = .2;
        this.config.paddingOuter =  0;

        await super._init();
        if (this.graphEl != null) await super._svg(this.graphEl);

        this.chartBarTrend = new elements.ChartBarTrendwithNumber(this);
        this.arrowY = new AxisArrow(this,'y','waardering');
        
        await this.update(this.group.data, false);

        return;
    }

    prepareData(data: DataObject) : DataObject {

        const bars: { [key : string] : TrendBar[] } = {};

        for (const pg of this.parameters) {

            for (const p of pg) {

                data[p.column] = createBars(p.column, p, data.graphData, this.segment)

                if (this.modifiers != undefined) {
                    
                    for (const mg of this.modifiers){
                        
                        for (const m of mg) {
                            if (m.column != "{}") {
                                const prop = m.column.replace("{}",p.column);
                                data[prop] = createBars(prop, p, data.graphData, this.segment)
                            }
                        }
                    }
                }
            }
        }

        return data;
    }

    async draw(data: DataObject) {

        this.chartBarTrend.draw(data[this.parameters[0][0]["column"]]);
    }


    async redraw(data: any) {

        const bars = data[this.parameters[0][0]["column"]];

        this.scales.x.set(bars.map ( d => d.date));
        this.scales.y.set(bars.map( d => d.value).concat([0,10]));

        await super.redraw(bars);

        this.chartBarTrend.redraw(bars);
        await this.arrowY.redraw();
    }

    
    async update(data: DataObject, update: boolean, range?: number[]) {
    
        await super._update(data, update, range);
    } 
}
