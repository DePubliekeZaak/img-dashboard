import { IGroupMappingV2 } from "../shared/interfaces";

const mapping: IGroupMappingV2[] = [
  {
    slug: "fs_totals",
    ctrlr: "DefaultGroupV1",
    filters: [],
    graphs: [
      {
        slug: "fs_numbers_v1",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: ["totaalVsRecent"],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Aanvragen",
              column: "fysiek_ingediend",
              colour: "orange",
              units: "ingediende schademeldingen",
            },
            {
              label: "Voorraad",
              column: "fysiek_voorraad",
              colour: "moss",
              units: "schademeldingen in werkvoorraad",
            },
            {
              label: "Afgerond",
              column: "fysiek_afgerond",
              colour: "blue",
              units: "afgeronde schademeldingen",
            },
          ],
          [],
        ],
        modifiers: [
          [
            {
              label: "totaal",
              column: "{}_cumulatief",
              colour: "orange",
            },
            {
              label: "afgelopen week",
              column: "{}",
              colour: "orange",
            },
          ],
        ],
        segment: {
          key: "fysiek_ingediend",
          cumulative: true,
          periodization: "weekly",
        },
      },
    ],
    segment: {
      key: "fysiek_ingediend",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_totaal_wekelijks", "fysiek_totaal_maandelijks"],
  },
  {
    slug: "fs_bedragen",
    ctrlr: "DefaultGroupV1",
    filters: ["totaalVsRecent","weekVsMonth"],
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
              column: "fysiek_bedrag_betaald_totaal",
              colour: "blue",
              format: "currency",
              units: "betaald totaalbedrag",
            }
          ],
          [],
        ],
        modifiers: [
          [
            {
              label: "totaal",
              column: "{}_cumulatief",
              colour: "blue",
            },
            {
              label: "afgelopen week",
              column: "{}",
              colour: "blue",
            },
          ],
        ],
        segment: {
          key: "fysiek_bedrag_betaald_totaal",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "fs_bedrag_trend",
        ctrlr: "BarTrendBedragenV1",
        args: [],
        filters: [],
        parameters: [
          [
            {
              label: "Maand cijfer",
              column: "fysiek_bedrag_betaald_totaal",
              colour: "blue",
              format: "decimals",
            },
          ]
        ],
        modifiers: [
          [
            {
              label: "totaal",
              column: "{}_cumulatief",
              colour: "blue",
            },
            {
              label: "afgelopen week",
              column: "{}",
              colour: "blue",
            },
          ]
        ],
        segment: {
          key: "fysiek_bedrag_betaald_totaal",
          cumulative: true,
          periodization: "weekly",
        },
      },
    ],
    segment: {
      key: "fysiek_bedrag_betaald_totaal",
      cumulative: true,
      periodization: "weekly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_totaal_wekelijks", "fysiek_totaal_maandelijks"],
  },
  {
    slug: "fs_waardering",
    ctrlr: "KTOGroupV1",
    graphs: [
      {
        slug: "fs_waardering_numbers",
        ctrlr: "NumbersPlusRespondentsV1",
        args: [],
        parameters: [
          [
            {
              label: "Sinds start",
              column: "fysieke_schade_doorlopend_cijfer",
              colour: "orange",
              format: "decimals",
            },
          ],
          [
            {
              label: "Totaal respondenten",
              column: "fysieke_schade_aantal_respondenten_doorlopend",
              units: "respondenten sinds start",
              colour: "orange",
            },
          ],
        ],
      },
      {
        slug: "fs_waardering_trend",
        ctrlr: "BarTrendKTOV1",
        args: [],
        filters: [],
        parameters: [
          [
            {
              label: "Maand cijfer",
              column: "fysieke_schade_maandcijfer",
              colour: "orange",
              format: "decimals",
            },
          ],
          [
            {
              label: "Aantal nieuwe respondenten",
              column: "fysieke_schade_aantal_respondenten",
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
      key: "fysieke_schade_maandcijfer",
      cumulative: false,
      periodization: "monthly",
    },
  },
  {
    slug: "fs_keuzepaden",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "fs_numbers_afgerond",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        header: "Sinds start IMG/TCMG",
        // multiples: "cumulative",
        parameters: [
          [
            {
              label: "Aanvragen",
              column: "maatwerk_afgerond_cumulatief",
              colour: "blue",
              units: "afgerond via maatwerk",
            },
            {
              label: "Voorraad",
              column: "vv_afgerond_cumulatief",
              colour: "orange",
              units: "afgerond via vaste vergoeding",
            },
            {
              label: "",
              column: "---",
              colour: "moss",
              units: "",
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "maatwerk_afgerond",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "fs_peag_afgerond",
        ctrlr: "NumbersV1",
        args: [],
        filters: [],
        header: "Sinds maatregelen n.a.v. parlementaire enquete",
        parameters: [
          [
            {
              label: "Maatwerk",
              column: "fysiek_peag_maatwerk_afgerond_cumulatief",
              colour: "blue",
              units: "afgerond via maatwerk",
            },
            {
              label: "VES",
              column: "fysiek_peag_vv_afgerond_cumulatief",
              colour: "orange",
              units: "afgerond via vaste vergoeding",
            },
            {
              label: "HEA",
              column: "fysiek_peag_herstel_afgerond_cumulatief",
              colour: "moss",
              units: "afgerond via herstel",
            },
          ],
          [],
        ],
        modifiers: [],
        segment: {
          key: "maatwerk_afgerond",
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
              label: "Afgehandeld via maatwerk",
              column: "maatwerk_afgerond",
              colour: "blue",
            },
            {
              label: "Afgehandeld via vaste vergoeding",
              column: "vv_afgerond",
              colour: "orange",
            },
            // {
            //   label: "Afgehandeld via aanvullende vaste vergoeding",
            //   column: "avv_afgerond",
            //   colour: "moss",
            // },
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
          key: "maatwerk_afgehandeld",
          cumulative: false,
          periodization: "monthly",
          label: "afgehandelde dossiers ",
        },
      },
    ],
    segment: {
      key: "maatwerk_afgehandeld",
      cumulative: false,
      periodization: "monthly",
      label: "afgehandelde dossiers ",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_totaal_wekelijks", "fysiek_totaal_maandelijks"],
  },
];

export default mapping;
