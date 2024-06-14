import { IDashboardController } from "./dashboard.controller";
import members from "./members"
 
export const navItems = [

    {
        slug: 'actueel',
        label: 'Actueel',
        label_en: "",
        title: 'Actueel',
        title_en: "",
    
    },  
    {
        slug: 'aos',
        label: 'Acuut onveilige situaties',
        label_en: "",
        title: 'Acuut onveilige situaties (AOS)',
        title_en: ""
    }, 
    {
        slug: 'historie',
        label: 'Overzicht regelingen',
        label_en: "",
        title: 'Historie',
        title_en: "",
    
    },
    {
        slug: 'nieuw-beleid',
        label: 'Fysieke schade',
        label_en: "",
        title: 'Fysieke schade vanaf 2024',
        title_en: "",
    }, 
    {
        slug: 'immateriele-schade',
        label: 'Immateriele schade',
        label_en: "",
        title: 'Immateriele schade',
        title_en: ""
    }, 
    {
        slug: 'waardedalingsgregeling',
        label: 'Waardedalingsregeling',
        label_en: "",
        title: 'Waardedalingsregeling',
        title_en: ""
    },  
    {
        slug: 'fysieke-schade',
        label: 'Fysieke schade (2018-2023)',
        label_en: "",
        title: 'Fysieke schade',
        title_en: "",
        sub: [
            {
                slug: 'schademeldingen',
                label: 'Schademeldingen',
                label_en: "",
                title: 'Voor 2014: schademeldingen',
                title_en: ""
            }, 
            {
                slug: 'vergoedingen',
                label: 'Vergoedingen',
                label_en: "",
                title: 'Fysieke schade: vergoedingen',
                title_en: ""
            },  
            {
                slug: 'besluiten',
                label: 'Besluiten',
                label_en: "",
                title: 'Fysieke schade: besluiten',
                title_en: ""
            },
            {
                slug: 'duur',
                label: 'Duur',
                label_en: "",
                title: 'Fysieke schade: duur',
                title_en: ""
            }, 
        ]
    }, 
    {
        slug: 'historie-bezwaren',
        label: 'Bezwaren',
        label_en: "",
        title: 'Historie - bezwaren',
        title_en: ""
    },
    {
        slug: 'waardering',
        label: 'Waardering',
        label_en: "",
        title: 'Waardering',
        title_en: ""
    },  
    {
        slug: 'opendata',
        label: 'Open data',
        label_en: 'Open data',
        title: 'Open data',
        title_en: 'Open data'
    }

];

export interface INavService {

    items: any[],
    el: HTMLElement,
    ctrlr: IDashboardController,
    create: () => HTMLElement,
    update: () => void
}

export class NavService implements INavService {

    items: any[];
    el: HTMLElement;

    constructor(
        public ctrlr: IDashboardController
    ) {
        this.items = navItems;
    }

    li(i: any) : HTMLLIElement {

        let li = document.createElement('li');
        li.style.cursor = 'pointer';
        li.setAttribute('data-slug', i.slug);
        let a = document.createElement('a');
        a.href = "#";
        a.innerText =  i.label;
        
        
        li.appendChild(a);

        if(i.sub == undefined || (i.sub != undefined && i.sub.length < 1)) {

            a.setAttribute("aria-expanded","false");

            if (i.slug == 'opendata') {
                a.onclick = () =>  window.open(window.location.protocol + "//" + window.location.host + '/open-data','_blank')
            } else  {
                a.onclick = () => this.ctrlr.switch('topic',i.slug);
            }
        } else {

            let chevron = document.createElement('span');
            chevron.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" x="0px" y="0px"><g><path d="M49.9873,24.8789,32.6724,40.6016a1,1,0,0,1-1.3448,0L14.0127,24.8789a1,1,0,0,1,1.3447-1.4805L32,38.5107,48.6426,23.3984a1,1,0,0,1,1.3447,1.4805Z"/></g></svg>';
            // let u = document.createElement('use');
            // u.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#icon-chevron-down-small');
            // chevron.appendChild(u);
            // chevron.classList.add("icon","icon-chevron-down-small","w-5","h-5","flex-shrink-0","text-xs","max-md:-rotate-90","md:group-open:rotate-180","duration-300","mr-0","will-change-auto","mr-0");
            a.appendChild(chevron);
            a.onclick = () => this.ctrlr._toggleSubMenu(i.slug);
        }

        return li;
    }

    create() {

        this.el = document.createElement('nav');

        let ul = document.createElement('ul');
        ul.style.flexDirection = 'column';
        ul.classList.add('dashboard_nav');

        for (let i of navItems) {

            let li: HTMLLIElement = this.li(i)

            if(i.sub && i.sub.length > 0) {

                let subUl = document.createElement('ul');
                subUl.id = i.slug;

                for (let j of i.sub) {
                    let subli = this.li(j);
                    subUl.appendChild(subli);
                }

                li.appendChild(subUl);

            } 
            
            ul.appendChild(li);
        }

        this.el.appendChild(ul);

        return this.el;
    }

    update() {

        const items = [].slice.call(this.el.querySelectorAll('li'));

        for (let item of items) {

            item.classList.remove('active');
            item.removeAttribute('aria-current');

            if (item.getAttribute('data-slug') == this.ctrlr.params.topic && this.ctrlr.params.topic !== 'company') {
                item.classList.add('active');
                item.setAttribute('aria-current', 'page');
            }
        }
   
    }
}