import { pieParts, tables } from "../../../shared/data.factory";
import { preHeaders } from "../../../shared/factories/pre_headers";
import { GroupControllerV1 } from "../../../shared/group-v1";
import { HTMLSourceV2 } from "../../../charts/renderers/html-source-v2";
import type { IGroupMappingV2 } from "../../../shared/interfaces";
import type { ImgData } from "../../../shared/types";

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

    const weekEndpoints = this.group.resolvedEndpoints.filter(
      (e: any) => e.includes("aggregatie=eq.week")
    );

    const graphDataWeek = this.mergeByRegeling(data, weekEndpoints);

    let pies: any[] | null = null;
    const pieChartIndex = this.config.graphs.findIndex(
      (g) => g.ctrlr === "PieChartSumV1",
    );
    if (pieChartIndex !== -1) {
      pies = pieParts(this.group, graphDataWeek, this.config.graphs, pieChartIndex);
    }


    const pre_headers = preHeaders(this.config.graphs, this.segment)

    const { weekTableInc, monthTableInc, weekTableCumul, monthTableCumul } = tables(
      graphDataWeek,
      [],
      tableParams,
      pre_headers,
    );

    console.log({ weekTableInc, monthTableInc, weekTableCumul, monthTableCumul })

    return {
      numbers: graphDataWeek[0],
      graphDataWeek,
      weekTableInc,
      monthTableInc: null,
      weekTableCumul,
      monthTableCumul: null,
      definitions,
      timeline,
      ...(pies && { pies }),
    };
  }

  /**
   * Flatten all rows from the given endpoints into rows keyed by periode.
   * For each row, data columns are prefixed with the row's regeling_code
   * (lowercased) so entries with different regeling_code values end up
   * side-by-side in the same output row under distinct keys, e.g.
   *   { periode: "2026_29", ims_ingediend_aantal: 498, imk_ingediend_aantal: 79, … }
   */
  private mergeByRegeling(
    data: any,
    endpoints: string[],
  ): any[] {
    const merged: Record<string, any> = {};

    for (const endpoint of endpoints) {
      const rows = data[endpoint];
      if (!rows || rows.length === 0) continue;

      for (const row of rows) {
        const key = row.periode;
        if (!key) continue;

        if (!merged[key]) merged[key] = { periode: key };

        const prefix = (row.regeling_code ?? "").toLowerCase();
        if (!prefix) continue;

        for (const [col, val] of Object.entries(row)) {
          // keep internal / shared fields without prefix
          if (
            col === "periode" ||
            col === "regeling_code" ||
            col === "domein_code"
          ) continue;

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