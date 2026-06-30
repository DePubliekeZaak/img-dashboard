import { ObjectLiteralExpression } from "ts-morph";
import { convertToCurrencyInTable } from "../../../shared/_helpers";
import { groupByPrefix, tables } from "../../../shared/data.factory";
import { preHeaders } from "../../../shared/factories/pre_headers";
import { GroupControllerV1 } from "../../../shared/group-v1";
import { HTMLSourceV2 } from "../../../charts/renderers/html-source-v2";
import type { IGroupMappingV2 } from "../../../shared/interfaces";
import type { ImgData } from "../../../shared/types";
import type { TableData } from "../../../shared/types_graphs";

const mapping: Record<string, string> = {
    mw: "MW",
    vv: "VV",
    ims: "IMS",
    imk: "IMK",
    wd: "WD",
    wnw: "WNW",
    namteg: "NAMTEG",
};

export class ComparisonGroupV1 extends GroupControllerV1 {
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
    	endpoints.push('tevredenheid')

		// Extract needed API columns from graphParams


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
		mw_doorlopend_cijfer : graphDataWeek[0]['fysieke_schade_doorlopend_cijfer'] ,
		imk_doorlopend_cijfer : graphDataWeek[0]['imkj_doorlopend_cijfer'] ,
		wd_doorlopend_cijfer : graphDataWeek[0]['waardedaling_doorlopend_cijfer'],
		wnw_doorlopend_cijfer : graphDataWeek[0]['waardedaling_doorlopend_cijfer'],
		vv_doorlopend_cijfer : graphDataWeek[0]['ves_doorlopend_cijfer'],
	  }

	  const prefixes = ['mw', 'vv', 'ims', 'imk', 'wd', 'wnw'];

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
		headers: ["Regeling"].concat(this.config.graphs[0].parameters[0].map( c => c.units ?? "")),  //  "Mediaan dagen tot besluit", "Toegekend", "bezwaar gemaakt","waardering"],
		rows: weekRows,
	  };
	
	  return { weekTable };
	}

	populateTable(tableData: TableData) {
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
		const columns = this.config.graphs.flatMap((g) =>
			g.parameters.flatMap((p) => p.map((param) => param.column)),
		);

		const prefixes = new Set(columns.map((c) => c.split("_")[0]));

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
