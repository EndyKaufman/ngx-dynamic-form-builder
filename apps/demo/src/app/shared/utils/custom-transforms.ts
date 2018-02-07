
export function transformStringToDate(value: string) {
    return value ? value.substring(0, 10) : value;
}
export function transformDateToString(value: string) {
    return value ? value.substring(0, 10) : value;
}
export function serializeModel<T>(object: T) {
    return function () {
        return object;
    };
}
