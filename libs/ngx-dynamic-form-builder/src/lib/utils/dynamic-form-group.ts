import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { classToClass, plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { getFromContainer, MetadataStorage, validate, validateSync, ValidationError, ValidationTypes, Validator, ValidatorOptions } from 'class-validator';
import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata';
import { cloneDeep, mergeWith } from 'lodash-es';
import 'reflect-metadata';
import { BehaviorSubject } from 'rxjs';
import { Dictionary, ShortValidationErrors, DynamicFormGroupField } from '../models';

export class DynamicFormGroup<TModel> extends FormGroup {

  public customValidateErrors = new BehaviorSubject<ShortValidationErrors>({});

  private _object: TModel;
  private _externalErrors: ShortValidationErrors;
  private _validatorOptions: ValidatorOptions;
  private _fb = new FormBuilder();

  constructor(public factoryModel: ClassType<TModel>, public fields: Dictionary, public defaultValidatorOptions?: ValidatorOptions) {
    super({});
    /*
    const classValidators = DynamicFormGroup.getClassValidators<TModel>(
      this.factoryModel,
      this.fields,
      this.defaultValidatorOptions
    );
    const formGroup = this._fb.group(
      classValidators
    );
    Object.keys(formGroup.controls).forEach(key => {
      this.addControl(key, formGroup.controls[key]);
    });
    this.valueChanges.subscribe(data => {
      this.validate(
        undefined,
        this.defaultValidatorOptions
      );
    });*/
    this.fields = this.onlyFields(this.fields);
  }

  // Getters & Setters
  set externalErrors(externalErrors: ShortValidationErrors) {
    this._externalErrors = externalErrors;
    this.validate();
  }
  get externalErrors(): ShortValidationErrors {
    return this._externalErrors;
  }

  set validatorOptions(validatorOptions: ValidatorOptions) {
    this._validatorOptions = validatorOptions;
    this.validate();
  }
  get validatorOptions(): ValidatorOptions {
    return this._validatorOptions;
  }

  set object(object: TModel) {
    this.setObject(object);
  }
  get object() {
    return this.getObject();
  }

  // Public API
  validate(externalErrors?: ShortValidationErrors, validatorOptions?: ValidatorOptions) {
    this.validateAsync(externalErrors, validatorOptions).then(() => { }, error => { throw error; });
  }

  async validateAsync(externalErrors?: ShortValidationErrors, validatorOptions?: ValidatorOptions) {
    if (externalErrors === undefined) {
      externalErrors = cloneDeep(this._externalErrors);
    }

    if (validatorOptions === undefined) {
      validatorOptions = cloneDeep(this._validatorOptions);
    }

    if (!externalErrors) {
      externalErrors = {};
    }

    try {
      const result = await validate(this.object, validatorOptions);
      const validationErrors = this.transformValidationErrors(result);
      const allErrors = this.mergeErrors(externalErrors, validationErrors);
      this.markAsInvalidForExternalErrors(externalErrors, this.controls);
      this.customValidateErrors.next(allErrors);
    } catch (error) {
      throw error;
    }
  }

  validateAllFormFields() {
    Object.keys(this.controls).forEach(field => {
      const control = this.get(field);

      // Control
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
      // Group: recursive
      else if (control instanceof DynamicFormGroup) {
        control.validateAllFormFields();
      }
      // Array
      else if (control instanceof FormArray) {
        for (let i = 0; i < (control as FormArray).controls.length; i++) {
          // Control in Array
          if ((control as FormArray).controls[i] instanceof FormControl) {
            ((control as FormArray).controls[i] as FormControl).markAsTouched({ onlySelf: true });
          }
          // Group in Array: recursive
          else if ((control as FormArray).controls[i] instanceof DynamicFormGroup) {
            ((control as FormArray).controls[i] as DynamicFormGroup<any>).validateAllFormFields();
          }
        }
      }
    });
  }

  classToClass<TClassModel>(object: TClassModel) {
    return classToClass(object, { ignoreDecorators: true });
  }

  plainToClass<TClassModel, Object>(cls: ClassType<TClassModel>, plain: Object) {
    return plainToClass(cls, plain, { ignoreDecorators: true });
  }

  async setExternalErrorsAsync(externalErrors: ShortValidationErrors) {
    this._externalErrors = externalErrors;
    try {
      return await this.validateAsync();
    } catch (error) {
      throw error;
    }
  }

  setExternalErrors(externalErrors: ShortValidationErrors) {
    this.setExternalErrorsAsync(externalErrors).then(() => { }, error => { throw error; });
  }

  getExternalErrors(): ShortValidationErrors {
    return this._externalErrors;
  }

  clearExternalErrors() {
    this.setExternalErrors({});
  }
  clearExternalErrorsAsync() {
    return this.setExternalErrorsAsync({});
  }

  async setValidatorOptionsAsync(validatorOptions: ValidatorOptions) {
    this._validatorOptions = validatorOptions;
    try {
      return await this.validateAsync();
    } catch (error) {
      throw error;
    }
  }

  setValidatorOptions(validatorOptions: ValidatorOptions) {
    this.setValidatorOptionsAsync(validatorOptions).then(() => { }, error => { throw error; });
  }

  getValidatorOptions(): ValidatorOptions {
    return this._validatorOptions;
  }

  // Helpers
  private onlyFields(fields: Dictionary) {
    const newFields = {};

    if (fields !== undefined) {
      Object.keys(fields).forEach(key => {
        if (fields[key] instanceof DynamicFormGroup) {
          // Group: recursive
          newFields[key] = this.onlyFields((fields[key] as DynamicFormGroup<any>).fields);
        }
        else {
          // Array
          if (fields[key] instanceof FormArray) {
            if ((fields[key] as FormArray).controls[0] instanceof DynamicFormGroup) {
              // Group within Array: recursive
              newFields[key] = this.onlyFields(((fields[key] as FormArray).controls[0] as DynamicFormGroup<any>).fields);
            }
            else {
              // Control within Array
              newFields[key] = (fields[key] as FormArray).controls[0].value;
            }
          }
          else {
            // Handle Control
            newFields[key] = fields[key];
          }
        }
      });
    }

    return newFields;
  }

  private transformValidationErrors(errors: ValidationError[]): ShortValidationErrors {
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
        customErrors[error.property] = this.transformValidationErrors(error.children);
      }
    });

    return customErrors;
  }

  private mergeErrors(errors?: ShortValidationErrors, externalErrors?: ShortValidationErrors) {
    return mergeWith(errors, externalErrors, (objValue, srcValue) => {
      if (canMerge()) {
        return objValue.concat(srcValue);
      }

      function canMerge() {
        return Array.isArray(objValue) &&
          Array.isArray(srcValue) &&
          objValue.filter(objItem => srcValue.indexOf(objItem) !== -1).length === 0;
      }
    });
  }

  private markAsInvalidForExternalErrors(errors: ShortValidationErrors, controls: Dictionary<AbstractControl>) {
    Object.keys(controls).forEach(field => {
      const control = controls[field];

      // Control
      if (control instanceof FormControl) {
        if (errors && errors[field]) {
          control.setErrors({ externalError: true });
        }
        else if (control.errors && control.errors.externalError === true) {
          control.setErrors(null);
        }
      }
      // Group
      else if (control instanceof DynamicFormGroup) {
        control.markAsInvalidForExternalErrors(
          errors && errors[field] ? (errors[field] as ShortValidationErrors) : {},
          control.controls
        );
      }
      // Array
      else if (control instanceof FormArray) {
        for (let i = 0; i < (control as FormArray).length; i++) {
          // Control in Array
          if (control[i] instanceof FormControl) {
            if (errors && errors[i] && errors[i][field]) {
              control[i].setErrors({ externalError: true });
            }
            else if (control[i].errors && control[i].errors.externalError === true) {
              control[i].setErrors(null);
            }
          }
          // Group in Array
          else if (control[i] instanceof DynamicFormGroup) {
            control[i].markAsInvalidForExternalErrors(
              errors && errors[i] && errors[i][field] ? (errors[i][field] as ShortValidationErrors) : {},
              control[i].controls
            );
          }
        }
      }
    });
  }

  /**
   * Recursively gets all values from the form controls and all sub form group and array controls and returns it as
   * an object
   */
  private getObject(): TModel {
    // Initialize the shape of the response
    const object = this._object ? this.classToClass(this._object) : new this.factoryModel();

    if (object !== undefined) {
      // Recursively get the value of all fields
      Object.keys(this.controls).forEach(key => {
        // Handle Group
        if (this.controls[key] instanceof DynamicFormGroup) {
          object[key] = (this.controls[key] as DynamicFormGroup<any>).object;
        }

        // Handle Form Array
        else if (this.controls[key] instanceof FormArray) {

          // Initialize value
          object[key] = [];

          for (let i = 0; i < (this.controls[key] as FormArray).controls.length; i++) {
            let value;

            if ((this.controls[key] as FormArray).controls[i] instanceof DynamicFormGroup) {
              // Recursively get object group
              value = ((this.controls[key] as FormArray).controls[i] as DynamicFormGroup<any>).object;
            }
            else {
              value = (this.controls[key] as FormArray).controls[i].value;
            }

            object[key].push(value);
          }
        }

        // Handle Control
        else {
          object[key] = this.controls[key].value;
        }
      });
    }

    return this.plainToClass(this.factoryModel, object);
  }

  /**
   * Sets the value of every control on the form and recursively sets the values of the controls
   * on all sub form groups
   *
   * @param object the data to assign to all controls of the form group and sub groups
   */
  private setObject(object: TModel) {
    if (object instanceof this.factoryModel) {
      this._object = this.classToClass(object); // Ensure correct type
    }
    else {
      this._object = this.plainToClass(this.factoryModel, object as Object); // Convert to Model type
    }

    // Recursively set the value of all fields
    Object.keys(this.controls).forEach(key => {
      // Handle Group
      if (this.controls[key] instanceof DynamicFormGroup) {
        (this.controls[key] as DynamicFormGroup<any>).object = this._object ? this._object[key] : {};
      }

      // Handle FormArray
      else if (this.controls[key] instanceof FormArray) {

        const objectArray = this._object ? this._object[key] : [];
        const formArray = (this.controls[key] as FormArray);
        const isFormGroup = formArray.controls[0] instanceof DynamicFormGroup;
        const prevFormGroup = formArray.controls[0] as DynamicFormGroup<any>;
        const formControl = formArray.controls[0] as FormControl;

        // Clear FormArray while retaining the reference
        while (formArray.length !== 0) {
          formArray.removeAt(0);
        }

        for (let i = 0; i < objectArray.length; i++) {
          if (isFormGroup) {
            // Create FormGroup
            const dynamicFormGroup = new DynamicFormGroup(prevFormGroup.factoryModel, prevFormGroup.fields, this._validatorOptions);

            dynamicFormGroup.setParent(this);

            const classValidators = getClassValidators<TModel>(prevFormGroup.factoryModel, prevFormGroup.fields, this._validatorOptions);
            const formGroup = this._fb.group(classValidators);

            // Add all controls to the form group
            Object.keys(formGroup.controls).forEach(ctrlKey => {
              dynamicFormGroup.addControl(ctrlKey, formGroup.controls[ctrlKey]);
            });

            // Add a value change listener to the group. on change, validate
            dynamicFormGroup.valueChanges.subscribe(data => {
              dynamicFormGroup.validate(undefined, this._validatorOptions);
            });

            formArray.controls.push(dynamicFormGroup);

            // Recusrively set the object value
            (formArray.controls[i] as DynamicFormGroup<any>).object = (this._object && objectArray && objectArray[i])
              ? objectArray[i]
              : {};
          }
          else {
            // Create control
            const controlValue = (this._object && objectArray && objectArray[i]) ? objectArray[i] : undefined;
            const newFormControl = new FormControl(controlValue, formControl.validator);
            newFormControl.setParent(this);

            // Add the control to the FormArray
            formArray.controls.push(newFormControl);
          }
        }
      }

      // Handle Control
      else {
        const newObject = this._object ? this._object[key] : [];
        this.controls[key].setValue(this._object && newObject ? newObject : undefined);
      }
    });
  }
}


export function getClassValidators<TModel>(factoryModel: ClassType<TModel>, fields: Dictionary, validatorOptions?: ValidatorOptions) {

  // Get the validation rules from the object decorators
  const allValidationMetadatas: ValidationMetadata[] = getFromContainer(MetadataStorage).getTargetValidationMetadatas(factoryModel, '');

  // Get the validation rules for the validation group: https://github.com/typestack/class-validator#validation-groups
  const validationGroupMetadatas: ValidationMetadata[] = getFromContainer(MetadataStorage).getTargetValidationMetadatas(
      factoryModel,
      '',
      validatorOptions && validatorOptions.groups ? validatorOptions.groups : undefined
    );

  const formGroupFields = {};
  const validator = new Validator();

  // Loop through all fields in the form definition
  Object.keys(fields).filter(key => key.indexOf('__') !== 0).forEach(fieldName => {

    // Conditional Validation for the field
    const conditionalValidations: ValidationMetadata[] = [];
    validationGroupMetadatas.forEach(validationMetadata => {
      if (isPropertyValidatorOfType(validationMetadata, fieldName, ValidationKeys.conditional.type)) {
        conditionalValidations.push(validationMetadata);
      }
    });

    // All Nested Validation for the field
    const allNestedValidations: ValidationMetadata[] = [];
      allValidationMetadatas.forEach(validationMetadata => {
        if (isPropertyValidatorOfType(validationMetadata, fieldName, ValidationKeys.nested.type)) {
          allNestedValidations.push(validationMetadata);
        }
      });

    // Nested Validation for the field for the requested class-validator group
    const nestedGroupValidations: ValidationMetadata[] = [];
    validationGroupMetadatas.forEach(validationMetadata => {
      if (isPropertyValidatorOfType(validationMetadata, fieldName, ValidationKeys.nested.type)) {
        nestedGroupValidations.push(validationMetadata);
      }
    });

    const fieldDefinition: DynamicFormGroupField = {
      data: formGroupFields[fieldName],
      validation: []
    };

    if (fieldDefinition.data === undefined) {
      fieldDefinition.data = fields[fieldName];
    }

    validationGroupMetadatas.forEach(validationMetadata => {
      if (validationMetadata.propertyName === fieldName && validationMetadata.type !== ValidationKeys.conditional.type) {

        // tslint:disable-next-line:forin
        for (const typeKey in ValidationTypes) {

          const canValidateField = ValidationTypes.hasOwnProperty(typeKey)
            && validationMetadata.type === ValidationTypes[typeKey]
            && validator[validationMetadata.type] === undefined;

          if (canValidateField) {

            const canValidateNested = (
              (
                allNestedValidations.length === nestedGroupValidations.length
                || (fields[fieldName] instanceof DynamicFormGroup && allNestedValidations.length > 0 && nestedGroupValidations.length === 0)
                || (fields[fieldName] instanceof FormArray && allNestedValidations.length > 0 && nestedGroupValidations.length === 0)
              )
              &&
              (
                // Property is marked with @ValidateNested()
                validationMetadata.type === ValidationKeys.nested.type
                && typeKey === ValidationKeys.nested.key
              )
            );

            // Handle nested validation
            if (canValidateNested) {
              let objectToValidate: any;

              if (fields[fieldName] instanceof DynamicFormGroup) {
                fields[fieldName].object = fields[fieldName].fields;
                objectToValidate = fields[fieldName].object;
              }

              // Fill field data if empty
              if (fieldDefinition.data === undefined) {
                fieldDefinition.data = fields[fieldName];
              }

              // create validation function and add to field validation
              const nestedValidate = function (control: FormControl) {
                const isValid = getValidateErrors(control, objectToValidate, validatorOptions).length === 0;
                return getIsValidResult(isValid, validationMetadata);
              };

              fieldDefinition.validation.push(nestedValidate);
            }

            // Handle Custom Validation
            else if (validationMetadata.type === ValidationKeys.custom.type && typeKey === ValidationKeys.custom.key) {

              // create validation function and add to field validation
              const customValidation = function (control: FormControl) {

                const validateErrors: ValidationError[] = setObjectValueAndGetValidationErrors(control, fieldName, validatorOptions);
                const isValid = getAllErrors(validateErrors, fieldName).length === 0;

                return getIsValidResult(isValid, validationMetadata);
              };

              fieldDefinition.validation.push(customValidation);

              // Set field data
              if (fields[fieldName] instanceof DynamicFormGroup) {
                fields[fieldName].object = fields[fieldName].fields;
              }

              if (fieldDefinition.data === undefined) {
                fieldDefinition.data = fields[fieldName];
              }
            }

            // Handle remaining validation
            else {

              // create validation function and add to field validation
              const dynamicValidate = function (control: FormControl) {

                if (!control) {
                  return null;
                }

                let isValid = (control.parent && control.parent.value)
                  ? validator.validateValueByMetadata(control.value, validationMetadata)
                  : true;

                if (!isValid && conditionalValidations.length > 0) {
                  const validateErrors = setObjectValueAndGetValidationErrors(control, fieldName, validatorOptions);
                  isValid = validateErrors.filter((error: ValidationError) => error.property === fieldName).length === 0;
                }

                return getIsValidResult(isValid, validationMetadata);
              };

              fieldDefinition.validation.push(dynamicValidate);

              // Set field data
              if (fields[fieldName] instanceof DynamicFormGroup) {
                fields[fieldName].object = fields[fieldName].fields;
              }

              if (fieldDefinition.data === undefined) {
                fieldDefinition.data = fields[fieldName];
              }

            }
          }
        }
      }
    });

    // Convert to a structure, angular understands
    if (fieldDefinition.data instanceof DynamicFormGroup || fieldDefinition.data instanceof FormArray) {
      formGroupFields[fieldName] = fieldDefinition.data;
    }
    else {
      formGroupFields[fieldName] = [fieldDefinition.data, fieldDefinition.validation];
    }
  });

  return formGroupFields;
}

// ******************************************************************************************
// Helper functions to help make the main code more readable
//

function isPropertyValidatorOfType(validationMetadata: ValidationMetadata, fieldName: string, validationMetadataType: string) {
  return validationMetadata.propertyName === fieldName && validationMetadata.type === validationMetadataType;
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

const ValidationKeys = {
  nested: {
    type: 'nestedValidation',
    key: 'NESTED_VALIDATION'
  },
  conditional: {
    type: 'conditionalValidation',
  },
  custom: {
    type: 'customValidation',
    key: 'CUSTOM_VALIDATION'
  }
};
