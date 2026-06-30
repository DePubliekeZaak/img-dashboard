import { ktoTables, tables } from "./data.factory";
import { relyOnCompleted } from "./factories/group";
import { GroupControllerV1 } from "./group-v1";
import { HTMLSourceV2 } from "../charts/renderers/html-source-v2";
import { type IGroupMappingV2, IParameterMapping } from "./interfaces";
import type { ImgData } from "./types";
import type { TableData } from "./types_graphs";

export class KTOGroupV1 extends GroupControllerV1 {
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

    const { rows, _data } = relyOnCompleted(
      graphDataMonth,
      tableParams,
      graphParams,
    );

    // const monthTable = {
    //   headers: ["Jaar", "Maand"].concat(tableParams.map((p: any) => p.label)),
    //   rows,
    // };

    const { monthTableInc} = ktoTables(
      graphDataWeek,
      graphDataMonth,
      tableParams,
      []
    );

    return {
      graphDataMonth,
      graphDataWeek,
      weekTableInc: [], 
      monthTableInc, 
      weekTableCumul: [], 
      monthTableCumul: [],
      timeline,
      definitions,
    };
  }

  populateTable(tableData: TableData) {
    super.populateTable(tableData);
  }
}
