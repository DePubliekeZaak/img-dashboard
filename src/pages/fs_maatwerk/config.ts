import { IGroupMappingV2 } from "../shared/interfaces";

const group: IGroupMappingV2[] = [
  // intro
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
              column: "maatwerk_ingediend",
              colour: "orange",
              units: "meldingen",
            },
            {
              label: "Voorraad",
              column: "maatwerk_voorraad",
              colour: "purple",
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
              label: "Voorraad",
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
          key: "maatwerk_ingediend",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "maatwerk_ingediend",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_maatwerk_wekelijks", "fysiek_maatwerk_maandelijks"],
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
        filters: [],
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
              column: "maatwerk_bedrag_betaald_totaal",
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
          key: "maatwerk_bedrag_betaald_totaal",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "maatwerk_bedragen_trend",
        ctrlr: "BarTrendBedragenV1",
        args: [],
        filters: ["cumulativeVsDelta","weekVsMonth"],
        parameters: [
          [
            {
              label: "Totaal verleende schade",
              column: "maatwerk_bedrag_betaald_totaal",
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
          key: "maatwerk_bedrag_betaald_totaal",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "maatwerk_bedrag_betaald_totaal",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_maatwerk_wekelijks", "fysiek_maatwerk_maandelijks"],
  },
  // waardering
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
    endpoints: ["tevredenheid", "tevredenheid"],
    segment: {
      key: "fysieke_schade_maandcijfer",
      cumulative: false,
      periodization: "monthly",
    },
  },
  // besluiten
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
              column: "maatwerk_afgerond",
              colour: "moss",
              units: "afgehandeld",
            },
            {
              label: "Besluiten",
              column: "maatwerk_beschikt",
              colour: "blue",
              units: "besluiten",
            },
            {
              label: "Anders afgehandeld",
              column: "maatwerk_anders_afgehandeld",
              colour: "orange",
              units: "anders afgehandeld",
            },
            {
              label: "Percentage binnen termijn",
              column: "maatwerk_beschikt_binn_termijn_perc",
              colour: "moss",
              format: "percentage",
              units: "afgehandeld binnen termijn",
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
    ],
    segment: {
      key: "maatwerk_beschikt_binn_termijn_perc",
      cumulative: false,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_maatwerk_wekelijks", "fysiek_maatwerk_maandelijks"],
  },
  // toegekend/afgewezen
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
            // {
            //   label: "Afgehandeld",
            //   column: "maatwerk_afgerond",
            //   colour: "moss",
            //   units: "afgehandeld",
            // },
            // {
            //   label: "Besluiten",
            //   column: "maatwerk_beschikt",
            //   colour: "blue",
            //   units: "besluiten",
            // },
            // {
            //   label: "Anders afgehandeld",
            //   column: "maatwerk_anders_afgehandeld",
            //   colour: "orange",
            //   units: "anders afgehandeld",
            // },
            // {
            //   label: "Percentage binnen termijn",
            //   column: "maatwerk_beschikt_binn_termijn_perc",
            //   colour: "moss",
            //   format: "percentage",
            //   units: "afgehandeld binnen termijn",
            // },
            {
              label: "Toegekend als maatwerk",
              column: "toegekend_als_maatwerk",
              colour: "moss",
              units: "toegekend als maatwerk"
            },
            {
              label: "Toegekend als HEA",
              column: "toegekend_als_herstel_eigen_aannemer",
              colour: "purple",
              units: "toegekend als HEA"
            },
            {
              label: "Toegekend als HAI",
              column: "toegekend_als_herstel_aannemer_instituut",
              colour: "blue",
              units: "toegekend als HAI"
            },
            {
              label: "Afgewezen",
              column: "maatwerk_afgewezen",
              colour: "orange",
              units: "afgewezen",
              excludeFromTable: true

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
        slug: "fs_maatwerk_toegekend_taart",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Toegekend als MW",
              column: "toegekend_als_maatwerk_cumulatief",
              colour: "moss",
              units: "toegekend als MW"
            },
            {
              label: "Toegekend als HEA",
              column: "toegekend_als_herstel_eigen_aannemer_cumulatief",
              colour: "purple",
              units: "toegekend als HEA"
            },
            {
              label: "Toegekend als HAI",
              column: "toegekend_als_herstel_aannemer_instituut_cumulatief",
              colour: "blue",
              units: "toegekend als HAI"
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
              excludeFromTable: true
            },
          ],
        ],
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
              column: "toegekend_als_maatwerk",
              colour: "moss",
              units: "toegekend als MW"
            },
            {
              label: "Toegekend als HAI",
              column: "toegekend_als_herstel_aannemer_instituut",
              colour: "blue",
              units: "toegekend als HAI"
            },
            {
              label: "Toegekend als HEA",
              column: "toegekend_als_herstel_eigen_aannemer",
              colour: "purple",
              units: "toegekend als HEA"
            },
            {
              label: "Afgewezen",
              column: "maatwerk_afgewezen",
              colour: "orange",
              scale: "null",
              format: "",
              excludeFromTable: true
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
      periodization: "weekly",
    },
  },
  // termijn
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
    segment: {
      key: "maatwerk_beschikt_binn_termijn_perc",
      cumulative: false,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_maatwerk_wekelijks", "fysiek_maatwerk_maandelijks"],
  },
  // duur
  {
    slug: "maatwerk_duur",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "fs_maatwerk_duur_numbers_v1",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Mediaan",
              column: "maatwerk_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "gerealiseerd aantal dagen",
            },
            {
              label: "Gemiddelde",
              column: "maatwerk_dlt_gerealiseerd_gemiddeld_dagen",
              colour: "blue",
              units: "gerealiseerd aantal dagen",
            },
            // {
            //   label: "Verwacht",
            //   column: "maatwerk_dlt_verwacht_rolling8_dagen",
            //   colour: "moss",
            //   format: "roundup",
            //   units: "aantal dagen",
            // }
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "maatwerk_dlt_gerealiseerd_mediaan_dagen",
          cumulative: false,
          periodization: "weekly",
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
              label: "Gerealiseerde mediaan aantal dagen tot besluit",
              column: "maatwerk_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "mediaan gerealiseerd aantal dagen",
            },
            {
              label: "Gerealiseerd gemiddeld aantal dagen tot besluit",
              column: "maatwerk_dlt_gerealiseerd_gemiddeld_dagen",
              colour: "blue",
              units: "gemiddeld gerealiseerd aantal dagen",
            }
          ],
        ],
        segment: {
          key: "maatwerk_dlt_gerealiseerd_mediaan_dagen",
          cumulative: false,
          periodization: "monthly",
          label: "dagen",
        },
      },
      // {
      //   slug: "fs_maatwerk_duur_trend2",
      //   ctrlr: "BarTrendDLTV1",
      //   header: "Verwacht aantal dagen tot besluit",
      //   filters: [],
      //   args: [],
      //   parameters: [
      //     [
      //       {
      //         label: "Verwacht aantal dagen tot besluit",
      //         column: "maatwerk_dlt_verwacht_rolling8_dagen",
      //         colour: "moss",
      //         units: "verwacht aantal dagen",
      //       },
      //     ],
      //   ],
      //   segment: {
      //     key: "maatwerk_dlt_verwacht_rolling8_dagen",
      //     cumulative: false,
      //     periodization: "weekly",
      //     label: "dagen",
      //   },
      // },
    ],
    segment: {
      key: "maatwerk_dlt_gerealiseerd_mediaan_dagen",
      cumulative: false,
      periodization: "weekly",
      label: "dagen",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_maatwerk_wekelijks", "fysiek_maatwerk_maandelijks"],
  },
  // voorrraad
  {
    slug: "maatwerk_voorraad",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "maatwerk_voorrraad_getallen",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Voorraad",
              column: "maatwerk_voorraad_cumulatief",
              colour: "blue",
              units: "voorraad",
            },
            {
              label: "Beslistermijn",
              column: "maatwerk_beslistermijn_dagen",
              colour: "moss",
              format: "decimal",
              units: "dagen",
            },
            // {
            //   label: "Mediaan",
            //   column: "maatwerk_oud_voorraad_mediaan_dagen",
            //   colour: "orange",
            //   units: "dagen in voorraad",
            // },
            // {
            //   label: "Gemiddelde",
            //   column: "maatwerk_oud_voorraad_gemiddeld_dagen",
            //   colour: "blue",
            //   units: "dagen in voorraad",
            // },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "maatwerk_beslistermijn_dagen",
          cumulative: false,
          periodization: "weekly",
        },
      },
      {
        slug: "maatwerk_voorraad_groepen",
        ctrlr: "SegmentsV1",
        args: [],
        filters: [],
        parameters: [
          [
            {
              label: "< 182 dagen",
              column: "maatwerk_oud_voorraad_binnen_termijn",
              colour: "orange",
            },
            {
              label: "182 - 364 dagen",
              column: "maatwerk_oud_voorraad_1_2_termijn",
              colour: "moss",
            },
            {
              label: "364 - 728 dagen",
              column: "maatwerk_oud_voorraad_2_4_termijn",
              colour: "blue",
            },
            {
              label: "> 728 dagen",
              column: "maatwerk_oud_voorraad_buiten_4_termijn",
              colour: "purple",
            },
          ],
        ],
        modifiers: [],
        segment: {
          key: "maatwerk_oud_voorraad_binnen_termijn",
          cumulative: false,
          periodization: "weekly",
        },
      },
      //
    ],
    segment: {
      key: "maatwerk_oud_voorraad_binnen_termijn",
      cumulative: false,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_maatwerk_wekelijks", "fysiek_maatwerk_maandelijks"],
  },
  // bezwaren
  {
    slug: "maatwerk_bezwaren",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "fs_maatwerk_bezwaren_numbers_v1",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "incremental",
        parameters: [
          [
            {
              label: "Ingediend",
              column: "maatwerk_bz_ingediend_cumulatief",
              colour: "orange",
              units: "bezwaren",
            },
            {
              label: "In procedure",
              column: "maatwerk_bz_voorraad_cumulatief",
              colour: "purple",
              units: "bezwaren",
            },
            {
              label: "Afgerond",
              column: "maatwerk_bz_afgerond_cumulatief",
              colour: "moss",
              units: "bezwaren",
            },
            {
              label: "Bezwaarpercentage",
              column: "maatwerk_bz_perc_cumulatief",
              colour: "blue",
              format: "percentage",
              units: "t.o.v. aantal besluiten",
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "maatwerk_bz_ingediend",
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
          periodization: "weekly",
        },
      },
    ],
    segment: {
      key: "maatwerk_bz_toegekend_cumulatief",
      cumulative: false,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_maatwerk_wekelijks", "fysiek_maatwerk_maandelijks"],
  },
];

export default group;
