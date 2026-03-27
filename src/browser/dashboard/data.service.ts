import type { Version } from "./types";
import type { Segment } from "../../pages/shared/types";


export interface IDataService {
  clear: () => void;
  collection: () => Record<string, any[]>;
  gather: (endpoint: string, version: Version, segment: Segment, params?: Record<string, string>) => Promise<void>;
  fetch: (endpoint: string, version: Version, segment: Segment, params?: Record<string, string>) => Promise<any[]>;
}

export class DataService implements IDataService {
  _collection: Record<string, any[]> = {};

  collection() {
    return this._collection;
  }

  clear() {
    this._collection = {};
  }

  mapRow = (row: any) => {

    const isNewApi = row.aggregatie !== undefined;

    if (!isNewApi) return { ...row, _isNewApi: false };

    return {
      ...row,
      _isNewApi: true,
      _startdatum: row.periode_vanaf,
      _einddatum: row.periode_totenmet,
      _year: parseInt(row.periode?.split("_")[0]),
      _month: parseInt(row.periode?.split("_")[1]),
      _week: parseInt(row.periode?.split("_")[1]),
      _yearmonth: row.periode,
      _yearweek: row.periode,
    };
  };

  async gather(endpoint: string, version: Version, segment: Segment, params?: Record<string, string>) {
    const key = this.buildKey(endpoint, params);
    if (this._collection[key] === undefined) {
      let payload  = await this.fetch(endpoint, version, segment, params);

      if (endpoint.includes("gemeenten?aggregatie") || endpoint.includes("regelingen?aggregatie")) {
        
        payload = payload.map ( (row: any) => {
          return this.mapRow(row)
        });
      }

        this._collection[key] = payload;
    }
  }

  async fetch(endpoint: string, version: Version, segment: Segment, params?: Record<string, string>): Promise<any[]> {
    const url = this.buildUrl(endpoint, version, segment, params);
    console.log(url)
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    throw new Error(`Fetch failed: ${url}`);
  }

  private buildKey(endpoint: string, params?: Record<string, string>): string {
    if (!params || Object.keys(params).length === 0) {
      return endpoint;
    }
    const paramString = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
    return `${endpoint}&${paramString}`;
  }

  private buildUrl(endpoint: string, version: Version, segment: Segment, params?: Record<string, string>): string {
    // @ts-expect-error
    let apibase = APIBASE;
    // @ts-expect-error
    const domain = DOMAIN;

    // endpoint replace {GEMEENTE} and {VANAF} met waardes uit page filtergit status
    // beginnen met AA en Hunze en 2025-01-01

    // console.log("PARAMS", params)
    // console.log("SEGMENT", segment)

    if (endpoint.includes("{GEMEENTE}") && segment.gemeente != undefined) {
      endpoint = endpoint.replace("{GEMEENTE}", encodeURIComponent(segment.gemeente));
    }

    if (endpoint.includes("{VANAF}") && segment.vanaf != undefined) {
      endpoint = endpoint.replace("{VANAF}", encodeURIComponent(segment.vanaf));
    }

    if (version.tag !== "latest") {
      apibase = `/${apibase.split("/")[1]}/archives/v${version.slug}/api/`;
    }

    let url = domain + apibase + endpoint;

    console.log(url);

    if (params && Object.keys(params).length > 0) {
      const separator = endpoint.includes("?") ? "&" : "?";
      const queryString = Object.entries(params)
        .map(([k, v]) => {
          // Check of waarde al een operator heeft (eq., gte., in., etc.)
          const hasOperator = /^(eq|neq|gt|gte|lt|lte|in|is)\./i.test(v);
          return hasOperator ? `${k}=${encodeURIComponent(v)}` : `${k}=eq.${encodeURIComponent(v)}`;
        })
        .join("&");
      url += separator + queryString;
    }

    return url;
  }
}