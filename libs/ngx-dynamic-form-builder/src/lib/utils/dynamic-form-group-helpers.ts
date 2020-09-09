import { ShortValidationErrors } from '../models/short-validation-errors';
import { ValidationError, I18N_MESSAGES } from 'class-validator-multi-lang';
import { BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';

const cloneDeep = require('lodash.clonedeep');
const mergeWith = require('lodash.mergewith');

const CLASS_VALIDATOR_MESSAGES = new BehaviorSubject(I18N_MESSAGES);

export function setClassValidatorMessages(messages: typeof I18N_MESSAGES) {
  CLASS_VALIDATOR_MESSAGES.next(messages);
}

export function getClassValidatorMessages() {
  return CLASS_VALIDATOR_MESSAGES.pipe(share());
}

export function transformValidationErrors(errors: ValidationError[]): ShortValidationErrors {
  const customErrors: ShortValidationErrors = {};

  errors.forEach((error: ValidationError) => {
    if (error && error.constraints !== undefined) {
      Object.keys(error.constraints).forEach((key: string) => {
        if (!customErrors[error.property]) {
          customErrors[error.property] = [];
        }

        if (error.constraints && (customErrors[error.property] as string[]).indexOf(error.constraints[key]) === -1) {
          (customErrors[error.property] as string[]).push(error.constraints[key]);
        }
      });
    }

    if (error.children !== undefined && error.children.length) {
      customErrors[error.property] = transformValidationErrors(error.children);
    }
  });

  return customErrors;
}

export function mergeErrors(externalErrors?: ShortValidationErrors, validationErrors?: ShortValidationErrors) {
  const clonedExternalErrors = cloneDeep(externalErrors);
  return mergeWith(clonedExternalErrors, validationErrors, (objValue, srcValue) => {
    if (canMerge()) {
      return objValue.concat(srcValue);
    }

    function canMerge() {
      return (
        Array.isArray(objValue) && Array.isArray(srcValue) && !objValue.find((objItem) => srcValue.includes(objItem))
      );
    }
  });
}
