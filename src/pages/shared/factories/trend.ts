export const trimStart = (_data: any, parameters: any, offset: number = 0) => {

    let data = JSON.parse(JSON.stringify(_data)).reverse();

    function findAllIndexes<T>(array: T[], predicate: (value: T, index: number, arr: T[]) => boolean): number[] {
        return array.reduce((acc, value, index) => {
          if (predicate(value, index, array)) acc.push(index);
          return acc;
        }, [] as number[]);
    }
      
    function trimToStart(array: any[], key: string) {

        const indexes = findAllIndexes(array, item => item[key] === null);

        let i = 0;
        while (true) {
            i++;

            // Check for the condition
            if (array[i + 1][key] != null) {
                return i
            }
        }
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
    if (minIndex > 0) {
       data = data.slice(minIndex, data.length)
    }
    
    return JSON.parse(JSON.stringify(data)).reverse()
}