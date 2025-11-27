import { IGroupMappingV2 } from "../shared/interfaces";

const group: IGroupMappingV2[] = [
  {
    slug: "ims_kj_intro",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "ims_kj_numbers_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Aanvragen",
              column: "ims_kj_ingediend",
              colour: "orange",
              units: "aanvragen",
            },
            {
              label: "Voorraad",
              column: "ims_kj_voorraad",
              colour: "blue",
              units: "voorraad",
            },
            {
              label: "Afgehandeld",
              column: "ims_kj_afgerond",
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
          key: "ims_kj_ingediend",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "ims_kj_trend",
        ctrlr: "BarTrendV1",
        args: [],
        filters: ["parameterSelect", "cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "Aanvragen",
              column: "ims_kj_ingediend",
              colour: "orange",
            },
            {
              label: "Afgehandeld",
              column: "ims_kj_afgerond",
              colour: "moss",
            },
            {
              label: "Vooraad",
              column: "ims_kj_voorraad",
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
          key: "ims_kj_ingediend",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "ims_kj_ingediend",
      cumulative: true,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["ims_kj_wekelijks", "ims_kj_maandelijks"],
  },
  {
    slug: "ims_kj_bedragen",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "fs_ims_kj_numbers_2",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Verleende schade",
              column: "ims_kj_bedrag_verleend_schade",
              colour: "blue",
              format: "currency",
              units: "totaal verleende schade",
            },
            {
              label: "Verleend",
              column: "ims_kj_bedrag_verleend_totaal",
              colour: "moss",
              format: "currency",
              units: "totaal verleende bedragen",
            },
            {
              label: "Uitgekeerd",
              column: "ims_kj_bedrag_uitgekeerd_totaal",
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
          key: "ims_kj_bedrag_verleend_totaal",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "ims_kj_bedragen_trend",
        ctrlr: "BarTrendV1",
        args: [],
        filters: ["parameterSelect", "cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "Totaal verleende schade",
              column: "ims_kj_bedrag_verleend_totaal",
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
          key: "ims_kj_bedrag_verleend_totaal",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "ims_kj_bedrag_verleend_totaal",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["ims_kj_wekelijks", "ims_kj_maandelijks"],
  },
  {
    slug: "ims_kj_waardering",
    ctrlr: "KTOGroupV1",
    graphs: [
      {
        slug: "ims_kj_waardering_numbers",
        ctrlr: "NumbersPlusRespondentsV1",
        args: [],
        parameters: [
          [
            {
              label: "Sinds start",
              column: "imkj_doorlopend_cijfer",
              colour: "orange",
              format: "decimals",
            },
          ],
          [
            {
              label: "Totaal respondenten",
              column: "imkj_aantal_respondenten_doorlopend",
              units: "respondenten sinds start",
              colour: "orange",
            },
          ],
        ],
      },
      {
        slug: "ims_kj_waardering_trend",
        ctrlr: "BarTrendKTOV1",
        args: [],
        filters: [],
        parameters: [
          [
            {
              label: "Maand cijfer",
              column: "imkj_maandcijfer",
              colour: "orange",
              format: "decimals",
            },
          ],
          [
            {
              label: "Aantal nieuwe respondenten",
              column: "imkj_aantal_respondenten",
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
      key: "imkj_maandcijfer",
      cumulative: false,
      periodization: "monthly",
    },
  },
  {
    slug: "ims_kj_besluiten",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "ims_kj_numbers_besluiten_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Besluiten",
              column: "ims_kj_beschikt",
              colour: "moss",
              units: "besluiten",
            },
            {
              label: "Anders afgehandeld",
              column: "ims_kj_anders_afgehandeld",
              colour: "moss",
              units: "anders afgehandeld",
            },
            {
              label: "Afgehandeld",
              column: "ims_kj_afgerond",
              colour: "moss",
              units: "afgehandeld",
            },
            {
              label: "Percentage binnen termijn",
              column: "ims_kj_beschikt_binn_termijn_perc",
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
          key: "ims_kj_beschikt",
          cumulative: true,
          periodization: "weekly",
        },
      },
    ],
    segment: {
      key: "ims_kj_beschikt_binn_termijn_perc",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["ims_kj_wekelijks", "ims_kj_maandelijks"],
  },
  {
    slug: "ims_kj_toegewezen",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "ims_kj_toegewezen_taart",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Toegewezen",
              column: "ims_kj_toegekend_cumulatief",
              colour: "moss",
              scale: "null",
              format: "",
            },
            {
              label: "Afgewezen",
              column: "ims_kj_afgewezen_cumulatief",
              colour: "orange",
              scale: "null",
              format: "",
            },
          ],
          [
            {
              label: "Besluiten",
              column: "ims_kj_beschikt_cumulatief",
              colour: "gray",
              scale: "null",
              format: "",
            },
          ],
        ],
      },
      {
        slug: "ims_kj_toegewezen_trend",
        ctrlr: "BarTrendStackedMakeup",
        filters: ["absoluteVsNormalized", "weekVsMonth"],
        args: [],
        parameters: [
          [
            {
              label: "Toegewezen",
              column: "ims_kj_toegekend",
              colour: "moss",
              scale: "null",
              format: "",
            },
            {
              label: "Afgewezen",
              column: "ims_kj_afgewezen",
              colour: "orange",
              scale: "null",
              format: "",
            },
          ],
        ],
        segment: {
          key: "ims_kj_toegekend",
          cumulative: false,
          periodization: "monthly",
          label: "besluiten",
          normalized: false,
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["ims_kj_wekelijks", "ims_kj_maandelijks"],
    segment: {
      key: "ims_kj_toegekend_cumulatief",
      cumulative: true,
      periodization: "monthly",
    },
  },
  {
    slug: "ims_kj_duur",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "ims_kj_duur_numbers_v1",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Verwacht",
              column: "ims_kj_dlt_verwacht_rolling8_dagen",
              colour: "moss",
              units: "aantal dagen",
            },
            {
              label: "Mediaan",
              column: "ims_kj_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "gerealiseerd aantal dagen",
            },
            {
              label: "Gemiddelde",
              column: "ims_kj_dlt_gerealiseerd_gemiddeld_dagen",
              colour: "blue",
              units: "gerealiseerd aantal dagen",
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "ims_kj_dlt_verwacht_rolling8_dagen",
          cumulative: false,
          periodization: "monthly",
        },
      },
      {
        slug: "ims_kj_duur_trend",
        ctrlr: "BarTrendV1",
        filters: ["parameterSelect"],
        args: [],
        parameters: [
          [
            {
              label: "Gerealiseerd gemiddeld aantal dagen tot besluit",
              column: "ims_kj_dlt_gerealiseerd_gemiddeld_dagen",
              colour: "blue",
              units: "gemiddeld gerealiseerd aantal dagen",
            },
            {
              label: "Gerealiseerde mediaan aantal dagen tot besluit",
              column: "ims_kj_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "mediaan gerealiseerd aantal dagen",
            },
            {
              label: "Verwacht aantal dagen tot besluit",
              column: "ims_kj_dlt_verwacht_rolling8_dagen",
              colour: "moss",
              units: "verwacht aantal dagen",
            },
          ],
        ],
        segment: {
          key: "ims_kj_dlt_gerealiseerd_gemiddeld_dagen",
          cumulative: false,
          periodization: "monthly",
          label: "dagen",
        },
      },
    ],
    segment: {
      key: "ims_kj_dlt_gerealiseerd_gemiddeld_dagen",
      cumulative: false,
      periodization: "monthly",
      label: "dagen",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["ims_kj_wekelijks", "ims_kj_maandelijks"],
  },
  {
    slug: "ims_kj_voorraad",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "ims_kj_voorrraad_getallen",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Beslistermijn",
              column: "ims_kj_beslistermijn_dagen",
              colour: "moss",
              units: "dagen",
            },
            {
              label: "Mediaan",
              column: "ims_kj_oud_voorraad_mediaan_dagen",
              colour: "orange",
              units: "dagen in voorraad",
            },
            {
              label: "Gemiddelde",
              column: "ims_kj_oud_voorraad_gemiddeld_dagen",
              colour: "blue",
              units: "dagen in voorraad",
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "ims_kj_oud_voorraad_gemiddeld_dagen",
          cumulative: false,
          periodization: "weekly",
        },
      },
      {
        slug: "ims_kj_voorraad_groepen",
        ctrlr: "SegmentsV1",
        args: [],
        filters: [],
        parameters: [
          [
            {
              label: "< 182 dagen",
              column: "ims_kj_oud_voorraad_binnen_termijn",
              colour: "orange",
            },
            {
              label: "182 - 364 dagen",
              column: "ims_kj_oud_voorraad_1_2_termijn",
              colour: "moss",
            },
            {
              label: "364 - 728 dagen",
              column: "ims_kj_oud_voorraad_2_4_termijn",
              colour: "blue",
            },
            {
              label: "> 728 dagen",
              column: "ims_kj_oud_voorraad_buiten_4_termijn",
              colour: "purple",
            },
          ],
        ],
        modifiers: [],
        segment: {
          key: "ims_kj_oud_voorraad_binnen_termijn",
          cumulative: false,
          periodization: "monthly",
        },
      },
      //
    ],
    segment: {
      key: "ims_kj_oud_voorraad_binnen_termijn",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["ims_kj_wekelijks", "ims_kj_maandelijks"],
  },
  {
    slug: "ims_kj_bezwaren",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "fs_ims_kj_bezwaren_numbers_v1",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Ingediend",
              column: "ims_kj_bz_ingediend_cumulatief",
              colour: "moss",
              units: "bezwaren",
            },
            {
              label: "In procedure",
              column: "ims_kj_bz_voorraad_cumulatief",
              colour: "green",
              units: "bewzaren",
            },
            {
              label: "Afgerond",
              column: "ims_kj_bz_afgerond_cumulatief",
              colour: "blue",
              units: "bezwaren",
            },
            {
              label: "Bezwaarpercentage",
              column: "ims_kj_bz_perc_cumulatief",
              colour: "orange",
              format: "percentage",
              units: "t.o.v. aantal besluiten",
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "ims_kj_bz_ingediend",
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
              column: "ims_kj_bz_toegekend_cumulatief",
              colour: "moss",
            },
            {
              label: "Afgewezen",
              column: "ims_kj_bz_afgewezen_cumulatief",
              colour: "orange",
            },
            {
              label: "Anders afgerond",
              column: "ims_kj_bz_anders_afgehandeld_cumulatief",
              colour: "blue",
            },
          ],
          [
            {
              label: "Totaal afgerond",
              column: "ims_kj_bz_afgerond_cumulatief",
              colour: "gray",
            },
          ],
        ],
        segment: {
          key: "ims_kj_bz_toegekend_cumulatief",
          cumulative: true,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "ims_kj_bz_toegekend_cumulatief",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["ims_kj_wekelijks", "ims_kj_maandelijks"],
  },
];

export default group;
