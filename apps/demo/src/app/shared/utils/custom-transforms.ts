export function transformStringToDate(value: string) {
  if (value) {
    const date = new Date(value);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - userTimezoneOffset);
  } else {
    return undefined;
  }
}
export function transformDateToString(value: Date) {
  return value ? value.toISOString() : undefined;
}
export function serializeModel<T>(object: T) {
  return function () {
    return object;
  };
}
