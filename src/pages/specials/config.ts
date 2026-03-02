import type { IGroupMappingV2 } from "../shared/interfaces";

const mappings: IGroupMappingV2[] = [
  {
    slug: "specials_intro",
    ctrlr: "DefaultGroupV1",
    filters: ["specials", "totaalVsRecent"],
    graphs: [
      {
        slug: "all_total_numbers",
        ctrlr: "NumbersV1",

        // sp_toegekend_aantal AS specials_all_toegekend,
        // sp_toegekend_cumul AS specials_all_toegekend_cumulatief,
        // sp_afgewezen_aantal AS specials_all_afgewezen,
        // sp_afgewezen_cumul AS specials_all_afgewezen_cumulatief,

        args: [],
        parameters: [
          [
            {
              label: "Meldingen",
              column: "specials_all_ingediend",
              colour: "orange",
              units: "meldingen",
            },
            {
              label: "Besluiten",
              column: "specials_all_beschikt",
              colour: "blue",
              units: "besluiten",
            },
            {
              label: "Anders afgehandeld",
              column: "specials_all_anders_afgehandeld",
              colour: "yellow",
              units: "anders afgehandeld",
            },
            {
              label: "Afgehandeld",
              column: "specials_all_afgerond",
              colour: "moss",
              units: "afgehandeld",
            },
          ],
          [],
        ],
        modifiers: [
          [
            {
              label: "toename",
              column: "{}",
              colour: "orange",
            },
            {
              label: "cumulatief",
              column: "{}_cumulatief",
              colour: "orange",
            },
          ],
        ],
        segment: {
          key: "specials_all_ingediend",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "specials_all_trend",
        ctrlr: "BarTrendV1",
        args: [],
        filters: ["parameterSelect", "cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "Meldingen",
              column: "specials_all_ingediend",
              colour: "orange",
            },
            {
              label: "Afgehandeld",
              column: "specials_all_afgerond",
              colour: "moss",
            },
          ],
        ],
        modifiers: [
          [
            {
              label: "toename",
              column: "{}",
              colour: "orange",
            },
            {
              label: "cumulatief",
              column: "{}_cumulatief",
              colour: "orange",
            },
          ],
        ],
        segment: {
          key: "specials_all_ingediend",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "specials_all_ingediend",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["specials_wekelijks", "specials_maandelijks"],
  },
  {
    slug: "specials_toegekend",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "specials_all_toegekend_taart",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Toegekend",
              column: "specials_all_toegekend_cumulatief",
              colour: "moss",
              scale: "null",
              format: "",
            },
            {
              label: "Afgewezen",
              column: "specials_all_afgewezen_cumulatief",
              colour: "orange",
              scale: "null",
              format: "",
            },
          ],
          [
            {
              label: "Besluiten",
              column: "specials_all_beschikt_cumulatief",
              colour: "gray",
              scale: "null",
              format: "",
            },
          ],
        ],
      },
      {
        slug: "specials_all_toegekend_trend",
        ctrlr: "BarTrendStackedMakeup",
        filters: ["absoluteVsNormalized", "weekVsMonth"],
        args: [],
        parameters: [
          [
            {
              label: "Toegekend",
              column: "specials_all_toegekend",
              colour: "moss",
              scale: "null",
              format: "",
            },
            {
              label: "Afgewezen",
              column: "specials_all_afgewezen",
              colour: "orange",
              scale: "null",
              format: "",
            },
          ],
        ],
        segment: {
          key: "specials_all_toegekend",
          cumulative: false,
          periodization: "monthly",
          label: "besluiten",
          normalized: false,
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["specials_wekelijks", "specials_maandelijks"],
    segment: {
      key: "specials_all_toegekend_cumulatief",
      cumulative: true,
      periodization: "weekly",
    },
  },
];

export default mappings;
