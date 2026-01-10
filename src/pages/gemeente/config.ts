import { IGroupMappingV2 } from "../shared/interfaces";

const group : IGroupMappingV2[] = [
    {
        "slug" : "gemeenten_maatwerk",
        "ctrlr": "MuniGroupV1",
        "filters" : ["gemeente"],
        "graphs": [
            {
                "slug" : "gemeente_numbers_v1",
                "ctrlr" : "NumbersMultiplesV1",
                "args" : [],
                "filters" : ["totaalVsRecent"],
                "multiples": "cumulative", 
                "parameters": [
                    [
                        { 
                            "label" : "Meldingen",
                            "column" : "meldingen",
                            "colour" : "orange",
                            "units" : "meldingen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "afgehandeld",
                            "colour" : "moss",
                            "units": "afgehandeld"
                        },
                        // { 
                        //     "label" : "Verleend",
                        //     "column" : "verleend_bedrag",
                        //     "colour" : "blue",
                        //     "format" : "currency",
                        //     "units" : "verleend"
                        // }
                    ],
                    [
                    ]
                ],
                "modifiers" : [
                    [
                        {
                            "label": "maatwerk",
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
                    "key": "meldingen",
                    "cumulative": true,
                    "periodization": "latest",
                    // "gemeente": "Groningen"
                }
            },
            {
                "slug" : "gemeente_trend",
                "ctrlr" : "BarTrendV1",
                "args" : [],
                "filters": ["parameterSelect","cumulativeVsDelta"], // ,"weekVsMonth"
                "parameters": [
                    [
                        { 
                            "label" : "Meldingen",
                            "column" : "meldingen",
                            "colour" : "orange",
                            "units" : "meldingen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "afgehandeld",
                            "colour" : "moss",
                            "units": "afgehandeld"
                        },
                        // { 
                        //     "label" : "Verleend",
                        //     "column" : "verleend_bedrag",
                        //     "colour" : "blue",
                        //     "format" : "currency",
                        //     "units" : "verleend"
                        // }
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
                    "key": "meldingen",
                    "cumulative": false,
                    "periodization": "monthly",
                    // "gemeente": "Groningen"
                }
            },
            {
                "slug" : "gemeente_toegekend_taart",
                "ctrlr" : "PieChartSumV1",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Toegekend",
                            "column": "toekenningen_cumulatief",
                            "colour": "moss",  
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Afgewezen",
                            "column": "afwijzingen_cumulatief",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                    ],
                    [
                        {
                            "label": "Afgehandeld",
                            "column": "afgehandeld_cumulatief",
                            "colour": "gray",
                            "scale" : "null",
                            "format": ""
                        }
                    ]
                ]
            }
        ],
        "segment": {
            "key": "maatwerk_meldingen",
            "cumulative": true,
            "periodization": "monthly",
            "gemeente": "Groningen"
        },
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["gem_maandelijks?domein_code=eq.MW","gem_wekelijks?domein_code=eq.MW"],
    },
    {
        "slug" : "gemeenten_vv",
        "ctrlr": "MuniGroupV1",
        "filters" : ["gemeente"],
        "graphs": [
            {
                "slug" : "gemeente_numbers_v1",
                "ctrlr" : "NumbersMultiplesV1",
                "args" : [],
                "filters" : ["totaalVsRecent"],
                "multiples": "cumulative", 
                "parameters": [
                    [
                        { 
                            "label" : "Meldingen",
                            "column" : "meldingen",
                            "colour" : "orange",
                            "units" : "zaken"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "afgehandeld",
                            "colour" : "moss",
                            "units": "besluiten"
                        },
                        // { 
                        //     "label" : "Verleend",
                        //     "column" : "verleend_bedrag",
                        //     "colour" : "blue",
                        //     "format" : "currency",
                        //     "units" : "verleend"
                        // }
                    ],
                    [
                    ]
                ],
                "modifiers" : [
                    [
                        {
                            "label": "maatwerk",
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
                    "key": "meldingen",
                    "cumulative": true,
                    "periodization": "latest",
                    // "gemeente": "Groningen"
                }
            },
            {
                "slug" : "gemeente_trend",
                "ctrlr" : "BarTrendV1",
                "args" : [],
                "filters": ["parameterSelect","cumulativeVsDelta"], // ,"weekVsMonth"
                "parameters": [
                    [
                        { 
                            "label" : "Meldingen",
                            "column" : "meldingen",
                            "colour" : "orange",
                            "units" : "meldingen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "afgehandeld",
                            "colour" : "moss",
                            "units": "besluiten"
                        },
                        // { 
                        //     "label" : "Verleend",
                        //     "column" : "verleend_bedrag",
                        //     "colour" : "blue",
                        //     "format" : "currency",
                        //     "units" : "verleend"
                        // }
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
                    "key": "meldingen",
                    "cumulative": false,
                    "periodization": "monthly",
                    // "gemeente": "Groningen"
                }
            },
            {
                "slug" : "gemeente_toegekend_taart",
                "ctrlr" : "PieChartSumV1",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Toegekend",
                            "column": "toekenningen_cumulatief",
                            "colour": "moss",  
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Afgewezen",
                            "column": "afwijzingen_cumulatief",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                    ],
                    [
                        {
                            "label": "Afgehandeld",
                            "column": "afgehandeld_cumulatief",
                            "colour": "gray",
                            "scale" : "null",
                            "format": ""
                        }
                    ]
                ]
            }
        ],
        "segment": {
            "key": "maatwerk_meldingen",
            "cumulative": true,
            "periodization": "monthly",
            "gemeente": "Groningen"
        },
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["gem_maandelijks?domein_code=eq.VV","gem_wekelijks?domein_code=eq.VV"],
    },
    {
        "slug" : "gemeenten_ims",
        "ctrlr": "MuniGroupV1",
        "filters" : ["gemeente"],
        "graphs": [
            {
                "slug" : "gemeente_numbers_v1",
                "ctrlr" : "NumbersMultiplesV1",
                "args" : [],
                "filters" : ["totaalVsRecent"],
                "multiples": "cumulative", 
                "parameters": [
                    [
                        { 
                            "label" : "Meldingen",
                            "column" : "meldingen",
                            "colour" : "orange",
                            "units" : "zaken"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "afgehandeld",
                            "colour" : "moss",
                            "units": "besluiten"
                        },
                        // { 
                        //     "label" : "Verleend",
                        //     "column" : "verleend_bedrag",
                        //     "colour" : "blue",
                        //     "format" : "currency",
                        //     "units" : "verleend"
                        // }
                    ],
                    [
                    ]
                ],
                "modifiers" : [
                    [
                        {
                            "label": "maatwerk",
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
                    "key": "meldingen",
                    "cumulative": true,
                    "periodization": "latest",
                    // "gemeente": "Groningen"
                }
            },
            {
                "slug" : "gemeente_trend",
                "ctrlr" : "BarTrendV1",
                "args" : [],
                "filters": ["parameterSelect","cumulativeVsDelta"], // ,"weekVsMonth"
                "parameters": [
                    [
                        { 
                            "label" : "Meldingen",
                            "column" : "meldingen",
                            "colour" : "orange",
                            "units" : "meldingen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "afgehandeld",
                            "colour" : "moss",
                            "units": "besluiten"
                        },
                        // { 
                        //     "label" : "Verleend",
                        //     "column" : "verleend_bedrag",
                        //     "colour" : "blue",
                        //     "format" : "currency",
                        //     "units" : "verleend"
                        // }
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
                    "key": "meldingen",
                    "cumulative": false,
                    "periodization": "monthly",
                    // "gemeente": "Groningen"
                }
            },
            {
                "slug" : "gemeente_toegekend_taart",
                "ctrlr" : "PieChartSumV1",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Toegekend",
                            "column": "toekenningen_cumulatief",
                            "colour": "moss",  
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Afgewezen",
                            "column": "afwijzingen_cumulatief",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                    ],
                    [
                        {
                            "label": "Afgehandeld",
                            "column": "afgehandeld_cumulatief",
                            "colour": "gray",
                            "scale" : "null",
                            "format": ""
                        }
                    ]
                ]
            }
        ],
        "segment": {
            "key": "meldingen",
            "cumulative": true,
            "periodization": "monthly",
            "gemeente": "Groningen"
        },
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["gem_maandelijks?domein_code=eq.IMS","gem_wekelijks?domein_code=eq.IMS"],
    },
    {
        "slug" : "gemeenten_imk",
        "ctrlr": "MuniGroupV1",
        "filters" : ["gemeente"],
        "graphs": [
            {
                "slug" : "gemeente_numbers_v1",
                "ctrlr" : "NumbersMultiplesV1",
                "args" : [],
                "filters" : ["totaalVsRecent"],
                "multiples": "cumulative", 
                "parameters": [
                    [
                        { 
                            "label" : "Meldingen",
                            "column" : "meldingen",
                            "colour" : "orange",
                            "units" : "zaken"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "afgehandeld",
                            "colour" : "moss",
                            "units": "besluiten"
                        },
                        // { 
                        //     "label" : "Verleend",
                        //     "column" : "verleend_bedrag",
                        //     "colour" : "blue",
                        //     "format" : "currency",
                        //     "units" : "verleend"
                        // }
                    ],
                    [
                    ]
                ],
                "modifiers" : [
                    [
                        {
                            "label": "maatwerk",
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
                    "key": "meldingen",
                    "cumulative": true,
                    "periodization": "latest",
                    // "gemeente": "Groningen"
                }
            },
            {
                "slug" : "gemeente_trend",
                "ctrlr" : "BarTrendV1",
                "args" : [],
                "filters": ["parameterSelect","cumulativeVsDelta"], // ,"weekVsMonth"
                "parameters": [
                    [
                        { 
                            "label" : "Meldingen",
                            "column" : "meldingen",
                            "colour" : "orange",
                            "units" : "meldingen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "afgehandeld",
                            "colour" : "moss",
                            "units": "besluiten"
                        },
                        // { 
                        //     "label" : "Verleend",
                        //     "column" : "verleend_bedrag",
                        //     "colour" : "blue",
                        //     "format" : "currency",
                        //     "units" : "verleend"
                        // }
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
                    "key": "meldingen",
                    "cumulative": false,
                    "periodization": "monthly",
                    // "gemeente": "Groningen"
                }
            },
            {
                "slug" : "gemeente_toegekend_taart",
                "ctrlr" : "PieChartSumV1",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Toegekend",
                            "column": "toekenningen_cumulatief",
                            "colour": "moss",  
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Afgewezen",
                            "column": "afwijzingen_cumulatief",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                    ],
                    [
                        {
                            "label": "Afgehandeld",
                            "column": "afgehandeld_cumulatief",
                            "colour": "gray",
                            "scale" : "null",
                            "format": ""
                        }
                    ]
                ]
            }
        ],
        "segment": {
            "key": "meldingen",
            "cumulative": true,
            "periodization": "monthly",
            "gemeente": "Groningen"
        },
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["gem_maandelijks?domein_code=eq.IMK","gem_wekelijks?domein_code=eq.IMK"],
    },
    {
        "slug" : "gemeenten_wd",
        "ctrlr": "MuniGroupV1",
        "filters" : ["gemeente"],
        "graphs": [
            {
                "slug" : "gemeente_numbers_v1",
                "ctrlr" : "NumbersMultiplesV1",
                "args" : [],
                "filters" : ["totaalVsRecent"],
                "multiples": "cumulative", 
                "parameters": [
                    [
                        { 
                            "label" : "Meldingen",
                            "column" : "meldingen",
                            "colour" : "orange",
                            "units" : "zaken"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "afgehandeld",
                            "colour" : "moss",
                            "units": "besluiten"
                        },
                        // { 
                        //     "label" : "Verleend",
                        //     "column" : "verleend_bedrag",
                        //     "colour" : "blue",
                        //     "format" : "currency",
                        //     "units" : "verleend"
                        // }
                    ],
                    [
                    ]
                ],
                "modifiers" : [
                    [
                        {
                            "label": "maatwerk",
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
                    "key": "meldingen",
                    "cumulative": true,
                    "periodization": "latest",
                    // "gemeente": "Groningen"
                }
            },
            {
                "slug" : "gemeente_trend",
                "ctrlr" : "BarTrendV1",
                "args" : [],
                "filters": ["parameterSelect","cumulativeVsDelta"], // ,"weekVsMonth"
                "parameters": [
                    [
                        { 
                            "label" : "Meldingen",
                            "column" : "meldingen",
                            "colour" : "orange",
                            "units" : "meldingen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "afgehandeld",
                            "colour" : "moss",
                            "units": "besluiten"
                        },
                        // { 
                        //     "label" : "Verleend",
                        //     "column" : "verleend_bedrag",
                        //     "colour" : "blue",
                        //     "format" : "currency",
                        //     "units" : "verleend"
                        // }
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
                    "key": "meldingen",
                    "cumulative": false,
                    "periodization": "monthly",
                    // "gemeente": "Groningen"
                }
            },
            {
                "slug" : "gemeente_toegekend_taart",
                "ctrlr" : "PieChartSumV1",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Toegekend",
                            "column": "toekenningen_cumulatief",
                            "colour": "moss",  
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Afgewezen",
                            "column": "afwijzingen_cumulatief",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                    ],
                    [
                        {
                            "label": "Afgehandeld",
                            "column": "afgehandeld_cumulatief",
                            "colour": "gray",
                            "scale" : "null",
                            "format": ""
                        }
                    ]
                ]
            }
        ],
        "segment": {
            "key": "meldingen",
            "cumulative": true,
            "periodization": "monthly",
            "gemeente": "Groningen"
        },
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["gem_maandelijks?domein_code=eq.WD","gem_wekelijks?domein_code=eq.WD"],
    },
    {
        "slug" : "gemeenten_wnw",
        "ctrlr": "MuniGroupV1",
        "filters" : ["gemeente"],
        "graphs": [
            {
                "slug" : "gemeente_numbers_v1",
                "ctrlr" : "NumbersMultiplesV1",
                "args" : [],
                "filters" : ["totaalVsRecent"],
                "multiples": "cumulative", 
                "parameters": [
                    [
                        { 
                            "label" : "Meldingen",
                            "column" : "meldingen",
                            "colour" : "orange",
                            "units" : "zaken"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "afgehandeld",
                            "colour" : "moss",
                            "units": "besluiten"
                        },
                        // { 
                        //     "label" : "Verleend",
                        //     "column" : "verleend_bedrag",
                        //     "colour" : "blue",
                        //     "format" : "currency",
                        //     "units" : "verleend"
                        // }
                    ],
                    [
                    ]
                ],
                "modifiers" : [
                    [
                        {
                            "label": "maatwerk",
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
                    "key": "meldingen",
                    "cumulative": true,
                    "periodization": "latest",
                    // "gemeente": "Groningen"
                }
            },
            {
                "slug" : "gemeente_trend",
                "ctrlr" : "BarTrendV1",
                "args" : [],
                "filters": ["parameterSelect","cumulativeVsDelta"], // ,"weekVsMonth"
                "parameters": [
                    [
                        { 
                            "label" : "Meldingen",
                            "column" : "meldingen",
                            "colour" : "orange",
                            "units" : "meldingen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "afgehandeld",
                            "colour" : "moss",
                            "units": "besluiten"
                        },
                        // { 
                        //     "label" : "Verleend",
                        //     "column" : "verleend_bedrag",
                        //     "colour" : "blue",
                        //     "format" : "currency",
                        //     "units" : "verleend"
                        // }
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
                    "key": "meldingen",
                    "cumulative": false,
                    "periodization": "monthly",
                    // "gemeente": "Groningen"
                }
            },
            {
                "slug" : "gemeente_toegekend_taart",
                "ctrlr" : "PieChartSumV1",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Toegekend",
                            "column": "toekenningen_cumulatief",
                            "colour": "moss",  
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Afgewezen",
                            "column": "afwijzingen_cumulatief",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                    ],
                    [
                        {
                            "label": "Afgehandeld",
                            "column": "afgehandeld_cumulatief",
                            "colour": "gray",
                            "scale" : "null",
                            "format": ""
                        }
                    ]
                ]
            }
        ],
        "segment": {
            "key": "meldingen",
            "cumulative": true,
            "periodization": "monthly",
            "gemeente": "Groningen"
        },
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["gem_maandelijks?domein_code=eq.WNW","gem_wekelijks?domein_code=eq.WNW"],
    }
]

export default group;