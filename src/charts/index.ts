import { GraphControllerV3 } from "./core/graph-v3";
import { AxisArrow } from "./renderers/axis-arrow";
import { ChartBandBar } from "./renderers/chart-band-bars";
import ChartBarTrend from "./renderers/chart-bar-trend";
import ChartBarTrendKTOV1 from './renderers/chart-bar-trend-kto-v1';
import { ChartBarsHorizontalV1 } from "./renderers/chart-bars-horizontal-v1";
import { ChartBlocksV1 } from "./renderers/chart-blocks-v1";
import { ChartLine } from "./renderers/chart-line";
import { ChartPieV1 } from "./renderers/chart-pie-v1";
import ChartStackedBars from "./renderers/chart-stacked-bars";
import ChartStackedBarsV2 from "./renderers/chart-stacked-bars-v2";
import ChartTimeline from "./renderers/chart-timeline";
import { HtmlNumberAccented } from "./renderers/html-number-accented";
import { HtmlNumberCircle } from "./renderers/html-number-circle";
import { HtmlNumberCircleRespondents } from "./renderers/html-number-circle-respondents";
import { HtmlNumberSimple } from "./renderers/html-number-simple";
import { HtmlNumberTitled } from "./renderers/html-number-titled";

export const core = {
  GraphControllerV3,
};

export const elements = {
  ChartBarTrend,
  ChartBarTrendKTOV1,
  ChartBarsHorizontalV1,
  ChartStackedBars,
  ChartStackedBarsV2,
  ChartTimeline,
  ChartPieV1,
  ChartBlocksV1,
  ChartLine,
  AxisArrow,
  ChartBandBar,
  HtmlNumberAccented,
  HtmlNumberCircle,
  HtmlNumberCircleRespondents,
  HtmlNumberSimple,
  HtmlNumberTitled,
};