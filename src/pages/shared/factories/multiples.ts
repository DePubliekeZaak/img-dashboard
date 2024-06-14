
export const graphIsMultiple = (slug: string) => {

    let s = slug.split("_"); 
    if(s != undefined) {
        if (s[s.length -1].indexOf('mult') > -1) {
            return true;
        }
    }
}

export const groupHasMultiple = (slug: string) => {

    let s = slug.split("_"); 
    if(s != undefined) {
        if (s[s.length -1].indexOf('mult') > -1) {
            return true;
        }
    }
}

export const fixMultiple = (slug: string) => {
    let s = slug.split("_"); 
    if(s != undefined) {
        s.pop()
        return s.join("_")
    }
}