import { breakpoints } from "../../img-modules/styleguide";
import { IParamService, ParamService } from "./param.service";
import { screenSize } from "./screen.factory";
import {
  styleParentElement,
  createSideBar,
  createPopupElement,
  pageHeader,
  createSkipLink,
} from "./html.factory";
import { DataService, IDataService } from "./data.service";
import {
  switchTopic,
  toggleSubMenu,
  openMenu,
  closeMenu,
  setActiveMenuItem,
} from "./interaction.factory";
import { INavService, NavService, navItems } from "./nav.service";
import { Version } from "./types";
import { versions } from "../../pages/versions";

export interface IDashboardController {
  window: Window;
  params: IParamService;
  data: IDataService;
  nav: INavService;
  htmlContainer: HTMLScriptElement;
  close_btn: HTMLElement;
  open_btn: HTMLElement;
  _reloadHtml: () => void;
  call(update: boolean);
  switch: (topic: string, segment: string, isMobile: boolean) => void;
  switchVersion: (slug: string) => void;
  _toggleSubMenu: (slug: string, isMobile: boolean) => void;
  _screenListener: () => void;
}

const getScriptBaseUrl = () => {
  const scripts = document.getElementsByTagName('script');
  for (let script of scripts) {
    if (script.src.includes('dashboard') || script.src.includes('scaffold')) {
      return script.src.substring(0, script.src.lastIndexOf('/') + 1);
    }
  }
  return './';
};


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
    this.data = new DataService();
    this.nav = new NavService(this);
    this.init();
  }

  async init() {
    this.window = window;
    this.params.renew();
    this._reloadHtml();
    await this.call(false);
  }




  async call(update: boolean): Promise<void> {

    const BUNDLE_BASE = getScriptBaseUrl();
    this.htmlContainer.innerHTML = "";

    const getLeafNavItems = (items: any[]): any[] => {
      let leafItems = [];
      for (let item of items) {
        if (!item.sub || item.sub.length === 0) {
          // This is a leaf item (no sub-items)
          leafItems.push(item);
        } else {
          // This item has sub-items, so get leaf items from its children
          leafItems = leafItems.concat(getLeafNavItems(item.sub));
        }
      }
      return leafItems;
    };

    // Get flat array of all leaf nav items
    const navItemsArray = getLeafNavItems(navItems);

    let navItem = navItemsArray.find((i) => i.slug == this.params.topic);
    navItem = navItem == undefined ? navItems[0] : navItem;

    const pageTitle =
      this.params.language == "en" ? navItem.title_en : navItem.title;

    pageHeader(this, pageTitle, this.htmlContainer, this.params.version);

    // include version in bundle to be loaded !!!!!!

    await import(/*webpackIgnore: true*/ `${BUNDLE_BASE}${this.params.topic}.bundle.js`);
    // @ts-ignore
    const ctrlr = new window[this.params.topic](this);
    ctrlr.init(this.params.version);
    return;
  }

  switch(paramKey: string, paramValue: string, isMobile: boolean): void {
    if (isMobile) closeMenu();
    switchTopic(this, paramKey, paramValue, isMobile);
    if (isMobile) this._closeMenu();
  }

  switchVersion(slug: string): void {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("topic", "regelingen");
    currentParams.set("version", slug);
    const newurl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      currentParams.toString();

    window.history.pushState({ path: newurl }, "", newurl);

    this.data.clear();
    this.params.renew();
    // this._reloadHtml();

    this.call(false);
  }

  _toggleSubMenu(slug: string, isMobile: boolean): void {
    toggleSubMenu(slug, isMobile);
  }

  _reloadHtml(): void {
    const isMobile = window.innerWidth < breakpoints.lg ? true : false;

    this.htmlContainer = styleParentElement();

    [].slice
      .call(document.getElementsByTagName("aside"))
      .forEach((a) => a.remove());
    [].slice
      .call(document.getElementsByTagName("nav"))
      .forEach((a) => a.remove());

    let aside = createSideBar(this.htmlContainer);
    aside.appendChild(createSkipLink());
    if (isMobile) {
      aside.appendChild(this.nav.openButton());
      aside.appendChild(this.nav.create(true));
      aside.appendChild(this.nav.closeButton());
      this._armMenuButton();
    } else {
      aside.appendChild(this.nav.create(false));
    }
    setActiveMenuItem(this.params.topic, isMobile);
    createPopupElement();
  }

  _screenListener(): void {
    const self = this;
    const screen = screenSize(window.innerWidth);

    window.addEventListener(
      "resize",
      () => {
        let newScreen = screenSize(window.innerWidth);

        if (screen != newScreen) {
          setTimeout(() => {
            self._reloadHtml();
          }, 100);
        }
      },
      false,
    );
  }

  _armMenuButton() {
    this.close_btn = document.getElementById("mobile-menu-item-close");
    this.open_btn = document.getElementById("mobile-menu-item-open");

    this.open_btn.addEventListener("click", () => {
      this._openMenu();
    });

    this.close_btn.addEventListener("click", () => {
      this._closeMenu();
    });
  }

  _closeMenu() {
    closeMenu();
    if (window.innerWidth < breakpoints.lg) {
      this.close_btn.hidden = true;
      this.open_btn.hidden = false;
    }
  }

  _openMenu() {
    openMenu();
    if (window.innerWidth < breakpoints.lg) {
      this.close_btn.hidden = false;
      this.open_btn.hidden = true;
    }
  }
}
