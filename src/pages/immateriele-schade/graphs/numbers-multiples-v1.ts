
import { breakpoints } from '../../../img-modules/styleguide';
import { DataObject } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IGraphMappingV2, IParameterMapping } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';

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
        public segment: string, 
        public index: number
    ){
        super(slug,page,group,data,parameters,modifiers,filters, segment,index) 
        this.pre();
    }

    pre() {

        this._addMargin(0,45,0,0);
    }

    html() {

        this.el = super._html(["graph-container-4"]);
    }

    async init() {
        
        this.number = new elements.HtmlNumberSimple(this, this.parameters[0][this.index], this.el)
        await this.update(this.group.data, this.segment, false);
        return;
    }

    prepareData(data: DataObject) : DataObject {

        return data;
    }

    async draw(data: DataObject) {

        this.number.draw()
    }


    async redraw(data: any, range: number[]) {

        this.number.redraw(data.numbers[this.index])
    }

    
    async update(data: DataObject, segment: string, update: boolean, range?: number[]) {

       await super._update(data, segment, update, range);
    } 
}
