import * as XLSX from "xlsx";

/**
 * The four tables that live inside a table-view container. At any time only
 * one of them is visible (the togglers swap the CSS `hidden` class); the
 * download feature must export ALL of them, one worksheet per table.
 * The order here also defines the order of the sheets in the workbook.
 */
export const TABLE_SHEETS: { id: string; name: string }[] = [
  { id: "week-table-inc", name: "Week (toename)" },
  { id: "month-table-inc", name: "Maand (toename)" },
  { id: "week-table-cumul", name: "Week (cumulatief)" },
  { id: "month-table-cumul", name: "Maand (cumulatief)" },
];

/**
 * Clean a single cell, preserving the original CSV logic:
 *  - strip currency symbols (€) and non-breaking spaces (literal `&nbsp;`
 *    and the actual U+00A0 character that textContent returns for it),
 *  - keep "t/m" ranges and long date ranges (containing "-" and > 10 chars)
 *    as text,
 *  - otherwise convert Dutch number formatting: thousands dots removed,
 *    decimal comma replaced by a dot.
 */
export const cleanCell = (raw: string): string => {
  let v = (raw || "").trim();

  // Remove currency symbols and non-breaking spaces
  v = v.replace(/€|\u00a0|&nbsp;/g, "").trim();

  // Skip if it's a date range or text
  if (v.includes("t/m") || (v.includes("-") && v.length > 10)) {
    return v;
  }

  // Handle Dutch number formatting
  if (v.includes(",")) {
    // Has comma (decimal): remove dots (thousands), replace comma with dot
    v = v.replace(/\./g, "").replace(",", ".");
  } else if (v.includes(".")) {
    // Has only dots (thousands separator): remove them
    v = v.replace(/\./g, "");
  }

  return v;
};

/**
 * Convert a single <table> element into an array-of-arrays (including the
 * header row). Every cell is passed through cleanCell. Hidden tables are
 * read exactly the same as visible ones.
 */
export const tableToArray = (table: HTMLTableElement): string[][] => {
  const rows = table.querySelectorAll("tr");
  const out: string[][] = [];
  for (let i = 0; i < rows.length; i++) {
    const cols = rows[i].querySelectorAll("td,th");
    const row: string[] = [];
    for (let j = 0; j < cols.length; j++) {
      row.push(cleanCell(cols[j].textContent?.trim() || ""));
    }
    out.push(row);
  }
  return out;
};

/**
 * Assemble a SheetJS workbook from a container element holding the four
 * tables. Each table becomes its own worksheet, named after TABLE_SHEETS.
 * Tables are collected by id regardless of the CSS `hidden` class.
 */
export const buildWorkbookFromElement = (
  element: HTMLElement,
): XLSX.WorkBook => {
  const wb = XLSX.utils.book_new();

  for (const def of TABLE_SHEETS) {
    const table = element.querySelector(
      `table#${def.id}`,
    ) as HTMLTableElement | null;
    if (!table) continue;

    const data = tableToArray(table);
    // Skip empty tables but still append a sheet so the tab always exists
    // when the table element is present.
    const ws =
      data.length > 0
        ? XLSX.utils.aoa_to_sheet(data)
        : XLSX.utils.aoa_to_sheet([[]]);
    XLSX.utils.book_append_sheet(wb, ws, def.name);
  }

  return wb;
};

/**
 * Serialise a workbook to a binary Blob suitable for a download link.
 */
export const workbookToBlob = (wb: XLSX.WorkBook): Blob => {
  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  return new Blob([out], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
};

/**
 * Legacy single-table CSV export. Kept for backward compatibility; the
 * download button now uses the 4-tab workbook instead.
 */
export const tableToCSV = (element: HTMLElement) => {
  const csv_data: string[] = [];

  const rows = element.querySelectorAll("table:not(.hidden) tr");
  for (let i = 0; i < rows.length; i++) {
    const cols = rows[i].querySelectorAll("td,th");
    const csvrow: string[] = [];

    for (let j = 0; j < cols.length; j++) {
      csvrow.push(cleanCell(cols[j].textContent?.trim() || ""));
    }

    csv_data.push(csvrow.join(";"));
  }

  return csv_data.join("\n");
};
