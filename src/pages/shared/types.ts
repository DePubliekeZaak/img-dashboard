export type GeoData = any;

export interface DataPart {
  KeyValue?;
  _date?: string;
  year: string;
}

export type DataObject = {
  [key: string]: any[];
};

export type PreHeader = {
  label: string;
  length: number;
};

export type TableData = {
  pre_headers?: PreHeader[];
  headers: string[];
  rows: string[][];
};

export type SelectorOption = {
  slug: string;
  label: string;
};

export type ImgDataItem = {
  [key: string]: string;
  _date: string;
  _gemeente: string;
  _week: string;
  _month: string;
  _year: string;
};

export type ImgData = ImgDataItem[];

export type Segment = {
  key: string;
  cumulative: boolean;
  periodization: string;
  parameterIndex?: number;
  gemeente?: string;
  specials?: string;
  label?: string;
  normalized?: boolean;
  yearmonth?: string;
};

export type Timeline = {
  date: string;
  label: string;
  html: string;
  description: string;
  category: string;
};
