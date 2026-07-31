import type { IPageConfig } from "../../shared/interfaces";

const pageConfig: IPageConfig = {
  slug: "gemeente",
  segment: {
    key: "",
    gemeente: "Aa en Hunze",
    periodization: "weekly",
    cumulative: false,
    vanaf: "2025-01-01"
  },
  filters: ["gemeenten", "vanaf"],
  endpoints: [
    "gemeenten?aggregatie=eq.maand&gemeente=eq.{GEMEENTE}&order=periode.desc",
    "gemeenten?aggregatie=eq.week&order=periode.desc&periode_vanaf=gte.{VANAF}&gemeente=eq.{GEMEENTE}&order=periode.desc",
  ],
  groups: [
    {
      slug: "gemeenten_maatwerk",
      ctrlr: "RegelingComparisonGroupV1",
      filters: [],
      graphs: [
        {
          slug: "gemeente_numbers_v1",
          ctrlr: "NumbersMultiplesV1",
          args: [],
          filters: ["cumulativeVsDelta"],
          multiples: "cumulative",
          parameters: [
            [
              { label: "Meldingen", column: "mw_ingediend", colour: "orange", units: "meldingen", modifiers: { cumul: "_cumul", delta: "_aantal" } },
              { label: "Afgehandeld", column: "mw_afgerond", colour: "moss", units: "afgehandeld", modifiers: { cumul: "_cumul", delta: "_aantal" } },
            ],
            [],
          ],
          segment: { key: "mw_ingediend", cumulative: true, periodization: "weekly" },
        },
        {
          slug: "gemeente_trend",
          ctrlr: "BarTrendV1",
          args: [],
          filters: ["parameterSelect", "cumulativeVsDelta"],
          parameters: [
            [
              { label: "Meldingen", column: "mw_ingediend", colour: "orange", units: "meldingen", modifiers: { cumul: "_cumul", delta: "_aantal" } },
              { label: "Afgehandeld", column: "mw_afgerond", colour: "moss", units: "afgehandeld", modifiers: { cumul: "_cumul", delta: "_aantal" } },
            ],
          ],
          segment: { key: "mw_ingediend", cumulative: false, periodization: "weekly" },
        },
        {
          slug: "gemeente_toegekend_taart",
          ctrlr: "PieChartSumV1",
          args: [],
          parameters: [
            [
              { label: "Toegekend", column: "mw_toegekend", colour: "moss", scale: "null", format: "", modifiers: { cumul: "_cumul", delta: "_aantal" }},
              { label: "Afgewezen", column: "mw_afgewezen", colour: "orange", scale: "null", format: "", modifiers: { cumul: "_cumul", delta: "_aantal" } },
            ],
            [
              { label: "Afgehandeld", column: "mw_afgerond_cumul", colour: "gray", scale: "null", format: "", excludeFromTable: true  },
            ],
          ],
        },
      ],
      segment: { key: "mw_ingediend", cumulative: true, periodization: "weekly"},
      functionality: ["table", "definitions", "download"],
    },
    {
      slug: "gemeenten_vv",
      ctrlr: "RegelingComparisonGroupV1",
      filters: [],
      graphs: [
        {
          slug: "gemeente_numbers_vv_v1",
          ctrlr: "NumbersMultiplesV1",
          args: [],
          filters: ["cumulativeVsDelta"],
          multiples: "cumulative",
          parameters: [
            [
              { label: "Meldingen", column: "vv_ingediend", colour: "orange", units: "zaken", modifiers: { cumul: "_cumul", delta: "_aantal" } },
              { label: "Afgehandeld", column: "vv_afgerond", colour: "moss", units: "besluiten", modifiers: { cumul: "_cumul", delta: "_aantal" } },
            ],
            [],
          ],
          segment: { key: "vv_ingediend", cumulative: true, periodization: "latest" },
        },
        {
          slug: "gemeente_trend_vv",
          ctrlr: "BarTrendV1",
          args: [],
          filters: ["parameterSelect", "cumulativeVsDelta"],
          parameters: [
            [
              { label: "Meldingen", column: "vv_ingediend", colour: "orange", units: "meldingen", modifiers: { cumul: "_cumul", delta: "_aantal" } },
              { label: "Afgehandeld", column: "vv_afgerond", colour: "moss", units: "besluiten", modifiers: { cumul: "_cumul", delta: "_aantal" } },
            ],
          ],
          segment: { key: "vv_ingediend", cumulative: false, periodization: "weekly" },
        },
        {
          slug: "gemeente_toegekend_taart_vv",
          ctrlr: "PieChartSumV1",
          args: [],
          parameters: [
            [
              { label: "Toegekend", column: "vv_toegekend", colour: "moss", scale: "null", format: "", modifiers: { cumul: "_cumul", delta: "_aantal" } },
              { label: "Afgewezen", column: "vv_afgewezen", colour: "orange", scale: "null", format: "", modifiers: { cumul: "_cumul", delta: "_aantal" } },
            ],
            [
              { label: "Afgehandeld", column: "vv_afgerond_cumul", colour: "gray", scale: "null", format: "", excludeFromTable: true  },
            ],
          ],
        },
      ],
      segment: { key: "vv_ingediend", cumulative: true, periodization: "weekly" },
      functionality: ["table", "definitions", "download"],
    },
    {
      slug: "gemeenten_ims",
      ctrlr: "RegelingComparisonGroupV1",
      filters: [],
      graphs: [
        {
          slug: "gemeente_numbers_v1_ims",
          ctrlr: "NumbersMultiplesV1",
          args: [],
          filters: ["cumulativeVsDelta"],
          multiples: "cumulative",
          parameters: [
            [
              { label: "Meldingen", column: "ims_ingediend", colour: "orange", units: "zaken", modifiers: { cumul: "_cumul", delta: "_aantal" } },
              { label: "Afgehandeld", column: "ims_afgerond", colour: "moss", units: "besluiten", modifiers: { cumul: "_cumul", delta: "_aantal" } },
            ],
            [],
          ],
          segment: { key: "ims_ingediend", cumulative: true, periodization: "latest" },
        },
        {
          slug: "gemeente_trend_ims",
          ctrlr: "BarTrendV1",
          args: [],
          filters: ["parameterSelect", "cumulativeVsDelta"],
          parameters: [
            [
              { label: "Meldingen", column: "ims_ingediend", colour: "orange", units: "meldingen", modifiers: { cumul: "_cumul", delta: "_aantal" } },
              { label: "Afgehandeld", column: "ims_afgerond", colour: "moss", units: "besluiten", modifiers: { cumul: "_cumul", delta: "_aantal" } },
            ],
          ],
          segment: { key: "ims_ingediend", cumulative: false, periodization: "weekly" },
        },
        {
          slug: "gemeente_toegekend_taart_ims",
          ctrlr: "PieChartSumV1",
          args: [],
          parameters: [
            [
              { label: "Toegekend", column: "ims_toegekend", colour: "moss", scale: "null", format: "", modifiers: { cumul: "_cumul", delta: "_aantal" } },
              { label: "Afgewezen", column: "ims_afgewezen", colour: "orange", scale: "null", format: "", modifiers: { cumul: "_cumul", delta: "_aantal" } },
            ],
            [
              { label: "Afgehandeld", column: "ims_afgerond_cumul", colour: "gray", scale: "null", format: "", excludeFromTable: true  },
            ],
          ],
        },
      ],
      segment: { key: "ims_ingediend", cumulative: true, periodization: "weekly" },
      functionality: ["table", "definitions", "download"],
    },
    {
      slug: "gemeenten_imk",
      ctrlr: "RegelingComparisonGroupV1",
      filters: [],
      graphs: [
        {
          slug: "gemeente_numbers_v1_imk",
          ctrlr: "NumbersMultiplesV1",
          args: [],
          filters: ["cumulativeVsDelta"],
          multiples: "cumulative",
          parameters: [
            [
              { label: "Meldingen", column: "imk_ingediend", colour: "orange", units: "zaken", modifiers: { cumul: "_cumul", delta: "_aantal" } },
              { label: "Afgehandeld", column: "imk_afgerond", colour: "moss", units: "besluiten", modifiers: { cumul: "_cumul", delta: "_aantal" } },
            ],
            [],
          ],
          segment: { key: "imk_ingediend", cumulative: true, periodization: "latest" },
        },
        {
          slug: "gemeente_trend_imk",
          ctrlr: "BarTrendV1",
          args: [],
          filters: ["parameterSelect", "cumulativeVsDelta"],
          parameters: [
            [
              { label: "Meldingen", column: "imk_ingediend", colour: "orange", units: "meldingen", modifiers: { cumul: "_cumul", delta: "_aantal" } },
              { label: "Afgehandeld", column: "imk_afgerond", colour: "moss", units: "besluiten", modifiers: { cumul: "_cumul", delta: "_aantal" } },
            ],
          ],
          segment: { key: "imk_ingediend", cumulative: false, periodization: "weekly" },
        },
        {
          slug: "gemeente_toegekend_taart_imk",
          ctrlr: "PieChartSumV1",
          args: [],
          parameters: [
            [
              { label: "Toegekend", column: "imk_toegekend", colour: "moss", scale: "null", format: "", modifiers: { cumul: "_cumul", delta: "_aantal" } },
              { label: "Afgewezen", column: "imk_afgewezen", colour: "orange", scale: "null", format: "", modifiers: { cumul: "_cumul", delta: "_aantal" } },
            ],
            [
              { label: "Afgehandeld", column: "imk_afgerond_cumul", colour: "gray", scale: "null", format: "", excludeFromTable: true  },
            ],
          ],
        },
      ],
      segment: { key: "imk_ingediend", cumulative: true, periodization: "weekly"},
      functionality: ["table", "definitions", "download"],
    },
    {
      slug: "gemeenten_wd",
      ctrlr: "RegelingComparisonGroupV1",
      filters: [],
      graphs: [
        {
          slug: "gemeente_numbers_v1_wd",
          ctrlr: "NumbersMultiplesV1",
          args: [],
          filters: ["cumulativeVsDelta"],
          multiples: "cumulative",
          parameters: [
            [
              { label: "Meldingen", column: "wd_ingediend", colour: "orange", units: "zaken", modifiers: { cumul: "_cumul", delta: "_aantal" } },
              { label: "Afgehandeld", column: "wd_afgerond", colour: "moss", units: "besluiten", modifiers: { cumul: "_cumul", delta: "_aantal" } },
            ],
            [],
          ],
          segment: { key: "ingediend", cumulative: true, periodization: "latest" },
        },
        {
          slug: "gemeente_trend_wd",
          ctrlr: "BarTrendV1",
          args: [],
          filters: ["parameterSelect", "cumulativeVsDelta"],
          parameters: [
            [
              { label: "Meldingen", column: "wd_ingediend", colour: "orange", units: "meldingen", modifiers: { cumul: "_cumul", delta: "_aantal" } },
              { label: "Afgehandeld", column: "wd_afgerond", colour: "moss", units: "besluiten", modifiers: { cumul: "_cumul", delta: "_aantal" } },
            ],
          ],
          segment: { key: "wd_ingediend", cumulative: false, periodization: "weekly" },
        },
        {
          slug: "gemeente_toegekend_taart_wd",
          ctrlr: "PieChartSumV1",
          args: [],
          parameters: [
            [
              { label: "Toegekend", column: "wd_toegekend", colour: "moss", scale: "null", format: "", modifiers: { cumul: "_cumul", delta: "_aantal" } },
              { label: "Afgewezen", column: "wd_afgewezen", colour: "orange", scale: "null", format: "", modifiers: { cumul: "_cumul", delta: "_aantal" } },
            ],
            [
              { label: "Afgehandeld", column: "wd_afgerond_cumul", colour: "gray", scale: "null", format: "", excludeFromTable: true },
            ],
          ],
        },
      ],
      segment: { key: "wd_ingediend", cumulative: true, periodization: "weekly" },
      functionality: ["table", "definitions", "download"],
    },
    {
      slug: "gemeenten_wnw",
      ctrlr: "RegelingComparisonGroupV1",
      filters: [],
      graphs: [
        {
          slug: "gemeente_numbers_v1_wnw",
          ctrlr: "NumbersMultiplesV1",
          args: [],
          filters: ["cumulativeVsDelta"],
          multiples: "cumulative",
          parameters: [
            [
              { label: "Meldingen", column: "wnw_ingediend", colour: "orange", units: "zaken", modifiers: { cumul: "_cumul", delta: "_aantal" } },
              { label: "Afgehandeld", column: "wnw_afgerond", colour: "moss", units: "besluiten", modifiers: { cumul: "_cumul", delta: "_aantal" } },
            ],
            [],
          ],
          segment: { key: "wnw_ingediend", cumulative: true, periodization: "latest" },
        },
        {
          slug: "gemeente_trend_wnw",
          ctrlr: "BarTrendV1",
          args: [],
          filters: ["parameterSelect", "cumulativeVsDelta"],
          parameters: [
            [
              { label: "Meldingen", column: "wnw_ingediend", colour: "orange", units: "meldingen", modifiers: { cumul: "_cumul", delta: "_aantal" } },
              { label: "Afgehandeld", column: "wnw_afgerond", colour: "moss", units: "besluiten", modifiers: { cumul: "_cumul", delta: "_aantal" } },
            ],
          ],
          segment: { key: "wnw_ingediend", cumulative: false, periodization: "weekly" },
        },
        {
          slug: "gemeente_toegekend_taart_wnw",
          ctrlr: "PieChartSumV1",
          args: [],
          parameters: [
            [
              { label: "Toegekend", column: "wnw_toegekend", colour: "moss", scale: "null", format: "", modifiers: { cumul: "_cumul", delta: "_aantal" } },
              { label: "Afgewezen", column: "wnw_afgewezen", colour: "orange", scale: "null", format: "", modifiers: { cumul: "_cumul", delta: "_aantal" } },
            ],
            [
              { label: "Afgehandeld", column: "wnw_afgerond_cumul", colour: "gray", scale: "null", format: "", excludeFromTable: true  },
            ],
          ],
        },
      ],
      segment: { key: "wnw_ingediend", cumulative: true, periodization: "weekly"},
      functionality: ["table", "definitions", "download"],
    },
  ],
};

export default pageConfig;