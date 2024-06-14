
import { breakpoints} from '../../img-modules/styleguide';
import { IParamService, ParamService } from './param.service';
import { screenSize } from './screen.factory';
import { styleParentElement, createSideBar, createMobileNav, createPopupElement, pageHeader } from './html.factory';
import { DataService, IDataService } from './data.service';
import { switchTopic, toggleSubMenu, openMenu, closeMenu, setActiveMenuItem } from './interaction.factory';
import { INavService, NavService, navItems } from './nav.service';

export interface IDashboardController {

    window: Window;
    params: IParamService;
    data: IDataService,
    nav: INavService;
    htmlContainer: HTMLScriptElement,
    close_btn: HTMLElement,
    open_btn: HTMLElement,
    _reloadHtml: () => void;
    call(update: boolean);
    switch: (topic: string, segment: string) => void;
    // switchLanguage: (lan: string) => void;
    _toggleSubMenu: (slug: string) => void
    _screenListener: () => void

}

export class DashboardController implements IDashboardController {

    params;
    data;
    nav;
    htmlContainer;
    window;
    close_btn;
    open_btn;
    loader;

    constructor() {

        this.params = new ParamService();
        this.data = new DataService()
        this.nav = new NavService(this);
        this.init();
    }

    async init() {

        this.window = window;   
        this.params.renew();
        this._reloadHtml();
        await this.call(false);
    }

    async call(update: boolean ): Promise<void> {

        this.htmlContainer.innerHTML = "";

        let navItemsArray = [];

        for (let navItem of navItems) {
            if (navItem.sub != undefined && navItem.sub.length > 0) {
                navItemsArray = navItemsArray.concat(navItem.sub)
            } else {
                navItemsArray.push(navItem)
            }
        }

        // console.log(navItems);

        let navItem = navItemsArray.find( i => i.slug == this.params.topic);
        navItem = (navItem == undefined) ? navItems[0] : navItem;
        const pageTitle = this.params.language == 'en' ? navItem.title_en : navItem.title;
       
        // console.log(pageTitle);
        pageHeader(pageTitle, this.htmlContainer);

        await import(/*webpackIgnore: true*/ `./${this.params.topic}.bundle.js`);
        // @ts-ignore
        const ctrlr = new window[this.params.topic](this);
        ctrlr.init();
        return;
    }

    switch(paramKey: string, paramValue: string) : void {

        closeMenu();
        switchTopic(this,paramKey,paramValue);
        this._closeMenu();
    }

    _toggleSubMenu(slug: string) : void {
        toggleSubMenu(slug);
    }

    _reloadHtml(): void {

        this.htmlContainer = styleParentElement();
    
        [].slice.call(document.getElementsByTagName("aside")).forEach( (a) => a.remove());
        [].slice.call(document.getElementsByTagName("nav")).forEach( (a) => a.remove());
    
        let aside = createSideBar(this.htmlContainer);
        aside.appendChild(this.nav.create());
        setActiveMenuItem(this.params.topic);    
        createPopupElement();
    }

    _screenListener(): void {

        const self = this;
        const screen = screenSize(window.innerWidth);
    
        window.addEventListener("resize", () =>  {
    
            let newScreen = screenSize(window.innerWidth);
    
            if ( screen != newScreen) {
                setTimeout(() => {
                    self._reloadHtml();
                }, 100);
            }
        }, false);
    }

    _armMenuButton() {

        this.close_btn = document.getElementById('mobile-menu-item-close')
        this.open_btn = document.getElementById('mobile-menu-item-open')

        this.open_btn.addEventListener( ("click"), () =>  {
            this._openMenu();
        })

        this.close_btn.addEventListener( ("click"), () =>  {
            this._closeMenu();
        })
    }

    _closeMenu() {

        closeMenu();
        if (window.innerWidth < breakpoints.lg) {
            this.close_btn.style.display = 'none'; 
            this.open_btn.style.display = 'block';
        }
    }

    _openMenu() {

        openMenu();
        if (window.innerWidth < breakpoints.lg) {
            this.close_btn.style.display = 'block';
            this.open_btn.style.display = 'none';
        }
    }
}
