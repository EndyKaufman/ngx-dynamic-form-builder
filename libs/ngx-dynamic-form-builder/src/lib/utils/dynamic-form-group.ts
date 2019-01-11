import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { classToClass, plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { getFromContainer, MetadataStorage, validate, validateSync, ValidationError, ValidationTypes, Validator, ValidatorOptions } from 'class-validator';
import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata';
import { cloneDeep, mergeWith } from 'lodash-es';
import 'reflect-metadata';
import { BehaviorSubject } from 'rxjs';
import { Dictionary, ShortValidationErrors } from '../models';

export class DynamicFormGroup<TModel> extends FormGroup {

  public customValidateErrors = new BehaviorSubject<ShortValidationErrors>({});
  public formErrors: ShortValidationErrors;

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

      this.formErrors = allErrors;
      this.customValidateErrors.next(this.formErrors);
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
  const allValidationMetadatas: ValidationMetadata[] = getFromContainer(MetadataStorage).getTargetValidationMetadatas(
    factoryModel,
    ''
  );
  const validationMetadatas: ValidationMetadata[] = getFromContainer(MetadataStorage).getTargetValidationMetadatas(
    factoryModel,
    '',
    validatorOptions && validatorOptions.groups ? validatorOptions.groups : undefined
  );
  const formGroupFields = {};
  const validator = new Validator();
  Object.keys(fields)
    .filter(key => key.indexOf('__') !== 0)
    .forEach(key => {
      const conditionalValidations: ValidationMetadata[] = [];
      validationMetadatas.forEach(validationMetadata => {
        if (validationMetadata.propertyName === key && validationMetadata.type === 'conditionalValidation') {
          conditionalValidations.push(validationMetadata);
        }
      });
      const allNestedValidations: ValidationMetadata[] = [];
      allValidationMetadatas.forEach(validationMetadata => {
        if (validationMetadata.propertyName === key && validationMetadata.type === 'nestedValidation') {
          allNestedValidations.push(validationMetadata);
        }
      });
      const nestedValidations: ValidationMetadata[] = [];
      validationMetadatas.forEach(validationMetadata => {
        if (validationMetadata.propertyName === key && validationMetadata.type === 'nestedValidation') {
          nestedValidations.push(validationMetadata);
        }
      });
      let formGroupField = formGroupFields[key];
      if (formGroupField === undefined) {
        formGroupField = Array.isArray(fields[key]) ? fields[key] : [];
      }
      validationMetadatas.forEach(validationMetadata => {
        if (validationMetadata.propertyName === key && validationMetadata.type !== 'conditionalValidation') {
          for (const typeKey in ValidationTypes) {
            if (ValidationTypes.hasOwnProperty(typeKey)) {
              if (
                checkWithAllNestedValidations(allNestedValidations, nestedValidations, key)
              ) {
                if (
                  isNestedValidate(validationMetadata, typeKey)
                ) {
                  let objectToValidate: any;
                  if (fields[key] instanceof DynamicFormGroup) {
                    fields[key].object = fields[key].fields;
                    objectToValidate = fields[key].object;
                  }
                  if (formGroupField.length === 0) {
                    formGroupField.push(fields[key]);
                  }
                  const nestedValidate = createNestedValidate(objectToValidate, validationMetadata);
                  formGroupField.push(nestedValidate);
                }
              }
              if (
                isCustomValidate(validationMetadata, typeKey)
              ) {
                const customValidation = createCustomValidation(key, validationMetadata);
                if (fields[key] instanceof DynamicFormGroup) {
                  fields[key].object = fields[key].fields;
                }
                if (formGroupField.length === 0) {
                  formGroupField.push(fields[key]);
                }
                formGroupField.push(customValidation);
              }
              if (
                isDynamicValidate(validationMetadata, typeKey)
              ) {
                const dynamicValidate = createDynamicValidate(validationMetadata, conditionalValidations, key);
                if (fields[key] instanceof DynamicFormGroup) {
                  fields[key].object = fields[key].fields;
                }
                if (formGroupField.length === 0) {
                  formGroupField.push(fields[key]);
                }
                formGroupField.push(dynamicValidate);
              }
            }
          }
        }
      });
      if (formGroupField[0] instanceof DynamicFormGroup) {
        formGroupFields[key] = formGroupField[0];
      } else {
        if (formGroupField[0] instanceof FormArray) {
          formGroupFields[key] = formGroupField[0];
        } else {
          formGroupFields[key] = [formGroupField[0], formGroupField.filter((item, index) => index !== 0)];
        }
      }
    });
  return formGroupFields;

  // ******************************************************************************************
  // Helper functions to help make the main code more readable
  //

  function createNestedValidate(objectToValidate: any, validationMetadata: ValidationMetadata) {
    return function (control: FormControl) {
      const isValid = control.parent && control.parent.value ? validateSync(objectToValidate || control.value, validatorOptions).length === 0 : true;
      return isValid
        ? null
        : {
          nestedValidate: {
            valid: false,
            type: validationMetadata.type
          }
        };
    };
  }

  function createDynamicValidate(validationMetadata: ValidationMetadata, conditionalValidations: ValidationMetadata[], key: string) {
    return function (control: FormControl) {
      if (!control) {
        return null;
      }
      let isValid = control.parent && control.parent.value
        ? validator.validateValueByMetadata(control.value, validationMetadata)
        : true;
      if (!isValid && conditionalValidations.length > 0) {
        // todo: refactor
        const object = control.parent instanceof DynamicFormGroup
          ? (control.parent as DynamicFormGroup<any>).object
          : control.parent
            ? control.parent.value
            : {};
        if (object) {
          object[key] = control.value;
        }
        const validateErrors = control.parent && control.parent.value ? validateSync(object, validatorOptions) : [];
        isValid =
          validateErrors.filter((error: ValidationError) => {
            if (error.property === key) {
              return true;
            }
            return false;
          }).length === 0;
      }
      return isValid
        ? null
        : {
          dynamicValidate: {
            valid: false,
            type: validationMetadata.type
          }
        };
    };
  }

  function createCustomValidation(key: string, validationMetadata: ValidationMetadata) {
    return function (control: FormControl) {
      // todo: refactor
      const object = control.parent instanceof DynamicFormGroup
        ? (control.parent as DynamicFormGroup<any>).object
        : control.parent
          ? control.parent.value
          : {};
      if (object) {
        object[key] = control.value;
      }
      const validateErrors = control.parent && control.parent.value ? validateSync(object, validatorOptions) : [];
      const isValid = validateErrors.filter((error: ValidationError) => {
        if (error.children.length && error.children.filter(children => children.property === key)) {
          return true;
        }
        return true;
      }).length === 0;
      return isValid
        ? null
        : {
          customValidation: {
            valid: false,
            type: validationMetadata.type
          }
        };
    };
  }

  function checkWithAllNestedValidations(allNestedValidations: ValidationMetadata[], nestedValidations: ValidationMetadata[], key: string) {
    return (allNestedValidations.length === nestedValidations.length) ||
      (fields[key] instanceof DynamicFormGroup &&
        (allNestedValidations.length > 0 && nestedValidations.length === 0)) ||
      (fields[key] instanceof FormArray &&
        (allNestedValidations.length > 0 && nestedValidations.length === 0));
  }

  function isDynamicValidate(validationMetadata: ValidationMetadata, typeKey: string) {
    return validationMetadata.type === ValidationTypes[typeKey] &&
      validator[validationMetadata.type] !== undefined;
  }

  function isCustomValidate(validationMetadata: ValidationMetadata, typeKey: string) {
    return validationMetadata.type === ValidationTypes[typeKey] &&
      validator[validationMetadata.type] === undefined &&
      validationMetadata.type === 'customValidation' &&
      typeKey === 'CUSTOM_VALIDATION';
  }

  function isNestedValidate(validationMetadata: ValidationMetadata, typeKey: string) {
    return validationMetadata.type === ValidationTypes[typeKey] &&
      validator[validationMetadata.type] === undefined &&
      validationMetadata.type === 'nestedValidation' &&
      typeKey === 'NESTED_VALIDATION';
  }
}
