import type { Version } from "./types";

export interface IDataService {
  clear: () => void;
  collection: () => Record<string, any[]>;
  gather: (endpoint: string, version: Version, params?: Record<string, string>) => Promise<void>;
  fetch: (endpoint: string, version: Version, params?: Record<string, string>) => Promise<any[]>;
}

export class DataService implements IDataService {
  _collection: Record<string, any[]> = {};

  collection() {
    return this._collection;
  }

  clear() {
    this._collection = {};
  }

  async gather(endpoint: string, version: Version, params?: Record<string, string>) {
    const key = this.buildKey(endpoint, params);
    if (this._collection[key] === undefined) {
      this._collection[key] = await this.fetch(endpoint, version, params);
    }
  }

  async fetch(endpoint: string, version: Version, params?: Record<string, string>): Promise<any[]> {
    const url = this.buildUrl(endpoint, version, params);
    console.log(url)
    const response = await fetch(url);
    if (response.ok) {
      console.log("fetched, parsing...")
      const data = await response.json();
      console.log("parsed", data.length, "rows")
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

  private buildUrl(endpoint: string, version: Version, params?: Record<string, string>): string {
    // @ts-expect-error
    let apibase = APIBASE;
    // @ts-expect-error
    const domain = DOMAIN;

    // endpoint replace {GEMEENTE} and {VANAF} met waardes uit page filtergit status
    // beginnen met AA en Hunze en 2025-01-01

    if (version.tag !== "latest") {
      apibase = `/${apibase.split("/")[1]}/archives/v${version.slug}/api/`;
    }

    let url = domain + apibase + endpoint;

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