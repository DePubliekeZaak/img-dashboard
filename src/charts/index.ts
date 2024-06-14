import { GraphControllerV3 } from './core/graph-v3';
import ChartBarTrend from './elements/chart-bar-trend';
import ChartStackedBars from './elements/chart-stacked-bars';
import ChartTimeline from './elements/chart-timeline'
import { ChartPieV1 } from './elements/chart-pie-v1';
import { ChartLine } from './elements/chart-line';
import { AxisArrow } from './elements/axis-arrow';
import ChartStackedAreaV1  from './elements/chart-stacked-area-v1';
import { ChartBandBar } from './elements/chart-band-bars';
import MapV1 from './elements/map-v1';
import { HtmlNumberAccented } from './elements/html-number-accented';
import { HtmlNumberCircle } from './elements/html-number-circle';
import { HtmlNumberCircleRespondents } from './elements/html-number-circle-respondents';
import ChartStackedBarsV2 from './elements/chart-stacked-bars-v2';
import { HtmlNumberSimple } from './elements/html-number-simple';
import ChartBarTrendwithNumber from './elements/chart-bar-trend-with-number';
import { ChartBarsHorizontalV1 } from './elements/chart-bars-horizontal-v1';

export const core = {
    GraphControllerV3
}

export const elements = {
    ChartBarTrend,
    ChartBarTrendwithNumber,
    ChartBarsHorizontalV1,
    ChartStackedBars,
    ChartStackedBarsV2,
    ChartTimeline,
    ChartPieV1,
    ChartLine,
    AxisArrow,
    ChartStackedAreaV1,
    ChartBandBar,
    MapV1,
    HtmlNumberAccented,
    HtmlNumberCircle,
    HtmlNumberCircleRespondents,
    HtmlNumberSimple
}