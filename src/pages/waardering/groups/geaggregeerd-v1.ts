import { convertToCurrencyInTable } from "../../shared/_helpers";
import { filterUnique } from "../../shared/data.format.factory";
import { GroupControllerV1 } from "../../shared/group-v1";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";
import {
  type IGroupMappingV2,
  IParameterMapping,
} from "../../shared/interfaces";
import { DataObject, type ImgData } from "../../shared/types";
import {
  Bar,
  Bars,
  Line,
  PiePart,
  type TableData,
} from "../../shared/types_graphs";

export class GeaggregeerdV1 extends GroupControllerV1 {
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
    const dataGroup = this.config.endpoints![0];
    const rows: string[][] = [];

    data[dataGroup] = data[dataGroup].filter((p) => p.complete);

    const { tableParams, graphParams, graphData, timeline, definitions } =
      super.prepareData(data);

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
        } else if (p.format === "percentage") {
          row.push((0.1 * Math.round(period[p.column] * 10)).toString() + "%");
        } else {
          if (period[p.column] !== null) {
            row.push(period[p.column].toFixed(2));
          }
        }
      }

      rows.push(row);
    }

    const table = {
      headers: ["Jaar", "Maand", "Periode"].concat(
        tableParams.map((p) => p.label),
      ),
      rows,
    };

    return {
      graphData,
      timeline,
      definitions,
      table,
    };
  }

  populateTable(tableData: TableData) {
    super.populateTable(tableData);
  }
}
