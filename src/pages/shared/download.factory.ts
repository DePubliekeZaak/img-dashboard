import { sanitizeCurrency } from "./_helpers";

export const tableToCSV = (element: HTMLElement) => {
  // Variable to store the final csv data
  var csv_data: string[] = [];

  // Get each row data
  var rows = element.querySelectorAll("table:not(.hidden) tr");
  for (var i = 0; i < rows.length; i++) {
    // Get each column data
    const cols = rows[i].querySelectorAll("td,th");

    // Stores each csv row data
    const csvrow: string[] = [];
    for (var j = 0; j < cols.length; j++) {
      // Get the text data of each cell of
      // a row and push it to csvrow
      const v: string = sanitizeCurrency(cols[j].innerHTML);
      csvrow.push(v);
    }

    // Combine each column value with comma
    csv_data.push(csvrow.join(";"));
  }

  return csv_data.join("\n");
};
