import type { IPageConfig } from "../../shared/interfaces";

const DOMEIN_CODE = "WDL";
const REGELING_CODE = "Totaal";

const pageConfig: IPageConfig = {
  slug: "wd-overzicht",
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
    // ── intro ──
    {
      slug: "wdl_wd_intro",
      ctrlr: "DefaultGroupV1",
      filters: [],
      graphs: [
        {
          slug: "wdl_wd_numbers_v1",
          ctrlr: "NumbersMultiplesV1",
          args: [],
          filters: ["cumulativeVsDelta"],
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
            periodization: "weekly",
          },
        },
        {
          slug: "wdl_wd_trend",
          ctrlr: "BarTrendV1",
          args: [],
          filters: ["parameterSelect", "cumulativeVsDelta", "weekVsMonth"],
          parameters: [
            [
              {
                label: "Aanvragen",
                column: "ingediend",
                colour: "orange",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Afgehandeld",
                column: "afgerond",
                colour: "moss",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Voorraad",
                column: "voorraad",
                colour: "moss",
                modifiers: { cumul: "_cumul", delta: "_verschil" },
              },
            ],
          ],
          segment: {
            key: "ingediend",
            cumulative: false,
            periodization: "monthly",
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
    // ── bedragen ──
    {
      slug: "wdl_wd_bedragen",
      ctrlr: "DefaultGroupV1",
      filters: ["cumulativeVsDelta", "weekVsMonth"],
      graphs: [
        {
          slug: "fs_wdl_wd_numbers_2",
          ctrlr: "NumbersV1",
          args: [],
          filters: [],
          multiples: "cumulative",
          parameters: [
            [
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
          slug: "wdl_wd_bedragen_trend",
          ctrlr: "BarTrendBedragenV1",
          args: [],
          filters: [],
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
        periodization: "monthly",
      },
      functionality: ["table", "definitions", "download"],
      endpoints: [],
    },
    // ── waardering ──
    {
      slug: "wdl_wd_waardering",
      ctrlr: "KTOGroupV1",
      graphs: [
        {
          slug: "wdl_wd_waardering_numbers",
          ctrlr: "NumbersPlusRespondentsV1",
          args: [],
          parameters: [
            [
              {
                label: "Sinds start",
                column: "waardedaling_doorlopend_cijfer",
                colour: "orange",
                format: "decimals",
              },
            ],
            [
              {
                label: "Totaal respondenten",
                column: "waardedaling_aantal_respondenten_doorlopend",
                units: "respondenten sinds start",
                colour: "orange",
              },
            ],
          ],
        },
        {
          slug: "wdl_wd_waardering_trend",
          ctrlr: "BarTrendKTOV1",
          args: [],
          filters: [],
          parameters: [
            [
              {
                label: "Maand cijfer",
                column: "waardedaling_maandcijfer",
                colour: "orange",
                format: "decimals",
              },
            ],
            [
              {
                label: "Aantal nieuwe respondenten",
                column: "waardedaling_aantal_respondenten",
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
        key: "waardedaling_maandcijfer",
        cumulative: false,
        periodization: "monthly",
      },
    },
    // ── varianten ──
    {
      slug: "wd_totaal_varianten",
      ctrlr: "RegelingComparisonGroupV1",
      graphs: [
        {
          slug: "wd_numbers_woningen",
          ctrlr: "NumbersV1",
          args: [],
          filters: [],
          header: "Woningen",
          parameters: [
            [
              {
                label: "Ingediend",
                column: "wd_ingediend",
                colour: "blue",
                units: "aanvragen",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Afgehandeld",
                column: "wd_afgerond",
                colour: "blue",
                units: "afgehandeld",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Betaald bedrag",
                column: "wd_bedrag_betaald_totaal",
                colour: "blue",
                units: "betaald bedrag",
                format: "currency",
                modifiers: { cumul: "_cumul_eur", delta: "_eur" },
              },
            ],
            [],
          ],
          segment: {
            key: "wd_ingediend",
            cumulative: true,
            periodization: "weekly",
          },
        },
        {
          slug: "wd_numbers_niet_woningen",
          ctrlr: "NumbersV1",
          args: [],
          filters: [],
          header: "Niet woningen",
          parameters: [
            [
              {
                label: "Ingediend",
                column: "wnw_ingediend",
                colour: "orange",
                units: "aanvragen",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Afgehandeld",
                column: "wnw_afgerond",
                colour: "orange",
                units: "afgehandeld",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Verleende schade",
                column: "wnw_bedrag_betaald_totaal",
                colour: "orange",
                units: "betaald bedrag",
                format: "currency",
                modifiers: { cumul: "_cumul_eur", delta: "_eur" },
              },
            ],
            [],
          ],
          segment: {
            key: "wnw_ingediend",
            cumulative: true,
            periodization: "weekly",
          },
        },
        {
          slug: "wd_numbers_namteg",
          ctrlr: "NumbersV1",
          args: [],
          filters: [],
          header: "NAM tegemoetkoming",
          parameters: [
            [
              {
                label: "Ingediend",
                column: "namteg_ingediend",
                colour: "moss",
                units: "aanvragen",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Afgehandeld",
                column: "namteg_afgerond",
                colour: "moss",
                units: "afgehandeld",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Verleende schade",
                column: "namteg_bedrag_betaald_totaal",
                colour: "moss",
                units: "betaald bedrag",
                format: "currency",
                modifiers: { cumul: "_cumul_eur", delta: "_eur" },
              },
            ],
            [],
          ],
          segment: {
            key: "namteg_ingediend",
            cumulative: true,
            periodization: "weekly",
          },
        },
        {
          slug: "wdl_totaal_makeup_trend",
          ctrlr: "BarTrendStackedMakeup",
          args: [],
          filters: ["mappingGroupSelect", "cumulativeVsDelta"],
          parameters: [
            [
              {
                label: "Woningen",
                column: "wd_ingediend",
                colour: "blue",
                units: "aanvragen",
                excludeFromTable: true,
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Niet woningen",
                column: "wnw_ingediend",
                colour: "orange",
                units: "aanvragen",
                excludeFromTable: true,
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "NAM tegemoetkoming",
                column: "namteg_ingediend",
                colour: "moss",
                units: "aanvragen",
                excludeFromTable: true,
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
            ],
            [
              {
                label: "Woningen",
                column: "wd_afgerond",
                colour: "blue",
                units: "afgehandeld",
                excludeFromTable: true,
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Niet woningen",
                column: "wnw_afgerond",
                colour: "orange",
                units: "afgehandeld",
                excludeFromTable: true,
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "NAM tegemoetkoming",
                column: "namteg_afgerond",
                colour: "moss",
                units: "afgehandeld",
                excludeFromTable: true,
                modifiers: { cumul: "_cumul", delta: "_aantal" },
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
        key: "ingediend",
        cumulative: true,
        periodization: "monthly",
      },
      functionality: ["table", "definitions", "download"],
      endpoints: [
        `regelingen?aggregatie=eq.week&domein_code=eq.${DOMEIN_CODE}&select=aggregatie%2Cperiode%2Cperiode_totenmet%2Cperiode_vanaf%2Cdomein_code%2Cregeling_code%2Cingediend_aantal%2Cafgerond_aantal%2Cingediend_cumul%2Cafgerond_cumul%2Cbedrag_betaald_totaal_cumul_eur%2Cbedrag_betaald_totaal_eur&periode_vanaf=gte.{VANAF}&order=periode.desc`,
        `regelingen?aggregatie=eq.maand&domein_code=eq.${DOMEIN_CODE}&select=aggregatie%2Cperiode%2Cperiode_totenmet%2Cperiode_vanaf%2Cdomein_code%2Cregeling_code%2Cingediend_aantal%2Cafgerond_aantal%2Cingediend_cumul%2Cafgerond_cumul%2Cbedrag_betaald_totaal_cumul_eur%2Cbedrag_betaald_totaal_eur&order=periode.desc`,
      ],
    },
  ],
};

export default pageConfig;