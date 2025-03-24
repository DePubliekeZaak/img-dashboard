import { IGroupMappingV2 } from "../shared/interfaces";

const group : IGroupMappingV2[] = [
    {
        "slug" : "ims_volw_totals",
        "ctrlr": "IntroGroupV1",
        "filters" : [],
        "graphs": [
            {
                "slug" : "ims_volw_numbers_v1",
                "ctrlr" : "NumbersMultiplesV1",
                "args" : [],
                "filters": ["totaalVsRecent"],
                "multiples": "cumulative", 
                "parameters": [
                    [
                        { 
                            "label" : "Aanvragen",
                            "column" : "ims_volw_aanvragen",
                            "colour" : "orange",
                            "units" : "aanvragen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "ims_volw_besluiten",
                            "colour" : "moss",
                            "units": "afgehandeld"
                        },
                        { 
                            "label" : "Verleend",
                            "column" : "ims_volw_verleend",
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
                        },
                          
                    ]
                ],
                "segment": {
                    "key": "ims_volw_aanvragen",
                    "cumulative": true,
                    "periodization": "weekly"
                },
            },
            {
                "slug" : "ims_total_trend",
                "ctrlr" : "BarTrendV1",
                "args" : [],
                "filters": ["parameterSelect","cumulativeVsDelta","weekVsMonth"],
                "parameters": [
                    [
                        { 
                            "label" : "Aanvragen",
                            "column" : "ims_volw_aanvragen",
                            "colour" : "orange",
                            "units" : "aanvragen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "ims_volw_besluiten",
                            "colour" : "moss",
                            "units": "afgehandeld"
                        },
                        { 
                            "label" : "Verleend",
                            "column" : "ims_volw_verleend",
                            "colour" : "blue",
                            "format" : "currency",
                            "units" : "verleend"
                        }
                    ]
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
                        }   
                    ]
                ],
                "segment": {
                    "key": "ims_volw_aanvragen",
                    "cumulative": false,
                    "periodization": "weekly"
                }
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["ims_wekelijks","ims_maandelijks"]
    },
    {
        "slug" : "ims_volw_waardering",
        "ctrlr": "KTOTrendV1",
        "graphs": [
            {
                "slug" : "ims_waardering_numbers",
                "ctrlr" : "NumbersPlusRespondentsV1",
                "args" : [],
                "parameters": [
                    [
                        { 
                            "label" : "Sinds start",
                            "column" : "ims_doorlopend_cijfer",
                            "colour" : "orange",
                            "format" : "decimals"
                        }
                    ],
                    [
                        { 
                            "label" : "Totaal respondenten",
                            "column": "ims_aantal_respondenten_doorlopend",
                            "units": "respondenten sinds start",
                            "colour": "orange"
                        }
                    ]
                ]
            },
            {
            "slug" : "ims_waardering_trend",
            "ctrlr" : "BarTrendKTOV1",
            "args" : [],
            "filters": [],
            "parameters": [
                [
                    { 
                        "label" : "Maand cijfer",
                        "column" : "ims_maandcijfer",
                        "colour" : "orange",
                        "format" : "decimals"
                    }
                ],
                [
                    { 
                        "label" : "Aantal nieuwe respondenten",
                        "column" : "ims_aantal_respondenten",
                        "colour" : "orange",
                        "units": "respondenten"
                    }
                ]
            ],
            "modifiers" : []
            }
        ],
        "functionality": ['table','definitions','download'],
        "endpoints": ["tevredenheid"],
        "segment": {
            "key":"ims_maandcijfer",  
            "cumulative": false,
            "periodization": "monthly"
        } 
    },
    {
        "slug" : "ims_volw_toegewezen",
        "ctrlr": "ToegewezenV1",
        "filters": [],
        "graphs": [
            {
            "slug" : "volw_toegewezen_taart",
            "ctrlr" : "PieChartSumV1",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Toegewezen",
                        "column": "ims_volw_toegewezen_cumulatief",
                        "colour": "moss",
                        "scale" : "null",
                        "format": ""
                    },
                    {
                        "label": "Afgewezen",
                        "column": "ims_volw_afgewezen_cumulatief",
                        "colour": "orange",
                        "scale" : "null",
                        "format": ""
                    },
                ],
                [
                    {
                        "label": "Totaal",
                        "column": "ims_volw_besluiten_cumulatief",
                        "colour": "gray",
                        "scale" : "null",
                        "format": ""
                    }
                ]
            ]
            },
            {
                "slug" : "volw_toegewezen_trend",
                "ctrlr" : "BarTrendStackedMakeup",
                "filters": ["weekVsMonth"],
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Toegewezen",
                            "column": "ims_volw_toegewezen",
                            "colour": "moss",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Afgewezen",
                            "column": "ims_volw_afgewezen",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                    ]
                ]
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["ims_wekelijks","ims_maandelijks"],
        "segment": {
            "key" : "ims_volw_toegewezen",
            "cumulative": false,
            "periodization": "monthly"
        },
    },
    {
        "slug" : "ims_volw_bezwaren",
        "ctrlr": "BezwarenV1",
        "filters": [],
        "graphs": [
            {
            "slug" : "volw_besluiten_taart",
            "ctrlr" : "BlockShareV1",
            "filters": [],
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Bezwaren",
                        "column": "ims_volw_bezwaren_ingediend",
                        "colour": "moss",
                        "scale" : "null",
                        "format": ""
                    },
                    {
                        "label": "Besluiten",
                        "column": "ims_volw_besluiten_cumulatief",
                        "colour": "blue",
                        "scale" : "null",
                        "format": ""
                    }
                ]
            ],  
            "segment": {
                "key" : "ims_volw_bezwaren_ingediend",
                "cumulative": false,
                "periodization": "none"
            }
            },
            {
                "slug" : "volw_bezwaren_taart",
                "ctrlr" : "PieChartSumV1",
                "filters": [],
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Bezwaren beschikt",
                            "column": "ims_volw_bezwaren_beschikt",
                            "colour": "blue",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Bezwaren openstaand",
                            "column": "ims_volw_bezwaren_openstaand",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Bezwaren ingetrokken",
                            "column": "ims_volw_bezwaren_ingetrokken",
                            "colour": "moss",
                            "scale" : "null",
                            "format": ""
                        }
                    ],
                    [
                        {
                            "label": "Bezwaren ingediend",
                            "column": "ims_volw_bezwaren_ingediend",
                            "colour": "gray",
                            "scale" : "null",
                            "format": ""
                        }
                    ]
                ],
                "classList": ["graph-container-6"],
                "segment": {
                    "key" : "ims_volw_bezwaren_ingediend",
                    "cumulative": false,
                    "periodization": "none"
                }
            },
          
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["ims_wekelijks"]
    }

];

export default group;