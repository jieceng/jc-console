export function toCamelCase(str: string) {
    return str.replace(/[_-]\w/g, match => match.charAt(1).toUpperCase());
}

export function camelToKebab(camelCaseString: string) {
    return camelCaseString.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}




