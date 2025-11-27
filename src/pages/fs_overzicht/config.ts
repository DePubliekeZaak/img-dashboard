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
    graphs: [
      {
        slug: "fs_totaal_numbers_2",
        ctrlr: "NumbersMultiplesV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Verleende schade",
              column: "fysiek_bedrag_verleend_schade",
              colour: "blue",
              format: "currency",
              units: "totaal verleende schade",
            },
            {
              label: "Verleend",
              column: "fysiek_bedrag_verleend_totaal",
              colour: "moss",
              format: "currency",
              units: "totaal verleende bedragen",
            },
            {
              label: "Uitgekeerd",
              column: "fysiek_bedrag_uitgekeerd_totaal",
              colour: "orange",
              format: "currency",
              units: "totaal uitgekeerde bedragen",
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
          key: "fysiek_bedrag_verleend_totaal",
          cumulative: true,
          periodization: "weekly",
        },
      },
    ],
    segment: {
      key: "fysiek_bedrag_verleend_totaal",
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
              column: "ves_afgerond_cumulatief",
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
              column: "fysiek_peag_ves_afgerond_cumulatief",
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
              column: "ves_afgerond",
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
  {
    slug: "fs_aanvulrondes",
    ctrlr: "DefaultGroupV1",
    graphs: [
      {
        slug: "fs_aanvulrondes_uitgekeerde_schade",
        ctrlr: "NumbersMultiplesTitledV1",
        args: [],
        filters: [],
        multiples: "cumulative",
        parameters: [
          [
            {
              label: "Aanvullende vaste vergoeding",
              column: "avv_bedrag_verleend_schade",
              colour: "blue",
              format: "currency",
              units: "totaal verleende schade",
            },
          ],
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
        modifiers: [],
        segment: {
          key: "avv_bedrag_verleend_schade",
          cumulative: true,
          periodization: "weekly",
        },
      },
      {
        slug: "fs_aanvulrondes_trend",
        ctrlr: "BarTrendStackedMakeup",
        args: [],
        filters: ["cumulativeVsDelta", "weekVsMonth"],
        parameters: [
          [
            {
              label: "Aavullende Vaste Vergoeding (AVV)",
              column: "avv_bedrag_verleend_schade",
              format: "currency",
              colour: "blue",
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
          key: "avv_verleende_schade",
          cumulative: false,
          periodization: "monthly",
          label: "schade",
        },
      },
    ],
    segment: {
      key: "avv_verleende_schade",
      cumulative: false,
      periodization: "monthly",
    },
    functionality: ["table", "definitions", "download"],
    endpoints: ["fysiek_totaal_wekelijks", "fysiek_totaal_maandelijks"],
  },
];

export default mapping;
