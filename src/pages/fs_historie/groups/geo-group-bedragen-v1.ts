import * as topojson from "topojson-client";
import { convertToCurrencyInTable, slugify } from "../../shared/_helpers";
import { filterUnique, uniques } from "../../shared/data.format.factory";
import { geodata } from "../../shared/geodata";
import { GroupControllerV1 } from "../../shared/group-v1";
import { HTMLSourceV2 } from "../../shared/html/html-source-v2";
import {
  type IGroupMappingV2,
  IParameterMapping,
} from "../../shared/interfaces";
import { DataObject, ImgData } from "../../shared/types";
import {
  Bars,
  type Definitions,
  PiePart,
  type TableData,
} from "../../shared/types_graphs";

export class GeoGroupBedragenV1 extends GroupControllerV1 {
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

  prepareData(data: any): any {
    // @ts-expect-error
    const geojson: any = topojson.feature(geodata, geodata.objects.gemeenten);
    const features = geojson.features;

    const dataGroup = "map";
    const rows: (string | number)[][] = [];
    const years: any[] = [];
    const definitions: Definitions = [];
    const geo: any[] = [];

    const graph_1 = this.config.graphs[0];
    const params_1 = graph_1.parameters[0].concat(...graph_1.parameters[1]);
    const param = params_1[0];

    // console.log(param);

    const grouped: any[] = [];
    const uniqueYears = ["2019", "2020", "2021", "2022", "2023"]; //filterUnique(data[dataGroup], "_year");
    const uniqueMunis = filterUnique(data[dataGroup], "gemeente")
      .filter((g) => g !== "all")
      .sort();

    for (const muni of uniqueMunis) {
      const row: (number | string)[] = [];
      row.push(muni);
      for (const year of uniqueYears) {
        const o = data[dataGroup].find(
          (i) => i._year === year && i.gemeente === muni,
        );
        if (o !== undefined) {
          if (param.format === "currency") {
            row.push(convertToCurrencyInTable(o[param.column]));
          } else {
            row.push(o[param.column] + "%");
          }
        } else {
          row.push("n < 25");
        }
      }
      rows.push(row);
    }

    for (const year of uniqueYears) {
      grouped.push(data[dataGroup].filter((p: any) => p._year === year));
    }

    for (const yearData of grouped) {
      const augmentedFeatures: any[] = [];

      for (const feature of features) {
        const f = JSON.parse(JSON.stringify(feature));

        const obj = yearData.find((z) => {
          return (
            slugify(z.gemeente).toLowerCase() ===
            slugify(feature.properties.gemeentenaam).toLowerCase()
          );
        });

        if (obj !== undefined) {
          f.properties["value"] = obj[param.column];

          f.properties.colour = param.colour;
          f.properties.format = param.format;
        }

        f.properties.year = yearData[0]._year;
        augmentedFeatures.push(f);
      }

      geo.push(augmentedFeatures);
    }

    params_1.forEach((p, i) => {
      definitions.push({
        name: p.label,
        description: p.description || "lorem ipsum",
      });
    });

    const table = {
      headers: ["Gemeente"].concat(uniqueYears.map((y) => y.toString())),
      rows,
    };

    return {
      geo,
      definitions,
      table,
    };
  }

  populateTable(tableData: TableData) {
    super.populateTable(tableData);
  }

  // update(data: DataObject, segment: string, update: boolean) {

  //     super.update(data,segment,update)
  // }
}
