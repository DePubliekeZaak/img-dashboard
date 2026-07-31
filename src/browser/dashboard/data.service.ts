// services/data.service.ts
import { setData, hasData, clearData, isLoading$ } from '../../stores/data.store';
import type { Version } from "./types";
import type { Segment } from "../../shared/types";

export class DataService {

  addVarsToEndpoint(endpoint: string, segment: Segment): string {
    let resolved = endpoint;
    if (resolved.includes("{GEMEENTE}") && segment.gemeente) {
      resolved = resolved.replace("{GEMEENTE}", encodeURIComponent(segment.gemeente));
    }
    if (resolved.includes("{VANAF}") && segment.vanaf) {
      resolved = resolved.replace("{VANAF}", encodeURIComponent(segment.vanaf));
    }
    return resolved;
  }

  async gather(endpoint: string, version: Version): Promise<void> {
    // endpoint is already resolved, use it directly as key
    if (hasData(endpoint)) return;

    isLoading$.set(true);
    
    try {
      let payload = await this.fetch(endpoint, version);


      if (endpoint.includes("gemeenten?aggregatie") || endpoint.includes("regelingen?aggregatie")) {
        payload = payload.map(row => this.mapRow(row));
      }

      setData(endpoint, payload);
    } finally {
      isLoading$.set(false);
    }
  }

  async fetch(endpoint: string, version: Version): Promise<any[]> {
    const url = this.buildUrl(endpoint, version);
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      // guard: validate aggregatie endpoints contain expected columns from the `select` query param
      if (endpoint.includes("aggregatie") && Array.isArray(data) && data.length > 0) {
        const required = ['aggregatie', 'periode', 'periode_totenmet', 'periode_vanaf'];
        const missing = required.filter(f => !(f in data[0]));
        if (missing.length > 0) {
          throw new Error(
            `API response for aggregatie endpoint is missing required fields: ${missing.join(', ')} — ${url}`
          );
        }
      }
      return data;
    }
    throw new Error(`Fetch failed: ${url}`);
  }

  mapRow(row: any) {
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
  }

  private buildUrl(endpoint: string, version: Version): string {
    // @ts-expect-error
    let apibase = APIBASE;
    // @ts-expect-error
    const domain = DOMAIN;

    if (version.tag !== "latest") {
      apibase = `/${apibase.split("/")[1]}/archives/v${version.slug}/api/`;
    }

    return domain + apibase + endpoint;
  }
}