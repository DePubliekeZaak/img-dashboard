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
      filters: ["cumulativeVsDelta", "weekVsMonth"],
      graphs: [
        {
          slug: "ims_totaal_numbers_2",
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
          slug: "ims_totaal_bedragen_trend",
          ctrlr: "BarTrendBedragenV1",
          filters: [],
          args: [],
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
    // keuzepaden
    {
      slug: "ims_totaal_keuzepaden",
      ctrlr: "RegelingComparisonGroupV1",
      graphs: [
        {
          slug: "ims_totaal_numbers_volw",
          ctrlr: "NumbersV1",
          args: [],
          filters: [],
          header: "Volwassenen",
          parameters: [
            [
              {
                label: "Ingediend",
                column: "ims_ingediend",
                colour: "blue",
                units: "aanvragen",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Afgehandeld",
                column: "ims_afgerond",
                colour: "blue",
                units: "afgehandeld",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Betaald bedrag",
                column: "ims_bedrag_betaald_totaal",
                colour: "blue",
                units: "betaald bedrag",
                format: "currency",
                modifiers: { cumul: "_cumul_eur", delta: "_eur" },
              },
            ],
            [],
          ],
          segment: {
            key: "ims_ingediend",
            cumulative: true,
            periodization: "weekly",
          },
        },
        {
          slug: "ims_totaal_numbers_kj",
          ctrlr: "NumbersV1",
          args: [],
          filters: [],
          header: "Kinderen en jongeren",
          parameters: [
            [
              {
                label: "Ingediend",
                column: "imk_ingediend",
                colour: "orange",
                units: "aanvragen",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Afgehandeld",
                column: "imk_afgerond",
                colour: "orange",
                units: "afgehandeld",
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Betaald bedrag",
                column: "imk_bedrag_betaald_totaal",
                colour: "orange",
                units: "betaald bedrag",
                format: "currency",
                modifiers: { cumul: "_cumul_eur", delta: "_eur" },
              },
            ],
            [],
          ],
          segment: {
            key: "imk_ingediend",
            cumulative: true,
            periodization: "weekly",
          },
        },
        {
          slug: "ims_totaal_makeup_trend",
          ctrlr: "BarTrendStackedMakeup",
          args: [],
          filters: ["mappingGroupSelect", "cumulativeVsDelta"],
          parameters: [
            [
              {
                label: "Volwassenen",
                column: "ims_ingediend",
                colour: "blue",
                units: "aanvragen",
                excludeFromTable: true,
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Kinderen en jongeren",
                column: "imk_ingediend",
                colour: "orange",
                units: "aanvragen",
                excludeFromTable: true,
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
            ],
            [
              {
                label: "Volwassenen",
                column: "ims_afgerond",
                colour: "blue",
                units: "afgehandeld",
                excludeFromTable: true,
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
              {
                label: "Kinderen en jongeren",
                column: "imk_afgerond",
                colour: "orange",
                units: "afgehandeld",
                excludeFromTable: true,
                modifiers: { cumul: "_cumul", delta: "_aantal" },
              },
            ],
          ],
          segment: {
            key: "ims_ingediend",
            cumulative: false,
            periodization: "monthly",
            parameterIndex: 0,
          },
        },
      ],
      segment: {
        key: "ims_ingediend",
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