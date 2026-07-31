import type { IPageConfig } from "../../shared/interfaces";

const pageConfig: IPageConfig = {
  slug: "bz",
  segment: {
    key: "",
    gemeente: "all",
    periodization: "weekly",
    cumulative: false,
    vanaf: "2025-01-01",
  },
  filters: ["vanaf"],
  endpoints: [
    `regelingen?aggregatie=eq.week&select=aggregatie%2Cperiode%2Cperiode_totenmet%2Cperiode_vanaf%2Cdomein_code%2Cregeling_code%2Cbz_ingediend_aantal%2Cbz_ingediend_cumul%2Cbz_afgerond_aantal%2Cbz_afgerond_cumul%2Cbz_beschikt_aantal%2Cbz_beschikt_cumul%2Cbz_toegekend_aantal%2Cbz_toegekend_cumul%2Cbz_afgewezen_aantal%2Cbz_afgewezen_cumul%2Cbz_anders_afgehandeld_aantal%2Cbz_anders_afgehandeld_cumul%2Cbz_voorraad_cumul%2Cbz_voorraad_verschil%2Cbz_vertraagd_jaar_perc&periode_vanaf=gte.{VANAF}&order=periode.desc`,
    `regelingen?aggregatie=eq.maand&select=aggregatie%2Cperiode%2Cperiode_totenmet%2Cperiode_vanaf%2Cdomein_code%2Cregeling_code%2Cbz_ingediend_aantal%2Cbz_ingediend_cumul%2Cbz_afgerond_aantal%2Cbz_afgerond_cumul%2Cbz_beschikt_aantal%2Cbz_beschikt_cumul%2Cbz_toegekend_aantal%2Cbz_toegekend_cumul%2Cbz_afgewezen_aantal%2Cbz_afgewezen_cumul%2Cbz_anders_afgehandeld_aantal%2Cbz_anders_afgehandeld_cumul%2Cbz_voorraad_cumul%2Cbz_voorraad_verschil%2Cbz_vertraagd_jaar_perc&order=periode.desc`,
  ],
  groups: [
    {
      slug: "bz_intro",
      ctrlr: "RegelingComparisonGroupV1",
      filters: [],
      graphs: [
        {
          slug: "bz_mw_numbers_v1",
          ctrlr: "NumbersV1",
          args: [],
          filters: [],
          header: "Maatwerk",
          parameters: [
            [
              { label: "ingediend", column: "mw_bz_ingediend_cumul", colour: "blue", units: "ingediend" },
              { label: "percentage", column: "mw_bz_vertraagd_jaar_perc", colour: "lightBlue", format: "percentage", units: "van aantal besluiten" },
              { label: "afgerond", column: "mw_bz_afgerond_cumul", colour: "moss", units: "afgerond" },
              { label: "in beh.", column: "mw_bz_voorraad_cumul", colour: "orange", units: "in behandeling" },
            ]],
          },
        {
          slug: "bz_ves_numbers_v1",
          ctrlr: "NumbersV1",
          args: [],
          filters: [],
          header: "Vaste vergoedingen",
          parameters: [
            [
              { label: "ingediend", column: "vv_bz_ingediend_cumul", colour: "blue", units: "ingediend" },
              { label: "percentage", column: "vv_bz_vertraagd_jaar_perc", colour: "lightBlue", format: "percentage", units: "van aantal besluiten" },
              { label: "afgerond", column: "vv_bz_afgerond_cumul", colour: "moss", units: "afgerond" },
              { label: "in beh.", column: "vv_bz_voorraad_cumul", colour: "orange", units: "in behandeling" },
            ],
          ],
          segment: undefined,
        },
        {
          slug: "bz_ims_volw_numbers_v1",
          ctrlr: "NumbersV1",
          args: [],
          filters: [],
          header: "Immateriele schade: volwassenen",
          parameters: [
            [
              { label: "ingediend", column: "ims_bz_ingediend_cumul", colour: "blue", units: "ingediend" },
              { label: "percentage", column: "ims_bz_vertraagd_jaar_perc", colour: "lightBlue", format: "percentage", units: "van aantal besluiten" },
              { label: "afgerond", column: "ims_bz_afgerond_cumul", colour: "moss", units: "afgerond" },
              { label: "in beh.", column: "ims_bz_voorraad_cumul", colour: "orange", units: "in behandeling" },
            ],
          ],
          segment: undefined,
        },
        {
          slug: "bz_ims_kj_numbers_v1",
          ctrlr: "NumbersV1",
          args: [],
          filters: [],
          header: "Immateriele schade: kinderen en jongeren",
          parameters: [
            [
              { label: "ingediend", column: "imk_bz_ingediend_cumul", colour: "blue", units: "ingediend" },
              { label: "percentage", column: "imk_bz_vertraagd_jaar_perc", colour: "lightBlue", format: "percentage", units: "van aantal besluiten" },
              { label: "afgerond", column: "imk_bz_afgerond_cumul", colour: "moss", units: "afgerond" },
              { label: "in beh.", column: "imk_bz_voorraad_cumul", colour: "orange", units: "in behandeling" },
            ],
          ],
          segment: undefined,
        },
        {
          slug: "bz_wd_wonen_numbers_v1",
          ctrlr: "NumbersV1",
          args: [],
          filters: [],
          header: "Waardedaling: wonen",
          parameters: [
            [
              { label: "ingediend", column: "wd_bz_ingediend_cumul", colour: "blue", units: "ingediend" },
              { label: "percentage", column: "wd_bz_vertraagd_jaar_perc", colour: "lightBlue", format: "percentage", units: "van aantal besluiten" },
              { label: "afgerond", column: "wd_bz_afgerond_cumul", colour: "moss", units: "afgerond" },
              { label: "in beh.", column: "wd_bz_voorraad_cumul", colour: "orange", units: "in behandeling" },
            ],
          ],
          segment: undefined,
        },
        {
          slug: "bz_wd_nietwonen_numbers_v1",
          ctrlr: "NumbersV1",
          args: [],
          filters: [],
          header: "Waardedaling: niet wonen",
          parameters: [
            [
              { label: "ingediend", column: "wnw_bz_ingediend_cumul", colour: "blue", units: "ingediend" },
              { label: "percentage", column: "wnw_bz_vertraagd_jaar_perc", colour: "lightBlue", format: "percentage", units: "van aantal besluiten" },
              { label: "afgerond", column: "wnw_bz_afgerond_cumul", colour: "moss", units: "afgerond" },
              { label: "in beh.", column: "wnw_bz_voorraad_cumul", colour: "orange", units: "in behandeling" },
            ],
          ],
          segment: undefined,
        },
        {
          slug: "bz_wd_namco_numbers_v1",
          ctrlr: "NumbersV1",
          args: [],
          filters: [],
          header: "Waardedaling: NAM tegemoetkoming",
          parameters: [
            [
              { label: "ingediend", column: "namteg_bz_ingediend_cumul", colour: "blue", units: "ingediend" },
              { label: "percentage", column: "namteg_bz_vertraagd_jaar_perc", colour: "lightBlue", format: "percentage", units: "van aantal besluiten" },
              { label: "afgerond", column: "namteg_bz_afgerond_cumul", colour: "moss", units: "afgerond" },
              { label: "in beh.", column: "namteg_bz_voorraad_cumul", colour: "orange", units: "in behandeling" },
            ],
          ],
          segment: undefined,
        },
      ],
      functionality: ["table", "definitions", "download"],
      endpoints: [],
      segment: {
        key: "mw_bz_ingediend_cumul",
        cumulative: true,
        periodization: "weekly",
      },
    },
    {
      slug: "bz_mw_pies",
      ctrlr: "RegelingComparisonGroupV1",
      graphs: [
        {
          slug: "bz_mw_taart_toegekend",
          ctrlr: "PieChartSumV1",
          args: [],
          parameters: [
            [
              { label: "Toegekend", column: "mw_bz_toegekend_cumul", colour: "moss" },
              { label: "Afgewezen", column: "mw_bz_afgewezen_cumul", colour: "orange" },
              { label: "Anders afgerond", column: "mw_bz_anders_afgehandeld_cumul", colour: "blue" },
            ],
            [
              { label: "Totaal afgerond", column: "mw_bz_afgerond_cumul", colour: "gray" },
            ],
          ],
          segment: { key: "mw_bz_toegekend_cumul", cumulative: true, periodization: "weekly" },
        },
      ],
      header: "Maatwerk",
      functionality: ["table", "definitions", "download"],
      endpoints: [],
      segment: { key: "mw_bz_toegekend_cumul", cumulative: true, periodization: "weekly" },
    },
    {
      slug: "bz_ves_pies",
      ctrlr: "RegelingComparisonGroupV1",
      graphs: [
        {
          slug: "bz_ves_taart_toegekend",
          ctrlr: "PieChartSumV1",
          args: [],
          parameters: [
            [
              { label: "Toegekend", column: "vv_bz_toegekend_cumul", colour: "moss" },
              { label: "Afgewezen", column: "vv_bz_afgewezen_cumul", colour: "orange" },
              { label: "Anders afgerond", column: "vv_bz_anders_afgehandeld_cumul", colour: "blue" },
            ],
            [
              { label: "Totaal afgerond", column: "vv_bz_afgerond_cumul", colour: "gray" },
            ],
          ],
          segment: { key: "vv_bz_toegekend_cumul", cumulative: true, periodization: "weekly" },
        },
      ],
      header: "Vaste vergoedingen",
      functionality: ["table", "definitions", "download"],
      endpoints: [],
      segment: { key: "vv_bz_toegekend_cumul", cumulative: false, periodization: "none" },
    },
    {
      slug: "bz_ims_volw_pies",
      ctrlr: "RegelingComparisonGroupV1",
      graphs: [
        {
          slug: "bz_ims_volw_taart_toegekend",
          ctrlr: "PieChartSumV1",
          args: [],
          parameters: [
            [
              { label: "Toegekend", column: "ims_bz_toegekend_cumul", colour: "moss" },
              { label: "Afgewezen", column: "ims_bz_afgewezen_cumul", colour: "orange" },
              { label: "Anders afgerond", column: "ims_bz_anders_afgehandeld_cumul", colour: "blue" },
            ],
            [
              { label: "Totaal afgerond", column: "ims_bz_afgerond_cumul", colour: "gray" },
            ],
          ],
          segment: { key: "ims_bz_toegekend_cumul", cumulative: true, periodization: "weekly" },
        },
      ],
      header: "Immateriele schade: volwassenen",
      functionality: ["table", "definitions", "download"],
      endpoints: [],
      segment: { key: "ims_bz_toegekend_cumul", cumulative: false, periodization: "none" },
    },
    {
      slug: "bz_ims_kj_pies",
      ctrlr: "RegelingComparisonGroupV1",
      graphs: [
        {
          slug: "bz_ims_kj_taart_toegekend",
          ctrlr: "PieChartSumV1",
          args: [],
          parameters: [
            [
              { label: "Toegekend", column: "imk_bz_toegekend_cumul", colour: "moss" },
              { label: "Afgewezen", column: "imk_bz_afgewezen_cumul", colour: "orange" },
              { label: "Anders afgerond", column: "imk_bz_anders_afgehandeld_cumul", colour: "blue" },
            ],
            [
              { label: "Totaal afgerond", column: "imk_bz_afgerond_cumul", colour: "gray" },
            ],
          ],
          segment: { key: "imk_bz_toegekend_cumul", cumulative: true, periodization: "weekly" },
        },
      ],
      header: "Immateriele schade: kinderen en jongeren",
      functionality: ["table", "definitions", "download"],
      endpoints: [],
      segment: { key: "imk_bz_toegekend_cumul", cumulative: false, periodization: "none" },
    },
    {
      slug: "bz_wd_wonen_pies",
      ctrlr: "RegelingComparisonGroupV1",
      graphs: [
        {
          slug: "bz_wd_wonen_taart_toegekend",
          ctrlr: "PieChartSumV1",
          args: [],
          parameters: [
            [
              { label: "Toegekend", column: "wd_bz_toegekend_cumul", colour: "moss" },
              { label: "Afgewezen", column: "wd_bz_afgewezen_cumul", colour: "orange" },
              { label: "Anders afgerond", column: "wd_bz_anders_afgehandeld_cumul", colour: "blue" },
            ],
            [
              { label: "Totaal afgerond", column: "wd_bz_afgerond_cumul", colour: "gray" },
            ],
          ],
          segment: { key: "wd_bz_toegekend_cumul", cumulative: true, periodization: "weekly" },
        },
      ],
      header: "Waardedaling: wonen",
      functionality: ["table", "definitions", "download"],
      endpoints: [],
      segment: { key: "wd_bz_toegekend_cumul", cumulative: false, periodization: "none" },
    },
    {
      slug: "bz_wd_nietwonen_pies",
      ctrlr: "RegelingComparisonGroupV1",
      graphs: [
        {
          slug: "bz_wd_nietwonen_taart_toegekend",
          ctrlr: "PieChartSumV1",
          args: [],
          parameters: [
            [
              { label: "Toegekend", column: "wnw_bz_toegekend_cumul", colour: "moss" },
              { label: "Afgewezen", column: "wnw_bz_afgewezen_cumul", colour: "orange" },
              { label: "Anders afgerond", column: "wnw_bz_anders_afgehandeld_cumul", colour: "blue" },
            ],
            [
              { label: "Totaal afgerond", column: "wnw_bz_afgerond_cumul", colour: "gray" },
            ],
          ],
          segment: { key: "wnw_bz_toegekend_cumul", cumulative: true, periodization: "weekly" },
        },
      ],
      header: "Waardedaling: niet wonen",
      functionality: ["table", "definitions", "download"],
      endpoints: [],
      segment: { key: "wnw_bz_toegekend_cumul", cumulative: false, periodization: "none" },
    },
    {
      slug: "bz_wd_namco_pies",
      ctrlr: "RegelingComparisonGroupV1",
      graphs: [
        {
          slug: "bz_wd_namco_taart_toegekend",
          ctrlr: "PieChartSumV1",
          args: [],
          parameters: [
            [
              { label: "Toegekend", column: "namteg_bz_toegekend_cumul", colour: "moss" },
              { label: "Afgewezen", column: "namteg_bz_afgewezen_cumul", colour: "orange" },
              { label: "Anders afgerond", column: "namteg_bz_anders_afgehandeld_cumul", colour: "blue" },
            ],
            [
              { label: "Totaal afgerond", column: "namteg_bz_afgerond_cumul", colour: "gray" },
            ],
          ],
          segment: { key: "namteg_bz_toegekend_cumul", cumulative: true, periodization: "weekly" },
        },
      ],
      header: "Waardedaling: NAM tegemoetkoming",
      functionality: ["table", "definitions", "download"],
      endpoints: [],
      segment: { key: "namteg_bz_toegekend_cumul", cumulative: false, periodization: "none" },
    },
  ],
};

export default pageConfig;