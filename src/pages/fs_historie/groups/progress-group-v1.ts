import { breakpoints } from "../../../img-modules/styleguide";
import {
  convertToCurrencyInTable,
  trimColumnsAndOrder,
} from "../../shared/_helpers";
import { filterUnique } from "../../shared/data.format.factory";
import { GroupControllerV1 } from "../../shared/group-v1";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";
import {
  type IGroupMappingV2,
  IParameterMapping,
} from "../../shared/interfaces";
import { DataObject, type ImgData } from "../../shared/types";
import { type TableData, TrendBar } from "../../shared/types_graphs";

export class ProgressGroupV1 extends GroupControllerV1 {
  constructor(
    public page: any,
    public config: IGroupMappingV2,
    public index: number,
  ) {
    super(page, config, index);
  }

  async init() {}

  html() {
    const graphWrapper = super.html();
    const source = HTMLSourceV2(
      graphWrapper?.parentElement as HTMLElement,
      this.page.main.params.language,
      "IMG",
    );
    return graphWrapper;
  }

  prepareData(data: ImgData): any {
    const dataGroup = this.config.endpoints[0];
    const rows: string[][] = [];

    let {
      tableParams,
      graphParams,
      graphData,
      graphData_alt,
      timeline,
      definitions,
    } = super.prepareData(data);

    for (const period of data[dataGroup]) {
      const row: string[] = [];
      row.push(period._year);
      row.push(period._month);
      row.push(
        new Date(period._startdatum).toLocaleDateString("nl-NL", {
          dateStyle: "short",
        }) +
          " t/m " +
          new Date(period._einddatum).toLocaleDateString("nl-NL", {
            dateStyle: "short",
          }),
      );

      for (const p of tableParams) {
        if (p.format === "currency") {
          row.push(convertToCurrencyInTable(period[p.column]));
        } else {
          row.push(period[p.column]);
        }
      }

      rows.push(row);
    }

    graphData = graphData.filter((p) => p._yearmonth < "202305");
    graphData_alt = graphData_alt.filter((p) => p._yearmonth < "202305");

    timeline = timeline.filter(
      (i) => new Date(i.date) < new Date("2023-05-01"),
    );

    const table = {
      headers: ["Jaar", "Maand", "Periode"].concat(
        tableParams.map((p) => p.label),
      ),
      rows,
    };

    return {
      numbers: graphData[0],
      graphData,
      graphData_alt,
      timeline,
      definitions,
      table,
    };
  }

  populateTable(tableData: TableData) {
    super.populateTable(tableData);
  }
}
