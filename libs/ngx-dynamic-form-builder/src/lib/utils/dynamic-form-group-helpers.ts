import { ValidationError } from 'class-validator';
import { ShortValidationErrors } from '../models/short-validation-errors';

const cloneDeep = require('lodash.clonedeep');
const mergeWith = require('lodash.mergewith');

export function transformValidationErrors(errors: ValidationError[]): ShortValidationErrors {
  const customErrors: ShortValidationErrors = {};

  errors.forEach((error: ValidationError) => {
    if (error && error.constraints !== undefined) {
      Object.keys(error.constraints).forEach((key: string) => {
        if (!customErrors[error.property]) {
          customErrors[error.property] = [];
        }

        if ((customErrors[error.property] as string[]).indexOf(error.constraints[key]) === -1) {
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
        Array.isArray(objValue) &&
        Array.isArray(srcValue) &&
        objValue.filter(objItem => srcValue.indexOf(objItem) !== -1).length === 0
      );
    }
  });
}
