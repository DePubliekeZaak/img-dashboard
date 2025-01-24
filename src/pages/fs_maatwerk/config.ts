import { IGroupMappingV2 } from "../shared/interfaces";

const group : IGroupMappingV2[] = [
    {
        "slug" : "fs_maatwerk_totals",
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
                            "column" : "maatwerk_meldingen",
                            "colour" : "orange",
                            "units" : "aanvragen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "maatwerk_afgehandeld",
                            "colour" : "moss",
                            "units": "afgehandeld"
                        },
                        { 
                            "label" : "Verleend",
                            "column" : "maatwerk_verleend_bedrag",
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
                            "column": "maatwerk_meldingen",
                            "colour": "orange"
                        },
                        {
                            "label": "Afgehandeld",
                            "column": "maatwerk_afgehandeld",
                            "colour": "green"
                        },
                        // {
                        //     "label": "Werkvoorraad",
                        //     "column": "vaste_vergoeding_werkvoorraad",
                        //     "colour": "blue"
                        // },
                        {
                            "label": "Verleend",
                            "column": "maatwerk_verleend_bedrag",
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
                            "column": "{}_cumulatief",
                            "colour": "orange"
                        },   
                    ]
                ],
                "segment": {
                    "key" : "maatwerk_meldingen",
                    "cumulative": false,
                    "periodization": "monthly"
                }
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["fs_wekelijks","fs_maandelijks"],
        
    },
    {
        "slug" : "fs_ves_toegewezen",
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
                        "column": "vaste_vergoeding_toewijzingen_cumulatief",
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
            ]
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["fs_wekelijks","fs_maandelijks"],
        "segment": {
            "key" : "vaste_vergoeding_afwijzingen_cumulatief",
            "cumulative": true,
            "periodization": "monthly"
        }
    }
];

export default group;