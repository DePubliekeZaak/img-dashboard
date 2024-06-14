
import { tableToCSV } from "../download.factory";
import { IGroupCtrlr } from "../interfaces";

import { HtmlYearSelector } from "./year-selector";
import { HtmlMappingSelector } from "./mapping-selector";
import { HtmlCustomSelector } from "./html-custom-selector";
import { breakpoints } from "../../../img-modules/styleguide";
import { IGraphControllerV3 } from "../../../charts/core/graph-v3";
import { HtmlMonthSelector } from "./month-selector";
import { HtmlTotalvsRecentSelector } from "./total-recent-selector";

// import { EitiEntity } from "../types";

export class HtmlFilters {

    listElement;
    selector;
    companySelector;
    tableButton
    downloadButton;
    definitionsButton;
    hasListener = false;

    constructor(
        private ctrlr: IGraphControllerV3,
        private id: string,
        private element,
        private filters,
        private parameters,
        private modifiers,
        private segment
    ){
        this.init(undefined);
    }

    init(el: HTMLElement | undefined) {

        const element = (el != undefined) ? el : this.element

        const prevElement = element.querySelector('.filter_list')
        this.listElement = this.ctrlr.page.main.window.document.createElement('div');
        this.listElement.classList.add('filter_list');

        const ul = this.ctrlr.page.main.window.document.createElement('ul');

        this.listElement.appendChild(ul);

        element.insertBefore(this.listElement, element.firstChild);

        return true;

    }

    draw() {

        const self = this;

        const ul = this.listElement.querySelector('ul');
     
        for (const func of this.filters) {

            const li = this.ctrlr.page.main.window.document.createElement('li');
            
            let selectEl;

            switch (func) {

                case 'modifier':


                    if(this.modifiers != undefined) {
                        const selector = new HtmlMappingSelector(this.ctrlr, li, this.id, this.modifiers);
                        const selectEl = selector.draw(this.segment, 1);

                        selectEl.addEventListener("change", () => {

                            const newValue = selectEl.value.replace("{}",this.ctrlr.segment); 

                            console.log(newValue);

                            if ( newValue != self.ctrlr.segment) {
                                self.ctrlr.update(self.ctrlr.group.data, newValue, true);
                            }
                        });
                    }

                    break;

                case 'totaalVsRecent': 

                    const _selector = new HtmlTotalvsRecentSelector(this.ctrlr, li, this.id);
                    const _selectEl = _selector.draw(this.segment, 1);

                    _selectEl.addEventListener("change", () => {

                        const newValue = _selectEl.value.replace("{}",this.ctrlr.segment); 

                        console.log(newValue);

                        if ( newValue != self.ctrlr.segment) {
                            self.ctrlr.update(self.ctrlr.group.data, newValue, true);
                        }
                    });

                    break;

                case 'mappingSelect':

                        // this.selector = new HtmlMappingSelector(this.ctrlr, li,this.ctrlr.slug,this.mapping);
                        // const selectEl2 = this.selector.draw(this.segment);

                        // selectEl2.addEventListener("change", () => {
                        //     if ( selectEl2.value != self.ctrlr.segment) {
                        //         self.ctrlr.update({}, selectEl2.value, true);
                        //     }
                        // });

                    break;

                case 'monthSelect':

                    const months = [];

                    const selector = new HtmlMonthSelector(this.ctrlr, li, this.ctrlr.group.slug, this.ctrlr.group.data.graphData)
                    const selectEl = selector.draw(this.segment);

                    selectEl.addEventListener("change", () => {

                        if ( selectEl.value != self.ctrlr.segment) {
                            self.ctrlr.update(self.ctrlr.group.data, selectEl.value, true);
                        }
                    });


                    break;

                case 'combiSelect':

                    li.style.display = "flex";

                    const selectorA = new HtmlMappingSelector(this.ctrlr, li,this.id,this.parameters);
                    const selectEl2a = selectorA.draw(this.segment,0);
                    selectEl2a.style.maxWidth =  window.innerWidth < breakpoints.sm ? "70vw" : "30vw";

                    let selectEl2b : HTMLSelectElement|undefined = undefined;
                    // dit zijn de modifiers ! 
                    if(this.modifiers != undefined) {
                        const selectorB = new HtmlMappingSelector(this.ctrlr, li,this.id,this.modifiers);
                        selectEl2b = selectorB.draw(this.segment, 1);
                        selectEl2a.style.marginRight = "1rem";
                    }

                    const updateSegment = () => {

                        let newValue;

                        if(selectEl2b != undefined) {
                            if(selectEl2a.value == 'fysieke_schade_werkvoorraad') {
                                newValue = selectEl2a.value
                            } else {
                                newValue = selectEl2b.value.replace("{}",selectEl2a.value);  
                            }
                        } else {
                            newValue = selectEl2a.value
                        }


                        if ( newValue != self.ctrlr.segment) {
                            self.ctrlr.update(self.ctrlr.group.data, newValue, true);
                        }
                    }


                    selectEl2a.addEventListener("change", () => {

                        updateSegment();
                    });

                    if(selectEl2b != undefined) {

                        selectEl2b.addEventListener("change", () => {

                            updateSegment();
                        });
                    }


                break;
            }

            ul.appendChild(li);
        }
    }

    // post data retrieval 
    redraw(func: string) {

        let self = this;

        // switch (func) {

        //     case 'companySelect' :

        //     const collection = self.ctrlr.page.main.data.collection();

        //     const companies = collection.entities
        //     .filter( (e) => e.type === 'company' && e.slug != 'ebn')
        //     .sort( (a: EitiEntity, b: EitiEntity) =>  a.name.localeCompare(b.name));

        //     const el = this.companySelector.redraw(this.segment, companies);

        //     el.addEventListener("change", () => {

        //         if( el.value != self.ctrlr.segment) {
        //             self.companySelector.redraw(el.value, companies);
        //             self.ctrlr.update({}, el.value, true);
        //         }
        //     });

        //     break;
        // }
    }

    hide() {
        this.listElement.style.opacity = '0';
    }

    show() {
        this.listElement.style.opacity = '1';
    }
}
