import { switchTopic } from "./interaction.factory";
import { IDashboardController } from "./dashboard.controller";
import { IGraphMapping } from "../../charts/core/types";
import members from "./members";
import { breakpoints } from "../../img-modules/styleguide";
import { Version } from "./types";

export const styleParentElement = (): Element | null => {
  const htmlContainer = document.querySelector(
    "[img-graph-preset='dashboard'], [data-img-graph-preset='dashboard']"
  );
  htmlContainer.id = "dashboard-main";

  if (htmlContainer != undefined) {
    const parentEl = htmlContainer.parentElement;
    if (parentEl != undefined) {
      parentEl.classList.add("container");
      parentEl.style.display = "flex";
      parentEl.style.flexDirection =
        window.innerWidth < breakpoints.lg ? "column" : "row";
      parentEl.style.justifyContent = "flex-start";
      parentEl.style.alignItems = "flex-start";
    }
  }

  return htmlContainer;
};

export const createSideBar = (container: HTMLElement): HTMLElement => {
  container.classList.add("has_sidebar");
  let aside = document.createElement("aside");
  aside.classList.add("selectors");
  aside.style.opacity = "0";
  if (container.parentElement != null)
    container.parentElement.insertBefore(
      aside,
      document.querySelector("[img-graph-preset='dashboard'], [data-img-graph-preset='dashboard']"),
    );
  return aside;
};

export const createSkipLink = (): HTMLElement => {
  let skipLink = document.createElement("a");
  skipLink.classList.add("skip");
  skipLink.setAttribute("href", "#dashboard-main");
  skipLink.innerText = "Direct naar hoofdinhoud";
  return skipLink;
};

export const createPopupElement = (): void => {
  const id = "img-dashboard_popup";

  if (!document.getElementById(id)) {
    let popup = document.createElement("div");
    popup.id = id;
    document.getElementsByTagName("body")[0].appendChild(popup);
  }
};

export const pageHeader = (
  ctrlr: IDashboardController,
  topic: string,
  container: HTMLElement,
  version: Version,
): void => {
  let prevBC = document.querySelector("div.page_header");
  if (prevBC) {
    prevBC.remove();
  }

  let h = document.createElement("div");
  h.classList.add("page_header");

  let v = document.createElement("div");
  v.classList.add("versie");
  v.innerText = version.name;
  v.addEventListener("click", () => {
    // window.location.reload();
    ctrlr.switch("topic", "correcties", false);
  });

  let d = document.createElement("div");
  d.classList.add("datum");
  d.innerText = "Laatst bijgewerkt op: ";
  d.appendChild(document.createElement("span"));

  let h2 = document.createElement("h2");
  h2.innerText = topic;

  h.appendChild(v);
  h.appendChild(h2);
  h.appendChild(d);

  container.appendChild(h);
};

export const createGraphGroupElement = (
  graphObject: IGraphMapping,
  htmlContainer: HTMLElement,
) => {
  let element = document.createElement("article");

  if (graphObject.elementClasslist) {
    for (let className of graphObject.elementClasslist) {
      element.classList.add(className);
    }
  }

  htmlContainer.appendChild(element);

  return element;
};
