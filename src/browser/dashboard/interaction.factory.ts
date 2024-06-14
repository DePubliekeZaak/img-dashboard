import { breakpoints } from "../../img-modules/styleguide";
import { IDashboardController } from "./dashboard.controller";

export const switchTopic = (ctrlr: IDashboardController, paramKey: string, paramValue: string) : void => {

    let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?topic=' + paramValue;

    // if (ctrlr.params.language == 'en') {
    //     newurl = newurl + '&language=en';
    // }

    window.history.pushState({path:newurl},'',newurl);

    let popupElement = document.getElementById('eiti-dashboard_popup');
    if (popupElement != null) {
        popupElement.style.display = 'none';
    }
    let graphEls = [].slice.call(document.querySelectorAll('.graph-container, h2, .graph-wrapper'));
    for (let el of graphEls) {
        el.parentNode.removeChild(el);
    }

    ctrlr.params.renew();
   
    ctrlr.call(false);

    // if (window.innerWidth > breakpoints.md) {
    //     _updateMenuList(paramKey);
    // }

    setActiveMenuItem(paramValue);


    let mobileNav = document.querySelector('.mobile_nav_v2');
    if (mobileNav) {
        mobileNav.classList.remove('is-open');
        
    } 
    
    let mobileNavButton = document.querySelector('.img_dashboard_mobile_nav_button')
    if(mobileNavButton) {
        mobileNavButton.classList.remove('is-active');
        
    }
}

// export const switchLanguage = (ctrlr) => {


//     let newurl = location.protocol + "//" + window.location.host + window.location.pathname + window.location.search;
//     const combinator = window.location.search === '' ? "?" : "&";

//     const index = newurl.indexOf('language=');

//     if (index > -1) { 
//         newurl = newurl.slice(0, index - 1)
//     }

//     if(ctrlr.params.language == 'en') {
//         newurl = newurl + combinator + 'language=en'
//     } else {
//         newurl = newurl
//     }
    
//     window.history.pushState({path:newurl},'',newurl);
// }

export const openMenu = (): void => {
    document.getElementsByTagName('aside')[0].classList.add('is_open');
    document.getElementsByTagName("body")[0].style.position = "fixed";
}

export const closeMenu = (): void => {
    document.getElementsByTagName('aside')[0].classList.remove('is_open');
    document.getElementsByTagName("body")[0].style.position = "relative";
}

export const toggleSubMenu = (slug: string): void => {

    const parentLink = document.querySelector('ul.dashboard_nav li[data-slug=' + slug + '] a');
    parentLink.toggleAttribute("aria-expanded");

    const ul = document.querySelector('ul.dashboard_nav li ul#' + slug);
    if (ul !=  undefined) ul.classList.toggle('is_open');
}

export const setActiveMenuItem = (slug: string): void => {


    let lis = [].slice.call(document.querySelectorAll('ul.dashboard_nav a'));
    for (let l of lis) {
        l.classList.remove("active");
    }

    const navItem = document.querySelector('ul.dashboard_nav li[data-slug=' + slug + '] a');
    navItem.classList.add("active");
}

// export const armLanguageSelector = (ctrlr: IDashboardController) : void => {


//     let options: HTMLElement[] = [].slice.call(document.querySelectorAll("#language-selector li")); 
//     options.forEach( o => o.classList.remove('active'));

//     const activeIndex = (ctrlr.params.language == 'en') ? 1 : 0;
//     options[activeIndex].classList.add('active'); 

//     if(options == undefined) return;

//     for (const option of options) {

//         option.style.cursor = 'pointer';
//         option.onclick = () => {

//            options.forEach( o => o.classList.remove('active'));
//            option.classList.add('active');
//            ctrlr.switchLanguage(option.getAttribute('data-language'))
            
//         };
//     }
// }