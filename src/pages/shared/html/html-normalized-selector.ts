import { colours } from "../../../img-modules/styleguide";
import { drop } from "lodash";
import { IParameterMapping } from "../interfaces";
import { toDutchMonths } from "../_helpers";

export class HtmlNormalizedSelector {

    constructor(
        private ctrlr,
        private element,
        private id: string,
        private data: any[]
    ){
       
    }

    draw(segment, index = 0) {

        let selectEl = document.getElementById(this.id + '_normalized_' + index);

        if(selectEl && selectEl.parentNode != null) { selectEl.parentNode.removeChild(selectEl) }

        let label = document.createElement('label');
        label.id = this.id + '_label';
        label.innerText = "Kies absolute waardes of genormaliseerde waardes";
        label.classList.add("hidden-label");
        label.setAttribute("for", this.id + "_el" + index);

        let dropdown = document.createElement('select');
        dropdown.id = this.id + '_normalized_' + index;
        dropdown.style.alignSelf = 'flex-start';
        dropdown.style.maxWidth = '90vw';
        dropdown.style.marginRight = '1rem';
        dropdown.setAttribute("aria-described-by",this.id + '_label')

        let option = document.createElement('option');
            option.label = "absolute waardes";
            option.value = "absolute";
            option.innerText = "absolute waardes"
            if ("absolute" === segment) { option.selected = true }
            dropdown.appendChild(option);

        option = document.createElement('option');
            option.label = "genormaliseerde waardes";
            option.value = "normalized";
            option.innerText = "genormaliseerde waardes"
            if ("normalized" === segment) { option.selected = true }
            dropdown.appendChild(option);
        
    
        this.element.appendChild(label) 
        this.element.appendChild(dropdown)   // insertBefore(dropdown,headerElement.nextSibling);

        return dropdown;

    }

    redraw() {
    }
}
