import { IPageMapping } from "../shared/interfaces";

const config : IPageMapping = [
    {
        "slug" : "aos_numbers",
        "ctrlr": "AOSNumberGroupV1",
        "graphs": [
            {
            "slug" : "aos_numbers_1",
            "ctrlr" : "NumbersV1",
            "filters": [],
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Meldingen",
                        "column": "aos_meldingen_cumulatief",
                        "units": "meldingen",
                        "colour": "orange"
                    },
                    {
                        "label": "Acuut Onveilige Situatie",
                        "column": "aos_meldingen_gegrond_cumulatief",
                        "units": "acuut onveilige situaties",
                        "colour": "moss"
                    },
                    {
                        "label": "Percentage gegronde meldingen",
                        "column": "aos_percentage_gegrond_cumulatief",
                        "units": "gegronde meldingen",
                        "colour": "blue",
                        "format": "percentage"
                    }
                ]
            ],
            }
        ],
        "header": "AOS meldingen",
        "functionality": ['table','definitions','download'],
        "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
        "endpoints": ["historie"],
        "segment": "",
    },
    {
        "slug" : "aos_trend",
        "ctrlr": "AOSGroupV1",
        "graphs": [
            {
            "slug" : "aos_trend_1",
            "ctrlr" : "AOSBarTrendV1",
            "filters": [],
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "meldingen",
                        "column": "aos_meldingen",
                        "colour": "blue"
                    },
                    {
                        "label": "Acuut Onveilige Situatie",
                        "column": "aos_meldingen_gegrond",
                        "colour": "orange"
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
        "header": "Ontwikkeling AOS meldingen",
        "functionality": ['table','definitions','download'],
        "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
        "endpoints": ["historie"],
        "segment": "aos_meldingen",
    },
    {
        "slug" : "aos_trend_percentage",
        "ctrlr": "AOSPercentageGroupV1",
        "graphs": [
            {
            "slug" : "aos_trend_1",
            "ctrlr" : "PercentageTrendV1",
            "filters": [],
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Percentage",
                        "column": "aos_percentage_gegrond",
                        "colour": "moss",
                        "format": "percentage"
                    }
                ]
            ]
            }
        ],
        "header": "Percentage gegronde meldingen",
        "functionality": ['table','definitions','download'],
        "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
        "endpoints": ["historie"],
        "segment": "aos_percentage_gegrond",
    }
];

export default config;