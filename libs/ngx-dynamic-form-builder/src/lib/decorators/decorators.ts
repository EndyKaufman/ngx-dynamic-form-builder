import { AbstractControl } from '@angular/forms';
import {
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator-multi-lang';
import { DynamicControlOptions } from '../types/types';
import {
  getCustomDataToRootFormGroup,
  getDynamicControlOptions,
  setCustomDataToRootFormGroup,
} from '../utils/utils';

export function ValidateIfUpdater(
  updaterFn: (
    controlPath: string,
    value: string,
    rootFormGroup: AbstractControl,
    dynamicControlOptions: DynamicControlOptions
  ) => boolean
) {
  return Validate(dynamicValidateIfUpdater(updaterFn));
}

export function dynamicValidateIfUpdater(
  updaterFn: (
    controlPath: string,
    value: string,
    rootFormGroup: AbstractControl,
    dynamicControlOptions: DynamicControlOptions
  ) => boolean
) {
  @ValidatorConstraint()
  class ValidateIfUpdaterConstraint implements ValidatorConstraintInterface {
    validate(value: string, validationArguments?: ValidationArguments) {
      const dynamicFormBuilderOptions = getDynamicControlOptions(
        validationArguments?.object
      );
      const rootFormGroup = dynamicFormBuilderOptions?.control
        .root as AbstractControl;
      if (rootFormGroup) {
        const key = `${ValidateIfUpdater.name}_${dynamicFormBuilderOptions?.controlPath}`;
        const prevValue = getCustomDataToRootFormGroup(
          rootFormGroup,
          key,
          null
        );
        if (value !== prevValue) {
          setTimeout(() => {
            const appiled = updaterFn(
              dynamicFormBuilderOptions?.controlPath,
              value,
              rootFormGroup,
              dynamicFormBuilderOptions
            );
            if (appiled) {
              setCustomDataToRootFormGroup(rootFormGroup, key, value);
            }
          }, 100);
        }
      }
      return true;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ValidateIfUpdaterConstraint as any;
}
