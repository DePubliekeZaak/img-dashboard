import { getGroupSegment } from "../stores/segment.store";
import { convertToCurrencyInTable } from "./_helpers";
import { GraphParamEntry } from "./interfaces";

export const incVsCum = (data: any[], graphParams: Record<string, GraphParamEntry>) => {
  const incremental: number[] = [];
  const cumulative: number[] = [];
  
  for (const entry of Object.values(graphParams)) {
    if (entry.variants.delta) {
      incremental.push(data[0][entry.variants.delta.column]);
    }
    if (entry.variants.cumul) {
      cumulative.push(data[0][entry.variants.cumul.column]);
    }
  }

  return { incremental, cumulative };
};


// export const incVsCum2 = (data: any[], config: any) => {
//   const incremental: string[] = [];
//   const cumulative: string[] = [];

//   for (const p of config.graphs[0].parameters[0]) {
//     // console.log(p.column,data[0])
//     incremental.push(data[0][p.column + "_aantal"]);
//     cumulative.push(data[0][p.column + "_cumul"]);
//   }

//   return { incremental, cumulative };
// };

const rowing = (data: any, tableParams: any, noSplit = false) => {

  const inc: string[][] = []; 
  const cumul: string[][] = []; 

  for (let period of data) {

    const incRow: string[] = [];
    const cumulRow: string[] = [];
    incRow.push(period._year);
    incRow.push(period._week);
    incRow.push(
      new Date(period._startdatum).toLocaleDateString("nl-NL", {
        day: "2-digit",
        month: "2-digit",
      }) +
        " t/m " +
        new Date(period._einddatum).toLocaleDateString("nl-NL", {
          day: "2-digit",
          month: "2-digit",
        }),
    );
    cumulRow.push(period._year);
    cumulRow.push(period._week);
    cumulRow.push(
      new Date(period._startdatum).toLocaleDateString("nl-NL", {
        day: "2-digit",
        month: "2-digit",
      }) +
        " t/m " +
        new Date(period._einddatum).toLocaleDateString("nl-NL", {
          day: "2-digit",
          month: "2-digit",
        }),
    );

    for (const p of tableParams) {
      const isCumul = p.column.includes("_cumul");
      const val = (() => {
        if (p.format === "currency") return convertToCurrencyInTable(period[p.column]);
        if (p.format === "percentage") return period[p.column] != null ? (Math.round(period[p.column] * 10) / 10).toFixed(1) + "%" : ' -';
        return period[p.column] != null ? period[p.column] : ' -';
      })();

      if (noSplit || isCumul) cumulRow.push(val);
      if (noSplit || !isCumul) incRow.push(val);
    }


    if (noSplit) {
      cumul.push(cumulRow);
    } else {
      if (incRow.length > 3) inc.push(incRow);
      if (cumulRow.length > 3) cumul.push(cumulRow);
    }
  }

  return { inc, cumul }

}

const ktoRowing = (data: any, tableParams: any) => {

  const inc: string[][] = []; 
  const cumul: string[][] = []; 

  for (let period of data) {

    const incRow: string[] = [];
    const cumulRow: string[] = [];
    incRow.push(period._year);
    incRow.push(period.completed_month);
    // cumulRow.push(period._year);
    // cumulRow.push(period.completed_month);

    for (const p of tableParams) {

      // if (p.column.includes("_cumul")) { 
      //   if (p.format === "currency") {
      //     cumulRow.push(convertToCurrencyInTable(period[p.column]));
      //   } else if (p.format === "percentage") {
      //     cumulRow.push((Math.round(period[p.column] * 10) / 10).toFixed(1) + "%");
      //   } else {
      //     cumulRow.push(period[p.column]);
      //   }
      // } else {
          if (p.format === "currency") {
          incRow.push(convertToCurrencyInTable(period[p.column]));
        } else if (p.format === "percentage") {
          incRow.push(period[p.column] != null ? (Math.round(period[p.column] * 10) / 10).toFixed(1) + "%" : ' -');
        } else {
          incRow.push(period[p.column] != null ? period[p.column] : ' -');
        }
      // }
    }


    if (incRow.length > 3) inc.push(incRow);
    // if (cumulRow.length > 3) cumul.push(cumulRow);
  }

  return { inc, cumul } 

}

export const tables = (

  graphDataWeek: any[],
  graphDataMonth: any[],
  tableParams: any[],
  pre_headers?: any[][],
  forceCumul = false,
  hasModifiers = false,
) => {

  graphDataMonth.sort((a, b) => b._yearmonth.localeCompare(a._yearmonth));
  graphDataWeek.sort((a, b) => b._yearweek.localeCompare(a._yearweek));

  const noSplit = forceCumul && !hasModifiers;

  const { inc: weekRowsInc, cumul: weekRowsCumul} = rowing(graphDataWeek, tableParams, noSplit)
  const { inc: monthRowsInc, cumul: monthRowsCumul} = rowing(graphDataMonth, tableParams, noSplit)

  // Build weekTable only if week data exists
  const weekTableInc = graphDataWeek.length > 0 && !noSplit
    ? {
        pre_headers: pre_headers !== null ? pre_headers![0] : [],
        headers: ["Jaar", "Week", "Periode"].concat(
          tableParams.filter( p => !p.column.includes('_cumul')).map((p) => p.short != undefined ? p.short : p.label),
        ),
        rows: weekRowsInc,
      }
    : null;


  const weekTableCumul = graphDataWeek.length > 0
    ? {
        pre_headers: pre_headers !== null ? pre_headers![0] : [],
        headers: ["Jaar", "Week", "Periode"].concat(
          (noSplit ? tableParams : tableParams.filter( p => p.column.includes('_cumul'))).map((p) => p.short != undefined ? p.short : p.label),
        ),
        rows: noSplit ? weekRowsCumul : weekRowsCumul,
      }
    : null;

    // Build monthTable only if month data exists
  const monthTableInc = graphDataMonth.length > 0 && !noSplit
    ? {
        pre_headers: pre_headers !== null ? pre_headers![1] : [],
        headers: ["Jaar", "Maand", "Periode"].concat(
          tableParams.filter( p => !p.column.includes('_cumul')).map((p) => p.short != undefined ? p.short : p.label),
        ),
        rows: monthRowsInc,
      }
    : null;

  const monthTableCumul = graphDataMonth.length > 0
    ? {
        pre_headers: pre_headers !== null ? pre_headers![1] : [],
        headers: ["Jaar", "Maand", "Periode"].concat(
          (noSplit ? tableParams : tableParams.filter( p => p.column.includes('_cumul'))).map((p) => p.short != undefined ? p.short : p.label),
        ),
        rows: noSplit ? monthRowsCumul : monthRowsCumul,
      }
    : null;

  return {
    weekTableInc,
    monthTableInc,
    weekTableCumul,
    monthTableCumul,
    showToggle: graphDataWeek.length > 0 && graphDataMonth.length > 0,
    hasAny: graphDataWeek.length > 0 || graphDataMonth.length > 0,
  };
};

export const ktoTables = (

  graphDataWeek: any[],
  graphDataMonth: any[],
  tableParams: any[],
  pre_headers?: any[][],
) => {

  graphDataMonth.sort((a, b) => b._yearmonth.localeCompare(a._yearmonth));
  // graphDataWeek.sort((a, b) => b._yearweek.localeCompare(a._yearweek));

  // const { inc: weekRowsInc, cumul: weekRowsCumul} = ktoRowing(graphDataWeek, tableParams)
  const { inc: monthRowsInc, cumul: monthRowsCumul} = ktoRowing(graphDataMonth, tableParams)

  // Build weekTable only if week data exists
  // const weekTableInc = graphDataWeek.length > 0
  //   ? {
  //       pre_headers: pre_headers !== null ? pre_headers![0] : [],
  //       headers: ["Jaar", "Week", "Periode"].concat(
  //         tableParams.filter( p => !p.column.includes('_cumul')).map((p) => p.short != undefined ? p.short : p.label),
  //       ),
  //       rows: weekRowsInc,
  //     }
  //   : null;


  // const weekTableCumul = graphDataWeek.length > 0
  //   ? {
  //       pre_headers: pre_headers !== null ? pre_headers![0] : [],
  //       headers: ["Jaar", "Week"].concat(
  //         tableParams.filter( p => p.column.includes('_cumul')).map((p) => p.short != undefined ? p.short : p.label),
  //       ),
  //       rows: weekRowsCumul,
  //     }
  //   : null;

    // Build monthTable only if month data exists
  const monthTableInc = graphDataMonth.length > 0
    ? {
        pre_headers: pre_headers !== null ? pre_headers![1] : [],
        headers: ["Jaar", "Maand"].concat(
          tableParams.filter( p => !p.column.includes('_cumul')).map((p) => p.short != undefined ? p.short : p.label),
        ),
        rows: monthRowsInc,
      }
    : null;

  // const monthTableCumul = graphDataMonth.length > 0
  //   ? {
  //       pre_headers: pre_headers !== null ? pre_headers![1] : [],
  //       headers: ["Jaar", "Maand"].concat(
  //         tableParams.filter( p => p.column.includes('_cumul')).map((p) => p.short != undefined ? p.short : p.label),
  //       ),
  //       rows: monthRowsCumul,
  //     }
  //   : null;

  return {
    // weekTableInc,
    monthTableInc,
    // weekTableCumul,
    // monthTableCumul,
    showToggle: graphDataWeek.length > 0 && graphDataMonth.length > 0,
    hasAny: graphDataWeek.length > 0 || graphDataMonth.length > 0,
  };
};

export const pieParts = (group: any, data: any, graphs: any[], index: number) => {
  const parts: any[] = [];
  //PIE CHA
  const graph_1 = graphs[index];
  const params_1 = graph_1.parameters[0].concat(...graph_1.parameters[1]);

  const segment = getGroupSegment(group.slug)
  
  params_1.forEach((p: any, i: number) => {

    const entry = group.graphParams![p.column];
    const variant = segment!.cumulative
      ? (entry?.variants.cumul ?? entry?.variants.base)
      : (entry?.variants.delta ?? entry?.variants.base);

    parts.push({
      label: p.label,
      value: data[0][variant.column],
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

export const  groupByPrefix = (obj: any, prefixes: string[] ) => {
  const grouped: any = {};
  const ungrouped: any = {};

  for (const [key, value] of Object.entries(obj)) {
    const prefix = prefixes.find(p => key.startsWith(p + '_'));
    if (prefix) {
      grouped[prefix] ??= {};
      grouped[prefix][key] = value;
    } else {
      ungrouped[key] = value;
    }
  }

  return { grouped, ungrouped };
}

