import { tables } from "../../shared/data.factory";
import { preHeaders } from "../../shared/factories/pre_headers";
import { GroupControllerV1 } from "../../shared/group-v1";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";
import type { IGroupMappingV2 } from "../../shared/interfaces";
import type { ImgData } from "../../shared/types";

const domeinPrefixMap: Record<string, string> = {
  FYSIEK: "fs",
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


    // const weekEndpoints = this.group.resolvedEndpoints.filter(
    //   (e) => e.includes("aggregatie=eq.week")
    // );
    const monthEndpoints = this.group.resolvedEndpoints.filter(
      (e) => e.includes("aggregatie=eq.maand")
    );

    // const graphDataWeek = this.mergeByDomein(data, weekEndpoints, "week");
    const graphDataMonth = this.mergeByDomein(data, monthEndpoints, "month");

    const pre_headers = preHeaders(this.config.graphs, this.segment)
    
    const { weekTableInc, monthTableInc, weekTableCumul, monthTableCumul} = tables(
      [],
      graphDataMonth,
      tableParams,
      pre_headers,
    );

    return {
    //   graphDataWeek,
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
    const match = endpoint.match(/domein_code=eq\.([A-Z]+)/);
    if (!match) return null;
    return domeinPrefixMap[match[1]] ?? null;
  }
}