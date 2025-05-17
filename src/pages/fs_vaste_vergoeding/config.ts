import { IGroupMappingV2 } from "../shared/interfaces";

const mapping : IGroupMappingV2[] = [
    {
        "slug" : "ves_totals",
        "ctrlr": "IntroGroupV1",
        "filters" : [],
        "graphs": [
            {
                "slug" : "fs_ves_numbers_v1",
                "ctrlr" : "NumbersMultiplesV1",
                "args" : [],
                "header": "Vaste Vergoeding (VES)",
                "filters": ["totaalVsRecent"],
                "multiples": "cumulative", 
                "parameters": [
                    [
                        // { 
                        //     "label" : "Aanvragen",
                        //     "column" : "vaste_vergoeding_meldingen",
                        //     "colour" : "orange",
                        //     "units" : "aanvragen"
                        // },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "vaste_vergoeding_afgehandeld",
                            "colour" : "moss",
                            "units": "afgehandeld"
                        },
                        { 
                            "label" : "Verleend",
                            "column" : "vaste_vergoeding_verleend_bedrag",
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
                    "key": "vaste_vergoeding__meldingen",
                    "cumulative": true,
                    "periodization": "weekly"
                },
            },
            {
                "slug" : "ves_trend",
                "ctrlr" : "BarTrendV1",
                "args" : [],
                "filters": ["parameterSelect","cumulativeVsDelta","weekVsMonth"],
                "parameters": [
                    [
                        // {
                        //     "label": "Aanvragen",
                        //     "column": "vaste_vergoeding_meldingen",
                        //     "colour": "orange"
                        // },
                        {
                            "label": "Afgehandeld",
                            "column": "vaste_vergoeding_afgehandeld",
                            "colour": "moss"
                        },
                        {
                            "label": "Verleend",
                            "column": "vaste_vergoeding_verleend_bedrag",
                            "colour": "blue",
                            "format": "currency"
                        }
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
                            "column": "{}_cumulatief",
                            "colour": "orange"
                        },   
                    ]
                ],
                "segment": {
                    "key" : "vaste_vergoeding_afgehandeld",
                    "cumulative": false,
                    "periodization": "monthly"
                }
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["fs_wekelijks","fs_maandelijks"],
        
    },
    {
        "slug" : "ves_toegewezen",
        "ctrlr": "ToegewezenV1",
        "filters": [],
        "graphs": [
            {
            "slug" : "fs_ves_toegewezen_taart",
            "ctrlr" : "PieChartSumV1",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Toegewezen",
                        "column": "vaste_vergoeding_toekenningen_cumulatief",
                        "colour": "moss",
                        "scale" : "null",
                        "format": ""
                    },
                    {
                        "label": "Afgewezen",
                        "column": "vaste_vergoeding_afwijzingen_cumulatief",
                        "colour": "orange",
                        "scale" : "null",
                        "format": ""
                    },
                ],
                [
                    {
                        "label": "Afgehandeld",
                        "column": "vaste_vergoeding_afgehandeld_cumulatief",
                        "colour": "gray",
                        "scale" : "null",
                        "format": ""
                    }
                ]
            ],
            "segment": {
                "key" : "vaste_vergoeding_toekenningen_cumulatief",
                "cumulative": true,
                "periodization": "monthly"
            }
        // },
            },
            {
                "slug" : "fs_ves_toegewezen_trend",
                "ctrlr" : "BarTrendStackedMakeup",
                "filters": ["absoluteVsNormalized","weekVsMonth"],
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Toekenningen",
                            "column": "vaste_vergoeding_toekenningen",
                            "colour": "moss",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Afgewezen",
                            "column": "vaste_vergoeding_afwijzingen",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                    ]
                ],
                "segment": {
                    "key" : "vaste_vergoeding_toekenningen",
                    "cumulative": false,
                    "periodization": "monthly",
                    "label": "besluiten",
                    "normalized": false
                },
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["fs_wekelijks","fs_maandelijks"]
    }
       


];

export default mapping;