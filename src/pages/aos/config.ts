import { IPageMapping } from "../shared/interfaces";

const config: IPageMapping = [
  {
    slug: "aos_voortgang",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "aos_numbers_1",
        ctrlr: "NumbersV1",
        filters: [],
        args: [],
        parameters: [
          [
            {
              label: "Meldingen",
              column: "aos_meldingen_cumulatief",
              units: "meldingen",
              colour: "orange",
            },
            {
              label: "Acuut Onveilige Situatie",
              column: "aos_meldingen_gegrond_cumulatief",
              units: "acuut onveilige situaties",
              colour: "moss",
            },
            {
              label: "Percentage gegronde meldingen",
              column: "aos_percentage_gegrond_cumulatief",
              units: "gegronde meldingen",
              colour: "blue",
              format: "percentage",
            },
          ],
        ],
        segment: {
          key: "aos_meldingen_cumulatief",
          cumulative: true,
          periodization: "weekly",
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["aos_wekelijks","aos_maandelijks"],
    segment: {
      key: "aos_meldingen_cumulatief",
      cumulative: true,
      periodization: "weekly",
    },
  },
  {
    slug: "aos_trend",
    ctrlr: "DefaultGroupV1",
    
    graphs: [
      {
        slug: "aos_trend_1",
        ctrlr: "BarTrendAOSV1",
        filters: ["cumulativeVsDelta"], //  "weekVsMonth"
        args: [],
        parameters: [
          [
            {
              label: "meldingen",
              column: "aos_meldingen",
              colour: "blue",
            },
            {
              label: "Acuut Onveilige Situatie",
              column: "aos_meldingen_gegrond",
              colour: "orange",
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
          key: "aos_meldingen",
          cumulative: false,
          periodization: "weekly",
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["aos_wekelijks"],
    segment: {
      key: "aos_meldingen",
      cumulative: false,
      periodization: "weekly",
    },
  },
];

export default config;
