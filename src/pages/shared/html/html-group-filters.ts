import { HtmlMonthSelector } from "./month-selector";
import { HtmlTotalvsRecentSelector } from "./total-recent-selector";
import { IGroupCtrlr } from "../interfaces";
import { Segment } from "../types";
import { segmentParse } from "../segment";
import { HtmlMappingGroupSelector } from "./mapping-group-selector";
import { HtmlMunicipalitySelector } from "./municipality-selector";
import { HtmlPeriodSelector } from "./period-selector";

export class HtmlGroupFilters {

    listElement;
    selector;
    companySelector;
    tableButton
    downloadButton;
    definitionsButton;
    hasListener = false;

    constructor(
        private ctrlr: IGroupCtrlr,
    ){
        this.init(undefined);
    }

    init(el: HTMLElement | undefined, place?: string) {

        const element = (el != undefined) ? el : this.ctrlr.groupWrapper

        if(element != null) {

            const prevElement = element.querySelector('.filter_list_group');

            if (prevElement) {
                prevElement.remove();
            }
            this.listElement = this.ctrlr.page.main.window.document.createElement('div');
            this.listElement.classList.add('filter_list_group');

            const ul = this.ctrlr.page.main.window.document.createElement('ul');

            this.listElement.appendChild(ul);

           //  element.insertBefore(this.listElement, element.querySelector('.tab_list'));

            element.querySelector('.source_attribution')?.after(this.listElement);
        }

        return true;

    }

    strip(s: string) {
            return s.replace(/_cumulatief$/, "");
    }

    draw(segment: string | Segment) {

        const self = this;

        const ul = this.listElement.querySelector('ul');
    
        if(this.ctrlr.config.filters != undefined) {
     
            for (const func of this.ctrlr.config.filters) {

                const li = this.ctrlr.page.main.window.document.createElement('li');
                
                let selectEl;

                switch (func) {

                    case 'totaalVsRecent': 

                        const _selector = new HtmlTotalvsRecentSelector(this.ctrlr, li, this.ctrlr.slug);
                        const _selectEl = _selector.draw(1);

                        _selectEl.addEventListener("change", () => {

                            const newSegment = {
                                key: _selectEl.value == "cumulative" ? this.strip(this.ctrlr.segment.key) + "_cumulatief": this.strip(this.ctrlr.segment.key),
                                cumulative: _selectEl.value == "cumulative" ? true : false,
                                periodization: this.ctrlr.page.segment.groups[this.ctrlr.slug].periodization
                            }

                            // if ( newSegment.key != self.ctrlr.segment.key || newSegment.cumulative != (self.ctrlr.config.segment as any).cumulative!) {
                      
                                this.ctrlr.page.segment.groups[this.ctrlr.slug] = newSegment;
                                self.ctrlr.update(this.ctrlr.page.main.data.collection(), undefined, true);
                            // }

                        });

                        break;

                    case "weekVsMonth": // fixed

                  
                             
                            const __selector = new HtmlPeriodSelector(
                                li,
                                this.ctrlr.slug,
                            );


                            let periodization = this.ctrlr.page.segment.groups[this.ctrlr.slug] ? this.ctrlr.page.segment.groups[this.ctrlr.slug].periodization : "monthly";
                            const __selectEl = __selector.draw(periodization);
                              
                    
                            if (__selectEl == null) break;
                
                            __selectEl.addEventListener("change", () => {
            
                                const newSegment = {
                                    key: this.ctrlr.page.segment.groups[this.ctrlr.slug].key,
                                    cumulative: this.ctrlr.page.segment.groups[this.ctrlr.slug].cumulative,
                                    periodization: __selectEl.value
                                }

                                console.log("ns", newSegment)
                                this.ctrlr.page.segment.groups[this.ctrlr.slug] = newSegment;
                                self.ctrlr.update(this.ctrlr.page.main.data.collection(), undefined, true);
                            //   }
                            // }
                            });
                    
                        break; 

                    case 'mappingSelect':

                        break;

                    case 'monthSelect':

                        const months = [];

                        const selector = new HtmlMonthSelector(this.ctrlr, li, this.ctrlr.slug, this.ctrlr.page.main.data.collection().graphDataMonth)
                        const selectEl = selector.draw(segment);

                        selectEl.addEventListener("change", () => {

                            if ( selectEl.value != self.ctrlr.segment.key) {
                                self.ctrlr.update(this.ctrlr.page.main.data.collection(), segmentParse(selectEl.value), true);
                            }
                        });

                        break;

                    case 'gemeente': 

                        // console.log("inside html group filter",this.ctrlr.page.segment)

                        const muniSelector = new HtmlMunicipalitySelector(this.ctrlr, li, this.ctrlr.slug);
                        const muniSelectEl = muniSelector.draw(this.ctrlr.page.segment, 1);

                        muniSelectEl.addEventListener("change", () => {

                        // const segment_key = (typeof this.ctrlr.segment === "string") ?  this.ctrlr.segment : this.ctrlr.segment.key;

                            if ( muniSelectEl.value != self.ctrlr.page.segment.gemeente) {


                                this.ctrlr.page.segment.gemeente = muniSelectEl.value

                                // const newSegment = {
                                //     key: self.ctrlr.segment.key,
                                //     cumulative: self.ctrlr.segment.cumulative,
                                //     periodization: self.ctrlr.segment.periodization,
                                //     gemeente: muniSelectEl.value
                                // }

                                // console.log(newSegment);

                                self.ctrlr.update(this.ctrlr.page.main.data.collection(), undefined, true);
                            }

                        });

                    break;

                   
                }

                ul.appendChild(li);
            }
        }
    }

    // post data retrieval 
    redraw(func: string) {

        let self = this;

    }

    hide() {
        this.listElement.style.opacity = '0';
    }

    show() {
        this.listElement.style.opacity = '1';
    }
}
