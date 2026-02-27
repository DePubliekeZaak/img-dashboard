export const parseSegment = (page: any, groupSlug: string, graphSlug: string) => {

    // Initialize segment with default values
    const segment = {
        gemeente: "all",
        key: "default",              
        cumulative: true,
        periodization: "month",  // Set a default periodization instead of undefined
        parameterIndex: 0,
        label: "",
        normalized: false
    };

    segment.gemeente = page.segment?.gemeente || "all";
    const group = page.segment?.groups?.[groupSlug];

    if (group) {

        // Only override the key if group.key is a non-empty string
        if (typeof group.key === 'string' && group.key.length > 0) {
            segment.key = group.key;
        }
        if (group.cumulative !== undefined) segment.cumulative = group.cumulative;
        if (typeof group.periodization === 'string' && group.periodization.length > 0) {
            segment.periodization = group.periodization;
        }
        if (typeof group.parameterIndex === 'number') segment.parameterIndex = group.parameterIndex;

        if (typeof group.normalized === 'boolean') segment.normalized = group.normalized;

    } else {

    }

    const graph = group?.graphs?.[graphSlug];

    if (graph) {

        if (graph.cumulative !== undefined) segment.cumulative = graph.cumulative;
        if (typeof graph.periodization === 'string' && graph.periodization.length > 0) {
            segment.periodization = graph.periodization;
        }
        if (typeof graph.parameterIndex === 'number') segment.parameterIndex = graph.parameterIndex;
        if (typeof graph.key === 'string' && graph.key.length > 0) segment.key = graph.key;

        if (typeof graph.label === 'string' && graph.label.length > 0) segment.label = graph.label;

        if (typeof graph.normalized === 'boolean') segment.normalized = graph.normalized;

        if(graph.key.includes("voorraad")) {
            segment.cumulative = true
        }
    }

    if (segment.gemeente != 'all') {

        const strippedKey = segment.key.replace("_cumul","").replace("_aantal","");
        segment.key = (segment.cumulative) ? strippedKey + "_cumul" : strippedKey + "_aantal";

    } else {

        const strippedKey = segment.key.replace("_cumulatief","");

        segment.key = (segment.cumulative) ? strippedKey + "_cumulatief" : strippedKey;

    }

    return segment;

}