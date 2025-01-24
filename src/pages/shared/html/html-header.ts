import { thousands } from "../_helpers";

export class HtmlHeader {

    headerElement;

    constructor(
        private dataCtrlr,
        private endpoints,
        private element,
        private header,
        private description
    ){}

    draw(currentData: any) {

        const prevHeaderElement = this.element.querySelector('.article_header') 
        // if (prevHeaderElement) prevHeaderElement.remove();

        this.headerElement = document.createElement('div');
        this.headerElement.classList.add('article_header');
        this.headerElement.style.position = 'relative';


        if(!this.element.classList.contains("graph-view")) {

      //      this.headerElement.style.borderTop = '2px solid rgb(230, 230, 230)';
            this.headerElement.style.paddingBottom = '2rem';
            this.headerElement.style.paddingTop = '2rem';

        }

        this.headerElement.style.width = 'calc(100% - 0px)';
        
        if(this.header) {

            let h = document.createElement('h3');
            h.innerText = this.header;
            this.headerElement.appendChild(h);
        }

        if(this.description) {

            let d = document.createElement('div');
            d.style.maxWidth = '640px';

            let p = document.createElement('p');
            p.innerHTML = this.description;

            d.style.color = 'white';
            // p.style.background = '#eee';

            d.appendChild(p);
            this.headerElement.appendChild(d);
        }

        this.element.appendChild(this.headerElement);
       return true;
    }

    redraw(currentData: any) {

        const hasPattern = /{(\w+)}/.test(this.description);
        const descEl = this.headerElement.querySelector('div');

        if (hasPattern) {
            const description = this.description.replace(/{(\w+)}/g, (_, key) => thousands(currentData[key]) || `{${key}}`);
            descEl.innerHTML = description;
        }

        if (descEl != null) {
            descEl.style.color = 'black';
            descEl.style.background = 'white';
        }
    }

    hide() {
        this.headerElement.style.opacity = '0';
    }

    show() {
        this.headerElement.style.opacity = '1';
    }
}
