import { DefaultGroupV1 } from "../../../shared/default-group-v1";
import { GeaggregeerdV1 } from "./geaggregeerd-v1";
import { IntroGroupV1 } from "./intro-group-v1";
import { KTOGroupV1 } from "../../../shared/kto-group-v1";

import { MakeupGroupTrendV1 } from "./makeup-group-trend-v1";
import { ComparisonGroupV1 } from "./comparison-group";
import { DomainComparisonGroupV1 } from "./domain-comparison-group";
import { RegelingComparisonGroupV1 } from "./regeling-comparison-group";

const groups = {
  GeaggregeerdV1,
  KTOGroupV1,
  IntroGroupV1,
  MakeupGroupTrendV1,
  DefaultGroupV1,
  ComparisonGroupV1,
  DomainComparisonGroupV1,
  RegelingComparisonGroupV1,
};

export default groups;