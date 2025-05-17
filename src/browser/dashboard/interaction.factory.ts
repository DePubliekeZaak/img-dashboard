import { IDashboardController } from "./dashboard.controller";

export const switchTopic = (ctrlr: IDashboardController, paramKey: string, paramValue: string, isMobile: boolean) : void => {

    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('topic', paramValue);
    const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + currentParams.toString();

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

    setActiveMenuItem(paramValue, isMobile);

    let mobileNav = document.querySelector('.mobile_nav_v2');
    if (mobileNav) {
        mobileNav.classList.remove('is-open');
    } 
    
    let mobileNavButton = document.querySelector('.img_dashboard_mobile_nav_button')
    if(mobileNavButton) {
        mobileNavButton.classList.remove('is-active'); 
    }
}

export const openMenu = (): void => {
    (document.querySelector('ul.dashboard_nav_mobile') as HTMLElement).hidden = false;
    document.getElementsByTagName("body")[0].style.position = "fixed";
}

export const closeMenu = (): void => {
    (document.querySelector('ul.dashboard_nav_mobile') as HTMLElement).hidden = true;
    document.getElementsByTagName("body")[0].style.position = "relative";
}


export const toggleSubMenu = (slug: string, isMobile: boolean): void => {

    const parentLi = isMobile ? document.querySelector('ul.dashboard_nav_mobile li[data-slug=' + slug + ']') : document.querySelector('ul.dashboard_nav li[data-slug=' + slug + ']');

    const expanded = parentLi.getAttribute('aria-expanded') === 'true' || false;
    parentLi.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    const submenu = document.getElementById(parentLi.getAttribute('aria-controls'));

    if (!expanded) {
      submenu.removeAttribute('hidden');
      submenu.querySelector('a').focus(); // Set focus to the first submenu item
    } else {
      submenu.setAttribute('hidden', '');
    }
}




export const openSubMenu = (slug: string, isMobile: boolean): void => {

    const parentLi = isMobile ? document.querySelector('ul.dashboard_nav_mobile li[data-slug=' + slug + ']') : document.querySelector('ul.dashboard_nav li[data-slug=' + slug + ']');

    const expanded = parentLi.getAttribute('aria-expanded') === 'true' || false;
    parentLi.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    const submenu = document.getElementById(parentLi.getAttribute('aria-controls'));

    if (!expanded) {
      submenu.removeAttribute('hidden');
      submenu.querySelector('a').focus(); // Set focus to the first submenu item
    } else {
      submenu.setAttribute('hidden', '');
    }
}

export const setActiveMenuItem = (slug: string, isMobile: boolean): void => {

    let className = isMobile ? 'dashboard_nav_mobile' : 'dashboard_nav';
    let lis = [].slice.call(document.querySelectorAll('ul.' + className + ' li a'));

    for (let l of lis) {
        l.classList.remove("active");
    }

    const navItem = document.querySelector('ul.' + className + ' li[data-slug=' + slug + '] a');
    navItem.classList.add("active");

    if (navItem.parentElement.parentElement.id && navItem.parentElement.parentElement.id.includes('submenu')) {
        let parentLi = navItem.parentElement.parentElement.parentElement;
        parentLi.setAttribute('aria-expanded', 'true');
        const submenu = document.getElementById(parentLi.getAttribute('aria-controls'));
        submenu.removeAttribute('hidden');

    }
}
