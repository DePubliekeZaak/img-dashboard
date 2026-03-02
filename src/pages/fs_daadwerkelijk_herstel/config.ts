import type { IGroupMappingV2 } from "../shared/interfaces";

const mapping: IGroupMappingV2[] = [
  {
    slug: "fs_herstel_totals",
    ctrlr: "IntroGroupV1",
    filters: [],
    graphs: [],
    functionality: [],
    endpoints: ["fs_wekelijks", "fs_maandelijks"],
  },
];

export default mapping;
