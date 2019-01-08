import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { classToClass, plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { validateSync, ValidationError, ValidatorOptions } from 'class-validator';
import { cloneDeep, mergeWith } from 'lodash-es';
import 'reflect-metadata';
import { BehaviorSubject } from 'rxjs';
import { Dictionary, ShortValidationErrors } from '../models';

export class DynamicFormGroup<TModel> extends FormGroup {

  public customValidateErrors = new BehaviorSubject<ShortValidationErrors>({});

  private _object: TModel;
  private _externalErrors: ShortValidationErrors;
  private _validatorOptions: ValidatorOptions;

  constructor(public factoryModel: ClassType<TModel>, public fields: Dictionary) {
    super({});
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
    if (externalErrors === undefined) {
      externalErrors = cloneDeep(this.externalErrors);
    }

    if (validatorOptions === undefined) {
      validatorOptions = cloneDeep(this.validatorOptions);
    }

    if (!externalErrors) {
      externalErrors = {};
    }

    const errors = validateSync(this.object, validatorOptions);
    const transformedErrors = this.transformValidationErrors(errors);
    const allErrors = this.mergeErrors(externalErrors, transformedErrors);

    this.markAsInvalidForExternalErrors(externalErrors, this.controls);
    this.customValidateErrors.next(allErrors);
  }

  validateAllFormFields() {
    Object.keys(this.controls).forEach(field => {
      const control = this.get(field);

      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof DynamicFormGroup) {
        control.validateAllFormFields();
      }
    });
  }

  classToClass<TClassModel>(object: TClassModel) {
    return classToClass(object, { ignoreDecorators: true });
  }

  plainToClass<TClassModel, Object>(cls: ClassType<TClassModel>, plain: Object) {
    return plainToClass(cls, plain, { ignoreDecorators: true });
  }

  // Helpers
  private onlyFields(fields: Dictionary) {
    const newFields = {};

    if (fields !== undefined) {
      Object.keys(fields).forEach(key => {
        if (fields[key] instanceof DynamicFormGroup) {
          newFields[key] = this.onlyFields((fields[key] as DynamicFormGroup<any>).fields);
        } else {
          newFields[key] = fields[key];
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

      if (control instanceof FormControl) {
        if (errors && errors[field]) {
          control.setErrors({ 'externalError': true });
        } else if (control.errors && control.errors.externalError === true) {
          control.setErrors(null);
        }
      } else if (control instanceof DynamicFormGroup) {
        control.markAsInvalidForExternalErrors(
          errors && errors[field] ? errors[field] as ShortValidationErrors : {},
          control.controls
        );
      }
    });
  }

  /**
   * Recursively gets all values from the form controls and all sub form group controls and returns it as
   * an object
   */
  private getObject(): TModel {
    // Initialize the shape of the response
    const object = this._object ? this.classToClass(this._object) : new this.factoryModel();

    if (object !== undefined) {
      // Recursively get the value of all fields
      Object.keys(this.controls).forEach(key => {
        if (this.controls[key] instanceof DynamicFormGroup) {
          object[key] = (this.controls[key] as DynamicFormGroup<any>).object;
        } else {
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
    } else {
      this._object = this.plainToClass(this.factoryModel, object as Object); // Convert to Model type
    }
    // Recursively set the value of all fields
    Object.keys(this.controls).forEach(key => {
      if (this.controls[key] instanceof DynamicFormGroup) {
        (this.controls[key] as DynamicFormGroup<any>).object = this._object ? this._object[key] : {};
      } else {
        this.controls[key].setValue((this._object && this._object[key]) ? this._object[key] : undefined);
      }
    });
  }
}
