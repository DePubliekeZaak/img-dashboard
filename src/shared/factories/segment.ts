import { GraphParamEntry } from "../interfaces";
import { Segment } from "../types";

export const parseSegment = (
  page: any,
  groupSlug: string,
  graphSlug: string,
) => {
  const segment = {
    gemeente: "all",
    key: "",
    baseKey: "",  // New: the base parameter column
    cumulative: true,
    periodization: "monthly",
    parameterIndex: 0,
    label: "",
    normalized: false,
  };

  segment.gemeente = page.segment?.gemeente || "all";
  const group = page.segment?.groups?.[groupSlug];

  if (group) {
    if (typeof group.key === "string" && group.key.length > 0) {
      segment.key = group.key;
    }
    if (typeof group.baseKey === "string" && group.baseKey.length > 0) {
      segment.baseKey = group.baseKey;
    }
    if (group.cumulative !== undefined) segment.cumulative = group.cumulative;
    if (typeof group.periodization === "string" && group.periodization.length > 0) {
      segment.periodization = group.periodization;
    }
    if (typeof group.parameterIndex === "number") {
      segment.parameterIndex = group.parameterIndex;
    }
    if (typeof group.normalized === "boolean") {
      segment.normalized = group.normalized;
    }
  }

  const graph = group?.graphs?.[graphSlug];

  if (graph) {
    if (graph.cumulative !== undefined) segment.cumulative = graph.cumulative;
    if (typeof graph.periodization === "string" && graph.periodization.length > 0) {
      segment.periodization = graph.periodization;
    }
    if (typeof graph.parameterIndex === "number") {
      segment.parameterIndex = graph.parameterIndex;
    }
    if (typeof graph.key === "string" && graph.key.length > 0) {
      segment.key = graph.key;
    }
    if (typeof graph.baseKey === "string" && graph.baseKey.length > 0) {
      segment.baseKey = graph.baseKey;
    }
    if (typeof graph.label === "string" && graph.label.length > 0) {
      segment.label = graph.label;
    }
    if (typeof graph.normalized === "boolean") {
      segment.normalized = graph.normalized;
    }
  }

  // No more suffix manipulation here — resolution happens in graph via graphParams

  return segment;
};

export const resolveActiveColumn = (
  segment: Segment,
  graphParams: Record<string, GraphParamEntry>,
  fallbackBaseColumn: string,
): string => {
  const baseColumn = segment.baseKey || fallbackBaseColumn;
  const entry = graphParams[baseColumn];
  
  if (!entry) return baseColumn;
  
  const variant = segment.cumulative 
    ? entry.variants.cumul 
    : entry.variants.delta;
  
  return variant?.column || baseColumn;
};