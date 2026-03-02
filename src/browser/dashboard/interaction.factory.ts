import type { IDashboardController } from "./dashboard.controller";

export const switchTopic = (
  ctrlr: IDashboardController,
  paramKey: string,
  paramValue: string,
  isMobile: boolean,
): void => {
  // Close all open sub-menus before switching
  closeAllSubMenus(isMobile);

  const currentParams = new URLSearchParams(window.location.search);
  currentParams.set("topic", paramValue);
  const newurl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    "?" +
    currentParams.toString();

  window.history.pushState({ path: newurl }, "", newurl);

  const popupElement = document.getElementById("eiti-dashboard_popup");
  if (popupElement !== null) {
    popupElement.style.display = "none";
  }
  const graphEls = [].slice.call(
    document.querySelectorAll(
      ".graph-container, h2.img_dashboard, .graph-wrapper",
    ),
  );
  for (const el of graphEls) {
    el.parentNode.removeChild(el);
  }

  ctrlr.params.renew();
  ctrlr.call(false);

  setActiveMenuItem(paramValue, isMobile);

  const mobileNav = document.querySelector(".mobile_nav_v2");
  if (mobileNav) {
    mobileNav.classList.remove("is-open");
  }

  const mobileNavButton = document.querySelector(
    ".img_dashboard_mobile_nav_button",
  );
  if (mobileNavButton) {
    mobileNavButton.classList.remove("is-active");
  }
};

export const openMenu = (): void => {
  (document.querySelector("ul.dashboard_nav_mobile") as HTMLElement).hidden =
    false;
  document.getElementsByTagName("body")[0].style.position = "fixed";
};

export const closeMenu = (): void => {
  (document.querySelector("ul.dashboard_nav_mobile") as HTMLElement).hidden =
    true;
  document.getElementsByTagName("body")[0].style.position = "relative";
};

export const toggleSubMenu = (slug: string, isMobile: boolean): void => {
  const parentLi = isMobile
    ? document.querySelector(
        "ul.dashboard_nav_mobile li[data-slug=" + slug + "]",
      )
    : document.querySelector("ul.dashboard_nav li[data-slug=" + slug + "]");

  if (!parentLi) return;

  const expanded = parentLi.getAttribute("aria-expanded") === "true" || false;
  parentLi.setAttribute("aria-expanded", expanded ? "false" : "true");
  const submenu = document.getElementById(
    parentLi.getAttribute("aria-controls"),
  );

  if (!submenu) return;

  // Find the chevron icon in the parent link
  const chevron = parentLi.querySelector("a > span > svg") as HTMLElement;

  if (!expanded) {
    submenu.removeAttribute("hidden");
    const firstLink = submenu.querySelector("a");
    if (firstLink) firstLink.focus();

    // Rotate chevron to indicate open state
    if (chevron) {
      const parentDepth = parseInt(parentLi.getAttribute("data-depth") || "0");
      if (parentDepth === 0) {
        // Top level: rotate from down to up
        chevron.style.transform = "rotate(180deg)";
      } else {
        // Sub levels: rotate from right to down
        chevron.style.transform = "rotate(180deg)";
      }
      chevron.style.transition = "transform 0.2s ease";
    }
  } else {
    submenu.setAttribute("hidden", "");

    // Reset chevron rotation
    if (chevron) {
      const parentDepth = parseInt(parentLi.getAttribute("data-depth") || "0");
      if (parentDepth === 0) {
        // Top level: back to pointing down
        chevron.style.transform = "rotate(0deg)";
      } else {
        // Sub levels: back to pointing right
        chevron.style.transform = "rotate(-180deg)";
      }
    }

    // Also close any nested sub-menus when closing parent
    const nestedMenus = submenu.querySelectorAll('ul[id^="submenu-"]');
    nestedMenus.forEach((menu) => {
      menu.setAttribute("hidden", "");
      const parentItem = menu.parentElement;
      if (parentItem) {
        parentItem.setAttribute("aria-expanded", "false");
        // Reset nested chevrons too
        const nestedChevron = parentItem.querySelector(
          "a span svg",
        ) as HTMLElement;
        if (nestedChevron) {
          const nestedDepth = parseInt(
            parentItem.getAttribute("data-depth") || "0",
          );
          if (nestedDepth === 0) {
            nestedChevron.style.transform = "rotate(0deg)";
          } else {
            nestedChevron.style.transform = "rotate(-180deg)";
          }
        }
      }
    });
  }
};

export const openSubMenu = (slug: string, isMobile: boolean): void => {
  const parentLi = isMobile
    ? document.querySelector(
        "ul.dashboard_nav_mobile li[data-slug=" + slug + "]",
      )
    : document.querySelector("ul.dashboard_nav li[data-slug=" + slug + "]");

  const expanded = parentLi.getAttribute("aria-expanded") === "true" || false;
  parentLi.setAttribute("aria-expanded", expanded ? "false" : "true");
  const submenu = document.getElementById(
    parentLi.getAttribute("aria-controls"),
  );

  if (!expanded) {
    submenu.removeAttribute("hidden");
    submenu.querySelector("a").focus(); // Set focus to the first submenu item
  } else {
    submenu.setAttribute("hidden", "");
  }
};

export const setActiveMenuItem = (slug: string, isMobile: boolean): void => {
  const className = isMobile ? "dashboard_nav_mobile" : "dashboard_nav";
  const lis = [].slice.call(
    document.querySelectorAll("ul." + className + " li a"),
  );

  for (const l of lis) {
    l.classList.remove("active");
  }

  const navItem = document.querySelector(
    "ul." + className + " li[data-slug=" + slug + "] a",
  );
  if (navItem) {
    navItem.classList.add("active");

    // Open parent menus if this item is nested
    let currentElement = navItem.parentElement;
    while (currentElement) {
      // Check if this is a sub-menu item
      if (
        currentElement.parentElement &&
        currentElement.parentElement.id &&
        currentElement.parentElement.id.includes("submenu")
      ) {
        const parentLi = currentElement.parentElement.parentElement;
        if (parentLi && parentLi.getAttribute("aria-controls")) {
          parentLi.setAttribute("aria-expanded", "true");
          const submenu = document.getElementById(
            parentLi.getAttribute("aria-controls"),
          );
          if (submenu) {
            submenu.removeAttribute("hidden");
          }
        }
      }
      currentElement = currentElement.parentElement;
    }
  }
};

export const closeAllSubMenus = (isMobile: boolean): void => {
  const className = isMobile ? "dashboard_nav_mobile" : "dashboard_nav";

  // Find all sub-menus (at any level)
  const allSubMenus = document.querySelectorAll(
    `ul.${className} ul[id^="submenu-"]`,
  );

  // Close all sub-menus
  allSubMenus.forEach((submenu) => {
    submenu.setAttribute("hidden", "");
  });

  // Reset aria-expanded on all parent items AND reset chevron rotation
  const allParentItems = document.querySelectorAll(
    `ul.${className} li[aria-expanded]`,
  );
  allParentItems.forEach((item) => {
    item.setAttribute("aria-expanded", "false");
    // Reset chevron rotation based on depth
    const chevron = item.querySelector("a span svg") as HTMLElement;
    if (chevron) {
      const depth = parseInt(item.getAttribute("data-depth") || "0");
      if (depth === 0) {
        chevron.style.transform = "rotate(0deg)"; // Top level points down
      } else {
        chevron.style.transform = "rotate(-180deg)"; // Sub levels point right
      }
    }
  });
};
