import type { Segment } from "./types";

export const segmentParse = (s: Segment | string): Segment => {
  if (typeof s === "string") {
    return {
      key: s,
      cumulative: false,
      periodization: "weekly",
    };
  } else {
    return s;
  }
};

// export const setMonthToSegment = (segment: Segment, yearmonth: string) => {

//     if (yearmonth === 'all') {

//         console.log('yes');

//         return {
//             ...segment,
//             cumulative: true,
//             key: "all"
//         }

//     } else {

//         console.log('no');

//         return {
//             ...segment,
//             cumulative: false,
//             key: yearmonth
//         }
//     }
