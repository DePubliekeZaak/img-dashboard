import type { IPageConfig } from "../../shared/interfaces";

const DOMEIN_CODE = "WDL";
const REGELING_CODE = "NAMTEG";

const pageConfig: IPageConfig = {
  slug: "wd-namco",
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
    `regelingen?aggregatie=eq.maand&domein_code=eq.${DOMEIN_CODE}&regeling_code=eq.${REGELING_CODE}&order=periode.desc`
  ],
  groups: [
    // ── intro ──
    {
      slug: "wdl_namco_intro",
      ctrlr: "DefaultGroupV1",
      filters: [],
      graphs: [
        {
          slug: "wd_namco_numbers_v1",
          ctrlr: "NumbersMultiplesV1",
          args: [],
          filters: [],
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
          slug: "wd_namco_trend",
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
      slug: "wdl_namco_bedragen",
      ctrlr: "DefaultGroupV1",
      filters: ["cumulativeVsDelta", "weekVsMonth"],
      graphs: [
        {
          slug: "wd_namco_numbers_bedragen",
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
      ],
      segment: {
        key: "bedrag_betaald_totaal",
        cumulative: true,
        periodization: "weekly",
      },
      functionality: ["table", "definitions", "download"],
      endpoints: [],
    },
    // ── besluiten ──
    {
      slug: "wdl_namco_besluiten",
      ctrlr: "DefaultGroupV1",
      filters: [],
      graphs: [
        {
          slug: "wd_namco_numbers_besluiten_v1",
          ctrlr: "NumbersMultiplesV1",
          args: [],
          filters: [],
          multiples: "cumulative",
          parameters: [
            [
              {
                label: "Afgehandeld",
                column: "afgerond",
                colour: "moss",
                units: "afgehandeld",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Besluiten",
                column: "beschikt",
                colour: "blue",
                units: "besluiten",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Anders afgehandeld",
                column: "anders_afgehandeld",
                colour: "orange",
                units: "anders afgehandeld",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Percentage binnen termijn",
                column: "beschikt_binn_termijn",
                colour: "moss",
                format: "percentage",
                units: "afgehandeld binnen termijn",
                modifiers: { cumul: "_cumul_perc", delta: "_cumul_perc" },
              },
            ],
            [],
          ],
          segment: {
            key: "beschikt",
            cumulative: true,
            periodization: "weekly",
          },
        },
      ],
      segment: {
        key: "beschikt_binn_termijn_perc",
        cumulative: true,
        periodization: "weekly",
      },
      functionality: ["table", "definitions", "download"],
      endpoints: [],
    },
    // ── toegekend / afgewezen ──
    {
      slug: "wdl_namco_toegekend",
      ctrlr: "DefaultGroupV1",
      filters: [],
      graphs: [
        {
          slug: "wd_namco_toegekend_taart",
          ctrlr: "PieChartSumV1",
          args: [],
          parameters: [
            [
              {
                label: "Toegekend",
                column: "toegekend",
                colour: "moss",
                scale: "null",
                format: "",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Afgewezen",
                column: "afgewezen",
                colour: "orange",
                scale: "null",
                format: "",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
            ],
            [
              {
                label: "Besluiten",
                column: "beschikt",
                colour: "gray",
                scale: "null",
                format: "",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
            ],
          ],
          segment: {
            key: "beschikt",
            cumulative: true,
            periodization: "weekly",
          },
        },
        {
          slug: "wd_namco_toegekend_trend",
          ctrlr: "BarTrendStackedMakeup",
          filters: ["absoluteVsNormalized", "weekVsMonth"],
          args: [],
          parameters: [
            [
              {
                label: "Toegekend",
                column: "toegekend",
                colour: "moss",
                scale: "null",
                format: "",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Afgewezen",
                column: "afgewezen",
                colour: "orange",
                scale: "null",
                format: "",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
            ],
          ],
          segment: {
            key: "toegekend",
            cumulative: false,
            periodization: "monthly",
            label: "besluiten",
            normalized: false,
          },
        },
      ],
      functionality: ["table", "definitions", "download"],
      endpoints: [],
      segment: {
        key: "toegekend",
        cumulative: true,
        periodization: "weekly",
      },
    },
    // ── bezwaren ──
    {
      slug: "wdl_namco_bezwaren",
      ctrlr: "DefaultGroupV1",
      graphs: [
        {
          slug: "wd_namco_bezwaren_numbers_v1",
          ctrlr: "NumbersMultiplesTitledV1",
          args: [],
          filters: [],
          multiples: "incremental",
          parameters: [
            [
              {
                label: "Ingediend",
                column: "bz_ingediend",
                colour: "orange",
                units: "bezwaren",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "In procedure",
                column: "bz_voorraad",
                colour: "purple",
                units: "bezwaren",
                modifiers: { cumul: "_cumul", delta: "_verschil" },
              },
              {
                label: "Afgerond",
                column: "bz_afgerond",
                colour: "moss",
                units: "bezwaren",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Bezwaarpercentage",
                column: "bz_vertraagd_jaar_perc",
                colour: "blue",
                format: "percentage",
                units: "t.o.v. aantal besluiten",
                modifiers: { cumul: "", delta: "" },
              },
            ],
            [],
          ],
          modifiers: [],
          segment: {
            key: "bz_ingediend_cumul",
            cumulative: true,
            periodization: "weekly",
          },
        },
        {
          slug: "bezwaren_taart_toegekend",
          ctrlr: "PieChartSumV1",
          args: [],
          parameters: [
            [
              {
                label: "Toegekend",
                column: "bz_toegekend",
                colour: "moss",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Afgewezen",
                column: "bz_afgewezen",
                colour: "orange",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Anders afgerond",
                column: "bz_anders_afgehandeld",
                colour: "blue",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
            ],
            [
              {
                label: "Totaal afgerond",
                column: "bz_afgerond",
                colour: "gray",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
            ],
          ],
          segment: {
            key: "bz_toegekend_cumul",
            cumulative: true,
            periodization: "weekly",
          },
        },
      ],
      segment: {
        key: "bz_toegekend_cumul",
        cumulative: true,
        periodization: "weekly",
      },
      functionality: ["table", "definitions", "download"],
      endpoints: [],
    },
  ],
};

export default pageConfig;