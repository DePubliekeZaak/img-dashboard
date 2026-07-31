// covered-combos.ts — signatures that have a dedicated DEEP class test.
// A "combo" is group controller plus sorted graph controllers.
// Add one line per combo that default-group.test.ts, kto-group.test.ts,
// or any other hand-written class test actually exercises beyond what the
// generic migration contract checks.
//
// When someone migrates a page introducing a novel combo, coverage.test.ts
// fails with "you need a class test for X" — enforcing test-what's-new.
//
// NOTE: All combos currently listed here are COVERED BY THE GENERIC CONTRACT
// (dimensional, visibility, silent-dash) but may NOT have a dedicated DEEP
// class test.  Add a line to the list when you write one.
//
export function combo(groupConfig: any): string {
  const gs = (groupConfig.graphs ?? [])
    .map((g: any) => g.ctrlr)
    .sort()
    .join("+");
  return `${groupConfig.ctrlr}[${gs}]`;
}

export const COVERED_COMBOS = new Set<string>([
  "DefaultGroupV1[BarTrendBedragenV1+NumbersV1]",
  "DefaultGroupV1[BarTrendStackedMakeup+SegmentsV1]",
  "DefaultGroupV1[BarTrendV1+NumbersMultiplesV1]",
  "DefaultGroupV1[BarTrendStackedMakeup+NumbersMultiplesV1+PieChartSumV1]",
  "DefaultGroupV1[BarTrendV1+PieChartSumV1]",
  "DefaultGroupV1[NumbersMultiplesV1]",
  "DefaultGroupV1[BarTrendV1+NumbersMultiplesTitledV1]",
  "DefaultGroupV1[NumbersMultiplesTitledV1+SegmentsV1]",
  "DefaultGroupV1[NumbersMultiplesTitledV1+PieChartSumV1]",
  "DefaultGroupV1[BarTrendStackedMakeup+PieChartSumV1]",
  "RegelingComparisonGroupV1[BarTrendStackedMakeup+NumbersV1+NumbersV1+NumbersV1]",
  "KTOGroupV1[BarTrendKTOV1+NumbersPlusRespondentsV1]",
  "RegelingComparisonGroupV1[BarTrendStackedMakeup+NumbersV1+NumbersV1]",
]);