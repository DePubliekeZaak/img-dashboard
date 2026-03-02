import { GroupControllerV1 } from "../../shared/group-v1";
import type { IGroupMappingV2 } from "../../shared/interfaces";
import type { ImgData } from "../../shared/types";
import type { TableData } from "../../shared/types_graphs";

export class IntroGroupV1 extends GroupControllerV1 {
  constructor(
    public page: any,
    public config: IGroupMappingV2,
    public index: number,
  ) {
    super(page, config, index);
  }

  html() {
    const graphWrapper = super.html();

    return graphWrapper;
  }

  async init() {}

  prepareData(data: ImgData): any {
    const { tableParams, graphData, definitions, graphData_alt, timeline } =
      super.prepareData(data);

    return {
      // current: graphData[0],
      graphData,
      graphData_alt,
      tableParams,
      definitions,
      timeline,
    };
  }

  populateTable(tableData: TableData) {
    super.populateTable(tableData);
  }
}
