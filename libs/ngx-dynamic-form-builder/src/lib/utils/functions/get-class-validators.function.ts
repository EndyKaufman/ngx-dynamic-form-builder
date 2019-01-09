import { FormControl } from '@angular/forms';
import { ClassType } from 'class-transformer/ClassTransformer';
import { getFromContainer, MetadataStorage, validateSync, ValidationError, ValidationTypes, Validator, ValidatorOptions } from 'class-validator';
import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata';
import 'reflect-metadata';
import { Dictionary, DynamicFormGroupField } from '../../models';
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

  // Loop through all fields in the form definition
  Object.keys(fields).filter(key => key.indexOf('__') !== 0).forEach(fieldName => {

    // Initialize the field definition with the value of the field
    const fieldDefinition: DynamicFormGroupField = {
      data: formGroupFields[fieldName],
      validation: []
    };

    if (fieldDefinition.data === undefined) {
      fieldDefinition.data = fields[fieldName];
    }

    if (!Array.isArray(fields[fieldName])) {
      if (fields[fieldName] instanceof DynamicFormGroup) {
        fields[fieldName].object = fields[fieldName].fields;
      }

      fieldDefinition.data = fields[fieldName];
    }

    // identify any conditional validation for the field (Marked with @IsOptional())
    const conditionalValidations: ValidationMetadata[] = [];

    validationMetadatas.forEach(validationMetadata => {
      if (validationMetadata.propertyName === fieldName && validationMetadata.type === 'conditionalValidation') {
        conditionalValidations.push(validationMetadata);
      }
    });

    // Loop through all validation definitions and create validation functions for the field
    validationMetadatas.forEach(validationMetadata => {

      if (validationMetadata.propertyName === fieldName) {
        if (validationMetadata.type !== 'conditionalValidation') {
          switch (validationMetadata.type) {
            /*
            case ValidationTypes.IS_NOT_EMPTY: {
                formGroupField.validation.push(Validators.required);
                break;
            }
            case ValidationTypes.IS_EMAIL: {
                formGroupField.validation.push(Validators.required);
                break;
            }*/
            default: {
              for (const typeKey in ValidationTypes) {
                if (ValidationTypes.hasOwnProperty(typeKey)) {
                  if (hasValidationRule(validationMetadata, validator, typeKey)) {

                    // Handle nested validation
                    if (validationMetadata.type === 'nestedValidation' && typeKey === 'NESTED_VALIDATION') {
                      const nestedValidate = function (control: FormControl) {
                        const isValid = getValidateErrors(control, control.value, validatorOptions).length === 0;
                        return getIsValidResult(isValid, validationMetadata);
                      };

                      fieldDefinition.validation.push(nestedValidate);
                    }

                    // Handle Custom Validation
                    else if (validationMetadata.type === 'customValidation' && typeKey === 'CUSTOM_VALIDATION') {
                      const customValidation = function (control: FormControl) {
                        const validateErrors: ValidationError[] = setObjectValueAndGetValidationErrors(control, fieldName, validatorOptions);
                        const isValid = getAllErrors(validateErrors, fieldName).length === 0;

                        return getIsValidResult(isValid, validationMetadata);
                      };

                      fieldDefinition.validation.push(customValidation);
                    }

                    // Handle remaining validation
                    else {
                      const dynamicValidate = function (control: FormControl) {

                        if (!control) {
                          return null;
                        }

                        let isValid = control.parent && control.parent.value ? validator.validateValueByMetadata(control.value, validationMetadata) : true;

                        if (!isValid && conditionalValidations.length > 0) {
                          const validateErrors: ValidationError[] = setObjectValueAndGetValidationErrors(control, fieldName, validatorOptions);
                          isValid = validateErrors.filter((error: ValidationError) => error.property === fieldName).length === 0;
                        }

                        return getIsValidResult(isValid, validationMetadata);
                      };

                      fieldDefinition.validation.push(dynamicValidate);
                    }
                  }
                }
              }

              break;
            }
          }
        }
      }
    });

    // Convert to a structure, angular understans
    if (fieldDefinition.data instanceof DynamicFormGroup) {
      formGroupFields[fieldName] = fieldDefinition.data;
    } else {
      formGroupFields[fieldName] = [
        fieldDefinition.data,
        fieldDefinition.validation
      ];
    }
  });

  return formGroupFields;
}

// *************************
// Helper functions to help make the main code more readable
//

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
