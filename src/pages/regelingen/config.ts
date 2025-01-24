import { IGroupMappingV2 } from "../shared/interfaces";

const mappings : IGroupMappingV2[] = [
    {
        "slug" : "all_totals",
        "ctrlr": "TotalGroupTrendV1",
        "graphs": [
            {
                "slug" : "all_total_numbers",
                "ctrlr" : "NumbersV1",
                "args" : [],
                "parameters": [
                    [
                        { 
                            "label" : "Aanvragen",
                            "column" : "alle_regelingen_meldingen_cumulatief",
                            "colour" : "orange",
                            "units" : "aanvragen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "alle_regelingen_afgehandeld_cumulatief",
                            "colour" : "moss",
                            "units": "afgehandeld"
                        },
                        { 
                            "label" : "Verleend",
                            "column" : "alle_regelingen_verleend_cumulatief",
                            "colour" : "blue",
                            "format" : "currency",
                            "units" : "verleend"
                        }
                    ],
                    [
                    ]
                ],
                "segment": {
                    "key": "alle_regelingen_meldingen",
                    "cumulative": true,
                    "periodization": "monthly"
                }
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["totaal_wekelijks"]  
    },
    {
        "slug" : "a_waardering",
        "ctrlr": "KTOTrendV1",
        "graphs": [
            {
                "slug" : "a_waardering_numbers",
                "ctrlr" : "NumbersPlusRespondentsV1",
                "args" : [],
                "parameters": [
                    [
                        { 
                            "label" : "Sinds start",
                            "column" : "doorlopend_cijfer",
                            "colour" : "orange",
                            "format" : "decimals"
                        }
                    ],
                    [
                        { 
                            "label" : "Totaal respondenten",
                            "column": "aantal_respondenten",
                            "units": "respondenten sinds start",
                            "colour": "orange"
                        }
                    ]
                ],
                "segment": {
                    "key":"doorlopend_cijfer",  
                    "cumulative": true,
                    "periodization": "latest"
                }
        
            },
            {
            "slug" : "a_waardering_trend",
            "ctrlr" : "BarTrendKTOV1",
            "args" : [],
            "filters": [],
            "parameters": [
                [
                    { 
                        "label" : "Maand cijfer",
                        "column" : "maandcijfer",
                        "colour" : "orange",
                        "format" : "decimals"
                    }
                ],
                [
                    { 
                        "label" : "Aantal nieuwe respondenten",
                        "column" : "aantal_respondenten_maand",
                        "colour" : "orange",
                        "units": "respondenten"
                    }
                ]
            ],
            "modifiers" : [],
            "segment": {
                "key":"maandcijfer",  
                "cumulative": false,
                "periodization": "monthly"
            }
            },
            
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["tevredenheid"],
        
    },
    {
        "slug" : "regelingen_overzicht",
        "ctrlr": "MakeupGroupTrendV1",
        "graphs": [
            {
            "slug" : "reg_makeup_trend",
            "ctrlr" : "BarTrendStackedMakeupV2",
            "args" : [],
            "filters": ["mappingGroupSelect","cumulativeVsDelta"],
            "parameters": [
                [
                    
                    { 
                        "label" : "Waardedalings-regeling",
                        "column" : "waardedaling_aanvragen",
                        "colour" : "moss"
                    },
                    { 
                        "label" : "Immateriele schade",
                        "column" : "immateriele_schade_aanvragen",
                        "colour" : "blue"
                    },
                    { 
                        "label" : "Fysieke schade",
                        "column" : "fysieke_schade_meldingen",
                        "colour" : "orange"
                    }
                ],
                [
                    { 
                        "label" : "Waardedalings-regeling",
                        "column" : "waardedaling_afgehandeld",
                        "colour" : "moss"
                    },
                    { 
                        "label" : "Immateriele schade",
                        "column" : "immateriele_schade_afgehandeld",
                        "colour" : "blue"
                    },
                    { 
                        "label" : "Fysieke schade",
                        "column" : "fysieke_schade_afgehandeld",
                        "colour" : "orange"
                    }
                ],
                [
                    { 
                        "label" : "Waardedalings-regeling",
                        "column" : "waardedaling_uitgekeerd",
                        "colour" : "moss",
                        "format" : "currency"
                    },
                    { 
                        "label" : "Immateriele schade",
                        "column" : "immateriele_schade_uitgekeerd",
                        "colour" : "blue",
                        "format" : "currency"
                    },
                    { 
                        "label" : "Fysieke schade",
                        "column" : "fysieke_schade_uitgekeerd",
                        "colour" : "orange",
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
                    "key": "fysieke_schade_meldingen",
                    "cumulative": false,
                    "periodization": "monthly",
                    "parameterIndex": 0
                }
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["historie","historie"]
    }
];

export default mappings;