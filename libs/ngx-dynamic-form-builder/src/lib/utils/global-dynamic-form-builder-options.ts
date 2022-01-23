import { BehaviorSubject } from 'rxjs';
import { DynamicFormBuilderOptions } from '../types/types';
import { getGlobal } from '../utils/get-global.util';

const globalDynamicFormBuilderOptions = 'globalDynamicFormBuilderOptions';

export function getGlobalDynamicFormBuilderOptionsSubject(): BehaviorSubject<DynamicFormBuilderOptions> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = getGlobal() as any;
  if (!global[globalDynamicFormBuilderOptions]) {
    global[globalDynamicFormBuilderOptions] = new BehaviorSubject({});
  }
  return global[globalDynamicFormBuilderOptions];
}

export function getGlobalDynamicFormBuilderOptions(): DynamicFormBuilderOptions {
  return getGlobalDynamicFormBuilderOptionsSubject().value || {};
}

export function setGlobalDynamicFormBuilderOptions(
  dynamicFormBuilderOptions: DynamicFormBuilderOptions
) {
  getGlobalDynamicFormBuilderOptionsSubject().next(dynamicFormBuilderOptions);
}
