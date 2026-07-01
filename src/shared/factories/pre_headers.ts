export const preHeaders = (graphs: any[], segment: any) => {
  let pre_headers: any[][] = [];


  if(graphs[0].slug.includes("gemeente")) return [];

  // const numbersIndex = graphs.findIndex(
  //   (g) => g.ctrlr.includes("Numbers") && segment.cumulative,
  // );
  // if (numbersIndex !== -1) {
  //   pre_headers = [
  //     [
  //       { label: "", length: 3 },
  //       {
  //         label: "Per week",
  //         length: graphs[0].parameters[0].length,
  //       },
  //       {
  //         label: "Cumulatief",
  //         length: graphs[0].parameters[0].length,
  //       },
  //     ],
  //     [
  //       { label: "", length: 3 },
  //       {
  //         label: "Per maand",
  //         length: graphs[0].parameters[0].length,
  //       },
  //       {
  //         label: "Cumulatief",
  //         length: graphs[0].parameters[0].length,
  //       },
  //     ],
  //   ];
  // }

  // for (let g of graphs) {
  //   console.log(g.slug)
  // }

  const overzichtIndex = graphs.findIndex((g) => g.slug === "reg_makeup_trend");
  if (overzichtIndex > -1) {
    pre_headers = [
      [
        { label: "", length: 3 },
        {
          label: "Ingediend",
          length: graphs[0].parameters.length,
        },
        {
          label: "Afgerond",
          length: graphs[0].parameters.length,
        },
        {
          label: "Uitbetaald bedrag",
          length: graphs[0].parameters.length,
        },
      ],
      [
        { label: "", length: 3 },
        {
          label: "Ingediend",
          length: graphs[0].parameters.length,
        },
        {
          label: "Afgerond",
          length: graphs[0].parameters.length,
        },
        {
          label: "Uitbetaald bedrag",
          length: graphs[0].parameters.length,
        },
      ],
    ];
  }

  const vergelijkIndex = graphs.findIndex(
    (g) => g.slug === "vergelijk_numbers",
  );
  if (vergelijkIndex > -1) {
    pre_headers = [
      [
        { label: "", length: 3 },
        {
          label: "Fysieke schade: maatwerk",
          length: graphs[0].parameters[0].length,
        },
        {
          label: "Fysieke_schade: vaste vergoeding",
          length: graphs[0].parameters[0].length,
        },
        {
          label: "Immateriele schade: volwassenen",
          length: graphs[0].parameters[0].length,
        },
        {
          label: "Immateriele schade: kinderen en jongeren",
          length: graphs[0].parameters[0].length,
        },
        {
          label: "Waardedaling: wonen",
          length: graphs[0].parameters[0].length,
        },
      ],
      [
        { label: "", length: 3 },
        {
          label: "Fysieke schade: maatwerk",
          length: graphs[0].parameters[0].length,
        },
        {
          label: "Fysieke_schade: vaste vergoeding",
          length: graphs[0].parameters[0].length,
        },
        {
          label: "Immateriele schade: volwassenen",
          length: graphs[0].parameters[0].length,
        },
        {
          label: "Immateriele schade: kinderen en jongeren",
          length: graphs[0].parameters[0].length,
        },
        {
          label: "Waardedaling: wonen",
          length: graphs[0].parameters[0].length,
        },
      ],
    ];
  }

  // const pieIndex = graphs.findIndex((g) => g.slug.includes("toegekend"));
  // if (pieIndex !== -1) {
  //   pre_headers = [
  //     [
  //       { label: "", length: 3 },
  //       {
  //         label: "Per week",
  //         length: 3,
  //       },
  //       {
  //         label: "Cumulatief",
  //         length: graphs[0].parameters[0].length,
  //       },
  //     ],
  //     [
  //       { label: "", length: 3 },
  //       {
  //         label: "Per week",
  //         length: 3,
  //       },
  //       {
  //         label: "Cumulatief",
  //         length: graphs[0].parameters[0].length,
  //       },
  //     ],
  //   ];
  // }

  const imsIndex = graphs.findIndex(
    (g) => g.slug === "ims_totaal_numbers_volw",
  );

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
          label: "Kinderen en jongeren",
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
          label: "Kinderen en jongeren",
          length: graphs[0].parameters[0].length,
        },
      ],
    ];
  }

  const bezwarenIndex = graphs.findIndex(
    (g) => g.slug === "bezwaren_mw_numbers_v1",
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
          label: "Vaste vergoeding",
          length: 4,
        },
        {
          label: "IMS: Volwassenen",
          length: 4,
        },
        {
          label: "IMS: Kinderen en jongeren",
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
          label: "Vaste vergoeding",
          length: 4,
        },
        {
          label: "IMS: Volwassenen",
          length: 4,
        },
        {
          label: "IMS: Kinderen en jongeren",
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

  // console.log(pre_headers)

  return pre_headers;
};
