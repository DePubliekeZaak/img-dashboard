import type { IPageConfig } from "../../shared/interfaces";

const DOMEIN_CODE = "IMS";
const REGELING_CODE = "IMS";

const pageConfig: IPageConfig = {
  slug: "ims-volwassenen",
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
      slug: "ims_volw_intro",
      ctrlr: "DefaultGroupV1",
      filters: [],
      graphs: [
        {
          slug: "ims_volw_numbers_v1",
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
          slug: "ims_volw_trend",
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
      slug: "ims_volw_bedragen",
      ctrlr: "DefaultGroupV1",
      filters: ["cumulativeVsDelta","weekVsMonth"],
      graphs: [
        {
          slug: "ims_volw_numbers_2",
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
          slug: "ims_volw_bedragen_trend",
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
    // // ── waardering ──
    {
      slug: "ims_volw_waardering",
      ctrlr: "KTOGroupV1",
      graphs: [
        {
          slug: "ims_volw_waardering_numbers",
          ctrlr: "NumbersPlusRespondentsV1",
          args: [],
          parameters: [
            [
              {
                label: "Sinds start",
                column: "ims_doorlopend_cijfer",
                colour: "orange",
                format: "decimals",
              },
            ],
            [
              {
                label: "Totaal respondenten",
                column: "ims_aantal_respondenten_doorlopend",
                units: "respondenten sinds start",
                colour: "orange",
              },
            ],
          ],
        },
        {
          slug: "ims_volw_waardering_trend",
          ctrlr: "BarTrendKTOV1",
          args: [],
          filters: [],
          parameters: [
            [
              {
                label: "Maand cijfer",
                column: "ims_maandcijfer",
                colour: "orange",
                format: "decimals",
              },
            ],
            [
              {
                label: "Aantal nieuwe respondenten",
                column: "ims_aantal_respondenten",
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
        key: "ims_maandcijfer",
        cumulative: false,
        periodization: "monthly",
      },
    },
    // // ── besluiten ──
    {
      slug: "ims_volw_besluiten",
      ctrlr: "DefaultGroupV1",
      filters: [],
      graphs: [
        {
          slug: "ims_volw_numbers_besluiten_v1",
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
        cumulative: false,
        periodization: "weekly",
      },
      functionality: ["table", "definitions", "download"],
      endpoints: [],
    },
    // // ── toegekend / afgewezen ──
    {
      slug: "ims_volw_toegekend",
      ctrlr: "DefaultGroupV1",
      filters: [],
      graphs: [
        {
          slug: "ims_volw_toegekend_taart",
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
          slug: "ims_volw_toegekend_trend",
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
    // // ── duur ──
    {
      slug: "ims_volw_duur",
      ctrlr: "DefaultGroupV1",
      graphs: [
        {
          slug: "ims_volw_duur_numbers_v1",
          ctrlr: "NumbersMultiplesTitledV1",
          args: [],
          filters: [],
          multiples: "incremental",
          parameters: [
            [
              {
                label: "Mediaan",
                column: "dlt_gerealiseerd_mediaan_dagen",
                colour: "orange",
                units: "gerealiseerd aantal dagen",
              },
              {
                label: "Gemiddelde",
                column: "dlt_gerealiseerd_gemiddeld_dagen",
                colour: "blue",
                units: "gerealiseerd aantal dagen",
              }
            ],
            [],
          ],
          modifiers: [],
          segment: {
            key: "dlt_gerealiseerd_mediaan_dagen",
            cumulative: false,
            periodization: "weekly",
          },
        },
        {
          slug: "ims_volw_duur_trend",
          ctrlr: "BarTrendV1",
          filters: ["parameterSelect"],
          args: [],
          parameters: [
            [
                {
                label: "Gerealiseerd gemiddeld aantal dagen tot besluit",
                column: "dlt_gerealiseerd_gemiddeld_dagen",
                colour: "blue",
                units: "gemiddeld gerealiseerd aantal dagen",
              },
              {
                label: "Gerealiseerde mediaan aantal dagen tot besluit",
                column: "dlt_gerealiseerd_mediaan_dagen",
                colour: "orange",
                units: "mediaan gerealiseerd aantal dagen",
              }
            ],
          ],
          segment: {
            key: "dlt_gerealiseerd_gemiddeld_dagen",
            cumulative: false,
            periodization: "monthly",
            label: "dagen",
          },
        },
      ],
      segment: {
        key: "dlt_gerealiseerd_mediaan_dagen",
        cumulative: false,
        periodization: "weekly",
        label: "dagen",
      },
      functionality: ["table", "definitions", "download"],
      endpoints: [],
    },
    // // ── voorraad ──
    {
      slug: "ims_volw_voorraad",
      ctrlr: "DefaultGroupV1",
      graphs: [
        {
          slug: "ims_volw_voorrraad_getallen",
          ctrlr: "NumbersMultiplesTitledV1",
          args: [],
          filters: [],
          multiples: "incremental",
          parameters: [
            [
              {
                label: "Voorraad",
                column: "voorraad_cumul",
                colour: "blue",
                units: "voorraad",
              },
              {
                label: "Beslistermijn",
                column: "beslistermijn_dagen",
                colour: "moss",
                units: "dagen",
              },
            ],
            [],
          ],
          modifiers: [],
          segment: {
            key: "oud_voorraad_gemiddeld_dagen",
            cumulative: true,
            periodization: "weekly",
          },
        },
        {
          slug: "ims_volw_voorraad_groepen",
          ctrlr: "SegmentsV1",
          args: [],
          filters: [],
          parameters: [
            [
              {
                label: "< 56 dagen",
                column: "oud_voorraad_binnen_termijn",
                colour: "orange",
              },
              {
                label: "56 - 112 dagen",
                column: "oud_voorraad_1_2_termijn",
                colour: "moss",
              },
              {
                label: "112 - 224 dagen",
                column: "oud_voorraad_2_4_termijn",
                colour: "blue",
              },
              {
                label: "> 224 dagen",
                column: "oud_voorraad_buiten_4_termijn",
                colour: "purple",
              },
            ],
          ],
          modifiers: [],
          segment: {
            key: "oud_voorraad_binnen_termijn",
            cumulative: true,
            periodization: "weekly",
          },
        },
      ],
      segment: {
        key: "oud_voorraad_binnen_termijn",
        cumulative: true,
        periodization: "weekly",
      },
      functionality: ["table", "definitions", "download"],
      endpoints: [],
    },
    // ── bezwaren ──
    {
      slug: "ims_volw_bezwaren",
      ctrlr: "DefaultGroupV1",
      graphs: [
        {
          slug: "ims_volw_bezwaren_numbers_v1",
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
        key: "bz_toegekend",
        cumulative: true,
        periodization: "weekly",
      },
      functionality: ["table", "definitions", "download"],
      endpoints: [],
    },
  ],
};

export default pageConfig;