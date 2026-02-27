import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { ImgData } from "../../shared/types";
import { TableData } from "../../shared/types_graphs";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";
import { incVsCum, tables, pieParts, incVsCum2 } from "../../shared/data.factory";
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


  mapRow = (row: any) => {
    const isNewApi = row.aggregatie !== undefined;
    
    if (!isNewApi) return { ...row, _isNewApi: false };
    
    return {
          ...row,
          _isNewApi: true,
          _startdatum: row.periode_vanaf,
          _einddatum: row.periode_totenmet,
          _year: parseInt(row.periode?.split('_')[0]),
          _month: parseInt(row.periode?.split('_')[1]),
          _week: parseInt(row.periode?.split('_')[1]),
          _yearmonth: row.periode,
          _yearweek: row.periode,
      };
  };

  prepareData(data: ImgData): any {

    const _data = JSON.parse(JSON.stringify(data));

    for (const e of this.config.endpoints) {
        _data[e] = _data[e]
            .filter(d => d.gemeente == this.page.segment.gemeente)
            .map(r => this.mapRow(r));  // map retourneert nieuwe array
    }



    const {
      tableParams,
      graphParams,
      graphDataMonth,
      definitions,
      graphDataWeek,
      timeline,
    } = super.prepareData(_data);


    const { incremental, cumulative } = incVsCum2(graphDataWeek, this.config);



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
