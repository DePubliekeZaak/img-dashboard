import { breakpoints, colours } from "../../../img-modules/styleguide";
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

        let selectEl = document.getElementById(this.id + '_mapping_' + index);

        if(selectEl && selectEl.parentNode != null) { selectEl.parentNode.removeChild(selectEl) }

        let label = document.createElement('label');
        label.id = this.id + '_label';
        label.innerText = "Kies voor een datapunt";
        label.classList.add("hidden-label");
        label.setAttribute("for", this.id + "_el" + index);

        let dropdown = document.createElement('select');
        dropdown.id = this.id + '_mapping_' + index;
        dropdown.style.alignSelf = 'flex-start';
        dropdown.style.maxWidth = '90vw';
        dropdown.style.marginRight = (window.innerWidth > breakpoints.md) ? '1rem' : '.5rem';
        dropdown.setAttribute("aria-described-by",this.id + '_label')


        for ( let map of this.parameters[0]) {
            let option = document.createElement('option');
            option.label = this.ctrlr.page.main.params.language == 'en' ? map.label_en || "" : map.label.toLowerCase() || "";
            option.value = map.column;
            option.innerText = map.label.toLowerCase();
            if (map.column === segment) { option.selected = true }
            dropdown.appendChild(option);
        }
    
        this.element.appendChild(label) 
        this.element.appendChild(dropdown)   // insertBefore(dropdown,headerElement.nextSibling);

        return dropdown;

    }

    redraw() {
    }
}
