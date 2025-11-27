import { IGroupMappingV2 } from "../shared/interfaces";

const mapping: IGroupMappingV2[] = [
  {
    slug: "ves_intro",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "ves_numbers_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Aanvragen",
              column: "ves_ingediend",
              colour: "orange",
              units: "aanvragen",
            },
            {
              label: "Voorraad",
              column: "ves_voorraad",
              colour: "blue",
              units: "voorraad",
            },
            {
              label: "Afgehandeld",
              column: "ves_afgerond",
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
          key: "ves_ingediend",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "ves_trend",
        ctrlr: "BarTrendV1",
        args: [],
        filters: ["parameterSelect", "cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "Aanvragen",
              column: "ves_ingediend",
              colour: "orange",
            },
            {
              label: "Afgehandeld",
              column: "ves_afgerond",
              colour: "moss",
            },
            {
              label: "Vooraad",
              column: "ves_voorraad",
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
          key: "ves_ingediend",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "ves_ingediend",
      cumulative: true,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_ves_wekelijks", "fysiek_ves_maandelijks"],
  },
  {
    slug: "ves_bedragen",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "fs_ves_numbers_2",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Verleende schade",
              column: "ves_bedrag_verleend_schade",
              colour: "blue",
              format: "currency",
              units: "totaal verleende schade",
            },
            {
              label: "Verleend",
              column: "ves_bedrag_verleend_totaal",
              colour: "moss",
              format: "currency",
              units: "totaal verleende bedragen",
            },
            {
              label: "Uitgekeerd",
              column: "ves_bedrag_uitgekeerd_totaal",
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
          key: "ves_bedrag_verleend_totaal",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "ves_bedragen_trend",
        ctrlr: "BarTrendV1",
        args: [],
        filters: ["parameterSelect", "cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "Totaal verleende schade",
              column: "ves_bedrag_verleend_totaal",
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
          key: "ves_bedrag_verleend_totaal",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "ves_bedrag_verleend_totaal",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_ves_wekelijks", "fysiek_ves_maandelijks"],
  },
  {
    slug: "ves_waardering",
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
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["tevredenheid", "tevredenheid"],
    segment: {
      key: "ves_maandcijfer",
      cumulative: false,
      periodization: "monthly",
    },
  },
  {
    slug: "ves_besluiten",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "fs_ves_numbers_besluiten_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Besluiten",
              column: "ves_beschikt",
              colour: "moss",
              units: "besluiten",
            },
            {
              label: "Anders afgehandeld",
              column: "ves_anders_afgehandeld",
              colour: "moss",
              units: "anders afgehandeld",
            },
            {
              label: "Afgehandeld",
              column: "ves_afgerond",
              colour: "moss",
              units: "afgehandeld",
            },
            {
              label: "Percentage binnen termijn",
              column: "ves_beschikt_binn_termijn_perc",
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
          key: "ves_beschikt",
          cumulative: true,
          periodization: "weekly",
        },
      },
    ],
    segment: {
      key: "ves_beschikt_binn_termijn_perc",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_ves_wekelijks", "fysiek_ves_maandelijks"],
  },
  {
    slug: "ves_toegewezen",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "ves_maatwerk_toegewezen_taart",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Toegewezen",
              column: "ves_toegekend_cumulatief",
              colour: "moss",
              scale: "null",
              format: "",
            },
            {
              label: "Afgewezen",
              column: "ves_afgewezen_cumulatief",
              colour: "orange",
              scale: "null",
              format: "",
            },
          ],
          [
            {
              label: "Besluiten",
              column: "ves_beschikt_cumulatief",
              colour: "gray",
              scale: "null",
              format: "",
            },
          ],
        ],
      },
      {
        slug: "ves_maatwerk_toegewezen_trend",
        ctrlr: "BarTrendStackedMakeup",
        filters: ["absoluteVsNormalized", "weekVsMonth"],
        args: [],
        parameters: [
          [
            {
              label: "Toegewezen",
              column: "ves_toegekend",
              colour: "moss",
              scale: "null",
              format: "",
            },
            {
              label: "Afgewezen",
              column: "ves_afgewezen",
              colour: "orange",
              scale: "null",
              format: "",
            },
          ],
        ],
        segment: {
          key: "ves_toegekend",
          cumulative: false,
          periodization: "monthly",
          label: "besluiten",
          normalized: false,
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_ves_wekelijks", "fysiek_ves_maandelijks"],
    segment: {
      key: "ves_toegekend_cumulatief",
      cumulative: true,
      periodization: "monthly",
    },
  },
  {
    slug: "ves_duur",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "ves_duur_numbers_v1",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Verwacht",
              column: "ves_dlt_verwacht_rolling8_dagen",
              colour: "moss",
              units: "aantal dagen",
            },
            {
              label: "Mediaan",
              column: "ves_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "gerealiseerd aantal dagen",
            },
            {
              label: "Gemiddelde",
              column: "ves_dlt_gerealiseerd_gemiddeld_dagen",
              colour: "blue",
              units: "gerealiseerd aantal dagen",
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "ves_dlt_verwacht_rolling8_dagen",
          cumulative: false,
          periodization: "monthly",
        },
      },
      {
        slug: "ves_duur_trend",
        ctrlr: "BarTrendV1",
        filters: ["parameterSelect"],
        args: [],
        parameters: [
          [
            {
              label: "Gerealiseerd gemiddeld aantal dagen tot besluit",
              column: "ves_dlt_gerealiseerd_gemiddeld_dagen",
              colour: "blue",
              units: "gemiddeld gerealiseerd aantal dagen",
            },
            {
              label: "Gerealiseerde mediaan aantal dagen tot besluit",
              column: "ves_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "mediaan gerealiseerd aantal dagen",
            },
            {
              label: "Verwacht aantal dagen tot besluit",
              column: "ves_dlt_verwacht_rolling8_dagen",
              colour: "moss",
              units: "verwacht aantal dagen",
            },
          ],
        ],
        segment: {
          key: "ves_dlt_gerealiseerd_gemiddeld_dagen",
          cumulative: false,
          periodization: "monthly",
          label: "dagen",
        },
      },
    ],
    segment: {
      key: "ves_dlt_gerealiseerd_gemiddeld_dagen",
      cumulative: false,
      periodization: "monthly",
      label: "dagen",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_ves_wekelijks", "fysiek_ves_maandelijks"],
  },
  {
    slug: "ves_voorraad",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "ves_voorrraad_getallen",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Beslistermijn",
              column: "ves_beslistermijn_dagen",
              colour: "moss",
              units: "dagen",
            },
            {
              label: "Mediaan",
              column: "ves_oud_voorraad_mediaan_dagen",
              colour: "orange",
              units: "dagen in voorraad",
            },
            {
              label: "Gemiddelde",
              column: "ves_oud_voorraad_gemiddeld_dagen",
              colour: "blue",
              units: "dagen in voorraad",
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "ves_oud_voorraad_gemiddeld_dagen",
          cumulative: false,
          periodization: "weekly",
        },
      },
      {
        slug: "ves_voorraad_groepen",
        ctrlr: "SegmentsV1",
        args: [],
        filters: [],
        parameters: [
          [
            {
              label: "< 182 dagen",
              column: "ves_oud_voorraad_binnen_termijn",
              colour: "orange",
            },
            {
              label: "182 - 364 dagen",
              column: "ves_oud_voorraad_1_2_termijn",
              colour: "moss",
            },
            {
              label: "364 - 728 dagen",
              column: "ves_oud_voorraad_2_4_termijn",
              colour: "blue",
            },
            {
              label: "> 728 dagen",
              column: "ves_oud_voorraad_buiten_4_termijn",
              colour: "purple",
            },
          ],
        ],
        modifiers: [],
        segment: {
          key: "ves_oud_voorraad_binnen_termijn",
          cumulative: false,
          periodization: "monthly",
        },
      },
      //
    ],
    segment: {
      key: "ves_oud_voorraad_binnen_termijn",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_ves_wekelijks", "fysiek_ves_maandelijks"],
  },
  {
    slug: "ves_bezwaren",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "fs_ves_bezwaren_numbers_v1",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Ingediend",
              column: "ves_bz_ingediend_cumulatief",
              colour: "moss",
              units: "bezwaren",
            },
            {
              label: "In procedure",
              column: "ves_bz_voorraad_cumulatief",
              colour: "green",
              units: "bewzaren",
            },
            {
              label: "Afgerond",
              column: "ves_bz_afgerond_cumulatief",
              colour: "blue",
              units: "bezwaren",
            },
            {
              label: "Bezwaarpercentage",
              column: "ves_bz_perc_cumulatief",
              colour: "orange",
              format: "percentage",
              units: "t.o.v. aantal besluiten",
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "ves_bz_ingediend",
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
              column: "ves_bz_toegekend_cumulatief",
              colour: "moss",
            },
            {
              label: "Afgewezen",
              column: "ves_bz_afgewezen_cumulatief",
              colour: "orange",
            },
            {
              label: "Anders afgerond",
              column: "ves_bz_anders_afgehandeld_cumulatief",
              colour: "blue",
            },
          ],
          [
            {
              label: "Totaal afgerond",
              column: "ves_bz_afgerond_cumulatief",
              colour: "gray",
            },
          ],
        ],
        segment: {
          key: "ves_bz_toegekend_cumulatief",
          cumulative: true,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "ves_bz_toegekend_cumulatief",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_ves_wekelijks", "fysiek_ves_maandelijks"],
  },
];

export default mapping;
