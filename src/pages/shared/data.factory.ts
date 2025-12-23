import { convertToCurrencyInTable } from "./_helpers";
import { NumbersV1 } from "./graphs/numbers-v1";

export const incVsCum = (data: any[], config: any) => {
  const incremental: string[] = [];
  const cumulative: string[] = [];

  for (let p of config.graphs[0].parameters[0]) {
    incremental.push(data[0][p.column]);
    cumulative.push(data[0][p.column + "_cumulatief"]);
  }

  return { incremental, cumulative };
};

export const tables = (
  graphDataWeek: any[],
  graphDataMonth: any[],
  tableParams: any[],
  pre_headers?: any[][],
) => {
  const weekRows: string[][] = [];
  const monthRows: string[][] = [];

  for (let period of graphDataWeek) {
    const row: string[] = [];
    row.push(period._year);
    row.push(period._week);
    row.push(
      new Date(period._startdatum).toLocaleDateString("nl-NL", {
        dateStyle: "short",
      }) +
        " t/m " +
        new Date(period._einddatum).toLocaleDateString("nl-NL", {
          dateStyle: "short",
        }),
    );

    for (let p of tableParams) {
      if (p.format == "currency") {
        row.push(convertToCurrencyInTable(period[p.column]));
      } else if (p.format == "percentage") {
        row.push((Math.round(period[p.column] * 10) / 10).toFixed(1) + "%");
      } else {
        row.push(period[p.column]);
      }
    }
    weekRows.push(row);
  }

  const weekTable = {
    pre_headers: pre_headers != null ? pre_headers[0] : [],
    headers: ["Jaar", "Week", "Periode"].concat(
      tableParams.map((p) => p.label),
    ),
    rows: weekRows,
  };

  // Create monthTable only if data exists
  let monthTable = {
    pre_headers: pre_headers != null ? pre_headers[1] : [],
    headers: ["Jaar", "Maand", "Periode"].concat(
      tableParams.map((p) => p.label),
    ),
    rows: [] as string[][],
  };



  if (graphDataMonth.length > 0) {
    for (let period of graphDataMonth) {
      const row: string[] = [];
      row.push(period._year);
      row.push(period._month);
      row.push(
        new Date(period._startdatum).toLocaleDateString("nl-NL", {
          dateStyle: "short",
        }) +
          " t/m " +
          new Date(period._einddatum).toLocaleDateString("nl-NL", {
            dateStyle: "short",
          }),
      );


      for (let p of tableParams) {
        if (p.format == "currency") {
          row.push(convertToCurrencyInTable(period[p.column]));
        } else if (p.format == "percentage") {
          row.push((Math.round(period[p.column] * 10) / 10).toFixed(1) + "%");
        } else {
          row.push(period[p.column]);
        }
      }

      monthRows.push(row);
    }

    monthTable.rows = monthRows;
  }

  return { weekTable, monthTable };
};

export const pieParts = (data: any, graphs: any[], index: number) => {
  const parts: any[] = [];
  //PIE CHA
  let graph_1 = graphs[index];
  let params_1 = graph_1.parameters[0].concat(...graph_1.parameters[1]);

  params_1.forEach((p, i) => {
    parts.push({
      label: p.label,
      value: data[0][p.column],
      colour: p.colour,
      accented: false,
      format: "",
    });
  });

  // Create array with empty arrays and place parts at the specific index
  const result: any[] = new Array(graphs.length).fill(null).map(() => []);
  result[index] = parts;

  return result;
};
