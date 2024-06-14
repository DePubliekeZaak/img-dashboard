import { IPageMapping } from "../shared/interfaces";

const config : IPageMapping = [
    {
        "slug" : "history_meldingen",
        "ctrlr": "ProgressGroupV1",
        "graphs": [
            {
                "slug" : "ims_total_numbers",
                "ctrlr" : "NumbersV1",
                "args" : [],
                "parameters": [
                    [
                        { 
                            "label" : "Schademeldingen",
                            "column" : "fysieke_schade_meldingen_cumulatief",
                            "colour" : "blue",
                            "units" : "totaal"
                        },
                        { 
                            "label" : "Overgenomen van CVW",
                            "column" : "fysieke_schade_meldingen_cvw_cumulatief",
                            "colour" : "orange",
                            "units": "overgenomen van CVW"
                        },
                        { 
                            "label" : "Gemeld bij IMG",
                            "column" : "fysieke_schade_meldingen_img_cumulatief",
                            "colour" : "moss",
                            "units": "gemeld bij IMG"
                        }
                    ],
                    [
                    ]
                ]
            },
            {
            "slug" : "fysieke_schade",
            "ctrlr" : "BarTrendV1",
            "args" : [],
            "filters" : [],
            "parameters": [
                [
                    {
                        "label": "Schademeldingen",
                        "column": "fysieke_schade_meldingen",
                        "colour": "moss",
                        "excludeFromTable": true
                    },
                    { 
                        "label" : "Overgenomen van CVW",
                        "column" : "fysieke_schade_meldingen_cvw",
                        "colour" : "orange",
                        "units": "overgenomen van CVW",
                        "excludeFromTable": true
                    }
                ]
            ],
            // "modifiers": [
            //     [
            //         {
            //             "label": "toename",
            //             "column": "{}",
            //             "colour": "orange"
            //         },
            //         {
            //             "label": "cumulatief",
            //             "column": "{}_cumulatief",
            //             "colour": "orange"
            //         }  
            //     ]
            // ]
        }
        ], 
        "header": "Schademeldingen",
        "functionality": ['table', 'definitions','download'],
        "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
        "endpoints": ["historie"],
        "segment": "fysieke_schade_meldingen",
    },
    {
        "slug" : "meldingen_geo",
        "ctrlr": "GeoGroupV1",
        "graphs": [
            {
                "slug" : "gem_bedrag_geo",
                "ctrlr" : "MapV1",
                "multiples" : "grouped",
                "filters": [],
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Schademeldingen",
                            "column": "schademeldingen",
                            "colour": "orange",
                            "format": ""
                        }
                    ],
                    []
                ]
            }
        ],
        "header": "Spreiding van schademeldingen",
        "functionality": ['table', 'definitions','download'],
        "description": "Mag ik dit delen door aantal inwoners van gemeente? ",
        "endpoints": ["map"],
        "segment": "schademeldingen",
    },
];

export default config;