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
  baseKey?: string;
  cumulative: boolean;
  periodization: string;
  vanaf?: string;
  parameterIndex?: number;
  gemeente?: string;
  specials?: string;
  label?: string;
  normalized?: boolean;
  yearmonth?: string;
  // Active KTO domein prefix (totaal | fysiek | ims | wdl). Orthogonal to
  // `key` / `baseKey` so it composes with the month selector. Drives prefixed
  // column resolution in KTORatingsV1 via the HtmlDomeinSelector widget.
  domein?: string;
  // Active KTO regeling prefix (mw | vv | imk | ims | wd | wnw). Orthogonal to
  // `key` / `baseKey`, same role as `domein` but for the regeling comparison
  // group; drives prefixed column resolution in KTORatingsV1 via the
  // HtmlRegelingSelector widget.
  regeling?: string;
  // weekOnly?: boolean;
};

export type Timeline = {
  date: string;
  label: string;
  html: string;
  description: string;
  category: string;
};
