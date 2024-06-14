
import { breakpoints } from '../../../img-modules/styleguide';
import { DataPart, ImgData } from '../../shared/types';

import { DataObject } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IGraphMappingV2, IParameterMapping } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import { HtmlLegendCustom } from '../../shared/html/html-legend-custom';
import { HtmlRadio } from '../../shared/html/html-radio';
import { TrendBar } from '../../shared/types_graphs';
import { KeyValue } from '../../../charts/core/types';
import { HtmlLegendRow } from '../../shared/html/html-legend-row';


export class PercentageTrendV1 extends core.GraphControllerV3  {

    chartBar;
    timeline_1;
    legend;
    lines = {};

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
        super(slug,page,group,data,parameters,modifiers,filters, segment,index) 
        this.pre();
    }

    pre() {

        this.config.graphHeight =  window.innerWidth > breakpoints.sm ? 320 : 240; //  this.index < 1 ? 420 : 210;

        const bottom = window.innerWidth > breakpoints.sm ? 60 : 15;

        this._addMargin(0,0,0,0);
        this._addPadding(0,bottom,30,30);

        this._addScale('x','band','horizontal-reverse','label');
        this._addScale('x1','time','horizontal','date');
        this._addScale('y','linear','vertical','value');
        this._addAxis('x','x','bottom','quarters');
        this._addAxis('y','y','left','percentage')
    }

    html() {

        const graphHeight = this.index < 1 ? 420 : 210;
    
        if(this.group.element == null ) return;

        this.graphEl = super._html();

        // if (window.innerWidth > breakpoints.sm && this.graphEl.parentElement && this.mapping[2]) {
        //     let radiobuttons = new HtmlRadio(this, this.mapping[2],this.graphEl.parentElement);
        // }
    }

    async init() {

        this.config.paddingInner = .2;
        this.config.paddingOuter =  .2;

        await super._init();
        if (this.graphEl != null) await super._svg(this.graphEl);

        if (window.innerWidth > breakpoints.sm) {
            this.timeline_1 = new elements.ChartTimeline(this);
        }

        this.chartBar = new elements.ChartBarTrend(this);
        // for (let p of this.parameters[0]) {
        //     this.lines[p.column] = new elements.ChartLine(this, "_yearmonth", p.column)
        // }
        
        // this.legend = new HtmlLegendRow(this);

        await this.update(this.group.data,this.segment, false);

        return;
    }

    prepareData(data: DataObject) : DataObject {

        const createBars = (prop: string, param: IParameterMapping, data: KeyValue[]) => {

            const bs: TrendBar[] = [];
            
            for (let period of data) {

                bs.push({
                    label: param?.label || "",
                    name: "main",
                    date: period._yearmonth.toString(),
                    colour: param != undefined ? param.colour : "orange",
                    meta: period,
                    value: period[prop] == null ? 0 : parseFloat(period[prop].toString())
                })
            }

            return bs;
        }

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

        this.chartBar.draw(data[this.segment]);

        // for (let p of this.parameters[0]) {
        //     this.lines[p.column].draw(data[p.column])
        // }

        // this.legend.draw("top");

        this.timeline_1?.draw(data.timeline, 0);        
    }


    async redraw(data: any) {

        this.scales.x.set(data[this.segment].map ( d => d.date));
        this.scales.x1.set(data[this.segment].map ( d => d.meta._startdatum).filter( d => d != null));
        this.scales.y.set(data[this.segment].map ( d => d.value).concat([0,100]));

        await super.redraw(data[this.segment]);
        
        this.chartBar.redraw(data[this.segment]);
        this.timeline_1?.redraw(data.timeline, 0);        
    }

    
    async update(data: DataObject, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
