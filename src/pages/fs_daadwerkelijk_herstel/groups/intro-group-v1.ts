import { convertToCurrencyInTable } from "../../../shared/_helpers";
import { GroupControllerV1 } from "../../../shared/group-v1";
import { HTMLSourceV2 } from "../../../charts/renderers/html-source-v2";
import type { IGroupMappingV2 } from "../../../shared/interfaces";
import type { ImgData } from "../../../shared/types";
import { Definitions, type TableData } from "../../../shared/types_graphs";

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
    const source = HTMLSourceV2(
      graphWrapper?.parentElement as HTMLElement,
      this.page.main.params.language,
      "IMG",
    );
    return graphWrapper;
  }

  async init() {}

  prepareData(data: ImgData): any {
    if (this.config.graphs.length === 0) {
      return;
    }
    const dataGroup = this.config.endpoints![0];
    const rows: string[][] = [];

    const { tableParams, graphData, definitions, graphData_alt } =
      super.prepareData(data);
    const incremental: string[] = [];
    const cumulative: string[] = [];

    for (const p of this.config.graphs[0].parameters[0]) {
      incremental.push(data[dataGroup][0][p.column]);

      cumulative.push(data[dataGroup][0][p.column + "_cumulatief"]);
    }

    for (const period of graphData) {
      const row: string[] = [];
      row.push(period._year);
      row.push(period._week);
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
        } else if (p.format === "percentage") {
          row.push((0.1 * Math.round(period[p.column] * 10)).toString() + "%");
        } else {
          row.push(period[p.column]);
        }
      }

      rows.push(row);
    }

    const table = {
      headers: ["Jaar", "Week", "Periode"].concat(
        tableParams.map((p) => p.label),
      ), //  ["Betaalstroom"].concat(uniqueYears.map( y => y.toString())),
      rows,
    };

    return {
      current: graphData[0],
      graphData,
      graphData_alt,
      incremental,
      cumulative,
      table,
      definitions,
    };
  }

  populateTable(tableData: TableData) {
    super.populateTable(tableData);
  }
}
