import { breakpoints } from "../../img-modules/styleguide";

export const HTMLSource = (wrapper: HTMLElement, lan: string, text: string) => {
  const container = document.createElement("div");
  container.classList.add("source_attribution");
  container.style.display = "flex";
  container.style.flexDirection = "row";
  container.style.justifyContent =
    window.innerWidth < breakpoints.sm ? "flex-start" : "flex-end";
  container.style.width = "100%";
  container.style.marginBottom = ".25rem";
  // container.style.marginTop = '2rem';

  const span = document.createElement("span");
  span.style.fontSize = ".85rem";

  const s = lan === "en" ? "source: " : "bron: ";

  span.innerText = s + text;

  container.appendChild(span);
  if (wrapper.parentElement === null) return;
  wrapper.parentElement.appendChild(container);

  return container;
};
