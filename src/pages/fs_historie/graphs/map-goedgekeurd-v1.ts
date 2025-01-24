import { breakpoints } from '../../../img-modules/styleguide';
import { DataObject, Segment } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IGraphMappingV2, IParameterMapping } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import HtmlLegend from '../../shared/html/html-legend';

import { HTMLYear } from '../../shared/html/html-year';
import MapLegend from '../../shared/html/html-legend-map';
import { parseSegment } from '../../shared/factories/segment';


export class MapGoedgekeurdV1 extends core.GraphControllerV3  {

    chartAxis;
    header

    entity_svgs = {};
    ctrlrs: any = {};

    map;
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
        super(slug,page,group,data,parameters,modifiers,filters,segment,index);
        if (this.page.segment) {
            this.segment = parseSegment(this.page, this.group.slug, this.slug);
        }

        this.pre();
    }

    pre() {

        this._addScale('y','linear','opacity','value');
    }

    html() {

        if (window.innerWidth < breakpoints.sm) {
            this.config.graphHeight = 400

        } else if (window.innerWidth < breakpoints.md) {
            this.config.graphHeight = 360
        } else {
            this.config.graphHeight = 280
        }
        
        if(this.group.element == null ) return;

        this.graphEl = super._html();
        if(this.graphEl == null) return;
        this.graphEl.classList.remove("graph-container-12");
        this.graphEl.classList.add("graph-container-4");
        this.graphEl.classList.add("i-" + this.index)

        this.header = new HTMLYear(this,this.graphEl);
        this.graphEl.style.position = "relative";
        this.graphEl.style.display = "flex";
        this.graphEl.style.flexDirection = window.innerWidth < breakpoints.sm ? "column" : "column";
        this.graphEl.style.justifyContent = window.innerWidth < breakpoints.sm ? "space-between" : "space-around";
        
        // this.legend = new HtmlLegend(this);

        if (this.index == 4) {
            this.graphEl.style.margin = window.innerWidth < breakpoints.sm ? "0" : "0 auto 0 2.5rem"
        }

    }

    async init() {

        await super._init();
        if (this.graphEl != null) await super._svg(this.graphEl);
    
        this.map = new elements.MapV1(this);
        this.legend = new MapLegend(this);
        
        await this.update(this.group.data, false);

        const svg = this.graphEl?.querySelector("svg");
        if (svg && window.innerWidth < breakpoints.sm) {
            svg.style.marginTop = "-4rem";
            svg.style.marginBottom = "-2rem";
        }

        return;
    }

    prepareData(data: DataObject) : DataObject {
        return data;
    }

    async draw(data: DataObject) {
        this.map.draw(data[this.segment.key]);
        this.legend.draw();
    }

    async redraw(data: any) {
        await super.redraw(data[this.segment.key]);
        this.map.redraw(data[this.segment.key]);
    }

    async update(data: DataObject, update: boolean, range?: number[]) {
        await super._update(data, update, range);
    }
}
