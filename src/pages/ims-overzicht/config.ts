import type { IPageConfig } from "../../shared/interfaces";

const DOMEIN_CODE = "IMS";
const REGELING_CODE = "Totaal";

const pageConfig: IPageConfig = {
  slug: "ims-overzicht",
  segment: {
    key: "",
    gemeente: "all",
    periodization: "monthly",
    cumulative: false,
    vanaf: "2025-01-01"
  },
  filters: ["vanaf"],
  endpoints: [
    `regelingen?aggregatie=eq.week&domein_code=eq.${DOMEIN_CODE}&regeling_code=eq.${REGELING_CODE}&periode_vanaf=gte.{VANAF}&order=periode.desc`,
    `regelingen?aggregatie=eq.maand&domein_code=eq.${DOMEIN_CODE}&regeling_code=eq.${REGELING_CODE}&order=periode.desc`,
  ],
  groups: [
  // intro
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
              column: "ingediend",
              colour: "orange",
              units: "aanvragen",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Voorraad",
              column: "voorraad",
              colour: "purple",
              units: "aanvragen in werkvoorraad",
              modifiers: { cumul: "_cumul", delta: "_verschil" },
            },
            {
              label: "Afgehandeld",
              column: "afgerond",
              colour: "moss",
              units: "afgeronde aanvragen",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
          ],
          [],
        ],
        segment: {
          key: "ingediend",
          cumulative: true,
          periodization: "weekly",
        },
      },
    ],
    segment: {
      key: "ingediend",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: [],
  },
  // bedragen
  {
    slug: "ims_totaal_bedragen",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "ims_totaal_numbers_2",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            // {
            //   label: "beschikte schade",
            //   column: "bedrag_beschikt_schade",
            //   colour: "blue",
            //   format: "currency",
            //   units: "beschikt schadebedrag",
            // },
            // {
            //   label: "beschikt totaal",
            //   column: "bedrag_beschikt_totaal",
            //   colour: "blue",
            //   format: "currency",
            //   units: "beschikt totaalbedrag",
            // },
            // {
            //   label: "betaalde schade",
            //   column: "bedrag_betaald_schade",
            //   colour: "moss",
            //   format: "currency",
            //   units: "betaald schadebedrag",
            // },
            {
              label: "betaald totaal",
              column: "bedrag_betaald_totaal",
              colour: "blue",
              format: "currency",
              units: "betaald totaalbedrag",
              modifiers: { cumul: "_cumul_eur", delta: "_eur" },
            },
          ],
          [],
        ],
        segment: {
          key: "bedrag_betaald_totaal",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "ims_totaal_bedragen_trend",
        ctrlr: "BarTrendBedragenV1",
        args: [],
        filters: ["cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "Totaal betaald bedrag",
              column: "bedrag_betaald_totaal",
              colour: "blue",
              format: "currency",
              modifiers: { cumul: "_cumul_eur", delta: "_eur" },
            },
          ],
        ],
        segment: {
          key: "bedrag_betaald_totaal",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "bedrag_betaald_totaal",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: [],
  },
  // waardering
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
  // keuzepaden — commented out: volw/kj sub-population columns do not exist in the
  // regelingen view (regeling_code=eq.IMS has no ims_volw_*/ims_kj_* columns).
  // This group needs a separate data source before it can be migrated.
        // {
        // slug: "ims_totaal_keuzepaden",
        // ctrlr: "DefaultGroupV1",
        // graphs: [
        // {
        // slug: "ims_totaal_numbers_volw",
        // ctrlr: "NumbersV1",
        // args: [],
        // filters: [],
        // header: "Volwassenen",
        // parameters: [
        // [
        // {
        // label: "Ingediend",
        // column: "volw_ingediend",
        // colour: "blue",
        // units: "aanvragen",
        // modifiers: { cumul: "_cumul", delta: "_aantal" },
        // },
        // {
        // label: "Afgehandeld",
        // column: "volw_afgerond",
        // colour: "blue",
        // units: "afgehandeld",
        // modifiers: { cumul: "_cumul", delta: "_aantal" },
        // },
        // {
        // label: "Betaald bedrag",
        // column: "volw_bedrag_betaald_totaal",
        // colour: "blue",
        // units: "betaald bedrag",
        // format: "currency",
        // modifiers: { cumul: "_cumul", delta: "_eur" },
        // },
        // ],
        // [],
        // ],
        // segment: {
        // key: "volw_ingediend",
        // cumulative: true,
        // periodization: "weekly",
        // },
        // },
        // {
        // slug: "ims_totaal_numbers_kj",
        // ctrlr: "NumbersV1",
        // args: [],
        // filters: [],
        // header: "Kinderen en jongeren",
        // parameters: [
        // [
        // {
        // label: "Ingediend",
        // column: "kj_ingediend",
        // colour: "orange",
        // units: "aanvragen",
        // modifiers: { cumul: "_cumul", delta: "_aantal" },
        // },
        // {
        // label: "Afgehandeld",
        // column: "kj_afgerond",
        // colour: "orange",
        // units: "afgehandeld",
        // modifiers: { cumul: "_cumul", delta: "_aantal" },
        // },
        // {
        // label: "Verleende schade",
        // column: "kj_bedrag_betaald_totaal",
        // colour: "orange",
        // units: "betaald bedrag",
        // format: "currency",
        // modifiers: { cumul: "_cumul", delta: "_eur" },
        // },
        // ],
        // [],
        // ],
        // segment: {
        // key: "kj_ingediend",
        // cumulative: true,
        // periodization: "weekly",
        // },
        // },
        // {
        // slug: "ims_totaal_makeup_trend",
        // ctrlr: "BarTrendStackedMakeup",
        // args: [],
        // filters: ["mappingGroupSelect", "cumulativeVsDelta", "weekVsMonth"],
        // parameters: [
        // [
        // {
        // label: "Volwassenen",
        // column: "volw_ingediend",
        // colour: "blue",
        // units: "aanvragen",
        // excludeFromTable: true,
        // modifiers: { cumul: "_cumul", delta: "_aantal" },
        // },
        // {
        // label: "Kinderen en jongeren",
        // column: "kj_ingediend",
        // colour: "orange",
        // units: "aanvragen",
        // excludeFromTable: true,
        // modifiers: { cumul: "_cumul", delta: "_aantal" },
        // },
        // ],
        // [
        // {
        // label: "Volwassenen",
        // column: "volw_afgerond",
        // colour: "blue",
        // units: "afgehandeld",
        // excludeFromTable: true,
        // modifiers: { cumul: "_cumul", delta: "_aantal" },
        // },
        // {
        // label: "Kinderen en jongeren",
        // column: "kj_afgerond",
        // colour: "orange",
        // units: "afgehandeld",
        // excludeFromTable: true,
        // modifiers: { cumul: "_cumul", delta: "_aantal" },
        // },
        // ],
        // ],
        // segment: {
        // key: "volw_afgerond",
        // cumulative: false,
        // periodization: "monthly",
        // parameterIndex: 0,
        // },
        // },
        // ],
        // segment: {
        // key: "volw_afgerond",
        // cumulative: true,
        // periodization: "weekly",
        // },
        // functionality: ["table", "definitions", "download"],
        // endpoints: [
        // "regelingen?aggregatie=eq.week&regeling_code=eq.IMS&order=periode.desc",                                                                                                                                                                   
        // "regelingen?aggregatie=eq.week&regeling_code=eq.IMK&order=periode.desc", 
        // "regelingen?aggregatie=eq.maand&regeling_code=eq.IMS&order=periode.desc",                                                                                                                                                                   
        // "regelingen?aggregatie=eq.maand&regeling_code=eq.IMK&order=periode.desc",     
        // ],
        // },
],
};

export default pageConfig;