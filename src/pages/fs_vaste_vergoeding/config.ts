import { IGroupMappingV2 } from "../shared/interfaces";

const mapping: IGroupMappingV2[] = [
  // intro
  {
    slug: "vv_intro",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "vv_numbers_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Aanvragen",
              column: "vv_ingediend",
              colour: "orange",
              units: "aanvragen",
            },
            {
              label: "Voorraad",
              column: "vv_voorraad",
              colour: "purple",
              units: "voorraad",
            },
            {
              label: "Afgehandeld",
              column: "vv_afgerond",
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
          key: "vv_ingediend",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "vv_trend",
        ctrlr: "BarTrendV1",
        args: [],
        filters: ["parameterSelect", "cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "Aanvragen",
              column: "vv_ingediend",
              colour: "orange",
            },
            {
              label: "Afgehandeld",
              column: "vv_afgerond",
              colour: "moss",
            },
            {
              label: "Voorraad",
              column: "vv_voorraad",
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
          key: "vv_ingediend",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "vv_ingediend",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_vv_wekelijks", "fysiek_vv_maandelijks"],
  },
  // toegekend als
  // {
  //   slug: "vv_toegekend_als",
  //   ctrlr: "DefaultGroupV1",
  //   filters: [],
    
  //   ],
  //   segment: {
  //     key: "vv_afgerond_ves",
  //     cumulative: true,
  //     periodization: "weekly",
  //   },
  //   functionality: ["table", "definitions", "download"],
  //   endpoints: ["fysiek_vv_wekelijks", "fysiek_vv_maandelijks"],
  // },
  // bedragen
  {
    slug: "vv_bedragen",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "fs_vv_numbers_2",
        ctrlr: "NumbersV1",
        args: [],
        filters: ["cumulativeVsDelta","weekVsMonth"],
        multiples: "cumulative",
        parameters: [
          [
            // {
            //   label: "beschikte schade",
            //   column: "vv_bedrag_beschikt_schade",
            //   colour: "blue",
            //   format: "currency",
            //   units: "beschikt schadebedrag",
            // },
            // {
            //   label: "beschikt totaal",
            //   column: "vv_bedrag_beschikt_totaal",
            //   colour: "blue",
            //   format: "currency",
            //   units: "beschikt totaalbedrag",
            // },
            // {
            //   label: "betaalde schade",
            //   column: "vv_bedrag_betaald_schade",
            //   colour: "moss",
            //   format: "currency",
            //   units: "betaald schadebedrag",
            // },
            {
              label: "betaald totaal",
              column: "vv_bedrag_betaald_totaal",
              colour: "blue",
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
          key: "vv_bedrag_betaald_totaal",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "vv_bedragen_trend",
        ctrlr: "BarTrendBedragenV1",
        args: [],
        filters: [],
        parameters: [
          [
            {
              label: "Totaal betaald bedrag",
              column: "vv_bedrag_betaald_totaal",
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
          key: "vv_bedrag_betaald_totaal",
          cumulative: true,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "vv_bedrag_betaald_totaal",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_vv_wekelijks", "fysiek_vv_maandelijks"],
  },
  // waardering
  {
    slug: "vv_waardering",
    ctrlr: "KTOGroupV1",
    graphs: [
      {
        slug: "ves_waardering_numbers",
        ctrlr: "NumbersPlusRespondentsV1",
        args: [],
        parameters: [
          [
            {
              label: "Sinds start",
              column: "ves_doorlopend_cijfer",
              colour: "orange",
              format: "decimals",
            },
          ],
          [
            {
              label: "Totaal respondenten",
              column: "ves_aantal_respondenten_doorlopend",
              units: "respondenten sinds start",
              colour: "orange",
            },
          ],
        ],
      },
      {
        slug: "ves_waardering_trend",
        ctrlr: "BarTrendKTOV1",
        args: [],
        filters: [],
        parameters: [
          [
            {
              label: "Maand cijfer",
              column: "ves_maandcijfer",
              colour: "orange",
              format: "decimals",
            },
          ],
          [
            {
              label: "Aantal nieuwe respondenten",
              column: "ves_aantal_respondenten",
              colour: "orange",
              units: "respondenten",
            },
          ],
        ],
        modifiers: [],
      },
      // {
      //   slug: "avv_waardering_numbers",
      //   ctrlr: "NumbersPlusRespondentsV1",
      //   args: [],
      //   parameters: [
      //     [
      //       {
      //         label: "Sinds start",
      //         column: "avv_doorlopend_cijfer",
      //         colour: "orange",
      //         format: "decimals",
      //       },
      //     ],
      //     [
      //       {
      //         label: "Totaal respondenten",
      //         column: "avv_aantal_respondenten_doorlopend",
      //         units: "respondenten sinds start",
      //         colour: "orange",
      //       },
      //     ],
      //   ],
      // },
      // {
      //   slug: "avv_waardering_trend",
      //   ctrlr: "BarTrendKTOV1",
      //   args: [],
      //   filters: [],
      //   parameters: [
      //     [
      //       {
      //         label: "Maand cijfer",
      //         column: "avv_maandcijfer",
      //         colour: "orange",
      //         format: "decimals",
      //       },
      //     ],
      //     [
      //       {
      //         label: "Aantal nieuwe respondenten",
      //         column: "avv_aantal_respondenten",
      //         colour: "orange",
      //         units: "respondenten",
      //       },
      //     ],
      //   ],
      //   modifiers: [],
      // },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["tevredenheid", "tevredenheid"],
    segment: {
      key: "ves_maandcijfer",
      cumulative: false,
      periodization: "monthly",
    },
  },
  // besluiten
  {
    slug: "vv_besluiten",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "fs_vv_numbers_besluiten_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [ {
              label: "Afgehandeld",
              column: "vv_afgerond",
              colour: "moss",
              units: "afgehandeld",
            },
            {
              label: "Besluiten",
              column: "vv_beschikt",
              colour: "blue",
              units: "besluiten",
            },
            {
              label: "Anders afgehandeld",
              column: "vv_anders_afgehandeld",
              colour: "orange",
              units: "anders afgehandeld",
            },

            {
              label: "Percentage binnen termijn",
              column: "vv_beschikt_binn_termijn_perc",
              colour: "moss",
              format: "percentage",
              units: "afgehandeld binnen termijn",
            },
                {
              label: "Vaste vergoeding",
              column: "vv_toegekend_ves",
              colour: "moss",
              units: "toegekend als VES",
            },
            {
              label: "Aanvullende vaste vergoeding",
              column: "vv_toegekend_avv",
              colour: "blue",
              units: "toegekend als AVV",
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
          key: "vv_beschikt",
          cumulative: true,
          periodization: "weekly",
        },
      },
      // {
      //   slug: "vv_numbers_v1",
      //   ctrlr: "NumbersMultiplesV1",
      //   args: [],
      //   filters: [],
      //   multiples: "cumulative",
      //   parameters: [
      //     [
      //       {
      //         label: "Vaste vergoeding",
      //         column: "vv_toegekend_ves",
      //         colour: "moss",
      //         units: "vaste vergoeding",
      //       },
      //       {
      //         label: "Aanvullende vaste vergoeding",
      //         column: "vv_toegekend_avv",
      //         colour: "blue",
      //         units: "aanvullende vaste vergoeding",
      //       }
      //     ],
      //     [],
      //   ],
      //   modifiers: [
      //     [
      //       {
      //         label: "totaal",
      //         column: "{}_cumulatief",
      //         colour: "orange",
      //       },
      //       {
      //         label: "afgelopen week",
      //         column: "{}",
      //         colour: "orange",
      //       },
      //     ],
      //   ],
      //   segment: {
      //     key: "vv_afgerond_ves",
      //     cumulative: true,
      //     periodization: "weekly",
      //   },
      // },
      // {
      //   slug: "vv_trend_toegekend_als",
      //   ctrlr: "BarTrendStackedMakeup",
      //   args: [],
      //   filters: ["cumulativeVsDelta", "weekVsMonth"],
      //   parameters: [
      //     [
      //       {
      //         label: "Vaste vergoeding (VES)",
      //         column: "vv_toegekend_ves",
      //         colour: "moss",
      //       },
      //       {
      //         label: "Aanvullende vaste vergoeding (AVV)",
      //         column: "vv_toegekend_avv",
      //         colour: "blue",
      //       }
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
      //     key: "vv_ingediend",
      //     cumulative: false,
      //     periodization: "monthly",
      //   },
      // },
    ],
    segment: {
      key: "vv_beschikt_binn_termijn_perc",
      cumulative: false,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_vv_wekelijks", "fysiek_vv_maandelijks"],
  },
  // toegekend/afgewezen
  {
    slug: "vv_toegekend",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "vv_maatwerk_toegekend_taart",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Toegekend als VES",
              column: "vv_toegekend_ves_cumulatief",
              colour: "moss",
            },
            {
              label: "Toegekend als AVV",
              column: "vv_toegekend_avv_cumulatief",
              colour: "blue",
            },
            {
              label: "Afgewezen",
              column: "vv_afgewezen_cumulatief",
              colour: "orange",
              scale: "null",
              format: "",
            },
          ],
          [
            {
              label: "Besluiten",
              column: "vv_beschikt_cumulatief",
              colour: "gray",
              scale: "null",
              format: "",
            },
          ],
        ],
      },
      {
        slug: "vv_maatwerk_toegekend_trend",
        ctrlr: "BarTrendStackedMakeup",
        filters: ["absoluteVsNormalized", "weekVsMonth"],
        args: [],
        parameters: [
          [
            {
              label: "Vaste vergoeding (VES)",
              column: "vv_toegekend_ves",
              colour: "moss",
            },
            {
              label: "Aanvullende vaste vergoeding (AVV)",
              column: "vv_toegekend_avv",
              colour: "blue",
            },
            {
              label: "Afgewezen",
              column: "vv_afgewezen",
              colour: "orange",
              scale: "null",
              format: "",
            },
          ],
        ],
        segment: {
          key: "vv_toegekend",
          cumulative: false,
          periodization: "monthly",
          label: "besluiten",
          normalized: false,
        },
      },

    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_vv_wekelijks", "fysiek_vv_maandelijks"],
    segment: {
      key: "vv_toegekend_cumulatief",
      cumulative: true,
      periodization: "weekly",
    },
  },
  // duur
  {
    slug: "vv_duur",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "vv_duur_numbers_v1",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Mediaan",
              column: "vv_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "gerealiseerd aantal dagen",
            },
            {
              label: "Gemiddelde",
              column: "vv_dlt_gerealiseerd_gemiddeld_dagen",
              colour: "blue",
              units: "gerealiseerd aantal dagen",
            },
            {
              label: "Verwacht",
              column: "vv_dlt_verwacht_rolling8_dagen",
              colour: "moss",
              units: "aantal dagen",
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "vv_dlt_gerealiseerd_mediaan_dagen",
          cumulative: false,
          periodization: "weekly",
        },
      },
      {
        slug: "vv_duur_trend",
        ctrlr: "BarTrendV1",
        filters: ["parameterSelect"],
        args: [],
        parameters: [
          [
                 {
              label: "Gerealiseerde mediaan aantal dagen tot besluit",
              column: "vv_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "mediaan gerealiseerd aantal dagen",
            },
            {
              label: "Gerealiseerd gemiddeld aantal dagen tot besluit",
              column: "vv_dlt_gerealiseerd_gemiddeld_dagen",
              colour: "blue",
              units: "gemiddeld gerealiseerd aantal dagen",
            },
            // {
            //   label: "Verwacht aantal dagen tot besluit",
            //   column: "vv_dlt_verwacht_rolling8_dagen",
            //   colour: "moss",
            //   units: "verwacht aantal dagen",
            // },
          ],
        ],
        segment: {
          key: "vv_dlt_gerealiseerd_mediaan_dagen",
          cumulative: false,
          periodization: "monthly",
          label: "dagen",
        },
      },
    ],
    segment: {
      key: "vv_dlt_gerealiseerd_mediaan_dagen",
      cumulative: false,
      periodization: "weekly",
      label: "dagen",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_vv_wekelijks", "fysiek_vv_maandelijks"],
  },
  // voorraad
  {
    slug: "vv_voorraad",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "vv_voorrraad_getallen",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Voorraad",
              column: "vv_voorraad_cumulatief",
              colour: "blue",
              units: "voorraad",
            },
            {
              label: "Beslistermijn",
              column: "vv_beslistermijn_dagen",
              colour: "moss",
              units: "dagen",
            },
            // {
            //   label: "Mediaan",
            //   column: "vv_oud_voorraad_mediaan_dagen",
            //   colour: "orange",
            //   units: "dagen in voorraad",
            // },
            // {
            //   label: "Gemiddelde",
            //   column: "vv_oud_voorraad_gemiddeld_dagen",
            //   colour: "blue",
            //   units: "dagen in voorraad",
            // },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "vv_beslistermijn_dagen",
          cumulative: false,
          periodization: "weekly",
        },
      },
      {
        slug: "vv_voorraad_groepen",
        ctrlr: "SegmentsV1",
        args: [],
        filters: [],
        parameters: [
          [
            {
              label: "< 56 dagen",
              column: "vv_oud_voorraad_binnen_termijn",
              colour: "orange",
            },
            {
              label: "56 - 112 dagen",
              column: "vv_oud_voorraad_1_2_termijn",
              colour: "moss",
            },
            {
              label: "112 - 224 dagen",
              column: "vv_oud_voorraad_2_4_termijn",
              colour: "blue",
            },
            {
              label: "> 224 dagen",
              column: "vv_oud_voorraad_buiten_4_termijn",
              colour: "purple",
            },
          ],
        ],
        modifiers: [],
        segment: {
          key: "vv_oud_voorraad_binnen_termijn",
          cumulative: false,
          periodization: "weekly",
        },
      },
      //
    ],
    segment: {
      key: "vv_oud_voorraad_binnen_termijn",
      cumulative: false,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_vv_wekelijks", "fysiek_vv_maandelijks"],
  },
  // bezwaren
  {
    slug: "vv_bezwaren",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "fs_vv_bezwaren_numbers_v1",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Ingediend",
              column: "vv_bz_ingediend_cumulatief",
              colour: "orange",
              units: "bezwaren",
            },
            {
              label: "In procedure",
              column: "vv_bz_voorraad_cumulatief",
              colour: "purple",
              units: "bezwaren",
            },
            {
              label: "Afgerond",
              column: "vv_bz_afgerond_cumulatief",
              colour: "moss",
              units: "bezwaren",
            },
            {
              label: "Bezwaarpercentage",
              column: "vv_bz_perc_cumulatief",
              colour: "blue",
              format: "percentage",
              units: "t.o.v. aantal besluiten",
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "vv_bz_ingediend",
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
              column: "vv_bz_toegekend_cumulatief",
              colour: "moss",
            },
            {
              label: "Afgewezen",
              column: "vv_bz_afgewezen_cumulatief",
              colour: "orange",
            },
            {
              label: "Anders afgerond",
              column: "vv_bz_anders_afgehandeld_cumulatief",
              colour: "blue",
            },
          ],
          [
            {
              label: "Totaal afgerond",
              column: "vv_bz_afgerond_cumulatief",
              colour: "gray",
            },
          ],
        ],
        segment: {
          key: "vv_bz_toegekend_cumulatief",
          cumulative: true,
          periodization: "weekly",
        },
      },
    ],
    segment: {
      key: "vv_bz_toegekend_cumulatief",
      cumulative: false,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_vv_wekelijks", "fysiek_vv_maandelijks"],
  },
];

export default mapping;
