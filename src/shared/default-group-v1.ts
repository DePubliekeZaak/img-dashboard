import { getGroupSegment } from "../stores/segment.store";
import { incVsCum, pieParts, tables } from "./data.factory";
import { preHeaders } from "./factories/pre_headers";
import { GroupControllerV1 } from "./group-v1";
import { HTMLSourceV2 } from "../charts/renderers/html-source-v2";
import type { IGroupMappingV2 } from "./interfaces";
import type { ImgData } from "./types";
import type { TableData } from "./types_graphs";

export class DefaultGroupV1 extends GroupControllerV1 {
  constructor(
    public page: any,
    public config: IGroupMappingV2,
    public index: number,
  ) {
    super(page, config, index);
  }

  html() {
    const graphWrapper = super.html();
    const source = HTMLSourceV2(
      graphWrapper?.parentElement as HTMLElement,
      this.page.main.params.language,
      "IMG",
    );
    return graphWrapper;
  }

  async init() {}

  prepareData(data: ImgData): any {

    const {
      tableParams,
      graphParams,
      graphDataMonth,
      definitions,
      graphDataWeek,
      timeline,
    } = super.prepareData(data);

    if (this.config.slug == "all_totals") {

      for (let p of graphDataWeek) {

        p["bedrag_betaald_totaal_cumul_eur"] = "-";
        // p["bedrag_betaald_totaal_eur"] = "-";
      }

      graphDataWeek[0]["bedrag_betaald_totaal_cumul_eur"] = graphDataMonth[graphDataMonth.length - 1]["bedrag_betaald_totaal_cumul_eur"]
    //   graphDataWeek[0]["bedrag_betaald_totaal_eur"] = graphDataMonth[graphDataMonth.length - 1]["bedrag_betaald_totaal_eur"] 
    }

    const { incremental, cumulative } = incVsCum(graphDataWeek, graphParams);

    const nIndex = this.config.graphs.findIndex((g) => g.ctrlr === "NumbersV1");

    const groupSegment = getGroupSegment(this.config.slug);
    const numbers =
      nIndex !== -1
        ? graphDataWeek[0]
        : groupSegment?.cumulative
          ? cumulative
          : incremental;
        

    let pies: any[] | null = null;
    const pieChartIndex = this.config.graphs.findIndex(
      (g) => g.ctrlr === "PieChartSumV1",
    );
    if (pieChartIndex !== -1) {
      pies = pieParts(this.group, graphDataWeek, this.config.graphs, pieChartIndex);
    }

    const pre_headers = preHeaders(this.config.graphs, this.segment);

    const { weekTableInc, monthTableInc, weekTableCumul, monthTableCumul,} = tables(
      graphDataWeek,
      graphDataMonth,
      tableParams,
      pre_headers,
    );

    return {
      numbers,
      graphDataWeek,
      graphDataMonth,
      incremental,
      cumulative,
      ...(pies && { pies }),
      weekTableInc,
      monthTableInc,
      weekTableCumul,
      monthTableCumul,
      definitions,
      timeline,
    };
  }

  populateTable(tableData: TableData) {
    super.populateTable(tableData);
  }
}
