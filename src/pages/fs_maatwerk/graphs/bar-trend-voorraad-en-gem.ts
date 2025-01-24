
import { breakpoints } from '../../../img-modules/styleguide';
import { DataObject, Segment } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IGraphMappingV2, IParameterMapping } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import { AxisArrow } from '../../../charts/elements/axis-arrow';
import { HtmlLegendRowWithLines } from '../../shared/html/html-legend-row-with-lines';

export class BarTrendVoorraadenGemiddeldes extends core.GraphControllerV3  {

    scrollingContainer
    chartAxis;
    chartBarTrend;
    finalRevenueLine;
    zeroLine;

    bars = {};
    timeline_1;
    timeline_2;
    // entity_svgs = {};
    // ctrlrs: any = {};

    line;
    lines : any = {};

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
        super(slug,page,group,data,parameters,modifiers,filters, segment,index) 
        this.pre();
    }

    pre() {


        // this._addMargin(top,bottom,0,30);
        // this._addPadding(60,40,70,0);

        const legend = window.innerWidth < breakpoints.sm ? 140 : 70;


        this._addMargin(0,0,0,40);
        this._addPadding(legend,40,70,30);

        this._addScale('x','band','horizontal-reverse','date');
        this._addScale('y','linear','vertical','value');
        this._addScale('y1','linear','vertical','value');
        this._addAxis('x','x','bottom','quarters');
        this._addAxis('y','y','left')
        this._addAxis('y1','y1','right','value')
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
        
        this.config.paddingInner = .2;
        this.config.paddingOuter =  .2;

        await super._init();
    
        if (this.graphEl != null) await super._svg(this.scrollingContainer);

        this.chartBarTrend = new elements.ChartBarTrend(this);

        for (let m of this.parameters[1]) {
            this.lines[m.column] = new elements.ChartLine(this, "_yearmonth", m.column)
        }

        this.arrowY = new AxisArrow(this,'y','in behandeling');
        this.arrowY1 = new AxisArrow(this,'y1','dagen');
        
        await this.update(this.group.data, false);

        return;
    }

    prepareData(data: DataObject) : DataObject {

        return data;
    }

    async draw(data: DataObject) {

        this.chartBarTrend.draw(data.bars);
        for (let key of Object.keys(this.lines)) {
           this.lines[key].draw(data.lines.find( l => l[0].label == key))
        }

        this.legend.draw("top");

        // this.timeline_1.draw(data.timeline, 0);
        // this.timeline_2.draw(data.timeline_organisation,1);  
    }


    async redraw(data: any) {

        // console.log(data.bars);

        this.scales.x.set(data.bars.map ( d => d.date));
   //   this.scales.x1.set(data.graphs[this.slug].map ( d => d.meta._startdatum).filter( d => d != null));
        this.scales.y.set(data.bars.map( d => d.value));
        this.scales.y1.set([0,500]);

        await super.redraw(data.bars);

        this.chartBarTrend.redraw(data.bars);
        
        for (let key of Object.keys(this.lines)) {
            this.lines[key].redraw()
         }

        await this.arrowY.redraw();
        await this.arrowY1.redraw();

        // this.timeline_1.redraw(data.timeline, 0);
        // this.timeline_2.redraw(data.timeline_organisation, 1);  
    }

    
    async update(data: DataObject, update: boolean, range?: number[]) {

       await super._update(data, update, range);
    } 
}
