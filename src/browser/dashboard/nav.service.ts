import type { IDashboardController } from "./dashboard.controller";

export const navItems = [
  {
    slug: "regelingen",
    label: "Overzicht regelingen",
    label_en: "",
    title: "Regelingen",
    title_en: "",
  },
  {
    slug: "fysieke-schade",
    label: "Fysieke schade",
    label_en: "",
    title: "Fysieke schade",
    title_en: "",
    sub: [
      {
        slug: "fs_overzicht",
        label: "Overzicht",
        label_en: "",
        title: "Fysieke schade - overzicht",
        title_en: "",
      },
      {
        slug: "fs_maatwerk",
        label: "Maatwerk en herstel",
        label_en: "",
        title: "Fysieke schade - Maatwerk en herstel",
        title_en: "",
      },
      {
        slug: "fs_vaste_vergoeding",
        label: "Vaste vergoedingen",
        label_en: "",
        title: "Fysieke schade - Vaste vergoedingen",
        title_en: "",
      },
      // {
      //     slug: 'fs_daadwerkelijk_herstel',
      //     label: 'Herstel',
      //     label_en: "",
      //     title: 'Fysieke schade - Herstel',
      //     title_en: ""
      // },

      // {
      //     slug: 'fs_historie',
      //     label: 'Historie',
      //     label_en: "",
      //     title: 'Fysieke schade - Historie',
      //     title_en: ""
      // }
    ],
  },
  {
    slug: "immateriele-schade",
    label: "Immateriele schade",
    label_en: "",
    title: "Immateriele schade",
    title_en: "",
    sub: [
      {
        slug: "ims-overzicht",
        label: "Overzicht",
        label_en: "",
        title: "Immateriele schade - overzicht",
        title_en: "",
      },
      {
        slug: "ims-volwassenen",
        label: "Volwassenen",
        label_en: "",
        title: "Immateriele schade - volwassenen",
        title_en: "",
      },
      {
        slug: "ims-kinderen-jongeren",
        label: "Kinderen en Jongeren",
        label_en: "",
        title: "Immateriele schade - kinderen en jongeren",
        title_en: "",
      },
      // {
      //     slug: 'ims-herbeoordeling',
      //     label: 'Herbeoordeling',
      //     label_en: "",
      //     title: 'Immateriele schade - Herbeoordeling',
      //     title_en: ""
      // }
    ],
  },
  {
    slug: "waardedalingsregeling",
    label: "Waardedalingsregeling",
    label_en: "",
    title: "Waardedalingsregeling",
    title_en: "",
    sub: [
      {
        slug: "wd-overzicht",
        label: "Overzicht",
        label_en: "",
        title: "Waardedalingsregeling - overzicht",
        title_en: "",
      },
      {
        slug: "wd-wonen",
        label: "Woningen",
        label_en: "",
        title: "Waardedalingsregeling - Woningen",
        title_en: "",
      },
      {
        slug: "wd-nietwonen",
        label: "Niet woningen",
        label_en: "",
        title: "Waardedalingsregeling - Niet woningen",
        title_en: "",
      },
      {
        slug: "wd-namco",
        label: "NAM tegemoetkoming",
        label_en: "",
        title: "Waardedalingsregeling - NAM tegemoetkoming",
        title_en: "",
      },
    ],
  },
  {
    slug: "aos",
    label: "Acuut onveilige situaties",
    label_en: "",
    title: "Acuut onveilige situaties (AOS)",
    title_en: "",
  },
  {
    slug: "bezwaren",
    label: "Bezwaren",
    label_en: "",
    title: "Bezwaren",
    title_en: "",
  },
  {
    slug: "waardering",
    label: "Waardering",
    label_en: "",
    title: "Waardering",
    title_en: "",
  },
  {
    slug: "gemeente",
    label: "Per gemeente",
    label_en: "",
    title: "Data per gemeente",
    title_en: "",
  },
  {
    slug: "correcties",
    label: "Correcties",
    label_en: "Corrections",
    title: "Correcties",
    title_en: "Corrections",
  },
  {
    slug: "opendata",
    label: "Open data",
    label_en: "Open data",
    title: "Open data",
    title_en: "Open data",
  },
];

export interface INavService {
  items: any[];
  el: HTMLElement;
  ctrlr: IDashboardController;
  create: (isMobile: boolean) => HTMLElement;
  update: () => void;
  openButton: () => HTMLElement;
  closeButton: () => HTMLElement;
}

export class NavService implements INavService {
  items: any[];
  el: HTMLElement;

  constructor(public ctrlr: IDashboardController) {
    this.items = navItems;
  }

  li(i: any, isMobile: boolean, depth: number = 0): HTMLLIElement {
    const li = document.createElement("li");
    li.style.cursor = "pointer";
    li.setAttribute("data-slug", i.slug);
    li.setAttribute("data-depth", depth.toString());

    const a = document.createElement("a");
    a.href = "#";
    a.innerText = i.label;

    // Add indentation for deeper levels
    if (depth > 0) {
      a.style.paddingLeft = `${1 * 15}px`;
    }

    li.appendChild(a);

    if (i.sub === undefined || (i.sub !== undefined && i.sub.length < 1)) {
      if (i.slug === "opendata") {
        a.onclick = () =>
          window.open(
            "https://img.publikaan.nl/publieke-data/docs/",
            // window.location.protocol +
            //   "//" +
            //   window.location.host +
            //   "/open-data",
            "_blank",
          );
      } else {
        a.onclick = () => this.ctrlr.switch("topic", i.slug, isMobile);
      }
    } else {
      const chevron = document.createElement("span");
      chevron.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" x="0px" y="0px"><g><path d="M49.9873,24.8789,32.6724,40.6016a1,1,0,0,1-1.3448,0L14.0127,24.8789a1,1,0,0,1,1.3447-1.4805L32,38.5107,48.6426,23.3984a1,1,0,0,1,1.3447,1.4805Z"/></g></svg>';

      // Set initial rotation based on depth - sub-items should point right initially
      const svg = chevron.querySelector("svg");
      if (svg && depth > 0) {
        // svg.style.transform = "rotate(0deg)";
        svg.style.transition = "transform 0.2s ease";
      }

      a.appendChild(chevron);

      a.onclick = () => {
        if (i.sub.length > 0) {
          this.ctrlr._toggleSubMenu(i.slug, isMobile);
          // Only navigate to first item on desktop, not mobile
          if (!isMobile) {
            const firstClickable = this.findFirstClickableItem(i.sub);
            if (firstClickable) {
              this.ctrlr.switch("topic", firstClickable.slug, isMobile);
            }
          }
        }
      };

      li.setAttribute("aria-expanded", "false");
      li.setAttribute("aria-controls", "submenu-" + i.slug);
      li.setAttribute("aria-haspopup", "true");
    }

    return li;
  }

  // Helper method to find first item without sub-items
  findFirstClickableItem(items: any[]): any | null {
    for (const item of items) {
      if (!item.sub || item.sub.length === 0) {
        return item;
      } else {
        const found = this.findFirstClickableItem(item.sub);
        if (found) return found;
      }
    }
    return null;
  }

  // Recursive method to create nested sub-menus
  createSubMenu(
    items: any[],
    parentSlug: string,
    isMobile: boolean,
    depth: number = 1,
  ): HTMLUListElement {
    const subUl = document.createElement("ul");
    subUl.id = "submenu-" + parentSlug;
    subUl.hidden = true;
    subUl.role = "menu";
    subUl.setAttribute("data-depth", depth.toString());

    for (const item of items) {
      const subli = this.li(item, isMobile, depth);

      // If this sub-item has its own sub-items, create another level
      if (item.sub && item.sub.length > 0) {
        const nestedSubUl = this.createSubMenu(
          item.sub,
          item.slug,
          isMobile,
          depth + 1,
        );
        subli.appendChild(nestedSubUl);
      }

      subUl.appendChild(subli);
    }

    return subUl;
  }

  create(isMobile: boolean) {
    this.el = document.createElement("nav");
    this.el.classList.add("img_dasboard_nav");

    const ul = document.createElement("ul");
    ul.style.flexDirection = "column";
    const className = isMobile ? "dashboard_nav_mobile" : "dashboard_nav";
    ul.classList.add(className);
    if (isMobile) ul.hidden = true;

    for (const i of navItems) {
      const li: HTMLLIElement = this.li(i, isMobile, 0);

      if (i.sub && i.sub.length > 0) {
        const subUl = this.createSubMenu(i.sub, i.slug, isMobile, 1);
        li.appendChild(subUl);
      }

      ul.appendChild(li);
    }

    this.el.appendChild(ul);

    return this.el;
  }

  update() {
    const items = [].slice.call(this.el.querySelectorAll("li"));

    for (const item of items) {
      item.classList.remove("active");
      item.removeAttribute("aria-current");

      if (
        item.getAttribute("data-slug") === this.ctrlr.params.topic &&
        this.ctrlr.params.topic !== "company"
      ) {
        item.classList.add("active");
        item.setAttribute("aria-current", "page");
      }
    }
  }

  openButton(): HTMLElement {
    // let div = document.createElement('div');
    const button = document.createElement("button");
    const span = document.createElement("span");

    button.id = "mobile-menu-item-open";
    order: 1;
    button.classList.add("hamburger");
    button.setAttribute("aria-label", "Toon Navigatie Menu");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("tabindex", "0");

    span.classList.add("text");
    span.innerText = "Menu";
    button.appendChild(span);
    return button;
  }

  closeButton(): HTMLElement {
    const button = document.createElement("button");
    const span = document.createElement("span");

    button.id = "mobile-menu-item-close";
    button.hidden = true;
    button.classList.add("close");
    button.setAttribute("aria-label", "Toon Navigatie Menu");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("tabindex", "0");

    span.classList.add("text");
    span.innerText = "Menu";
    button.appendChild(span);
    return button;
  }
}
