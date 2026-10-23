// services/data.service.ts
import { setData, hasData, clearData, isLoading$ } from '../../stores/data.store';
import {
  enrichKtoRows,
  isAggregationRequest,
  isArchivedVersion,
  stripKtoSelect,
  LEGACY_KTO_TABLE,
} from "../../shared/legacy-kto";
import type { Version } from "./types";
import type { Segment } from "../../shared/types";

export class DataService {
  /** Legacy KTO rows per version tag; fetching them once per version is enough. */
  private legacyKto$: Record<string, Promise<any[]>> = {};

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
    // Archived versions serve the pre-1.0.2 payload: `regelingen` rows are
    // current except that the whole `kto_score_*` block is missing (it used to
    // live in `tevredenheid`). Leave the request alone, then merge those numbers
    // into the response by period. No-op for the live version.
    // See src/shared/legacy-kto.ts.
    const mergeKto = isArchivedVersion(version?.tag) && isAggregationRequest(endpoint);
    // An archive has no kto_score_* columns, so a select naming them 400s.
    const requestEndpoint = mergeKto ? stripKtoSelect(endpoint) : endpoint;
    const url = this.buildUrl(requestEndpoint, version);

    const response = await fetch(url);
    if (response.ok) {
      let data = await response.json();

      if (mergeKto) {
        try {
          data = enrichKtoRows(data, await this.legacyKtoRows(version), (m) =>
            console.warn(m),
          );
        } catch (error) {
          // Never let a missing legacy table take down money/count graphs.
          console.warn(
            `legacy KTO merge skipped for ${url}: ${(error as Error).message}`,
          );
        }
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
    throw new Error(`Fetch failed: ${url}`);
  }

  /**
   * The archive's legacy KTO table, fetched once per version tag and shared by
   * every KTO-bearing request on the page.
   */
  private legacyKtoRows(version: Version): Promise<any[]> {
    const tag = version?.tag ?? "unknown";
    if (!this.legacyKto$[tag]) {
      const url = this.buildUrl(`${LEGACY_KTO_TABLE}?order=_date.desc`, version);
      this.legacyKto$[tag] = fetch(url).then((response) => {
        if (!response.ok) {
          throw new Error(`legacy KTO table unavailable (${response.status}) — ${url}`);
        }
        return response.json();
      });
      // Let a failed attempt be retried by the next page instead of caching it.
      this.legacyKto$[tag].catch(() => {
        delete this.legacyKto$[tag];
      });
    }
    return this.legacyKto$[tag];
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