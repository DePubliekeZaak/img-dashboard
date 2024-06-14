import { IGroupMappingV2 } from "../shared/interfaces";

const group : IGroupMappingV2[] = [
    {
        "slug" : "waardering_doorlopend",
        "ctrlr": "GeaggregeerdV1",
        "graphs": [
            {
            "slug" : "algemeen_numbers",
            "ctrlr" : "NumbersPlusRespondentsV1",
            "args" : [],
            "parameters": [
                [
                    { 
                        "label" : "Sinds de start",
                        "column": "doorlopend_cijfer",
                        "units": "doorlopend",
                        "colour": "blue",
                        "format": "decimals"
                    },
                    { 
                        "label" : "Afgelopen maand",
                        "column": "maandcijfer",
                        "units": "afgelopen maand",
                        "colour": "moss",
                        "format": "decimals"
                    }
                ],
                [
                    { 
                        "label" : "Aantal respondenten",
                        "column": "aantal_respondenten",
                        "units": "respondenten sinds start",
                        "colour": "orange"
                    },
                    { 
                        "label" : "Maand respondenten",
                        "column": "aantal_respondenten_maand",
                        "units": "resp. afgelopen maand",
                        "colour": "orange"
                    }
                ]
            ]
            },
            {
                "slug" : "algemeen_trend",
                "ctrlr" : "BarTrend",
                "args" : [],
                "parameters": [
                    [
                        { 
                            "label" : "Afgelopen maand",
                            "column": "maandcijfer",
                            "units": "afgelopen maand",
                            "colour": "blue",
                            "format": "decimals"
                        }
                    ]
                ]
            }
        ],
        "header": "Algemene cijfers",
        "functionality": ['table', 'definitions','download'],
        "description": "Het betreft hier een gemiddelde gebaseerd op alle reacties die sinds de start van diverse metingen zijn binnengekomen. Er wordt daarbij voor verschillende regelingen per e-mail om een reactie gevraagd kort nadat het besluit is bekend gemaakt bij de aanvrager. Na een besluit over de aanvraag tot vergoeding van fysieke schade wordt gevraagd: “Welk rapportcijfer geeft u het besluit dat u ontvangen heeft? (1-10)” Na een besluit over de aanvraag tot vergoeding van waardedaling wordt gevraagd: “Hoe tevreden bent u over het indienen en afhandelen van uw aanvraag?(1-10)” Hoe meer besluiten er zijn genomen bij die specifieke regeling, hoe zwaarder dat gemiddelde vervolgens meetelt bij het tevredenheidscijfer voor het IMG als geheel. Onder het totaalcijfer over de gehele periode, staat het doorlopend gemiddelde totaalcijfer voor die maand weergegeven.",
        "endpoints": ["tevredenheid"],
        "segment": "",
    },
    {
        "slug" : "waardering_fs",
        "ctrlr": "KTOGroupV1",
        "graphs": [
            {
            "slug" : "fs_cijfer",
            "ctrlr" : "KTORatingsV1",
            "filters" : ["monthSelect"],
            "args" : ["fysieke_schade_aantal_respondenten_doorlopend","fysieke_schade_aantal_respondenten"],
            "parameters": [
                [
                    {
                        "label": "Doorlopend",
                        "column": "fysieke_schade_doorlopend_cijfer",
                        "colour": "orange"
                    },
                    {
                        "label": "Maandcijfer",
                        "column": "fysieke_schade_maandcijfer",
                        "colour": "orange"
                    },
                    {
                        "label": "Respondenten doorlopend",
                        "column": "fysieke_schade_aantal_respondenten_doorlopend",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "Respondenten",
                        "column": "fysieke_schade_aantal_respondenten",
                        "colour": "orange"
                    }
                ],
                [
                    {
                        "label": "1",
                        "column": "fysieke_schade_doorlopend_rapportcijfer_1",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "2",
                        "column": "fysieke_schade_doorlopend_rapportcijfer_2",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "3",
                        "column": "fysieke_schade_doorlopend_rapportcijfer_3",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "4",
                        "column": "fysieke_schade_doorlopend_rapportcijfer_4",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "5",
                        "column": "fysieke_schade_doorlopend_rapportcijfer_5",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "6",
                        "column": "fysieke_schade_doorlopend_rapportcijfer_6",
                        "colour": "blue",
                        "excludeFromTable": true
                    },
                    {
                        "label": "7",
                        "column": "fysieke_schade_doorlopend_rapportcijfer_7",
                        "colour": "blue",
                        "excludeFromTable": true
                    },
                    {
                        "label": "8",
                        "column": "fysieke_schade_doorlopend_rapportcijfer_8",
                        "colour": "moss",
                        "excludeFromTable": true
                    },
                    {
                        "label": "9",
                        "column": "fysieke_schade_doorlopend_rapportcijfer_9",
                        "colour": "moss",
                        "excludeFromTable": true
                    },
                    {
                        "label": "10",
                        "column": "fysieke_schade_doorlopend_rapportcijfer_10",
                        "colour": "moss",
                        "excludeFromTable": true
                    }
                ],
                [
                    {
                        "label": "1",
                        "column": "fysieke_schade_maand_rapportcijfer_1",
                        "colour": "orange"
                    },
                    {
                        "label": "2",
                        "column": "fysieke_schade_maand_rapportcijfer_2",
                        "colour": "orange"
                    },
                    {
                        "label": "3",
                        "column": "fysieke_schade_maand_rapportcijfer_3",
                        "colour": "orange"
                    },
                    {
                        "label": "4",
                        "column": "fysieke_schade_maand_rapportcijfer_4",
                        "colour": "orange"
                    },
                    {
                        "label": "5",
                        "column": "fysieke_schade_maand_rapportcijfer_5",
                        "colour": "orange"
                    },
                    {
                        "label": "6",
                        "column": "fysieke_schade_maand_rapportcijfer_6",
                        "colour": "blue"
                    },
                    {
                        "label": "7",
                        "column": "fysieke_schade_maand_rapportcijfer_7",
                        "colour": "blue"
                    },
                    {
                        "label": "8",
                        "column": "fysieke_schade_maand_rapportcijfer_8",
                        "colour": "moss"
                    },
                    {
                        "label": "9",
                        "column": "fysieke_schade_maand_rapportcijfer_9",
                        "colour": "moss"
                    },
                    {
                        "label": "10",
                        "column": "fysieke_schade_maand_rapportcijfer_10",
                        "colour": "moss"
                    },
                ]
            ]
            },
            {
                "slug" : "algemeen_trend",
                "ctrlr" : "BarTrend",
                "args" : [],
                "parameters": [
                    [
                        { 
                            "label" : "Afgelopen maand",
                            "column": "fysieke_schade_maandcijfer",
                            "units": "afgelopen maand",
                            "colour": "orange",
                            "format": "decimals",
                            "excludeFromTable": true
                        }
                    ]
                ]
            }
        ],
        "header": "Fysieke schade",
        "functionality": ['table', 'definitions','download'],
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "endpoints": ["tevredenheid"],
        "segment": "all",
    },
    {
        "slug" : "waardering_ves",
        "ctrlr": "KTOGroupV1",
        "graphs": [
            {
            "slug" : "fs_cijfer",
            "ctrlr" : "KTORatingsV1",
            "filters" : ["monthSelect"],
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Doorlopend",
                        "column": "ves_doorlopend_cijfer",
                        "colour": "moss"
                    },
                    {
                        "label": "Maandcijfer",
                        "column": "ves_maandcijfer",
                        "colour": "moss"
                    },
                    {
                        "label": "Respondenten doorlopend",
                        "column": "ves_aantal_respondenten_doorlopend",
                        "colour": "moss",
                        "excludeFromTable": true
                    },
                    {
                        "label": "Respondenten",
                        "column": "ves_aantal_respondenten",
                        "colour": "moss"
                    }
                ],
                [
                    {
                        "label": "1",
                        "column": "ves_doorlopend_rapportcijfer_1",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "2",
                        "column": "ves_doorlopend_rapportcijfer_2",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "3",
                        "column": "ves_doorlopend_rapportcijfer_3",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "4",
                        "column": "ves_doorlopend_rapportcijfer_4",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "5",
                        "column": "ves_doorlopend_rapportcijfer_5",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "6",
                        "column": "ves_doorlopend_rapportcijfer_6",
                        "colour": "blue",
                        "excludeFromTable": true
                    },
                    {
                        "label": "7",
                        "column": "ves_doorlopend_rapportcijfer_7",
                        "colour": "blue",
                        "excludeFromTable": true
                    },
                    {
                        "label": "8",
                        "column": "ves_doorlopend_rapportcijfer_8",
                        "colour": "moss",
                        "excludeFromTable": true
                    },
                    {
                        "label": "9",
                        "column": "ves_doorlopend_rapportcijfer_9",
                        "colour": "moss",
                        "excludeFromTable": true
                    },
                    {
                        "label": "10",
                        "column": "ves_doorlopend_rapportcijfer_10",
                        "colour": "moss",
                        "excludeFromTable": true
                    }
                ],
                [
                    {
                        "label": "1",
                        "column": "ves_maand_rapportcijfer_1",
                        "colour": "orange"
                    },
                    {
                        "label": "2",
                        "column": "ves_maand_rapportcijfer_2",
                        "colour": "orange"
                    },
                    {
                        "label": "3",
                        "column": "ves_maand_rapportcijfer_3",
                        "colour": "orange"
                    },
                    {
                        "label": "4",
                        "column": "ves_maand_rapportcijfer_4",
                        "colour": "orange"
                    },
                    {
                        "label": "5",
                        "column": "ves_maand_rapportcijfer_5",
                        "colour": "orange"
                    },
                    {
                        "label": "6",
                        "column": "ves_maand_rapportcijfer_6",
                        "colour": "blue"
                    },
                    {
                        "label": "7",
                        "column": "ves_maand_rapportcijfer_7",
                        "colour": "blue"
                    },
                    {
                        "label": "8",
                        "column": "ves_maand_rapportcijfer_8",
                        "colour": "moss"
                    },
                    {
                        "label": "9",
                        "column": "ves_maand_rapportcijfer_9",
                        "colour": "moss"
                    },
                    {
                        "label": "10",
                        "column": "ves_maand_rapportcijfer_10",
                        "colour": "moss"
                    },
                ]
            ]
            },
            {
                "slug" : "algemeen_trend",
                "ctrlr" : "BarTrend",
                "args" : [],
                "parameters": [
                    [
                        { 
                            "label" : "Afgelopen maand",
                            "column": "ves_maandcijfer",
                            "units": "afgelopen maand",
                            "colour": "moss",
                            "format": "decimals",
                            "excludeFromTable": true
                        }
                    ]
                ]
            }
        ],
        "header": "Vaste vergoeding",
        "functionality": ['table', 'definitions','download'],
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "endpoints": ["tevredenheid"],
        "segment": "all",
    },
    {
        "slug" : "waardering_wd",
        "ctrlr": "KTOGroupV1",
        "graphs": [
            {
            "slug" : "fs_cijfer",
            "ctrlr" : "KTORatingsV1",
            "filters" : ["monthSelect"],
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Doorlopend",
                        "column": "waardedaling_doorlopend_cijfer",
                        "colour": "blue"
                    },
                    {
                        "label": "Maandcijfer",
                        "column": "waardedaling_maandcijfer",
                        "colour": "blue"
                    },
                    {
                        "label": "Respondenten doorlopend",
                        "column": "waardedaling_aantal_respondenten_doorlopend",
                        "colour": "blue",
                        "excludeFromTable": true
                    },
                    {
                        "label": "Respondenten",
                        "column": "waardedaling_aantal_respondenten",
                        "colour": "blue"
                    }
                ],
                [
                    {
                        "label": "1",
                        "column": "waardedaling_doorlopend_rapportcijfer_1",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "2",
                        "column": "waardedaling_doorlopend_rapportcijfer_2",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "3",
                        "column": "waardedaling_doorlopend_rapportcijfer_3",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "4",
                        "column": "waardedaling_doorlopend_rapportcijfer_4",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "5",
                        "column": "waardedaling_doorlopend_rapportcijfer_5",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "6",
                        "column": "waardedaling_doorlopend_rapportcijfer_6",
                        "colour": "blue",
                        "excludeFromTable": true
                    },
                    {
                        "label": "7",
                        "column": "waardedaling_doorlopend_rapportcijfer_7",
                        "colour": "blue",
                        "excludeFromTable": true
                    },
                    {
                        "label": "8",
                        "column": "waardedaling_doorlopend_rapportcijfer_8",
                        "colour": "moss",
                        "excludeFromTable": true
                    },
                    {
                        "label": "9",
                        "column": "waardedaling_doorlopend_rapportcijfer_9",
                        "colour": "moss",
                        "excludeFromTable": true
                    },
                    {
                        "label": "10",
                        "column": "waardedaling_doorlopend_rapportcijfer_10",
                        "colour": "moss",
                        "excludeFromTable": true
                    }
                ],
                [
                    {
                        "label": "1",
                        "column": "waardedaling_maand_rapportcijfer_1",
                        "colour": "orange"
                    },
                    {
                        "label": "2",
                        "column": "waardedaling_maand_rapportcijfer_2",
                        "colour": "orange"
                    },
                    {
                        "label": "3",
                        "column": "waardedaling_maand_rapportcijfer_3",
                        "colour": "orange"
                    },
                    {
                        "label": "4",
                        "column": "waardedaling_maand_rapportcijfer_4",
                        "colour": "orange"
                    },
                    {
                        "label": "5",
                        "column": "waardedaling_maand_rapportcijfer_5",
                        "colour": "orange"
                    },
                    {
                        "label": "6",
                        "column": "waardedaling_maand_rapportcijfer_6",
                        "colour": "blue"
                    },
                    {
                        "label": "7",
                        "column": "waardedaling_maand_rapportcijfer_7",
                        "colour": "blue"
                    },
                    {
                        "label": "8",
                        "column": "waardedaling_maand_rapportcijfer_8",
                        "colour": "moss"
                    },
                    {
                        "label": "9",
                        "column": "waardedaling_maand_rapportcijfer_9",
                        "colour": "moss"
                    },
                    {
                        "label": "10",
                        "column": "waardedaling_maand_rapportcijfer_10",
                        "colour": "moss"
                    },
                ]
            ]
            },
            {
                "slug" : "algemeen_trend",
                "ctrlr" : "BarTrend",
                "args" : [],
                "parameters": [
                    [
                        { 
                            "label" : "Afgelopen maand",
                            "column": "waardedaling_maandcijfer",
                            "units": "afgelopen maand",
                            "colour": "blue",
                            "format": "decimals",
                            "excludeFromTable": true
                        }
                    ]
                ]
            }
        ],
        "header": "Waardededaling",
        "functionality": ['table', 'definitions','download'],
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "endpoints": ["tevredenheid"],
        "segment": "all",
    },
    {
        "slug" : "waardering_ims",
        "ctrlr": "KTOGroupV1",
        "graphs": [
            {
            "slug" : "fs_cijfer",
            "ctrlr" : "KTORatingsV1",
            "filters" : ["monthSelect"],
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Doorlopend",
                        "column": "ims_doorlopend_cijfer",
                        "colour": "moss"
                    },
                    {
                        "label": "Maandcijfer",
                        "column": "ims_maandcijfer",
                        "colour": "moss"
                    },
                    {
                        "label": "Respondenten doorlopend",
                        "column": "ims_aantal_respondenten_doorlopend",
                        "colour": "moss",
                        "excludeFromTable": true
                    },
                    {
                        "label": "Respondenten",
                        "column": "ims_aantal_respondenten",
                        "colour": "moss"
                    }
                ],
                [
                    {
                        "label": "1",
                        "column": "ims_doorlopend_rapportcijfer_1",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "2",
                        "column": "ims_doorlopend_rapportcijfer_2",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "3",
                        "column": "ims_doorlopend_rapportcijfer_3",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "4",
                        "column": "ims_doorlopend_rapportcijfer_4",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "5",
                        "column": "ims_doorlopend_rapportcijfer_5",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "6",
                        "column": "ims_doorlopend_rapportcijfer_6",
                        "colour": "blue",
                        "excludeFromTable": true
                    },
                    {
                        "label": "7",
                        "column": "ims_doorlopend_rapportcijfer_7",
                        "colour": "blue",
                        "excludeFromTable": true
                    },
                    {
                        "label": "8",
                        "column": "ims_doorlopend_rapportcijfer_8",
                        "colour": "moss",
                        "excludeFromTable": true
                    },
                    {
                        "label": "9",
                        "column": "ims_doorlopend_rapportcijfer_9",
                        "colour": "moss",
                        "excludeFromTable": true
                    },
                    {
                        "label": "10",
                        "column": "ims_doorlopend_rapportcijfer_10",
                        "colour": "moss",
                        "excludeFromTable": true
                    }
                ],
                [
                    {
                        "label": "1",
                        "column": "ims_maand_rapportcijfer_1",
                        "colour": "orange"
                    },
                    {
                        "label": "2",
                        "column": "ims_maand_rapportcijfer_2",
                        "colour": "orange"
                    },
                    {
                        "label": "3",
                        "column": "ims_maand_rapportcijfer_3",
                        "colour": "orange"
                    },
                    {
                        "label": "4",
                        "column": "ims_maand_rapportcijfer_4",
                        "colour": "orange"
                    },
                    {
                        "label": "5",
                        "column": "ims_maand_rapportcijfer_5",
                        "colour": "orange"
                    },
                    {
                        "label": "6",
                        "column": "ims_maand_rapportcijfer_6",
                        "colour": "blue"
                    },
                    {
                        "label": "7",
                        "column": "ims_maand_rapportcijfer_7",
                        "colour": "blue"
                    },
                    {
                        "label": "8",
                        "column": "ims_maand_rapportcijfer_8",
                        "colour": "moss"
                    },
                    {
                        "label": "9",
                        "column": "ims_maand_rapportcijfer_9",
                        "colour": "moss"
                    },
                    {
                        "label": "10",
                        "column": "ims_maand_rapportcijfer_10",
                        "colour": "moss"
                    },
                ]
            ]
            },
            {
                "slug" : "algemeen_trend",
                "ctrlr" : "BarTrend",
                "args" : [],
                "parameters": [
                    [
                        { 
                            "label" : "Afgelopen maand",
                            "column": "ims_maandcijfer",
                            "units": "afgelopen maand",
                            "colour": "moss",
                            "format": "decimals",
                            "excludeFromTable": true
                        }
                    ]
                ]
            }
        ],
        "header": "Immateriele schade",
        "functionality": ['table', 'definitions','download'],
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "endpoints": ["tevredenheid"],
        "segment": "all",
    }
];

export default group;