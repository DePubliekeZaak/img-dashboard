import { IGroupMappingV2 } from "../shared/interfaces";

const mapping : IGroupMappingV2[] = [
    {
        "slug" : "avv_totals",
        "ctrlr": "IntroGroupV1",
        "filters" : [],
        "graphs": [
            {
                "slug" : "fs_avv_numbers_v1",
                "ctrlr" : "NumbersMultiplesV1",
                "args" : [],
                "filters": ["totaalVsRecent"],
                "multiples": "cumulative", 
                "parameters": [
                    [
                        { 
                            "label" : "Aanvragen",
                            "column" : "aanvullende_vaste_vergoeding_meldingen",
                            "colour" : "orange",
                            "units" : "aanvragen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "aanvullende_vaste_vergoeding_afgehandeld",
                            "colour" : "moss",
                            "units": "afgehandeld"
                        },
                        { 
                            "label" : "Verleend",
                            "column" : "aanvullende_vaste_vergoeding_verleend_bedrag",
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
                    "key": "aanvullende_vaste_vergoeding_meldingen",
                    "cumulative": true,
                    "periodization": "latest"
                },
            },
            {
                "slug" : "avv_trend",
                "ctrlr" : "BarTrendV1",
                "args" : [],
                "filters": ["parameterSelect","cumulativeVsDelta","weekVsMonth"],
                "parameters": [
                    [
                        {
                            "label": "Aanvragen",
                            "column": "aanvullende_vaste_vergoeding_meldingen",
                            "colour": "orange"
                        },
                        {
                            "label": "Afgehandeld",
                            "column": "aanvullende_vaste_vergoeding_afgehandeld",
                            "colour": "green"
                        },
                        {
                            "label": "Verleend",
                            "column": "aanvullende_vaste_vergoeding_verleend_bedrag",
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
                    "key" : "aanvullende_vaste_vergoeding_meldingen",
                    "cumulative": false,
                    "periodization": "weekly"
                }
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["fs_wekelijks","fs_maandelijks"],
        
    },
    {
        "slug" : "avv_toegewezen",
        "ctrlr": "ToegewezenV1",
        "filters": [],
        "graphs": [
            {
            "slug" : "fs_avv_toegewezen_taart",
            "ctrlr" : "PieChartSumV1",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Toegekend",
                        "column": "aanvullende_vaste_vergoeding_toekenningen_cumulatief",
                        "colour": "moss",
                        "scale" : "null",
                        "format": ""
                    },
                    {
                        "label": "Afgewezen",
                        "column": "aanvullende_vaste_vergoeding_afwijzingen_cumulatief",
                        "colour": "orange",
                        "scale" : "null",
                        "format": ""
                    },
                    {
                        "label": "Anders afgehandeld",
                        "column": "aanvullende_vaste_vergoeding_anders_afgehandeld_cumulatief",
                        "colour": "blue",
                        "scale" : "null",
                        "format": ""
                    }
                ],
                [
                    {
                        "label": "Afgehandeld",
                        "column": "aanvullende_vaste_vergoeding_afgehandeld_cumulatief",
                        "colour": "gray",
                        "scale" : "null",
                        "format": ""
                    }
                   
                ]
            ]
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
                            "column": "aanvullende_vaste_vergoeding_toekenningen",
                            "colour": "moss",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Afgewezen",
                            "column": "aanvullende_vaste_vergoeding_afwijzingen",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                    ]
                ],
                "segment": {
                    "key" : "aanvullende_vaste_vergoeding_toekenningen",
                    "cumulative": false,
                    "periodization": "weekly"
                },
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["fs_wekelijks","fs_maandelijks"],
        
    }
];

export default mapping;