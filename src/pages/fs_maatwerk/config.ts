import { IGroupMappingV2 } from "../shared/interfaces";

const group : IGroupMappingV2[] = [
    {
        "slug" : "maatwerk_totals",
        "ctrlr": "IntroGroupV1",
        "filters" : [],
        "graphs": [
            {
                "slug" : "fs_maatwerk_numbers_v1",
                "ctrlr" : "NumbersMultiplesV1",
                "args" : [],
                "filters": ["totaalVsRecent"],
                "multiples": "cumulative", 
                "parameters": [
                    [
                        { 
                            "label" : "Aanvragen",
                            "column" : "maatwerk_ingediend",
                            "colour" : "orange",
                            "units" : "aanvragen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "maatwerk_afgerond",
                            "colour" : "moss",
                            "units": "afgehandeld"
                        },
                        { 
                            "label" : "Voorraad",
                            "column" : "maatwerk_voorraad",
                            "colour" : "blue",
                            "units": "voorraad"
                        }
                    ],
                    [
                    ]
                ],
                "modifiers" : [
                    [
                        {
                            "label": "totaal",
                            "column": "{}_cumul",
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
                    "key": "maatwerk_ingediend",
                    "cumulative": true,
                    "periodization": "weekly"
                },
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["fysiek_maatwerk_wekelijks","fysiek_maatwerk_maandelijks"]
    },
    {
        "slug" : "maatwerk_besluiten",
        "ctrlr": "IntroGroupV1",
        "filters" : [],
        "graphs": [
            {
                "slug" : "fs_maatwerk_numbers_besluiten_v1",
                "ctrlr" : "NumbersMultiplesV1",
                "args" : [],
                "filters": ["totaalVsRecent"],
                "multiples": "cumulative", 
                "parameters": [
                    [
                        { 
                            "label" : "Besluiten",
                            "column" : "maatwerk_beschikt",
                            "colour" : "moss",
                            "units": "besluiten"
                        },
                        { 
                            "label" : "Anders afgehandeld",
                            "column" : "maatwerk_anders_afgehandeld",
                            "colour" : "moss",
                            "units": "anders afgehandeld"
                        },
                        { 
                            "label" : "Verleend",
                            "column" : "maatwerk_besch_totaal",
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
                            "column": "{}_cumul",
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
                    "key": "maatwerk_ingediend",
                    "cumulative": true,
                    "periodization": "weekly"
                },
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["fysiek_maatwerk_wekelijks","fysiek_maatwerk_maandelijks"]
    },
    {
        "slug" : "maatwerk_ontwikkeling",
        "ctrlr": "ProgressGroupV1",
        "graphs": [
            {
                "slug" : "maatwerk_trend",
                "ctrlr" : "BarTrendV1",
                "args" : [],
                "filters": ["parameterSelect","cumulativeVsDelta","weekVsMonth"],
                "parameters": [
                    [
                        {
                            "label": "Aanvragen",
                            "column": "maatwerk_ingediend",
                            "colour": "orange"
                        },
                        {
                            "label": "Afgehandeld",
                            "column": "maatwerk_afgerond",
                            "colour": "moss"
                        },
                        {
                            "label": "Verleend",
                            "column": "maatwerk_besch_totaal",
                            "colour": "blue",
                            "format": "currency"
                        },
                    ],
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
                            "column": "{}_cumul",
                            "colour": "orange"
                        },   
                    ]
                ],
                "segment": {
                    "key" : "maatwerk_afgerond",
                    "cumulative": false,
                    "periodization": "monthly"
                }
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["fysiek_maatwerk_wekelijks","fysiek_maatwerk_maandelijks"],
        
    },
    {
        "slug" : "maatwerk_toegewezen",
        "ctrlr": "ToegewezenV1",
        "filters": [],
        "graphs": [
            {
            "slug" : "fs_maatwerk_toegewezen_taart",
            "ctrlr" : "PieChartSumV1",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Toegewezen",
                        "column": "maatwerk_toegekend_cumul",
                        "colour": "moss",   
                        "scale" : "null",
                        "format": ""
                    },
                    {
                        "label": "Afgewezen",
                        "column": "maatwerk_afgewezen_cumul",
                        "colour": "orange",
                        "scale" : "null",
                        "format": ""
                    },
                ],
                [
                    {
                        "label": "Besluiten",
                        "column": "maatwerk_beschikt_cumul",
                        "colour": "gray",
                        "scale" : "null",
                        "format": ""
                    }
                ]
            ]
            },
            {
                "slug" : "fs_maatwerk_toegewezen_trend",
                "ctrlr" : "BarTrendStackedMakeup",
                "filters": ["absoluteVsNormalized","weekVsMonth"],
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Toekenningen",
                            "column": "maatwerk_toegekend",
                            "colour": "moss",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Afgewezen",
                            "column": "maatwerk_afgewezen",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                    ]
                ],
                "segment": {
                    "key" : "maatwerk_toegekend",
                    "cumulative": false,
                    "periodization": "monthly",
                    "label": "besluiten",
                    "normalized": false
                },
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["fysiek_maatwerk_wekelijks","fysiek_maatwerk_maandelijks"],
        "segment": {
            "key" : "maatwerk_toegekend_cumul",
            "cumulative": true,
            "periodization": "monthly"
        }
    },
    {
        "slug" : "maatwerk_voorraad",
        "ctrlr": "VoorraadGroupV1",
        "graphs": [
            {
                "slug" : "fs_maatwerk_voorraad_numbers_v1",
                "ctrlr" : "NumbersV1",
                "args" : [],
                "filters": [],
                // "multiples": "cumulative", 
                "parameters": [
                    [
                        { 
                            "label" : "Voorraad",
                            "column" : "maatwerk_voorraad_cumul",
                            "colour" : "orange",
                            "units" : "voorraad"
                        },
                        { 
                            "label" : "Gemiddeld",
                            "column" : "ouderdom_voorraad_gemiddeld",
                            "colour" : "moss",
                            "units": "dagen"
                        },
                        { 
                            "label" : "Mediaan",
                            "column" : "ouderdom_voorraad_mediaan",
                            "colour" : "blue",
                            "units": "dagen"
                        }
                    ],
                    [
                    ]
                ],
                "modifiers" : [],
                "segment": {
                    "key": "maatwerk_voorraad",
                    "cumulative": true,              
                    "periodization": "weekly"
                },
            },
            {
                "slug" : "maatwerk_ouderdom_voorraad",
                "ctrlr" : "SegmentsV1",
                "args" : [],
                "filters": [],
                "parameters": [
                    [
                        {
                            "label": "0 tot 8 weken",
                            "column": "maatwerk_ouderdom_voorraad_0_8_weken",
                            "colour": "orange"
                        },
                        {
                            "label": "8 tot 16 weken",
                            "column": "maatwerk_ouderdom_voorraad_8_16_weken",
                            "colour": "moss"
                        },
                        {
                            "label": "16+ weken",
                            "column": "maatwerk_ouderdom_voorraad_16_plus_weken",
                            "colour": "blue",
                            "format": "currency"
                        },
                    ],
                ],
                "modifiers" : [],
                "segment": {
                    "key" : "maatwerk_ouderdom_voorraad_0_8_weken",
                    "cumulative": false,
                    "periodization": "monthly"
                }
            },
            {
                "slug" : "fs_maatwerk_voorrraad_trend",
                "ctrlr" : "BarTrendStackedMakeup",
                "filters": ["absoluteVsNormalized"],
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "0 tot 8 weken",
                            "column": "maatwerk_ouderdom_voorraad_0_8_weken",
                            "colour": "orange"
                        },
                        {
                            "label": "8 tot 16 weken",
                            "column": "maatwerk_ouderdom_voorraad_8_16_weken",
                            "colour": "moss"
                        },
                        {
                            "label": "16+ weken",
                            "column": "maatwerk_ouderdom_voorraad_16_plus_weken",
                            "colour": "blue",
                            "format": "currency"
                        }
                    ]
                ],
                "segment": {
                    "key" : "maatwerk_ouderdom_voorraad_0_8_weken",
                    "cumulative": false,
                    "periodization": "monthly",
                    "label": "dossiers",
                    "normalized": false
                },
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["fysiek_maatwerk_wekelijks","fysiek_maatwerk_maandelijks"],
        
    },
];

export default group;