import { convertToCurrencyInTable } from "../../shared/_helpers";
import { GroupControllerV1 } from "../../shared/group-v1";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";
import type { IGroupMappingV2 } from "../../shared/interfaces";
import type { ImgData } from "../../shared/types";
import { Definitions, type TableData } from "../../shared/types_graphs";

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
    const dataGroup = this.config.endpoints![0];
    const rows: string[][] = [];

    const {
      tableParams,
      graphParams,
      graphData,
      timeline,
      definitions,
      graphData_alt,
    } = super.prepareData(data);
    const incremental: Array<{ [key: number]: string }> = [];
    const cumulative: Array<{ [key: number]: string }> = [];

    for (let i = 0; i < this.config.graphs[0].parameters[0].length; i++) {
      incremental.push({
        0: String(
          data[dataGroup][0][this.config.graphs[0].parameters[0][i].column],
        ),
        1: String(
          data[dataGroup][0][this.config.graphs[0].parameters[1][i].column],
        ),
      });

      cumulative.push({
        0: String(
          data[dataGroup][0][
            this.config.graphs[0].parameters[0][i].column + "_cumulatief"
          ],
        ),
        1: String(
          data[dataGroup][0][this.config.graphs[0].parameters[1][i].column],
        ),
      });
    }

    //  console.log(graphParams);
    // console.log(incremental);
    // console.log(cumulative);

    // for (let p of this.config.graphs[0].parameters[0]) {

    //     incremental.push(
    //         data[dataGroup][0][p.column]
    //     )

    //     cumulative.push(
    //         data[dataGroup][0][p.column + '_cumulatief']
    //     )
    // }

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
          const v = period[p.column] !== null ? period[p.column].toFixed(1) : 0;

          row.push(v + "%");
        } else {
          row.push(period[p.column]);
        }
      }

      rows.push(row);
    }

    const table = {
      pre_headers: [
        { label: "", length: 3 },
        { label: "Aantal bezwaren", length: 3 },
        { label: "Bezwaarpercentage", length: 3 },
      ],
      headers: ["Jaar", "Maand", "Periode"].concat(
        tableParams.map((p) => p.label),
      ), //  ["Betaalstroom"].concat(uniqueYears.map( y => y.toString())),
      rows,
    };

    return {
      numbers: graphData[0],
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
