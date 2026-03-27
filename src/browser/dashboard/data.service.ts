import type { Version } from "./types";
import type { Segment } from "../../pages/shared/types";


export interface IDataService {
  clear: () => void;
  collection: () => Record<string, any[]>;
  gather: (endpoint: string, version: Version, segment: Segment, params?: Record<string, string>) => Promise<void>;
  fetch: (endpoint: string, version: Version, segment: Segment, params?: Record<string, string>) => Promise<any[]>;
  addVarsToEndpoint: (endpoint:string, segment: Segment) => string;
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

  addVarsToEndpoint(endpoint: string, segment: Segment) {
    let resolvedEndpoint = endpoint;  // Start with original

    if (resolvedEndpoint.includes("{GEMEENTE}") && segment.gemeente != undefined) {
      resolvedEndpoint = resolvedEndpoint.replace("{GEMEENTE}", encodeURIComponent(segment.gemeente));
    }
    if (resolvedEndpoint.includes("{VANAF}") && segment.vanaf != undefined) {
      resolvedEndpoint = resolvedEndpoint.replace("{VANAF}", encodeURIComponent(segment.vanaf));
    }

    return resolvedEndpoint;
  }

  async gather(endpoint: string, version: Version, segment: Segment, params?: Record<string, string>) {

    // Resolve placeholders FIRST
    let resolvedEndpoint = this.addVarsToEndpoint(endpoint, segment);

    const key = this.buildKey(resolvedEndpoint, params);
    
    if (this._collection[key] === undefined) {
      let payload = await this.fetch(resolvedEndpoint, version, segment, params);

      if (resolvedEndpoint.includes("gemeenten?aggregatie") || resolvedEndpoint.includes("regelingen?aggregatie")) {
        payload = payload.map((row: any) => this.mapRow(row));
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