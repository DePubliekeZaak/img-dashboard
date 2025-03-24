import { DataObject, Segment } from '../types';
import { core, elements } from '../../../charts';
import { GroupObject, IParameterMapping } from '../interfaces';
import { IPageController } from '../page.controller';
import { parseSegment } from '../factories/segment';
import { HtmlHeader } from '../html/html-header';

export class HeaderV1 extends core.GraphControllerV3 {

    header;
  

    constructor(
        public slug: string,
        public page: IPageController,
        public group: GroupObject,
        public data: DataObject,
        public parameters: IParameterMapping[][],
        public modifiers: IParameterMapping[][],
        public filters: string[],
        public segment: Segment,
        public index: number,
        public pageSegment: any
    ) {
        super(slug, page, group, data, parameters, modifiers, filters, segment, index);

        if (this.page.segment) {
            this.segment = parseSegment(this.page, this.group.slug, this.slug);
        }

        this.pre();
    }

    pre() {
        const bottom = 15;
        this._addMargin(0, bottom, 0, 0);
    }

    html() {

        this.graphEl = super._html(['graph-container-12']);
        

    }

    async init() {
        

        this.header = new HtmlHeader(this, [], this.graphEl, this.parameters[0][0].label, "");

        await this.update(this.group.data, false);
        return;
    }

    prepareData(data: DataObject): DataObject {
      
        return data;
    }

    async draw(data: DataObject) {

        this.header.draw(data);
       
    }

    async redraw(data: any, range: number[]) {
      
    }

    async update(data: DataObject, update: boolean, range?: number[]) {

        await super._update(data, update, range);
    }
}
