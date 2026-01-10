import { IGroupMappingV2 } from "../shared/interfaces";

const mappings: IGroupMappingV2[] = [
  {
    slug: "all_totals",
    ctrlr: "DefaultGroupV1",
    filters: ["totaalVsRecent"],
    graphs: [
      {
        slug: "all_total_numbers",
        ctrlr: "NumbersV1",
        
        args: [],
        parameters: [
          [
            {
              label: "Aanvragen",
              column: "all_ingediend",
              colour: "orange",
              units: "aanvragen",
            },
            {
              label: "Afgehandeld",
              column: "all_afgerond",
              colour: "moss",
              units: "afgehandeld",
            },
            // {
            //   label: "Verleend",
            //   column: "all_bedrag_verleende_schade_cumulatief",
            //   colour: "blue",
            //   format: "currency",
            //   units: "verleende schade",
            // },
            {
              label: "Uitbetaald",
              column: "all_bedrag_betaald_totaal",
              colour: "blue",
              format: "currency",
              units: "totaal uitbetaalde bedrag",
            },
          ],
          [],
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
          key: "all_ingediend_cumulatief",
          cumulative: true,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "all_ingediend_cumulatief",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["all_wekelijks", "all_maandelijks"],
  },
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
              column: "doorlopend_cijfer",
              colour: "orange",
              format: "decimals",
            },
          ],
          [
            {
              label: "Totaal respondenten",
              column: "aantal_respondenten",
              units: "respondenten sinds start",
              colour: "orange",
            },
          ],
        ],
        segment: {
          key: "doorlopend_cijfer",
          cumulative: false,
          periodization: "latest",
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
              column: "maandcijfer",
              colour: "orange",
              format: "decimals",
            },
          ],
          [
            {
              label: "Aantal nieuwe respondenten",
              column: "aantal_respondenten_maand",
              colour: "orange",
              units: "respondenten",
            },
          ],
        ],
        modifiers: [],
        segment: {
          key: "maandcijfer",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "maandcijfer",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["tevredenheid"],
  },
  {
    slug: "all_regelingen_overzicht",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "reg_makeup_trend",
        ctrlr: "BarTrendStackedMakeup",
        args: [],
        filters: ["mappingGroupSelect", "cumulativeVsDelta"],
        parameters: [
          [
            {
              label: "Waardedalingsregeling",
              column: "wd_ingediend",
              colour: "moss",
            },
            {
              label: "Immateriele schade",
              column: "ims_ingediend",
              colour: "blue",
            },
            {
              label: "Fysieke schade",
              column: "fs_ingediend",
              colour: "orange",
            },
          ],
          [
            {
              label: "Waardedalingsregeling",
              column: "wd_afgerond",
              colour: "moss",
            },
            {
              label: "Immateriele schade",
              column: "ims_afgerond",
              colour: "blue",
            },
            {
              label: "Fysieke schade",
              column: "fs_afgerond",
              colour: "orange",
            },
          ],
          [
            {
              label: "Waardedalingsregeling",
              column: "wd_bedrag_betaald_totaal",
              colour: "moss",
              format: "currency",
            },
            {
              label: "Immateriele schade",
              column: "ims_bedrag_betaald_totaal",
              colour: "blue",
              format: "currency",
            },
            {
              label: "Fysieke schade",
              column: "fs_bedrag_betaald_totaal",
              colour: "orange",
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
          key: "wd_ingediend",
          cumulative: false,
          periodization: "monthly",
          parameterIndex: 0,
        },
      },
    ],
    segment: {
      key: "wd_ingediend",
      cumulative: false,
      periodization: "weekly",
      parameterIndex: 0,
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["all_wekelijks", "all_maandelijks"],
  },
  {
    slug: "all_vergelijk",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "vergelijk_numbers",
        ctrlr: "NumbersV1",
        args: [],
        header: "Fysieke schade: maatwerk",
        parameters: [
          [
            {
              label: "Duur",
              column: "mw_mediaan_dagen",
              colour: "orange",
              units: "mediaan dagen tot besluit",
            },
            {
              label: "Toekenningspercentage",
              column: "mw_toegekend_percentage_cumulatief",
              colour: "moss",
              format: "percentage",
              units: "toegekend",
            },
            {
              label: "Bezwaarpercentage",
              column: "mw_bezwaar_percentage_cumulatief",
              colour: "blue",
              format: "percentage",
              units: "bezwaar gemaakt",
            },
            {
              label: "Waardering",
              column: "mw_waardering",
              colour: "purple",
              format: "decimals",
              units: "waardering",
            },
          ],
          [],
        ],
        segment: {
          key: "mw_mediaan_dagen",
          cumulative: false,
          periodization: "weekly",
        },
      },
      {
        slug: "vergelijk_numbers",
        ctrlr: "NumbersV1",
        args: [],
        header: "Fysieke schade: vaste vergoeding",
        parameters: [
          [
            {
              label: "Duur",
              column: "vv_mediaan_dagen",
              colour: "orange",
              units: "mediaan dagen tot besluit",
            },
            {
              label: "Toekenningspercentage",
              column: "vv_toegekend_percentage_cumulatief",
              colour: "moss",
              format: "percentage",
              units: "toegekend",
            },
            {
              label: "Bezwaarpercentage",
              column: "vv_bezwaar_percentage_cumulatief",
              colour: "blue",
              format: "percentage",
              units: "bezwaar gemaakt",
            },
            {
              label: "Waardering",
              column: "vv_waardering",
              colour: "purple",
              format: "decimals",
              units: "waardering",
            },
          ],
          [],
        ],
        segment: {
          key: "vv_mediaan_dagen",
          cumulative: false,
          periodization: "weekly",
        },
      },
      {
        slug: "vergelijk_numbers",
        ctrlr: "NumbersV1",
        args: [],
        header: "Immateriele schade: volwassenen",
        parameters: [
          [
            {
              label: "Duur",
              column: "ims_volw_mediaan_dagen",
              colour: "orange",
              units: "mediaan dagen tot besluit",
            },
            {
              label: "Toekenningspercentage",
              column: "ims_volw_toegekend_percentage_cumulatief",
              colour: "moss",
              format: "percentage",
              units: "toegekend",
            },
            {
              label: "Bezwaarpercentage",
              column: "ims_volw_bezwaar_percentage_cumulatief",
              colour: "blue",
              format: "percentage",
              units: "bezwaar gemaakt",
            },
            {
              label: "Waardering",
              column: "ims_volw_waardering",
              colour: "purple",
              format: "decimals",
              units: "waardering",
            },
          ],
          [],
        ],
        segment: {
          key: "ves_mediaan_dagen",
          cumulative: false,
          periodization: "weekly",
        },
      },
      {
        slug: "vergelijk_numbers",
        ctrlr: "NumbersV1",
        args: [],
        header: "Immateriele schade: kinderen en jongeren ",
        parameters: [
          [
            {
              label: "Duur",
              column: "ims_kj_mediaan_dagen",
              colour: "orange",
              units: "mediaan dagen tot besluit",
            },
            {
              label: "Toekenningspercentage",
              column: "ims_kj_toegekend_percentage_cumulatief",
              colour: "moss",
              format: "percentage",
              units: "toegekend",
            },
            {
              label: "Bezwaarpercentage",
              column: "ims_kj_bezwaar_percentage_cumulatief",
              colour: "blue",
              format: "percentage",
              units: "bezwaar gemaakt",
            },
            {
              label: "Waardering",
              column: "ims_kj_waardering",
              colour: "purple",
              format: "decimals",
              units: "waardering",
            },
          ],
          [],
        ],
        segment: {
          key: "ims_kj_mediaan_dagen",
          cumulative: false,
          periodization: "weekly",
        },
      },
      {
        slug: "vergelijk_numbers",
        ctrlr: "NumbersV1",
        args: [],
        header: "Waardedaling: wonen",
        parameters: [
          [
            {
              label: "Duur",
              column: "wdw_mediaan_dagen",
              colour: "orange",
              units: "mediaan dagen tot besluit",
            },
            {
              label: "Toekenningspercentage",
              column: "wdw_toegekend_percentage_cumulatief",
              colour: "moss",
              format: "percentage",
              units: "toegekend",
            },
            {
              label: "Bezwaarpercentage",
              column: "wdw_bezwaar_percentage_cumulatief",
              colour: "blue",
              format: "percentage",
              units: "bezwaar gemaakt",
            },
            {
              label: "Waardering",
              column: "wdw_waardering",
              colour: "purple",
              format: "decimals",
              units: "waardering",
            },
          ],
          [],
        ],
        segment: {
          key: "wdw_mediaan_dagen",
          cumulative: false,
          periodization: "weekly",
        },
      },{
        slug: "vergelijk_numbers",
        ctrlr: "NumbersV1",
        args: [],
        header: "Waardedaling: niet wonen",
        parameters: [
          [
            {
              label: "Duur",
              column: "wdnw_mediaan_dagen",
              colour: "orange",
              units: "mediaan dagen tot besluit",
            },
            {
              label: "Toekenningspercentage",
              column: "wdnw_toegekend_percentage_cumulatief",
              colour: "moss",
              format: "percentage",
              units: "toegekend",
            },
            {
              label: "Bezwaarpercentage",
              column: "wdnw_bezwaar_percentage_cumulatief",
              colour: "blue",
              format: "percentage",
              units: "bezwaar gemaakt",
            },
            {
              label: "Waardering",
              column: "wdnw_waardering",
              colour: "purple",
              format: "decimals",
              units: "waardering",
            },
          ],
          [],
        ],
        segment: {
          key: "wdnw_mediaan_dagen",
          cumulative: false,
          periodization: "weekly",
        },
      },
    ],
    segment: {
      key: "wdnw_mediaan_dagen",
      cumulative: false,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["all_wekelijks", "all_maandelijks", "tevredenheid"], // beter apart eindpunt maken 
  },
];

export default mappings;
