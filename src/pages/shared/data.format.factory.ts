import type { KeyValue } from "../../charts/core/types";
import type { IParameterMapping } from "./interfaces";
import { DataPart, type Segment } from "./types";
import type { GeoJsonFeature, Line, Lines, TrendBar } from "./types_graphs";

export const filterUnique = (data: any[], key: string): (string | number)[] => {
  const uniques: (string | number)[] = [];

  for (const report of data) {
    const slug = report[key];
    if (uniques.indexOf(slug) < 0) {
      uniques.push(slug);
    }
  }

  return uniques;
};

export const uniques = (array: string[]): string[] => {
  const uniques: string[] = [];

  for (const s of array) {
    if (uniques.indexOf(s) < 0) {
      uniques.push(s);
    }
  }

  return uniques;
};

export const uniquesWithCount = (
  data: any[],
  key: string,
): { [key: string]: number } => {
  const o = {};
  const uniques: (string | number)[] = [];

  for (const report of data) {
    const slug = report[key];
    if (uniques.indexOf(slug) < 0) {
      uniques.push(slug);
    }
  }

  for (const u of uniques) {
    o[u] = data.filter((d) => d[key] === u).length;
  }

  return o;
};

export const filterUniqueGeoFeatures = (
  data: GeoJsonFeature[],
  key: string,
): (string | number)[] => {
  const uniques: (string | number)[] = [];

  for (const feature of data) {
    const slug = feature.properties[key];
    if (uniques.indexOf(slug) < 0) {
      uniques.push(slug);
    }
  }

  return uniques;
};

export const formatLines = (
  data: any,
  keyForLine: string,
  keyForValue: string,
  keyForLabel: string,
): Lines => {
  let readyForLines: Lines = [];

  for (const unique of filterUnique(data, keyForLine)) {
    const line: Line = [];

    for (const year of filterUnique(data, "year").slice()) {
      const object = data.find(
        (r) => r[keyForLine] === unique && r.year === year,
      );
      const value = object !== undefined ? object[keyForValue] : 0;
      const label =
        object !== undefined || object !== null ? object[keyForLabel] : "";

      if (label !== null) {
        line.push({
          label,
          time: year,
          value,
        });
      }
    }

    readyForLines.push(line);
  }

  readyForLines = readyForLines.filter((line) => {
    let bool = false;
    const values = line.map((l) => l.value);

    for (const v of values) {
      if (v !== 0) {
        bool = true;
      }
    }

    return bool;
  });

  return readyForLines;
};

export const createBars = (
  prop: string,
  param: IParameterMapping,
  data: KeyValue[],
  segment: Segment,
) => {
  const bs: TrendBar[] = [];

  const periodKey =
    segment.periodization === "monthly" ? "_yearmonth" : "_yearweek";

  for (const period of data) {
    bs.push({
      label: param?.label || "",
      name: "main",
      date: period[periodKey].toString(),
      colour: param !== undefined ? param.colour : "orange",
      meta: period,
      value: period[prop] === null ? 0 : parseFloat(period[prop].toString()),
      format: param?.format || undefined,
    });
  }

  // console.log(bs);

  return bs;
};

export const createBarsForStacked = (
  prop: string,
  param: IParameterMapping,
  data: any[],
  segment: Segment,
) => {
  const bs: TrendBar[] = [];

  const periodKey =
    segment.periodization === "monthly" ? "_yearmonth" : "_yearweek";

  for (const period of data) {
    bs.push({
      label: param?.label || "",
      name: "main",
      date: period.data.date.toString(),
      colour: param !== undefined ? param.colour : "orange",
      meta: period.data,
      value: period[1] === null ? 0 : parseFloat(period[1].toString()),
    });
  }

  // console.log(bs);

  return bs;
};
