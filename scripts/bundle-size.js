#!/usr/bin/env node
// bundle-size.js — measure the current webpack build output.
//
// Usage:
//   npm run build:prod && npm run size
//
// Prints per-asset sizes (KiB) plus a total, so bundle growth/regressions can be
// monitored across builds. The report-style baseline (webpack-native code
// splitting, ~2026-09-24) was ≈ 1,173 KiB total:
//   dashboard-bundle.js 299.9 · vendors 271.6 · shared 134.1 · common 119.1 ·
//   18 page chunks 0.6–36.0.
const fs = require("fs");
const path = require("path");

const scriptsDir = path.join(__dirname, "..", "public", "scripts");
const stylesFile = path.join(__dirname, "..", "public", "styles", "main.css");

const KiB = (n) => (n / 1024).toFixed(1);

if (!fs.existsSync(scriptsDir)) {
  console.error("public/scripts not found — run `npm run build:prod` first.");
  process.exit(1);
}

const files = fs
  .readdirSync(scriptsDir)
  .filter((f) => f.endsWith(".js"))
  .map((f) => {
    const p = path.join(scriptsDir, f);
    return { name: f, size: fs.statSync(p).size };
  });

if (fs.existsSync(stylesFile)) {
  files.push({ name: "main.css", size: fs.statSync(stylesFile).size });
}

files.sort((a, b) => b.size - a.size);

const category = (name) => {
  if (name === "dashboard-bundle.js") return "scaffold (host script tag)";
  if (name.startsWith("vendors.")) return "vendors (node_modules)";
  if (name.startsWith("shared.")) return "shared (src shared code)";
  return "page/async chunk";
};

let total = 0;
const rows = files.map((f) => {
  total += f.size;
  const label = category(f.name);
  return `  ${String(KiB(f.size)).padStart(7)} KiB  ${label.padEnd(28)} ${f.name}`;
});

console.log("IMG dashboard bundle sizes (current build output)\n");
console.log(rows.join("\n"));
console.log("\n--------------------------------------------");
console.log(
  `  TOTAL ${String(KiB(total)).padStart(6)} KiB (${(total / 1024 / 1024).toFixed(2)} MiB) — ${files.length} files`,
);
