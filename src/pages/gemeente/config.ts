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
                            "column" : "totaal_meldingen",
                            "colour" : "orange",
                            "units" : "zaken"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "totaal_afgehandeld",
                            "colour" : "moss",
                            "units": "besluiten"
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
                        },
                          
                    ]
                ],
                "segment": {
                    "key": "totaal_meldingen",
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
                            "column" : "totaal_meldingen",
                            "colour" : "orange",
                            "units" : "meldingen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "totaal_afgehandeld",
                            "colour" : "moss",
                            "units": "besluiten"
                        },
                        { 
                            "label" : "Verleend",
                            "column" : "totaal_verleend_bedrag",
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
                    "key": "totaal_meldingen",
                    "cumulative": false,
                    "periodization": "monthly",
                    // "gemeente": "Groningen"
                }
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["gemeente"],
    }
]

export default group;