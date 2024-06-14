import {colours} from "../../../img-modules/styleguide";

export class HtmlYearSelector {

    constructor(
        private element,
        private id: string
    ){
       
    }

    draw(segment) {

        let selectEl = document.getElementById(this.id);

        if(selectEl && selectEl.parentNode) { selectEl.parentNode.removeChild(selectEl) }

        let dropdown = document.createElement('select');
        dropdown.id = this.id;
        dropdown.style.alignSelf = 'flex-start';

        for ( let year of [2022,2021,2020,2019,2018]) {

            let option = document.createElement('option');
            option.label = year.toString();
            option.value = year.toString();
            option.innerText = year.toString();
            if (year === segment) { option.selected = true }
            dropdown.appendChild(option);  
        }

        this.element.appendChild(dropdown)

        return dropdown;
    }

    redraw() {
    }
}
