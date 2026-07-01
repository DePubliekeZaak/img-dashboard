
import type { IPageConfig } from "../../shared/interfaces";

const pageConfig: IPageConfig = {
  slug: "regelingen",
  segment: {
    key: "",
    gemeente: "all",
    periodization: "weekly",
    cumulative: false,
    vanaf: "2025-01-01"
  },
  filters: ["gemeenten","vanaf"],
  endpoints: [
    "regelingen?aggregatie=eq.maand&domein_code=eq.Totaal&regeling_code=eq.Totaal",
    "regelingen?aggregatie=eq.week&domein_code=eq.Totaal&regeling_code=eq.Totaal&order=periode.desc&periode_vanaf=gte.{VANAF}",
  ],
  groups: [
  // intro
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
              column: "ingediend",
              colour: "orange",
              units: "aanvragen",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Afgehandeld",
              column: "afgerond",
              colour: "moss",
              units: "afgehandeld",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Uitbetaald",
              column: "bedrag_betaald_totaal",
              colour: "blue",
              format: "currency",
              units: "totaal uitbetaalde bedrag",
              modifiers: { cumul: "_cumul_eur", delta: "_eur" },           
            }
          ],
          [],
        ],
        segment: {
          key: "ingediend_aantal",
          cumulative: true,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "ingediend_aantal",
      cumulative: true,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: [],
  },
  // waardering
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
 // overzicht
  {
    slug: "all_regelingen_overzicht",
    ctrlr: "DomainComparisonGroupV1",
    graphs: [
      {
        slug: "reg_makeup_trend",
        ctrlr: "BarTrendStackedMakeup",
        args: [],
        filters: ["mappingGroupSelect", "cumulativeVsDelta"], //
        parameters: [
          [
            {
              label: "Waardedalingsregeling",
              short: "WD",
              column: "wdl_ingediend",
              colour: "moss",
              modifiers: { cumul: "_cumul", delta: "_aantal" },  
            },
            {
              label: "Immateriele schade",
              short: "IMS",
              column: "ims_ingediend",
              colour: "blue",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Fysieke schade",
              short: "FS",
              column: "fs_ingediend",
              colour: "orange",
              modifiers: { cumul: "_cumul", delta: "_aantal" }, 
            },
          ],
          [
            {
              label: "Waardedalingsregeling",
              short: "WD",
              column: "wdl_afgerond",
              colour: "moss",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Immateriele schade",
              short: "IMS",
              column: "ims_afgerond",
              colour: "blue",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Fysieke schade",
              short: "FS",
              column: "fs_afgerond",
              colour: "orange",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
          ],
          [
            {
              label: "Waardedalingsregeling",
              short: "WD",
              column: "wdl_bedrag_betaald_totaal",
              colour: "moss",
              format: "currency",
              modifiers: { cumul: "_cumul_eur", delta: "_eur" },  
            },
            {
              label: "Immateriele schade",
              short: "IMS",
              column: "ims_bedrag_betaald_totaal",
              colour: "blue",
              format: "currency",
              modifiers: { cumul: "_cumul_eur", delta: "_eur" },  
            },
            {
              label: "Fysieke schade",
              short: "FS",
              column: "fs_bedrag_betaald_totaal",
              colour: "orange",
              format: "currency",
              modifiers: { cumul: "_cumul_eur", delta: "_eur" },  
            },
          ],
        ],
        segment: {
          key: "wdl_ingediend_aantal",
          cumulative: false,
          periodization: "monthly",
          parameterIndex: 0,
        },
      },
    ],
    segment: {
      key: "wdl_ingediend_aantal",
      cumulative: false,
      periodization: "monthly",
      parameterIndex: 0,
    },
    functionality: ["table", "definitions", "download"],
    endpoints: [
      // 'regelingen?aggregatie=eq.week&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&select=periode%2caggregatie%2cingediend_aantal%2cingediend_cumul%2cafgerond_aantal%2cafgerond_cumul%2cbedrag_betaald_totaal_cumul_eur%2cbedrag_betaald_totaal_eur&order=periode.desc&periode_vanaf=gte.{VANAF}',
      'regelingen?aggregatie=eq.maand&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cingediend_aantal%2cingediend_cumul%2cafgerond_aantal%2cafgerond_cumul%2cbedrag_betaald_totaal_cumul_eur%2cbedrag_betaald_totaal_eur&order=periode.desc',
      // 'regelingen?aggregatie=eq.week&domein_code=eq.IMS&regeling_code=eq.Totaal&select=periode%2caggregatie%2cingediend_aantal%2cingediend_cumul%2cafgerond_aantal%2cafgerond_cumul%2cbedrag_betaald_totaal_cumul_eur%2cbedrag_betaald_totaal_eur&order=periode.desc&periode_vanaf=gte.{VANAF}',
      'regelingen?aggregatie=eq.maand&domein_code=eq.IMS&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cingediend_aantal%2cingediend_cumul%2cafgerond_aantal%2cafgerond_cumul%2cbedrag_betaald_totaal_cumul_eur%2cbedrag_betaald_totaal_eur&order=periode.desc',
      // 'regelingen?aggregatie=eq.week&domein_code=eq.WDL&regeling_code=eq.Totaal&select=periode%2caggregatie%2cingediend_aantal%2cingediend_cumul%2cafgerond_aantal%2cafgerond_cumul%2cbedrag_betaald_totaal_cumul_eur%2cbedrag_betaald_totaal_eur&order=periode.desc&periode_vanaf=gte.{VANAF}',
      'regelingen?aggregatie=eq.maand&domein_code=eq.WDL&regeling_code=eq.Totaal&select=periode%2cperiode_vanaf%2cperiode_totenmet%2caggregatie%2cingediend_aantal%2cingediend_cumul%2cafgerond_aantal%2cafgerond_cumul%2cbedrag_betaald_totaal_cumul_eur%2cbedrag_betaald_totaal_eur&order=periode.desc'
    ],
  },
  // vergelijk
  {
    slug: "all_vergelijk",
    ctrlr: "ComparisonGroupV1",
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
              column: "mw_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "mediaan dagen tot besluit",
            },
            {
              label: "Toekenningspercentage",
              column: "mw_toegekend_cumul_perc",
              colour: "moss",
              format: "percentage",
              units: "toegekend",
            },
            {
              label: "Bezwaarpercentage",
              column: "mw_bz_vertraagd_jaar_perc",
              colour: "blue",
              format: "percentage",
              units: "bezwaar gemaakt",
            },
            {
              label: "Waardering",
              column: "fysieke_schade_doorlopend_cijfer",
              colour: "purple",
              format: "decimals",
              units: "waardering",
            },
          ],
          [],
        ],
        segment: {
          key: "mw_dlt_gerealiseerd_mediaan_dagen",
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
              column: "vv_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "mediaan dagen tot besluit",
            },
            {
              label: "Toekenningspercentage",
              column: "vv_toegekend_cumul_perc",
              colour: "moss",
              format: "percentage",
              units: "toegekend",
            },
            {
              label: "Bezwaarpercentage",
              column: "vv_bz_vertraagd_jaar_perc",
              colour: "blue",
              format: "percentage",
              units: "bezwaar gemaakt",
            },
            {
              label: "Waardering",
              column: "ves_doorlopend_cijfer",
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
              column: "ims_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "mediaan dagen tot besluit",
            },
            {
              label: "Toekenningspercentage",
              column: "ims_toegekend_cumul_perc",
              colour: "moss",
              format: "percentage",
              units: "toegekend",
            },
            {
              label: "Bezwaarpercentage",
              column: "ims_bz_vertraagd_jaar_perc",
              colour: "blue",
              format: "percentage",
              units: "bezwaar gemaakt",
            },
            {
              label: "Waardering",
              column: "ims_doorlopend_cijfer",
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
        header: "Immateriele schade: kinderen en jongeren ",
        parameters: [
          [
            {
              label: "Duur",
              column: "imk_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "mediaan dagen tot besluit",
            },
            {
              label: "Toekenningspercentage",
              column: "imk_toegekend_cumul_perc",
              colour: "moss",
              format: "percentage",
              units: "toegekend",
            },
            {
              label: "Bezwaarpercentage",
              column: "imk_bz_vertraagd_jaar_perc",
              colour: "blue",
              format: "percentage",
              units: "bezwaar gemaakt",
            },
            {
              label: "Waardering",
              column: "imkj_doorlopend_cijfer",
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
        header: "Waardedaling: woningen",
        parameters: [
          [
            {
              label: "Duur",
              column: "wd_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "mediaan dagen tot besluit",
            },
            {
              label: "Toekenningspercentage",
              column: "wd_toegekend_cumul_perc",
              colour: "moss",
              format: "percentage",
              units: "toegekend",
            },
            {
              label: "Bezwaarpercentage",
              column: "wd_bz_vertraagd_jaar_perc",
              colour: "blue",
              format: "percentage",
              units: "bezwaar gemaakt",
            },
            {
              label: "Waardering",
              column: "waardedaling_doorlopend_cijfer",
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
      },
      {
        slug: "vergelijk_numbers",
        ctrlr: "NumbersV1",
        args: [],
        header: "Waardedaling: niet woningen",
        parameters: [
          [
            {
              label: "Mediaan",
              column: "wnw_dlt_gerealiseerd_mediaan_dagen",
              colour: "orange",
              units: "mediaan dagen tot besluit",
            },
            {
              label: "Toekenningspercentage",
              column: "wnw_toegekend_cumul_perc",
              colour: "moss",
              format: "percentage",
              units: "toegekend",
            },
            {
              label: "Bezwaarpercentage",
              column: "wnw_bz_vertraagd_jaar_perc",
              colour: "blue",
              format: "percentage",
              units: "bezwaar gemaakt",
            },
            {
              label: "Waardering",
              column: "waardedaling_doorlopend_cijfer",
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
      key: "mw_dlt_gerealiseerd_mediaan_dagen",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: [
      "regelingen?aggregatie=eq.week&regeling_code=eq.MW&order=periode.desc&limit=1",                                                                                                                                                                   
      "regelingen?aggregatie=eq.week&regeling_code=eq.VV&order=periode.desc&limit=1",   
      "regelingen?aggregatie=eq.week&regeling_code=eq.IMS&order=periode.desc&limit=1",                                                                                                                                                                  
      "regelingen?aggregatie=eq.week&regeling_code=eq.IMK&order=periode.desc&limit=1",                                                                                                                                                                 
      "regelingen?aggregatie=eq.week&regeling_code=eq.WD&order=periode.desc&limit=1",                                                                                                                                                                    
      "regelingen?aggregatie=eq.week&regeling_code=eq.WNW&order=periode.desc&limit=1",                                                                                                                                                                 
      "regelingen?aggregatie=eq.week&regeling_code=eq.NAMTEG&order=periode.desc&limit=1", 
      "tevredenheid"
    ], 
  },
  ]
}

export default pageConfig;


