import { IGraphMapping, IMappingOption } from "../../charts/core/types";

export const removeDuplicates = (arr: any[]) => {
  const seen = new Set<string>();
  return arr.filter((item) => {
    const identifier = JSON.stringify(item); // Serialize the object to compare all keys
    if (seen.has(identifier)) {
      return false; // Exclude duplicate
    }
    seen.add(identifier);
    return true; // Include unique object
  });
};

var trimColumns = function (json: any, neededColumns: string[]) {
  json.forEach((week: any, i: number) => {
    Object.keys(week).forEach((key) => {
      if (neededColumns.indexOf(key) < 0) {
        delete week[key];
      }
    });
  });
  return json;
};

export const trimColumnsAndOrder = (json: any, neededColumns: string[]) => {
  let newArray: any[] = [];
  let newObject: any;

  json.forEach((obj: any, i: number) => {
    newObject = {};
    neededColumns.forEach((nc) => {
      newObject[nc] = obj[nc];
    });

    newArray.push(newObject);
  });

  return newArray;
};

var hasValue = function (array: any[], value: string) {
  return array.filter((i) => {
    return i[value] !== null;
  });
};

export function thousands(number: any) {

  const dutchFormatter = new Intl.NumberFormat("nl-NL", {
    useGrouping: true
  });

  return number != undefined ? dutchFormatter.format(number) : ``;
}

export function miljarden(number: number): string {
  return (number / 1000).toString();
}

export function convertToCurrency(number: number) {
  number = Math.ceil(number);

  return number.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  });
}
11;
export function convertToCurrencyInMillions(number: number) {
  number = Math.ceil(number);

  if (number >= 1000 * 1000 * 100) {
    return (
      (number / (1000 * 1000 * 1000)).toLocaleString("nl-NL", {
        style: "decimal",
        minimumFractionDigits: 0,
      }) + " mld."
    );
  } else if (number >= 1000 * 1000) {
    return (
      (number / 1000000).toLocaleString("nl-NL", {
        style: "decimal",
        minimumFractionDigits: 0,
      }) + " mln."
    );
  }
  return number.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  });
}

export function convertToCurrencyInTable(number: number) {
  const toString = (number: number) =>
    number.toLocaleString("nl-NL", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    });

  number = Math.ceil(number);
  return number < 0 ? "(" + toString(-number) + ")" : toString(number);
}

export function convertToMillions(number: number) {

  if (number >= 1000 * 1000 * 1000) {
    return "€ " + (number / (1000 * 1000 * 1000)).toFixed(0) + " mrd";
  } else if (number >= 1000 * 1000) { 
      return "€ " + (number / (1000 * 1000)).toFixed(0) + " mln";
  } else if (number >= 99 * 1000) { 
      return "€ " + (number / (1000 * 1000)).toFixed(1) + " mln";
  } else {
    return "€ " + thousands(number);
  }
  
}

export function sanitizeCurrency(string: string) {
  let s = string.replace("€&nbsp;", "").split(".").join("");
  let number;

  if (s[0] == "(") {
    s = s.replace("(", "").replace(")", "");
    number = -parseFloat(s);
  } else if (s[0] == "-") {
    number = 0;
  } else if (s.includes("t/m")) {
    number = string;
  } else if (!isNaN(parseFloat(s))) {
    number = parseFloat(s);
  }

  return number != undefined ? number : s;
}

export function shortenCurrency(string: string) {
  if (string.length < 7) {
    return string;
  } else if (string.length < 11) {
    return string.slice(0, string.length - 4) + "K";
  } else {
    return string.slice(0, string.length - 6) + "M";
  }
}

export function displayDate(date: any) {
  date = new Date(date);
  return (
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
  );
}

export function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
}

// export function getFirstMapping(o: GraphObject) {

//         let m: any = o.mapping[0];

//         while (true) {

//             if (!m.column) {
//                 m = m[0]
//             } else {

//                 return {
//                     column : m.column || "",
//                     label: m.label,
//                     colour: m.colour,
//                     units: m.units,
//                     format: m.format
//                 }
//             }

//         }
// }

export function getParameter(o: IGraphMapping, i: number) {
  // if(o && o != true) {

  let m: any = o.parameters[i];

  while (true) {
    if (!m.column) {
      m = m[0];
    } else {
      return {
        column: m.column || "",
        label: m.label,
        colour: m.colour,
        units: m.units,
        format: m.format,
      };
    }
  }
  // }
}

export function getMappingKey(m: any, key: any): any {
  return m[key].toString();
}

export function flattenColumn(column: string | string[]): string {
  return Array.isArray(column) ? column[0] : column;
}

export function flattenArray(array: any[]) {
  var result: any[] = [];
  array.forEach(function (a) {
    if (Array.isArray(a)) {
      a.forEach((aa, i) => {
        result.push(aa);
      });
    } else {
      result.push(a);
    }
  });
  return result;
}

export function groupBy<T>(arr: T[], fn: (item: T) => any) {
  return arr.reduce<Record<string, T[]>>((prev, curr) => {
    const groupKey = fn(curr);
    const group = prev[groupKey] || [];
    group.push(curr);
    return { ...prev, [groupKey]: group };
  }, {});
}

export const bePositive = (n: number) => (n < 0 ? -n : n);

export const standardDeviation = (arr: any, usePopulation = false) => {
  const mean = arr.reduce((acc: any, val: any) => acc + val, 0) / arr.length;

  const stdev = Math.sqrt(
    arr
      .reduce((acc: any, val: number) => acc.concat((val - mean) ** 2), [])
      .reduce((acc: any, val: number) => acc + val, 0) /
      (arr.length - (usePopulation ? 0 : 1)),
  );

  return {
    mean,
    stdev,
  };
};

export const toDutchMonths = (number: number) => {
  const months = [
    "Januari",
    "Februari",
    "Maart",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Augustus",
    "September",
    "Oktober",
    "November",
    "December",
  ];

  return months[number - 1];
};

export const accounting = (v: number): string => {
  return v != null ? (v >= 0 ? v.toString() : "(" + -v.toString() + ")") : "0";
};
