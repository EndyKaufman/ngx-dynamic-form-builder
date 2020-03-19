import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn
} from '@angular/forms';
import { classToClass, plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import {
  getFromContainer,
  MetadataStorage,
  validate,
  ValidationTypes,
  Validator,
  ValidatorOptions
} from 'class-validator';
import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata';
import 'reflect-metadata';
import { BehaviorSubject, from, Observable, of, Subject, Subscription } from 'rxjs';
import { flatMap, map, mapTo, delay } from 'rxjs/operators';
import { Dictionary } from '../models/dictionary';
import { DynamicFormGroupField } from '../models/dynamic-form-group-field';
import { ErrorPropertyName } from '../models/error-property-name';
import { FormModel } from '../models/form-model';
import { ShortValidationErrors } from '../models/short-validation-errors';
import { ValidatorFunctionType } from '../models/validator-function-type';
import { foreverInvalid, FOREVER_INVALID_NAME } from '../validators/forever-invalid.validator';
import { DynamicFormControl } from './dynamic-form-control';
import { mergeErrors, transformValidationErrors } from './dynamic-form-group-helpers';

const cloneDeep = require('lodash.clonedeep');
const mergeWith = require('lodash.mergewith');

export class DynamicFormGroup<TModel> extends FormGroup {
  public nativeValidateErrors = new BehaviorSubject<Dictionary>({});
  public customValidateErrors = new BehaviorSubject<ShortValidationErrors>({});
  public formErrors: ShortValidationErrors;
  public formFields: Dictionary;
  public objectChange = new Subject();
  public valueChangesSubscription: Subscription;

  private _object: TModel;
  private _externalErrors: ShortValidationErrors;
  private _validatorOptions: ValidatorOptions;
  private _fb = new FormBuilder();

  constructor(
    public factoryModel: ClassType<TModel>,
    public fields?: FormModel<TModel>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super({}, validatorOrOpts, asyncValidator);
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
    this.formFields = this.onlyFields(fields);
  }

  subscribeToValueChanges(externalErrors?: ShortValidationErrors, validatorOptions?: ValidatorOptions) {
    if (!this.valueChangesSubscription) {
      this.valueChangesSubscription = this.valueChanges
        .pipe(flatMap(data => from(this.validateAsync(externalErrors, validatorOptions)).pipe(mapTo(data))))
        .subscribe({
          error: err => {
            throw err;
          }
        });
    }
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
    this.validateAsync(externalErrors, validatorOptions).then(
      () => {},
      error => {
        throw error;
      }
    );
  }

  validateAsync(externalErrors?: ShortValidationErrors, validatorOptions?: ValidatorOptions) {
    if (externalErrors === undefined) {
      externalErrors = cloneDeep(this._externalErrors);
    }

    if (validatorOptions === undefined) {
      validatorOptions = cloneDeep(this._validatorOptions);
    }

    return from(validate(this.object, validatorOptions))
      .pipe(
        map(errors => {
          if (!externalErrors) {
            externalErrors = {};
          }

          const validationErrors = transformValidationErrors(errors);
          const allErrors = mergeErrors(externalErrors, validationErrors);

          this.markAsInvalidForExternalErrors(externalErrors);
          this.setCustomErrors(allErrors);

          // todo: refactor, invalidate form if exists any allErrors
          let usedForeverInvalid = false;
          if (
            Object.keys(allErrors).filter(key => key !== FOREVER_INVALID_NAME).length === 0 &&
            this.get(FOREVER_INVALID_NAME)
          ) {
            this.removeControl(FOREVER_INVALID_NAME);
            usedForeverInvalid = true;
          }
          if (this.valid && Object.keys(allErrors).length > 0 && !this.get(FOREVER_INVALID_NAME)) {
            this.addControl(FOREVER_INVALID_NAME, new FormControl('', [foreverInvalid]));
            usedForeverInvalid = true;
          }
          if (usedForeverInvalid) {
            this.updateValueAndValidity({
              onlySelf: true,
              emitEvent: false
            });
          }
        })
      )
      .toPromise();
  }

  setCustomErrors(allErrors: any) {
    this.formErrors = allErrors;
    this.customValidateErrors.next(this.formErrors);
    this.nativeValidateErrors.next(this.collectErrors(this));
  }

  private collectErrors(control: Dictionary, isRoot = true) {
    if (control.controls) {
      const errors = {
        ...(isRoot ? this.errors : {}),
        ...Object.entries(control.controls).reduce((acc, [key, childControl]: [string, Dictionary]) => {
          const childErrors = this.collectErrors(childControl, false);
          if (childErrors && key !== 'foreverInvalid' && Object.keys(childErrors).length > 0) {
            acc = {
              ...acc,
              [key]: {
                ...(acc && acc[key] ? acc[key] : {}),
                ...childErrors
              }
            };
          }
          return acc;
        }, {})
      };
      return errors;
    } else {
      return control.errors;
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

  resetValidateAllFormFields() {
    this.markAsInvalidForExternalErrors({});

    Object.keys(this.controls).forEach(field => {
      const control = this.get(field);

      // Control
      if (control instanceof FormControl) {
        control.setErrors(null, { emitEvent: false });
        control.markAsUntouched({ onlySelf: true });
        control.markAsPristine({ onlySelf: true });
      }
      // Group: recursive
      else if (control instanceof DynamicFormGroup) {
        control.resetValidateAllFormFields();
      }
      // Array
      else if (control instanceof FormArray) {
        for (let i = 0; i < (control as FormArray).controls.length; i++) {
          // Control in Array
          if ((control as FormArray).controls[i] instanceof FormControl) {
            ((control as FormArray).controls[i] as FormControl).setErrors(null, { emitEvent: false });
            ((control as FormArray).controls[i] as FormControl).markAsUntouched({ onlySelf: true });
            ((control as FormArray).controls[i] as FormControl).markAsPristine({ onlySelf: true });
          }
          // Group in Array: recursive
          else if ((control as FormArray).controls[i] instanceof DynamicFormGroup) {
            ((control as FormArray).controls[i] as DynamicFormGroup<any>).resetValidateAllFormFields();
          }
        }
      }
    });
    this.setCustomErrors({});
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
    this.setExternalErrorsAsync(externalErrors).then(
      () => {},
      error => {
        throw error;
      }
    );
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

  async setValidatorOptionsAsync(validatorOptions?: ValidatorOptions) {
    this._validatorOptions = <ValidatorOptions>validatorOptions;
    try {
      return await this.validateAsync();
    } catch (error) {
      throw error;
    }
  }

  setValidatorOptions(validatorOptions?: ValidatorOptions) {
    this.setValidatorOptionsAsync(validatorOptions).then(
      () => {},
      error => {
        throw error;
      }
    );
  }

  getValidatorOptions(): ValidatorOptions {
    return this._validatorOptions;
  }

  // Helpers
  private onlyFields(fields?: FormModel<any>): Dictionary {
    const newFields: Dictionary = {};

    if (fields !== undefined) {
      Object.keys(fields).forEach(key => {
        if (fields[key] instanceof DynamicFormGroup) {
          // Group: recursive
          newFields[key] = this.onlyFields((fields[key] as DynamicFormGroup<any>).formFields);
        } else {
          // Array
          if (fields[key] instanceof FormArray) {
            if ((fields[key] as FormArray).controls[0] instanceof DynamicFormGroup) {
              // Group within Array: recursive
              newFields[key] = this.onlyFields(
                ((fields[key] as FormArray).controls[0] as DynamicFormGroup<any>).formFields
              );
            } else {
              // Control within Array
              newFields[key] = (fields[key] as FormArray).controls[0].value;
            }
          } else {
            // Handle Control
            newFields[key] = fields[key];
          }
        }
      });
    }

    return newFields;
  }

  private markAsInvalidForExternalErrors(errors: ShortValidationErrors, controls?: Dictionary<AbstractControl>) {
    const currentControls = controls ? controls : this.controls;
    Object.keys(currentControls).forEach(field => {
      const control = currentControls[field];

      // Control
      if (control instanceof FormControl) {
        if (errors && errors[field]) {
          control.setErrors({ externalError: true });
        } else {
          if (control.errors && control.errors.externalError === true) {
            control.setErrors(null);
          }
        }
      }
      // Group
      else if (control instanceof DynamicFormGroup) {
        control.markAsInvalidForExternalErrors(errors && errors[field] ? (errors[field] as ShortValidationErrors) : {});
      }
      // Array
      else if (control instanceof FormArray) {
        for (let i = 0; i < (control as FormArray).length; i++) {
          // Control in Array
          if (control[i] instanceof FormControl) {
            if (errors && errors[i] && errors[i][field]) {
              control[i].setErrors({ externalError: true });
            } else if (control[i].errors && control[i].errors.externalError === true) {
              control[i].setErrors(null);
            }
          }
          // Group in Array
          else if (control[i] instanceof DynamicFormGroup) {
            control[i].markAsInvalidForExternalErrors(
              errors && errors[i] && errors[i][field] ? (errors[i][field] as ShortValidationErrors) : {}
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
    const object = this._object
      ? this.classToClass(this._object)
      : this.factoryModel
      ? new this.factoryModel()
      : undefined;

    if (object !== undefined) {
      // Recursively get the value of all fields
      Object.keys(this.controls)
        .filter(name => name !== FOREVER_INVALID_NAME)
        .forEach(key => {
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
              } else {
                value = (this.controls[key] as FormArray).controls[i].value;
              }
              if (value && Object.keys(value).length > 0) {
                object[key].push(value);
              }
            }
          }

          // Handle Control
          else {
            object[key] = this.controls[key].value;
          }
        });
    }
    return this.factoryModel ? this.plainToClass(this.factoryModel, object) : <TModel>object;
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
    } else {
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
        const formArray = this.controls[key] as FormArray;
        const isFormGroup = formArray.controls[0] instanceof DynamicFormGroup;
        const firstFormGroup = formArray.controls[0] as DynamicFormGroup<any>;
        const formControl = formArray.controls[0] as FormControl;

        // Clear FormArray while retaining the reference
        while (formArray.length !== 0) {
          if (
            formArray.controls[0] instanceof DynamicFormGroup &&
            (formArray.controls[0] as DynamicFormGroup<any>).valueChangesSubscription
          ) {
            (formArray.controls[0] as DynamicFormGroup<any>).valueChangesSubscription.unsubscribe();
          }
          formArray.removeAt(0);
        }

        for (let i = 0; i < objectArray.length; i++) {
          if (isFormGroup) {
            // Create FormGroup
            const dynamicFormGroup = new DynamicFormGroup(firstFormGroup.factoryModel, firstFormGroup.formFields);

            dynamicFormGroup.setParent(this);

            const classValidators = getClassValidators<TModel>(firstFormGroup.factoryModel, firstFormGroup.formFields);
            const formGroup = this._fb.group(classValidators);

            // Add all controls to the form group
            Object.keys(formGroup.controls).forEach(ctrlKey => {
              dynamicFormGroup.addControl(ctrlKey, formGroup.controls[ctrlKey]);
            });

            // Add a value change listener to the group. on change, validate
            dynamicFormGroup.subscribeToValueChanges(undefined, this._validatorOptions);

            formArray.controls.push(dynamicFormGroup);

            // Recusrively set the object value
            (formArray.controls[i] as DynamicFormGroup<any>).object =
              this._object && objectArray && objectArray[i] ? objectArray[i] : {};
          } else {
            // Create control
            const controlValue = this._object && objectArray && objectArray[i] ? objectArray[i] : undefined;
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
    this.objectChange.next(this._object);
  }
}

export function getClassValidators<TModel>(
  factoryModel: ClassType<TModel>,
  fields?: Dictionary,
  validatorOptions?: ValidatorOptions
) {
  // Get the validation rules from the object decorators
  const allValidationMetadatas: ValidationMetadata[] = getFromContainer(MetadataStorage).getTargetValidationMetadatas(
    factoryModel,
    ''
  );

  // Get the validation rules for the validation group: https://github.com/typestack/class-validator#validation-groups
  const validationGroupMetadatas: ValidationMetadata[] = getFromContainer(MetadataStorage).getTargetValidationMetadatas(
    factoryModel,
    '',
    validatorOptions && validatorOptions.groups ? validatorOptions.groups : undefined
  );

  const formGroupFields = {};
  const validator = new Validator();

  // Loop through all fields in the form definition
  if (fields) {
    Object.keys(fields)
      .filter(key => key.indexOf('__') !== 0)
      .forEach(fieldName => {
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
          data: formGroupFields[fieldName] || undefined,
          validationFunctions: [],
          validationDefinitions: []
        };

        if (fieldDefinition.data === undefined) {
          fieldDefinition.data = fields[fieldName];
        }
        // TRY LINK EXISTS NATIVE VALIDATIONS, UNSTABLE !!!
        if (
          Array.isArray(fieldDefinition.data) &&
          fieldDefinition.data.length > 1 &&
          fieldDefinition.data.filter(
            (validationFunction, index) => index > 0 && typeof validationFunction === 'function'
          ).length > 0
        ) {
          fieldDefinition.data
            .filter((validationFunction, index) => index > 0 && typeof validationFunction === 'function')
            .forEach(validationFunction => fieldDefinition.validationFunctions.push(validationFunction));
          fieldDefinition.data = fieldDefinition.data[0];
        }

        validationGroupMetadatas.forEach(validationMetadata => {
          if (
            validationMetadata.propertyName === fieldName &&
            validationMetadata.type !== ValidationKeys.conditional.type
          ) {
            // Add all validation to the field except the @NestedValidation definition as
            // being part of the form would imply it is validated if any other rules are present
            if (validationMetadata.type !== ValidationKeys.nested.type) {
              fieldDefinition.validationDefinitions.push(validationMetadata);
            }

            for (const typeKey in ValidationTypes) {
              if (ValidationTypes.hasOwnProperty(typeKey)) {
                // Handle Nested Validation
                if (checkWithAllNestedValidations(allNestedValidations, nestedGroupValidations, fieldName)) {
                  if (isNestedValidate(validationMetadata, typeKey)) {
                    const objectToValidate =
                      fields[fieldName] instanceof DynamicFormGroup ? fields[fieldName].object : undefined;
                    const nestedValidate = createNestedValidate(fieldName, objectToValidate, validationMetadata);
                    setFieldData(fieldName, fieldDefinition, nestedValidate);
                  }
                }

                // Handle Custom Validation
                if (isCustomValidate(validationMetadata, typeKey)) {
                  const customValidation = createCustomValidation(fieldName, validationMetadata);
                  setFieldData(fieldName, fieldDefinition, customValidation);
                }

                // Handle remaining validation
                if (isDynamicValidate(validationMetadata, typeKey)) {
                  const dynamicValidate = createDynamicValidate(fieldName, validationMetadata, conditionalValidations);
                  setFieldData(fieldName, fieldDefinition, dynamicValidate);
                }
              }
            }
          }
        });
        // Convert to a structure, angular understands
        if (fieldDefinition.data instanceof DynamicFormGroup || fieldDefinition.data instanceof FormArray) {
          formGroupFields[fieldName] = fieldDefinition.data;
        } else {
          formGroupFields[fieldName] = new DynamicFormControl(fieldName, fieldDefinition);
        }
      });
  }
  return formGroupFields;

  // ******************************************************************************************
  // Local Helper functions to help make the main code more readable
  //

  function createNestedValidate(
    fieldName: string,
    objectToValidate: any,
    validationMetadata: ValidationMetadata
  ): ValidatorFunctionType {
    return {
      type: 'async',
      validator: function(control: FormControl) {
        return getValidateErrors(
          fieldName,
          control,
          objectToValidate !== undefined ? objectToValidate : control.value,
          validatorOptions
        ).pipe(
          map(errors => errors.length === 0),
          map(validateState => getIsValidResult(validateState, validationMetadata, 'nestedValidate'))
        );
      }
    };
  }

  function createDynamicValidate(
    fieldName: string,
    validationMetadata: ValidationMetadata,
    conditionalValidations: ValidationMetadata[]
  ): ValidatorFunctionType {
    return {
      type: 'async',
      validator: function(control: FormControl) {
        if (!control) {
          return of(null);
        }

        const isValid =
          control.parent && control.parent.value
            ? validator.validateValueByMetadata(control.value, validationMetadata)
            : true;
        let validateState$ = of(isValid);
        if (!isValid && conditionalValidations.length > 0) {
          validateState$ = setObjectValueAndGetValidationErrors(fieldName, control, validatorOptions).pipe(
            map(validateErrors => (validateErrors ? !!validateErrors[fieldName] : false))
          );
        }

        return validateState$.pipe(
          map(validateState => getIsValidResult(validateState, validationMetadata, 'dynamicValidate'))
        );
      }
    };
  }

  function createCustomValidation(fieldName: string, validationMetadata: ValidationMetadata): ValidatorFunctionType {
    return {
      type: 'async',
      validator: function(control: FormControl) {
        return setObjectValueAndGetValidationErrors(fieldName, control, validatorOptions).pipe(
          map(errors => getAllErrors(errors, fieldName).length === 0),
          map(validateState => getIsValidResult(validateState, validationMetadata, 'customValidation'))
        );
      }
    };
  }

  function checkWithAllNestedValidations(
    allNestedValidations: ValidationMetadata[],
    nestedValidations: ValidationMetadata[],
    key: string
  ) {
    return (
      allNestedValidations.length === nestedValidations.length ||
      (((fields && fields[key] instanceof DynamicFormGroup) || (fields && fields[key] instanceof FormArray)) &&
        allNestedValidations.length > 0 &&
        nestedValidations.length === 0)
    );
  }

  function isDynamicValidate(validationMetadata: ValidationMetadata, typeKey: string) {
    return validationMetadata.type === ValidationTypes[typeKey] && validator[validationMetadata.type] !== undefined;
  }

  /**
   * marked with @Validate(...)
   * https://github.com/typestack/class-validator#custom-validation-classes
   */
  function isCustomValidate(validationMetadata: ValidationMetadata, typeKey: string) {
    return (
      isNotPropertyValidation(validationMetadata, typeKey) &&
      validationMetadata.type === ValidationKeys.custom.type &&
      typeKey === ValidationKeys.custom.typeKey
    );
  }

  /**
   * marked with @ValidateNested()
   * https://github.com/typestack/class-validator#validating-nested-objects
   */
  function isNestedValidate(validationMetadata: ValidationMetadata, typeKey: string) {
    return (
      isNotPropertyValidation(validationMetadata, typeKey) &&
      validationMetadata.type === ValidationKeys.nested.type &&
      typeKey === ValidationKeys.nested.typeKey
    );
  }

  function isNotPropertyValidation(validationMetadata: ValidationMetadata, typeKey: string) {
    return validationMetadata.type === ValidationTypes[typeKey] && validator[validationMetadata.type] === undefined;
  }

  function setFieldData(
    fieldName: string,
    fieldDefinition: DynamicFormGroupField,
    validationFunction: ValidatorFunctionType
  ) {
    /* todo: maybe not need, if enable this code, experemental mode not work
    if (fields[fieldName] instanceof DynamicFormGroup) {
      fields[fieldName].object = fields[fieldName].fields;
    }*/

    // Fill field data if empty
    if (fieldDefinition.data === undefined) {
      fieldDefinition.data = fields && fields[fieldName];
    }

    fieldDefinition.validationFunctions.push(validationFunction);
  }

  function getAllErrors(validateErrors: ShortValidationErrors, fieldName: string): string[] {
    return Object.keys(validateErrors).filter(
      (key: string) =>
        // Check for nested/child errors
        validateErrors[key][fieldName] || validateErrors[fieldName]
    );
  }
}

// ***************************************************************
// Global Helper functions
//

function isPropertyValidatorOfType(
  validationMetadata: ValidationMetadata,
  fieldName: string,
  validationMetadataType: string
) {
  return validationMetadata.propertyName === fieldName && validationMetadata.type === validationMetadataType;
}

function setObjectValueAndGetValidationErrors(
  fieldName: string,
  control: FormControl,
  validatorOptions?: ValidatorOptions
) {
  const object =
    control.parent instanceof DynamicFormGroup
      ? (control.parent as DynamicFormGroup<any>).object
      : control.parent
      ? control.parent.value
      : {};

  if (object) {
    object[fieldName] = control.value;
  }

  return getValidateErrors(fieldName, control, object, validatorOptions);
}

function getValidateErrors(
  fieldName: string,
  control: FormControl,
  dataToValidate: any,
  validatorOptions?: ValidatorOptions
) {
  /* todo: future feature - get errors from parent, without run validation again, now it is not work
  return (control?.root?.valueChanges || control?.parent?.valueChanges || control?.valueChanges || of({})).pipe(
    flatMap(() => (control.parent && control.parent.value ? from(validate(dataToValidate, validatorOptions)) : of([]))),
    map(errors => transformValidationErrors(errors))
  );
  // or
  return of({}).pipe(
    flatMap(() =>
      control.parent && control.parent.value && control.parent instanceof DynamicFormGroup
        ? control.parent.customValidateErrors
        : of({})
    )
  );*/
  return (control.parent && control.parent.value ? from(validate(dataToValidate, validatorOptions)) : of([])).pipe(
    map(errors => transformValidationErrors(errors))
  );
}

function getIsValidResult(isValid: boolean, validationMetadata: ValidationMetadata, errorType: ErrorPropertyName) {
  return isValid
    ? null
    : {
        [errorType]: {
          valid: false,
          type: validationMetadata.type
        }
      };
}

const ValidationKeys = {
  nested: {
    type: 'nestedValidation',
    typeKey: 'NESTED_VALIDATION'
  },
  conditional: {
    type: 'conditionalValidation'
  },
  custom: {
    type: 'customValidation',
    typeKey: 'CUSTOM_VALIDATION'
  }
};
