import type { IPageConfig } from "../../shared/interfaces";

const pageConfig: IPageConfig = {
  slug: "aos",
  segment: {
    key: "",
    gemeente: "all",
    periodization: "weekly",
    cumulative: false,
    vanaf: "2022-01-01"
  },
  filters: ["vanaf"],
  endpoints: [
    // "regelingen?aggregatie=eq.maand&domein_code=eq.Totaal&regeling_code=eq.Totaal&order=periode.desc",
    "regelingen?aggregatie=eq.week&domein_code=eq.Totaal&regeling_code=eq.Totaal&order=periode.desc&periode_vanaf=gte.{VANAF}&order=periode.desc",
  ],
  groups: [
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
                column: "aos_ingediend_cumul",
                units: "meldingen",
                colour: "orange",
              },
              {
                label: "Acuut Onveilige Situatie",
                column: "aos_gegrond_cumul",
                units: "acuut onveilige situaties",
                colour: "moss",
              },
              {
                label: "Percentage gegronde meldingen",
                column: "aos_gegrond_perc",
                format: "percentage",
                units: "gegronde meldingen",
                colour: "blue",
              },
            ],
          ],
          segment: {
            key: "aos_ingediend_cumul",
            cumulative: true,
            periodization: "weekly",
          },
        },
      ],
      functionality: ["table", "definitions", "download"],
      endpoints: [],
      segment: {
        key: "aos_ingediend_cumul",
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
          filters: ["cumulativeVsDelta"],
          args: [],
          parameters: [
            [
              {
                label: "meldingen",
                column: "aos_ingediend",
                colour: "blue",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Acuut Onveilige Situatie",
                column: "aos_gegrond",
                colour: "orange",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
            ],
          ],
          segment: {
            key: "aos_ingediend",
            cumulative: false,
            periodization: "weekly",
          },
        },
      ],
      functionality: ["table", "definitions", "download"],
      endpoints: [],
      segment: {
        key: "aos_ingediend",
        cumulative: true,
        periodization: "weekly",
      },
    },
  ],
};

export default pageConfig;