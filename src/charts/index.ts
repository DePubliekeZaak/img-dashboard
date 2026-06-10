import { GraphControllerV3 } from "./core/graph-v3";
import { AxisArrow } from "./elements/axis-arrow";
import { ChartBandBar } from "./elements/chart-band-bars";
import ChartBarTrend from "./elements/chart-bar-trend";
import ChartBarTrendV2 from "./elements/chart-bar-trend-v2";
import ChartBarTrendKTOV1 from './elements/chart-bar-trend-kto-v1';
import ChartBarTrendwithNumber from "./elements/chart-bar-trend-with-number";
import { ChartBarsHorizontalV1 } from "./elements/chart-bars-horizontal-v1";
import { ChartBlocksV1 } from "./elements/chart-blocks-v1";
import { ChartLine } from "./elements/chart-line";
import { ChartPieV1 } from "./elements/chart-pie-v1";
import ChartStackedAreaV1 from "./elements/chart-stacked-area-v1";
import ChartStackedBars from "./elements/chart-stacked-bars";
import ChartStackedBarsV2 from "./elements/chart-stacked-bars-v2";
import ChartTimeline from "./elements/chart-timeline";
import { HtmlNumberAccented } from "./elements/html-number-accented";
import { HtmlNumberCircle } from "./elements/html-number-circle";
import { HtmlNumberCircleRespondents } from "./elements/html-number-circle-respondents";
import { HtmlNumberSimple } from "./elements/html-number-simple";
import { HtmlNumberTitled } from "./elements/html-number-titled";
import MapV1 from "./elements/map-v1";

export const core = {
  GraphControllerV3,
};

export const elements = {
  ChartBarTrend,
  ChartBarTrendV2,
  ChartBarTrendKTOV1,
  ChartBarTrendwithNumber,
  ChartBarsHorizontalV1,
  ChartStackedBars,
  ChartStackedBarsV2,
  ChartTimeline,
  ChartPieV1,
  ChartBlocksV1,
  ChartLine,
  AxisArrow,
  ChartStackedAreaV1,
  ChartBandBar,
  MapV1,
  HtmlNumberAccented,
  HtmlNumberCircle,
  HtmlNumberCircleRespondents,
  HtmlNumberSimple,
  HtmlNumberTitled,
};
