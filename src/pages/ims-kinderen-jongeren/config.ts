import { IGroupMappingV2 } from "../shared/interfaces";

const group : IGroupMappingV2[] = [
    {
        "slug" : "imkj_totals",
        "ctrlr": "IntroGroupV1",
        "graphs": [
            {
                "slug" : "imkj_numbers_v1",
                "ctrlr" : "NumbersMultiplesV1",
                "args" : [],
                "filters" : ["totaalVsRecent"],
                "multiples": "cumulative", 
                "parameters": [
                    [
                        { 
                            "label" : "Aanvragen",
                            "column" : "ims_kj_aanvragen",
                            "colour" : "orange",
                            "units" : "aanvragen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "ims_kj_afgehandeld",
                            "colour" : "moss",
                            "units": "afgehandeld"
                        },
                        { 
                            "label" : "Verleend",
                            "column" : "ims_kj_verleend",
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
            },
            {
                "slug" : "imkj_total_trend",
                "ctrlr" : "BarTrendV1",
                "args" : [],
                "filters": ["parameterSelect","cumulativeVsDelta","weekVsMonth"],
                "parameters": [
                    [
                        { 
                            "label" : "Aanvragen",
                            "column" : "ims_kj_aanvragen",
                            "colour" : "orange"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "ims_kj_afgehandeld",
                            "colour" : "moss"
                        },
                        { 
                            "label" : "Verleend",
                            "column" : "ims_kj_verleend",
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
                    "key": "ims_kj_aanvragen",
                    "cumulative": false,
                    "periodization": "weekly"
                },
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["ims_wekelijks","ims_maandelijks"],
        "segment": {
            key: "ims_kj_aanvragen",
            cumulative: true,
            periodization: "monthly"
        },
    },
    {
        "slug" : "imkj_waardering",
        "ctrlr": "KTOTrendV1",
        "graphs": [
            {
                "slug" : "imkj_waardering_numbers",
                "ctrlr" : "NumbersPlusRespondentsV1",
                "args" : [],
                "parameters": [
                    [
                        { 
                            "label" : "Sinds start",
                            "column" : "imkj_doorlopend_cijfer",
                            "colour" : "orange",
                            "format" : "decimals"
                        }
                    ],
                    [
                        { 
                            "label" : "Totaal respondenten",
                            "column": "imkj_aantal_respondenten_doorlopend",
                            "units": "respondenten sinds start",
                            "colour": "orange"
                        }
                    ]
                ]
            },
            {
                "slug" : "imkj_waardering_trend",
                "ctrlr" : "BarTrendKTOV1",
                "args" : [],
                "filters": [],
                "parameters": [
                    [
                        { 
                            "label" : "Maand cijfer",
                            "column" : "imkj_maandcijfer",
                            "colour" : "orange",
                            "format" : "decimals"
                        }
                    ],
                    [
                        { 
                            "label" : "Aantal nieuwe respondenten",
                            "column" : "imkj_aantal_respondenten",
                            "colour" : "orange",
                            "units": "respondenten"
                        }
                    ]
                ],
                "modifiers" : []
            }
        ],
        "functionality": ['table','definitions','download'],
        "endpoints": ["tevredenheid"],
        "segment": {
            "key":"imkj_maandcijfer",  
            "cumulative": false,
            "periodization": "monthly"
        } 
    },
    {
        "slug" : "imkj_toegewezen",
        "ctrlr": "ToegewezenV1",
        "filters": [],
        "graphs": [
            {
            "slug" : "kj_toegewezen_taart",
            "ctrlr" : "PieChartSumV1",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Toegewezen",
                        "column": "ims_kj_toegekend_cumulatief",
                        "colour": "moss",
                        "scale" : "null",
                        "format": ""
                    },
                    {
                        "label": "Afgewezen",
                        "column": "ims_kj_afgewezen_cumulatief",
                        "colour": "orange",
                        "scale" : "null",
                        "format": ""
                    },
                ],
                [
                    {
                        "label": "Totaal",
                        "column": "ims_kj_afgehandeld_cumulatief",
                        "colour": "gray",
                        "scale" : "null",
                        "format": ""
                    }
                ]
            ]
            },
            {
                "slug" : "kj_toegewezen_trend",
                "ctrlr" : "BarTrendStackedMakeup",
                "filters": ["weekVsMonth"],
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Toegewezen",
                            "column": "ims_kj_toegekend",
                            "colour": "moss",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Afgewezen",
                            "column": "ims_kj_afgewezen",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                    ]
                ]    
            }
        ],
        "header": "Toegewezen /afgewezen",
        "functionality": ['table', 'definitions','download'],
        "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
        "endpoints": ["ims_wekelijks","ims_maandelijks"],
        "segment": {
            "key": "ims_kj_toegekend",
            "cumulative": false,
            "periodization": "monthly"
        }
    },
    {
        "slug" : "imkj_bezwaren",
        "ctrlr": "BezwarenV1",
        "filters": [],
        "graphs": [
            {
            "slug" : "volw_besluiten_taart",
            "ctrlr" : "BlockShareV1",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Ingediende bezwaren",
                        "column": "ims_kj_bezwaren_ingediend",
                        "colour": "orange",
                        "scale" : "null",
                        "format": ""
                    },
                    {
                        "label": "Besluiten zonder bezwaar",
                        "column": "ims_kj_besluiten_zonder_bezwaar",
                        "colour": "blue",
                        "scale" : "null",
                        "format": ""
                    },
                ],
                [
                    {
                        "label": "Besluiten",
                        "column": "ims_kj_afgehandeld_cumulatief",
                        "colour": "gray",
                        "scale" : "null",
                        "format": ""
                    }
                ]
            ],
            "segment": {
                "key" : "ims_kj_bezwaren_ingediend",
                "cumulative": true,
                "periodization": "none"
            }
            },
            {
                "slug" : "volw_bezwaren_taart",
                "ctrlr" : "PieChartSumV1",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Bezwaren beschikt",
                            "column": "ims_kj_bezwaren_afgerond",
                            "colour": "blue",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Bezwaren openstaand",
                            "column": "ims_kj_bezwaren_openstaand",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                        // {
                        //     "label": "Bezwaren ingetrokken",
                        //     "column": "ims_volw_bezwaren_ingetrokken",
                        //     "colour": "moss",
                        //     "scale" : "null",
                        //     "format": ""
                        // }
                    ],
                    [
                        {
                            "label": "Bezwaren ingediend",
                            "column": "ims_kj_bezwaren_ingediend",
                            "colour": "gray",
                            "scale" : "null",
                            "format": ""
                        }
                    ]
                ],
                "classList": ["graph-container-6"],
                "segment": {
                    "key" : "ims_kj_bezwaren_afgerond",
                    "cumulative": true,
                    "periodization": "none"
                }
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["ims_maandelijks"]
    }
];

export default group;