import type { IPageConfig } from "../../shared/interfaces";

const DOMEIN_CODE = "FYSIEK";
const REGELING_CODE = "MW";


const pageConfig: IPageConfig = {
  slug: "gemeente",
  segment: {
    key: "",
    gemeente: "all",
    periodization: "monthly",
    cumulative: false,
    vanaf: "2025-01-01"
  },
  filters: ["vanaf"],
  endpoints: [
    `regelingen?aggregatie=eq.week&domein_code=eq.${DOMEIN_CODE}&regeling_code=eq.${REGELING_CODE}&periode_vanaf=gte.{VANAF}&order=periode.desc`,
    `regelingen?aggregatie=eq.maand&domein_code=eq.${DOMEIN_CODE}&regeling_code=eq.${REGELING_CODE}&order=periode.desc`
  ],
  groups: [
  {
    slug: "maatwerk_intro",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "fs_maatwerk_numbers_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Meldingen",
              column: "ingediend",
              colour: "orange",
              units: "meldingen",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Voorraad",
              column: "voorraad",
              colour: "purple",
              units: "voorraad",
              modifiers: { cumul: "_cumul", delta: "_verschil" },
            },
            {
              label: "Afgehandeld",
              column: "afgerond",
              colour: "moss",
              units: "afgehandeld",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
          ],
          [],
        ],
        segment: {
          key: "ingediend_aantal",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "maatwerk_trend",
        ctrlr: "BarTrendV1",
        args: [],
        filters: ["parameterSelect", "cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "Meldingen",
              column: "ingediend",
              colour: "orange",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Afgehandeld",
              column: "afgerond",
              colour: "moss",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Voorraad",
              column: "voorraad",
              colour: "blue",
              modifiers: { cumul: "_cumul", delta: "_verschil" },
            },
          ],
        ],
        segment: {
          key: "ingediend_aantal",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "ingediend_aantal",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: [
    ],
  },
  // bedragen
  {
    slug: "maatwerk_bedragen",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "fs_maatwerk_numbers_2",
        ctrlr: "NumbersV1",
        args: [],
        filters: ["cumulativeVsDelta"],
        multiples: "cumulative",
        parameters: [
          [
            // {
            //   label: "beschikte schade",
            //   column: "maatwerk_bedrag_beschikt_schade",
            //   colour: "blue",
            //   format: "currency",
            //   units: "beschikt schadebedrag",
            // },
            // {
            //   label: "beschikt totaal",
            //   column: "maatwerk_bedrag_beschikt_totaal",
            //   colour: "blue",
            //   format: "currency",
            //   units: "beschikt totaalbedrag",
            // },
            // {
            //   label: "betaalde schade",
            //   column: "maatwerk_bedrag_betaald_schade",
            //   colour: "moss",
            //   format: "currency",
            //   units: "betaald schadebedrag",
            // },
            {
              label: "betaald totaal",
              column: "bedrag_betaald_totaal",
              colour: "blue",
              format: "currency",
              units: "betaald totaalbedrag",
              modifiers: { cumul: "_cumul_eur", delta: "_eur" }
            },
          ],
          [],
        ],
        segment: {
          key: "bedrag_betaald_totaal",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "maatwerk_bedragen_trend",
        ctrlr: "BarTrendBedragenV1",
        args: [],
        filters: ["cumulativeVsDelta"],
        parameters: [
          [
            {
              label: "Totaal verleende schade",
              column: "bedrag_betaald_totaal",
              colour: "blue",
              format: "currency",
              modifiers: { cumul: "_cumul_eur", delta: "_eur" }
            },
          ],
        ],
        segment: {
          key: "bedrag_betaald_totaal",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "bedrag_betaald_totaal",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: [],
  },
  // // waardering
  {
    slug: "maatwerk_waardering",
    ctrlr: "KTOGroupV1",
    graphs: [
      {
        slug: "mw_waardering_numbers",
        ctrlr: "NumbersPlusRespondentsV1",
        args: [],
        parameters: [
          [
            {
              label: "Sinds start",
              column: "fysieke_schade_doorlopend_cijfer",
              colour: "orange",
              format: "decimals",
            },
          ],
          [
            {
              label: "Totaal respondenten",
              column: "fysieke_schade_aantal_respondenten_doorlopend",
              units: "respondenten sinds start",
              colour: "orange",
            },
          ],
        ],
      },
      {
        slug: "mw_waardering_trend",
        ctrlr: "BarTrendKTOV1",
        args: [],
        filters: [],
        parameters: [
          [
            {
              label: "Maand cijfer",
              column: "fysieke_schade_maandcijfer",
              colour: "orange",
              format: "decimals",
            },
          ],
          [
            {
              label: "Aantal nieuwe respondenten",
              column: "fysieke_schade_aantal_respondenten",
              colour: "orange",
              units: "respondenten",
            },
          ],
        ],
        modifiers: [],
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["tevredenheid"],
    segment: {
      key: "fysieke_schade_maandcijfer",
      cumulative: false,
      periodization: "monthly",
    },
  },
  // // besluiten
  {
    slug: "maatwerk_besluiten",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "fs_maatwerk_numbers_besluiten_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Afgehandeld",
              column: "afgerond",
              colour: "moss",
              units: "afgehandeld",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Besluiten",
              column: "beschikt",
              colour: "blue",
              units: "besluiten",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Anders afgehandeld",
              column: "anders_afgehandeld",
              colour: "orange",
              units: "anders afgehandeld",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Percentage binnen termijn",
              column: "beschikt_binn_termijn",
              colour: "moss",
              format: "percentage",
              units: "afgehandeld binnen termijn",
              modifiers: { cumul: "_cumul_perc", delta: "_perc" },
            },
            // {
            //   label: "Toegekend als maatwerk",
            //   column: "toegekend_als_maatwerk",
            //   colour: "purple",
            //   units: "toegekend als maatwerk"
            // },
            // {
            //   label: "Toegekend als maatwerk",
            //   column: "toegekend_als_herstel_aannemer_instituut",
            //   colour: "yellow",
            //   units: "herstel aannemer instituut"
            // },
            // {
            //   label: "Toegekend als maatwerk",
            //   column: "toegekend_als_herstel_eigen_aannemer",
            //   colour: "green",
            //   units: "herstel eigen aannemer"
            // }
          ],
          [],
        ],
        segment: {
          key: "beschikt",
          cumulative: true,
          periodization: "weekly",
        },
      },
    ],
    segment: {
      key: "beschikt_binn_termijn_perc",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: [],
  },
  // // toegekend/afgewezen
  {
    slug: "maatwerk_toegekend",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "fs_maatwerk_numbers_toekenningen_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Toegekend als maatwerk",
              column: "toegekend_mv",
              colour: "moss",
              units: "toegekend als maatwerk",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Toegekend als HEA",
              column: "toegekend_hea",
              colour: "purple",
              units: "toegekend als HEA",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Toegekend als HAI",
              column: "toegekend_hai",
              colour: "blue",
              units: "toegekend als HAI",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Afgewezen",
              column: "afgewezen",
              colour: "orange",
              units: "afgewezen",
              excludeFromTable: true,
              modifiers: { cumul: "_cumul", delta: "_aantal" }
            },
          ],
          [],
        ],
        segment: {
          key: "beschikt",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "fs_maatwerk_toegekend_taart",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Toegekend als MW",
              column: "toegekend_mv",
              colour: "moss",
              units: "toegekend als MW",
              modifiers: { cumul: "_cumul", delta: "_aantal" }
            },
            {
              label: "Toegekend als HEA",
              column: "toegekend_hea",
              colour: "purple",
              units: "toegekend als HEA",
              modifiers: { cumul: "_cumul", delta: "_aantal" }
            },
            {
              label: "Toegekend als HAI",
              column: "toegekend_hai",
              colour: "blue",
              units: "toegekend als HAI",
              modifiers: { cumul: "_cumul", delta: "_aantal" }
            },
            {
              label: "Afgewezen",
              column: "afgewezen",
              colour: "orange",
              scale: "null",
              format: "",
              modifiers: { cumul: "_cumul", delta: "_aantal" }
            },
          ],
          [
            {
              label: "Besluiten",
              column: "beschikt",
              colour: "gray",
              scale: "null",
              format: "",
              excludeFromTable: true,
              modifiers: { cumul: "_cumul", delta: "_aantal" }
            },
          ],
        ],
        segment: {
          key: "beschikt",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "fs_maatwerk_toegekend_trend",
        ctrlr: "BarTrendStackedMakeup",
        filters: ["absoluteVsNormalized", "weekVsMonth"],
        args: [],
        parameters: [
          [
            {
              label: "Toegekend als MW",
              column: "toegekend_mv",
              colour: "moss",
              units: "toegekend als MW",
              modifiers: { cumul: "_cumul", delta: "_aantal" }
            },
            {
              label: "Toegekend als HAI",
              column: "toegekend_hai",
              colour: "blue",
              units: "toegekend als HAI",
              modifiers: { cumul: "_cumul", delta: "_aantal" }
            },
            {
              label: "Toegekend als HEA",
              column: "toegekend_hea",
              colour: "purple",
              units: "toegekend als HEA",
              modifiers: { cumul: "_cumul", delta: "_aantal" }
            },
            {
              label: "Afgewezen",
              column: "afgewezen",
              colour: "orange",
              scale: "null",
              format: "",
              excludeFromTable: true,
              modifiers: { cumul: "_cumul", delta: "_aantal" }
            },
          ],
        ],
        segment: {
          key: "toegekend",
          cumulative: false,
          periodization: "monthly",
          label: "besluiten",
          normalized: false,
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: [],
    segment: {
      key: "toegekend",
      cumulative: true,
      periodization: "weekly",
    },
  },
  // // termijn
  {
    slug: "maatwerk_binnen_buiten",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "fs_maatwerk_binnen_termijn",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Binnen termijn",
              column: "beschikt_binn_termijn",
              colour: "moss",
              scale: "null",
              format: "",
              modifiers: { cumul: "_cumul", delta: "_aantal" }
            },
            {
              label: "Buiten termijn",
              column: "beschikt_buit_termijn",
              colour: "orange",
              scale: "null",
              format: "",
              modifiers: { cumul: "_cumul", delta: "_aantal" }
            },
          ],
          [
            {
              label: "Besluiten",
              column: "beschikt",
              colour: "gray",
              scale: "null",
              format: "",
              modifiers: { cumul: "_cumul", delta: "_aantal" }
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
              column: "beschikt_binn_termijn_cumul_perc",
              colour: "orange",
              format: "percentage",
              // modifiers: { cumul: "_cumul_perc", delta: "_perc" }
            },
          ],
        ],
        modifiers: [],
        segment: {
          key: "beschikt_binn_termijn_cumul_perc",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "beschikt_binn_termijn_cumul_perc",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: [],
  },
  // // duur
  // {
  //   slug: "maatwerk_duur",
  //   ctrlr: "DefaultGroupV1",
  //   graphs: [
  //     {
  //       slug: "fs_maatwerk_duur_numbers_v1",
  //       ctrlr: "NumbersMultiplesTitledV1",
  //       args: [],
  //       filters: [],
  //       multiples: "incremental",
  //       parameters: [
  //         [
  //           {
  //             label: "Mediaan",
  //             column: "maatwerk_dlt_gerealiseerd_mediaan_dagen",
  //             colour: "orange",
  //             units: "gerealiseerd aantal dagen",
  //           },
  //           {
  //             label: "Gemiddelde",
  //             column: "maatwerk_dlt_gerealiseerd_gemiddeld_dagen",
  //             colour: "blue",
  //             units: "gerealiseerd aantal dagen",
  //           },
  //           {
  //             label: "Verwacht",
  //             column: "maatwerk_dlt_verwacht_rolling8_dagen",
  //             colour: "moss",
  //             format: "roundup",
  //             units: "aantal dagen",
  //           },
  //         ],
  //         [],
  //       ],
  //       modifiers: [],
  //       segment: {
  //         key: "maatwerk_dlt_gerealiseerd_mediaan_dagen",
  //         cumulative: false,
  //         periodization: "weekly",
  //       },
  //     },
  //     {
  //       slug: "fs_maatwerk_duur_trend",
  //       ctrlr: "BarTrendV1",
  //       filters: ["parameterSelect"],
  //       args: [],
  //       parameters: [
  //         [
  //           {
  //             label: "Gerealiseerde mediaan aantal dagen tot besluit",
  //             column: "maatwerk_dlt_gerealiseerd_mediaan_dagen",
  //             colour: "orange",
  //             units: "mediaan gerealiseerd aantal dagen",
  //           },
  //           {
  //             label: "Gerealiseerd gemiddeld aantal dagen tot besluit",
  //             column: "maatwerk_dlt_gerealiseerd_gemiddeld_dagen",
  //             colour: "blue",
  //             units: "gemiddeld gerealiseerd aantal dagen",
  //           },
  //         ],
  //       ],
  //       segment: {
  //         key: "maatwerk_dlt_gerealiseerd_mediaan_dagen",
  //         cumulative: false,
  //         periodization: "monthly",
  //         label: "dagen",
  //       },
  //     },
  //     {
  //       slug: "fs_maatwerk_duur_trend2",
  //       ctrlr: "BarTrendDLTV1",
  //       header: "Verwacht aantal dagen tot besluit",
  //       filters: [],
  //       args: [],
  //       parameters: [
  //         [
  //           {
  //             label: "Verwacht aantal dagen tot besluit",
  //             column: "maatwerk_dlt_verwacht_rolling8_dagen",
  //             colour: "moss",
  //             units: "verwacht aantal dagen",
  //           },
  //         ],
  //       ],
  //       segment: {
  //         key: "maatwerk_dlt_verwacht_rolling8_dagen",
  //         cumulative: false,
  //         periodization: "weekly",
  //         label: "dagen",
  //       },
  //     },
  //   ],
  //   segment: {
  //     key: "maatwerk_dlt_gerealiseerd_mediaan_dagen",
  //     cumulative: false,
  //     periodization: "weekly",
  //     label: "dagen",
  //   },
  //   functionality: ["table", "definitions", "download"],
  //   endpoints: ["fysiek_maatwerk_wekelijks", "fysiek_maatwerk_maandelijks"],
  // },
  // // voorrraad
  // {
  //   slug: "maatwerk_voorraad",
  //   ctrlr: "DefaultGroupV1",
  //   graphs: [
  //     {
  //       slug: "maatwerk_voorrraad_getallen",
  //       ctrlr: "NumbersMultiplesTitledV1",
  //       args: [],
  //       filters: [],
  //       multiples: "incremental",
  //       parameters: [
  //         [
  //           {
  //             label: "Voorraad",
  //             column: "maatwerk_voorraad_cumulatief",
  //             colour: "blue",
  //             units: "voorraad",
  //           },
  //           {
  //             label: "Beslistermijn",
  //             column: "maatwerk_beslistermijn_dagen",
  //             colour: "moss",
  //             format: "decimal",
  //             units: "dagen",
  //           },
  //           // {
  //           //   label: "Mediaan",
  //           //   column: "maatwerk_oud_voorraad_mediaan_dagen",
  //           //   colour: "orange",
  //           //   units: "dagen in voorraad",
  //           // },
  //           // {
  //           //   label: "Gemiddelde",
  //           //   column: "maatwerk_oud_voorraad_gemiddeld_dagen",
  //           //   colour: "blue",
  //           //   units: "dagen in voorraad",
  //           // },
  //         ],
  //         [],
  //       ],
  //       modifiers: [],
  //       segment: {
  //         key: "maatwerk_beslistermijn_dagen",
  //         cumulative: false,
  //         periodization: "weekly",
  //       },
  //     },
  //     {
  //       slug: "maatwerk_voorraad_groepen",
  //       ctrlr: "SegmentsV1",
  //       args: [],
  //       filters: [],
  //       parameters: [
  //         [
  //           {
  //             label: "< 182 dagen",
  //             column: "maatwerk_oud_voorraad_binnen_termijn",
  //             colour: "orange",
  //           },
  //           {
  //             label: "182 - 364 dagen",
  //             column: "maatwerk_oud_voorraad_1_2_termijn",
  //             colour: "moss",
  //           },
  //           {
  //             label: "364 - 728 dagen",
  //             column: "maatwerk_oud_voorraad_2_4_termijn",
  //             colour: "blue",
  //           },
  //           {
  //             label: "> 728 dagen",
  //             column: "maatwerk_oud_voorraad_buiten_4_termijn",
  //             colour: "purple",
  //           },
  //         ],
  //       ],
  //       modifiers: [],
  //       segment: {
  //         key: "maatwerk_oud_voorraad_binnen_termijn",
  //         cumulative: false,
  //         periodization: "weekly",
  //       },
  //     },
  //     //
  //   ],
  //   segment: {
  //     key: "maatwerk_oud_voorraad_binnen_termijn",
  //     cumulative: false,
  //     periodization: "weekly",
  //   },
  //   functionality: ["table", "definitions", "download"],
  //   endpoints: ["fysiek_maatwerk_wekelijks", "fysiek_maatwerk_maandelijks"],
  // },
  // // bezwaren
  // {
  //   slug: "maatwerk_bezwaren",
  //   ctrlr: "DefaultGroupV1",
  //   graphs: [
  //     {
  //       slug: "fs_maatwerk_bezwaren_numbers_v1",
  //       ctrlr: "NumbersMultiplesTitledV1",
  //       args: [],
  //       filters: [],
  //       multiples: "incremental",
  //       parameters: [
  //         [
  //           {
  //             label: "Ingediend",
  //             column: "maatwerk_bz_ingediend_cumulatief",
  //             colour: "orange",
  //             units: "bezwaren",
  //           },
  //           {
  //             label: "In procedure",
  //             column: "maatwerk_bz_voorraad_cumulatief",
  //             colour: "purple",
  //             units: "bezwaren",
  //           },
  //           {
  //             label: "Afgerond",
  //             column: "maatwerk_bz_afgerond_cumulatief",
  //             colour: "moss",
  //             units: "bezwaren",
  //           },
  //           {
  //             label: "Bezwaarpercentage",
  //             column: "maatwerk_bz_perc_cumulatief",
  //             colour: "blue",
  //             format: "percentage",
  //             units: "t.o.v. aantal besluiten",
  //           },
  //         ],
  //         [],
  //       ],
  //       modifiers: [],
  //       segment: {
  //         key: "maatwerk_bz_ingediend",
  //         cumulative: false,
  //         periodization: "weekly",
  //       },
  //     },
  //     {
  //       slug: "bezwaren_taart_toegekend",
  //       ctrlr: "PieChartSumV1",
  //       args: [],
  //       parameters: [
  //         [
  //           {
  //             label: "Toegekend",
  //             column: "maatwerk_bz_toegekend_cumulatief",
  //             colour: "moss",
  //           },
  //           {
  //             label: "Afgewezen",
  //             column: "maatwerk_bz_afgewezen_cumulatief",
  //             colour: "orange",
  //           },
  //           {
  //             label: "Anders afgerond",
  //             column: "maatwerk_bz_anders_afgehandeld_cumulatief",
  //             colour: "blue",
  //           },
  //         ],
  //         [
  //           {
  //             label: "Totaal afgerond",
  //             column: "maatwerk_bz_afgerond_cumulatief",
  //             colour: "gray",
  //           },
  //         ],
  //       ],
  //       segment: {
  //         key: "maatwerk_bz_toegekend_cumulatief",
  //         cumulative: true,
  //         periodization: "weekly",
  //       },
  //     },
  //   ],
  //   segment: {
  //     key: "maatwerk_bz_toegekend_cumulatief",
  //     cumulative: false,
  //     periodization: "weekly",
  //   },
  //   functionality: ["table", "definitions", "download"],
  //   endpoints: ["fysiek_maatwerk_wekelijks", "fysiek_maatwerk_maandelijks"],
  // },
]
}

export default pageConfig;
