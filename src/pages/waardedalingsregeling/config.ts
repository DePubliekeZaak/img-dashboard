import { IGroupMappingV2 } from "../shared/interfaces";

const group : IGroupMappingV2[] = [
    {
        "slug" : "wd_totals",
        "ctrlr": "TotalGroupTrendV1",
        "graphs": [
            {
                "slug" : "wd_total_numbers",
                "ctrlr" : "NumbersMultiplesV1",
                "args" : [],
                "filters": ["totaalVsRecent"],
                "multiples": "cumulative", 
                "parameters": [
                    [
                        { 
                            "label" : "Aanvragen",
                            "column" : "wd_aanvragen",
                            "colour" : "orange",
                            "units" : "aanvragen"
                        },
                        { 
                            "label" : "Besluiten",
                            "column" : "wd_besluiten",
                            "colour" : "moss",
                            "units": "afgehandeld"
                        },
                        { 
                            "label" : "Verleend",
                            "column" : "wd_verleend",
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
                    "key": "wd_aanvragen",
                    "cumulative": true,
                    "periodization": "monthly"
                }
            },
            {
            "slug" : "wd_total_trend",
            "ctrlr" : "BarTrendV1",
            "args" : [],
            "filters": ["parameterSelect","cumulativeVsDelta","weekVsMonth"],
            "parameters": [
                [
                    { 
                        "label" : "Aanvragen",
                        "column" : "wd_aanvragen",
                        "colour" : "orange"
                    },
                    { 
                        "label" : "Afgehandeld",
                        "column" : "wd_besluiten",
                        "colour" : "moss"
                    },
                    { 
                        "label" : "Verleend",
                        "column" : "wd_verleend",
                        "colour" : "blue",
                        "format" : "currency"
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
                    },   
                ]
            ],
            "segment": {
                    "key": "wd_aanvragen",
                    "cumulative": false,
                    "periodization": "monthly"
                }
            }
        ],
        "header": "",
        "functionality": ['table', 'definitions','download'],
        "description": "",
        "definitions": [],
        "endpoints": ["wd_wekelijks","wd_maandelijks"]
      
    },
    {
        "slug" : "wd_waardering",
        "ctrlr": "KTOTrendV1",
        "graphs": [
            {
                "slug" : "wd_waardering_numbers",
                "ctrlr" : "NumbersPlusRespondentsV1",
                "args" : [],
                "parameters": [
                    [
                        { 
                            "label" : "Sinds start",
                            "column" : "waardedaling_doorlopend_cijfer",
                            "colour" : "orange",
                            "format" : "decimals"
                        }
                    ],
                    [
                        { 
                            "label" : "Totaal respondenten",
                            "column": "waardedaling_aantal_respondenten_doorlopend",
                            "units": "respondenten sinds start",
                            "colour": "orange"
                        }
                    ]
                ]
            },
            {
            "slug" : "wd_waardering_trend",
            "ctrlr" : "BarTrendKTOV1",
            "args" : [],
            "filters": [],
            "parameters": [
                [
                    { 
                        "label" : "Maand cijfer",
                        "column" : "waardedaling_maandcijfer",
                        "colour" : "orange",
                        "format" : "decimals"
                    }
                ],
                [
                    { 
                        "label" : "Aantal nieuwe respondenten",
                        "column" : "waardedaling_aantal_respondenten",
                        "colour" : "orange",
                        "units": "respondenten"
                    }
                ]
            ],
            "modifiers" : []
            }
        ],
        "header": "",
        "functionality": ['table', 'definitions','download'],
        "description": ``,
        "definitions": [],
        "timeline": ["Westerwijtwerd","Garrelsweer","Uithuizermeeden en Uithuizen","Wirdum"],
        "endpoints": ["tevredenheid"],
        "segment": {
            "key":"waardedaling_maandcijfer",  
            "cumulative": false,
            "periodization": "monthly"
        }
        
    },
    {
        "slug" : "wd_toegewezen",
        "ctrlr": "ToegewezenV1",
        "filters": [],
        "graphs": [
            {
            "slug" : "wd_toegewezen_taart",
            "ctrlr" : "PieChartSumV1",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Toegewezen",
                        "column": "wd_toegekend_cumulatief",
                        "colour": "moss",
                        "scale" : "null",
                        "format": ""
                    },
                    {
                        "label": "Afgewezen",
                        "column": "wd_afgewezen_cumulatief",
                        "colour": "orange",
                        "scale" : "null",
                        "format": ""
                    },
                ],
                [
                    {
                        "label": "Totaal",
                        "column": "wd_besluiten_cumulatief",
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
                            "column": "wd_toegekend",
                            "colour": "moss",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Afgewezen",
                            "column": "wd_afgewezen",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                    ]
                ]
            }
        ],
        "header": "Toegewezen /afgewezen",
        "functionality": ['table', 'definitions','download'],
        "description": `
            <p>Lorem ipsum</p>
        `,
        "definitions": ["Toegewezen","Afgewezen"],
        "endpoints": ["wd_wekelijks","wd_maandelijks"],
        "segment": {
            "key" : "wd_toegekend",
            "cumulative": false,
            "periodization": "monthly"
        },
    },
    {
        "slug" : "wd_bezwaren",
        "ctrlr": "BezwarenV1",
        "filters": [],
        "graphs": [
            {
            "slug" : "wd_besluiten_taart",
            "ctrlr" : "BlockShareV1",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Ingediende bezwaren",
                        "column": "wd_bezwaren_ingediend",
                        "colour": "orange",
                        "scale" : "null",
                        "format": ""
                    },
                    // {
                    //     "label": "Besluiten zonder bezwaar",
                    //     "column": "ims_volw_besluiten_zonder_bezwaar",
                    //     "colour": "blue",
                    //     "scale" : "null",
                    //     "format": ""
                    // },
                ],
                [
                    {
                        "label": "Besluiten",
                        "column": "wd_besluiten_cumulatief",
                        "colour": "blue",
                        "scale" : "null",
                        "format": ""
                    }
                ]
            ]
            },
            {
                "slug" : "wd_bezwaren_taart",
                "ctrlr" : "PieChartSumV1",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Bezwaren beschikt",
                            "column": "wd_bezwaren_afgehandeld",
                            "colour": "blue",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Bezwaren openstaand",
                            "column": "wd_bezwaren_openstaand",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                    ],
                    [
                        {
                            "label": "Bezwaren in afwachting",
                            "column": "wd_bezwaren_in_afwachting",
                            "colour": "moss",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Bezwaren ingediend",
                            "column": "wd_bezwaren_ingediend",
                            "colour": "gray",
                            "scale" : "null",
                            "format": ""
                        }
                    ]
                ],
                "classList": ["graph-container-6"]
            }
          
        ],
        "header": "Bezwaren",
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["wd_maandelijks"],
        "segment": "all",
    }
];

export default group;