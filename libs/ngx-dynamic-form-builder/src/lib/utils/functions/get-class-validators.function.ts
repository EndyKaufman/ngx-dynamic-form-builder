import { FormControl } from '@angular/forms';
import { ClassType } from 'class-transformer/ClassTransformer';
import { getFromContainer, MetadataStorage, validateSync, ValidationError, ValidationTypes, Validator, ValidatorOptions } from 'class-validator';
import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata';
import 'reflect-metadata';
import { Dictionary } from '../../models';
import { DynamicFormGroup } from '../dynamic-form-group';

export function getClassValidators<TModel>(factoryModel: ClassType<TModel>, fields: Dictionary, validatorOptions?: ValidatorOptions) {

  // Get the validation rules from the object decorators
  const validationMetadatas: ValidationMetadata[] =
    getFromContainer(MetadataStorage).getTargetValidationMetadatas(
      factoryModel,
      '',
      validatorOptions && validatorOptions.groups ? validatorOptions.groups : undefined
    );

  const formGroupFields = {};
  const validator = new Validator();

  Object.keys(fields).filter(key => key.indexOf('__') !== 0).forEach(key => {
    let formGroupField = formGroupFields[key];

    if (formGroupField === undefined) {
      formGroupField = Array.isArray(fields[key]) ? fields[key] : [];
    }

    if (!Array.isArray(fields[key])) {
      if (fields[key] instanceof DynamicFormGroup) {
        fields[key].object = fields[key].fields;
      }
      formGroupField.push(fields[key]);
    }

    const conditionalValidations: ValidationMetadata[] = [];

    validationMetadatas.forEach(validationMetadata => {
      if (validationMetadata.propertyName === key && validationMetadata.type === 'conditionalValidation') {
        conditionalValidations.push(validationMetadata);
      }
    });

    validationMetadatas.forEach(validationMetadata => {
      if (validationMetadata.propertyName === key && validationMetadata.type !== 'conditionalValidation') {
        switch (validationMetadata.type) {
          /*
          case ValidationTypes.IS_NOT_EMPTY: {
              formGroupField.push(Validators.required);
              break;
          }
          case ValidationTypes.IS_EMAIL: {
              formGroupField.push(Validators.required);
              break;
          }*/
          default: {
            for (const typeKey in ValidationTypes) {
              if (ValidationTypes.hasOwnProperty(typeKey)) {

                // Handle nested validation
                if (isNestedValidation(validationMetadata, validator, typeKey)) {
                  const nestedValidate = function (c: FormControl) {
                    const isValid = getValidateErrors(c, c.value, validatorOptions).length === 0;
                    return getIsValidResult(isValid, validationMetadata);
                  };

                  formGroupField.push(nestedValidate);
                }

                // Handle Custom Validation
                if (isCustomValidation(validationMetadata, validator, typeKey)) {

                  const customValidation = function (c: FormControl) {
                    const validateErrors: ValidationError[] = setObjectValueAndGetValidationErrors(c, key, validatorOptions);
                    const isValid = getAllErrors(validateErrors, key).length === 0;

                    return getIsValidResult(isValid, validationMetadata);
                  };

                  formGroupField.push(customValidation);
                }

                // Handle remaining validation
                if (hasValidationRule(validationMetadata, validator, typeKey)) {
                  const dynamicValidate = function (c: FormControl) {

                    if (!c) {
                      return null;
                    }

                    let isValid = c.parent && c.parent.value ? validator.validateValueByMetadata(c.value, validationMetadata) : true;

                    if (!isValid && conditionalValidations.length > 0) {
                      const validateErrors: ValidationError[] = setObjectValueAndGetValidationErrors(c, key, validatorOptions);
                      isValid = validateErrors.filter((error: ValidationError) => error.property === key).length === 0;
                    }

                    return getIsValidResult(isValid, validationMetadata);
                  };

                  formGroupField.push(dynamicValidate);
                }
              }
            }
            break;
          }
        }
      }
    });

    if (formGroupField[0] instanceof DynamicFormGroup) {
      formGroupFields[key] = formGroupField[0];
    } else {
      formGroupFields[key] = [
        formGroupField[0],
        formGroupField.filter((item, index) => index !== 0)
      ];
    }
  });

  return formGroupFields;
}

// *************************
// Helper functions to help make the main code more readable
//

function isNestedValidation(validationMetadata: ValidationMetadata, validator: Validator, typeKey: string): boolean {
  return hasValidationRule(validationMetadata, validator, typeKey) &&
    validationMetadata.type === 'nestedValidation' &&
    typeKey === 'NESTED_VALIDATION';
}

function isCustomValidation(validationMetadata: ValidationMetadata, validator: Validator, typeKey: string): boolean {
  return hasValidationRule(validationMetadata, validator, typeKey) &&
    validationMetadata.type === 'customValidation' &&
    typeKey === 'CUSTOM_VALIDATION';
}

function hasValidationRule(validationMetadata: ValidationMetadata, validator: Validator, typeKey: string) {
  return validationMetadata.type === ValidationTypes[typeKey] && validator[validationMetadata.type] === undefined;
}

function getAllErrors(validateErrors: ValidationError[], key: string): ValidationError[] {
  return validateErrors.filter((error: ValidationError) => {
    // Check for nested/child errors
    if (error.children.length && error.children.filter(children => children.property === key)) {
      return true;
    }

    // If this exists, it is also an error

    // NOTE: Not exactly sure what this is supposed to do. It looks like it will always return true if the array.length > 0.
    // Could substitute the function with a length check?
    return true;
  });
}

function setObjectValueAndGetValidationErrors(control: FormControl, key: string, validatorOptions: ValidatorOptions) {
  const object = (control.parent instanceof DynamicFormGroup)
    ? (control.parent as DynamicFormGroup<any>).object
    : (control.parent ? control.parent.value : {});

  if (object) {
    object[key] = control.value;
  }

  return getValidateErrors(control, object, validatorOptions);
}

function getValidateErrors(control: FormControl, data: any, validatorOptions: ValidatorOptions) {
  const validateErrors: ValidationError[] = (control.parent && control.parent.value)
    ? validateSync(data, validatorOptions)
    : [];

  return validateErrors;
}

function getIsValidResult(isValid: boolean, validationMetadata: ValidationMetadata) {
  return isValid
    ? null
    : {
      customValidation: {
        valid: false,
        type: validationMetadata.type
      }
    };
}


