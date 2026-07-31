import type { IPageConfig } from "../../shared/interfaces";

const DOMEIN_CODE = "FYSIEK";
const REGELING_CODE = "VV";

const pageConfig: IPageConfig = {
  slug: "fs_vaste_vergoedingen",
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
    `regelingen?aggregatie=eq.maand&domein_code=eq.${DOMEIN_CODE}&regeling_code=eq.${REGELING_CODE}&order=periode.desc`,
  ],
  groups: [
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
              column: "ingediend",
              colour: "orange",
              units: "aanvragen",
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
          key: "ingediend",
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
              colour: "moss",
              modifiers: { cumul: "_cumul", delta: "_verschil" },
            },
          ],
        ],
        segment: {
          key: "ingediend",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "ingediend",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: [],
  },
  // toegekend als (commented out — no active test coverage)
  // {
  //   slug: "vv_toegekend_als",
  //   ctrlr: "DefaultGroupV1",
  //   filters: [],
  //
  //   ],
  //   segment: {
  //     key: "afgerond_ves",
  //     cumulative: true,
  //     periodization: "weekly",
  //   },
  //   functionality: ["table", "definitions", "download"],
  //   endpoints: [],
  // },
  // bedragen
  {
    slug: "vv_bedragen",
    ctrlr: "DefaultGroupV1",
    filters: ["cumulativeVsDelta", "weekVsMonth"],
    graphs: [
      {
        slug: "fs_vv_numbers_2",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            // {
            //   label: "beschikte schade",
            //   column: "bedrag_beschikt_schade",
            //   colour: "blue",
            //   format: "currency",
            //   units: "beschikt schadebedrag",
            // },
            // {
            //   label: "beschikt totaal",
            //   column: "bedrag_beschikt_totaal",
            //   colour: "blue",
            //   format: "currency",
            //   units: "beschikt totaalbedrag",
            // },
            // {
            //   label: "betaalde schade",
            //   column: "bedrag_betaald_schade",
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
              modifiers: { cumul: "_cumul_eur", delta: "_eur" },
            },
          ],
          [],
        ],
        segment: {
          key: "bedrag_betaald_totaal",
          cumulative: true,
          periodization: "monthly",
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
              column: "bedrag_betaald_totaal",
              colour: "blue",
              format: "currency",
              modifiers: { cumul: "_cumul_eur", delta: "_eur" },
            },
          ],
        ],
        segment: {
          key: "bedrag_betaald_totaal",
          cumulative: true,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "bedrag_betaald_totaal",
      cumulative: true,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: [],
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
    endpoints: ["tevredenheid"],
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
              modifiers: { cumul: "_cumul_perc", delta: "_cumul_perc" },
            },
            {
              label: "Vaste vergoeding",
              column: "toegekend_ves",
              colour: "moss",
              units: "toegekend als VES",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Aanvullende vaste vergoeding",
              column: "toegekend_avv",
              colour: "blue",
              units: "toegekend als AVV",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
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
      //         column: "toegekend_ves",
      //         colour: "moss",
      //         units: "vaste vergoeding",
      //         modifiers: { cumul: "_cumul", delta: "_aantal" },
      //       },
      //       {
      //         label: "Aanvullende vaste vergoeding",
      //         column: "toegekend_avv",
      //         colour: "blue",
      //         units: "aanvullende vaste vergoeding",
      //         modifiers: { cumul: "_cumul", delta: "_aantal" },
      //       },
      //     ],
      //     [],
      //   ],
      //   segment: {
      //     key: "afgerond_ves",
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
      //         column: "toegekend_ves",
      //         colour: "moss",
      //         modifiers: { cumul: "_cumul", delta: "_aantal" },
      //       },
      //       {
      //         label: "Aanvullende vaste vergoeding (AVV)",
      //         column: "toegekend_avv",
      //         colour: "blue",
      //         modifiers: { cumul: "_cumul", delta: "_aantal" },
      //       },
      //     ],
      //   ],
      //   segment: {
      //     key: "ingediend",
      //     cumulative: false,
      //     periodization: "monthly",
      //   },
      // },
    ],
    segment: {
      key: "beschikt_binn_termijn_perc",
      cumulative: false,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: [],
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
              column: "toegekend_ves",
              colour: "moss",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Toegekend als AVV",
              column: "toegekend_avv",
              colour: "blue",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Afgewezen",
              column: "afgewezen",
              colour: "orange",
              scale: "null",
              format: "",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
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
              modifiers: { cumul: "_cumul", delta: "_aantal" },
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
        slug: "vv_maatwerk_toegekend_trend",
        ctrlr: "BarTrendStackedMakeup",
        filters: ["absoluteVsNormalized", "weekVsMonth"],
        args: [],
        parameters: [
          [
            {
              label: "Vaste vergoeding (VES)",
              column: "toegekend_ves",
              colour: "moss",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Aanvullende vaste vergoeding (AVV)",
              column: "toegekend_avv",
              colour: "blue",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Afgewezen",
              column: "afgewezen",
              colour: "orange",
              scale: "null",
              format: "",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
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
      key: "beschikt",
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
              column: "dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "gerealiseerd aantal dagen",
            },
            {
              label: "Gemiddelde",
              column: "dlt_gerealiseerd_gemiddeld_dagen",
              colour: "blue",
              units: "gerealiseerd aantal dagen",
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "dlt_gerealiseerd_mediaan_dagen",
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
              label: "Gerealiseerd gemiddeld aantal dagen tot besluit",
              column: "dlt_gerealiseerd_gemiddeld_dagen",
              colour: "blue",
              units: "gemiddeld gerealiseerd aantal dagen",
            },
            {
              label: "Gerealiseerde mediaan aantal dagen tot besluit",
              column: "dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "mediaan gerealiseerd aantal dagen",
            },
           
          ],
        ],
        segment: {
          key: "dlt_gerealiseerd_gemiddeld_dagen",
          cumulative: false,
          periodization: "monthly",
          label: "dagen",
        },
      },
    ],
    segment: {
      key: "dlt_gerealiseerd_mediaan_dagen",
      cumulative: false,
      periodization: "weekly",
      label: "dagen",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: [],
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
              column: "voorraad_cumul",
              colour: "blue",
              units: "voorraad",
              // modifiers: { cumul: "_cumul", delta: "_verschil" },
            },
            {
              label: "Beslistermijn",
              column: "beslistermijn_dagen",
              colour: "moss",
              units: "dagen",
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "beslistermijn_dagen",
          cumulative: true,
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
              column: "oud_voorraad_binnen_termijn",
              colour: "orange",
            },
            {
              label: "56 - 112 dagen",
              column: "oud_voorraad_1_2_termijn",
              colour: "moss",
            },
            {
              label: "112 - 224 dagen",
              column: "oud_voorraad_2_4_termijn",
              colour: "blue",
            },
            {
              label: "> 224 dagen",
              column: "oud_voorraad_buiten_4_termijn",
              colour: "purple",
            },
          ],
        ],
        modifiers: [],
        segment: {
          key: "oud_voorraad_binnen_termijn",
          cumulative: false,
          periodization: "weekly",
        },
      },
    ],
    segment: {
      key: "oud_voorraad_binnen_termijn",
      cumulative: false,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: [],
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
        filters: ["cumulativeVsDelta", "weekVsMonth"],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Ingediend",
              column: "bz_ingediend",
              colour: "orange",
              units: "bezwaren",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "In procedure",
              column: "bz_voorraad",
              colour: "purple",
              units: "bezwaren",
              modifiers: { cumul: "_cumul", delta: "_verschil" },
            },
            {
              label: "Afgerond",
              column: "bz_afgerond",
              colour: "moss",
              units: "bezwaren",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Bezwaarpercentage",
              column: "bz_vertraagd_jaar_perc",
              colour: "blue",
              format: "percentage",
              units: "t.o.v. aantal besluiten",
              modifiers: { cumul: "", delta: "" },
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "bz_ingediend_cumul",
          cumulative: true,
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
              column: "bz_toegekend",
              colour: "moss",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Afgewezen",
              column: "bz_afgewezen",
              colour: "orange",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Anders afgerond",
              column: "bz_anders_afgehandeld",
              colour: "blue",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
          ],
          [
            {
              label: "Totaal afgerond",
              column: "bz_afgerond",
              colour: "gray",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
          ],
        ],
        segment: {
          key: "bz_toegekend_cumul",
          cumulative: true,
          periodization: "weekly",
        },
      },
    ],
    segment: {
      key: "bz_toegekend_cumul",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: [],
  },
],
};

export default pageConfig;