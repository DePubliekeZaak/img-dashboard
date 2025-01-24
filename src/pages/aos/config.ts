import { IPageMapping } from "../shared/interfaces";

const config : IPageMapping = [
    {
        "slug" : "aos_voortgang",
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
        "functionality": ['table','definitions','download'],
        "endpoints": ["historie"],
        "segment": {
            "key": "aos_meldingen_cumulatief",
            "cumulative": true,
            "periodization": "montly"
        },
    },
    {
        "slug" : "aos_trend",
        "ctrlr": "AOSGroupV1",
        "graphs": [
            {
            "slug" : "aos_trend_1",
            "ctrlr" : "BarTrendV1",
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
            ]
            }
        ],
        "header": "Ontwikkeling AOS meldingen",
        "functionality": ['table','definitions','download'],
        "description": `
            <p>In onderstaande grafiek is het historische verloop te zien van het aantal AOS-meldingen. Onder de tijdlijn op de horizontale as zijn gebeurtenissen te zien, zoals de zwaarste bevingen in onze provincie sinds het bestaan van het IMG (voorheen TCMG). Hoewel het aantal AOS-meldingen na een beving tijdelijk toeneemt, ontvangen wij constant meldingen van acuut onveilige situaties.</p>
        `,
        "definitions": ["AOS-melding","IMG","TCMG","Gegronde AOS-melding"],
        "timeline": ["Westerwijtwerd","Garrelsweer","Uithuizermeeden en Uithuizen","Wirdum"],
        "endpoints": ["historie"],
        "segment": {
            "key": "aos_meldingen",
            "cumulative": false,
            "periodization": "monthly"
        },
    }
];

export default config;