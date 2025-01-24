import { IGroupMappingV2 } from "../shared/interfaces";

const group : IGroupMappingV2[] = [
    {
        "slug" : "ims_totals",
        "ctrlr": "TotalGroupTrendV1",
        "graphs": [
            {
                "slug" : "ims_total_numbers",
                "ctrlr" : "NumbersV1",
                "args" : [],
                "parameters": [
                    [
                        { 
                            "label" : "Aanvragen",
                            "column" : "ims_totaal_aanvragen_cumulatief",
                            "colour" : "orange",
                            "format" : "",
                            "units" : "aanvragen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "ims_totaal_afgehandeld_cumulatief",
                            "colour" : "moss",
                            "format" : "",
                            "units": "afgehandeld"
                        },
                        { 
                            "label" : "Verleend",
                            "column" : "ims_totaal_verleend_cumulatief",
                            "colour" : "blue",
                            "format" : "currency",
                            "units" : "verleend"
                        }
                    ],
                    [
                    ]
                ],
                "segment": {
                    "key": "ims_totaal_aanvragen_cumulatief",
                    "cumulative": true,
                    "periodization": "weekly"
                }
            },
            {
            "slug" : "ims_total_trend",
            "ctrlr" : "BarTrendV1",
            "args" : [],
            "filters": ["parameterSelect","cumulativeVsDelta","weekVsMonth"],
            "parameters": [
                [
                    { 
                        "label" : "Aanvragen",
                        "column" : "ims_totaal_aanvragen",
                        "colour" : "orange"
                    },
                    { 
                        "label" : "Afgehandeld",
                        "column" : "ims_totaal_afgehandeld",
                        "colour" : "moss"
                    },
                    { 
                        "label" : "Verleend",
                        "column" : "ims_totaal_verleend",
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
                    "key": "ims_totaal_aanvragen",
                    "cumulative": false,
                    "periodization": "weekly"
                }
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["ims_wekelijks","ims_maandelijks"]
      
    },
    {
        "slug" : "ims_waardering",
        "ctrlr": "KTOTrendV1",
        "graphs": [
            {
                "slug" : "ims_waardering_numbers",
                "ctrlr" : "NumbersPlusRespondentsV1",
                "args" : [],
                "parameters": [
                    [
                        { 
                            "label" : "Sinds start",
                            "column" : "ims_totaal_doorlopend",
                            "colour" : "orange",
                            "format" : "decimals"
                        }
                    ],
                    [
                        { 
                            "label" : "Totaal respondenten",
                            "column": "ims_totaal_doorlopend_n",
                            "units": "respondenten sinds start",
                            "colour": "orange"
                        }
                    ]
                ]
            },
            {
            "slug" : "ims_waardering_trend",
            "ctrlr" : "BarTrendKTOV1",
            "args" : [],
            "filters": [],
            "parameters": [
                [
                    { 
                        "label" : "Maand cijfer",
                        "column" : "ims_totaal_maand",
                        "colour" : "orange",
                        "format" : "decimals"
                    }
                ],
                [
                    { 
                        "label" : "Aantal nieuwe respondenten",
                        "column" : "ims_totaal_maand_n",
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
            "key":"ims_totaal_maand",  
            "cumulative": false,
            "periodization": "monthly"
        }
        
    },
    {
        "slug" : "ims_subregelingen",
        "ctrlr": "MakeupGroupTrendV1",
        "graphs": [
            {
            "slug" : "ims_makeup_trend",
            "ctrlr" : "BarTrendStackedMakeup",
            "args" : [],
            "filters": ["weekVsMonth"],
            "parameters": [
                [
                    { 
                        "label" : "Volwassenen",
                        "column" : "ims_volw_aanvragen",
                        "colour" : "blue"
                    },
                    { 
                        "label" : "Kinderen en Jeugd",
                        "column" : "ims_kj_aanvragen",
                        "colour" : "orange"
                    },
                    { 
                        "label" : "Herbeoordeling",
                        "column" : "ims_sc_zaken",
                        "colour" : "moss"
                    }
                ],
                []
            ],
            "modifiers" : [
            ],
            "segment": {
                    "key": "ims_volw_aanvragen",
                    "cumulative": false,
                    "periodization": "monthly"
                }
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["ims_wekelijks","ims_maandelijks"]
    }

];

export default group;