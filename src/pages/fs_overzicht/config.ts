import { IGroupMappingV2 } from "../shared/interfaces";

const mapping : IGroupMappingV2[] = [
    {
        "slug" : "fs_totals",
        "ctrlr": "IntroGroupV1",
        "filters" : [],
        "graphs": [
            {
                "slug" : "fs_numbers_v1",
                "ctrlr" : "NumbersMultiplesV1",
                "args" : [],
                "filters": ["totaalVsRecent"],
                "multiples": "cumulative", 
                "parameters": [
                    [
                        { 
                            "label" : "Aanvragen",
                            "column" : "totaal_meldingen",
                            "colour" : "orange",
                            "units" : "aanvragen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "totaal_afgehandeld",
                            "colour" : "moss",
                            "units": "afgehandeld"
                        },
                        { 
                            "label" : "Verleend",
                            "column" : "totaal_verleend_bedrag",
                            "colour" : "blue",
                            "format" : "currency",
                            "units" : "verleend"
                        }
                    ],
                    [
                    ]
                ],
                "modifiers" : [
                    [
                        {
                            "label": "totaal",
                            "column": "{}_cumulatief",
                            "colour": "orange"
                        }, 
                        {
                            "label": "afgelopen week",
                            "column": "{}",
                            "colour": "orange"
                        }
                    ]
                ],
                "segment": {
                    "key": "ims_totaal_meldingen",
                    "cumulative": true,
                    "periodization": "weekly"
                },
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["fs_wekelijks","fs_maandelijks"]
    },
    {
        "slug" : "fs_waardering",
        "ctrlr": "KTOTrendV1",
        "graphs": [
            {
                "slug" : "fs_waardering_numbers",
                "ctrlr" : "NumbersPlusRespondentsV1",
                "args" : [],
                "parameters": [
                    [
                        { 
                            "label" : "Sinds start",
                            "column" : "fysieke_schade_doorlopend_cijfer",
                            "colour" : "orange",
                            "format" : "decimals"
                        }
                    ],
                    [
                        { 
                            "label" : "Totaal respondenten",
                            "column": "fysieke_schade_aantal_respondenten_doorlopend",
                            "units": "respondenten sinds start",
                            "colour": "orange"
                        }
                    ]
                ]
            },
            {
            "slug" : "fs_waardering_trend",
            "ctrlr" : "BarTrendKTOV1",
            "args" : [],
            "filters": [],
            "parameters": [
                [
                    { 
                        "label" : "Maand cijfer",
                        "column" : "fysieke_schade_maandcijfer",
                        "colour" : "orange",
                        "format" : "decimals"
                    }
                ],
                [
                    { 
                        "label" : "Aantal nieuwe respondenten",
                        "column" : "fysieke_schade_aantal_respondenten",
                        "colour" : "orange",
                        "units": "respondenten"
                    }
                ]
            ],
            "modifiers" : []
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["tevredenheid"],
        "segment": {
            "key":"fysieke_schade_maandcijfer",  
            "cumulative": false,
            "periodization": "monthly"
        }
        
    },
    {
        "slug" : "fs_keuzepaden",
        "ctrlr": "MakeupGroupTrendV1",
        "graphs": [
            {
            "slug" : "fs_makeup_trend",
            "ctrlr" : "BarTrendStackedMakeup",
            "args" : [],
            "filters": ["cumulativeVsDelta","weekVsMonth"],
            "parameters": [
                [
                    { 
                        "label" : "Maatwerk",
                        "column" : "maatwerk_meldingen",
                        "colour" : "blue"
                    },
                    { 
                        "label" : "Vaste vergoeding",
                        "column" : "vaste_vergoeding_meldingen",
                        "colour" : "orange"
                    }
                ],
                []
            ],
            "modifiers" : [
                [
                    {
                        "label": "toename",
                        "column": "{}",
                        "colour": "orange"
                    },
                    {
                        "label": "cumulatief",
                        "column": "{}_cumulatief",
                        "colour": "orange"
                    },   
                ]
            ],
            "segment": {
                    "key": "maatwerk_meldingen",
                    "cumulative": false,
                    "periodization": "monthly"
                }
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["fs_wekelijks","fs_maandelijks"]
    },
    // {
    //     "slug" : "maatwerk_besluiten",
    //     "ctrlr": "BesluitenGroupV1",
    //     "graphs": [
    //         {
    //         "slug" : "besluiten_taart",
    //         "ctrlr" : "PieChartSumV1",
    //         "args" : [],
    //         "parameters": [
    //             [
    //                 {
    //                     "label": "Meldingen met afwijzing",
    //                     "column": "fysieke_schade_afgewezen_besluiten",
    //                     "colour": "orange"
    //                 },
    //                 {
    //                     "label": "Besluiten met toekenning",
    //                     "column": "fysieke_schade_toegewezen_besluiten",
    //                     "colour": "blue"
    //                 },
    //                 {
    //                     "label": "Percentage toegekend",
    //                     "column": "fysieke_schade_percentage_toegewezen_besluiten",
    //                     "colour": "purple",
    //                     "format": "percentage"
    //                 }
    //             ],
    //             [
    //                 {
    //                     "label": "Percentage toegekend",
    //                     "column": "fysieke_schade_percentage_toegewezen_besluiten",
    //                     "colour": "purple",
    //                     "format": "percentage"
                        
                        
    //                 }
    //             ]
    //         ]
    //         },
    //         {
    //             "slug" : "besluiten_trend",
    //             "ctrlr" : "BarTrendStackedV1",
    //             "args" : [],
    //             "filters": [],
    //             "parameters": [
    //                 [
    //                     {
    //                         "label": "Besluiten met afwijzing",
    //                         "column": "fysieke_schade_nieuw_afgewezen_besluiten",
    //                         "colour": "orange"
    //                     },
    //                     {
    //                         "label": "Besluiten met toekenning",
    //                         "column": "fysieke_schade_nieuw_toegewezen_besluiten",
    //                         "colour": "blue"
    //                     }
    //                 ],
    //                 [
    //                     {
    //                         "label": "percentage toegekend",
    //                         "column": "fysieke_schade_nieuw_percentage_toegewezen_besluiten",
    //                         "colour": "purple"
    //                     }
    //                 ]
    //             ]
    //         }
    //     ],
    //     "functionality": ['table', 'definitions','download'],
    //     "endpoints": ["historie"],
    //     "segment": {
    //         "key" : "fysieke_schade_nieuw_afgewezen_besluiten",
    //         "cumulative": false,
    //         "periodization": "monthly"
    //     },
    // },
    // {
    //     "slug" : "bezwaren_fs",
    //     "ctrlr": "BezwarenGroupV1",
    //     "graphs": [
    //         {
    //         "slug" : "bezwaren_taart",
    //         "ctrlr" : "PieChartSumV1",
    //         "args" : [],
    //         "parameters": [[
    //             {
    //                 "label": "Gegrond",
    //                 "column": "bezwaren_gegrond",
    //                 "colour": "purple"
    //             },
    //             {
    //                 "label": "Deels gegrond",
    //                 "column": "bezwaren_deels_gegrond",
    //                 "colour": "lightBlue"
    //             },
    //             {
    //                 "label": "Ongegrond",
    //                 "column": "bezwaren_ongegrond",
    //                 "colour": "blue"
    //             },
    //             {
    //                 "label": "Niet ontvankelijk",
    //                 "column": "bezwaren_niet_ontvankelijk",
    //                 "colour": "moss"
    //             },
    //             {
    //                 "label": "Ingetrokken",
    //                 "column": "bezwaren_ingetrokken",
    //                 "colour": "green"
    //             },
    //             {
    //                 "label": "Naar schadeprocedure",
    //                 "column": "bezwaren_doorgezet",
    //                 "colour": "brown"
    //             },
    //             {
    //                 "label": "In behandeling",
    //                 "column": "bezwaren_in_behandeling",
    //                 "colour": "orange"
    //             }
    //         ],
    //         [
    //             {
    //                 "label": "Totaal",
    //                 "column": "bezwaren_totaal",
    //                 "colour": "orange"
    //             }
    //         ]
    //     ]
    //     }
    //     ],
    //     "header": "Bezwaren",
    //     "functionality": ['tableView', 'download'],
    //     "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
    //     "endpoints": ["reacties?gemeente=eq.all"],
    //     "segment": "meldingen",
    // }
];

export default mapping;