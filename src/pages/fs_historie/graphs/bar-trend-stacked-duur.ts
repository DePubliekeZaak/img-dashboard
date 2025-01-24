import { breakpoints } from '../../../img-modules/styleguide';
import { ImgData, Segment } from '../../shared/types';

import { DataObject } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IGraphMappingV2, IParameterMapping } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import { AxisArrow } from '../../../charts/elements/axis-arrow';
import { HtmlLegendRowWithLines } from '../../shared/html/html-legend-row-with-lines';
import { parseSegment } from '../../shared/factories/segment';
import { createBars } from '../../shared/data.format.factory';
import { TrendBar } from '../../shared/types_graphs';

export class BarTrendStackedDuur extends core.GraphControllerV3  {

    scrollingContainer;
    chartAxis;
    chartArea;
    finalRevenueLine;
    zeroLine;

    bars = {};
    timeline_1;
    timeline_2;
    // entity_svgs = {};
    // ctrlrs: any = {};

    line

    // yScale;
    // xScale;
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
        super(slug,page,group,data,parameters,modifiers,filters,segment,index) 

        if (this.page.segment) {
            this.segment = parseSegment(this.page, this.group.slug, this.slug);
        }

        
        this.pre();
    }

    pre() {

   

        const legend = window.innerWidth < breakpoints.sm ? 140 : 70;

        this._addMargin(0,0,0,40);
        this._addPadding(legend,40,70,30);

        this._addScale('x','band','horizontal-reverse','date');
        this._addScale('y','linear','vertical','value');
        this._addScale('y1','linear','vertical','value');
        this._addAxis('x','x','bottom','quarters');
        this._addAxis('y','y','left')
        this._addAxis('y1','y1','right','percentage')
    }

    html() {

        this.config.graphHeight = window.innerWidth < breakpoints.sm ? 420 : 320;
      
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

        this.legend = new HtmlLegendRowWithLines(this);
    }

    async init() {

        this.config.paddingInner = 0;
        this.config.paddingOuter = 0;

        await super._init();
        if (this.graphEl != null) await super._svg(this.scrollingContainer);

        this.chartArea = new elements.ChartStackedBars(this);
        this.line = new elements.ChartLine(this, "_yearmonth", this.parameters[1][0].column)

        this.arrowY = new AxisArrow(this,'y','aantal dossiers');
        this.arrowY1 = new AxisArrow(this,'y1','percentage binnen half jaar');
        
        await this.update(this.group.data, false);

        return;
    }

    prepareData(data: DataObject) : DataObject {

        console.log("segment", this.segment)

        const bars: { [key : string] : TrendBar[] } = {};

        for (let pg of this.parameters) {

            for (const p of pg) {

                data[p.column] = createBars(p.column, p, data.stacked, this.segment)
            }
        }

        return data;
    }

    async draw(data: DataObject) {

        this.chartArea.draw(data[this.segment.key]);
    }

    async redraw(data: any) {

        this.scales.x.set(data[this.segment.key].map ( d => d.date));
        this.scales.y.set(data[this.segment.key].map( d => d.value).concat([0]));

        await super.redraw(data[this.segment.key]);

        this.chartArea.redraw(data[this.segment.key],this.parameters[1][0].column);
    }

    async update(data: DataObject, update: boolean, range?: number[]) {
        await super._update(data, update, range);
    }
}
