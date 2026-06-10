import { convertToCurrencyInTable } from "../_helpers";
import { filterUnique } from "../data.format.factory";

export const relyOnCompleted = (
  filteredData: any[],
  tableParams: any,
  graphParams: any,
) => {
  const rows: string[][] = [];
  let i = 0;
  const alteredData: any[] = [];

  for (const period of JSON.parse(JSON.stringify(filteredData))) {
    const row: string[] = [];
    row.push(period._year);
    row.push(period.completed_month);

    for (const p of tableParams) {
      if (p.format === "currency") {
        row.push(convertToCurrencyInTable(period[p.column]));
      } else if (p.format === "percentage") {
        row.push((0.1 * Math.round(period[p.column] * 10)).toString() + "%");
      } else if (p.format === "decimals") {
        if (period[p.column] !== null) {
          row.push(
            period[p.column].toLocaleString("nl-NL", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            }),
          );
        } else {
          row.push("0");
        }
      } else {
        if (period[p.column] !== null) {
          row.push(period[p.column].toFixed(0));
        } else {
          row.push("0");
        }
      }
    }

    // leave out the first row
    if (i > 0) {
      rows.push(row);
    }

    // period["_startdatum"] = new Date(
    //   start.getTime() + 24 * 60 * 60 * 1000,
    // ).toLocaleDateString("nl-NL", {
    //   day: "2-digit",
    //   month: "2-digit",
    // });
    // if (i > 0) {
    //   period["_einddatum"] = new Date(
    //     filteredData[i - 1]._einddatum,
    //   ).toLocaleDateString("nl-NL", {
    //     day: "2-digit",
    //     month: "2-digit",
    //   });
    // }

    alteredData.push(period);

    i++;
  }

  return { rows, _data: alteredData };
};

export const fillEmptyMonths = (
  filteredData: any[],
  tableParams: any,
  graphParams: any,
): { rows: any; dataByMonth: any } => {
  const years = filterUnique(filteredData, "_year");
  const dataByMonth: any[] = [];
  const end = parseInt(filteredData[0]._yearmonth);
  const start = parseInt(filteredData[filteredData.length - 1]._yearmonth);
  const rows: string[][] = [];

  for (const year of years) {
    for (let i = 1; i <= 12; i++) {
      const month = i < 10 ? "0" + i.toString() : i.toString();
      const yearmonth = parseInt(year.toString() + month);

      if (yearmonth < start || yearmonth > end) {
        continue;
      }

      const m = filteredData.find(
        (p) => p._year === year && p._month === i.toString(),
      );
      const row: string[] = [];

      if (m !== undefined) {
        dataByMonth.push(m);

        row.push(m._year);
        row.push(m._month);
        row.push(
          new Date(m._startdatum).toLocaleDateString("nl-NL", {
            day: "2-digit",
            month: "2-digit",
          }) +
            " t/m " +
            new Date(m._einddatum).toLocaleDateString("nl-NL", {
              day: "2-digit",
              month: "2-digit",
            }),
        );

        for (const p of tableParams) {
          if (p.format === "currency") {
            row.push(convertToCurrencyInTable(m[p.column]));
          } else if (p.format === "percentage") {
            row.push((0.1 * Math.round(m[p.column] * 10)).toString() + "%");
          } else if (p.format === "decimals") {
            if (m[p.column] !== null) {
              row.push(m[p.column].toFixed(1));
            } else {
              row.push("0");
            }
          } else {
            if (m[p.column] !== null) {
              row.push(m[p.column].toFixed(0));
            } else {
              row.push("0");
            }
          }
        }
      } else {
        const o: any = {};
        const month = i < 10 ? "0" + i.toString() : i.toString();
        o._yearmonth = yearmonth;

        for (const p of graphParams) {
          o[p.column] = 0;
        }

        dataByMonth.push(o);
        row.push(year.toString(), i.toString());
      }

      rows.push(row);
    }
  }

  dataByMonth.sort((a, b) => (a._yearmonth < b._yearmonth ? 1 : -1));
  rows.sort((a, b) => (a[1] < b[1] ? -1 : 1));
  rows.sort((a, b) => (a[0] < b[0] ? 1 : -1));

  return { rows, dataByMonth };
};
