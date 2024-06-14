
import { breakpoints } from '../../../img-modules/styleguide';
import { DataObject } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IGraphMappingV2, IParameterMapping } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';

export class NumbersV1 extends core.GraphControllerV3  {

    els = {};
    numbers = {};

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
        this._addMargin(0,0,0,0);
    }

    html() {

        for (let p of this.parameters[0]) {
            this.els[p.column] = super._html(["graph-container-4"]);
        }
    }

    async init() {
        
        for (let p of this.parameters[0]) {
            this.numbers[p.column] = new elements.HtmlNumberCircle(this, p, this.els[p.column])
        }
        
        await this.update(this.group.data,this.segment, false);

        return;
    }

    prepareData(data: DataObject) : DataObject {

        return data;
    }

    async draw(data: DataObject) {

        for (let p of this.parameters[0]) {
            this.numbers[p.column].draw()
        }
    }


    async redraw(data: any, range: number[]) {

        for (let p of this.parameters[0]) {
            this.numbers[p.column].redraw(data.graphData[0])
        }
    }

    
    async update(data: DataObject, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
