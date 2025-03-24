import { IGroupMappingV2 } from "../shared/interfaces";

const group : IGroupMappingV2[] = [
    {
        "slug" : "gemeente_totals",
        "ctrlr": "IntroGroupV1",
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
                            "column" : "fysieke_schade_meldingen",
                            "colour" : "orange",
                            "units" : "zaken"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "fysieke_schade_afgehandeld",
                            "colour" : "moss",
                            "units": "besluiten"
                        },
                        { 
                            "label" : "Verleend",
                            "column" : "fysieke_schade_verleend_bedrag",
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
                            "label": "fysieke_schade",
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
                    "key": "fysieke_schade_meldingen",
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
                            "column" : "fysieke_schade_meldingen",
                            "colour" : "orange",
                            "units" : "meldingen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "fysieke_schade_afgehandeld",
                            "colour" : "moss",
                            "units": "besluiten"
                        },
                        { 
                            "label" : "Verleend",
                            "column" : "fysieke_schade_verleend_bedrag",
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
                        },   
                    ]
                ],
                "segment": {
                    "key": "fysieke_schade_meldingen",
                    "cumulative": true,
                    "periodization": "monthly",
                    // "gemeente": "Groningen"
                }
            },
            {
                "slug" : "gemeente_toegewezen_taart",
                "ctrlr" : "PieChartSumV1",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Toegewezen",
                            "column": "fysieke_schade_toekenningen_cumulatief",
                            "colour": "moss",   
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Afgewezen",
                            "column": "fysieke_schade_afwijzingen_cumulatief",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                    ],
                    [
                        {
                            "label": "Afgehandeld",
                            "column": "fysieke_schade_afgehandeld_cumulatief",
                            "colour": "gray",
                            "scale" : "null",
                            "format": ""
                        }
                    ]
                ]
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["gemeente_wekelijks_v3","gemeente_maandelijks_v3"],
    }
]

export default group;