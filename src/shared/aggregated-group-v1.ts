
import { groupByPrefix, tables } from "./data.factory";
import { GroupControllerV1 } from "./group-v1";
import { HTMLSourceV2 } from "../charts/renderers/html-source-v2";
import type { IGroupMappingV2 } from "./interfaces";
import type { ImgData } from "./types";

const mapping: Record<string, string> = {
    mw: "MW",
    vv: "VV",
    ims: "IMS",
    imk: "IMK",
    wd: "WD",
    wnw: "WNW",
    namteg: "NAMTEG",
};

export class AggregatedGroupV1 extends GroupControllerV1 {
    constructor(
        public page: any,
        public config: IGroupMappingV2,
        public index: number,
    ) {
        super(page, config, index);
    }

    html() {
        const graphWrapper = super.html();
        void HTMLSourceV2(
            graphWrapper?.parentElement as HTMLElement,
            this.page.main.params.language,
            "IMG",
        );
        return graphWrapper;
    }

    async init() {}

    prepareData(data: ImgData): any {
        const { tableParams, graphParams, definitions, timeline } =
            super.prepareData(data);

        const aggregatie =
            this.segment.periodization === "monthly" ? "month" : "week";
        let endpoints = this.getAggregationEndpoints(aggregatie);

        const graphDataWeek = this.aggregateDataForPeriod(
            data,
            endpoints,
            aggregatie,
            graphParams
        );
        const graphDataMonth = this.aggregateDataForPeriod(
            data,
            endpoints,
            aggregatie,
            graphParams
        );

        const { weekTableInc, monthTableInc, weekTableCumul, monthTableCumul} = tables(
            graphDataWeek,
            graphDataMonth,
            tableParams,
            []
        );

    const numbers = graphDataWeek[0];

    console.log(numbers)

        return {
            numbers,
            graphDataWeek,
            // graphDataMonth: [],
            weekTableInc: [], 
            monthTableInc: [], 
            weekTableCumul, 
            monthTableCumul: [],
            definitions,
            timeline,
        };
    }


    tables (
    
      graphDataWeek: any[],
      tableParams: any[],
      pre_headers?: any[][],
    ) {
      const weekRows: string[][] = [];
      const monthRows: string[][] = [];

      const data = {
        ...graphDataWeek[0],
      }

      const prefixes = ['ims', 'imk'];

      const { grouped, ungrouped } = groupByPrefix(data, prefixes);

      let i = 0;
      for (const [key, group] of Object.entries(grouped)) {
        const row: string[] = [];
        row.push(this.config.graphs[i].header!);
        let j = 0;
        for (const [propKey, propValue] of Object.entries(group as any)) {

            if (this.config.graphs[0].parameters[0][j].format == 'percentage') {

                 row.push((Math.round(propValue as number * 10) / 10).toFixed(1) + "%");

            } else {
                row.push(String(propValue));
            }
            j++;
        }

        weekRows.push(row);
        i++;
    }
            
      const weekTable = {
        pre_headers: [],
        headers: ["Regeling"].concat(this.config.graphs[0].parameters[0].map( (c: any) => c.units ?? "")),  //  "Mediaan dagen tot besluit", "Toegekend", "bezwaar gemaakt","waardering"],
        rows: weekRows,
      };
    
      return { weekTable };
    }

    populateTable(tableData: any) {
        // Generate per-regeling rows from the merged graphDataWeek[0] row.
        // Columns = parameters (from graphs[0].parameters[0]), rows = regeling types.
        // This mirrors what NumbersV1 renders — one row per regeling with period values.
        const mergedRow = tableData.graphDataWeek?.[0];
        if (mergedRow) {
            const prefixes = ['ims', 'imk'];
            const weekRows: string[][] = [];

            for (let i = 0; i < Math.min(this.config.graphs.length, prefixes.length); i++) {
                const graph = this.config.graphs[i];
                const prefix = prefixes[i];
                const graphRow: string[] = [graph.header ?? ''];

                for (const param of graph.parameters[0]) {
                    // Try param column name directly, then construct prefixed version
                    let val = mergedRow[param.column];
                    if (val == null && param.column.includes('_')) {
                        const clean = param.column.split('_').slice(1).join('_');
                        val = mergedRow[prefix + '_' + clean];
                    }
                    if (param.format === 'percentage') {
                        graphRow.push(val != null ? (Math.round(val * 10) / 10).toFixed(1) + '%' : '-');
                    } else if (param.format === 'decimals') {
                        graphRow.push(val != null ? (val as number).toFixed(1) : '-');
                    } else {
                        graphRow.push(val != null ? String(val) : '-');
                    }
                }
                weekRows.push(graphRow);
            }

            (tableData as any).weekTableCumul = {
                pre_headers: [],
                headers: ['Regeling'].concat(
                    this.config.graphs[0].parameters[0].map((c: any) => c.units ?? ''),
                ),
                rows: weekRows,
            };
        }
        super.populateTable(tableData);
    }

    getAggregationEndpoints(aggregatie: "week" | "month"): string[] {
        const keys = this.getAggregationKeys();

        return keys.map(
            (key) =>
                `regelingen?aggregatie=eq.${aggregatie}&regeling_code=eq.${key}&order=periode.desc&limit=1`,
        );
    }

    // Extract regeling codes from column names
    private getAggregationKeys(): string[] {
        const columns = this.config.graphs.flatMap((g: any) =>
            g.parameters.flatMap((p: any) => p.map((param: any) => param.column)),
        );

        const prefixes = new Set(columns.map((c: any) => c.split("_")[0]));

        return Array.from(prefixes)
            .map((p) => mapping[p])
            .filter(Boolean) as string[];
    }

    // Aggregate data from multiple endpoints
    private aggregateDataForPeriod(
        data: any,
        endpoints: string[],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _period: "week" | "month",
        graphParams: any
    ): any[] {
        const allRows: any[] = [];

        // Collect all data from all endpoints
        for (const endpoint of endpoints) {
            const rows = data[endpoint] ? [data[endpoint][0]] : [];
            if (rows && rows.length > 0) {
                allRows.push(
                    ...rows.map((row: any) => ({
                        ...row,
                        _sourceRegeling: this.extractRegelingFromEndpoint(endpoint),
                    })),
                );
            }
        }

        if (allRows.length === 0) {
            return [];
        }


        const periods: any = {};

            for (const row of allRows) {

              // Copy metadata fields from first row so tables()/rowing() can
              // derive _year, _week, _startdatum, _einddatum for the table header
              if (Object.keys(periods).length === 0) {
                periods._year = row._year;
                periods._month = row._month;
                periods._week = row._week;
                periods._startdatum = row._startdatum;
                periods._einddatum = row._einddatum;
                periods.periode = row.periode;
              }

              if (row._sourceRegeling == "unknown") {

        for (const column of Object.values(graphParams).map( (p: any) => p.base.column)) {
          if (row[column] && row[column] !== undefined) periods[column] = row[column]
        }

      } else {

        const prefix = row._sourceRegeling.toLowerCase();
        for (const cleanCol of Object.values(graphParams).map( (p: any) => p.base.column.split('_').slice(1).join('_'))) {
          const prefixedCol = prefix + "_" + cleanCol;
          if (row[cleanCol] && row[cleanCol] !== undefined) periods[prefixedCol] = row[cleanCol];
        }
      }
    }
        return [periods]
    }

    // Helper to extract regeling code from endpoint URL
    private extractRegelingFromEndpoint(endpoint: string): string {
        const match = endpoint.match(/regeling_code=eq\.([A-Z]+)/);
        return match ? match[1] : "unknown";
    }
}
