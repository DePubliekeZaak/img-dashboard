import { colours } from "../../../img-modules/styleguide";
import { drop } from "lodash";
import { IParameterMapping } from "../interfaces";

export class HtmlMappingSelector {

    constructor(
        private ctrlr,
        private element,
        private id: string,
        private parameters: IParameterMapping[][]
    ){
       
    }

    draw(segment, index = 0) {

        let selectEl = document.getElementById(this.id + '_' + index);

        if(selectEl && selectEl.parentNode != null) { selectEl.parentNode.removeChild(selectEl) }

        let dropdown = document.createElement('select');
        dropdown.id = this.id + '_' + index;
        dropdown.style.alignSelf = 'flex-start';
        dropdown.style.maxWidth = '90vw';

        for ( let map of this.parameters[0]) {
            let option = document.createElement('option');
            option.label = this.ctrlr.page.main.params.language == 'en' ? map.label_en || "" : map.label.toLowerCase() || "";
            option.value = map.column;
            option.innerText = map.label.toLowerCase();
            if (map.column === segment) { option.selected = true }
            dropdown.appendChild(option);
        }
    
        this.element.appendChild(dropdown)   // insertBefore(dropdown,headerElement.nextSibling);

        return dropdown;

    }

    redraw() {
    }
}
