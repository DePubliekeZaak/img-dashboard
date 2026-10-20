import { tables } from "../../../shared/data.factory";
import { preHeaders } from "../../../shared/factories/pre_headers";
import { GroupControllerV1 } from "../../../shared/group-v1";
import { HTMLSourceV2 } from "../../../charts/renderers/html-source-v2";
import type { IGroupMappingV2 } from "../../../shared/interfaces";
import type { ImgData } from "../../../shared/types";

/**
 * Merges the per-regeling endpoints of a group into rows keyed by periode,
 * prefixing every data column with the lowercased regeling_code so the
 * regelingen end up side-by-side in the same row, e.g.
 *   { periode: "2026_09", mw_kto_score_gemiddeld_cumul: 7.4, vv_kto_score_gemiddeld_cumul: 6.9, … }
 *
 * Graph params are then authored against one regeling's prefixed columns
 * (e.g. mw_*) as the default; a regeling-level selector can swap the prefix.
 * Mirrors DomainComparisonGroupV1 (which does the same for domein_code) and
 * returns the same data shape the KTORatingsV1 graph consumes.
 */
export class RegelingComparisonGroupV1 extends GroupControllerV1 {
  constructor(
    public page: any,
    public config: IGroupMappingV2,
    public index: number,
  ) {
    super(page, config, index);
  }

  html() {
    const graphWrapper = super.html();
    void HTMLSourceV2(
      graphWrapper?.parentElement as HTMLElement,
      this.page.main.params.language,
      "IMG",
    );
    return graphWrapper;
  }

  async init() {}

  prepareData(data: ImgData): any {
    const { tableParams, graphParams, definitions, timeline } =
      super.prepareData(data);

    const weekEndpoints = this.group.resolvedEndpoints.filter((e: any) =>
      e.includes("aggregatie=eq.week")
    );
    const monthEndpoints = this.group.resolvedEndpoints.filter((e: any) =>
      e.includes("aggregatie=eq.maand")
    );

    const graphDataWeek = this.mergeByRegeling(data, weekEndpoints);
    const graphDataMonth = this.mergeByRegeling(data, monthEndpoints);

    const pre_headers = preHeaders(this.config.graphs, this.segment);

    const { weekTableInc, monthTableInc, weekTableCumul, monthTableCumul } =
      tables([], graphDataMonth, tableParams, pre_headers);

    return {
      numbers: graphDataWeek[0],
      graphDataWeek,
      graphDataMonth,
      weekTableInc,
      monthTableInc,
      weekTableCumul,
      monthTableCumul,
      definitions,
      timeline,
    };
  }

  /**
   * Flatten all rows from the given endpoints into rows keyed by periode.
   * Each row's data columns are prefixed with that row's regeling_code
   * (lowercased), so the different regelingen end up side-by-side under
   * distinct keys (mw_*, vv_*, imk_*, ims_*, wd_*, wnw_*).
   */
  private mergeByRegeling(data: any, endpoints: string[]): any[] {
    const merged: Record<string, any> = {};

    for (const endpoint of endpoints) {
      const rows = data[endpoint];
      if (!rows || rows.length === 0) continue;

      for (const row of rows) {
        const key = row.periode;
        if (!key) continue;

        const prefix = (row.regeling_code ?? "").toLowerCase();
        if (!prefix) continue;

        if (!merged[key]) merged[key] = { periode: key };

        for (const [col, val] of Object.entries(row)) {
          // keep internal / shared fields without prefix
          if (
            col === "periode" ||
            col === "regeling_code" ||
            col === "domein_code"
          )
            continue;

          if (col.startsWith("_") || col === "aggregatie") {
            if (!(col in merged[key])) merged[key][col] = val;
            continue;
          }

          merged[key][`${prefix}_${col}`] = val;
        }
      }
    }

    return Object.values(merged).sort((a, b) =>
      String(b.periode).localeCompare(String(a.periode))
    );
  }
}
