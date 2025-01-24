import { IGroupMappingV2 } from "../shared/interfaces";

const group : IGroupMappingV2[] = [
    
    {
        "slug" : "maatwerk_historie_meldingen",
        "ctrlr": "ProgressGroupV1",
        "graphs": [
            {
                "slug" : "fs_historie_total_numbers",
                "ctrlr" : "NumbersV1",
                "args" : [],
                "parameters": [
                    [
                        { 
                            "label" : "Schademeldingen",
                            "column" : "fysieke_schade_meldingen_cumulatief",
                            "colour" : "blue",
                            "units" : "totaal"
                        },
                        { 
                            "label" : "Overgenomen van CVW",
                            "column" : "fysieke_schade_meldingen_cvw_cumulatief",
                            "colour" : "orange",
                            "units": "overgenomen van CVW"
                        },
                        { 
                            "label" : "Gemeld bij IMG",
                            "column" : "fysieke_schade_meldingen_img_cumulatief",
                            "colour" : "moss",
                            "units": "gemeld bij IMG"
                        },
                        { 
                            "label" : "Werkvoorraad",
                            "column" : "fysieke_schade_werkvoorraad",
                            "colour" : "purple",
                            "units": "werkvoorraad april 2023"
                        }
                    ],
                    [
                    ]
                ],
                "segment": {
                    "key" : "fysieke_schade_meldingen",
                    "cumulative": true,
                    "periodization": "monthly"
                }
            },
            {
                "slug" : "fs_historie_meldingen",
                "ctrlr" : "BarTrendStackedMakeup",
                "args" : [],
                "filters" : ["cumulativeVsDelta"],
                "parameters": [
                    [
                        { 
                            "label" : "Overgenomen van CVW",
                            "column" : "fysieke_schade_meldingen_cvw",
                            "colour" : "orange",
                            "units": "overgenomen van CVW",
                            "excludeFromTable": true
                        },
                        {
                            "label": "Schademeldingen",
                            "column": "fysieke_schade_meldingen_img",
                            "colour": "moss",
                            "excludeFromTable": true
                        }
                    ]
                ],
                "segment": {
                    "key" : "fysieke_schade_meldingen_img",
                    "cumulative": false,
                    "periodization": "monthly"
                }
            },
            {
                "slug" : "fs_historie_werkvoorraad",
                "ctrlr" : "BarTrendStackedMakeup",
                "args" : [],
                "filters" : [],
                "parameters": [
                    [
                        { 
                            "label" : "Werkvoorraad",
                            "column" : "fysieke_schade_werkvoorraad",
                            "colour" : "purple",
                            // "units": "overgenomen van CVW",
                            "excludeFromTable": true
                        }
                    ]
                ],
                "segment": {
                    "key" : "fysieke_schade_meldingen",
                    "cumulative": false,
                    "periodization": "monthly"
                }
            }
        ], 
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["historie","historie"],
    },
    {
        "slug" : "maatwerk_duur",
        "ctrlr": "DuurGroupV1",
        "graphs": [
            {
            "slug" : "duur_bars",
            "ctrlr" : "BarTrendStackedDuur",
            "filters": [],
            "args" : [],
            "parameters": [
                [
                    {
                        "label": '2 jaar en ouder',
                        "column": 'fysieke_schade_langer_dan_twee_jaar_in_procedure',
                        "colour": "orange",
                        "short": "> 2 jaar"
                    },
                    {
                        "label": '1-2 jaar oud',
                        "column": 'fysieke_schade_tussen_jaar_en_twee_jaar_in_procedure',
                        "colour": "yellow",
                        "short": "1 t/m 2 jaar"
                    },
                    {
                        "label": '0,5-1 jaar oud',
                        "column": 'fysieke_schade_tussen_half_jaar_en_jaar_in_procedure',
                        "colour": "moss",
                        "short": "1/2 t/m 1 jaar"
                    },
                    {
                        "label": '< 0,5 jaar oud',
                        "column": 'fysieke_schade_minder_dan_half_jaar_in_procedure',
                        "colour": "lightBlue",
                        "short": "< 1/2 jaar"
                    }
                ],
                [
                    {
                    "label": "Verwacht aantal dagen tussen melding en besluit",
                    "column": "fysieke_schade_percentage_binnen_half_jaar",
                    "colour": "black"
                    }
                ]
            ]
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["historie"],
        "segment": {
            "key" : "fysieke_schade_langer_dan_twee_jaar_in_procedure",
            "cumulative": false,
            "periodization": "monthly"  
        },
    },
    // {
    //     "slug" : "maatwerk_projecties",
    //     "ctrlr": "DuurProjectiesGroupV1",
    //     "graphs": [
    //         {
    //             "slug" : "duur_lines",
    //             "ctrlr" : "BarTrendVoorraadenGemiddeldes",
    //             "filters": [],
    //             "args" : [],
    //             "parameters": [
    //                 [
    //                     {
    //                         "label": "werkvoorraad",
    //                         "column": "fysieke_schade_werkvoorraad",
    //                         "colour": "yellow"
    //                     }
    //                 ],
    //                 [
    //                     {
    //                         "label": "Verwacht aantal dagen tussen melding en besluit",
    //                         "column": "fysieke_schade_verwacht_aantal_dagen_tussen_melding_en_besluit",
    //                         "colour": "purple"
    //                     },
    //                     {
    //                         "label": "Mediaan doorlopptijd",
    //                         "column": "fysieke_schade_mediaan_doorlooptijd",
    //                         "colour": "orange"
    //                     }
    //                 ]
    //             ]
    //         }
    //     ],
    //     "functionality": ['table', 'definitions','download'],
    //     "endpoints": ["historie"],
    //     "segment": {
    //         "key" : "fysieke_schade_werkvoorraad",
    //         "cumulative": false,
    //         "periodization": "monthly"  
    //     },
    // },
    // {
    //     "slug" : "maatwerk_historie_meldingen_geo",
    //     "ctrlr": "GeoGroupV1",
    //     "graphs": [
    //         {
    //             "slug" : "gem_bedrag_geo",
    //             "ctrlr" : "MapV1",
    //             "multiples" : "grouped",
    //             "filters": [],
    //             "args" : [],
    //             "parameters": [
    //                 [
    //                     {
    //                         "label": "Schademeldingen",
    //                         "column": "schademeldingen",
    //                         "colour": "orange",
    //                         "format": ""
    //                     }
    //                 ],
    //                 []
    //             ]
    //         }
    //     ],
    //     "functionality": ['table', 'definitions','download'],
    //     "endpoints": ["map"],
    //     "segment": "schademeldingen",
    // },
    // // {
    // //     "slug" : "maatwerk_vergoedingen",
    // //     "ctrlr": "SchadevergoedingenGroupV1",
    // //     "graphs": [
    // //         {
    // //         "slug" : "schadevergoedingen_taart",
    // //         "ctrlr" : "PieChartSumV1",
    // //         "args" : [],
    // //         "parameters": [
    // //             [
    // //                 {
    // //                     "label": "Mijnbouwschade",
    // //                     "column": "fysieke_schade_schadebedrag",
    // //                     "colour": "brown",
    // //                     "format" : "currency",
    // //                     "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. "
    // //                 },
    // //                 {
    // //                     "label": "Stuwmeerregeling",
    // //                     "column": "fysieke_schade_stuwmeerregeling_bedrag",
    // //                     "colour": "blue",
    // //                     "format" : "currency",
    // //                     "description" :"Consequat interdum varius sit amet mattis vulputate. Magna sit amet purus gravida. Est velit egestas dui id ornare arcu. Malesuada fames ac turpis egestas maecenas pharetra convallis."
    // //                 },
    // //                 {
    // //                     "label": "Bijkomende kosten",
    // //                     "column": "fysieke_schade_bijkomende_kosten_bedrag",
    // //                     "colour": "moss",
    // //                     "format" : "currency",
    // //                     "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. "

    // //                 },
    // //                 {
    // //                     "label": "Wettelijke rente",
    // //                     "column": "fysieke_schade_wettelijke_rente_bedrag",
    // //                     "colour": "orange",
    // //                     "format" : "currency",
    // //                     "description" :"Consequat interdum varius sit amet mattis vulputate. Magna sit amet purus gravida. Est velit egestas dui id ornare arcu. Malesuada fames ac turpis egestas maecenas pharetra convallis."

    // //                 }
    // //             ],
    // //             [
    // //                 {
    // //                     "label": "Totaal verleend",
    // //                     "column": "fysieke_schade_totaal_verleend",
    // //                     "colour": "gray",
    // //                     "format" : "currency",
    // //                     "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. "

    // //                 }
    // //             ]
    // //         ]
    // //     }
    // //     ],
    // //     "functionality": ['table', 'definitions','download'],
    // //     "endpoints": ["historie"],
    // //     "segment": "meldingen",
    // // },
    
    // // {
    // //     "slug" : "maatwerk_schadebedrag_ordes",
    // //     "ctrlr": "OrdesBedragGroupV1",
    // //     "graphs": [
    // //         {
    // //             "slug" : "gem_bedrag_ordes",
    // //             "ctrlr" : "SMBandBarsOrdes",
    // //             "multiples" : "years",
    // //             "args" : [],
    // //             "parameters": [
    // //                 [
    // //                     {
    // //                         label: "< €1K",
    // //                         column: "vergoedingen_lager_dan_1000",
    // //                         colour: 'lightBlue'
    // //                     },
    // //                     {
    // //                         label : "€1K t/m €4K",
    // //                         column : "vergoedingen_tussen_1000_en_4000",
    // //                         colour :'orange'
    // //                     },
    // //                     {
    // //                         label : "€4K t/m €10K",
    // //                         column : "vergoedingen_tussen_4000_en_10000",
    // //                         colour: 'moss'
    // //                     },
    // //                     {
    // //                         label : "> €10K",
    // //                         column : "vergoedingen_hoger_dan_10000",
    // //                         colour: 'brown'
    // //                     }
    // //                 ],
    // //                 []
    // //             ]
    // //         }
    // //     ],
    // //     "functionality": ['table', 'definitions','download'],
    // //     "endpoints": ["vergoedingen_jaarlijks?gemeente=eq.all"],
    // //     "segment": "meldingen",
    // // },
    // {
    //     "slug" : "maatwerk_schadebedrag_geo",
    //     "ctrlr": "GeoGroupBedragenV1",
    //     "graphs": [
    //         {
    //             "slug" : "gem_bedrag_geo",
    //             "ctrlr" : "MapV2",
    //             "multiples" : "geo",
    //             "args" : [],
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
    //             ]
    //         }
    //     ],
    //     "functionality": ['table', 'definitions','download'],
    //     "endpoints": ["map"],
    //     "segment": "meldingen",
    // },
    // {
    //     "slug" : "maatwerk_percentage_goedgekeurd_geo",
    //     "ctrlr": "GeoGoedgekeurdGroupV1",
    //     "graphs": [
    //         {
    //             "slug" : "gem_bedrag_geo_",
    //             "ctrlr" : "MapGoedgekeurdV1",
    //             "multiples" : "geo",
    //             "args" : [],
    //             "parameters": [
    //                 [
    //                     {
    //                         "label": "Percentage toegewezen besluiten",
    //                         "column": "percentage_toegewezen_besluiten",
    //                         "colour": "blue",
    //                         "format": "percentage"
    //                     }
    //                 ],
    //                 []
    //             ]
    //         }
    //     ],
    //     "functionality": ['table', 'definitions','download'],
    //     "endpoints": ["map"],
    //     "segment": "meldingen",
    // }
    
];

export default group;