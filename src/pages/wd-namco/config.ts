import type { IGroupMappingV2 } from "../shared/interfaces";

const group: IGroupMappingV2[] = [
  // intro
  {
    slug: "wdl_namco_intro",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "wd_namco_numbers_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Aanvragen",
              column: "wd_namco_ingediend",
              colour: "orange",
              units: "aanvragen",
            },
            {
              label: "Voorraad",
              column: "wd_namco_voorraad",
              colour: "purple",
              units: "voorraad",
            },
            {
              label: "Afgehandeld",
              column: "wd_namco_afgerond",
              colour: "moss",
              units: "afgehandeld",
            },
          ],
          [],
        ],
        modifiers: [
          [
            {
              label: "totaal",
              column: "{}_cumulatief",
              colour: "orange",
            },
            {
              label: "afgelopen week",
              column: "{}",
              colour: "orange",
            },
          ],
        ],
        segment: {
          key: "wd_namco_ingediend",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "wd_namco_trend",
        ctrlr: "BarTrendV1",
        args: [],
        filters: ["parameterSelect", "cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "Aanvragen",
              column: "wd_namco_ingediend",
              colour: "orange",
            },
            {
              label: "Afgehandeld",
              column: "wd_namco_afgerond",
              colour: "moss",
            },
            {
              label: "Voorraad",
              column: "wd_namco_voorraad",
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
          key: "wd_namco_ingediend",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "wd_namco_ingediend",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["wd_namco_wekelijks", "wd_namco_maandelijks"],
  },
  // bedragen
  {
    slug: "wdl_namco_bedragen",
    ctrlr: "DefaultGroupV1",
    filters: ["totaalVsRecent", "weekVsMonth"],
    graphs: [
      {
        slug: "fs_wd_namco_numbers_2",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            //  {
            //   label: "beschikte schade",
            //   column: "wd_namco_bedrag_beschikt_schade",
            //   colour: "blue",
            //   format: "currency",
            //   units: "beschikt schadebedrag",
            // },
            // {
            //   label: "beschikt totaal",
            //   column: "wd_namco_bedrag_beschikt_totaal",
            //   colour: "blue",
            //   format: "currency",
            //   units: "beschikt totaalbedrag",
            // },
            // {
            //   label: "betaalde schade",
            //   column: "wd_namco_bedrag_betaald_schade",
            //   colour: "moss",
            //   format: "currency",
            //   units: "betaald schadebedrag",
            // },
            {
              label: "betaald totaal",
              column: "wd_namco_bedrag_betaald_totaal",
              colour: "blue",
              format: "currency",
              units: "betaald totaalbedrag",
            },
          ],
          [],
        ],
        modifiers: [
          [
            {
              label: "totaal",
              column: "{}_cumulatief",
              colour: "orange",
            },
            {
              label: "afgelopen week",
              column: "{}",
              colour: "orange",
            },
          ],
        ],
        segment: {
          key: "wd_namco_bedrag_betaald_totaal",
          cumulative: true,
          periodization: "weekly",
        },
      },
      // {
      //   slug: "wd_namco_bedragen_trend",
      //   ctrlr: "BarTrendBedragenV1",
      //   args: [],
      //   filters: [],
      //   parameters: [
      //     [
      //       {
      //         label: "Totaal verleende schade",
      //         column: "wd_namco_bedrag_betaald_totaal",
      //         colour: "blue",
      //         format: "currency",
      //       },
      //     ],
      //   ],
      //   modifiers: [
      //     [
      //       {
      //         label: "toename",
      //         column: "{}",
      //         colour: "orange",
      //       },
      //       {
      //         label: "cumulatief",
      //         column: "{}_cumulatief",
      //         colour: "orange",
      //       },
      //     ],
      //   ],
      //   segment: {
      //     key: "wd_namco_bedrag_betaald_totaal",
      //     cumulative: false,
      //     periodization: "monthly",
      //   },
      // },
    ],
    segment: {
      key: "wd_namco_bedrag_betaald_totaal",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["wd_namco_wekelijks", "wd_namco_maandelijks"],
  },
  // besluiten
  {
    slug: "wdl_namco_besluiten",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "wd_namco_numbers_besluiten_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Afgehandeld",
              column: "wd_namco_afgerond",
              colour: "moss",
              units: "afgehandeld",
            },
            {
              label: "Besluiten",
              column: "wd_namco_beschikt",
              colour: "blue",
              units: "besluiten",
            },
            {
              label: "Anders afgehandeld",
              column: "wd_namco_anders_afgehandeld",
              colour: "orange",
              units: "anders afgehandeld",
            },
            {
              label: "Percentage binnen termijn",
              column: "wd_namco_beschikt_binn_termijn_perc",
              colour: "moss",
              format: "percentage",
              units: "afgehandeld binnen termijn",
            },
          ],
          [],
        ],
        modifiers: [
          [
            {
              label: "totaal",
              column: "{}_cumulatief",
              colour: "orange",
            },
            {
              label: "afgelopen week",
              column: "{}",
              colour: "orange",
            },
          ],
        ],
        segment: {
          key: "wd_namco_beschikt",
          cumulative: true,
          periodization: "weekly",
        },
      },
    ],
    segment: {
      key: "wd_namco_beschikt_binn_termijn_perc",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["wd_namco_wekelijks", "wd_namco_maandelijks"],
  },
  // toegekend
  {
    slug: "wdl_namco_toegekend",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "wd_namco_toegekend_taart",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Toegekend",
              column: "wd_namco_toegekend_cumulatief",
              colour: "moss",
              scale: "null",
              format: "",
            },
            {
              label: "Afgewezen",
              column: "wd_namco_afgewezen_cumulatief",
              colour: "orange",
              scale: "null",
              format: "",
            },
          ],
          [
            {
              label: "Besluiten",
              column: "wd_namco_beschikt_cumulatief",
              colour: "gray",
              scale: "null",
              format: "",
            },
          ],
        ],
      },
      {
        slug: "wd_namco_toegekend_trend",
        ctrlr: "BarTrendStackedMakeup",
        filters: ["absoluteVsNormalized", "weekVsMonth"],
        args: [],
        parameters: [
          [
            {
              label: "Toegekend",
              column: "wd_namco_toegekend",
              colour: "moss",
              scale: "null",
              format: "",
            },
            {
              label: "Afgewezen",
              column: "wd_namco_afgewezen",
              colour: "orange",
              scale: "null",
              format: "",
            },
          ],
        ],
        segment: {
          key: "wd_namco_toegekend",
          cumulative: false,
          periodization: "monthly",
          label: "besluiten",
          normalized: false,
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["wd_namco_wekelijks", "wd_namco_maandelijks"],
    segment: {
      key: "wd_namco_toegekend_cumulatief",
      cumulative: true,
      periodization: "weekly",
    },
  },
  // bezwaren
  {
    slug: "wdl_namco_bezwaren",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "fs_wd_namco_bezwaren_numbers_v1",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Ingediend",
              column: "wd_namco_bz_ingediend_cumulatief",
              colour: "orange",
              units: "bezwaren",
            },
            {
              label: "In procedure",
              column: "wd_namco_bz_voorraad_cumulatief",
              colour: "purple",
              units: "bezwaren",
            },
            {
              label: "Afgerond",
              column: "wd_namco_bz_afgerond_cumulatief",
              colour: "moss",
              units: "bezwaren",
            },
            {
              label: "Bezwaarpercentage",
              column: "wd_namco_bz_perc_cumulatief",
              colour: "blue",
              format: "percentage",
              units: "t.o.v. aantal besluiten",
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "wd_namco_bz_ingediend",
          cumulative: false,
          periodization: "weekly",
        },
      },
      {
        slug: "bezwaren_taart_toegekend",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Toegekend",
              column: "wd_namco_bz_toegekend_cumulatief",
              colour: "moss",
            },
            {
              label: "Afgewezen",
              column: "wd_namco_bz_afgewezen_cumulatief",
              colour: "orange",
            },
            {
              label: "Anders afgerond",
              column: "wd_namco_bz_anders_afgehandeld_cumulatief",
              colour: "blue",
            },
          ],
          [
            {
              label: "Totaal afgerond",
              column: "wd_namco_bz_afgerond_cumulatief",
              colour: "gray",
            },
          ],
        ],
        segment: {
          key: "wd_namco_bz_toegekend_cumulatief",
          cumulative: true,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "wd_namco_bz_toegekend_cumulatief",
      cumulative: false,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["wd_namco_wekelijks", "wd_namco_maandelijks"],
  },
];

export default group;
