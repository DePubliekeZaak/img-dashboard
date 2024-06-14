import { colours } from "../../../img-modules/styleguide";
import { drop } from "lodash";
import { IParameterMapping } from "../interfaces";
import { toDutchMonths } from "../_helpers";

export class HtmlMonthSelector {

    constructor(
        private ctrlr,
        private element,
        private id: string,
        private data: any[]
    ){
       
    }

    draw(segment, index = 0) {

        let selectEl = document.getElementById(this.id + '_' + index);

        if(selectEl && selectEl.parentNode != null) { selectEl.parentNode.removeChild(selectEl) }

        let dropdown = document.createElement('select');
        dropdown.id = this.id + '_' + index;
        dropdown.style.alignSelf = 'flex-start';
        dropdown.style.maxWidth = '90vw';

        let option = document.createElement('option');
            option.label = "Doorlopend";
            option.value = "all";
            option.innerText = "Doorlopend"
            if ("all" === segment) { option.selected = true }
            dropdown.appendChild(option);

        for ( let m of this.data) {
            let option = document.createElement('option');
            option.label = `${toDutchMonths(m._month)} - ${m._year}`
            option.value = m._yearmonth;
            option.innerText = `${m._month} + (${m._year})`
            if (m._yearmonth === segment) { option.selected = true }
            dropdown.appendChild(option);
        }
    
        this.element.appendChild(dropdown)   // insertBefore(dropdown,headerElement.nextSibling);

        return dropdown;

    }

    redraw() {
    }
}
