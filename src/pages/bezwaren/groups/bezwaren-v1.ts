import { GroupControllerV1 } from "../../../shared/group-v1";
import { HTMLSourceV2 } from "../../../charts/renderers/html-source-v2";
import type {
  IGroupMappingV2,
  IParameterMapping,
} from "../../../shared/interfaces";
import type { ImgData } from "../../../shared/types";
import type {
  Definitions,
  PiePart,
  TableData,
} from "../../../shared/types_graphs";

export class BezwarenV1 extends GroupControllerV1 {
  circleGroup: any;
  barProgression: any;

  funcList: any;
  yearSelector;

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
    const pies: PiePart[][] = [];
    const dataGroup = this.config.endpoints[0];
    const rows: (string | number)[][] = [];
    const definitions: Definitions = [];

    const { tableParams, graphParams, graphData } = super.prepareData(data);
    const params = [] as IParameterMapping[];

    for (const period of data[dataGroup].filter((p) => p._year > 2019)) {
      const row: (number | string)[] = [];
      row.push(period._year);
      row.push(period._month);
      row.push(
        new Date(period._einddatum).toLocaleDateString("nl-NL", {
          dateStyle: "short",
        }),
      );

      let total = 0;
      for (const param of tableParams) {
        row.push(period[param.column]);
        total = total + period[param.column];
      }

      rows.push(row);
    }

    for (const graph of this.config.graphs) {
      const parts: PiePart[] = [];

      for (const p of graph.parameters[0]) {
        parts.push({
          label: p.label,
          value: data[dataGroup][0][p.column],
          colour: p.colour,
          accented: false,
          format: "",
          include: true,
        });
      }

      for (const p of graph.parameters[1]) {
        parts.push({
          label: p.label,
          value: data[dataGroup][0][p.column],
          colour: p.colour,
          accented: false,
          format: "",
          include: false,
        });
      }

      pies.push(parts);
    }

    tableParams.forEach((p, i) => {
      definitions.push({
        name: p.label,
        description: p.description || "lorem ipsum",
      });
    });

    const table = {
      headers: ["Jaar", "Maand", "Datum"].concat(
        tableParams.map((p) => p.label),
      ), //  ["Betaalstroom"].concat(uniqueYears.map( y => y.toString())),
      rows,
    };

    return {
      pies,
      graphData,
      definitions,
      table,
    };
  }

  populateTable(tableData: TableData) {
    super.populateTable(tableData);
  }
}
