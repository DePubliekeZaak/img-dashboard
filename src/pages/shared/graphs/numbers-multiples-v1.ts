
import { DataObject, Segment } from '../types';
import { core, elements } from '../../../charts';
import { GroupObject, IParameterMapping } from '../interfaces';
import { IPageController } from '../page.controller';
import breakpoints from '../../../img-modules/styleguide/breakpoints';
import { parseSegment } from '../factories/segment';

export class NumbersMultiplesV1 extends core.GraphControllerV3  {

    el;
    number;

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
        super(slug,page,group,data,parameters,modifiers,filters, segment,index);

        if (this.page.segment) this.segment = parseSegment(this.page, this.group.slug, this.slug)

        this.pre();
    }

    pre() {

        let top = 0;
        let bottom = 0;

        if (window.innerWidth < breakpoints.sm) {

            top = this.index == 0 ? 15 : 0; 
            bottom = 15;
            
        } else {

            bottom = 45
        }
        
        this._addMargin(top,bottom,0,0);
    }

    html() {

        this.el = super._html(["graph-container-4"]);
        // this.el.parentElement.style.paddingTop = "5rem";
    }

    async init() {

        this.number = new elements.HtmlNumberSimple(this, this.parameters[0][this.index], this.el)
        await this.update(this.group.data, false);
        return;
    }

    prepareData(data: DataObject) : DataObject {


        data.numbers = this.segment.cumulative ? data.cumulative : data.incremental
        return data;
    }

    async draw(data: DataObject) {

        this.number.draw()
    }


    async redraw(data: any, range: number[]) {
        
        this.number.redraw(data.numbers[this.index])
    }

    
    async update(data: DataObject, update: boolean, range?: number[]) {

       await super._update(data, update, range);
    } 
}
