import { IGroupMappingV2 } from "../shared/interfaces";

const group : IGroupMappingV2[] = [
    {
        "slug" : "waardering_alle_regelingen",
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
                "ctrlr" : "BarTrendV1",
                "filters" : [],
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
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["tevredenheid"],
        "segment": {
            "key":"maandcijfer",  
            "cumulative": false,
            "periodization": "monthly"
        },
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
                ],
                
            ],
            "segment": {
                    "key":"all",  
                    "cumulative": false,
                    "periodization": "monthly"
                }
            },
            {
                "slug" : "algemeen_trend",
                "ctrlr" : "BarTrendV1",
                "filters" : [],
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
                ],
                "segment": {
                    "key":"fysieke_schade_maandcijfer",  
                    "cumulative": false,
                    "periodization": "monthly"
                },
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["tevredenheid","tevredenheid"]
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
                ],
            ],
            "segment": {
                    "key":"all",  
                    "cumulative": false,
                    "periodization": "monthly"
                }
            },
            {
                "slug" : "algemeen_trend",
                "ctrlr" : "BarTrendV1",
                "filters" : [],
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
                ],
                "segment": {
                    "key":"ves_maandcijfer",  
                    "cumulative": false,
                    "periodization": "monthly"
                }
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["tevredenheid","tevredenheid"]
        
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
            ],
            "segment": {
                    "key":"all",  
                    "cumulative": false,
                    "periodization": "monthly"
                }
            },
            {
                "slug" : "algemeen_trend",
                "ctrlr" : "BarTrendV1",
                "filters" : [],
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
                ],
                "segment": {
                    "key":"waardedaling_maandcijfer",  
                    "cumulative": false,
                    "periodization": "monthly"
                },
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["tevredenheid"]
    },
    {
        "slug" : "waardering_ims_volw",
        "ctrlr": "KTOGroupV1",
        "graphs": [
            {
            "slug" : "ims_cijfer_volw",
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
            ],
            "segment": {
                    "key":"all",  
                    "cumulative": false,
                    "periodization": "monthly"
                }
            },
            {
                "slug" : "algemeen_trend",
                "ctrlr" : "BarTrendV1",
                "filters" : [],
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
                ],
                "segment": {
                    "key":"ims_maandcijfer",  
                    "cumulative": false,
                    "periodization": "monthly"
                }
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["tevredenheid"],
    },
    {
        "slug" : "waardering_imkj",
        "ctrlr": "KTOGroupV1",
        "graphs": [
            {
            "slug" : "im_cijfer_kj",
            "ctrlr" : "KTORatingsV1",
            "filters" : ["monthSelect"],
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Doorlopend",
                        "column": "imkj_doorlopend_cijfer",
                        "colour": "moss"
                    },
                    {
                        "label": "Maandcijfer",
                        "column": "imkj_maandcijfer",
                        "colour": "moss"
                    },
                    {
                        "label": "Respondenten doorlopend",
                        "column": "imkj_aantal_respondenten_doorlopend",
                        "colour": "moss",
                        "excludeFromTable": true
                    },
                    {
                        "label": "Respondenten",
                        "column": "imkj_aantal_respondenten",
                        "colour": "moss"
                    }
                ],
                [
                    {
                        "label": "1",
                        "column": "imkj_doorlopend_rapportcijfer_1",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "2",
                        "column": "imkj_doorlopend_rapportcijfer_2",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "3",
                        "column": "imkj_doorlopend_rapportcijfer_3",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "4",
                        "column": "imkj_doorlopend_rapportcijfer_4",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "5",
                        "column": "imkj_doorlopend_rapportcijfer_5",
                        "colour": "orange",
                        "excludeFromTable": true
                    },
                    {
                        "label": "6",
                        "column": "imkj_doorlopend_rapportcijfer_6",
                        "colour": "blue",
                        "excludeFromTable": true
                    },
                    {
                        "label": "7",
                        "column": "imkj_doorlopend_rapportcijfer_7",
                        "colour": "blue",
                        "excludeFromTable": true
                    },
                    {
                        "label": "8",
                        "column": "imkj_doorlopend_rapportcijfer_8",
                        "colour": "moss",
                        "excludeFromTable": true
                    },
                    {
                        "label": "9",
                        "column": "imkj_doorlopend_rapportcijfer_9",
                        "colour": "moss",
                        "excludeFromTable": true
                    },
                    {
                        "label": "10",
                        "column": "imkj_doorlopend_rapportcijfer_10",
                        "colour": "moss",
                        "excludeFromTable": true
                    }
                ],
                [
                    {
                        "label": "1",
                        "column": "imkj_maand_rapportcijfer_1",
                        "colour": "orange"
                    },
                    {
                        "label": "2",
                        "column": "imkj_maand_rapportcijfer_2",
                        "colour": "orange"
                    },
                    {
                        "label": "3",
                        "column": "imkj_maand_rapportcijfer_3",
                        "colour": "orange"
                    },
                    {
                        "label": "4",
                        "column": "imkj_maand_rapportcijfer_4",
                        "colour": "orange"
                    },
                    {
                        "label": "5",
                        "column": "imkj_maand_rapportcijfer_5",
                        "colour": "orange"
                    },
                    {
                        "label": "6",
                        "column": "imkj_maand_rapportcijfer_6",
                        "colour": "blue"
                    },
                    {
                        "label": "7",
                        "column": "imkj_maand_rapportcijfer_7",
                        "colour": "blue"
                    },
                    {
                        "label": "8",
                        "column": "imkj_maand_rapportcijfer_8",
                        "colour": "moss"
                    },
                    {
                        "label": "9",
                        "column": "imkj_maand_rapportcijfer_9",
                        "colour": "moss"
                    },
                    {
                        "label": "10",
                        "column": "imkj_maand_rapportcijfer_10",
                        "colour": "moss"
                    },
                ]
            ],
            "segment": {
                    "key":"all",  
                    "cumulative": false,
                    "periodization": "monthly"
                }
            },
            {
                "slug" : "algemeen_trend",
                "ctrlr" : "BarTrendV1",
                "args" : [],
                "filters": [],
                "parameters": [
                    [
                        { 
                            "label" : "Afgelopen maand",
                            "column": "imkj_maandcijfer",
                            "units": "afgelopen maand",
                            "colour": "moss",
                            "format": "decimals",
                            "excludeFromTable": true
                        }
                    ]
                ],
                "segment": {
                    "key":"imkj_maandcijfer",  
                    "cumulative": false,
                    "periodization": "monthly"
                }
            }
        ],
        "functionality": ['table', 'definitions','download'],
        "endpoints": ["tevredenheid"],
    }
];

export default group;