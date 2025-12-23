import { IGroupMappingV2 } from "../shared/interfaces";

const group: IGroupMappingV2[] = [
  {
    slug: "wdl_wd_intro",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "wdl_wd_numbers_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Aanvragen",
              column: "wdl_wd_ingediend",
              colour: "orange",
              units: "aanvragen",
            },
            {
              label: "Voorraad",
              column: "wdl_wd_voorraad",
              colour: "blue",
              units: "voorraad",
            },
            {
              label: "Afgehandeld",
              column: "wdl_wd_afgerond",
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
          key: "wdl_wd_ingediend",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "wdl_wd_trend",
        ctrlr: "BarTrendV1",
        args: [],
        filters: ["parameterSelect", "cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "Aanvragen",
              column: "wdl_wd_ingediend",
              colour: "orange",
            },
            {
              label: "Afgehandeld",
              column: "wdl_wd_afgerond",
              colour: "moss",
            },
            {
              label: "Vooraad",
              column: "wdl_wd_voorraad",
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
          key: "wdl_wd_ingediend",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "wdl_wd_ingediend",
      cumulative: true,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["wdl_wd_wekelijks", "wdl_wd_maandelijks"],
  },
  {
    slug: "wdl_wd_bedragen",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "fs_wdl_wd_numbers_2",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "beschikte schade",
              column: "wdl_wd_bedrag_beschikt_schade",
              colour: "blue",
              format: "currency",
              units: "beschikt schadebedrag",
            },
            {
              label: "beschikt totaal",
              column: "wdl_wd_bedrag_beschikt_totaal",
              colour: "blue",
              format: "currency",
              units: "beschikt totaalbedrag",
            },
            {
              label: "betaalde schade",
              column: "wdl_wd_bedrag_betaald_schade",
              colour: "moss",
              format: "currency",
              units: "betaald schadebedrag",
            },
            {
              label: "betaald totaal",
              column: "wdl_wd_bedrag_betaald_totaal",
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
          key: "wdl_wd_bedrag_betaald_totaal",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "wdl_wd_bedragen_trend",
        ctrlr: "BarTrendV1",
        args: [],
        filters: ["parameterSelect", "cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "Totaal betaald bedrag",
              column: "wdl_wd_bedrag_betaald_totaal",
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
          key: "wdl_wd_bedrag_betaald_totaal",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "wdl_wd_bedrag_betaald_totaal",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["wdl_wd_wekelijks", "wdl_wd_maandelijks"],
  },
  {
    slug: "wdl_wd_waardering",
    ctrlr: "KTOGroupV1",
    graphs: [
      {
        slug: "wdl_wd_waardering_numbers",
        ctrlr: "NumbersPlusRespondentsV1",
        args: [],
        parameters: [
          [
            {
              label: "Sinds start",
              column: "waardedaling_doorlopend_cijfer",
              colour: "orange",
              format: "decimals",
            },
          ],
          [
            {
              label: "Totaal respondenten",
              column: "waardedaling_aantal_respondenten_doorlopend",
              units: "respondenten sinds start",
              colour: "orange",
            },
          ],
        ],
      },
      {
        slug: "wdl_wd_waardering_trend",
        ctrlr: "BarTrendKTOV1",
        args: [],
        filters: [],
        parameters: [
          [
            {
              label: "Maand cijfer",
              column: "waardedaling_maandcijfer",
              colour: "orange",
              format: "decimals",
            },
          ],
          [
            {
              label: "Aantal nieuwe respondenten",
              column: "waardedaling_aantal_respondenten",
              colour: "orange",
              units: "respondenten",
            },
          ],
        ],
        modifiers: [],
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["tevredenheid", "tevredenheid"],
    segment: {
      key: "waardedaling_maandcijfer",
      cumulative: false,
      periodization: "monthly",
    },
  },
  {
    slug: "wdl_wd_besluiten",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "wdl_wd_numbers_besluiten_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Besluiten",
              column: "wdl_wd_beschikt",
              colour: "moss",
              units: "besluiten",
            },
            {
              label: "Anders afgehandeld",
              column: "wdl_wd_anders_afgehandeld",
              colour: "moss",
              units: "anders afgehandeld",
            },
            {
              label: "Afgehandeld",
              column: "wdl_wd_afgerond",
              colour: "moss",
              units: "afgehandeld",
            },
            {
              label: "Percentage binnen termijn",
              column: "wdl_wd_beschikt_binn_termijn_perc",
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
          key: "wdl_wd_beschikt",
          cumulative: true,
          periodization: "weekly",
        },
      },
    ],
    segment: {
      key: "wdl_wd_beschikt_binn_termijn_perc",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["wdl_wd_wekelijks", "wdl_wd_maandelijks"],
  },
  {
    slug: "wdl_wd_toegekend",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "wdl_wd_toegekend_taart",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Toegekend",
              column: "wdl_wd_toegekend_cumulatief",
              colour: "moss",
              scale: "null",
              format: "",
            },
            {
              label: "Afgewezen",
              column: "wdl_wd_afgewezen_cumulatief",
              colour: "orange",
              scale: "null",
              format: "",
            },
          ],
          [
            {
              label: "Besluiten",
              column: "wdl_wd_beschikt_cumulatief",
              colour: "gray",
              scale: "null",
              format: "",
            },
          ],
        ],
      },
      {
        slug: "wdl_wd_toegekend_trend",
        ctrlr: "BarTrendStackedMakeup",
        filters: ["absoluteVsNormalized", "weekVsMonth"],
        args: [],
        parameters: [
          [
            {
              label: "Toegekend",
              column: "wdl_wd_toegekend",
              colour: "moss",
              scale: "null",
              format: "",
            },
            {
              label: "Afgewezen",
              column: "wdl_wd_afgewezen",
              colour: "orange",
              scale: "null",
              format: "",
            },
          ],
        ],
        segment: {
          key: "wdl_wd_toegekend",
          cumulative: false,
          periodization: "monthly",
          label: "besluiten",
          normalized: false,
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["wdl_wd_wekelijks", "wdl_wd_maandelijks"],
    segment: {
      key: "wdl_wd_toegekend_cumulatief",
      cumulative: true,
      periodization: "monthly",
    },
  },
  {
    slug: "wdl_wd_duur",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "wdl_wd_duur_numbers_v1",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Mediaan",
              column: "wdl_wd_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "gerealiseerd aantal dagen",
            },
            {
              label: "Gemiddelde",
              column: "wdl_wd_dlt_gerealiseerd_gemiddeld_dagen",
              colour: "blue",
              units: "gerealiseerd aantal dagen",
            },
            {
              label: "Verwacht",
              column: "wdl_wd_dlt_verwacht_rolling8_dagen",
              colour: "moss",
              units: "aantal dagen",
            }
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "wdl_wd_dlt_verwacht_rolling8_dagen",
          cumulative: false,
          periodization: "monthly",
        },
      },
      {
        slug: "wdl_wd_duur_trend",
        ctrlr: "BarTrendV1",
        filters: ["parameterSelect"],
        args: [],
        parameters: [
          [ {
              label: "Gerealiseerde mediaan aantal dagen tot besluit",
              column: "wdl_wd_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "mediaan gerealiseerd aantal dagen",
            },
            {
              label: "Gerealiseerd gemiddeld aantal dagen tot besluit",
              column: "wdl_wd_dlt_gerealiseerd_gemiddeld_dagen",
              colour: "blue",
              units: "gemiddeld gerealiseerd aantal dagen",
            },
            
            {
              label: "Verwacht aantal dagen tot besluit",
              column: "wdl_wd_dlt_verwacht_rolling8_dagen",
              colour: "moss",
              units: "verwacht aantal dagen",
            },
          ],
        ],
        segment: {
          key: "wdl_wd_dlt_gerealiseerd_mediaan_dagen",
          cumulative: false,
          periodization: "monthly",
          label: "dagen",
        },
      },
    ],
    segment: {
      key: "wdl_wd_dlt_gerealiseerd_mediaan_dagen",
      cumulative: false,
      periodization: "monthly",
      label: "dagen",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["wdl_wd_wekelijks", "wdl_wd_maandelijks"],
  },
  {
    slug: "wdl_wd_voorraad",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "wdl_wd_voorrraad_getallen",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Voorraad",
              column: "wdl_wd_voorraad_cumulatief",
              colour: "blue",
              units: "voorraad",
            },
            {
              label: "Beslistermijn",
              column: "wdl_wd_beslistermijn_dagen",
              colour: "moss",
              units: "dagen",
            },
            // {
            //   label: "Mediaan",
            //   column: "wdl_wd_oud_voorraad_mediaan_dagen",
            //   colour: "orange",
            //   units: "dagen in voorraad",
            // },
            // {
            //   label: "Gemiddelde",
            //   column: "wdl_wd_oud_voorraad_gemiddeld_dagen",
            //   colour: "blue",
            //   units: "dagen in voorraad",
            // },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "wdl_wd_oud_voorraad_gemiddeld_dagen",
          cumulative: false,
          periodization: "weekly",
        },
      },
      {
        slug: "wdl_wd_voorraad_groepen",
        ctrlr: "SegmentsV1",
        args: [],
        filters: [],
        parameters: [
          [
            {
              label: "< 56 dagen",
              column: "wdl_wd_oud_voorraad_binnen_termijn",
              colour: "orange",
            },
            {
              label: "56 - 112 dagen",
              column: "wdl_wd_oud_voorraad_1_2_termijn",
              colour: "moss",
            },
            {
              label: "112 - 224 dagen",
              column: "wdl_wd_oud_voorraad_2_4_termijn",
              colour: "blue",
            },
            {
              label: "> 224 dagen",
              column: "wdl_wd_oud_voorraad_buiten_4_termijn",
              colour: "purple",
            },
          ],
        ],
        modifiers: [],
        segment: {
          key: "wdl_wd_oud_voorraad_binnen_termijn",
          cumulative: false,
          periodization: "monthly",
        },
      },
      //
    ],
    segment: {
      key: "wdl_wd_oud_voorraad_binnen_termijn",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["wdl_wd_wekelijks", "wdl_wd_maandelijks"],
  },
  {
    slug: "wdl_wd_bezwaren",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "fs_wdl_wd_bezwaren_numbers_v1",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Ingediend",
              column: "wdl_wd_bz_ingediend_cumulatief",
              colour: "moss",
              units: "bezwaren",
            },
            {
              label: "In procedure",
              column: "wdl_wd_bz_voorraad_cumulatief",
              colour: "green",
              units: "bewzaren",
            },
            {
              label: "Afgerond",
              column: "wdl_wd_bz_afgerond_cumulatief",
              colour: "blue",
              units: "bezwaren",
            },
            {
              label: "Bezwaarpercentage",
              column: "wdl_wd_bz_perc_cumulatief",
              colour: "orange",
              format: "percentage",
              units: "t.o.v. aantal besluiten",
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "wdl_wd_bz_ingediend",
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
              column: "wdl_wd_bz_toegekend_cumulatief",
              colour: "moss",
            },
            {
              label: "Afgewezen",
              column: "wdl_wd_bz_afgewezen_cumulatief",
              colour: "orange",
            },
            {
              label: "Anders afgerond",
              column: "wdl_wd_bz_anders_afgehandeld_cumulatief",
              colour: "blue",
            },
          ],
          [
            {
              label: "Totaal afgerond",
              column: "wdl_wd_bz_afgerond_cumulatief",
              colour: "gray",
            },
          ],
        ],
        segment: {
          key: "wdl_wd_bz_toegekend_cumulatief",
          cumulative: true,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "wdl_wd_bz_toegekend_cumulatief",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["wdl_wd_wekelijks", "wdl_wd_maandelijks"],
  },
];

export default group;
