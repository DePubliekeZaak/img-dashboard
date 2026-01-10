import { IGroupMappingV2 } from "../shared/interfaces";

const group: IGroupMappingV2[] = [
  {
    slug: "ims_totaal_intro",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "ims_numbers_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: ["totaalVsRecent"],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Aanvragen",
              column: "ims_totaal_ingediend",
              colour: "orange",
              units: "ingediende aanvragen",
            },
            {
              label: "Voorraad",
              column: "ims_totaal_voorraad",
              colour: "moss",
              units: "aanvragen in werkvoorraad",
            },
            {
              label: "Afgerond",
              column: "ims_totaal_afgerond",
              colour: "blue",
              units: "afgeronde aanvragen",
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
          key: "ims_totaal_ingediend",
          cumulative: true,
          periodization: "weekly",
        },
      },
    ],
    segment: {
      key: "ims_totaal_ingediend",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["ims_totaal_wekelijks", "ims_totaal_maandelijks"],
  },
  {
    slug: "ims_totaal_bedragen",
    ctrlr: "DefaultGroupV1",
    filters: ["totaalVsRecent","weekVsMonth"],
    graphs: [
      {
        slug: "ims_totaal_numbers_2",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            //  {
            //   label: "beschikte schade",
            //   column: "ims_totaal_bedrag_beschikt_schade",
            //   colour: "blue",
            //   format: "currency",
            //   units: "beschikt schadebedrag",
            // },
            // {
            //   label: "beschikt totaal",
            //   column: "ims_totaal_bedrag_beschikt_totaal",
            //   colour: "blue",
            //   format: "currency",
            //   units: "beschikt totaalbedrag",
            // },
            // {
            //   label: "betaalde schade",
            //   column: "ims_totaal_bedrag_betaald_schade",
            //   colour: "moss",
            //   format: "currency",
            //   units: "betaald schadebedrag",
            // },
            {
              label: "betaald totaal",
              column: "ims_totaal_bedrag_betaald_totaal",
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
          key: "ims_totaal_bedrag_betaald_totaal",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "ims_totaal_bedragen_trend",
        ctrlr: "BarTrendBedragenV1",
        args: [],
        filters: [],
        parameters: [
          [
            {
              label: "Totaal betaald bedrag",
              column: "ims_totaal_bedrag_betaald_totaal",
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
          key: "ims_totaal_bedrag_betaald_totaal",
          cumulative: false,
          periodization: "weekly",
        },
      }
    ],
    segment: {
      key: "ims_totaal_bedrag_betaald_totaal",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["ims_totaal_wekelijks", "ims_totaal_maandelijks"],
  },
  {
    slug: "ims_totaal_waardering",
    ctrlr: "KTOGroupV1",
    graphs: [
      {
        slug: "ims_totaal_waardering_numbers",
        ctrlr: "NumbersPlusRespondentsV1",
        args: [],
        parameters: [
          [
            {
              label: "Sinds start",
              column: "ims_totaal_doorlopend",
              colour: "orange",
              format: "decimals",
            },
          ],
          [
            {
              label: "Totaal respondenten",
              column: "ims_totaal_doorlopend_n",
              units: "respondenten sinds start",
              colour: "orange",
            },
          ],
        ],
      },
      {
        slug: "ims_totaal_waardering_trend",
        ctrlr: "BarTrendKTOV1",
        args: [],
        filters: [],
        parameters: [
          [
            {
              label: "Maand cijfer",
              column: "ims_totaal_maand",
              colour: "orange",
              format: "decimals",
            },
          ],
          [
            {
              label: "Aantal nieuwe respondenten",
              column: "ims_totaal_maand_n",
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
      key: "ims_totaal_maand",
      cumulative: false,
      periodization: "monthly",
    },
  },
  {
    slug: "ims_totaal_keuzepaden",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "ims_totaal_numbers_volw",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        header: "Volwassenen",
        // multiples: "cumulative",
        parameters: [
          [
            {
              label: "Ingediend",
              column: "ims_volw_ingediend_cumulatief",
              colour: "blue",
              units: "aanvragen",
            },
            {
              label: "Afgehandeld",
              column: "ims_volw_afgerond_cumulatief",
              colour: "blue",
              units: "afgehandeld",
            },
            {
              label: "Betaald bedrag",
              column: "ims_volw_bedrag_betaald_totaal_cumulatief",
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
          key: "ims_volw_ingediend_cumulatief",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "ims_totaal_numbers_kj",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        header: "Kinderen en jongeren",
        // multiples: "cumulative",
        parameters: [
          [
            {
              label: "Ingediend",
              column: "ims_kj_ingediend_cumulatief",
              colour: "orange",
              units: "aanvragen",
            },
            {
              label: "Afgehandeld",
              column: "ims_kj_afgerond_cumulatief",
              colour: "orange",
              units: "afgehandeld",
            },
            {
              label: "Verleende schade",
              column: "ims_kj_bedrag_betaald_totaal_cumulatief",
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
          key: "ims_kj_ingediend_cumulatief",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "ims_totaal_makeup_trend",
        ctrlr: "BarTrendStackedMakeup",
        args: [],
        filters: ["mappingGroupSelect", "cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "Volwassenen",
              column: "ims_volw_ingediend",
              colour: "blue",
              units: "aanvragen",
              excludeFromTable: true,
            },
            {
              label: "Kinderen en joingeren",
              column: "ims_kj_ingediend",
              colour: "orange",
              units: "aanvragen",
              excludeFromTable: true,
            },
          ],
          [
            {
              label: "Volwassenen",
              column: "ims_volw_afgerond",
              colour: "blue",
              units: "afgehandeld",
              excludeFromTable: true,
            },
            {
              label: "Kinderen en jongeren",
              column: "ims_kj_afgerond",
              colour: "orange",
              units: "afgehandeld",
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
          key: "ims_volw_afgehandeld",
          cumulative: false,
          periodization: "monthly",
          parameterIndex: 0,
        },
      },
    ],
    segment: {
      key: "ims_volw_afgehandeld",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["ims_totaal_wekelijks", "ims_totaal_maandelijks"],
  },
  // {
  //   slug: "ims_totaal_herbeoordeling",
  //   ctrlr: "DefaultGroupV1",
  //   filters: [],
  //   graphs: [
  //     {
  //       slug: "ims_numbers_v1",
  //       ctrlr: "NumbersMultiplesV1",
  //       args: [],
  //       filters: ["totaalVsRecent"],
  //       multiples: "cumulative",
  //       parameters: [
  //         [
  //           // {
  //           //   label: "Aanvragen",
  //           //   column: "ims_totaal_ingediend",
  //           //   colour: "orange",
  //           //   units: "ingediende aanvragen",
  //           // },
  //           // {
  //           //   label: "Voorraad",
  //           //   column: "ims_totaal_voorraad",
  //           //   colour: "moss",
  //           //   units: "aanvragen in werkvoorraad",
  //           // },
  //           // {
  //           //   label: "Afgerond",
  //           //   column: "ims_totaal_afgerond",
  //           //   colour: "blue",
  //           //   units: "afgeronde aanvragen",
  //           // },
  //         ],
  //         [],
  //       ],
  //       modifiers: [
  //         [
  //           {
  //             label: "totaal",
  //             column: "{}_cumulatief",
  //             colour: "orange",
  //           },
  //           {
  //             label: "afgelopen week",
  //             column: "{}",
  //             colour: "orange",
  //           },
  //         ],
  //       ],
  //       segment: {
  //         key: "ims_totaal_ingediend",
  //         cumulative: true,
  //         periodization: "weekly",
  //       },
  //     },
  //   ],
  //   segment: {
  //     key: "ims_totaal_ingediend",
  //     cumulative: true,
  //     periodization: "weekly",
  //   },
  //   functionality: ["table", "definitions", "download"],
  //   endpoints: ["ims_totaal_wekelijks", "ims_totaal_maandelijks"],
  // },
];

export default group;
