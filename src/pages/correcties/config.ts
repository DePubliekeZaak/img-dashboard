import type { IPageConfig } from "../../shared/interfaces";

/**
 * Correcties page.
 *
 * This page shows the current "actuele versie" plus archived versions of the
 * regelingen data. Each version is rendered as its own group whose
 * CorrectionGroupV1 renders an archive link ("Bekijk deze versie") that
 * switches to that version's bundle.
 *
 * NOTE ON ENDPOINTS: the previous config carried string ids
 * ("all_wekelijks"/"all_maandelijks") that were never resolved anywhere in the
 * codebase (no mapping to a real postgrest URL exists), so PageController
 * would try to `gather()` those raw ids and fail. We now set the page-level
 * endpoints to real `regelingen` aggregation URLs (all-totals weekly + monthly,
 * same as the regelingen page) and let the groups inherit them via their empty
 * `endpoints` array.
 */
const pageConfig: IPageConfig = {
  slug: "correcties",
  segment: {
    key: "",
    cumulative: true,
    periodization: "monthly",
  },
  default_filters: [],
  filters: [],
  endpoints: [
    "regelingen?aggregatie=eq.maand&domein_code=eq.Totaal&regeling_code=eq.Totaal&order=periode.desc",
    "regelingen?aggregatie=eq.week&domein_code=eq.Totaal&regeling_code=eq.Totaal&order=periode.desc",
  ],
  groups: [
    {
      slug: "versies_intro",
      ctrlr: "IntroGroupV1",
      filters: [],
      graphs: [],
      functionality: [],
      segment: {
        key: "",
        cumulative: true,
        periodization: "monthly",
      },
      endpoints: [],
    },
    {
      slug: "versie_100",
      ctrlr: "CorrectionGroupV1",
      filters: [],
      graphs: [],
      functionality: [],
      segment: {
        key: "",
        cumulative: true,
        periodization: "monthly",
      },
      endpoints: [],
    },
    {
      slug: "versie_001",
      ctrlr: "CorrectionGroupV1",
      filters: [],
      graphs: [],
      functionality: [],
      segment: {
        key: "",
        cumulative: true,
        periodization: "monthly",
      },
      endpoints: [],
    },
  ],
};

export default pageConfig;
