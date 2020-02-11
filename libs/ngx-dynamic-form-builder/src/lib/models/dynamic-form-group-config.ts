import { AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { ValidatorOptions } from 'class-validator';

export interface DynamicFormGroupConfig {
  validator?: ValidatorFn | undefined;
  asyncValidator?: AsyncValidatorFn | undefined;
  validators?: ValidatorFn[] | undefined;
  asyncValidators?: AsyncValidatorFn[] | undefined;
  updateOn?: any | undefined;
  customValidatorOptions?: ValidatorOptions | undefined;
}
export function isDynamicFormGroupConfig(options: AbstractControlOptions | DynamicFormGroupConfig) {
  return options && !!options['customValidatorOptions'];
}
export function isLegacyOrOpts(options: AbstractControlOptions | DynamicFormGroupConfig) {
  return options && (!!options['validator'] || !!options['asyncValidator']);
}
export function isAbstractControlOptions(options: AbstractControlOptions | DynamicFormGroupConfig) {
  return options && (!!options.validators || !!options.asyncValidators || !!options.updateOn);
}
