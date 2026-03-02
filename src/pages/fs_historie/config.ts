import type { IGroupMappingV2 } from "../shared/interfaces";

const group: IGroupMappingV2[] = [
  {
    slug: "historie_meldingen",
    ctrlr: "ProgressGroupV1",
    graphs: [
      {
        slug: "fs_historie_total_numbers",
        ctrlr: "NumbersV1",
        args: [],
        parameters: [
          [
            {
              label: "Schademeldingen",
              column: "fysieke_schade_meldingen_cumulatief",
              colour: "blue",
              units: "totaal",
            },
            {
              label: "Overgenomen van CVW",
              column: "fysieke_schade_meldingen_cvw_cumulatief",
              colour: "orange",
              units: "overgenomen van CVW",
            },
            {
              label: "Gemeld bij IMG",
              column: "fysieke_schade_meldingen_img_cumulatief",
              colour: "moss",
              units: "gemeld bij IMG",
            },
            {
              label: "Werkvoorraad",
              column: "fysieke_schade_werkvoorraad",
              colour: "purple",
              units: "werkvoorraad april 2023",
            },
          ],
          [],
        ],
        segment: {
          key: "fysieke_schade_meldingen",
          cumulative: true,
          periodization: "monthly",
        },
      },
      {
        slug: "fs_historie_meldingen",
        ctrlr: "BarTrendStackedMakeup",
        args: [],
        filters: ["cumulativeVsDelta"],
        parameters: [
          [
            {
              label: "Overgenomen van CVW",
              column: "fysieke_schade_meldingen_cvw",
              colour: "orange",
              units: "overgenomen van CVW",
              excludeFromTable: true,
            },
            {
              label: "Schademeldingen",
              column: "fysieke_schade_meldingen_img",
              colour: "moss",
              excludeFromTable: true,
            },
          ],
        ],
        segment: {
          key: "fysieke_schade_meldingen_img",
          cumulative: false,
          periodization: "monthly",
        },
      },
      {
        slug: "fs_historie_werkvoorraad",
        ctrlr: "BarTrendStackedMakeup",
        args: [],
        filters: [],
        parameters: [
          [
            {
              label: "Werkvoorraad",
              column: "fysieke_schade_werkvoorraad",
              colour: "purple",
              // "units": "overgenomen van CVW",
              excludeFromTable: true,
            },
          ],
        ],
        segment: {
          key: "fysieke_schade_meldingen",
          cumulative: false,
          periodization: "monthly",
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["totaal_maandelijks_v1", "totaal_wekelijks_v1"],
  },
  {
    slug: "historie_duur",
    ctrlr: "DuurGroupV1",
    graphs: [
      {
        slug: "duur_bars",
        ctrlr: "BarTrendStackedMakeup",
        filters: [],
        args: [],
        parameters: [
          [
            {
              label: "2 jaar en ouder",
              column: "fysieke_schade_langer_dan_twee_jaar_in_procedure",
              colour: "orange",
              short: "> 2 jaar",
            },
            {
              label: "1-2 jaar oud",
              column: "fysieke_schade_tussen_jaar_en_twee_jaar_in_procedure",
              colour: "yellow",
              short: "1 t/m 2 jaar",
            },
            {
              label: "0,5-1 jaar oud",
              column: "fysieke_schade_tussen_half_jaar_en_jaar_in_procedure",
              colour: "moss",
              short: "1/2 t/m 1 jaar",
            },
            {
              label: "< 0,5 jaar oud",
              column: "fysieke_schade_minder_dan_half_jaar_in_procedure",
              colour: "lightBlue",
              short: "< 1/2 jaar",
            },
          ],
        ],
        segment: {
          key: "fysieke_schade_langer_dan_twee_jaar_in_procedure",
          cumulative: false,
          periodization: "monthly",
          label: "dossiers",
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["historie"],
  },
  {
    slug: "historie_doorstroom",
    ctrlr: "DoorstroomGroupV1",
    graphs: [
      {
        slug: "verwachting",
        ctrlr: "BarTrendStackedMakeup",
        filters: [],
        args: [],
        parameters: [
          [
            {
              label: "Percentage binnen half jaar afgerond",
              column: "fysieke_schade_percentage_binnen_half_jaar",
              colour: "blue",
              format: "percentage",
            },
          ],
        ],
        segment: {
          key: "fysieke_schade_percentage_binnen_half_jaar",
          cumulative: false,
          periodization: "monthly",
          label: "%",
        },
      },
      {
        slug: "mediaan",
        ctrlr: "BarTrendStackedMakeup",
        filters: [],
        args: [],
        parameters: [
          [
            {
              label: "Doorlooptijd afgehandelde dossiers",
              column: "fysieke_schade_mediaan_doorlooptijd",
              colour: "orange",
            },
          ],
        ],
        segment: {
          key: "fysieke_schade_percentage_binnen_half_jaar",
          cumulative: false,
          periodization: "monthly",
          label: "dagen",
        },
      },
      {
        slug: "verwachting",
        ctrlr: "BarTrendStackedMakeup",
        filters: [],
        args: [],
        parameters: [
          [
            {
              label: "Verwachte doorlooptijd nieuw dossier",
              column:
                "fysieke_schade_verwacht_aantal_dagen_tussen_melding_en_besluit",
              colour: "moss",
            },
          ],
        ],
        segment: {
          key: "fysieke_schade_percentage_binnen_half_jaar",
          cumulative: false,
          periodization: "monthly",
          label: "dagen",
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["historie"],
  },
  {
    slug: "historie_meldingen_geo",
    ctrlr: "GeoGroupV1",
    graphs: [
      {
        slug: "gem_bedrag_geo",
        ctrlr: "MapV1",
        multiples: "grouped",
        filters: [],
        args: [],
        parameters: [
          [
            {
              label: "Schademeldingen",
              column: "schademeldingen",
              colour: "orange",
              format: "",
            },
          ],
          [],
        ],
        segment: {
          key: "schademeldingen",
          cumulative: true,
          periodization: "none",
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["map"],
  },
  {
    slug: "historie_vergoedingen",
    ctrlr: "SchadevergoedingenGroupV1",
    graphs: [
      {
        slug: "schadevergoedingen_taart",
        ctrlr: "PieChartSumV1",
        args: [],
        parameters: [
          [
            {
              label: "Mijnbouwschade",
              column: "fysieke_schade_schadebedrag",
              colour: "brown",
              format: "currency",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. ",
            },
            {
              label: "Stuwmeerregeling",
              column: "fysieke_schade_stuwmeerregeling_bedrag",
              colour: "blue",
              format: "currency",
              description:
                "Consequat interdum varius sit amet mattis vulputate. Magna sit amet purus gravida. Est velit egestas dui id ornare arcu. Malesuada fames ac turpis egestas maecenas pharetra convallis.",
            },
            {
              label: "Bijkomende kosten",
              column: "fysieke_schade_bijkomende_kosten_bedrag",
              colour: "moss",
              format: "currency",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. ",
            },
            {
              label: "Wettelijke rente",
              column: "fysieke_schade_wettelijke_rente_bedrag",
              colour: "orange",
              format: "currency",
              description:
                "Consequat interdum varius sit amet mattis vulputate. Magna sit amet purus gravida. Est velit egestas dui id ornare arcu. Malesuada fames ac turpis egestas maecenas pharetra convallis.",
            },
          ],
          [
            {
              label: "Totaal verleend",
              column: "fysieke_schade_totaal_verleend",
              colour: "gray",
              format: "currency",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. ",
            },
          ],
        ],
        segment: {
          key: "fysieke_schade_schadebedrag",
          cumulative: true,
          periodization: "none",
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["historie"],
  },
  {
    slug: "historie_schadebedrag_ordes",
    ctrlr: "OrdesBedragGroupV1",
    graphs: [
      {
        slug: "gem_bedrag_ordes",
        ctrlr: "SMBandBarsOrdes",
        multiples: "years",
        args: [],
        parameters: [
          [
            {
              label: "< €1K",
              column: "vergoedingen_lager_dan_1000",
              colour: "lightBlue",
            },
            {
              label: "€1K t/m €4K",
              column: "vergoedingen_tussen_1000_en_4000",
              colour: "orange",
            },
            {
              label: "€4K t/m €10K",
              column: "vergoedingen_tussen_4000_en_10000",
              colour: "moss",
            },
            {
              label: "> €10K",
              column: "vergoedingen_hoger_dan_10000",
              colour: "brown",
            },
          ],
          [],
        ],
        segment: {
          key: "vergoedingen_lager_dan_1000",
          cumulative: true,
          periodization: "none",
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["vergoedingen_jaarlijks?gemeente=eq.all"],
  },
  // {
  //     "slug": "historie_schadebedrag_geo",
  //     "ctrlr": "GeoGroupBedragenV1",
  //     "graphs": [
  //         {
  //             "slug": "gem_bedrag_geo",
  //             "ctrlr": "MapV2",
  //             "multiples": "geo",
  //             "args": [],
  //             "parameters": [
  //                 [
  //                     {
  //                         "label": "Gemiddeld schadebedrag",
  //                         "column": "gemiddeld_schadebedrag",
  //                         "colour": "orange",
  //                         "format": "currency"
  //                     }
  //                 ],
  //                 []
  //             ],
  //             "segment": {
  //                 "key": "gemiddeld_schadebedrag",
  //                 "cumulative": true,
  //                 "periodization": "none"
  //             }
  //         }
  //     ],
  //     "functionality": ['table', 'definitions','download'],
  //     "endpoints": ["map"]
  // },
  {
    slug: "historie_percentage_goedgekeurd_geo",
    ctrlr: "GeoGoedgekeurdGroupV1",
    graphs: [
      {
        slug: "gem_bedrag_geo_",
        ctrlr: "MapV2",
        multiples: "geo",
        args: [],
        parameters: [
          [
            {
              label: "Percentage toegekende besluiten",
              column: "percentage_toegekend_besluiten",
              colour: "blue",
              format: "percentage",
            },
          ],
          [],
        ],
        segment: {
          key: "percentage_toegekende_besluiten",
          cumulative: true,
          periodization: "none",
        },
      },
    ],
    functionality: ["table", "definitions", "download"],
    endpoints: ["map"],
  },
];

export default group;
