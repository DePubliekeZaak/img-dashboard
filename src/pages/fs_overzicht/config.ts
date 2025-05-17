import { IGroupMappingV2 } from "../shared/interfaces";

const mapping : IGroupMappingV2[] = [
    {
        "slug" : "fs_totals",
        "ctrlr": "IntroGroupV1",
        "filters" : [],
        "graphs": [
            {
                "slug" : "fs_numbers_v1",
                "ctrlr" : "NumbersMultiplesV1",
                "args" : [],
                "filters": ["totaalVsRecent"],
                "multiples": "cumulative", 
                "parameters": [
                    [
                        { 
                            "label" : "Aanvragen",
                            "column" : "totaal_meldingen",
                            "colour" : "orange",
                            "units" : "aanvragen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "totaal_afgehandeld",
                            "colour" : "moss",
                            "units": "afgehandeld"
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
        "slug" : "fs_waardering",
        "ctrlr": "KTOTrendV1",
        "graphs": [
            {
                "slug" : "fs_waardering_numbers",
                "ctrlr" : "NumbersPlusRespondentsV1",
                "args" : [],
                "parameters": [
                    [
                        { 
                            "label" : "Sinds start",
                            "column" : "fysieke_schade_doorlopend_cijfer",
                            "colour" : "orange",
                            "format" : "decimals"
                        }
                    ],
                    [
                        { 
                            "label" : "Totaal respondenten",
                            "column": "fysieke_schade_aantal_respondenten_doorlopend",
                            "units": "respondenten sinds start",
                            "colour": "orange"
                        }
                    ]
                ]
            },
            {
            "slug" : "fs_waardering_trend",
            "ctrlr" : "BarTrendKTOV1",
            "args" : [],
            "filters": [],
            "parameters": [
                [
                    { 
                        "label" : "Maand cijfer",
                        "column" : "fysieke_schade_maandcijfer",
                        "colour" : "orange",
                        "format" : "decimals"
                    }
                ],
                [
                    { 
                        "label" : "Aantal nieuwe respondenten",
                        "column" : "fysieke_schade_aantal_respondenten",
                        "colour" : "orange",
                        "units": "respondenten"
                    }
                ]
            ],
            "modifiers" : []
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["tevredenheid"],
        "segment": {
            "key":"fysieke_schade_maandcijfer",  
            "cumulative": false,
            "periodization": "monthly"
        }
        
    },
    {
        "slug" : "fs_keuzepaden",
        "ctrlr": "MakeupGroupTrendV1",
        "graphs": [
            {
            "slug" : "fs_makeup_trend",
            "ctrlr" : "BarTrendStackedMakeup",
            "args" : [],
            "filters": ["cumulativeVsDelta","weekVsMonth"],
            "parameters": [
                [
                    { 
                        "label" : "Afgehandeld via maatwerk",
                        "column" : "maatwerk_afgehandeld",
                        "colour" : "blue"
                    },
                    { 
                        "label" : "Afgehandeld via vaste vergoeding",
                        "column" : "vaste_vergoeding_afgehandeld",
                        "colour" : "orange"
                    }
                ],
                []
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
                    "key": "maatwerk_afgehandeld",
                    "cumulative": false,
                    "periodization": "monthly",
                    "label": "afgehandelde dossiers "
                }
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["fs_wekelijks","fs_maandelijks"]
    }
    
    

];

export default mapping;