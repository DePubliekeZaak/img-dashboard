import { IGroupMappingV2 } from "../shared/interfaces";

const mapping : IGroupMappingV2[] = [
    {
        "slug" : "versies_intro",
        "ctrlr": "IntroGroupV1",
        "filters" : [],
        "graphs": [       ],
        "functionality": [],
        "segment": {
            "key": "",
            "cumulative": true,
            "periodization": "monthly",
            },
        "endpoints": ["all_wekelijks", "all_maandelijks"],
        
    },
    {
        "slug" : "versie_101",
        "ctrlr": "CorrectionGroupV1",
        "filters" : [],
        "graphs": [],
        "functionality": [],
        "segment": {
            "key": "",
            "cumulative": true,
            "periodization": "monthly",
        },
        "endpoints": ["all_wekelijks", "all_maandelijks"],
        
    },
    {
        "slug" : "versie_100",
        "ctrlr": "CorrectionGroupV1",
        "filters" : [],
        "graphs": [],
        "functionality": [],
        "segment": {
            "key": "",
            "cumulative": true,
            "periodization": "monthly",
        },
        "endpoints": ["all_wekelijks", "all_maandelijks"],
        
    },
    {
        "slug" : "versie_001",
        "ctrlr": "CorrectionGroupV1",
        "filters" : [],
        "graphs": [],
        "functionality": [],
        "segment": {
            "key": "",
            "cumulative": true,
            "periodization": "monthly",
        },
        "endpoints": ["all_wekelijks", "all_maandelijks"],  
    }
];

export default mapping;