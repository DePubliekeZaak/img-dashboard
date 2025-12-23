import { IGroupMappingV2 } from "../shared/interfaces";

const group: IGroupMappingV2[] = [
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
              colour: "blue",
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
              label: "Vooraad",
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
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["wd_namco_wekelijks", "wd_namco_maandelijks"],
  },
  {
    slug: "wdl_namco_bedragen",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "fs_wd_namco_numbers_2",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
             {
              label: "beschikte schade",
              column: "wd_namco_bedrag_beschikt_schade",
              colour: "blue",
              format: "currency",
              units: "beschikt schadebedrag",
            },
            {
              label: "beschikt totaal",
              column: "wd_namco_bedrag_beschikt_totaal",
              colour: "blue",
              format: "currency",
              units: "beschikt totaalbedrag",
            },
            {
              label: "betaalde schade",
              column: "wd_namco_bedrag_betaald_schade",
              colour: "moss",
              format: "currency",
              units: "betaald schadebedrag",
            },
            {
              label: "betaald totaal",
              column: "wd_namco_bedrag_betaald_totaal",
              colour: "orange",
              format: "currency",
              units: "betaald totaalbedrag",
            }
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
      {
        slug: "wd_namco_bedragen_trend",
        ctrlr: "BarTrendV1",
        args: [],
        filters: ["parameterSelect", "cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "Totaal verleende schade",
              column: "wd_namco_bedrag_betaald_totaal",
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
          key: "wd_namco_bedrag_betaald_totaal",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "wd_namco_bedrag_betaald_totaal",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["wd_namco_wekelijks", "wd_namco_maandelijks"],
  },
  // {
  //   slug: "wd_namco_waardering",
  //   ctrlr: "KTOGroupV1",
  //   graphs: [
  //     {
  //       slug: "wd_namco_waardering_numbers",
  //       ctrlr: "NumbersPlusRespondentsV1",
  //       args: [],
  //       parameters: [
  //         [
  //           {
  //             label: "Sinds start",
  //             column: "ims_doorlopend_cijfer",
  //             colour: "orange",
  //             format: "decimals",
  //           },
  //         ],
  //         [
  //           {
  //             label: "Totaal respondenten",
  //             column: "ims_aantal_respondenten_doorlopend",
  //             units: "respondenten sinds start",
  //             colour: "orange",
  //           },
  //         ],
  //       ],
  //     },
  //     {
  //       slug: "wd_namco_waardering_trend",
  //       ctrlr: "BarTrendKTOV1",
  //       args: [],
  //       filters: [],
  //       parameters: [
  //         [
  //           {
  //             label: "Maand cijfer",
  //             column: "ims_maandcijfer",
  //             colour: "orange",
  //             format: "decimals",
  //           },
  //         ],
  //         [
  //           {
  //             label: "Aantal nieuwe respondenten",
  //             column: "ims_aantal_respondenten",
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
  //     key: "ims_maandcijfer",
  //     cumulative: false,
  //     periodization: "monthly",
  //   },
  // },
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
              label: "Besluiten",
              column: "wd_namco_beschikt",
              colour: "moss",
              units: "besluiten",
            },
            {
              label: "Anders afgehandeld",
              column: "wd_namco_anders_afgehandeld",
              colour: "moss",
              units: "anders afgehandeld",
            },
            {
              label: "Afgehandeld",
              column: "wd_namco_afgerond",
              colour: "moss",
              units: "afgehandeld",
            },
            {
              label: "Percentage binnen termijn",
              column: "wd_namco_beschikt_binn_termijn_perc",
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
      periodization: "monthly",
    },
  },
  // {
  //   slug: "wdl_namco_duur",
  //   ctrlr: "DefaultGroupV1",
  //   graphs: [
  //     {
  //       slug: "wd_namco_duur_numbers_v1",
  //       ctrlr: "NumbersMultiplesTitledV1",
  //       args: [],
  //       filters: [],
  //       multiples: "incremental",
  //       parameters: [
  //         [
            
  //           {
  //             label: "Mediaan",
  //             column: "wd_namco_dlt_gerealiseerd_mediaan_dagen",
  //             colour: "orange",
  //             units: "gerealiseerd aantal dagen",
  //           },
  //           {
  //             label: "Gemiddelde",
  //             column: "wd_namco_dlt_gerealiseerd_gemiddeld_dagen",
  //             colour: "blue",
  //             units: "gerealiseerd aantal dagen",
  //           },
  //           {
  //             label: "Verwacht",
  //             column: "wd_namco_dlt_verwacht_rolling8_dagen",
  //             colour: "moss",
  //             units: "aantal dagen",
  //           },
  //         ],
  //         [],
  //       ],
  //       modifiers: [],
  //       segment: {
  //         key: "wd_namco_dlt_gerealiseerd_mediaan_dagen",
  //         cumulative: false,
  //         periodization: "monthly",
  //       },
  //     },
  //     {
  //       slug: "wd_namco_duur_trend",
  //       ctrlr: "BarTrendV1",
  //       filters: ["parameterSelect"],
  //       args: [],
  //       parameters: [
  //         [
  //           {
  //             label: "Gerealiseerd gemiddeld aantal dagen tot besluit",
  //             column: "wd_namco_dlt_gerealiseerd_gemiddeld_dagen",
  //             colour: "blue",
  //             units: "gemiddeld gerealiseerd aantal dagen",
  //           },
  //           {
  //             label: "Verwacht aantal dagen tot besluit",
  //             column: "wd_namco_dlt_verwacht_rolling8_dagen",
  //             colour: "moss",
  //             units: "verwacht aantal dagen",
  //           },
  //           {
  //             label: "Gerealiseerde mediaan aantal dagen tot besluit",
  //             column: "wd_namco_dlt_gerealiseerd_mediaan_dagen",
  //             colour: "orange",
  //             units: "mediaan gerealiseerd aantal dagen",
  //           },
  //         ],
  //       ],
  //       segment: {
  //         key: "wd_namco_dlt_gerealiseerd_mediaan_dagen",
  //         cumulative: false,
  //         periodization: "monthly",
  //         label: "dagen",
  //       },
  //     },
  //   ],
  //   segment: {
  //     key: "wd_namco_dlt_gerealiseerd_mediaan_dagen",
  //     cumulative: false,
  //     periodization: "monthly",
  //     label: "dagen",
  //   },
  //   functionality: ["table", "definitions", "download"],
  //   endpoints: ["wd_namco_wekelijks", "wd_namco_maandelijks"],
  // },
  // {
  //   slug: "wd_namco_voorraad",
  //   ctrlr: "DefaultGroupV1",
  //   graphs: [
  //     {
  //       slug: "wd_namco_voorrraad_getallen",
  //       ctrlr: "NumbersMultiplesTitledV1",
  //       args: [],
  //       filters: [],
  //       multiples: "incremental",
  //       parameters: [
  //         [
  //           {
  //             label: "Beslistermijn",
  //             column: "wd_namco_beslistermijn_dagen",
  //             colour: "moss",
  //             units: "dagen",
  //           },
  //           {
  //             label: "Mediaan",
  //             column: "wd_namco_oud_voorraad_mediaan_dagen",
  //             colour: "orange",
  //             units: "dagen in voorraad",
  //           },
  //           {
  //             label: "Gemiddelde",
  //             column: "wd_namco_oud_voorraad_gemiddeld_dagen",
  //             colour: "blue",
  //             units: "dagen in voorraad",
  //           },
  //         ],
  //         [],
  //       ],
  //       modifiers: [],
  //       segment: {
  //         key: "wd_namco_oud_voorraad_gemiddeld_dagen",
  //         cumulative: false,
  //         periodization: "weekly",
  //       },
  //     },
  //     {
  //       slug: "wd_namco_voorraad_groepen",
  //       ctrlr: "SegmentsV1",
  //       args: [],
  //       filters: [],
  //       parameters: [
  //         [
  //           {
  //             label: "< 182 dagen",
  //             column: "wd_namco_oud_voorraad_binnen_termijn",
  //             colour: "orange",
  //           },
  //           {
  //             label: "182 - 364 dagen",
  //             column: "wd_namco_oud_voorraad_1_2_termijn",
  //             colour: "moss",
  //           },
  //           {
  //             label: "364 - 728 dagen",
  //             column: "wd_namco_oud_voorraad_2_4_termijn",
  //             colour: "blue",
  //           },
  //           {
  //             label: "> 728 dagen",
  //             column: "wd_namco_oud_voorraad_buiten_4_termijn",
  //             colour: "purple",
  //           },
  //         ],
  //       ],
  //       modifiers: [],
  //       segment: {
  //         key: "wd_namco_oud_voorraad_binnen_termijn",
  //         cumulative: false,
  //         periodization: "monthly",
  //       },
  //     },
  //     //
  //   ],
  //   segment: {
  //     key: "wd_namco_oud_voorraad_binnen_termijn",
  //     cumulative: false,
  //     periodization: "monthly",
  //   },
  //   functionality: ["table", "definitions", "download"],
  //   endpoints: ["wd_namco_wekelijks", "wd_namco_maandelijks"],
  // },
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
              colour: "moss",
              units: "bezwaren",
            },
            {
              label: "In procedure",
              column: "wd_namco_bz_voorraad_cumulatief",
              colour: "green",
              units: "bewzaren",
            },
            {
              label: "Afgerond",
              column: "wd_namco_bz_afgerond_cumulatief",
              colour: "blue",
              units: "bezwaren",
            },
            {
              label: "Bezwaarpercentage",
              column: "wd_namco_bz_perc_cumulatief",
              colour: "orange",
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
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["wd_namco_wekelijks", "wd_namco_maandelijks"],
  },
];

export default group;
