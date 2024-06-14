import { colours } from "../../../img-modules/styleguide";
import { drop } from "lodash";
import { IParameterMapping } from "../interfaces";

export class HtmlTotalvsRecentSelector {

    constructor(
        private ctrlr,
        private element,
        private id: string,
    ){
       
    }

    draw(segment, index = 0) {

        let selectEl = document.getElementById(this.id + '_' + index);

        if(selectEl && selectEl.parentNode != null) { selectEl.parentNode.removeChild(selectEl) }

        let dropdown = document.createElement('select');
        dropdown.id = this.id + '_' + index;
        dropdown.style.alignSelf = 'flex-start';
        dropdown.style.maxWidth = '90vw';


        let option_1 = document.createElement('option');
        option_1.label = "Doorlopend"
        option_1.value = "doorlopend";
        option_1.innerText = "Doorlopend"
        if ("doorlopend" === segment) { option_1.selected = true }
        dropdown.appendChild(option_1);

        let option_2 = document.createElement('option');
        option_2.label = "Afgelopen week"
        option_2.value = "recent";
        option_2.innerText = "Afgelopen week"
        if ("doorlopend" !== segment) { option_2.selected = true }
        dropdown.appendChild(option_2);
    
    
        this.element.appendChild(dropdown)   // insertBefore(dropdown,headerElement.nextSibling);

        return dropdown;

    }

    redraw() {
    }
}
