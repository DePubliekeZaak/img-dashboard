# src/widgets/

Page/group-level UI chrome shared across pages but not chart-rendering.

These are the DOM-drawing classes for tables, filters, selectors, tabs,
definitions, and other page/group chrome that lives above the individual
graph level. They are consumed by group controllers (`group-v1.ts`,
`default-group-v1.ts`, page-local groups) and page controllers
(`page.controller.ts`), but never by graph controllers directly.

Contrast with `src/charts/renderers/` which holds chart-level SVG/DOM
rendering that graph controllers call (legends, headers, popups, etc.).