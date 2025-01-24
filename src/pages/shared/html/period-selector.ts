import { colours } from "../../../img-modules/styleguide";
import { drop } from "lodash";
import { IParameterMapping } from "../interfaces";
import { toDutchMonths } from "../_helpers";

export class HtmlPeriodSelector {

    constructor(
        private ctrlr,
        private element,
        private id: string,
        private data: any[]
    ){
       
    }

    draw(segment, index = 0) {

        let selectEl = document.getElementById(this.id + '_period_' + index);

        if(selectEl && selectEl.parentNode != null) { selectEl.parentNode.removeChild(selectEl) }

        let label = document.createElement('label');
        label.id = this.id + '_label';
        label.innerText = "Kies data per week of per maand";
        label.classList.add("hidden-label");
        label.setAttribute("for", this.id + "_el" + index);

        let dropdown = document.createElement('select');
        dropdown.id = this.id + '_period_' + index;
        dropdown.style.alignSelf = 'flex-start';
        dropdown.style.maxWidth = '90vw';
        dropdown.setAttribute("aria-described-by",this.id + '_label')

        let option = document.createElement('option');
            option.label = "maand";
            option.value = "monthly";
            option.innerText = "maand"
            if ("monthly" === segment) { option.selected = true }
            dropdown.appendChild(option);

        option = document.createElement('option');
            option.label = "week";
            option.value = "weekly";
            option.innerText = "week"
            if ("weekly" === segment) { option.selected = true }
            dropdown.appendChild(option);
        
    
        this.element.appendChild(label) 
        this.element.appendChild(dropdown)   // insertBefore(dropdown,headerElement.nextSibling);

        return dropdown;

    }

    redraw() {
    }
}
