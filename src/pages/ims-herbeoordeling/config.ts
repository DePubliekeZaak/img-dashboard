import { IGroupMappingV2 } from "../shared/interfaces";

const group : IGroupMappingV2[] = [
    {
        "slug" : "ims_sc_totals",
        "ctrlr": "IntroGroupV1",
        
        "graphs": [
            {
                "slug" : "ims_sc_numbers_v1",
                "ctrlr" : "NumbersMultiplesV1",
                "args" : [],
                "filters" : ["totaalVsRecent"],
                "multiples": "cumulative", 
                "parameters": [
                    [
                        { 
                            "label" : "Zaken",
                            "column" : "ims_sc_zaken",
                            "colour" : "orange",
                            "units" : "zaken"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "ims_sc_verstuurd_besluit",
                            "colour" : "moss",
                            "units": "besluiten"
                        },
                        { 
                            "label" : "Verleend",
                            "column" : "ims_sc_verleend",
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
                ]
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["ims_wekelijks","ims_maandelijks"],
        "segment": {
            "key": "ims_sc_zaken",
            "cumulative": true,
            "periodization": "weekly"
        }
    },
    {
        "slug" : "imsc_subregelingen",
        "ctrlr": "MakeupGroupTrendV1",
        "graphs": [
            {
            "slug" : "ims_makeup_trend",
            "ctrlr" : "BarTrendStackedMakeup",
            "args" : [],
            "filters": [], // "weekVsMonth"
            "parameters": [
                [
                    { 
                        "label" : "Herbeoordeling",
                        "column" : "ims_sc_zaken",
                        "colour" : "blue"
                    }
                ],
                []
            ],
            "modifiers" : [
            ],
            "segment": {
                    "key": "ims_sc_zaken",
                    "cumulative": false,
                    "periodization": "weekly"
                }
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["ims_wekelijks","ims_maandelijks"]
    }

];

export default group;