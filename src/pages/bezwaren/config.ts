import { IGroupMappingV2 } from "../shared/interfaces";

const bezwaren : IGroupMappingV2[] = [
    {
        "slug" : "bezwaren_intro",
        "ctrlr": "IntroGroupV1",
        "filters" : [],
        "graphs": [
            {
                "slug" : "bezwaren_numbers_v1",
                "ctrlr" : "NumbersMultiplesTitledV1",
                "args" : [],
                "filters": [],
                "multiples": "cumulative", 
                "parameters": [
                    [
                        { 
                            "label" : "Fysieke schade",
                            "column" : "fs_bezwaren_totaal_cumulatief",
                            "colour" : "orange",
                            "units" : "bezwaren"
                        },
                        { 
                            "label" : "IMS volwassenen",
                            "column" : "ims_volwassenen_bezwaren_ingediend_cumulatief",
                            "colour" : "blue",
                            "units": "bezwaren"
                        },
                        { 
                            "label" : "IMS kinderen & jeugd",
                            "column" : "ims_kinderen_jeugd_bezwaren_ingediend_cumulatief",
                            "colour" : "blue",
                            "units": "bezwaren"
                        },
                        { 
                            "label" : "Waardedaling",
                            "column" : "wd_bezwaren_ingediend_cumulatief",
                            "colour" : "purple",
                            "units" : "bezwaren"
                        }
                    ],
                    [   
                        { 
                            "label" : "Fysieke schade",
                            "column" : "fs_bezwaarpercentage",
                            "colour" : "orange",
                            "format": "percentage",
                            // "units" : "bezwaren"
                        },
                        { 
                            "label" : "IMS volwassenen",
                            "column" : "ims_volwassenen_bezwaarpercentage",
                            "colour" : "blue",
                            "format": "percentage",
                            // "units": "bezwaren"
                        },
                        { 
                            "label" : "IMS kinderen & jeugd",
                            "column" : "ims_kinderen_jeugd_bezwaarpercentage",
                            "colour" : "blue",
                            "format": "percentage",
                            // "units": "bezwaren"
                        },
                        { 
                            "label" : "Waardedaling",
                            "column" : "wd_bezwaarpercentage",
                            "colour" : "purple",
                            "format": "percentage",
                            // "units" : "bezwaren"
                        }
                    ]
                ],
                "modifiers" : [],
                "segment": {
                    "key": "fs_bezwaren_totaal",
                    "cumulative": false,
                    "periodization": "weekly"
                },
            },

        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["bezwaren"]
    },
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
        "segment": {
            "key" : "bezwaren_gegrond",
            "cumulative": false,
            "periodization": "none"
        }
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
                        "column": "ims_volw_bezwaren_ingediend_cumulatief",
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
                            "column": "ims_volw_bezwaren_beschikt_cumulatief",
                            "colour": "blue",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Bezwaren openstaand",
                            "column": "ims_volw_bezwaren_openstaand_cumulatief",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Bezwaren ingetrokken",
                            "column": "ims_volw_bezwaren_ingetrokken_cumulatief",
                            "colour": "moss",
                            "scale" : "null",
                            "format": ""
                        }
                    ],
                    [
                        {
                            "label": "Bezwaren ingediend",
                            "column": "ims_volw_bezwaren_ingediend_cumulatief",
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
        "segment": {
            "key" : "ims_volw_bezwaren_beschikt",
            "cumulative": false,
            "periodization": "none"
        }
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
                        "column": "ims_kj_bezwaren_ingediend_cumulatief",
                        "colour": "orange",
                        "scale" : "null",
                        "format": ""
                    },
                    // {
                    //     "label": "Besluiten zonder bezwaar",
                    //     "column": "ims_kj_besluiten_zonder_bezwaar_cumulatief",
                    //     "colour": "blue",
                    //     "scale" : "null",
                    //     "format": ""
                    // },
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
                "slug" : "kj_bezwaren_taart",
                "ctrlr" : "PieChartSumV1",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Bezwaren beschikt",
                            "column": "ims_kj_bezwaren_afgerond_cumulatief",
                            "colour": "blue",
                            "scale" : "null",
                            "format": ""
                        },
                        {
                            "label": "Bezwaren openstaand",
                            "column": "ims_kj_bezwaren_openstaand_cumulatief",
                            "colour": "orange",
                            "scale" : "null",
                            "format": ""
                        }
                    ],
                    [
                        {
                            "label": "Bezwaren ingediend",
                            "column": "ims_kj_bezwaren_ingediend_cumulatief",
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
        "segment": {
            "key" : "ims_kj_bezwaren_afgerond",
            "cumulative": false,
            "periodization": "none"
        }
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
                    }
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
        "segment": {
            "key" : "wd_bezwaren_afgehandeld",
            "cumulative": false,
            "periodization": "none"
        }
    }
];

export default bezwaren;