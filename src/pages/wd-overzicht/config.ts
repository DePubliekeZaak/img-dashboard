import type { IGroupMappingV2 } from "../../shared/interfaces";

const group: IGroupMappingV2[] = [
  // intro
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
              colour: "purple",
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
              label: "Voorraad",
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
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["wdl_wd_wekelijks", "wdl_wd_maandelijks"],
  },
  // bedragen
  {
    slug: "wdl_wd_bedragen",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "fs_wdl_wd_numbers_2",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            // {
            //   label: "beschikte schade",
            //   column: "wdl_wd_bedrag_beschikt_schade",
            //   colour: "blue",
            //   format: "currency",
            //   units: "beschikt schadebedrag",
            // },
            // {
            //   label: "beschikt totaal",
            //   column: "wdl_wd_bedrag_beschikt_totaal",
            //   colour: "blue",
            //   format: "currency",
            //   units: "beschikt totaalbedrag",
            // },
            // {
            //   label: "betaalde schade",
            //   column: "wdl_wd_bedrag_betaald_schade",
            //   colour: "moss",
            //   format: "currency",
            //   units: "betaald schadebedrag",
            // },
            {
              label: "betaald totaal",
              column: "wdl_wd_bedrag_betaald_totaal",
              colour: "blue",
              format: "currency",
              units: "betaald totaalbedrag",
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
          key: "wdl_wd_bedrag_betaald_totaal",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "wdl_wd_bedragen_trend",
        ctrlr: "BarTrendBedragenV1",
        args: [],
        filters: ["cumulativeVsDelta", "weekVsMonth"],
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
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["wdl_wd_wekelijks", "wdl_wd_maandelijks"],
  },
  // waardering
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
  // varianten
  {
    slug: "wd_totaal_varianten",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "wd_numbers_woningen",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        header: "Woningen",
        // multiples: "cumulative",
        parameters: [
          [
            {
              label: "Ingediend",
              column: "wdl_wo_ingediend_cumulatief",
              colour: "blue",
              units: "aanvragen",
            },
            {
              label: "Afgehandeld",
              column: "wdl_wo_afgerond_cumulatief",
              colour: "blue",
              units: "afgehandeld",
            },
            {
              label: "Betaald bedrag",
              column: "wdl_wo_bedrag_betaald_totaal_cumulatief",
              colour: "blue",
              units: "betaald bedrag",
              format: "currency",
            },
          ],
          [],
        ],
        modifiers: [
          // [
          //   {
          //     label: "totaal",
          //     column: "{}_cumulatief",
          //     colour: "orange",
          //   },
          //   {
          //     label: "afgelopen week",
          //     column: "{}",
          //     colour: "orange",
          //   },
          // ],
        ],
        segment: {
          key: "wdl_wo_ingediend_cumulatief",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "wd_numbers_niet_woningen",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        header: "Niet woningen",
        parameters: [
          [
            {
              label: "Ingediend",
              column: "wdl_nwo_ingediend_cumulatief",
              colour: "orange",
              units: "aanvragen",
            },
            {
              label: "Afgehandeld",
              column: "wdl_nwo_afgerond_cumulatief",
              colour: "orange",
              units: "afgehandeld",
            },
            {
              label: "Verleende schade",
              column: "wdl_nwo_bedrag_betaald_totaal_cumulatief",
              colour: "orange",
              units: "betaald bedrag",
              format: "currency",
            },
          ],
          [],
        ],
        modifiers: [
          // [
          //   {
          //     label: "totaal",
          //     column: "{}_cumulatief",
          //     colour: "orange",
          //   },
          //   {
          //     label: "afgelopen week",
          //     column: "{}",
          //     colour: "orange",
          //   },
          // ],
        ],
        segment: {
          key: "wdl_nwo_ingediend_cumulatief",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "wd_numbers_namteg",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        header: "NAM tegemoetkoming",
        parameters: [
          [
            {
              label: "Ingediend",
              column: "wdl_nam_ingediend_cumulatief",
              colour: "moss",
              units: "aanvragen",
            },
            {
              label: "Afgehandeld",
              column: "wdl_nam_afgerond_cumulatief",
              colour: "moss",
              units: "afgehandeld",
            },
            {
              label: "Verleende schade",
              column: "wdl_nam_bedrag_betaald_totaal_cumulatief",
              colour: "moss",
              units: "betaald bedrag",
              format: "currency",
            },
          ],
          [],
        ],
        modifiers: [
          // [
          //   {
          //     label: "totaal",
          //     column: "{}_cumulatief",
          //     colour: "orange",
          //   },
          //   {
          //     label: "afgelopen week",
          //     column: "{}",
          //     colour: "orange",
          //   },
          // ],
        ],
        segment: {
          key: "wdl_nam_ingediend_cumulatief",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "wdl_totaal_makeup_trend",
        ctrlr: "BarTrendStackedMakeup",
        args: [],
        filters: ["mappingGroupSelect", "cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "Woningen",
              column: "wdl_wo_ingediend",
              colour: "blue",
              units: "aanvragen",
              excludeFromTable: true,
            },
            {
              label: "Niet woningen",
              column: "wdl_nwo_ingediend",
              colour: "orange",
              units: "aanvragen",
              excludeFromTable: true,
            },
            {
              label: "NAM tegemoetkoming",
              column: "wdl_nam_ingediend",
              colour: "moss",
              units: "aanvragen",
              excludeFromTable: true,
            },
          ],
          [
            {
              label: "Woningen",
              column: "wdl_wo_afgerond",
              colour: "blue",
              units: "afgehandeld",
              excludeFromTable: true,
            },
            {
              label: "Niet woningen",
              column: "wdl_nwo_afgerond",
              colour: "orange",
              units: "afgehandeld",
              excludeFromTable: true,
            },
            {
              label: "NAM tegemoetkoming",
              column: "wdl_nam_afgerond",
              colour: "moss",
              units: "afgehendeld",
              excludeFromTable: true,
            },
          ],
          // [
          //   {
          //     label: "Volwassenen",
          //     column: "ims_volw_bedrag_totaal_bedrag",
          //     colour: "blue",
          //     units: "betaald bedrag",
          //     format: "currency",
          //     excludeFromTable: true,
          //   },
          //   {
          //     label: "Kinderen en jongeren",
          //     column: "ims_kj_bedrag_totaal_bedrag",
          //     colour: "orange",
          //     units: "betaald bedrag",
          //     format: "currency",
          //     excludeFromTable: true,
          //   },
          // ],
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
          key: "wdl_nwo_afgehandeld",
          cumulative: false,
          periodization: "monthly",
          parameterIndex: 0,
        },
      },
    ],
    segment: {
      key: "wdl_nwo_afgehandeld",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["wdl_wd_wekelijks", "wdl_wd_maandelijks"],
  },
];

export default group;
