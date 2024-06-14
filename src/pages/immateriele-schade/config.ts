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
                            "units" : "aanvragen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "ims_totaal_afgehandeld_cumulatief",
                            "colour" : "moss",
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
                ]
            },
            {
            "slug" : "ims_total_trend",
            "ctrlr" : "BarTrend",
            "args" : [],
            "filters": ["combiSelect"],
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
            ]
            }
        ],
        "header": "Totalen",
        "functionality": ['table', 'definitions','download'],
        "description": "Lorem ipsum",
        "endpoints": ["immateriele_schade_maandelijks"],
        "segment": "ims_totaal_aanvragen",
    },
    {
        "slug" : "ims_makeup",
        "ctrlr": "MakeupGroupTrendV1",
        "graphs": [
            {
            "slug" : "ims_makeup_trend",
            "ctrlr" : "BarTrendStackedMakeup",
            "args" : [],
            "filters": [],
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
                // [
                //     {
                //         "label": "toename",
                //         "column": "{}",
                //         "colour": "orange"
                //     },
                //     {
                //         "label": "cumulatief",
                //         "column": "{}_cumulatief",
                //         "colour": "orange"
                //     },   
                // ]
            ]
            }
        ],
        "header": "Subregelingen",
        "functionality": ['table', 'definitions','download'],
        "description": "Lorem ipsum",
        "endpoints": ["immateriele_schade_maandelijks"],
        "segment": "ims_volw_aanvragen",
    },
    {
        "slug" : "ims_volw_totals",
        "ctrlr": "MultipleGroupV1",
        "filters" : ["totaalVsRecent"],
        "graphs": [
            {
                "slug" : "ims_volw_numbers",
                "ctrlr" : "NumbersMultiplesV1",
                "args" : [],
                "multiples": "numbers", 
                "parameters": [
                    [
                        { 
                            "label" : "Aanvragen",
                            "column" : "ims_volw_aanvragen",
                            "colour" : "orange",
                            "units" : "aanvragen"
                        },
                        { 
                            "label" : "Afgehandeld",
                            "column" : "ims_volw_besluiten",
                            "colour" : "moss",
                            "units": "afgehandeld"
                        },
                        { 
                            "label" : "Verleend",
                            "column" : "ims_volw_verleend",
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
        "header": "Volwassenen",
        "functionality": ['table', 'definitions','download'],
        "description": "Lorem ipsum",
        "endpoints": ["immateriele_schade_maandelijks"],
        "segment": "doorlopend",
    },
    {
        "slug" : "volwassenen_toegewezen",
        "ctrlr": "PieGroupV1",
        "filters": [],
        "graphs": [
            {
            "slug" : "volw_toegewezen_taart",
            "ctrlr" : "PieChartSumV1",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Toegewezen",
                        "column": "ims_volw_toegewezen_cumulatief",
                        "colour": "moss",
                        "scale" : "null",
                        "format": ""
                    },
                    {
                        "label": "Afgewezen",
                        "column": "ims_volw_afgewezen_cumulatief",
                        "colour": "orange",
                        "scale" : "null",
                        "format": ""
                    },
                ],
                [
                    {
                        "label": "Totaal",
                        "column": "ims_volw_besluiten_cumulatief",
                        "colour": "gray",
                        "scale" : "null",
                        "format": ""
                    }
                ]
            ]
            },
            {
                "slug" : "volw_toegewezen_trend",
                "ctrlr" : "BarTrendStackedMakeupV2",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Toegewezen",
                            "column": "ims_volw_toegewezen",
                            "colour": "moss",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Afgewezen",
                            "column": "ims_volw_afgewezen",
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
        "endpoints": ["immateriele_schade_maandelijks"],
        "segment": "all",
    },
    {
        "slug" : "volwassenen_bezwaren",
        "ctrlr": "PieGroupDuoV1",
        "filters": [],

        "graphs": [
            {
            "slug" : "volw_besluiten_taart",
            "ctrlr" : "PieChartSumV2",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Ingediende bezwaren",
                        "column": "ims_volw_bezwaren_ingediend",
                        "colour": "orange",
                        "scale" : "null",
                        "format": ""
                    },
                ],
                [
                    {
                        "label": "Besluiten",
                        "column": "ims_volw_besluiten_cumulatief",
                        "colour": "gray",
                        "scale" : "null",
                        "format": ""
                    }
                ]
            ]
            },
            {
                "slug" : "volw_bezwaren_taart",
                "ctrlr" : "PieChartSumV2",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Bezwaren beschikt",
                            "column": "ims_volw_bezwaren_beschikt",
                            "colour": "blue",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Bezwaren openstaand",
                            "column": "ims_volw_bezwaren_openstaand",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Bezwaren ingetrokken",
                            "column": "ims_volw_bezwaren_ingetrokken",
                            "colour": "moss",
                            "scale" : "null",
                            "format": ""
                        }
                    ],
                    [
                        {
                            "label": "Bezwaren ingediend",
                            "column": "ims_volw_bezwaren_ingediend",
                            "colour": "gray",
                            "scale" : "null",
                            "format": ""
                        }
                    ]
                ]
            }
          
        ],
        "header": "Bezwaren",
        "functionality": ['table', 'definitions','download'],
        "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
        "endpoints": ["immateriele_schade_maandelijks"],
        "segment": "all",
    }

];

export default group;