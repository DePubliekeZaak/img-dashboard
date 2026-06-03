import { convertToCurrencyInTable } from "../../shared/_helpers";
import { GroupControllerV1 } from "../../shared/group-v1";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";
import type { IGroupMappingV2 } from "../../shared/interfaces";
import type { ImgData } from "../../shared/types";
import type { TableData } from "../../shared/types_graphs";

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
    if (graphWrapper !== undefined) {
      graphWrapper.style.marginTop = "2rem";
    }
    const source = HTMLSourceV2(
      graphWrapper?.parentElement as HTMLElement,
      this.page.main.params.language,
      "IMG",
    );
    return graphWrapper;
  }

  async init() {}

  prepareData(data: ImgData): any {
    const dataGroup = this.config.endpoints![0];
    const rows: string[][] = [];

    data[dataGroup] = data[dataGroup].filter((p) => p.complete);
    data[dataGroup] = data[dataGroup].filter(
      (p) => p[this.config.graphs[0].parameters[0][0].column] > 0,
    );

    const { tableParams, graphParams, graphData, timeline, definitions } =
      super.prepareData(data);

    for (const period of data[dataGroup]) {
      const row: string[] = [];
      row.push(period._year);
      row.push(period._month);
      // row.push(new Date(period._startdatum).toLocaleDateString('nl-NL',{'dateStyle':'short'}) + ' t/m ' + new Date(period._einddatum).toLocaleDateString('nl-NL',{'dateStyle':'short'}));

      for (const p of tableParams) {
        if (p.format === "currency") {
          row.push(convertToCurrencyInTable(period[p.column]));
        } else if (p.format === "percentage") {
          row.push((0.1 * Math.round(period[p.column] * 10)).toString() + "%");
        } else {
          if (period[p.column] !== null) {
            row.push((Math.round(period[p.column] * 100) / 100).toString());
          }
        }
      }

      rows.push(row);
    }

    const table = {
      headers: ["Jaar", "Maand"].concat(tableParams.map((p) => p.label)),
      rows,
    };



    return {
      graphData,
      graphData_alt: graphData,
      definitions,
      table,
      timeline,
    };
  }

  populateTable(tableData: TableData) {
    super.populateTable(tableData);
  }
}
