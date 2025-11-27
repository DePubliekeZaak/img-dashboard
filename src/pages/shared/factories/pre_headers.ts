export const preHeaders = (graphs: any[], segment: any) => {
  let pre_headers: any[][] = [];

  const numbersIndex = graphs.findIndex(
    (g) => g.ctrlr.includes("Numbers") && segment.cumulative,
  );
  if (numbersIndex !== -1) {
    pre_headers = [
      [
        { label: "", length: 3 },
        {
          label: "Per week",
          length: graphs[0].parameters[0].length,
        },
        {
          label: "Cumulatief",
          length: graphs[0].parameters[0].length,
        },
      ],
      [
        { label: "", length: 3 },
        {
          label: "Per maand",
          length: graphs[0].parameters[0].length,
        },
        {
          label: "Cumulatief",
          length: graphs[0].parameters[0].length,
        },
      ],
    ];
  }

  const pieIndex = graphs.findIndex((g) => g.slug.includes("toegewezen"));
  if (pieIndex !== -1) {
    pre_headers = [
      [
        { label: "", length: 3 },
        {
          label: "Cumulatief",
          length: graphs[0].parameters[0].concat(graphs[0].parameters[1])
            .length,
        },
        {
          label: "Per week",
          length: graphs[0].parameters[0].length,
        },
      ],
      [
        { label: "", length: 3 },
        {
          label: "Cumulatief",
          length: graphs[0].parameters[0].concat(graphs[0].parameters[1])
            .length,
        },
        {
          label: "Per maand",
          length: graphs[0].parameters[0].length,
        },
      ],
    ];
  }

  const imsIndex = graphs.findIndex((g) => g.slug == "ims_totaal_numbers_volw");

  if (imsIndex !== -1) {
    pre_headers = [
      [
        { label: "", length: 3 },
        {
          label: "Volwassenen",
          length: graphs[0].parameters[0].concat(graphs[0].parameters[1])
            .length,
        },
        {
          label: "Kinderen en jeugd",
          length: graphs[0].parameters[0].length,
        },
      ],
      [
        { label: "", length: 3 },
        {
          label: "Volwassenen",
          length: graphs[0].parameters[0].concat(graphs[0].parameters[1])
            .length,
        },
        {
          label: "Kinderen en jeugd",
          length: graphs[0].parameters[0].length,
        },
      ],
    ];
  }

  const bezwarenIndex = graphs.findIndex(
    (g) => g.slug == "bezwaren_mw_numbers_v1",
  );

  if (bezwarenIndex !== -1) {
  
    pre_headers = [
      [
        { label: "", length: 3 },
        {
          label: "Maatwerk",
          length: 4,
        },
        {
          label: "VES",
          length: 4,
        },
        {
          label: "AVV",
          length: 4,
        },
        {
          label: "IMS: Volwassenen",
          length: 4,
        },
        {
          label: "IMS: Kinderen en jeugd",
          length: 4,
        },
        {
          label: "WD: wonen",
          length: 4,
        },
        {
          label: "WD: niet wonen",
          length: 4,
        },
        {
          label: "WD: NAMCO",
          length: 4,
        },
      ],
      [
        { label: "", length: 3 },
        {
          label: "Maatwerk",
          length: 4,
        },
        {
          label: "VES",
          length: 4,
        },
        {
          label: "AVV",
          length: 4,
        },
        {
          label: "IMS: Volwassenen",
          length: 4,
        },
        {
          label: "IMS: Kinderen en jeugd",
          length: 4,
        },
        {
          label: "WD: wonen",
          length: 4,
        },
        {
          label: "WD: niet wonen",
          length: 4,
        },
        {
          label: "WD: NAMCO",
          length: 4,
        },
      ],
    ];
  }

  return pre_headers;
};
