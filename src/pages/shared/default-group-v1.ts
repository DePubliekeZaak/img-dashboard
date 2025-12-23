import { GroupControllerV1 } from "./group-v1";
import { IGroupMappingV2 } from "./interfaces";
import { ImgData } from "./types";
import { TableData } from "./types_graphs";
import { HTMLSourceV2 } from "./html/html-source-v2";
import { incVsCum, tables, pieParts } from "./data.factory";
import { preHeaders } from "./factories/pre_headers";

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
    let source = HTMLSourceV2(
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

    const { incremental, cumulative } = incVsCum(graphDataWeek, this.config);

    const nIndex = this.config.graphs.findIndex((g) => g.ctrlr === "NumbersV1");

    const numbers =
      nIndex !== -1
        ? graphDataWeek[0]
        : this.page.segment.groups[this.config.slug]
          ? cumulative
          : incremental;

    let pies: any[] | null = null;
    const pieChartIndex = this.config.graphs.findIndex(
      (g) => g.ctrlr === "PieChartSumV1",
    );
    if (pieChartIndex !== -1) {
      pies = pieParts(graphDataWeek, this.config.graphs, pieChartIndex);
    }

    const pre_headers = preHeaders(this.config.graphs, this.segment);


    const { weekTable, monthTable } = tables(
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
      weekTable,
      monthTable,
      definitions,
      timeline,
    };
  }

  populateTable(tableData: TableData) {
    super.populateTable(tableData);
  }
}
