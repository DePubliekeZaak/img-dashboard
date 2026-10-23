import { tables } from "../../../shared/data.factory";
import { preHeaders } from "../../../shared/factories/pre_headers";
import { GroupControllerV1 } from "../../../shared/group-v1";
import { HTMLSourceV2 } from "../../../charts/renderers/html-source-v2";
import type { IGroupMappingV2 } from "../../../shared/interfaces";
import type { ImgData } from "../../../shared/types";

const domeinPrefixMap: Record<string, string> = {
  Totaal: "totaal",
  FYSIEK: "fysiek",
  IMS: "ims",
  WDL: "wdl",
};

export class DomainComparisonGroupV1 extends GroupControllerV1 {
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


    const weekEndpoints = this.group.resolvedEndpoints.filter(
      (e) => e.includes("aggregatie=eq.week")
    );
    const monthEndpoints = this.group.resolvedEndpoints.filter(
      (e: any) => e.includes("aggregatie=eq.maand")
    );

    const graphDataWeek = this.mergeByDomein(data, weekEndpoints, "week");
    const graphDataMonth = this.mergeByDomein(data, monthEndpoints, "month");

    const pre_headers = preHeaders(this.config.graphs, this.segment)

    // all_waardering + waardering_regelingen: two symmetric tables — a
    // "cumul" (Optellend) and an "incremental" (Toename) table with the SAME
    // 8 columns (Totaal + 3 domeinen x score + respondenten). The domein
    // metrics only carry _cumul params on the graphs, so synthesize their
    // non-cumul twins here, so the incremental table covers the same data
    // instead of only graph 2's columns. Other groups keep the conventional
    // split.
    //
    // waardering_regelingen's graphs are authored against the default domein
    // (fysiek_*), so first expand its table params to Totaal + all domeinen;
    // all_waardering's params already cover every domein.
    let tableParamsForTables = tableParams;
    if (
      this.config.slug === "all_waardering" ||
      this.config.slug === "waardering_regelingen"
    ) {
      const bandLabel: Record<string, string> = {
        totaal: "Totaal",
        fysiek: "Fysieke schade",
        ims: "Immateriele schade",
        wdl: "Waardedaling",
      };
      const base =
        this.config.slug === "waardering_regelingen"
          ? tableParams.flatMap((p) =>
              ["totaal", "fysiek", "ims", "wdl"].map((prefix) => ({
                ...p,
                column: p.column.replace(/^fysiek_/, `${prefix}_`),
                table_label: bandLabel[prefix],
              })),
            )
          : tableParams;

      const synthesized = base
        .filter((p) => p.column.endsWith("_cumul"))
        .map((p) => ({ ...p, column: p.column.replace(/_cumul$/, "") }))
        .filter((s) => !base.some((p) => p.column === s.column));
      // Sort by table_label (stable) so columns sharing a band label become
      // adjacent — tableBands() builds the pre-header bands from consecutive
      // runs, so this keeps the colspan grouping aligned with the columns.
      // Band order follows first appearance in the config (Totaal first, then
      // each domein), not alphabetical.
      const labelOrder = new Map<string, number>();
      for (const p of base) {
        const key = p.table_label ?? "\uffff";
        if (!labelOrder.has(key)) labelOrder.set(key, labelOrder.size);
      }
      tableParamsForTables = [...base, ...synthesized].sort(
        (a, b) =>
          (labelOrder.get(a.table_label ?? "\uffff") ?? 0) -
          (labelOrder.get(b.table_label ?? "\uffff") ?? 0),
      );
    }

    const { weekTableInc, monthTableInc, weekTableCumul, monthTableCumul} = tables(
      graphDataWeek,
      graphDataMonth,
      tableParamsForTables,
      pre_headers,
    );

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

  private mergeByDomein(
    data: any,
    endpoints: string[],
    period: "week" | "month"
    ): any[] {
    const merged: Record<string, any> = {};

    for (const endpoint of endpoints) {


        const prefix = this.extractDomeinPrefix(endpoint);
        if (!prefix) continue;

        const rows = data[endpoint];
        if (!rows || rows.length === 0) continue;

        for (const row of rows) {
        const key = row.periode;
        if (!key) continue;

        if (!merged[key]) merged[key] = { periode: key };

        for (const [col, val] of Object.entries(row)) {
            if (col.startsWith("_") || col == 'periode' || col == 'aggregatie') {
                merged[key][`${col}`] = val;
            } else {
                merged[key][`${prefix}_${col}`] = val;
            }
        }
        }
    }

    return Object.values(merged).sort((a, b) =>
        String(b.periode).localeCompare(String(a.periode))
    );
    }

  private extractDomeinPrefix(endpoint: string): string | null {
    const match = endpoint.match(/domein_code=eq\.([A-Z]+)/i);
    if (!match) return null;
    return domeinPrefixMap[match[1]] ?? null;
  }
}