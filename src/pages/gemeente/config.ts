import type { IPageConfig } from "../shared/interfaces";

const group: IPageConfig = {
  slug: "gemeente",
  segment: {
    key: "",
    gemeente: "Aa en Hunze",
    periodization: "weekly",
    cumulative: false,
  },
  filters: ["gemeenten"],
  endpoints: [
    "gemeenten?aggregatie=eq.maand&domein_code=eq.FYSIEK&regeling_code=eq.MW",
    "gemeenten?aggregatie=eq.week&domein_code=eq.FYSIEK&regeling_code=eq.MW&order=periode.desc",
  ],
  groups: [
    {
      slug: "gemeenten_maatwerk",
      ctrlr: "MuniGroupV1",
      filters: [],
      graphs: [
        {
          slug: "gemeente_numbers_v1",
          ctrlr: "NumbersMultiplesV1",
          args: [],
          filters: ["totaalVsRecent"],
          multiples: "cumulative",
          parameters: [
            [
              {
                label: "Meldingen",
                column: "ingediend",
                colour: "orange",
                units: "meldingen",
              },
              {
                label: "Afgehandeld",
                column: "afgerond",
                colour: "moss",
                units: "afgehandeld",
              },
            ],
            [],
          ],
          modifiers: [
            [
              {
                label: "maatwerk",
                column: "{}_cumul",
                colour: "orange",
              },
              {
                label: "afgelopen week",
                column: "{}_aantal",
                colour: "orange",
              },
            ],
          ],
          segment: {
            key: "ingediend",
            cumulative: true,
            periodization: "latest",
          },
        },
        {
          slug: "gemeente_trend",
          ctrlr: "BarTrendV1R",
          args: [],
          filters: ["parameterSelect", "cumulativeVsDelta"],
          parameters: [
            [
              {
                label: "Meldingen",
                column: "ingediend",
                colour: "orange",
                units: "meldingen",
              },
              {
                label: "Afgehandeld",
                column: "afgerond",
                colour: "moss",
                units: "afgehandeld",
              },
            ],
          ],
          modifiers: [
            [
              {
                label: "toename",
                column: "{}_aantal",
                colour: "orange",
              },
              {
                label: "cumulatief",
                column: "{}_cumul",
                colour: "orange",
              },
            ],
          ],
          segment: {
            key: "ingediend",
            cumulative: false,
            periodization: "monthly",
          },
        },
        {
          slug: "gemeente_toegekend_taart",
          ctrlr: "PieChartSumV1",
          args: [],
          parameters: [
            [
              {
                label: "Toegekend",
                column: "toegekend_cumul",
                colour: "moss",
                scale: "null",
                format: "",
              },
              {
                label: "Afgewezen",
                column: "afgewezen_cumul",
                colour: "orange",
                scale: "null",
                format: "",
              },
            ],
            [
              {
                label: "Afgehandeld",
                column: "afgerond_cumul",
                colour: "gray",
                scale: "null",
                format: "",
              },
            ],
          ],
        },
      ],
      segment: {
        key: "ingediend",
        cumulative: true,
        periodization: "monthly",
        gemeente: "Groningen",
      },
      functionality: ["table", "definitions", "download"],
      endpoints: [
        "gemeenten?aggregatie=eq.maand&domein_code=eq.FYSIEK&regeling_code=eq.MW",
        "gemeenten?aggregatie=eq.week&domein_code=eq.FYSIEK&regeling_code=eq.MW&order=periode.desc",
      ],
    },
    // {
    //   slug: "gemeenten_vv",
    //   ctrlr: "MuniGroupV1",
    //   filters: ["gemeente"],
    //   graphs: [
    //     {
    //       slug: "gemeente_numbers_vv_v1",
    //       ctrlr: "NumbersMultiplesV1",
    //       args: [],
    //       filters: ["totaalVsRecent"],
    //       multiples: "cumulative",
    //       parameters: [
    //         [
    //           {
    //             label: "Meldingen",
    //             column: "ingediend",
    //             colour: "orange",
    //             units: "zaken",
    //           },
    //           {
    //             label: "Afgehandeld",
    //             column: "afgerond",
    //             colour: "moss",
    //             units: "besluiten",
    //           },
    //         ],
    //         [],
    //       ],
    //       modifiers: [
    //         [
    //           {
    //             label: "vaste vergoeding",
    //             column: "{}_cumul",
    //             colour: "orange",
    //           },
    //           {
    //             label: "afgelopen week",
    //             column: "{}_aantal",
    //             colour: "orange",
    //           },
    //         ],
    //       ],
    //       segment: {
    //         key: "ingediend",
    //         cumulative: true,
    //         periodization: "latest",
    //       },
    //     },
    //     {
    //       slug: "gemeente_trend_vv",
    //       ctrlr: "BarTrendV1",
    //       args: [],
    //       filters: ["parameterSelect", "cumulativeVsDelta"],
    //       parameters: [
    //         [
    //           {
    //             label: "Meldingen",
    //             column: "ingediend",
    //             colour: "orange",
    //             units: "meldingen",
    //           },
    //           {
    //             label: "Afgehandeld",
    //             column: "afgerond",
    //             colour: "moss",
    //             units: "besluiten",
    //           },
    //         ],
    //       ],
    //       modifiers: [
    //         [
    //           {
    //             label: "toename",
    //             column: "{}_aantal",
    //             colour: "orange",
    //           },
    //           {
    //             label: "cumulatief",
    //             column: "{}_cumul",
    //             colour: "orange",
    //           },
    //         ],
    //       ],
    //       segment: {
    //         key: "ingediend",
    //         cumulative: false,
    //         periodization: "monthly",
    //       },
    //     },
    //     {
    //       slug: "gemeente_toegekend_taart_vv",
    //       ctrlr: "PieChartSumV1",
    //       args: [],
    //       parameters: [
    //         [
    //           {
    //             label: "Toegekend",
    //             column: "toegekend_cumul",
    //             colour: "moss",
    //             scale: "null",
    //             format: "",
    //           },
    //           {
    //             label: "Afgewezen",
    //             column: "afgewezen_cumul",
    //             colour: "orange",
    //             scale: "null",
    //             format: "",
    //           },
    //         ],
    //         [
    //           {
    //             label: "Afgehandeld",
    //             column: "afgerond_cumul",
    //             colour: "gray",
    //             scale: "null",
    //             format: "",
    //           },
    //         ],
    //       ],
    //     },
    //   ],
    //   segment: {
    //     key: "ingediend",
    //     cumulative: true,
    //     periodization: "monthly",
    //     gemeente: "Groningen",
    //   },
    //   functionality: ["table", "definitions", "download"],
    //   endpoints: [
    //     "gemeenten?aggregatie=eq.maand&domein_code=eq.FYSIEK&regeling_code=eq.VV",
    //     "gemeenten?aggregatie=eq.week&domein_code=eq.FYSIEK&regeling_code=eq.VV&order=periode.desc",
    //   ],
    // },
    // {
    //   slug: "gemeenten_ims",
    //   ctrlr: "MuniGroupV1",
    //   filters: ["gemeente"],
    //   graphs: [
    //     {
    //       slug: "gemeente_numbers_v1_ims",
    //       ctrlr: "NumbersMultiplesV1",
    //       args: [],
    //       filters: ["totaalVsRecent"],
    //       multiples: "cumulative",
    //       parameters: [
    //         [
    //           {
    //             label: "Meldingen",
    //             column: "ingediend",
    //             colour: "orange",
    //             units: "zaken",
    //           },
    //           {
    //             label: "Afgehandeld",
    //             column: "afgerond",
    //             colour: "moss",
    //             units: "besluiten",
    //           },
    //         ],
    //         [],
    //       ],
    //       modifiers: [
    //         [
    //           {
    //             label: "immaterieel",
    //             column: "{}_cumul",
    //             colour: "orange",
    //           },
    //           {
    //             label: "afgelopen week",
    //             column: "{}_aantal",
    //             colour: "orange",
    //           },
    //         ],
    //       ],
    //       segment: {
    //         key: "ingediend",
    //         cumulative: true,
    //         periodization: "latest",
    //       },
    //     },
    //     {
    //       slug: "gemeente_trend_ims",
    //       ctrlr: "BarTrendV1",
    //       args: [],
    //       filters: ["parameterSelect", "cumulativeVsDelta"],
    //       parameters: [
    //         [
    //           {
    //             label: "Meldingen",
    //             column: "ingediend",
    //             colour: "orange",
    //             units: "meldingen",
    //           },
    //           {
    //             label: "Afgehandeld",
    //             column: "afgerond",
    //             colour: "moss",
    //             units: "besluiten",
    //           },
    //         ],
    //       ],
    //       modifiers: [
    //         [
    //           {
    //             label: "toename",
    //             column: "{}_aantal",
    //             colour: "orange",
    //           },
    //           {
    //             label: "cumulatief",
    //             column: "{}_cumul",
    //             colour: "orange",
    //           },
    //         ],
    //       ],
    //       segment: {
    //         key: "ingediend",
    //         cumulative: false,
    //         periodization: "monthly",
    //       },
    //     },
    //     {
    //       slug: "gemeente_toegekend_taart_ims",
    //       ctrlr: "PieChartSumV1",
    //       args: [],
    //       parameters: [
    //         [
    //           {
    //             label: "Toegekend",
    //             column: "toegekend_cumul",
    //             colour: "moss",
    //             scale: "null",
    //             format: "",
    //           },
    //           {
    //             label: "Afgewezen",
    //             column: "afgewezen_cumul",
    //             colour: "orange",
    //             scale: "null",
    //             format: "",
    //           },
    //         ],
    //         [
    //           {
    //             label: "Afgehandeld",
    //             column: "afgerond_cumul",
    //             colour: "gray",
    //             scale: "null",
    //             format: "",
    //           },
    //         ],
    //       ],
    //     },
    //   ],
    //   segment: {
    //     key: "ingediend",
    //     cumulative: true,
    //     periodization: "monthly",
    //     gemeente: "Groningen",
    //   },
    //   functionality: ["table", "definitions", "download"],
    //   endpoints: [
    //     "gemeenten?aggregatie=eq.maand&domein_code=eq.IMS&regeling_code=eq.IMS",
    //     "gemeenten?aggregatie=eq.week&domein_code=eq.IMS&regeling_code=eq.IMS&order=periode.desc",
    //   ],
    // },
    // {
    //   slug: "gemeenten_imk",
    //   ctrlr: "MuniGroupV1",
    //   filters: ["gemeente"],
    //   graphs: [
    //     {
    //       slug: "gemeente_numbers_v1_imk",
    //       ctrlr: "NumbersMultiplesV1",
    //       args: [],
    //       filters: ["totaalVsRecent"],
    //       multiples: "cumulative",
    //       parameters: [
    //         [
    //           {
    //             label: "Meldingen",
    //             column: "ingediend",
    //             colour: "orange",
    //             units: "zaken",
    //           },
    //           {
    //             label: "Afgehandeld",
    //             column: "afgerond",
    //             colour: "moss",
    //             units: "besluiten",
    //           },
    //         ],
    //         [],
    //       ],
    //       modifiers: [
    //         [
    //           {
    //             label: "kindregeling",
    //             column: "{}_cumul",
    //             colour: "orange",
    //           },
    //           {
    //             label: "afgelopen week",
    //             column: "{}_aantal",
    //             colour: "orange",
    //           },
    //         ],
    //       ],
    //       segment: {
    //         key: "ingediend",
    //         cumulative: true,
    //         periodization: "latest",
    //       },
    //     },
    //     {
    //       slug: "gemeente_trend_imk",
    //       ctrlr: "BarTrendV1",
    //       args: [],
    //       filters: ["parameterSelect", "cumulativeVsDelta"],
    //       parameters: [
    //         [
    //           {
    //             label: "Meldingen",
    //             column: "ingediend",
    //             colour: "orange",
    //             units: "meldingen",
    //           },
    //           {
    //             label: "Afgehandeld",
    //             column: "afgerond",
    //             colour: "moss",
    //             units: "besluiten",
    //           },
    //         ],
    //       ],
    //       modifiers: [
    //         [
    //           {
    //             label: "toename",
    //             column: "{}_aantal",
    //             colour: "orange",
    //           },
    //           {
    //             label: "cumulatief",
    //             column: "{}_cumul",
    //             colour: "orange",
    //           },
    //         ],
    //       ],
    //       segment: {
    //         key: "ingediend",
    //         cumulative: false,
    //         periodization: "monthly",
    //       },
    //     },
    //     {
    //       slug: "gemeente_toegekend_taart_imk",
    //       ctrlr: "PieChartSumV1",
    //       args: [],
    //       parameters: [
    //         [
    //           {
    //             label: "Toegekend",
    //             column: "toegekend_cumul",
    //             colour: "moss",
    //             scale: "null",
    //             format: "",
    //           },
    //           {
    //             label: "Afgewezen",
    //             column: "afgewezen_cumul",
    //             colour: "orange",
    //             scale: "null",
    //             format: "",
    //           },
    //         ],
    //         [
    //           {
    //             label: "Afgehandeld",
    //             column: "afgerond_cumul",
    //             colour: "gray",
    //             scale: "null",
    //             format: "",
    //           },
    //         ],
    //       ],
    //     },
    //   ],
    //   segment: {
    //     key: "ingediend",
    //     cumulative: true,
    //     periodization: "monthly",
    //     gemeente: "Groningen",
    //   },
    //   functionality: ["table", "definitions", "download"],
    //   endpoints: [
    //     "gemeenten?aggregatie=eq.maand&domein_code=eq.IMS&regeling_code=eq.IMK",
    //     "gemeenten?aggregatie=eq.week&domein_code=eq.IMS&regeling_code=eq.IMK&order=periode.desc",
    //   ],
    // },
    // {
    //   slug: "gemeenten_wd",
    //   ctrlr: "MuniGroupV1",
    //   filters: ["gemeente"],
    //   graphs: [
    //     {
    //       slug: "gemeente_numbers_v1_wd",
    //       ctrlr: "NumbersMultiplesV1",
    //       args: [],
    //       filters: ["totaalVsRecent"],
    //       multiples: "cumulative",
    //       parameters: [
    //         [
    //           {
    //             label: "Meldingen",
    //             column: "ingediend",
    //             colour: "orange",
    //             units: "zaken",
    //           },
    //           {
    //             label: "Afgehandeld",
    //             column: "afgerond",
    //             colour: "moss",
    //             units: "besluiten",
    //           },
    //         ],
    //         [],
    //       ],
    //       modifiers: [
    //         [
    //           {
    //             label: "waardedaling",
    //             column: "{}_cumul",
    //             colour: "orange",
    //           },
    //           {
    //             label: "afgelopen week",
    //             column: "{}_aantal",
    //             colour: "orange",
    //           },
    //         ],
    //       ],
    //       segment: {
    //         key: "ingediend",
    //         cumulative: true,
    //         periodization: "latest",
    //       },
    //     },
    //     {
    //       slug: "gemeente_trend_wd",
    //       ctrlr: "BarTrendV1",
    //       args: [],
    //       filters: ["parameterSelect", "cumulativeVsDelta"],
    //       parameters: [
    //         [
    //           {
    //             label: "Meldingen",
    //             column: "ingediend",
    //             colour: "orange",
    //             units: "meldingen",
    //           },
    //           {
    //             label: "Afgehandeld",
    //             column: "afgerond",
    //             colour: "moss",
    //             units: "besluiten",
    //           },
    //         ],
    //       ],
    //       modifiers: [
    //         [
    //           {
    //             label: "toename",
    //             column: "{}_aantal",
    //             colour: "orange",
    //           },
    //           {
    //             label: "cumulatief",
    //             column: "{}_cumul",
    //             colour: "orange",
    //           },
    //         ],
    //       ],
    //       segment: {
    //         key: "ingediend",
    //         cumulative: false,
    //         periodization: "monthly",
    //       },
    //     },
    //     {
    //       slug: "gemeente_toegekend_taart_wd",
    //       ctrlr: "PieChartSumV1",
    //       args: [],
    //       parameters: [
    //         [
    //           {
    //             label: "Toegekend",
    //             column: "toegekend_cumul",
    //             colour: "moss",
    //             scale: "null",
    //             format: "",
    //           },
    //           {
    //             label: "Afgewezen",
    //             column: "afgewezen_cumul",
    //             colour: "orange",
    //             scale: "null",
    //             format: "",
    //           },
    //         ],
    //         [
    //           {
    //             label: "Afgehandeld",
    //             column: "afgerond_cumul",
    //             colour: "gray",
    //             scale: "null",
    //             format: "",
    //           },
    //         ],
    //       ],
    //     },
    //   ],
    //   segment: {
    //     key: "ingediend",
    //     cumulative: true,
    //     periodization: "monthly",
    //     gemeente: "Groningen",
    //   },
    //   functionality: ["table", "definitions", "download"],
    //   endpoints: [
    //     "gemeenten?aggregatie=eq.maand&domein_code=eq.WDL&regeling_code=eq.WD",
    //     "gemeenten?aggregatie=eq.week&domein_code=eq.WDL&regeling_code=eq.WD&order=periode.desc",
    //   ],
    // },
    // {
    //   slug: "gemeenten_wnw",
    //   ctrlr: "MuniGroupV1",
    //   filters: ["gemeente"],
    //   graphs: [
    //     {
    //       slug: "gemeente_numbers_v1_wnw",
    //       ctrlr: "NumbersMultiplesV1",
    //       args: [],
    //       filters: ["totaalVsRecent"],
    //       multiples: "cumulative",
    //       parameters: [
    //         [
    //           {
    //             label: "Meldingen",
    //             column: "ingediend",
    //             colour: "orange",
    //             units: "zaken",
    //           },
    //           {
    //             label: "Afgehandeld",
    //             column: "afgerond",
    //             colour: "moss",
    //             units: "besluiten",
    //           },
    //         ],
    //         [],
    //       ],
    //       modifiers: [
    //         [
    //           {
    //             label: "niet-woningen",
    //             column: "{}_cumul",
    //             colour: "orange",
    //           },
    //           {
    //             label: "afgelopen week",
    //             column: "{}_aantal",
    //             colour: "orange",
    //           },
    //         ],
    //       ],
    //       segment: {
    //         key: "ingediend",
    //         cumulative: true,
    //         periodization: "latest",
    //       },
    //     },
    //     {
    //       slug: "gemeente_trend_wnw",
    //       ctrlr: "BarTrendV1",
    //       args: [],
    //       filters: ["parameterSelect", "cumulativeVsDelta"],
    //       parameters: [
    //         [
    //           {
    //             label: "Meldingen",
    //             column: "ingediend",
    //             colour: "orange",
    //             units: "meldingen",
    //           },
    //           {
    //             label: "Afgehandeld",
    //             column: "afgerond",
    //             colour: "moss",
    //             units: "besluiten",
    //           },
    //         ],
    //       ],
    //       modifiers: [
    //         [
    //           {
    //             label: "toename",
    //             column: "{}_aantal",
    //             colour: "orange",
    //           },
    //           {
    //             label: "cumulatief",
    //             column: "{}_cumul",
    //             colour: "orange",
    //           },
    //         ],
    //       ],
    //       segment: {
    //         key: "ingediend",
    //         cumulative: false,
    //         periodization: "monthly",
    //       },
    //     },
    //     {
    //       slug: "gemeente_toegekend_taart_wnw",
    //       ctrlr: "PieChartSumV1",
    //       args: [],
    //       parameters: [
    //         [
    //           {
    //             label: "Toegekend",
    //             column: "toegekend_cumul",
    //             colour: "moss",
    //             scale: "null",
    //             format: "",
    //           },
    //           {
    //             label: "Afgewezen",
    //             column: "afgewezen_cumul",
    //             colour: "orange",
    //             scale: "null",
    //             format: "",
    //           },
    //         ],
    //         [
    //           {
    //             label: "Afgehandeld",
    //             column: "afgerond_cumul",
    //             colour: "gray",
    //             scale: "null",
    //             format: "",
    //           },
    //         ],
    //       ],
    //     },
    //   ],
    //   segment: {
    //     key: "ingediend",
    //     cumulative: true,
    //     periodization: "monthly",
    //     gemeente: "Groningen",
    //   },
    //   functionality: ["table", "definitions", "download"],
    //   endpoints: [
    //     "gemeenten?aggregatie=eq.maand&domein_code=eq.WDL&regeling_code=eq.WNW",
    //     "gemeenten?aggregatie=eq.week&domein_code=eq.WDL&regeling_code=eq.WNW&order=periode.desc",
    //   ],
    // },
  ],
};

export default group;
