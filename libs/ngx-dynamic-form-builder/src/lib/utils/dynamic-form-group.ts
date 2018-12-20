import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { classToClass, plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { getFromContainer, MetadataStorage, validate, validateSync, ValidationError, ValidationTypes, Validator, ValidatorOptions } from 'class-validator';
import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata';
import { cloneDeep, mergeWith } from 'lodash-es';
import 'reflect-metadata';
import { BehaviorSubject } from 'rxjs';
export interface IShortValidationErrors {
  [key: string]: string[] | IShortValidationErrors;
}
export class DynamicFormGroup<TModel> extends FormGroup {
  set externalErrors(externalErrors: IShortValidationErrors) {
    this._externalErrors = externalErrors;
    this.validate();
  }
  get externalErrors(): IShortValidationErrors {
    return this._externalErrors;
  }
  set validatorOptions(validatorOptions: ValidatorOptions) {
    this._validatorOptions = validatorOptions;
    this.validate();
  }
  get validatorOptions(): ValidatorOptions {
    return this._validatorOptions;
  }
  customValidateErrors = new BehaviorSubject<IShortValidationErrors>({});
  private _object: TModel;
  private _externalErrors: IShortValidationErrors;
  private _validatorOptions: ValidatorOptions;
  private _fb = new FormBuilder();
  constructor(
    public factoryModel: ClassType<TModel>,
    public fields: {
      [key: string]: any;
    },
    public defaultValidatorOptions?: ValidatorOptions
  ) {
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
  static getClassValidators<TModel>(
    factoryModel: ClassType<TModel>,
    fields: {
      [key: string]: any;
    },
    validatorOptions?: ValidatorOptions
  ) {
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
                  (
                    allNestedValidations.length === nestedValidations.length
                  ) ||
                  (
                    fields[key] instanceof DynamicFormGroup &&
                    (allNestedValidations.length > 0 && nestedValidations.length === 0)
                  ) ||
                  (
                    fields[key] instanceof FormArray &&
                    (allNestedValidations.length > 0 && nestedValidations.length === 0)
                  )
                ) {
                  if (
                    validationMetadata.type === ValidationTypes[typeKey] &&
                    validator[validationMetadata.type] === undefined &&
                    validationMetadata.type === 'nestedValidation' &&
                    typeKey === 'NESTED_VALIDATION'
                  ) {
                    let objectToValidate: any;
                    if (fields[key] instanceof DynamicFormGroup) {
                      fields[key].object = fields[key].fields;
                      objectToValidate = fields[key].object;
                    }
                    if (formGroupField.length === 0) {
                      formGroupField.push(fields[key]);
                    }
                    const nestedValidate = function (c: FormControl) {
                      const isValid =
                        c.parent && c.parent.value ? validateSync(objectToValidate || c.value, validatorOptions).length === 0 : true;
                      return isValid
                        ? null
                        : {
                          nestedValidate: {
                            valid: false,
                            type: validationMetadata.type
                          }
                        };
                    };
                    formGroupField.push(nestedValidate);
                  }
                }
                if (
                  validationMetadata.type === ValidationTypes[typeKey] &&
                  validator[validationMetadata.type] === undefined &&
                  validationMetadata.type === 'customValidation' &&
                  typeKey === 'CUSTOM_VALIDATION'
                ) {
                  const customValidation = function (c: FormControl) {
                    // todo: refactor
                    const object =
                      c.parent instanceof DynamicFormGroup
                        ? (c.parent as DynamicFormGroup<any>).object
                        : c.parent
                          ? c.parent.value
                          : {};
                    if (object) {
                      object[key] = c.value;
                    }
                    const validateErrors = c.parent && c.parent.value ? validateSync(object, validatorOptions) : [];
                    const isValid =
                      validateErrors.filter((error: ValidationError) => {
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
                  if (fields[key] instanceof DynamicFormGroup) {
                    fields[key].object = fields[key].fields;
                  }
                  if (formGroupField.length === 0) {
                    formGroupField.push(fields[key]);
                  }
                  formGroupField.push(customValidation);
                }
                if (
                  validationMetadata.type === ValidationTypes[typeKey] &&
                  validator[validationMetadata.type] !== undefined
                ) {
                  const customValidate = function (c: FormControl) {
                    if (!c) {
                      return null;
                    }
                    let isValid =
                      c.parent && c.parent.value
                        ? validator.validateValueByMetadata(c.value, validationMetadata)
                        : true;
                    if (!isValid && conditionalValidations.length > 0) {
                      // todo: refactor
                      const object =
                        c.parent instanceof DynamicFormGroup
                          ? (c.parent as DynamicFormGroup<any>).object
                          : c.parent
                            ? c.parent.value
                            : {};
                      if (object) {
                        object[key] = c.value;
                      }
                      const validateErrors =
                        c.parent && c.parent.value ? validateSync(object, validatorOptions) : [];
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
                        customValidate: {
                          valid: false,
                          type: validationMetadata.type
                        }
                      };
                  };
                  if (fields[key] instanceof DynamicFormGroup) {
                    fields[key].object = fields[key].fields;
                  }
                  if (formGroupField.length === 0) {
                    formGroupField.push(fields[key]);
                  }
                  formGroupField.push(customValidate);
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
  }

  private onlyFields(fields: { [key: string]: any }) {
    const newFields = {};
    if (fields !== undefined) {
      Object.keys(fields).forEach(key => {
        if (fields[key] instanceof DynamicFormGroup) {
          newFields[key] = this.onlyFields((fields[key] as DynamicFormGroup<any>).fields);
        } else {
          if (fields[key] instanceof FormArray) {
            if ((fields[key] as FormArray).controls[0] instanceof DynamicFormGroup) {
              newFields[key] = this.onlyFields(((fields[key] as FormArray).controls[0] as DynamicFormGroup<any>).fields);
            } else {
              newFields[key] = (fields[key] as FormArray).controls[0].value;
            }
          } else {
            newFields[key] = fields[key];
          }
        }
      });
    }
    return newFields;
  }
  get object() {
    const object = this._object ? this.classToClass(this._object) : new this.factoryModel();
    if (object !== undefined) {
      Object.keys(this.controls).forEach(key => {
        if (this.controls[key] instanceof DynamicFormGroup) {
          object[key] = (this.controls[key] as DynamicFormGroup<any>).object;
        } else {
          if (this.controls[key] instanceof FormArray) {
            object[key] = [];
            for (let i = 0; i < (this.controls[key] as FormArray).controls.length; i++) {
              if ((this.controls[key] as FormArray).controls[i] instanceof DynamicFormGroup) {
                object[key].push(
                  ((this.controls[key] as FormArray).controls[i] as DynamicFormGroup<any>).object
                );
              } else {
                object[key].push(
                  (this.controls[key] as FormArray).controls[i].value
                );
              }
            }
          } else {
            object[key] = this.controls[key].value;
          }
        }
      });
    }
    return this.plainToClass(this.factoryModel, object);
  }
  set object(object: TModel) {
    if (object instanceof this.factoryModel) {
      this._object = this.classToClass(object);
    } else {
      this._object = this.plainToClass(this.factoryModel, object as Object);
    }
    Object.keys(this.controls).forEach(key => {
      if (this.controls[key] instanceof DynamicFormGroup) {
        (this.controls[key] as DynamicFormGroup<any>).object = this._object ? this._object[key] : {};
      } else {
        if (this.controls[key] instanceof FormArray) {
          const objectArray = this._object ? this._object[key] : [];
          const formArray = (this.controls[key] as FormArray);
          const isFormGroup = formArray.controls[0] instanceof DynamicFormGroup;
          const prevFormGroup = formArray.controls[0] as DynamicFormGroup<any>;
          const formControl = formArray.controls[0] as FormControl;
          while (formArray.length !== 0) {
            formArray.removeAt(0);
          }
          for (let i = 0; i < objectArray.length; i++) {
            if (isFormGroup) {
              const dynamicFormGroup = new DynamicFormGroup(prevFormGroup.factoryModel, prevFormGroup.fields, this._validatorOptions);
              dynamicFormGroup.setParent(this);
              const classValidators = DynamicFormGroup.getClassValidators<TModel>(
                prevFormGroup.factoryModel,
                prevFormGroup.fields,
                this._validatorOptions
              );
              const formGroup = this._fb.group(
                classValidators
              );
              Object.keys(formGroup.controls).forEach(ctrlKey => {
                dynamicFormGroup.addControl(ctrlKey, formGroup.controls[ctrlKey]);
              });
              dynamicFormGroup.valueChanges.subscribe(data => {
                dynamicFormGroup.validate(
                  undefined,
                  this._validatorOptions
                );
              });
              formArray.controls.push(
                dynamicFormGroup
              );
              (formArray.controls[i] as DynamicFormGroup<any>).object =
                (this._object && objectArray && objectArray[i]) ? objectArray[i] : {};
            } else {
              const newFormControl = new FormControl(
                (this._object && objectArray && objectArray[i]) ? objectArray[i] : undefined,
                formControl.validator
              );
              newFormControl.setParent(this);
              formArray.controls.push(
                newFormControl
              );
            }
          }
        } else {
          const newObject = this._object ? this._object[key] : [];
          this.controls[key].setValue(this._object && newObject ? newObject : undefined);
        }
      }
    });
  }
  private transformValidationErrors(errors: ValidationError[]): IShortValidationErrors {
    const customErrors: IShortValidationErrors = {};
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
        if (Array.isArray(error.value)) {
          customErrors[error.property] = Object.keys(
            customErrors[error.property]
          ).map(key => customErrors[error.property][key]);
        }
      }
    });
    return customErrors;
  }
  classToClass<TClassModel>(object: TClassModel) {
    return classToClass(object, { ignoreDecorators: true });
  }
  plainToClass<TClassModel, Object>(cls: ClassType<TClassModel>, plain: Object) {
    return plainToClass(cls, plain, { ignoreDecorators: true });
  }
  private mergeErrors(errors?: IShortValidationErrors, externalErrors?: IShortValidationErrors) {
    return mergeWith(errors, externalErrors, (objValue, srcValue) => {
      if (
        Array.isArray(objValue) &&
        Array.isArray(srcValue) &&
        objValue.filter(objItem => srcValue.indexOf(objItem) !== -1).length === 0
      ) {
        return objValue.concat(srcValue);
      }
    });
  }
  async validateAsync(externalErrors?: IShortValidationErrors, validatorOptions?: ValidatorOptions) {
    if (externalErrors === undefined) {
      externalErrors = cloneDeep(this.externalErrors);
    }
    if (validatorOptions === undefined) {
      validatorOptions = cloneDeep(this.validatorOptions);
    }
    if (!externalErrors) {
      externalErrors = {};
    }
    try {
      const result = await validate(this.object, validatorOptions);
      const transformedErrors = this.transformValidationErrors(result);
      const allErrors = this.mergeErrors(externalErrors, transformedErrors);
      this.markAsInvalidForExternalErrors(externalErrors, this.controls);
      this.customValidateErrors.next(allErrors);
    } catch (error) {
      throw error;
    }
  }
  validate(externalErrors?: IShortValidationErrors, validatorOptions?: ValidatorOptions) {
    this.validateAsync(externalErrors, validatorOptions).then(() => { }, error => { throw error; });
  }
  private markAsInvalidForExternalErrors(
    errors: IShortValidationErrors,
    controls: {
      [key: string]: AbstractControl;
    }
  ) {
    Object.keys(controls).forEach(field => {
      const control = controls[field];
      if (control instanceof FormControl) {
        if (errors && errors[field]) {
          control.setErrors({ externalError: true });
        } else {
          if (control.errors && control.errors.externalError === true) {
            control.setErrors(null);
          }
        }
      } else {
        if (control instanceof DynamicFormGroup) {
          control.markAsInvalidForExternalErrors(
            errors && errors[field] ? (errors[field] as IShortValidationErrors) : {},
            control.controls
          );
        } else {
          if (control instanceof FormArray) {
            for (let i = 0; i < (control as FormArray).length; i++) {
              if (control[i] instanceof FormControl) {
                if (errors && errors[i] && errors[i][field]) {
                  control[i].setErrors({ externalError: true });
                } else {
                  if (control[i].errors && control[i].errors.externalError === true) {
                    control[i].setErrors(null);
                  }
                }
              } else {
                if (control[i] instanceof DynamicFormGroup) {
                  control[i].markAsInvalidForExternalErrors(
                    errors && errors[i] && errors[i][field] ? (errors[i][field] as IShortValidationErrors) : {},
                    control[i].controls
                  );
                }
              }
            }
          }
        }
      }
    });
  }
  validateAllFormFields() {
    Object.keys(this.controls).forEach(field => {
      const control = this.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else {
        if (control instanceof DynamicFormGroup) {
          control.validateAllFormFields();
        } else {
          if (control instanceof FormArray) {
            for (let i = 0; i < (control as FormArray).controls.length; i++) {
              if ((control as FormArray).controls[i] instanceof FormControl) {
                ((control as FormArray).controls[i] as FormControl).markAsTouched({ onlySelf: true });
              } else {
                if ((control as FormArray).controls[i] instanceof DynamicFormGroup) {
                  ((control as FormArray).controls[i] as DynamicFormGroup<any>).validateAllFormFields();
                }
              }
            }
          }
        }
      }
    });
  }
}
