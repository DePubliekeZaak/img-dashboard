import type { Definitions } from "../shared/types_graphs";

export class HTMLDefinitions {
  container;
  table;
  thead;
  tbody;
  button;

  constructor(
    private ctrlr,
    private parentElement,
  ) {
    this.init();
  }

  init() {
    this.container =
      this.ctrlr.page.main.window.document.createElement("section");
    this.container.classList.add("graph-container-12");
    this.container.classList.add("definitions-view");
    this.container.classList.add("tabpanel");
    this.container.role = "tabpanel";
    this.container.id = "panel_" + this.ctrlr.slug + "__definitions";
    this.container.setAttribute(
      "aria-labelledby",
      "tab_" + this.ctrlr.slug + "__definitions",
    );

    this.parentElement.appendChild(this.container);
  }

  draw(defs: Definitions) {
    for (const def of defs) {
      const a = document.createElement("article");
      a.classList.add("definition");

      // let s = document.createElement('span');
      // s.innerText = 'GFS: ' + def.code;
      // a.append(s);

      const h = document.createElement("h4");
      h.innerText = def.name;
      a.append(h);

      const p = document.createElement("p");
      p.innerHTML = def.description;
      a.append(p);

      this.container.appendChild(a);
    }

    return true;
  }

  hide() {
    this.container.style.display = "none";
  }

  show() {
    this.container.style.display = "flex";
  }
}
