// services/data.service.ts
import { setData, hasData, clearData, isLoading$ } from '../../stores/data.store';
import { legacyRowsToKtoRows, planLegacyKto } from "../../shared/legacy-kto";
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

  clear(): void {
    clearData();
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
    // Archived versions serve the pre-1.0.2 payload, where KTO lived in the
    // `tevredenheid` table instead of in `kto_score_*` columns on `regelingen`.
    // Translate the request and normalise the response back into the current
    // shape. No-op for the live version. See src/shared/legacy-kto.ts.
    const legacy = planLegacyKto(endpoint, version?.tag);
    const url = this.buildUrl(legacy ? legacy.table : endpoint, version);

    if (legacy && !legacy.supported) {
      // This domein/regeling never had a KTO series before 1.0.2 (e.g. MW).
      // Return an empty series rather than a request that cannot be answered.
      return [];
    }

    const response = await fetch(url);
    if (response.ok) {
      let data = await response.json();
      if (legacy) {
        data = legacyRowsToKtoRows(data, legacy);
      }
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
    throw new Error(
      legacy
        ? `Fetch failed: ${url} — version "${version?.tag}" has no "${legacy.table}" table, so KTO cannot be served for this archive`
        : `Fetch failed: ${url}`,
    );
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

    if (version && version.tag !== "latest") {
      apibase = `/${apibase.split("/")[1]}/archives/v${version.slug}/api/`;
    }

    return domain + apibase + endpoint;
  }
}