

export const tableToCSV = (element: HTMLElement) => {
  const csv_data: string[] = [];

  const rows = element.querySelectorAll("table:not(.hidden) tr");
  for (let i = 0; i < rows.length; i++) {
    const cols = rows[i].querySelectorAll("td,th");
    const csvrow: string[] = [];
    
    for (let j = 0; j < cols.length; j++) {
      let v = cols[j].textContent?.trim() || "";
      
      // Remove currency symbols and non-breaking spaces
      v = v.replace(/€|&nbsp;/g, "").trim();
      
      // Skip if it's a date range or text
      if (v.includes("t/m") || v.includes("-") && v.length > 10) {
        csvrow.push(v);
        continue;
      }
      
      // Handle Dutch number formatting
      if (v.includes(",")) {
        // Has comma (decimal): remove dots (thousands), replace comma with dot
        v = v.replace(/\./g, "").replace(",", ".");
      } else if (v.includes(".")) {
        // Has only dots (thousands separator): remove them
        v = v.replace(/\./g, "");
      }
      
      csvrow.push(v);
    }

    csv_data.push(csvrow.join(";"));
  }

  return csv_data.join("\n");
};