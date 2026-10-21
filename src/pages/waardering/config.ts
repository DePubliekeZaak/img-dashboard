import type { IPageConfig } from "../../shared/interfaces";

const pageConfig: IPageConfig = {
  slug: "waardering_totaal",
  segment: {
    key: "",
    gemeente: "all",
    periodization: "monthly",
    cumulative: false,
    vanaf: "2025-01-01",
  },
  default_filters: ["vanaf"],
  filters: [],
  endpoints: [],
  groups: [
    // all
    {
      slug: "all_waardering",
      ctrlr: "KTOGroupV1",
      graphs: [
        {
          slug: "a_waardering_numbers",
          ctrlr: "NumbersPlusRespondentsV1",
          args: [],
          parameters: [
            [
              {
                label: "Sinds start",
                column: "kto_score_gemiddeld_cumul",
                colour: "orange",
                format: "decimals",
              },
            ],
            [
              {
                label: "Totaal respondenten",
                column: "kto_score_totaal_cumul",
                units: "respondenten sinds start",
                colour: "orange",
              },
            ],
          ],
          segment: {
            key: "kto_score_gemiddeld_cumul",
            cumulative: false,
            periodization: "weekly",
          },
        },
        {
          slug: "a_waardering_trend",
          ctrlr: "BarTrendKTOV1",
          args: [],
          filters: [],
          parameters: [
            [
              {
                label: "Maand cijfer",
                column: "kto_score_gemiddeld",
                colour: "orange",
                format: "decimals",
              },
            ],
            [
              {
                label: "Aantal nieuwe respondenten",
                column: "kto_score_totaal",
                colour: "orange",
                units: "respondenten",
              },
            ],
          ],
          segment: {
            key: "kto_score_gemiddeld",
            cumulative: false,
            periodization: "monthly",
          },
        },
      ],
      segment: {
        key: "kto_score_gemiddeld_cumul",
        cumulative: false,
        periodization: "monthly",
      },
      functionality: ["table", "definitions", "download"],
      endpoints: [
        "regelingen?aggregatie=eq.week&domein_code=eq.Totaal&regeling_code=eq.Totaal&order=periode.desc",
        "regelingen?aggregatie=eq.maand&domein_code=eq.Totaal&regeling_code=eq.Totaal&order=periode.desc",
      ],
    },
    {
      slug: "respondenten_trend",
      ctrlr: "RegelingComparisonGroupV1",
      graphs: [
        {
          slug: "fs_trend_respondents",
          ctrlr: "BarTrendStackedMakeup",
          filters: [],
          args: [],
          parameters: [
            [
              { label: "Fysieke schade", column: "mw_kto_score_totaal", units: "respondenten", colour: "blue", excludeFromTable: true  },
              { label: "Vaste vergoeding", column: "vv_kto_score_totaal", units: "respondenten", colour: "orange", excludeFromTable: true  },
              { label: "Waardedaling", column: "wd_kto_score_totaal", units: "respondenten", colour: "purple", excludeFromTable: true  },
              { label: "Immateriele schade: volwassenen", column: "ims_kto_score_totaal", units: "respondenten", colour: "moss", excludeFromTable: true  },
              { label: "Immateriele schade: kinderen en jongeren", column: "imk_kto_score_totaal", units: "respondenten", colour: "lightBlue", excludeFromTable: true  },
            ],
          ],
          segment: { key: "mw_kto_score_totaal", cumulative: false, periodization: "monthly" },
        },
      ],
      segment: { key: "mw_kto_score_totaal", cumulative: false, periodization: "monthly" },
      functionality: ["table", "definitions", "download"],
      endpoints: [
        "regelingen?aggregatie=eq.maand&regeling_code=eq.MW&order=periode.desc",
        "regelingen?aggregatie=eq.maand&regeling_code=eq.VV&order=periode.desc",
        "regelingen?aggregatie=eq.maand&regeling_code=eq.IMK&order=periode.desc",
        "regelingen?aggregatie=eq.maand&regeling_code=eq.IMS&order=periode.desc",
        "regelingen?aggregatie=eq.maand&regeling_code=eq.WD&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.MW&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.VV&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.IMK&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.IMS&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.WD&order=periode.desc",
      ],
    },
     {
      slug: "waardering_regelingen",
      ctrlr: "DomainComparisonGroupV1",
      filters: [],
      graphs: [
        {
          slug: "tevredenheid_numbers_v1",
          ctrlr: "NumbersPlusRespondentsV1",
          args: [],
          filters: [],
          parameters: [
            [
              { label: "Fysieke schade", column: "fysiek_kto_score_gemiddeld_cumul", colour: "moss", format: "" },
              { label: "Immateriele schade", column: "ims_kto_score_gemiddeld_cumul", colour: "blue", format: "" },
              { label: "Waardedaling", column: "wdl_kto_score_gemiddeld_cumul", colour: "purple", format: "" },
            ],
            [
              { label: "Fysieke schade", column: "fysiek_kto_score_totaal_cumul", colour: "moss", units: "respondenten" },
              { label: "Immateriele schade", column: "ims_kto_score_totaal_cumul", colour: "blue", units: "respondenten" },
              { label: "Waardedaling", column: "wdl_kto_score_totaal_cumul", colour: "purple", units: "respondenten" },
            ],
          ],
          modifiers: [],
          segment: { key: "fysiek_kto_score_gemiddeld_cumul", cumulative: true, periodization: "monthly" },
        },

        {
          slug: "fs_cijfer_domein",
          ctrlr: "KTORatingsV1",
          filters: ["domeinSelect", "monthSelect"],
          args: ["fysiek_kto_score_totaal_cumul", "fysiek_kto_score_totaal"],
          parameters: [
            [
              { label: "Doorlopend", column: "fysiek_kto_score_gemiddeld_cumul", colour: "orange" },
              { label: "Maandcijfer", column: "fysiek_kto_score_gemiddeld", colour: "orange" },
              { label: "Respondenten doorlopend", column: "fysiek_kto_score_totaal_cumul", colour: "orange", excludeFromTable: true },
              { label: "Respondenten", column: "fysiek_kto_score_totaal", colour: "orange" },
            ],
            [
              { label: "1", column: "fysiek_kto_score_1_aantal_cumul", colour: "orange", excludeFromTable: true },
              { label: "2", column: "fysiek_kto_score_2_aantal_cumul", colour: "orange", excludeFromTable: true },
              { label: "3", column: "fysiek_kto_score_3_aantal_cumul", colour: "orange", excludeFromTable: true },
              { label: "4", column: "fysiek_kto_score_4_aantal_cumul", colour: "orange", excludeFromTable: true },
              { label: "5", column: "fysiek_kto_score_5_aantal_cumul", colour: "orange", excludeFromTable: true },
              { label: "6", column: "fysiek_kto_score_6_aantal_cumul", colour: "blue", excludeFromTable: true },
              { label: "7", column: "fysiek_kto_score_7_aantal_cumul", colour: "blue", excludeFromTable: true },
              { label: "8", column: "fysiek_kto_score_8_aantal_cumul", colour: "moss", excludeFromTable: true },
              { label: "9", column: "fysiek_kto_score_9_aantal_cumul", colour: "moss", excludeFromTable: true },
              { label: "10", column: "fysiek_kto_score_10_aantal_cumul", colour: "moss", excludeFromTable: true },
            ],
            [
              { label: "1", column: "fysiek_kto_score_1_aantal", colour: "orange" },
              { label: "2", column: "fysiek_kto_score_2_aantal", colour: "orange" },
              { label: "3", column: "fysiek_kto_score_3_aantal", colour: "orange" },
              { label: "4", column: "fysiek_kto_score_4_aantal", colour: "orange" },
              { label: "5", column: "fysiek_kto_score_5_aantal", colour: "orange" },
              { label: "6", column: "fysiek_kto_score_6_aantal", colour: "blue" },
              { label: "7", column: "fysiek_kto_score_7_aantal", colour: "blue" },
              { label: "8", column: "fysiek_kto_score_8_aantal", colour: "moss" },
              { label: "9", column: "fysiek_kto_score_9_aantal", colour: "moss" },
              { label: "10", column: "fysiek_kto_score_10_aantal", colour: "moss" },
            ],
          ],
          segment: { key: "all", domein: "fysiek", cumulative: true, periodization: "monthly" },
        },
        // {
        //   slug: "domein_trend",
        //   ctrlr: "BarTrendV1",
        //   filters: [],
        //   args: [],
        //   parameters: [
        //     [{ label: "Waardering", column: "fysiek_kto_score_gemiddeld", units: "waardering", colour: "moss", format: "decimals", excludeFromTable: true }],
        //   ],
        //   segment: { key: "fysiek_kto_score_gemiddeld", cumulative: false, periodization: "monthly" },
        // },
      ],
      segment: { key: "fysiek_kto_score_gemiddeld", domein: "fysiek", cumulative: true, periodization: "monthly" },
      functionality: ["table", "definitions", "download"],
      endpoints: [
        "regelingen?aggregatie=eq.maand&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&order=periode.desc",
        "regelingen?aggregatie=eq.maand&domein_code=eq.IMS&regeling_code=eq.Totaal&order=periode.desc",
        "regelingen?aggregatie=eq.maand&domein_code=eq.WDL&regeling_code=eq.Totaal&order=periode.desc",
        "regelingen?aggregatie=eq.week&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&order=periode.desc&limit=1",
        "regelingen?aggregatie=eq.week&domein_code=eq.IMS&regeling_code=eq.Totaal&order=periode.desc&limit=1",
        "regelingen?aggregatie=eq.week&domein_code=eq.WDL&regeling_code=eq.Totaal&order=periode.desc&limit=1",
      ],
    },
    {
      slug: "waardering_regelingsvarianten",
      ctrlr: "RegelingComparisonGroupV1",
      filters: [],
      graphs: [
        {
          slug: "mw_cijfer_regeling",
          ctrlr: "KTORatingsV1",
          // row-level regeling selector: swap between mw/vv/imk/ims/wd/wnw
          filters: ["regelingSelect", "monthSelect"],
          args: ["mw_kto_score_totaal_cumul", "mw_kto_score_totaal"],
          parameters: [
            [
              { label: "Doorlopend", column: "mw_kto_score_gemiddeld_cumul", colour: "orange" },
              { label: "Maandcijfer", column: "mw_kto_score_gemiddeld", colour: "orange" },
              { label: "Respondenten doorlopend", column: "mw_kto_score_totaal_cumul", colour: "orange", excludeFromTable: true },
              { label: "Respondenten", column: "mw_kto_score_totaal", colour: "orange" },
            ],
            [
              { label: "1", column: "mw_kto_score_1_aantal_cumul", colour: "orange", excludeFromTable: true },
              { label: "2", column: "mw_kto_score_2_aantal_cumul", colour: "orange", excludeFromTable: true },
              { label: "3", column: "mw_kto_score_3_aantal_cumul", colour: "orange", excludeFromTable: true },
              { label: "4", column: "mw_kto_score_4_aantal_cumul", colour: "orange", excludeFromTable: true },
              { label: "5", column: "mw_kto_score_5_aantal_cumul", colour: "orange", excludeFromTable: true },
              { label: "6", column: "mw_kto_score_6_aantal_cumul", colour: "blue", excludeFromTable: true },
              { label: "7", column: "mw_kto_score_7_aantal_cumul", colour: "blue", excludeFromTable: true },
              { label: "8", column: "mw_kto_score_8_aantal_cumul", colour: "moss", excludeFromTable: true },
              { label: "9", column: "mw_kto_score_9_aantal_cumul", colour: "moss", excludeFromTable: true },
              { label: "10", column: "mw_kto_score_10_aantal_cumul", colour: "moss", excludeFromTable: true },
            ],
            [
              { label: "1", column: "mw_kto_score_1_aantal", colour: "orange" },
              { label: "2", column: "mw_kto_score_2_aantal", colour: "orange" },
              { label: "3", column: "mw_kto_score_3_aantal", colour: "orange" },
              { label: "4", column: "mw_kto_score_4_aantal", colour: "orange" },
              { label: "5", column: "mw_kto_score_5_aantal", colour: "orange" },
              { label: "6", column: "mw_kto_score_6_aantal", colour: "blue" },
              { label: "7", column: "mw_kto_score_7_aantal", colour: "blue" },
              { label: "8", column: "mw_kto_score_8_aantal", colour: "moss" },
              { label: "9", column: "mw_kto_score_9_aantal", colour: "moss" },
              { label: "10", column: "mw_kto_score_10_aantal", colour: "moss" },
            ],
          ],
          segment: { key: "all", regeling: "mw", cumulative: true, periodization: "monthly" },
        },
      ],
      segment: { key: "mw_kto_score_gemiddeld", regeling: "mw", cumulative: true, periodization: "monthly" },
      functionality: ["table", "definitions", "download"],
      endpoints: [
        "regelingen?aggregatie=eq.maand&regeling_code=eq.MW&order=periode.desc",
        "regelingen?aggregatie=eq.maand&regeling_code=eq.VV&order=periode.desc",
        "regelingen?aggregatie=eq.maand&regeling_code=eq.IMK&order=periode.desc",
        "regelingen?aggregatie=eq.maand&regeling_code=eq.IMS&order=periode.desc",
        "regelingen?aggregatie=eq.maand&regeling_code=eq.WD&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.MW&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.VV&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.IMK&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.IMS&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.WD&order=periode.desc",
       
      ],
    },
  ],
};

export default pageConfig;