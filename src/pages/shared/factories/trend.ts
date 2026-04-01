export const trimStart = (_data: any, parameters: any, offset: number = 0) => {

    let data = JSON.parse(JSON.stringify(_data)).reverse();

    function findAllIndexes<T>(array: T[], predicate: (value: T, index: number, arr: T[]) => boolean): number[] {
        return array.reduce((acc, value, index) => {
          if (predicate(value, index, array)) acc.push(index);
          return acc;
        }, [] as number[]);
    }
      
    function trimToStart(array: any[], key: string) {
        for (let i = 0; i < array.length; i++) {
            const value = array[i][key];
            if (value !== null && value !== undefined && value !== 0) {
                return i;  // Return index of first non-empty value
            }
        }
        return array.length - 1;
    }

    const indexes: number[] = [];

    for (const pg of parameters) {
        if (Array.isArray(pg)) {
            for (const p of pg) {
                const index = trimToStart(data, p.column);
                indexes.push(index);
            }
        } else {

            const index = trimToStart(data, pg.column);
            indexes.push(index);
        }
    }

    const minIndex = Math.min(...indexes);
    const maxTrimIndex = Math.max(0, data.length - 12);  // Don't trim past this point
    const trimIndex = Math.min(minIndex, maxTrimIndex);

    if (trimIndex > 0) {
        data = data.slice(trimIndex);
    }

    return JSON.parse(JSON.stringify(data)).reverse()
}