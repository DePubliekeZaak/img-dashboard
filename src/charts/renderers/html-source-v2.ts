export const HTMLSourceV2 = (
  wrapper: HTMLElement,
  lan: string,
  text: string,
) => {
  const container = document.createElement("div");
  container.classList.add("source_attribution");

  const span = document.createElement("span");
  const s = lan === "en" ? "source: " : "bron: ";
  span.innerText = s + text;

  container.appendChild(span);
  wrapper.insertBefore(container, wrapper.querySelector(".graph-wrapper"));

  return container;
};
