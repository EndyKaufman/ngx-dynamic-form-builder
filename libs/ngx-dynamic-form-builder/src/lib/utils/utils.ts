import { AbstractControl } from '@angular/forms';
import { ValidationError } from 'class-validator-multi-lang';
import cloneDeep from 'lodash.clonedeep';
import mergeWith from 'lodash.mergewith';
import lodashSet from 'lodash.set';
import { __dynamicControlOptions__ } from '../constants/constants';
import {
  ClassValidatorErrors,
  DynamicControlOptions,
  DynamicFormGroup,
  DynamicFormProperties,
  IDynamicControlMetadata,
  ShortValidationErrors,
} from '../types/types';

export function setDynamicControlOptions(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any,
  options: DynamicControlOptions
) {
  object[__dynamicControlOptions__] = options;
}

export function removeDynamicControlOptions(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
) {
  delete object[__dynamicControlOptions__];
}

export function getDynamicControlOptions(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
) {
  return object[__dynamicControlOptions__];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function recursiveRemoveDynamicControlOptions(object: any): any {
  if (!object || isPrimitiveClass(object) || isPrimitiveType(object)) {
    return object;
  } else {
    if (Array.isArray(object)) {
      return object.map((item) => recursiveRemoveDynamicControlOptions(item));
    }
    if (
      Object.getOwnPropertyDescriptor(object || {}, __dynamicControlOptions__)
    ) {
      delete object[__dynamicControlOptions__];
    }
    Object.keys(object).forEach((key) => {
      if (
        Object.getOwnPropertyDescriptor(
          object[key] || {},
          __dynamicControlOptions__
        )
      ) {
        delete object[key][__dynamicControlOptions__];
      }
    });
    return object;
  }
}

export function replaceLastPropertyToDynamicControlOptionsByDotPath(
  controlPath: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rootValue: any,
  control: DynamicFormProperties | AbstractControl,
  metadata: IDynamicControlMetadata
) {
  const newControlPath = [
    ...controlPath
      .split('.')
      .filter((v, i) => i < controlPath.split('.').length - 1),
    __dynamicControlOptions__,
  ].join('.');

  lodashSet(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    object as any,
    newControlPath,
    {
      rootValue,
      controlPath,
      control,
      metadata,
    }
  );
}

export function setCustomDataToRootFormGroup<T = unknown>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any,
  key: string,
  value: T
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (control.root as any)[key] = value;
}

export function getCustomDataToRootFormGroup<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any,
  key: string,
  defaultValue: T
) {
  if (Object.getOwnPropertyDescriptor(control?.root || {}, key)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (control?.root as any)[key] as T;
  }
  return defaultValue;
}

export function transformValidationErrorsToClassValidatorErrors(
  errors: ValidationError[]
): ClassValidatorErrors {
  const customErrors: ClassValidatorErrors = {};

  errors.forEach((error: ValidationError) => {
    if (error && error.constraints !== undefined) {
      Object.keys(error.constraints).forEach((key: string) => {
        if (!customErrors[error.property]) {
          customErrors[error.property] = {};
        }
        if (!customErrors[error.property].messages) {
          customErrors[error.property].messages = [];
        }
        if (
          error.constraints &&
          customErrors[error.property].messages?.indexOf(
            error.constraints[key]
          ) === -1
        ) {
          customErrors[error.property].messages?.push(error.constraints[key]);
        }
      });
    }

    if (error.children !== undefined && error.children.length) {
      if (!customErrors[error.property]) {
        customErrors[error.property] = {};
      }
      if (!customErrors[error.property].children) {
        customErrors[error.property].children = {};
      }
      customErrors[error.property].children =
        transformValidationErrorsToClassValidatorErrors(error.children);
    }
  });

  return customErrors;
}

export function transformClassValidatorErrorsToShortValidationErrors(
  errors: ClassValidatorErrors
): ShortValidationErrors {
  const customErrors: ShortValidationErrors = {};
  Object.keys(errors).forEach((key) => {
    if (errors[key]?.messages?.length) {
      if (!customErrors[key]) {
        customErrors[key] = {};
      }
      customErrors[key] = errors[key].messages;
    }
    if (Object.keys(errors[key]?.children || {}).length) {
      if (!customErrors[key]) {
        customErrors[key] = {};
      }
      customErrors[key] = {
        ...transformClassValidatorErrorsToShortValidationErrors(
          errors[key].children || {}
        ),
      };
    }
  });

  return customErrors;
}

export function mergeErrors<T>(externalErrors?: T, validationErrors?: T) {
  const clonedExternalErrors = cloneDeep(externalErrors);
  const clonedValidationErrors = cloneDeep(validationErrors);
  return mergeWith(
    clonedExternalErrors,
    clonedValidationErrors,
    (objValue, srcValue) => {
      if (Array.isArray(objValue) && !Array.isArray(srcValue)) {
        return [...objValue, ...Object.keys(srcValue || {})].filter(Boolean);
      }
      if (Array.isArray(srcValue) && !Array.isArray(objValue)) {
        return [...Object.keys(objValue || {}), ...srcValue].filter(Boolean);
      }

      if (canMerge()) {
        return objValue.concat(srcValue);
      }

      return undefined;

      function canMerge() {
        return (
          Array.isArray(objValue) &&
          Array.isArray(srcValue) &&
          !objValue.find((objItem) => srcValue.includes(objItem))
        );
      }
    }
  );
}

export function collectDynamicFormGroupErrors<T>(
  control: DynamicFormGroup<T, T>
) {
  if (control.controls) {
    return {
      ...Object.keys(control.controls).reduce((all, key) => {
        const childErrors = collectDynamicFormGroupErrors(
          control.controls[key] as DynamicFormGroup
        );
        if (childErrors && Object.keys(childErrors).length > 0) {
          all = {
            ...all,
            [key]: {
              ...childErrors,
            },
          };
        }
        return all;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, {} as any),
    };
  } else {
    // todo: need check
    const key = control?.classTransformMetadata?.propertyName;
    const childErrors = control.errors;
    if (
      key &&
      childErrors?.[key]?.messages &&
      Array.isArray(childErrors[key]?.messages)
    ) {
      delete childErrors[key];
    }
    return childErrors;
  }
}

export function isPrimitiveClass(
  classType: IDynamicControlMetadata['classType']
) {
  return (
    classType &&
    (classType === Number ||
      classType === String ||
      classType === Boolean ||
      classType === Date)
  );
}

export function isPrimitiveType(object: unknown) {
  return (
    object &&
    (typeof object === 'number' ||
      typeof object === 'string' ||
      typeof object === 'boolean')
  );
}
