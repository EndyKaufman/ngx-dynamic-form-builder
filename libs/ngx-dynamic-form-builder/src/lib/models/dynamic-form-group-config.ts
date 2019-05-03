import { AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { ValidatorOptions } from 'class-validator';
import { isNullOrUndefined } from 'util';

export interface DynamicFormGroupConfig {
  validator?: ValidatorFn | undefined;
  asyncValidator?: AsyncValidatorFn | undefined;
  validators?: ValidatorFn[] | undefined;
  asyncValidators?: AsyncValidatorFn[] | undefined;
  updateOn?: any | undefined;
  customValidatorOptions?: ValidatorOptions | undefined;
}
export function isDynamicFormGroupConfig(options: AbstractControlOptions | DynamicFormGroupConfig) {
  return options && !isNullOrUndefined(options['customValidatorOptions']);
}
export function isLegacyOrOpts(options: AbstractControlOptions | DynamicFormGroupConfig) {
  return options && (!isNullOrUndefined(options['validator']) || !isNullOrUndefined(options['asyncValidator']));
}
export function isAbstractControlOptions(options: AbstractControlOptions | DynamicFormGroupConfig) {
  return options &&
    (
      !isNullOrUndefined(options.validators) ||
      !isNullOrUndefined(options.asyncValidators) ||
      !isNullOrUndefined(options.updateOn)
    );
}
