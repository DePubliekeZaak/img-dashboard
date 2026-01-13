import { breakpoints, colours } from "../../../img-modules/styleguide";
import { drop } from "lodash";
import { IParameterMapping } from "../interfaces";
import { slugify } from "../_helpers";

const specials = [
    "Alle specials", 
    "MKB",
    "Agro",
    "Erfgoed",
    "Overig",
];



export class HtmlSpecialsSelector {

    constructor(
        private ctrlr,
        private element,
        private id: string,
    ){
       
    }

    draw(segment, index = 0) {

        console.log("hi iam soo special")

        let selectEl = document.getElementById(this.id + '_' + index);

        if(selectEl && selectEl.parentNode != null) { selectEl.parentNode.removeChild(selectEl) }

        let label = document.createElement('label');
        label.id = this.id + '_label';
        label.innerText = "Kies een categorie";
        label.classList.add("hidden-label");
        label.setAttribute("for", this.id + "_el" + index);

        let dropdown = document.createElement('select');
        dropdown.id = this.id + '_' + index;
        dropdown.style.alignSelf = 'flex-start';
        dropdown.style.maxWidth = '90vw';
        dropdown.style.marginRight = (window.innerWidth > breakpoints.md) ? '1rem' : '.5rem';
        dropdown.setAttribute("aria-described-by",this.id + '_label');

        for (let special of specials) {

            let special_slug = slugify(special)

            let option = document.createElement('option');
            option.label = special;
            option.value = special_slug;
            option.innerText = special;
            if (segment.special === special_slug) { option.selected = true }
            dropdown.appendChild(option);
        }

        console.log(dropdown, this.element);
    
        this.element.appendChild(label);
        this.element.appendChild(dropdown);   // insertBefore(dropdown,headerElement.nextSibling);

        return dropdown;

    }

    redraw() {
    }
}
