import { BehaviorSubject } from 'rxjs';
import { DynamicFormBuilderOptions } from '../types/types';
import { getGlobal } from '../utils/get-global.util';

const globalDynamicFormBuilderOptions = 'globalDynamicFormBuilderOptions';

export function getGlobalDynamicFormBuilderOptionsSubject<T>(): BehaviorSubject<
  DynamicFormBuilderOptions<T>
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = getGlobal() as any;
  if (!global[globalDynamicFormBuilderOptions]) {
    global[globalDynamicFormBuilderOptions] = new BehaviorSubject({});
  }
  return global[globalDynamicFormBuilderOptions];
}

export function getGlobalDynamicFormBuilderOptions<
  T
>(): DynamicFormBuilderOptions<T> {
  return (getGlobalDynamicFormBuilderOptionsSubject().value ||
    {}) as DynamicFormBuilderOptions<T>;
}

export function setGlobalDynamicFormBuilderOptions<T>(
  dynamicFormBuilderOptions: DynamicFormBuilderOptions<T>
) {
  getGlobalDynamicFormBuilderOptionsSubject().next(dynamicFormBuilderOptions);
}
