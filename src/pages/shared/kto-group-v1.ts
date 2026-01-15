import { GroupControllerV1 } from "./group-v1";
import { IGroupMappingV2, IParameterMapping } from "./interfaces";
import { ImgData } from "./types";
import { TableData } from "./types_graphs";

import { HTMLSourceV2 } from "./html/html-source-v2";
import { relyOnCompleted } from "./factories/group";

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
    let source = HTMLSourceV2(
      graphWrapper?.parentElement as HTMLElement,
      this.page.main.params.language,
      "IMG",
    );
    return graphWrapper;
  }

  async init() {}

  prepareData(data: ImgData): any {
    let {
      tableParams,
      graphParams,
      graphDataMonth,
      definitions,
      graphDataWeek,
      timeline,
    } = super.prepareData(data);


    let { rows, _data } = relyOnCompleted(
      graphDataMonth,
      tableParams,
      graphParams,
    );

    const monthTable = {
      headers: ["Jaar", "Periode"].concat(tableParams.map((p) => p.label)),
      rows,
    };

    return {
      graphDataMonth,
      graphDataWeek,
      monthTable,
      weekTable: [],
      timeline,
      definitions,
    };
  }

  populateTable(tableData: TableData) {
    super.populateTable(tableData);
  }
}
