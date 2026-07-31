
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
    "regelingen?aggregatie=eq.maand&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&order=periode.desc",
    "regelingen?aggregatie=eq.week&domein_code=eq.FYSIEK&regeling_code=eq.Totaal&order=periode.desc&periode_vanaf=gte.{VANAF}",
  ],
  groups: [
  {
    slug: "fs_totals",
    ctrlr: "DefaultGroupV1",
    filters: ["cumulativeVsDelta"],
    graphs: [
      {
        slug: "fs_numbers_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Ingediend",
              column: "ingediend",
              colour: "orange",
              units: "ingediend",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Voorraad",
              column: "voorraad",
              colour: "purple",
              units: "voorraad",
              modifiers: { cumul: "_cumul", delta: "_verschil" },
            },
            {
              label: "Afgehandeld",
              column: "afgerond",
              colour: "moss",
              units: "afgehandeld",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
          ],
          [],
        ],
        segment: {
          key: "ingediend",
          cumulative: true,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "ingediend",
      cumulative: true,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: [],
  },
  // bedragen
  {
    slug: "fs_bedragen",
    ctrlr: "DefaultGroupV1",
    filters: ["cumulativeVsDelta", "weekVsMonth"],
    graphs: [
      {
        slug: "fs_totaal_numbers_2",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            // {
            //   label: "beschikte schade",
            //   column: "fysiek_bedrag_beschikt_schade",
            //   colour: "blue",
            //   format: "currency",
            //   units: "beschikt schadebedrag",
            // },
            // {
            //   label: "beschikt totaal",
            //   column: "fysiek_bedrag_beschikt_totaal",
            //   colour: "blue",
            //   format: "currency",
            //   units: "beschikt totaalbedrag",
            // },
            // {
            //   label: "betaalde schade",
            //   column: "fysiek_bedrag_betaald_schade",
            //   colour: "moss",
            //   format: "currency",
            //   units: "uitbetaald schadebedrag",
            // },
            {
              label: "betaald totaal",
              column: "bedrag_betaald_totaal",
              colour: "blue",
              format: "currency",
              units: "betaald totaalbedrag",
              modifiers: { cumul: "_cumul_eur", delta: "_eur" }
            },
          ],
          [],
        ],
        segment: {
          key: "fysiek_bedrag_betaald_totaal",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "fs_bedragen_trend",
        ctrlr: "BarTrendBedragenV1",
        args: [],
        filters: [],
        parameters: [
          [
            {
              label: "Maand cijfer",
              column: "bedrag_betaald_totaal",
              colour: "blue",
              format: "decimals",
              modifiers: { cumul: "_cumul_eur", delta: "_eur" }
            },
          ],
        ],
        segment: {
          key: "fysiek_bedrag_betaald_totaal",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    segment: {
      key: "fysiek_bedrag_betaald_totaal",
      cumulative: true,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: [],
  },
  // // keuzes
  {
    slug: "fs_keuzepaden",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "fs_peag_afgerond",
        ctrlr: "SegmentsV1",
        args: [],
        filters: ["cumulativeVsDelta"],
        header: "Sinds maatregelen n.a.v. parlementaire enquete",
        parameters: [
          [
            {
              label: "Maatwerk (MW)",
              column: "toegekend_mv",
              colour: "blue",
              units: "toegekend als maatwerk",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Vaste Vergoeding (VES)",
              column: "toegekend_ves",
              colour: "orange",
              units: "toegekend als vaste vergoeding",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Aanvullende Vaste vergoeding (AVV)",
              column:"toegekend_avv",
              colour: "yellow",
              units: "toegekend als aanvullende vaste vergoeding",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Herstel Eigen Aannemer (HEA)",
              column: "toegekend_hea",
              colour: "moss",
              units: "toegekend als herstel eigen aannemer",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "Herstel Aannemer Instituut (HAI)",
              column: "toegekend_hai",
              colour: "purple",
              units: "toegekend als herstel aannemer instituut",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
          ],
          [],
        ],
        segment: {
          key: "toegekend_mv_cumul",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "fs_makeup_trend",
        ctrlr: "BarTrendStackedMakeup",
        args: [],
        filters: ["cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "MW",
              column: "toegekend_mv",
              colour: "blue",
              units: "toegekend als maatwerk",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "VES",
              column: "toegekend_ves",
              colour: "orange",
              units: "toegekend als vaste vergoeding",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "AVV",
              column: "toegekend_avv",
              colour: "yellow",
              units: "toegekend als aanvullende vaste vergoeding",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "HEA",
              column: "toegekend_hai",
              colour: "moss",
              units: "toegekend als herstel eigen aannemer",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
            {
              label: "HAI",
              column: "toegekend_hea",
              colour: "purple",
              units: "toegekend als herstel aannemer instituut",
              modifiers: { cumul: "_cumul", delta: "_aantal" },
            },
          ],
          [],
        ],
        segment: {
          key: "toegekend_mv_cumul",
          cumulative: false,
          periodization: "monthly",
          label: "toegekende zaken",
        },
      },
    ],
    segment: {
      key: "toegekend_mv_cumul",
      cumulative: true,
      periodization: "weekly",
      label: "toegekende zaken",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: [],
  },
]};

export default pageConfig;

