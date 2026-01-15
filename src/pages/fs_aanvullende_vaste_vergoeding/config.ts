import { IGroupMappingV2 } from "../shared/interfaces";

const mapping: IGroupMappingV2[] = [
  {
    slug: "avv_intro",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "avv_maatwerk_numbers_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Aanvragen",
              column: "avv_ingediend",
              colour: "orange",
              units: "aanvragen",
            },
            {
              label: "Voorraad",
              column: "avv_voorraad",
              colour: "blue",
              units: "voorraad",
            },
            {
              label: "Afgehandeld",
              column: "avv_afgerond",
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
          key: "avv_ingediend",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "avv_trend",
        ctrlr: "BarTrendV1",
        args: [],
        filters: ["parameterSelect", "cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "Aanvragen",
              column: "avv_ingediend",
              colour: "orange",
            },
            {
              label: "Afgehandeld",
              column: "avv_afgerond",
              colour: "moss",
            },
            {
              label: "Voorraad",
              column: "avv_voorraad",
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
          key: "avv_ingediend",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "avv_ingediend",
      cumulative: true,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_avv_wekelijks", "fysiek_avv_maandelijks"],
  },
  {
    slug: "avv_bedragen",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "fs_avv_numbers_2",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Verleende schade",
              column: "avv_bedrag_verleend_schade",
              colour: "blue",
              format: "currency",
              units: "totaal verleende schade",
            },
            {
              label: "Verleend",
              column: "avv_bedrag_verleend_totaal",
              colour: "moss",
              format: "currency",
              units: "totaal verleende bedragen",
            },
            {
              label: "Uitgekeerd",
              column: "avv_bedrag_uitgekeerd_totaal",
              colour: "orange",
              format: "currency",
              units: "totaal uitgekeerde bedragen",
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
          key: "avv_bedrag_verleend_totaal",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "avv_bedragen_trend",
        ctrlr: "BarTrendV1",
        args: [],
        filters: ["parameterSelect", "cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "Totaal verleende schade",
              column: "avv_bedrag_verleend_totaal",
              colour: "blue",
              format: "currency",
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
          key: "avv_bedrag_verleend_totaal",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "avv_bedrag_verleend_totaal",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_avv_wekelijks", "fysiek_avv_maandelijks"],
  },
  // {
  //   slug: "avv_waardering",
  //   ctrlr: "KTOGroupV1",
  //   graphs: [
  //     {
  //       slug: "avv_waardering_numbers",
  //       ctrlr: "NumbersPlusRespondentsV1",
  //       args: [],
  //       parameters: [
  //         [
  //           {
  //             label: "Sinds start",
  //             column: "avv_doorlopend_cijfer",
  //             colour: "orange",
  //             format: "decimals",
  //           },
  //         ],
  //         [
  //           {
  //             label: "Totaal respondenten",
  //             column: "avv_aantal_respondenten_doorlopend",
  //             units: "respondenten sinds start",
  //             colour: "orange",
  //           },
  //         ],
  //       ],
  //     },
  //     {
  //       slug: "avv_waardering_trend",
  //       ctrlr: "BarTrendKTOV1",
  //       args: [],
  //       filters: [],
  //       parameters: [
  //         [
  //           {
  //             label: "Maand cijfer",
  //             column: "avv_maandcijfer",
  //             colour: "orange",
  //             format: "decimals",
  //           },
  //         ],
  //         [
  //           {
  //             label: "Aantal nieuwe respondenten",
  //             column: "avv_aantal_respondenten",
  //             colour: "orange",
  //             units: "respondenten",
  //           },
  //         ],
  //       ],
  //       modifiers: [],
  //     },
  //   ],
  //   functionality: ["table", "definitions", "download"],
  //   endpoints: ["tevredenheid", "tevredenheid"],
  //   segment: {
  //     key: "avv_maandcijfer",
  //     cumulative: false,
  //     periodization: "monthly",
  //   },
  // },
  {
    slug: "avv_besluiten",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "fs_avv_numbers_besluiten_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Besluiten",
              column: "avv_beschikt",
              colour: "moss",
              units: "besluiten",
            },
            {
              label: "Anders afgehandeld",
              column: "avv_anders_afgehandeld",
              colour: "moss",
              units: "anders afgehandeld",
            },
            {
              label: "Afgehandeld",
              column: "avv_afgerond",
              colour: "moss",
              units: "afgehandeld",
            },
            {
              label: "Percentage binnen termijn",
              column: "avv_beschikt_binn_termijn_perc",
              colour: "blue",
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
          key: "avv_beschikt",
          cumulative: true,
          periodization: "weekly",
        },
      },
    ],
    segment: {
      key: "avv_beschikt_binn_termijn_perc",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_avv_wekelijks", "fysiek_avv_maandelijks"],
  },
  {
    slug: "avv_binnen_buiten",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "fs_avv_binnen_termijn",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Binnen termijn",
              column: "avv_beschikt_binn_termijn_cumulatief",
              colour: "moss",
              scale: "null",
              format: "",
            },
            {
              label: "Buiten termijn",
              column: "avv_beschikt_buiten_termijn_cumulatief",
              colour: "orange",
              scale: "null",
              format: "",
            },
          ],
          [
            {
              label: "Besluiten",
              column: "avv_beschikt_cumulatief",
              colour: "gray",
              scale: "null",
              format: "",
            },
          ],
        ],
      },
      {
        slug: "binnen_termijn_trend",
        ctrlr: "BarTrendV1",
        args: [],
        filters: [],
        header: "Percentage beschikt binnen termijn",
        parameters: [
          [
            {
              label: "Beschikt binnen termijn",
              column: "avv_beschikt_binn_termijn_perc",
              colour: "orange",
              format: "percentage",
            },
          ],
        ],
        modifiers: [],
        segment: {
          key: "avv_beschikt_binn_termijn_perc",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "avv_beschikt_binn_termijn_perc",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_avv_wekelijks", "fysiek_avv_maandelijks"],
  },
  {
    slug: "avv_duur",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "fs_avv_duur_numbers_v1",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Mediaan",
              column: "avv_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "gerealiseerd aantal dagen",
            },
            {
              label: "Gemiddelde",
              column: "avv_dlt_gerealiseerd_gemiddeld_dagen",
              colour: "blue",
              units: "gerealiseerd aantal dagen",
            },
            {
              label: "Verwacht",
              column: "avv_dlt_verwacht_rolling8_dagen",
              colour: "moss",
              units: "aantal dagen",
            }
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "avv_dlt_verwacht_rolling8_dagen",
          cumulative: false,
          periodization: "monthly",
        },
      },
      {
        slug: "avv_maatwerk_duur_trend",
        ctrlr: "BarTrendV1",
        filters: ["parameterSelect"],
        args: [],
        parameters: [
          [
            
            {
              label: "Gerealiseerde mediaan aantal dagen tot besluit",
              column: "avv_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "mediaan gerealiseerd aantal dagen",
            },
            {
              label: "Verwacht aantal dagen tot besluit",
              column: "avv_dlt_verwacht_rolling8_dagen",
              colour: "moss",
              units: "verwacht aantal dagen",
            },
            {
              label: "Gerealiseerd gemiddeld aantal dagen tot besluit",
              column: "avv_dlt_gerealiseerd_gemiddeld_dagen",
              colour: "blue",
              units: "gemiddeld gerealiseerd aantal dagen",
            }
          ],
        ],
        segment: {
          key: "avv_dlt_gerealiseerd_gemiddeld_dagen",
          cumulative: false,
          periodization: "monthly",
          label: "dagen",
        },
      },
    ],
    segment: {
      key: "avv_dlt_gerealiseerd_gemiddeld_dagen",
      cumulative: false,
      periodization: "monthly",
      label: "dagen",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_avv_wekelijks", "fysiek_avv_maandelijks"],
  },
  {
    slug: "avv_voorraad",
    ctrlr: "DefaultGroupV1",
    graphs: [
      // {
      //   slug: "avv_voorrraad_getallen",
      //   ctrlr: "NumbersMultiplesTitledV1",
      //   args: [],
      //   filters: [],
      //   multiples: "incremental",
      //   parameters: [
      //     [
      //       {
      //         label: "Beslistermijn",
      //         column: "avv_beslistermijn_dagen",
      //         colour: "moss",
      //         units: "dagen",
      //       },
      //       {
      //         label: "Mediaan",
      //         column: "avv_oud_voorraad_mediaan_dagen",
      //         colour: "orange",
      //         units: "dagen in voorraad",
      //       },
      //       {
      //         label: "Gemiddelde",
      //         column: "avv_oud_voorraad_gemiddeld_dagen",
      //         colour: "blue",
      //         units: "dagen in voorraad",
      //       },
      //     ],
      //     [],
      //   ],
      //   modifiers: [],
      //   segment: {
      //     key: "avv_oud_voorraad_gemiddeld_dagen",
      //     cumulative: false,
      //     periodization: "weekly",
      //   },
      // },
      {
        slug: "avv_voorraad_groepen",
        ctrlr: "SegmentsV1",
        args: [],
        filters: [],
        parameters: [
          [
            {
              label: "< 56 dagen",
              column: "avv_oud_voorraad_binnen_termijn",
              colour: "orange",
            },
            {
              label: "56 - 112 dagen",
              column: "avv_oud_voorraad_1_2_termijn",
              colour: "moss",
            },
            {
              label: "112 - 224 dagen",
              column: "avv_oud_voorraad_2_4_termijn",
              colour: "blue",
            },
            {
              label: "> 224 dagen",
              column: "avv_oud_voorraad_buiten_4_termijn",
              colour: "purple",
            },
          ],
        ],
        modifiers: [],
        segment: {
          key: "avv_oud_voorraad_binnen_termijn",
          cumulative: false,
          periodization: "monthly",
        },
      },
      //
    ],
    segment: {
      key: "avv_oud_voorraad_binnen_termijn",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_avv_wekelijks", "fysiek_avv_maandelijks"],
  },
  {
    slug: "avv_bezwaren",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "fs_avv_bezwaren_numbers_v1",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Ingediend",
              column: "avv_bz_ingediend_cumulatief",
              colour: "moss",
              units: "bezwaren",
            },
            {
              label: "In procedure",
              column: "avv_bz_voorraad_cumulatief",
              colour: "green",
              units: "bewzaren",
            },
            {
              label: "Afgerond",
              column: "avv_bz_afgerond_cumulatief",
              colour: "blue",
              units: "bezwaren",
            },
            {
              label: "Bezwaarpercentage",
              column: "avv_bz_perc_cumulatief",
              colour: "orange",
              format: "percentage",
              units: "t.o.v. aantal besluiten",
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "avv_bz_ingediend",
          cumulative: false,
          periodization: "monthly",
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
              column: "avv_bz_toegekend_cumulatief",
              colour: "moss",
            },
            {
              label: "Afgewezen",
              column: "avv_bz_afgewezen_cumulatief",
              colour: "orange",
            },
            {
              label: "Anders afgerond",
              column: "avv_bz_anders_afgehandeld_cumulatief",
              colour: "blue",
            },
          ],
          [
            {
              label: "Totaal afgerond",
              column: "avv_bz_afgerond_cumulatief",
              colour: "gray",
            },
          ],
        ],
        segment: {
          key: "avv_bz_toegekend_cumulatief",
          cumulative: true,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "avv_bz_toegekend_cumulatief",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_avv_wekelijks", "fysiek_avv_maandelijks"],
  },
];

export default mapping;
