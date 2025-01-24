import { breakpoints, colours } from "../../../img-modules/styleguide";
import { drop } from "lodash";
import { IParameterMapping } from "../interfaces";
import { slugify } from "../_helpers";

const munis = [
    "Groningen", 
    "Midden-Groningen",
    "Eemsdelta",
    "Het Hogeland",
    "Oldambt",
    "Westerkwartier",
    "Veendam",
    "Tynaarlo",
    "Noordenveld",
    "Pekela",
    "Aa En Hunze",
    "Westerwolde",
    "Stadskanaal",
    "Noardeast-Fryslan",
    "Ooststellingwerf",
    "Achtkarspelen",
    "Midden-Drenthe"


];

munis.sort();

export class HtmlMunicipalitySelector {

    constructor(
        private ctrlr,
        private element,
        private id: string,
    ){
       
    }

    draw(segment, index = 0) {

        let selectEl = document.getElementById(this.id + '_' + index);

        if(selectEl && selectEl.parentNode != null) { selectEl.parentNode.removeChild(selectEl) }

        let label = document.createElement('label');
        label.id = this.id + '_label';
        label.innerText = "Kies een gemeente";
        label.classList.add("hidden-label");
        label.setAttribute("for", this.id + "_el" + index);

        let dropdown = document.createElement('select');
        dropdown.id = this.id + '_' + index;
        dropdown.style.alignSelf = 'flex-start';
        dropdown.style.maxWidth = '90vw';
        dropdown.style.marginRight = (window.innerWidth > breakpoints.md) ? '1rem' : '.5rem';
        dropdown.setAttribute("aria-described-by",this.id + '_label');

        for (let muni of munis) {

            let option = document.createElement('option');
            option.label = muni;
            option.value = muni;
            option.innerText = muni;
            if (segment.gemeente === muni) { option.selected = true }
            dropdown.appendChild(option);
        }
    
        this.element.appendChild(label);
        this.element.appendChild(dropdown);   // insertBefore(dropdown,headerElement.nextSibling);

        return dropdown;

    }

    redraw() {
    }
}
