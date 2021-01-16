import { TransformFnParams } from 'class-transformer';

export function transformStringToDate(params: TransformFnParams) {
  if (params.value) {
    const date = new Date(params.value);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - userTimezoneOffset);
  } else {
    return undefined;
  }
}
export function transformDateToString(params: TransformFnParams) {
  return params.value ? params.value.toISOString() : undefined;
}
export function serializeModel<T>(object: T) {
  return function () {
    return object;
  };
}
