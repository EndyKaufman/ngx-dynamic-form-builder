import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { classToClass, plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { getMetadataStorage, validateSync, ValidationTypes, Validator, ValidatorOptions } from 'class-validator';
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';
import safeStringify from 'fast-safe-stringify';
import 'reflect-metadata';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';
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
const validator = new Validator();

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
        .pipe(
          distinctUntilChanged(),
          tap(() => this.validate(externalErrors, validatorOptions))
        )
        .subscribe({
          error: (err) => {
            throw err;
          },
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

  /**
   * @deprecated
   */
  validateAsync(externalErrors?: ShortValidationErrors, validatorOptions?: ValidatorOptions) {
    return Promise.resolve(this.validate(externalErrors, validatorOptions));
  }

  // Public API
  validate(externalErrors?: ShortValidationErrors, validatorOptions?: ValidatorOptions) {
    if (externalErrors === undefined) {
      externalErrors = cloneDeep(this._externalErrors);
    }

    if (validatorOptions === undefined) {
      validatorOptions = cloneDeep(this._validatorOptions);
    }
    const dataToValidate = this.object;
    const validationErrors = getValidateErrors(this, dataToValidate, validatorOptions);

    if (!externalErrors) {
      externalErrors = {};
    }

    const allErrors = mergeErrors(externalErrors, validationErrors);
    const allErrorsKeys = Object.keys(allErrors);

    this.markAsInvalidForExternalErrors(externalErrors);
    this.setCustomErrors(allErrors);

    // todo: refactor, invalidate form if exists any allErrors
    let usedForeverInvalid = false;
    if (!allErrorsKeys.find((key) => key !== FOREVER_INVALID_NAME) && this.get(FOREVER_INVALID_NAME)) {
      this.removeControl(FOREVER_INVALID_NAME);
      usedForeverInvalid = true;
    }
    if (this.valid && allErrorsKeys.length > 0 && !this.get(FOREVER_INVALID_NAME)) {
      this.addControl(FOREVER_INVALID_NAME, new FormControl('', [foreverInvalid]));
      usedForeverInvalid = true;
    }
    if (usedForeverInvalid) {
      this.updateValueAndValidity({
        onlySelf: true,
        emitEvent: false,
      });
    }
  }

  setCustomErrors(allErrors: any) {
    this.formErrors = allErrors;
    this.customValidateErrors.next(this.formErrors);
    this.nativeValidateErrors.next(this.collectErrors(this));
  }

  private collectErrors(control: Dictionary, isRoot = true) {
    if (control.controls) {
      return {
        ...(isRoot ? this.errors : {}),
        ...Object.entries(control.controls).reduce((acc, [key, childControl]: [string, Dictionary]) => {
          const childErrors = this.collectErrors(childControl, false);
          if (childErrors && Object.keys(childErrors).length > 0) {
            acc = {
              ...acc,
              [key]: {
                ...(acc && acc[key] ? acc[key] : {}),
                ...childErrors,
              },
            };
          }
          return acc;
        }, {}),
      };
    } else {
      return control.errors;
    }
  }

  validateAllFormFields() {
    let control: any;
    let formArrayControlsLength: any;
    Object.keys(this.controls).forEach((field) => {
      control = this.get(field);

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
        formArrayControlsLength = (control as FormArray).controls.length;
        for (let i = 0; i < formArrayControlsLength; i++) {
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
    formArrayControlsLength = null;
    control = null;
  }

  resetValidateAllFormFields() {
    this.markAsInvalidForExternalErrors({});
    let control: any;
    Object.keys(this.controls).forEach((field) => {
      control = this.get(field);

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
        const formArrayControlsLength = (control as FormArray).controls.length;
        for (let i = 0; i < formArrayControlsLength; i++) {
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
    control = null;
    this.setCustomErrors({});
  }

  classToClass<TClassModel>(object: TClassModel) {
    return classToClass(object, { ignoreDecorators: true });
  }

  plainToClass<TClassModel, Object>(cls: ClassType<TClassModel>, plain: Object) {
    return plainToClass(cls, plain, { ignoreDecorators: true });
  }

  /**
   * @deprecated
   */
  setExternalErrorsAsync(externalErrors: ShortValidationErrors) {
    this.setExternalErrors(externalErrors);
    return Promise.resolve();
  }

  setExternalErrors(externalErrors: ShortValidationErrors) {
    this._externalErrors = externalErrors;
    return this.validate();
  }

  getExternalErrors(): ShortValidationErrors {
    return this._externalErrors;
  }

  /**
   * @deprecated
   */
  clearExternalErrorsAsync() {
    this.setExternalErrors({});
    return Promise.resolve();
  }

  clearExternalErrors() {
    this.setExternalErrors({});
  }

  setValidatorOptions(validatorOptions?: ValidatorOptions) {
    this._validatorOptions = <ValidatorOptions>validatorOptions;
    this.validate();
  }

  getValidatorOptions(): ValidatorOptions {
    return this._validatorOptions;
  }

  // Helpers
  private onlyFields(fields?: FormModel<any>): Dictionary {
    const newFields: Dictionary = {};

    if (fields !== undefined) {
      Object.keys(fields).forEach((key) => {
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
    Object.keys(currentControls).forEach((field) => {
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
        const formArrayControlsLength = (control as FormArray).length;
        for (let i = 0; i < formArrayControlsLength; i++) {
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
        .filter((name) => name !== FOREVER_INVALID_NAME)
        .forEach((key) => {
          // Handle Group
          if (this.controls[key] instanceof DynamicFormGroup) {
            object[key] = (this.controls[key] as DynamicFormGroup<any>).object;
          }

          // Handle Form Array
          else if (this.controls[key] instanceof FormArray) {
            // Initialize value
            object[key] = [];
            const formArrayControlsLength = (this.controls[key] as FormArray).controls.length;
            let value;
            for (let i = 0; i < formArrayControlsLength; i++) {
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
            value = null;
          }

          // Handle Control
          else {
            if (this.controls[key]) {
              object[key] = this.controls[key].value;
            }
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
    // console.time(String(object));
    if (object instanceof this.factoryModel) {
      this._object = this.classToClass(object); // Ensure correct type
    } else {
      this._object = this.plainToClass(this.factoryModel, object as Object); // Convert to Model type
    }
    let newObject: any;
    let newValue: any;
    // Recursively set the value of all fields
    Object.keys(this.controls).forEach((key) => {
      // Handle Group
      if (this.controls[key] instanceof DynamicFormGroup) {
        (this.controls[key] as DynamicFormGroup<any>).setObject(this._object ? this._object[key] : {});
      }

      // Handle FormArray
      else if (this.controls[key] instanceof FormArray) {
        let objectArray: any = this._object ? this._object[key] : [];
        let formArray: any = this.controls[key] as FormArray;
        let isFormGroup: any = formArray.controls[0] instanceof DynamicFormGroup;
        let firstFormGroup: any = formArray.controls[0] as DynamicFormGroup<any>;
        let formControl: any = formArray.controls[0] as FormControl;

        // Clear FormArray while retaining the reference
        let objectArrayLength = objectArray.length;
        let dynamicFormGroup: any;

        let controlValue: any;
        let newFormControl: any;
        let classValidators: any;
        let formGroup: any;
        let formArrayLength = formArray.length;

        for (let i = 0; i < formArrayLength; i++) {
          if (
            formArray.controls[i] instanceof DynamicFormGroup &&
            (formArray.controls[i] as DynamicFormGroup<any>).valueChangesSubscription
          ) {
            (formArray.controls[i] as DynamicFormGroup<any>).valueChangesSubscription.unsubscribe();
          }
        }

        while (formArrayLength !== 0) {
          formArray.removeAt(0);
          formArrayLength--;
        }
        formArrayLength = null;

        for (let i = 0; i < objectArrayLength; i++) {
          if (isFormGroup) {
            // Create FormGroup
            dynamicFormGroup = new DynamicFormGroup(firstFormGroup.factoryModel, firstFormGroup.formFields);

            dynamicFormGroup.setParent(formArray);

            formGroup = this._fb.group(
              getClassValidators<TModel>(firstFormGroup.factoryModel, firstFormGroup.formFields)
            );

            // Add all controls to the form group
            Object.keys(formGroup.controls).forEach((ctrlKey) => {
              dynamicFormGroup.addControl(ctrlKey, formGroup.controls[ctrlKey]);
            });

            formArray.controls.push(dynamicFormGroup);
          } else {
            // Create control
            controlValue = this._object && objectArray && objectArray[i] ? objectArray[i] : undefined;
            newFormControl = new FormControl(controlValue, formControl ? formControl.validator : undefined);
            newFormControl.setParent(formArray);

            // Add the control to the FormArray
            formArray.controls.push(newFormControl);
          }
        }
        let arrayLength = formArray.length;
        for (let i = 0; i < arrayLength; i++) {
          if (isFormGroup) {
            // Add a value change listener to the group. on change, validate
            if (formArray.controls[i] instanceof DynamicFormGroup) {
              // Recusrively set the object value
              (formArray.controls[i] as DynamicFormGroup<any>).object =
                this._object && objectArray && objectArray[i] ? objectArray[i] : {};
            }
          }
        }
        for (let i = 0; i < arrayLength; i++) {
          if (isFormGroup) {
            // Add a value change listener to the group. on change, validate
            if (formArray.controls[i] instanceof DynamicFormGroup) {
              (formArray.controls[i] as DynamicFormGroup<any>).subscribeToValueChanges(
                undefined,
                this._validatorOptions
              );
            }
          }
        }
        classValidators = null;
        formGroup = null;
        controlValue = null;
        newFormControl = null;
        dynamicFormGroup = null;
        objectArrayLength = null;
        arrayLength = null;
        objectArray = null;
        formArray = null;
        isFormGroup = null;
        firstFormGroup = null;
        formControl = null;
      }

      // Handle Control
      else {
        newObject = this._object ? this._object[key] : [];
        newValue = this._object && newObject ? newObject : undefined;
        if (this.controls[key] && this.controls[key].value !== newValue) {
          this.controls[key].setValue(newValue);
        }
      }
    });
    newValue = null;
    newObject = null;
    this.objectChange.next(this._object);
    // console.timeEnd(String(object));
  }
}

export function getClassValidators<TModel>(
  factoryModel: ClassType<TModel>,
  fields?: Dictionary,
  validatorOptions?: ValidatorOptions
) {
  // console.time(String(factoryModel));
  // Get the validation rules from the object decorators
  let allValidationMetadatas: ValidationMetadata[] | any = getMetadataStorage().getTargetValidationMetadatas(
    factoryModel,
    ''
  );

  // Get the validation rules for the validation group: https://github.com/typestack/class-validator#validation-groups
  let validationGroupMetadatas: ValidationMetadata[] | any = getMetadataStorage().getTargetValidationMetadatas(
    factoryModel,
    '',
    validatorOptions && validatorOptions.groups ? validatorOptions.groups : undefined
  );
  const formGroupFields = {};

  // Loop through all fields in the form definition
  if (fields) {
    let conditionalValidations: ValidationMetadata[] | any;
    let allNestedValidations: ValidationMetadata[] | any;
    let nestedGroupValidations: ValidationMetadata[] | any;
    let fieldDefinition: DynamicFormGroupField | any;
    let dynamicValidate: any;
    let customValidation: any;
    let objectToValidate: any;
    let nestedValidate: any;

    Object.keys(fields)
      .filter((key) => key.indexOf('__') !== 0)
      .forEach((fieldName) => {
        // Conditional Validation for the field
        conditionalValidations = [];
        validationGroupMetadatas.forEach((validationMetadata) => {
          if (isPropertyValidatorOfType(validationMetadata, fieldName, ValidationKeys.conditional.type)) {
            conditionalValidations.push(validationMetadata);
          }
        });

        // All Nested Validation for the field
        allNestedValidations = [];
        allValidationMetadatas.forEach((validationMetadata) => {
          if (isPropertyValidatorOfType(validationMetadata, fieldName, ValidationKeys.nested.type)) {
            allNestedValidations.push(validationMetadata);
          }
        });

        // Nested Validation for the field for the requested class-validator group
        nestedGroupValidations = [];
        validationGroupMetadatas.forEach((validationMetadata) => {
          if (isPropertyValidatorOfType(validationMetadata, fieldName, ValidationKeys.nested.type)) {
            nestedGroupValidations.push(validationMetadata);
          }
        });

        fieldDefinition = {
          data: formGroupFields[fieldName] || undefined,
          validationFunctions: [],
          validationDefinitions: [],
        };

        if (fieldDefinition.data === undefined) {
          fieldDefinition.data = fields[fieldName];
        }
        // TRY LINK EXISTS NATIVE VALIDATIONS, UNSTABLE !!!
        if (
          Array.isArray(fieldDefinition.data) &&
          fieldDefinition.data.length > 1 &&
          fieldDefinition.data.find(
            (validationFunction, index) => index > 0 && typeof validationFunction === 'function'
          )
        ) {
          fieldDefinition.data
            .filter((validationFunction, index) => index > 0 && typeof validationFunction === 'function')
            .forEach((validationFunction) =>
              fieldDefinition.validationFunctions.push({ type: 'sync', validator: validationFunction })
            );
          fieldDefinition.data = fieldDefinition.data[0];
        }

        validationGroupMetadatas.forEach((validationMetadata) => {
          if (
            validationMetadata.propertyName === fieldName &&
            validationMetadata.type !== ValidationKeys.conditional.type
          ) {
            // Add all validation to the field except the @NestedValidation definition as
            // being part of the form would imply it is validated if any other rules are present
            if (validationMetadata.type !== ValidationKeys.nested.type) {
              fieldDefinition.validationDefinitions.push(validationMetadata);
            }

            Object.keys(ValidationTypes).forEach((typeKey) => {
              if (ValidationTypes.hasOwnProperty(typeKey)) {
                // Handle Nested Validation
                if (checkWithAllNestedValidations(allNestedValidations, nestedGroupValidations, fieldName)) {
                  if (isNestedValidate(validationMetadata, typeKey)) {
                    objectToValidate =
                      fields[fieldName] instanceof DynamicFormGroup ? fields[fieldName].object : undefined;
                    nestedValidate = createNestedValidate(fieldName, objectToValidate, validationMetadata);
                    setFieldData(fieldName, fieldDefinition, nestedValidate);
                    objectToValidate = null;
                    nestedValidate = null;
                  }
                }

                // Handle Custom Validation
                if (isCustomValidate(validationMetadata, typeKey)) {
                  customValidation = createCustomValidation(fieldName, validationMetadata);
                  setFieldData(fieldName, fieldDefinition, customValidation);
                  customValidation = null;
                }

                // Handle remaining validation
                if (isDynamicValidate(validationMetadata, typeKey)) {
                  dynamicValidate = createDynamicValidate(fieldName, validationMetadata, conditionalValidations);
                  setFieldData(fieldName, fieldDefinition, dynamicValidate);
                  dynamicValidate = null;
                }
              }
            });
          }
        });
        // Convert to a structure, angular understands
        if (fieldDefinition.data instanceof DynamicFormGroup || fieldDefinition.data instanceof FormArray) {
          formGroupFields[fieldName] = fieldDefinition.data;
        } else {
          formGroupFields[fieldName] = new DynamicFormControl(fieldName, fieldDefinition);
        }
      });

    dynamicValidate = null;
    customValidation = null;
    objectToValidate = null;
    nestedValidate = null;

    conditionalValidations = null;
    allNestedValidations = null;
    nestedGroupValidations = null;
    fieldDefinition = null;
  }

  allValidationMetadatas = null;
  validationGroupMetadatas = null;

  // console.timeEnd(String(factoryModel));
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
      type: 'sync',
      validator: function (control: FormControl) {
        let parent: any = control.parent;
        let validateErrors: any =
          (parent &&
            parent.value &&
            getValidateErrors(
              parent,
              objectToValidate !== undefined ? objectToValidate : control.value,
              validatorOptions
            )) ||
          {};
        let validateState: any = Object.keys(validateErrors).length === 0;
        const result = getIsValidResult(validateState, validationMetadata, 'nestedValidate');
        parent = null;
        validateErrors = null;
        validateState = null;
        return result;
      },
    };
  }

  function createDynamicValidate(
    fieldName: string,
    validationMetadata: ValidationMetadata,
    conditionalValidations: ValidationMetadata[]
  ): ValidatorFunctionType {
    return {
      type: 'sync',
      validator: function (control: FormControl) {
        if (!control) {
          return null;
        }
        let validateErrors: any = setObjectValueAndGetValidationErrors(fieldName, control, validatorOptions);
        let validateState: any = getAllErrors(validateErrors, fieldName).length === 0;
        const result = getIsValidResult(validateState, validationMetadata, 'dynamicValidate');
        validateErrors = null;
        validateState = null;
        return result;
      },
    };
  }

  function createCustomValidation(fieldName: string, validationMetadata: ValidationMetadata): ValidatorFunctionType {
    return {
      type: 'sync',
      validator: function (control: FormControl) {
        let validateErrors: any = setObjectValueAndGetValidationErrors(fieldName, control, validatorOptions);
        let validateState: any = validateErrors && validateErrors[fieldName] ? false : true;
        const result = getIsValidResult(validateState, validationMetadata, 'customValidation');
        validateErrors = null;
        validateState = null;
        return result;
      },
    };
  }

  function checkWithAllNestedValidations(
    allNestedValidations: ValidationMetadata[],
    nestedValidations: ValidationMetadata[],
    key: string
  ) {
    const allNestedValidationsLength = allNestedValidations.length;
    const nestedValidationsLength = nestedValidations.length;
    return (
      allNestedValidationsLength === nestedValidationsLength ||
      (((fields && fields[key] instanceof DynamicFormGroup) || (fields && fields[key] instanceof FormArray)) &&
        allNestedValidationsLength > 0 &&
        nestedValidationsLength === 0)
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
  let parent =
    control.parent instanceof DynamicFormGroup
      ? (control.parent as DynamicFormGroup<any>)
      : control.parent
      ? control.parent
      : null;
  let object =
    control.parent instanceof DynamicFormGroup
      ? (control.parent as DynamicFormGroup<any>).object
      : control.parent
      ? control.parent.value
      : {};

  if (object) {
    object[fieldName] = control.value;
  }
  const result = (parent && parent.value && getValidateErrors(parent, object, validatorOptions)) || {};
  parent = null;
  object = null;
  return result;
}

function getValidateErrors<T>(
  control: FormControl | FormArray | DynamicFormGroup<T> | null | any,
  dataToValidate: any,
  validatorOptions?: ValidatorOptions
): ShortValidationErrors {
  let validateKey: any = safeStringify({ dataToValidate, validatorOptions });
  let ctrl: { __prevValidateKey: string; __prevValidateErrors: ShortValidationErrors } | any = (control as any) || {};
  let validatedErrors: ShortValidationErrors;
  if (ctrl.__prevValidateKey === validateKey && ctrl.__prevValidateErrors !== undefined) {
    // console.log('CACHED', validateKey);
    validatedErrors = ctrl.__prevValidateErrors;
  } else {
    // console.log('NO CACHED', validateKey);
    validatedErrors = transformValidationErrors(validateSync(dataToValidate, validatorOptions));
    ctrl.__prevValidateErrors = validatedErrors;
    ctrl.__prevValidateKey = validateKey;
  }
  validateKey = null;
  ctrl = null;
  return validatedErrors;
}

function getIsValidResult(isValid: boolean, validationMetadata: ValidationMetadata, errorType: ErrorPropertyName) {
  return isValid
    ? null
    : {
        [errorType]: {
          valid: false,
          type: validationMetadata.type,
        },
      };
}

const ValidationKeys = {
  nested: {
    type: 'nestedValidation',
    typeKey: 'NESTED_VALIDATION',
  },
  conditional: {
    type: 'conditionalValidation',
  },
  custom: {
    type: 'customValidation',
    typeKey: 'CUSTOM_VALIDATION',
  },
};
