import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { ImgData } from "../../shared/types";
import { TableData } from "../../shared/types_graphs";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";
import { incVsCum, tables, pieParts } from "../../shared/data.factory";
import { preHeaders } from "../../shared/factories/pre_headers";

export class MuniGroupV1 extends GroupControllerV1 {
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

    const _data = JSON.parse(JSON.stringify(data));

    console.log(data)

    for (const e of this.config.endpoints) {
        _data[e] = _data[e].filter( d => d.gemeente == this.page.segment.gemeente);
    }

    console.log("_d", _data);

    const {
      tableParams,
      graphParams,
      graphDataMonth,
      definitions,
      graphDataWeek,
      timeline,
    } = super.prepareData(_data);

    const { incremental, cumulative } = incVsCum(graphDataWeek, this.config);

    const nIndex = this.config.graphs.findIndex((g) => g.ctrlr === "NumbersV1");

    const numbers =
      nIndex !== -1
        ? graphDataWeek[0]
        : this.segment.cumulative
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
