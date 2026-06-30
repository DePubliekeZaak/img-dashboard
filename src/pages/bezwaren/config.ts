import type { IGroupMappingV2 } from "../../shared/interfaces";

const bezwaren: IGroupMappingV2[] = [
  {
    slug: "bezwaren_intro",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "bezwaren_mw_numbers_v1",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        header: "Maatwerk",
        parameters: [
          [
            {
              label: "ingediend",
              column: "maatwerk_bezwaren_ingediend_cumulatief",
              colour: "blue",
              units: "ingediend",
            },
            {
              label: "percentage",
              column: "maatwerk_bezwaren_percentage_cumulatief",
              colour: "lightBlue",
              format: "percentage",
              units: "van aantal besluiten",
            },
            {
              label: "afgerond",
              column: "maatwerk_bezwaren_afgerond_cumulatief",
              colour: "moss",
              units: "afgerond",
            },
            {
              label: "in beh.",
              column: "maatwerk_bezwaren_voorraad_cumulatief",
              colour: "orange",
              units: "in behandeling",
            },
          ],
        ],
      },
      {
        slug: "bezwaren_ves_numbers_v1",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        header: "Vaste vergoedingen",
        parameters: [
          [
            {
              label: "ingediend",
              column: "vv_bezwaren_ingediend_cumulatief",
              colour: "blue",
              units: "ingediend",
            },
            {
              label: "percentage",
              column: "vv_bezwaren_percentage_cumulatief",
              colour: "lightBlue",
              format: "percentage",
              units: "van aantal besluiten",
            },
            {
              label: "afgerond",
              column: "vv_bezwaren_afgerond_cumulatief",
              colour: "moss",
              units: "afgerond",
            },
            {
              label: "in beh.",
              column: "vv_bezwaren_voorraad_cumulatief",
              colour: "orange",
              units: "in behandeling",
            },
          ],
        ],
      },
      {
        slug: "bezwaren_ims_volw_numbers_v1",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        header: "Immateriele schade: volwassenen",
        parameters: [
          [
            {
              label: "ingediend",
              column: "ims_volw_bezwaren_ingediend_cumulatief",
              colour: "blue",
              units: "ingediend",
            },
            {
              label: "percentage",
              column: "ims_volw_bezwaren_percentage_cumulatief",
              colour: "lightBlue",
              format: "percentage",
              units: "van aantal besluiten",
            },
            {
              label: "afgerond",
              column: "ims_volw_bezwaren_afgerond_cumulatief",
              colour: "moss",
              units: "afgerond",
            },
            {
              label: "in beh.",
              column: "ims_volw_bezwaren_voorraad_cumulatief",
              colour: "orange",
              units: "in behandeling",
            },
          ],
        ],
      },
      {
        slug: "bezwaren_ims_kj_numbers_v1",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        header: "Immateriele schade: kinderen en jongeren",
        parameters: [
          [
            {
              label: "ingediend",
              column: "ims_kj_bezwaren_ingediend_cumulatief",
              colour: "blue",
              units: "ingediend",
            },
            {
              label: "percentage",
              column: "ims_kj_bezwaren_percentage_cumulatief",
              colour: "lightBlue",
              format: "percentage",
              units: "van aantal besluiten",
            },
            {
              label: "afgerond",
              column: "ims_kj_bezwaren_afgerond_cumulatief",
              colour: "moss",
              units: "afgerond",
            },
            {
              label: "in beh.",
              column: "ims_kj_bezwaren_voorraad_cumulatief",
              colour: "orange",
              units: "in behandeling",
            },
          ],
        ],
      },
      {
        slug: "bezwaren_wd_wonen_numbers_v1",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        header: "Waardedaling: wonen",
        parameters: [
          [
            {
              label: "ingediend",
              column: "wd_wonen_bezwaren_ingediend_cumulatief",
              colour: "blue",
              units: "ingediend",
            },
            {
              label: "percentage",
              column: "wd_wonen_bezwaren_percentage_cumulatief",
              colour: "lightBlue",
              format: "percentage",
              units: "van aantal besluiten",
            },
            {
              label: "afgerond",
              column: "wd_wonen_bezwaren_afgerond_cumulatief",
              colour: "moss",
              units: "afgerond",
            },
            {
              label: "in beh.",
              column: "wd_wonen_bezwaren_voorraad_cumulatief",
              colour: "orange",
              units: "in behandeling",
            },
          ],
        ],
      },
      {
        slug: "bezwaren_wd_nietwonen_numbers_v1",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        header: "Waardedaling: niet wonen",
        parameters: [
          [
            {
              label: "ingediend",
              column: "wd_nietwonen_bezwaren_ingediend_cumulatief",
              colour: "blue",
              units: "ingediend",
            },
            {
              label: "percentage",
              column: "wd_nietwonen_bezwaren_percentage_cumulatief",
              colour: "lightBlue",
              format: "percentage",
              units: "van aantal besluiten",
            },
            {
              label: "afgerond",
              column: "wd_nietwonen_bezwaren_afgerond_cumulatief",
              colour: "moss",
              units: "afgerond",
            },
            {
              label: "in beh.",
              column: "wd_nietwonen_bezwaren_voorraad_cumulatief",
              colour: "orange",
              units: "in behandeling",
            },
          ],
        ],
      },
      {
        slug: "bezwaren_wd_namco_numbers_v1",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        header: "Waardedaling: NAM tegemoetkoming",
        parameters: [
          [
            {
              label: "ingediend",
              column: "wd_namco_bezwaren_ingediend_cumulatief",
              colour: "blue",
              units: "ingediend",
            },
            {
              label: "percentage",
              column: "wd_namco_bezwaren_percentage_cumulatief",
              colour: "lightBlue",
              format: "percentage",
              units: "van aantal besluiten",
            },
            {
              label: "afgerond",
              column: "wd_namco_bezwaren_afgerond_cumulatief",
              colour: "moss",
              units: "afgerond",
            },
            {
              label: "in beh.",
              column: "wd_namco_bezwaren_voorraad_cumulatief",
              colour: "orange",
              units: "in behandeling",
            },
          ],
        ],
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["bezwaren_maandelijks", "bezwaren_wekelijks"],
    segment: {
      key: "mw_bezwaren_ingediend_cumulatief",
      cumulative: true,
      periodization: "weekly",
    },
  },
  {
    slug: "bezwaren_mw_pies",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "bezwaren_mw_taart_toegekend",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Toegekend",
              column: "maatwerk_bezwaren_toegekend_cumulatief",
              colour: "moss",
            },
            {
              label: "Afgewezen",
              column: "maatwerk_bezwaren_afgewezen_cumulatief",
              colour: "orange",
            },
            {
              label: "Anders afgerond",
              column: "maatwerk_bezwaren_anders_afgehandeld_cumulatief",
              colour: "blue",
            },
          ],
          [
            {
              label: "Totaal afgerond",
              column: "maatwerk_bezwaren_afgerond_cumulatief",
              colour: "gray",
            },
          ],
        ],
        segment: {
          key: "maatwerk_bezwaren_toegekend_cumulatief",
          cumulative: true,
          periodization: "monthly",
        },
      },
    ],
    header: "Maatwerk",
    functionality: ["table", "definitions", "download"],
    endpoints: ["bezwaren_maandelijks", "bezwaren_wekelijks"],
    segment: {
      key: "maatwerk_bezwaren_toegekend_cumulatief",
      cumulative: false,
      periodization: "none",
    },
  },
  {
    slug: "bezwaren_ves_pies",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "bezwaren_ves_taart_toegekend",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Toegekend",
              column: "vv_bezwaren_toegekend_cumulatief",
              colour: "moss",
            },
            {
              label: "Afgewezen",
              column: "vv_bezwaren_afgewezen_cumulatief",
              colour: "orange",
            },
            {
              label: "Anders afgerond",
              column: "vv_bezwaren_anders_afgehandeld_cumulatief",
              colour: "blue",
            },
          ],
          [
            {
              label: "Totaal afgerond",
              column: "vv_bezwaren_afgerond_cumulatief",
              colour: "gray",
            },
          ],
        ],
        segment: {
          key: "vv_bezwaren_toegekend_cumulatief",
          cumulative: true,
          periodization: "monthly",
        },
      },
    ],
    header: "Vaste vergoedingen",
    functionality: ["table", "definitions", "download"],
    endpoints: ["bezwaren_maandelijks", "bezwaren_wekelijks"],
    segment: {
      key: "vv_bezwaren_toegekend_cumulatief",
      cumulative: false,
      periodization: "none",
    },
  },
  {
    slug: "bezwaren_ims_volw_pies",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "bezwaren_ims_volw_taart_toegekend",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Toegekend",
              column: "ims_volw_bezwaren_toegekend_cumulatief",
              colour: "moss",
            },
            {
              label: "Afgewezen",
              column: "ims_volw_bezwaren_afgewezen_cumulatief",
              colour: "orange",
            },
            {
              label: "Anders afgerond",
              column: "ims_volw_bezwaren_anders_afgehandeld_cumulatief",
              colour: "blue",
            },
          ],
          [
            {
              label: "Totaal afgerond",
              column: "ims_volw_bezwaren_afgerond_cumulatief",
              colour: "gray",
            },
          ],
        ],
        segment: {
          key: "ims_volw_bezwaren_toegekend_cumulatief",
          cumulative: true,
          periodization: "monthly",
        },
      },
    ],
    header: "Immateriele schade: volwassenen",
    functionality: ["table", "definitions", "download"],
    endpoints: ["bezwaren_maandelijks", "bezwaren_wekelijks"],
    segment: {
      key: "ims_volw_bezwaren_toegekend_cumulatief",
      cumulative: false,
      periodization: "none",
    },
  },
  {
    slug: "bezwaren_ims_kj_pies",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "bezwaren_ims_kj_taart_toegekend",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Toegekend",
              column: "ims_kj_bezwaren_toegekend_cumulatief",
              colour: "moss",
            },
            {
              label: "Afgewezen",
              column: "ims_kj_bezwaren_afgewezen_cumulatief",
              colour: "orange",
            },
            {
              label: "Anders afgerond",
              column: "ims_kj_bezwaren_anders_afgehandeld_cumulatief",
              colour: "blue",
            },
          ],
          [
            {
              label: "Totaal afgerond",
              column: "ims_kj_bezwaren_afgerond_cumulatief",
              colour: "gray",
            },
          ],
        ],
        segment: {
          key: "ims_kj_bezwaren_toegekend_cumulatief",
          cumulative: true,
          periodization: "monthly",
        },
      },
    ],
    header: "Immateriele schade: kinderen en jongeren",
    functionality: ["table", "definitions", "download"],
    endpoints: ["bezwaren_maandelijks", "bezwaren_wekelijks"],
    segment: {
      key: "ims_kj_bezwaren_toegekend_cumulatief",
      cumulative: false,
      periodization: "none",
    },
  },
  {
    slug: "bezwaren_wd_wonen_pies",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "bezwaren_wd_wonen_taart_toegekend",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Toegekend",
              column: "wd_wonen_bezwaren_toegekend_cumulatief",
              colour: "moss",
            },
            {
              label: "Afgewezen",
              column: "wd_wonen_bezwaren_afgewezen_cumulatief",
              colour: "orange",
            },
            {
              label: "Anders afgerond",
              column: "wd_wonen_bezwaren_anders_afgehandeld_cumulatief",
              colour: "blue",
            },
          ],
          [
            {
              label: "Totaal afgerond",
              column: "wd_wonen_bezwaren_afgerond_cumulatief",
              colour: "gray",
            },
          ],
        ],
        segment: {
          key: "wd_wonen_bezwaren_toegekend_cumulatief",
          cumulative: true,
          periodization: "monthly",
        },
      },
    ],
    header: "Waardedaling: wonen",
    functionality: ["table", "definitions", "download"],
    endpoints: ["bezwaren_maandelijks", "bezwaren_wekelijks"],
    segment: {
      key: "wd_wonen_bezwaren_toegekend_cumulatief",
      cumulative: false,
      periodization: "none",
    },
  },
  {
    slug: "bezwaren_wd_nietwonen_pies",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "bezwaren_wd_nietwonen_taart_toegekend",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Toegekend",
              column: "wd_nietwonen_bezwaren_toegekend_cumulatief",
              colour: "moss",
            },
            {
              label: "Afgewezen",
              column: "wd_nietwonen_bezwaren_afgewezen_cumulatief",
              colour: "orange",
            },
            {
              label: "Anders afgerond",
              column: "wd_nietwonen_bezwaren_anders_afgehandeld_cumulatief",
              colour: "blue",
            },
          ],
          [
            {
              label: "Totaal afgerond",
              column: "wd_nietwonen_bezwaren_afgerond_cumulatief",
              colour: "gray",
            },
          ],
        ],
        segment: {
          key: "wd_nietwonen_bezwaren_toegekend_cumulatief",
          cumulative: true,
          periodization: "monthly",
        },
      },
    ],
    header: "Waardedaling: niet wonen",
    functionality: ["table", "definitions", "download"],
    endpoints: ["bezwaren_maandelijks", "bezwaren_wekelijks"],
    segment: {
      key: "wd_nietwonen_bezwaren_toegekend_cumulatief",
      cumulative: false,
      periodization: "none",
    },
  },
  {
    slug: "bezwaren_wd_namco_pies",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "bezwaren_wd_namco_taart_toegekend",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Toegekend",
              column: "wd_namco_bezwaren_toegekend_cumulatief",
              colour: "moss",
            },
            {
              label: "Afgewezen",
              column: "wd_namco_bezwaren_afgewezen_cumulatief",
              colour: "orange",
            },
            {
              label: "Anders afgerond",
              column: "wd_namco_bezwaren_anders_afgehandeld_cumulatief",
              colour: "blue",
            },
          ],
          [
            {
              label: "Totaal afgerond",
              column: "wd_namco_bezwaren_afgerond_cumulatief",
              colour: "gray",
            },
          ],
        ],
        segment: {
          key: "wd_namco_bezwaren_toegekend_cumulatief",
          cumulative: true,
          periodization: "monthly",
        },
      },
    ],
    header: "Waardedaling: NAM tegemoetkoming",
    functionality: ["table", "definitions", "download"],
    endpoints: ["bezwaren_maandelijks", "bezwaren_wekelijks"],
    segment: {
      key: "wd_namco_bezwaren_toegekend_cumulatief",
      cumulative: false,
      periodization: "none",
    },
  },
];

export default bezwaren;
