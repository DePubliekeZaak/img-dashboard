import { breakpoints, colours } from "../../../img-modules/styleguide";
import { drop } from "lodash";
import { IParameterMapping } from "../interfaces";

export class HtmlMappingGroupSelector {

    constructor(
        private ctrlr,
        private element,
        private id: string,
        private parameters: IParameterMapping[][]
    ){
       
    }

    draw(index = 0) {

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

        this.parameters.forEach( (group: any, i: number) => {

            let label = "";

            switch (group[0].column.split("_")[1]) {

                case "meldingen": 
                    label = "meldingen en aanvragen"
                break;
                case "aanvragen": 
                    label = "meldingen en aanvragen"
                break;
                case "afgehandeld": 
                    label = "afgehandeld"
                break;
                case "uitgekeerd": 
                    label = "totaal verleend"
                break;
            }

            let option = document.createElement('option');
            option.label = label;
            option.value = i.toString();
            option.innerText =  label;
            if (group[0].column === this.ctrlr.page.segment.key) { option.selected = true }
            dropdown.appendChild(option);
        });
    
        this.element.appendChild(label) 
        this.element.appendChild(dropdown)   // insertBefore(dropdown,headerElement.nextSibling);

        return dropdown;

    }

    redraw() {
    }
}
