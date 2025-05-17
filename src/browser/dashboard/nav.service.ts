import { IDashboardController } from "./dashboard.controller";
import members from "./members"
 
export const navItems = [

  
    {
        slug: 'regelingen',
        label: 'Overzicht regelingen',
        label_en: "",
        title: 'Regelingen',
        title_en: "",
    
    },
    {
        slug: 'fysieke-schade',
        label: 'Fysieke schade',
        label_en: "",
        title: 'Fysieke schade',
        title_en: "",
        sub: [
            {
                slug: 'fs_overzicht',
                label: 'Overzicht',
                label_en: "",
                title: 'Fysieke schade - overzicht',
                title_en: ""
            }, 
            {
                slug: 'fs_maatwerk',
                label: 'Maatwerk',
                label_en: "",
                title: 'Fysieke schade - Maatwerk',
                title_en: ""
            }, 
            {
                slug: 'fs_vaste_vergoeding',
                label: 'Vaste vergoeding',
                label_en: "",
                title: 'Fysieke schade - Vaste vergoeding',
                title_en: ""
            }, 
            // {
            //     slug: 'fs_daadwerkelijk_herstel',
            //     label: 'Herstel',
            //     label_en: "",
            //     title: 'Fysieke schade - Herstel',
            //     title_en: ""
            // }, 
            {
                slug: 'fs_aanvullende_vaste_vergoeding',
                label: 'Aanvullende vaste vergoeding',
                label_en: "",
                title: 'Fysieke schade - Aanvullende vergoeding',
                title_en: ""
            }, 
            {
                slug: 'fs_historie',
                label: 'Historie',
                label_en: "",
                title: 'Fysieke schade - Historie',
                title_en: ""
            }
        ]
    }, 
    {
        slug: 'immateriele-schade',
        label: 'Immateriele schade',
        label_en: "",
        title: 'Immateriele schade',
        title_en: "",
        sub: [
            {
                slug: 'ims-overzicht',
                label: 'Overzicht',
                label_en: "",
                title: 'Immateriele schade - overzicht',
                title_en: ""
            },
            {
                slug: 'ims-volwassenen',
                label: 'Volwassenen',
                label_en: "",
                title: 'Immateriele schade - volwassenen',
                title_en: ""
            },
            {
                slug: 'ims-kinderen-jongeren',
                label: 'Kinderen en Jongeren',
                label_en: "",
                title: 'Immateriele schade - kinderen en jongeren',
                title_en: ""
            },
            // {
            //     slug: 'ims-herbeoordeling',
            //     label: 'Herbeoordeling',
            //     label_en: "",
            //     title: 'Immateriele schade - Herbeoordeling',
            //     title_en: ""
            // }
        ]
    },
    {
        slug: 'waardedalingsregeling',
        label: 'Waardedalingsregeling',
        label_en: "",
        title: 'Waardedalingsregeling',
        title_en: ""
    }, 
    {
        slug: 'aos',
        label: 'Acuut onveilige situaties',
        label_en: "",
        title: 'Acuut onveilige situaties (AOS)',
        title_en: ""
    },  
    {
        slug: 'bezwaren',
        label: 'Bezwaren',
        label_en: "",
        title: 'Bezwaren',
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
        slug: 'gemeente',
        label: 'Per gemeente',
        label_en: "",
        title: 'Data per gemeente',
        title_en: ""
    }, 
    {
        slug: 'correcties',
        label: 'Correcties',
        label_en: 'Corrections',
        title: 'Correcties',
        title_en: 'Corrections'
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
    create: (isMobile: boolean) => HTMLElement,
    update: () => void,
    openButton: () => HTMLElement,
    closeButton: () => HTMLElement
}

export class NavService implements INavService {

    items: any[];
    el: HTMLElement;

    constructor(
        public ctrlr: IDashboardController
    ) {
        this.items = navItems;
    }

    li(i: any, isMobile: boolean) : HTMLLIElement {

        let li = document.createElement('li');
        li.style.cursor = 'pointer';
        li.setAttribute('data-slug', i.slug);
        let a = document.createElement('a');
        a.href = "#";
        a.innerText =  i.label;
        
        li.appendChild(a);

        if(i.sub == undefined || (i.sub != undefined && i.sub.length < 1)) {

            if (i.slug == 'opendata') {
                a.onclick = () =>  window.open(window.location.protocol + "//" + window.location.host + '/open-data','_blank')
            } else  {
                a.onclick = () => this.ctrlr.switch('topic',i.slug, isMobile);
            }
        } else {

            let chevron = document.createElement('span');
            chevron.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" x="0px" y="0px"><g><path d="M49.9873,24.8789,32.6724,40.6016a1,1,0,0,1-1.3448,0L14.0127,24.8789a1,1,0,0,1,1.3447-1.4805L32,38.5107,48.6426,23.3984a1,1,0,0,1,1.3447,1.4805Z"/></g></svg>';
            a.appendChild(chevron);
            a.onclick = () => {
                
                if (i.sub.length > 0)  {
                    this.ctrlr._toggleSubMenu(i.slug, isMobile)
                    this.ctrlr.switch('topic',i.sub[0].slug, isMobile);
                } 
            };

            li.setAttribute("aria-expanded","false");
            li.setAttribute("aria-controls", "submenu-" + i.slug);
            li.setAttribute("aria-haspopup","true");
        }

        return li;
    }

    create(isMobile: boolean) {

        this.el = document.createElement('nav');

        let ul = document.createElement('ul');
        ul.style.flexDirection = 'column';
        const className = isMobile ? 'dashboard_nav_mobile' : 'dashboard_nav';
        ul.classList.add(className);
        if(isMobile) ul.hidden = true;

        for (let i of navItems) {

            let li: HTMLLIElement = this.li(i, isMobile)

            if(i.sub && i.sub.length > 0) {

                let subUl = document.createElement('ul');
                subUl.id = "submenu-" + i.slug;
                subUl.hidden = true;
                subUl.role = "menu";

                for (let j of i.sub) {
                    let subli = this.li(j, isMobile);
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

    openButton () : HTMLElement {

        // let div = document.createElement('div');
        let button = document.createElement('button');
        let span = document.createElement('span');

        button.id = 'mobile-menu-item-open';order: 1;
        button.classList.add('hamburger');
        button.setAttribute('aria-label','Toon Navigatie Menu');
        button.setAttribute('aria-expanded','false');
        button.setAttribute('tabindex','0');

        span.classList.add('text');
        span.innerText = 'Menu';
        button.appendChild(span);
        return button
    }

    closeButton () : HTMLElement {

        let button = document.createElement('button');
        let span = document.createElement('span');

        button.id = 'mobile-menu-item-close';
        button.hidden = true;
        button.classList.add('close');
        button.setAttribute('aria-label','Toon Navigatie Menu');
        button.setAttribute('aria-expanded','false');
        button.setAttribute('tabindex','0');

        span.classList.add('text');
        span.innerText = 'Menu';
        button.appendChild(span);
        return button

    }
}