import { thousands } from "../_helpers";

const handleKeyDown = (event: KeyboardEvent, action: () => void) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
};

/**
 * Shared state: [periodActive, calcActive] stored on the scrolltainer element.
 * The four tables form a 2x2 grid:
 *   row=period (0=week, 1=month), col=calc (0=toename, 1=cumul)
 *   visibleIndex = period + calc * 2
 * Both togglers read the same state; each only writes its own slot.
 */
export function getState(scrolltainer: HTMLElement): number[] {
  let s = (scrolltainer as any)._tblState;
  if (!s) {
    s = [0, 0];
    (scrolltainer as any)._tblState = s;
  }
  return s;
}

function switcher(
  scrolltainer: HTMLElement,
  toggler: HTMLElement,
  option: any,
  togglerCount: number,
  index: number,
) {
  const state = getState(scrolltainer);
  state[togglerCount] = index; // store the active index for this toggler
  toggler.setAttribute("data-active", index.toString());

  const os = toggler.querySelectorAll(".toggler-option");
  os.forEach((el: any) => {
    el.classList.remove("active");
    el.setAttribute("aria-pressed", "false");
  });
  os[index].classList.add("active");
  os[index].setAttribute("aria-pressed", "false");

  const tables = scrolltainer.querySelectorAll("table");
  const tableIndex = state[0] + state[1] * 2; // row + col * 2

  tables.forEach((el: HTMLTableElement) => el.classList.add("hidden"));
  tables[tableIndex].classList.remove("hidden");

  // Announce change to screen readers
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = option.announcement;
  scrolltainer.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

export const createToggler = (
  document: any,
  scrolltainer: HTMLElement,
  toggleGroup: HTMLDivElement,
  active: number,
  options: any[],
  name: string,
  togglercount: number,
): HTMLElement => {
  const toggler = document.createElement("div");
  toggler.classList.add("toggler");
  toggler.setAttribute("role", "group");
  toggler.setAttribute("aria-label", name);
  toggler.setAttribute("data-active", String(active));

  const slider = document.createElement("div");
  slider.classList.add("toggler-slider");
  slider.setAttribute("aria-hidden", "true");
  toggler.appendChild(slider);

  const state = getState(scrolltainer);
  state[togglercount] = active; // initialise current toggler slot

  for (let i = 0; i < options.length; i++) {
    const option = document.createElement("button");
    option.classList.add("toggler-option");
    option.textContent = options[i].label;
    option.setAttribute("type", "button");
    option.setAttribute("aria-pressed", active === i ? "true" : "false");
    option.setAttribute("aria-label", options[i].label);
    option.setAttribute("aria-label", options[i].aria);
    option.setAttribute("tabindex", "0");
    if (active === i) option.classList.add("active");
    toggler.appendChild(option);

    option.addEventListener(
      "click",
      () => switcher(scrolltainer, toggler, options[i], togglercount, i),
    );
    option.addEventListener(
      "keydown",
      (e: any) =>
        handleKeyDown(e, () =>
          switcher(scrolltainer, toggler, options[i], togglercount, i),
        ),
    );
  }

  toggler.style.display = "none";
  toggleGroup.appendChild(toggler);

  return toggler;
};

export const createTable = (document: any, id: string, active: boolean) => {
  const table = document.createElement("table");
  table.setAttribute("id", id);

  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  table.appendChild(thead);
  table.appendChild(tbody);
  if (active) table.classList.add("hidden");

  return table;
};

export const populateTable = (
  document: any,
  tableData: any,
  tableEl: HTMLElement,
) => {
  if (tableEl == undefined) return;

  const thead = tableEl.querySelector("thead");
  const tbody = tableEl.querySelector("tbody");

  if (tableData.pre_headers) {
    const tr0 = document.createElement("tr");
    for (const h of tableData.pre_headers) {
      const th = document.createElement("th");
      th.colSpan = h.length;
      th.innerHTML = h.label;
      tr0.appendChild(th);
    }
    thead!.appendChild(tr0);
  }

  const trm = document.createElement("tr");
  if (tableData.headers && Array.isArray(tableData.headers)) {
    for (const column of tableData.headers) {
      const th = document.createElement("th");
      th.innerHTML = column;
      trm.appendChild(th);
    }
  }
  thead!.appendChild(trm);

  if (tableData.rows && Array.isArray(tableData.rows)) {
    for (const row of tableData.rows) {
      const tr = document.createElement("tr");
      let i = 0;
      if (Array.isArray(row)) {
        for (const value of row) {
          const td = document.createElement("td");
          let cellValue: string | number;
          if (typeof value === "number" && i > 0) {
            cellValue = isNaN(value) ? "-" : thousands(value);
          } else {
            cellValue = value;
          }
          td.innerHTML = cellValue;
          tr.appendChild(td);
          i++;
        }
      }
      tbody!.appendChild(tr);
    }
  }
};
