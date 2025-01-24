import { IGroupMappingV2 } from "../shared/interfaces";

const bezwaren : IGroupMappingV2[] = [
    {
        "slug" : "bezwaren_fs",
        "ctrlr": "BezwarenGroupV1",
        "graphs": [
            {
            "slug" : "bezwaren_taart",
            "ctrlr" : "PieChartSumV1",
            "args" : [],
            "parameters": [[
                {
                    "label": "Gegrond",
                    "column": "bezwaren_gegrond",
                    "colour": "purple"
                },
                {
                    "label": "Deels gegrond",
                    "column": "bezwaren_deels_gegrond",
                    "colour": "lightBlue"
                },
                {
                    "label": "Ongegrond",
                    "column": "bezwaren_ongegrond",
                    "colour": "blue"
                },
                {
                    "label": "Niet ontvankelijk",
                    "column": "bezwaren_niet_ontvankelijk",
                    "colour": "moss"
                },
                {
                    "label": "Ingetrokken",
                    "column": "bezwaren_ingetrokken",
                    "colour": "green"
                },
                {
                    "label": "Naar schadeprocedure",
                    "column": "bezwaren_doorgezet",
                    "colour": "brown"
                },
                {
                    "label": "In behandeling",
                    "column": "bezwaren_in_behandeling",
                    "colour": "orange"
                }
            ],
            [
                {
                    "label": "Totaal",
                    "column": "bezwaren_totaal",
                    "colour": "orange"
                }
            ]
        ]
        }
        ],
        "header": "Bezwaren",
        "functionality": ['tableView', 'download'],
        "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
        "endpoints": ["reacties?gemeente=eq.all"],
        "segment": "meldingen",
    },
    {
        "slug" : "bezwaren_ims_volw",
        "ctrlr": "BezwarenV1",
        "filters": [],
        "graphs": [
            {
            "slug" : "volw_besluiten_taart",
            "ctrlr" : "BlockShareV1",
            "filters": [],
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Bezwaren",
                        "column": "ims_volw_bezwaren_ingediend",
                        "colour": "moss",
                        "scale" : "null",
                        "format": ""
                    }
                ],
                [
                    {
                        "label": "Besluiten",
                        "column": "ims_volw_besluiten_cumulatief",
                        "colour": "blue",
                        "scale" : "null",
                        "format": ""
                    }
                ]
            ]
            },
            {
                "slug" : "bezwaren_ims_volw",
                "ctrlr" : "PieChartSumV1",
                "filters": [],
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
                ],
                "classList": ["graph-container-6"]
            }
          
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["ims_wekelijks"],
        "segment": "all",
    },
    {
        "slug" : "bezwaren_imkj",
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
            ]
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
                "classList": ["graph-container-6"]
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["ims_maandelijks"],
        "segment": "all",
    },
    {
        "slug" : "bezwaren_wd",
        "ctrlr": "BezwarenV1",
        "filters": [],
        "graphs": [
            {
            "slug" : "wd_besluiten_taart",
            "ctrlr" : "BlockShareV1",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Ingediende bezwaren",
                        "column": "wd_bezwaren_ingediend",
                        "colour": "orange",
                        "scale" : "null",
                        "format": ""
                    },
                    // {
                    //     "label": "Besluiten zonder bezwaar",
                    //     "column": "ims_volw_besluiten_zonder_bezwaar",
                    //     "colour": "blue",
                    //     "scale" : "null",
                    //     "format": ""
                    // },
                ],
                [
                    {
                        "label": "Besluiten",
                        "column": "wd_besluiten_cumulatief",
                        "colour": "blue",
                        "scale" : "null",
                        "format": ""
                    }
                ]
            ]
            },
            {
                "slug" : "wd_bezwaren_taart",
                "ctrlr" : "PieChartSumV1",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Bezwaren beschikt",
                            "column": "wd_bezwaren_afgehandeld",
                            "colour": "blue",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Bezwaren openstaand",
                            "column": "wd_bezwaren_openstaand",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                    ],
                    [
                        {
                            "label": "Bezwaren in afwachting",
                            "column": "wd_bezwaren_in_afwachting",
                            "colour": "moss",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Bezwaren ingediend",
                            "column": "wd_bezwaren_ingediend",
                            "colour": "gray",
                            "scale" : "null",
                            "format": ""
                        }
                    ]
                ],
                "classList": ["graph-container-6"]
            }
          
        ],
        "header": "Bezwaren",
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["wd_maandelijks"],
        "segment": "all",
    }
];

export default bezwaren;