import { Segment } from "./types";

export const segmentParse = (s: Segment | string): Segment =>  {

    if (typeof s === 'string') {

        return {
            key : s,
            cumulative : false,
            periodization : 'weekly'
        }

    } else {
        return s
    }
}