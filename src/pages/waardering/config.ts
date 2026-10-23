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
      ctrlr: "DomainComparisonGroupV1",
      graphs: [
        {
          slug: "a_waardering_numbers",
          ctrlr: "NumbersPlusRespondentsV1",
          args: [],
          parameters: [
            [
              {
                label: "Alle regelingen",
                column: "totaal_kto_score_gemiddeld_cumul",
                colour: "orange",
                format: "decimals",
                table_label: "Totaal",
                table_header: "cijfer",
              },
            ],
            [
              {
                label: "Totaal respondenten",
                column: "totaal_kto_score_totaal_cumul",
                units: "respondenten sinds start",
                colour: "orange",
                table_label: "Totaal",
                table_header: "respondenten",
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
                column: "totaal_kto_score_gemiddeld",
                colour: "orange",
                format: "decimals",
                table_label: "Totaal",
                table_header: "cijfer",
              },
            ],
            [
              {
                label: "Aantal nieuwe respondenten",
                column: "totaal_kto_score_totaal",
                colour: "orange",
                units: "respondenten",
                table_label: "Totaal",
                table_header: "respondenten",
              },
            ],
          ],
          segment: {
            key: "totaal_kto_score_gemiddeld",
            cumulative: false,
            periodization: "monthly",
          },
        },
        {
          slug: "tevredenheid_numbers_v1",
          ctrlr: "NumbersPlusRespondentsV1",
          args: [],
          filters: [],
          parameters: [
            [
              { label: "Fysieke schade", column: "fysiek_kto_score_gemiddeld_cumul", colour: "moss", format: "", table_label: "Fysieke schade", table_header: "cijfer" },
              { label: "Immateriele schade", column: "ims_kto_score_gemiddeld_cumul", colour: "blue", format: "", table_label: "Immateriele schade", table_header: "cijfer" },
              { label: "Waardedaling", column: "wdl_kto_score_gemiddeld_cumul", colour: "purple", format: "", table_label: "Waardedaling", table_header: "cijfer" },
            ],
            [
              { label: "Fysieke schade", column: "fysiek_kto_score_totaal_cumul", colour: "moss", units: "respondenten", table_label: "Fysieke schade", table_header: "respondenten" },
              { label: "Immateriele schade", column: "ims_kto_score_totaal_cumul", colour: "blue", units: "respondenten", table_label: "Immateriele schade", table_header: "respondenten" },
              { label: "Waardedaling", column: "wdl_kto_score_totaal_cumul", colour: "purple", units: "respondenten", table_label: "Waardedaling", table_header: "respondenten" },
            ],
          ],
          modifiers: [],
          segment: { key: "fysiek_kto_score_gemiddeld_cumul", cumulative: true, periodization: "monthly" },
        }
      ],
      segment: {
        key: "kto_score_gemiddeld_cumul",
        cumulative: false,
        periodization: "monthly",
      },
      functionality: ["table", "definitions", "download"],
      endpoints: [
        "regelingen?aggregatie=eq.week&domein_code=eq.Totaal&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2ckto_score_gemiddeld_cumul%2ckto_score_totaal_cumul%2ckto_score_gemiddeld%2ckto_score_totaal&order=periode.desc",
        "regelingen?aggregatie=eq.maand&domein_code=eq.Totaal&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2ckto_score_gemiddeld_cumul%2ckto_score_totaal_cumul%2ckto_score_gemiddeld%2ckto_score_totaal&order=periode.desc",
        "regelingen?aggregatie=eq.week&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2ckto_score_gemiddeld_cumul%2ckto_score_totaal_cumul%2ckto_score_gemiddeld%2ckto_score_totaal&order=periode.desc",
        "regelingen?aggregatie=eq.week&domein_code=eq.IMS&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2ckto_score_gemiddeld_cumul%2ckto_score_totaal_cumul%2ckto_score_gemiddeld%2ckto_score_totaal&order=periode.desc",
        "regelingen?aggregatie=eq.week&domein_code=eq.WDL&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2ckto_score_gemiddeld_cumul%2ckto_score_totaal_cumul%2ckto_score_gemiddeld%2ckto_score_totaal&order=periode.desc",
        "regelingen?aggregatie=eq.maand&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2ckto_score_gemiddeld_cumul%2ckto_score_totaal_cumul%2ckto_score_gemiddeld%2ckto_score_totaal&order=periode.desc",
        "regelingen?aggregatie=eq.maand&domein_code=eq.IMS&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2ckto_score_gemiddeld_cumul%2ckto_score_totaal_cumul%2ckto_score_gemiddeld%2ckto_score_totaal&order=periode.desc",
        "regelingen?aggregatie=eq.maand&domein_code=eq.WDL&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2ckto_score_gemiddeld_cumul%2ckto_score_totaal_cumul%2ckto_score_gemiddeld%2ckto_score_totaal&order=periode.desc",
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
              { label: "Fysieke schade", short: "MV/FS", column: "mw_kto_score_totaal", units: "respondenten", colour: "blue" },
              { label: "Vaste vergoeding", short: "VV", column: "vv_kto_score_totaal", units: "respondenten", colour: "orange" },
              { label: "Waardedaling", short: "WD", column: "wd_kto_score_totaal", units: "respondenten", colour: "purple" },
              { label: "Immateriele schade: volwassenen", short: "IMS", column: "ims_kto_score_totaal", units: "respondenten", colour: "moss" },
              { label: "Immateriele schade: kinderen en jongeren", short: "IMKJ", column: "imk_kto_score_totaal", units: "respondenten", colour: "lightBlue" },
            ],
          ],
          segment: { key: "mw_kto_score_totaal", cumulative: false, periodization: "monthly" },
        },
      ],
      segment: { key: "mw_kto_score_totaal", cumulative: false, periodization: "monthly" },
      functionality: ["table", "definitions", "download"],
      endpoints: [
        "regelingen?aggregatie=eq.maand&regeling_code=eq.MW&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_totaal&order=periode.desc",
        "regelingen?aggregatie=eq.maand&regeling_code=eq.VV&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_totaal&order=periode.desc",
        "regelingen?aggregatie=eq.maand&regeling_code=eq.IMK&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_totaal&order=periode.desc",
        "regelingen?aggregatie=eq.maand&regeling_code=eq.IMS&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_totaal&order=periode.desc",
        "regelingen?aggregatie=eq.maand&regeling_code=eq.WD&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_totaal&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.MW&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_totaal&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.VV&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_totaal&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.IMK&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_totaal&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.IMS&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_totaal&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.WD&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_totaal&order=periode.desc",
      ],
    },
     {
      slug: "waardering_regelingen",
      ctrlr: "DomainComparisonGroupV1",
      filters: ["domeinSelect"],
      graphs: [
        

        {
          slug: "fs_cijfer_domein",
          ctrlr: "KTORatingsV1",
          filters: ["monthSelect"],
          args: ["fysiek_kto_score_totaal_cumul", "fysiek_kto_score_totaal"],
          parameters: [
            [
              { label: "Doorlopend", column: "fysiek_kto_score_gemiddeld_cumul", colour: "orange", table_label: "Fysieke schade", table_header: "cijfer" },
              { label: "Maandcijfer", column: "fysiek_kto_score_gemiddeld", colour: "orange", table_label: "Fysieke schade", table_header: "cijfer" },
              { label: "Respondenten doorlopend", column: "fysiek_kto_score_totaal_cumul", colour: "orange", table_label: "Fysieke schade", table_header: "respondenten" },
              { label: "Respondenten", column: "fysiek_kto_score_totaal", colour: "orange", table_label: "Fysieke schade", table_header: "respondenten" },
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
              { label: "1", column: "fysiek_kto_score_1_aantal", colour: "orange", excludeFromTable: true },
              { label: "2", column: "fysiek_kto_score_2_aantal", colour: "orange", excludeFromTable: true },
              { label: "3", column: "fysiek_kto_score_3_aantal", colour: "orange", excludeFromTable: true },
              { label: "4", column: "fysiek_kto_score_4_aantal", colour: "orange", excludeFromTable: true },
              { label: "5", column: "fysiek_kto_score_5_aantal", colour: "orange", excludeFromTable: true },
              { label: "6", column: "fysiek_kto_score_6_aantal", colour: "blue", excludeFromTable: true },
              { label: "7", column: "fysiek_kto_score_7_aantal", colour: "blue", excludeFromTable: true },
              { label: "8", column: "fysiek_kto_score_8_aantal", colour: "moss", excludeFromTable: true },
              { label: "9", column: "fysiek_kto_score_9_aantal", colour: "moss", excludeFromTable: true },
              { label: "10", column: "fysiek_kto_score_10_aantal", colour: "moss", excludeFromTable: true },
            ],
          ],
          segment: { key: "all", domein: "fysiek", cumulative: true, periodization: "monthly" },
        },
        {
          slug: "domein_trend",
          ctrlr: "KtoBarTrendV1",
          filters: [],
          args: [],
          parameters: [
            [{ label: "Waardering", column: "fysiek_kto_score_gemiddeld", units: "waardering", colour: "moss", format: "decimals", excludeFromTable: true }],
          ],
          segment: { key: "fysiek_kto_score_gemiddeld", domein: "fysiek", cumulative: false, periodization: "monthly" },
        },
      ],
      segment: { key: "fysiek_kto_score_gemiddeld", domein: "fysiek", cumulative: true, periodization: "monthly" },
      functionality: ["table", "definitions", "download"],
      endpoints: [
        "regelingen?aggregatie=eq.maand&domein_code=eq.Totaal&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2ckto_score_gemiddeld_cumul%2ckto_score_gemiddeld%2ckto_score_totaal_cumul%2ckto_score_totaal&order=periode.desc",
        "regelingen?aggregatie=eq.maand&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2ckto_score_gemiddeld_cumul%2ckto_score_gemiddeld%2ckto_score_totaal_cumul%2ckto_score_totaal%2ckto_score_1_aantal_cumul%2ckto_score_2_aantal_cumul%2ckto_score_3_aantal_cumul%2ckto_score_4_aantal_cumul%2ckto_score_5_aantal_cumul%2ckto_score_6_aantal_cumul%2ckto_score_7_aantal_cumul%2ckto_score_8_aantal_cumul%2ckto_score_9_aantal_cumul%2ckto_score_10_aantal_cumul%2ckto_score_1_aantal%2ckto_score_2_aantal%2ckto_score_3_aantal%2ckto_score_4_aantal%2ckto_score_5_aantal%2ckto_score_6_aantal%2ckto_score_7_aantal%2ckto_score_8_aantal%2ckto_score_9_aantal%2ckto_score_10_aantal&order=periode.desc",
        "regelingen?aggregatie=eq.maand&domein_code=eq.IMS&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2ckto_score_gemiddeld_cumul%2ckto_score_gemiddeld%2ckto_score_totaal_cumul%2ckto_score_totaal%2ckto_score_1_aantal_cumul%2ckto_score_2_aantal_cumul%2ckto_score_3_aantal_cumul%2ckto_score_4_aantal_cumul%2ckto_score_5_aantal_cumul%2ckto_score_6_aantal_cumul%2ckto_score_7_aantal_cumul%2ckto_score_8_aantal_cumul%2ckto_score_9_aantal_cumul%2ckto_score_10_aantal_cumul%2ckto_score_1_aantal%2ckto_score_2_aantal%2ckto_score_3_aantal%2ckto_score_4_aantal%2ckto_score_5_aantal%2ckto_score_6_aantal%2ckto_score_7_aantal%2ckto_score_8_aantal%2ckto_score_9_aantal%2ckto_score_10_aantal&order=periode.desc",
        "regelingen?aggregatie=eq.maand&domein_code=eq.WDL&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2ckto_score_gemiddeld_cumul%2ckto_score_gemiddeld%2ckto_score_totaal_cumul%2ckto_score_totaal%2ckto_score_1_aantal_cumul%2ckto_score_2_aantal_cumul%2ckto_score_3_aantal_cumul%2ckto_score_4_aantal_cumul%2ckto_score_5_aantal_cumul%2ckto_score_6_aantal_cumul%2ckto_score_7_aantal_cumul%2ckto_score_8_aantal_cumul%2ckto_score_9_aantal_cumul%2ckto_score_10_aantal_cumul%2ckto_score_1_aantal%2ckto_score_2_aantal%2ckto_score_3_aantal%2ckto_score_4_aantal%2ckto_score_5_aantal%2ckto_score_6_aantal%2ckto_score_7_aantal%2ckto_score_8_aantal%2ckto_score_9_aantal%2ckto_score_10_aantal&order=periode.desc",
        "regelingen?aggregatie=eq.week&domein_code=eq.Totaal&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2ckto_score_gemiddeld_cumul%2ckto_score_totaal_cumul%2ckto_score_gemiddeld%2ckto_score_totaal&order=periode.desc&limit=1",
        "regelingen?aggregatie=eq.week&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2ckto_score_gemiddeld_cumul%2ckto_score_totaal_cumul%2ckto_score_gemiddeld%2ckto_score_totaal&order=periode.desc&limit=1",
        "regelingen?aggregatie=eq.week&domein_code=eq.IMS&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2ckto_score_gemiddeld_cumul%2ckto_score_totaal_cumul%2ckto_score_gemiddeld%2ckto_score_totaal&order=periode.desc&limit=1",
        "regelingen?aggregatie=eq.week&domein_code=eq.WDL&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2ckto_score_gemiddeld_cumul%2ckto_score_totaal_cumul%2ckto_score_gemiddeld%2ckto_score_totaal&order=periode.desc&limit=1",
      ],
    },
    {
      slug: "waardering_regelingsvarianten",
      ctrlr: "RegelingComparisonGroupV1",
      // group-level regeling selector: swap mw/vv/imk/ims/wd for every graph
      // whose config segment declares `regeling` (mw_cijfer_regeling +
      // regeling_trend) — same pattern as the domeinSelect above
      filters: ["regelingSelect"],
      graphs: [
        {
          slug: "mw_cijfer_regeling",
          ctrlr: "KTORatingsV1",
          filters: ["monthSelect"],
          args: ["mw_kto_score_totaal_cumul", "mw_kto_score_totaal"],
          parameters: [
            [
              { label: "Doorlopend", column: "mw_kto_score_gemiddeld_cumul", colour: "orange", table_label: "Maatwerk", table_header: "cijfer" },
              { label: "Maandcijfer", column: "mw_kto_score_gemiddeld", colour: "orange", table_label: "Maatwerk", table_header: "cijfer" },
              { label: "Respondenten doorlopend", column: "mw_kto_score_totaal_cumul", colour: "orange", table_label: "Maatwerk", table_header: "respondenten" },
              { label: "Respondenten", column: "mw_kto_score_totaal", colour: "orange", table_label: "Maatwerk", table_header: "respondenten" },
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
              { label: "1", column: "mw_kto_score_1_aantal", colour: "orange", excludeFromTable: true },
              { label: "2", column: "mw_kto_score_2_aantal", colour: "orange", excludeFromTable: true },
              { label: "3", column: "mw_kto_score_3_aantal", colour: "orange", excludeFromTable: true },
              { label: "4", column: "mw_kto_score_4_aantal", colour: "orange", excludeFromTable: true },
              { label: "5", column: "mw_kto_score_5_aantal", colour: "orange", excludeFromTable: true },
              { label: "6", column: "mw_kto_score_6_aantal", colour: "blue", excludeFromTable: true },
              { label: "7", column: "mw_kto_score_7_aantal", colour: "blue", excludeFromTable: true },
              { label: "8", column: "mw_kto_score_8_aantal", colour: "moss", excludeFromTable: true },
              { label: "9", column: "mw_kto_score_9_aantal", colour: "moss", excludeFromTable: true },
              { label: "10", column: "mw_kto_score_10_aantal", colour: "moss", excludeFromTable: true },
            ],
          ],
          segment: { key: "all", regeling: "mw", cumulative: true, periodization: "monthly" },
        },
        {
          slug: "regeling_trend",
          ctrlr: "KtoBarTrendV1",
          // follows the group-level regelingSelect (segment.regeling opted in
          // below), like domein_trend follows domeinSelect
          filters: [],
          args: [],
          parameters: [
            [{ label: "Waardering", column: "mw_kto_score_gemiddeld", units: "waardering", colour: "moss", format: "decimals", excludeFromTable: true }],
          ],
          segment: { key: "mw_kto_score_gemiddeld", regeling: "mw", cumulative: false, periodization: "monthly" },
        },
      ],
      segment: { key: "mw_kto_score_gemiddeld", regeling: "mw", cumulative: true, periodization: "monthly" },
      functionality: ["table", "definitions", "download"],
      endpoints: [
        "regelingen?aggregatie=eq.maand&regeling_code=eq.MW&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_gemiddeld_cumul%2ckto_score_gemiddeld%2ckto_score_totaal_cumul%2ckto_score_totaal%2ckto_score_1_aantal_cumul%2ckto_score_2_aantal_cumul%2ckto_score_3_aantal_cumul%2ckto_score_4_aantal_cumul%2ckto_score_5_aantal_cumul%2ckto_score_6_aantal_cumul%2ckto_score_7_aantal_cumul%2ckto_score_8_aantal_cumul%2ckto_score_9_aantal_cumul%2ckto_score_10_aantal_cumul%2ckto_score_1_aantal%2ckto_score_2_aantal%2ckto_score_3_aantal%2ckto_score_4_aantal%2ckto_score_5_aantal%2ckto_score_6_aantal%2ckto_score_7_aantal%2ckto_score_8_aantal%2ckto_score_9_aantal%2ckto_score_10_aantal&order=periode.desc",
        "regelingen?aggregatie=eq.maand&regeling_code=eq.VV&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_gemiddeld_cumul%2ckto_score_gemiddeld%2ckto_score_totaal_cumul%2ckto_score_totaal%2ckto_score_1_aantal_cumul%2ckto_score_2_aantal_cumul%2ckto_score_3_aantal_cumul%2ckto_score_4_aantal_cumul%2ckto_score_5_aantal_cumul%2ckto_score_6_aantal_cumul%2ckto_score_7_aantal_cumul%2ckto_score_8_aantal_cumul%2ckto_score_9_aantal_cumul%2ckto_score_10_aantal_cumul%2ckto_score_1_aantal%2ckto_score_2_aantal%2ckto_score_3_aantal%2ckto_score_4_aantal%2ckto_score_5_aantal%2ckto_score_6_aantal%2ckto_score_7_aantal%2ckto_score_8_aantal%2ckto_score_9_aantal%2ckto_score_10_aantal&order=periode.desc",
        "regelingen?aggregatie=eq.maand&regeling_code=eq.IMK&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_gemiddeld_cumul%2ckto_score_gemiddeld%2ckto_score_totaal_cumul%2ckto_score_totaal%2ckto_score_1_aantal_cumul%2ckto_score_2_aantal_cumul%2ckto_score_3_aantal_cumul%2ckto_score_4_aantal_cumul%2ckto_score_5_aantal_cumul%2ckto_score_6_aantal_cumul%2ckto_score_7_aantal_cumul%2ckto_score_8_aantal_cumul%2ckto_score_9_aantal_cumul%2ckto_score_10_aantal_cumul%2ckto_score_1_aantal%2ckto_score_2_aantal%2ckto_score_3_aantal%2ckto_score_4_aantal%2ckto_score_5_aantal%2ckto_score_6_aantal%2ckto_score_7_aantal%2ckto_score_8_aantal%2ckto_score_9_aantal%2ckto_score_10_aantal&order=periode.desc",
        "regelingen?aggregatie=eq.maand&regeling_code=eq.IMS&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_gemiddeld_cumul%2ckto_score_gemiddeld%2ckto_score_totaal_cumul%2ckto_score_totaal%2ckto_score_1_aantal_cumul%2ckto_score_2_aantal_cumul%2ckto_score_3_aantal_cumul%2ckto_score_4_aantal_cumul%2ckto_score_5_aantal_cumul%2ckto_score_6_aantal_cumul%2ckto_score_7_aantal_cumul%2ckto_score_8_aantal_cumul%2ckto_score_9_aantal_cumul%2ckto_score_10_aantal_cumul%2ckto_score_1_aantal%2ckto_score_2_aantal%2ckto_score_3_aantal%2ckto_score_4_aantal%2ckto_score_5_aantal%2ckto_score_6_aantal%2ckto_score_7_aantal%2ckto_score_8_aantal%2ckto_score_9_aantal%2ckto_score_10_aantal&order=periode.desc",
        "regelingen?aggregatie=eq.maand&regeling_code=eq.WD&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_gemiddeld_cumul%2ckto_score_gemiddeld%2ckto_score_totaal_cumul%2ckto_score_totaal%2ckto_score_1_aantal_cumul%2ckto_score_2_aantal_cumul%2ckto_score_3_aantal_cumul%2ckto_score_4_aantal_cumul%2ckto_score_5_aantal_cumul%2ckto_score_6_aantal_cumul%2ckto_score_7_aantal_cumul%2ckto_score_8_aantal_cumul%2ckto_score_9_aantal_cumul%2ckto_score_10_aantal_cumul%2ckto_score_1_aantal%2ckto_score_2_aantal%2ckto_score_3_aantal%2ckto_score_4_aantal%2ckto_score_5_aantal%2ckto_score_6_aantal%2ckto_score_7_aantal%2ckto_score_8_aantal%2ckto_score_9_aantal%2ckto_score_10_aantal&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.MW&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_gemiddeld_cumul%2ckto_score_gemiddeld%2ckto_score_totaal_cumul%2ckto_score_totaal%2ckto_score_1_aantal_cumul%2ckto_score_2_aantal_cumul%2ckto_score_3_aantal_cumul%2ckto_score_4_aantal_cumul%2ckto_score_5_aantal_cumul%2ckto_score_6_aantal_cumul%2ckto_score_7_aantal_cumul%2ckto_score_8_aantal_cumul%2ckto_score_9_aantal_cumul%2ckto_score_10_aantal_cumul%2ckto_score_1_aantal%2ckto_score_2_aantal%2ckto_score_3_aantal%2ckto_score_4_aantal%2ckto_score_5_aantal%2ckto_score_6_aantal%2ckto_score_7_aantal%2ckto_score_8_aantal%2ckto_score_9_aantal%2ckto_score_10_aantal&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.VV&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_gemiddeld_cumul%2ckto_score_gemiddeld%2ckto_score_totaal_cumul%2ckto_score_totaal%2ckto_score_1_aantal_cumul%2ckto_score_2_aantal_cumul%2ckto_score_3_aantal_cumul%2ckto_score_4_aantal_cumul%2ckto_score_5_aantal_cumul%2ckto_score_6_aantal_cumul%2ckto_score_7_aantal_cumul%2ckto_score_8_aantal_cumul%2ckto_score_9_aantal_cumul%2ckto_score_10_aantal_cumul%2ckto_score_1_aantal%2ckto_score_2_aantal%2ckto_score_3_aantal%2ckto_score_4_aantal%2ckto_score_5_aantal%2ckto_score_6_aantal%2ckto_score_7_aantal%2ckto_score_8_aantal%2ckto_score_9_aantal%2ckto_score_10_aantal&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.IMK&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_gemiddeld_cumul%2ckto_score_gemiddeld%2ckto_score_totaal_cumul%2ckto_score_totaal%2ckto_score_1_aantal_cumul%2ckto_score_2_aantal_cumul%2ckto_score_3_aantal_cumul%2ckto_score_4_aantal_cumul%2ckto_score_5_aantal_cumul%2ckto_score_6_aantal_cumul%2ckto_score_7_aantal_cumul%2ckto_score_8_aantal_cumul%2ckto_score_9_aantal_cumul%2ckto_score_10_aantal_cumul%2ckto_score_1_aantal%2ckto_score_2_aantal%2ckto_score_3_aantal%2ckto_score_4_aantal%2ckto_score_5_aantal%2ckto_score_6_aantal%2ckto_score_7_aantal%2ckto_score_8_aantal%2ckto_score_9_aantal%2ckto_score_10_aantal&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.IMS&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_gemiddeld_cumul%2ckto_score_gemiddeld%2ckto_score_totaal_cumul%2ckto_score_totaal%2ckto_score_1_aantal_cumul%2ckto_score_2_aantal_cumul%2ckto_score_3_aantal_cumul%2ckto_score_4_aantal_cumul%2ckto_score_5_aantal_cumul%2ckto_score_6_aantal_cumul%2ckto_score_7_aantal_cumul%2ckto_score_8_aantal_cumul%2ckto_score_9_aantal_cumul%2ckto_score_10_aantal_cumul%2ckto_score_1_aantal%2ckto_score_2_aantal%2ckto_score_3_aantal%2ckto_score_4_aantal%2ckto_score_5_aantal%2ckto_score_6_aantal%2ckto_score_7_aantal%2ckto_score_8_aantal%2ckto_score_9_aantal%2ckto_score_10_aantal&order=periode.desc",
        "regelingen?aggregatie=eq.week&regeling_code=eq.WD&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cregeling_code%2ckto_score_gemiddeld_cumul%2ckto_score_gemiddeld%2ckto_score_totaal_cumul%2ckto_score_totaal%2ckto_score_1_aantal_cumul%2ckto_score_2_aantal_cumul%2ckto_score_3_aantal_cumul%2ckto_score_4_aantal_cumul%2ckto_score_5_aantal_cumul%2ckto_score_6_aantal_cumul%2ckto_score_7_aantal_cumul%2ckto_score_8_aantal_cumul%2ckto_score_9_aantal_cumul%2ckto_score_10_aantal_cumul%2ckto_score_1_aantal%2ckto_score_2_aantal%2ckto_score_3_aantal%2ckto_score_4_aantal%2ckto_score_5_aantal%2ckto_score_6_aantal%2ckto_score_7_aantal%2ckto_score_8_aantal%2ckto_score_9_aantal%2ckto_score_10_aantal&order=periode.desc",
       
      ],
    },
  ],
};

export default pageConfig;