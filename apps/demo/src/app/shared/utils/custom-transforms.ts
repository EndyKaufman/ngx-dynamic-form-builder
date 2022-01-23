import { TransformFnParams } from 'class-transformer-global-storage';

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
