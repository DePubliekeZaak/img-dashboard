import { IGroupMappingV2 } from "../shared/interfaces";

const group: IGroupMappingV2[] = [
  {
    slug: "maatwerk_totals",
    ctrlr: "IntroGroupV1",
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
              label: "Aanvragen",
              column: "maatwerk_ingediend",
              colour: "orange",
              units: "aanvragen",
            },
            {
              label: "Voorraad",
              column: "maatwerk_voorraad",
              colour: "blue",
              units: "voorraad",
            },
            {
              label: "Afgehandeld",
              column: "maatwerk_afgerond",
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
          key: "maatwerk_ingediend",
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
              label: "Aanvragen",
              column: "maatwerk_ingediend",
              colour: "orange",
            },
            {
              label: "Afgehandeld",
              column: "maatwerk_afgerond",
              colour: "moss",
            },
            {
              label: "Vooraad",
              column: "maatwerk_voorraad",
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
          key: "maatwerk_afgerond",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_maatwerk_wekelijks", "fysiek_maatwerk_maandelijks"],
  },
  {
    slug: "maatwerk_bedragen",
    ctrlr: "BedragenGroupV1",
    graphs: [
      {
        slug: "fs_maatwerk_numbers_2",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Verleende schade",
              column: "maatwerk_bedrag_verleend_schade",
              colour: "blue",
              format: "currency",
              units: "totaal verleende schade",
            },
            {
              label: "Verleend",
              column: "maatwerk_bedrag_verleend_totaal",
              colour: "moss",
              format: "currency",
              units: "totaal beschikte bedragen",
            },
            {
              label: "Uitgekeerd",
              column: "maatwerk_bedrag_uitgekeerd_totaal",
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
          key: "maatwerk_bedrag_verleend_totaal",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "maatwerk_bedragen_trend",
        ctrlr: "BarTrendV1",
        args: [],
        filters: ["parameterSelect", "cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "Verleend totaal",
              column: "maatwerk_bedrag_verleend_totaal",
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
          key: "maatwerk_bedrag_verleend_totaal",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_maatwerk_wekelijks", "fysiek_maatwerk_maandelijks"],
  },
  {
    slug: "maatwerk_besluiten",
    ctrlr: "BesluitenGroupV1",
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
              label: "Besluiten",
              column: "maatwerk_beschikt",
              colour: "moss",
              units: "besluiten",
            },
            {
              label: "Anders afgehandeld",
              column: "maatwerk_anders_afgehandeld",
              colour: "moss",
              units: "anders afgehandeld",
            },
            {
              label: "Afgehandeld",
              column: "maatwerk_afgerond",
              colour: "moss",
              units: "afgehandeld",
            },
            {
              label: "Percentage binnen termijn",
              column: "maatwerk_beschikt_binn_termijn_perc",
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
          key: "maatwerk_beschikt",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "fs_maatwerk_binnen_termijn",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Binnen termijn",
              column: "maatwerk_beschikt_binn_termijn_cumulatief",
              colour: "moss",
              scale: "null",
              format: "",
            },
            {
              label: "Buiten termijn",
              column: "maatwerk_beschikt_buiten_termijn_cumulatief",
              colour: "orange",
              scale: "null",
              format: "",
            },
          ],
          [
            {
              label: "Besluiten",
              column: "maatwerk_beschikt_cumulatief",
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
              column: "maatwerk_beschikt_binn_termijn_perc",
              colour: "orange",
              format: "percentage",
            },
          ],
        ],
        modifiers: [],
        segment: {
          key: "maatwerk_beschikt_binn_termijn_perc",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_maatwerk_wekelijks", "fysiek_maatwerk_maandelijks"],
  },
  {
    slug: "maatwerk_toegewezen",
    ctrlr: "ToegewezenV1",
    filters: [],
    graphs: [
      {
        slug: "fs_maatwerk_toegewezen_taart",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Toegewezen",
              column: "maatwerk_toegekend_cumulatief",
              colour: "moss",
              scale: "null",
              format: "",
            },
            {
              label: "Afgewezen",
              column: "maatwerk_afgewezen_cumulatief",
              colour: "orange",
              scale: "null",
              format: "",
            },
          ],
          [
            {
              label: "Besluiten",
              column: "maatwerk_beschikt_cumulatief",
              colour: "gray",
              scale: "null",
              format: "",
            },
          ],
        ],
      },
      {
        slug: "fs_maatwerk_toegewezen_trend",
        ctrlr: "BarTrendStackedMakeup",
        filters: ["absoluteVsNormalized", "weekVsMonth"],
        args: [],
        parameters: [
          [
            {
              label: "Toekenningen",
              column: "maatwerk_toegekend",
              colour: "moss",
              scale: "null",
              format: "",
            },
            {
              label: "Afgewezen",
              column: "maatwerk_afgewezen",
              colour: "orange",
              scale: "null",
              format: "",
            },
          ],
        ],
        segment: {
          key: "maatwerk_toegekend",
          cumulative: false,
          periodization: "monthly",
          label: "besluiten",
          normalized: false,
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_maatwerk_wekelijks", "fysiek_maatwerk_maandelijks"],
    segment: {
      key: "maatwerk_toegekend_cumulatief",
      cumulative: true,
      periodization: "monthly",
    },
  },
  {
    slug: "duur",
    ctrlr: "DuurGroupV1",
    graphs: [
      {
        slug: "fs_maatwerk_duur_numbers_v1",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        // "multiples": "cumulative"
        parameters: [
          [
            {
              label: "Verwacht aantal dagen tot besluit",
              column: "maatwerk_dlt_verwacht_rolling8_dagen",
              colour: "moss",
              units: "verwacht aantal dagen",
            },
            {
              label: "Gerealiseerd gemiddelds aantal dagen tot besluit",
              column: "maatwerk_dlt_gerealiseerd_gemiddeld_dagen",
              colour: "blue",
              units: "gemiddeld gerealiseerd aantal dagen",
            },
            {
              label: "Gerealiseerde mediaan aantal dagen tot besluit",
              column: "maatwerk_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "mediaan gerealiseerd aantal dagen",
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "maatwerk_dlt_verwacht_rolling8_dagen",
          cumulative: true,
          periodization: "monthly",
        },
      },
      {
        slug: "fs_maatwerk_duur_trend",
        ctrlr: "BarTrendV1",
        filters: ["parameterSelect"],
        args: [],
        parameters: [
          [
            {
              label: "Gerealiseerd gemiddeld aantal dagen tot besluit",
              column: "maatwerk_dlt_gerealiseerd_gemiddeld_dagen",
              colour: "blue",
              units: "gemiddeld gerealiseerd aantal dagen",
            },
            {
              label: "Gerealiseerde mediaan aantal dagen tot besluit",
              column: "maatwerk_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "mediaan gerealiseerd aantal dagen",
            },
            {
              label: "Verwacht aantal dagen tot besluit",
              column: "maatwerk_dlt_verwacht_rolling8_dagen",
              colour: "moss",
              units: "verwacht aantal dagen",
            },
          ],
        ],
        segment: {
          key: "maatwerk_dlt_gerealiseerd_gemiddeld_dagen",
          cumulative: false,
          periodization: "monthly",
          label: "dagen",
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_maatwerk_wekelijks", "fysiek_maatwerk_maandelijks"],
  },
  {
    slug: "maatwerk_voorraad",
    ctrlr: "VoorraadGroupV1",
    graphs: [
      {
        slug: "maatwerk_ouderdom_voorraad",
        ctrlr: "SegmentsV1",
        args: [],
        filters: [],
        parameters: [
          [
            {
              label: "0 tot 8 weken",
              column: "maatwerk_oud_voorraad_binnen_termijn",
              colour: "orange",
            },
            {
              label: "1 - 2 x termijn",
              column: "maatwerk_oud_voorraad_1_2_termijn",
              colour: "moss",
            },
            {
              label: "2 - 4 x termijn",
              column: "maatwerk_oud_voorraad_2_4_termijn",
              colour: "blue",
            },
            {
              label: "4 x termijn",
              column: "maatwerk_oud_voorraad_buiten_4_termijn",
              colour: "purple",
            },
          ],
        ],
        modifiers: [],
        segment: {
          key: "maatwerk_oud_voorraad_binnen_termijn",
          cumulative: false,
          periodization: "monthly",
        },
      },
      //
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_maatwerk_wekelijks", "fysiek_maatwerk_maandelijks"],
  },
  {
    slug: "bezwaren_mw",
    ctrlr: "BezwarenV1",
    graphs: [
      {
        slug: "fs_maatwerk_bezwaren_numbers_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Ingediende bezwaren",
              column: "maatwerk_bz_ingediend",
              colour: "moss",
              units: "ingediende bezwaren",
            },
            {
              label: "Voorraad",
              column: "maatwerk_bz_voorraad",
              colour: "green",
              units: "bewzaren in procedure",
            },
            {
              label: "Afgerond",
              column: "maatwerk_bz_afgerond",
              colour: "blue",
              units: "afgeronde bezwaren",
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "maatwerk_bz_ingediend",
          cumulative: true,
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
              column: "maatwerk_bz_toegekend_cumulatief",
              colour: "moss",
            },
            {
              label: "Afgewezen",
              column: "maatwerk_bz_afgewezen_cumulatief",
              colour: "orange",
            },
            {
              label: "Anders afgerond",
              column: "maatwerk_bz_anders_afgehandeld_cumulatief",
              colour: "blue",
            },
          ],
          [
            {
              label: "Totaal afgerond",
              column: "maatwerk_bz_afgerond_cumulatief",
              colour: "gray",
            },
          ],
        ],
        segment: {
          key: "maatwerk_bz_toegekend_cumulatief",
          cumulative: true,
          periodization: "monthly",
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_maatwerk_wekelijks", "fysiek_maatwerk_maandelijks"],
  },
];

export default group;
