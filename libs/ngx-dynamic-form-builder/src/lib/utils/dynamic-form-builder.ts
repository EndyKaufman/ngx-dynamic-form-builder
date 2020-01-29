import { AbstractControlOptions, AsyncValidatorFn, FormBuilder, ValidatorFn } from '@angular/forms';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import 'reflect-metadata';
import {
  DynamicFormGroupConfig,
  isAbstractControlOptions,
  isDynamicFormGroupConfig,
  isLegacyOrOpts
} from '../models/dynamic-form-group-config';
import { FormModel } from '../models/form-model';
import { DynamicFormGroup, getClassValidators } from './dynamic-form-group';

export class DynamicFormBuilder extends FormBuilder {
  // ******************
  // Public API

  group<TModel>(
    factoryModel: ClassType<TModel>,
    controlsConfig?: FormModel<TModel> | DynamicFormGroupConfig | { [key: string]: any },
    options?: AbstractControlOptions | DynamicFormGroupConfig
  ): DynamicFormGroup<TModel> {
    if (!controlsConfig && !options) {
      options = {};
    }
    // Process the group with the controlsConfig passed into extra instead. (What does this accomplish?)
    if (
      controlsConfig &&
      (isAbstractControlOptions(controlsConfig) ||
        isLegacyOrOpts(controlsConfig) ||
        isDynamicFormGroupConfig(controlsConfig)) &&
      !options
    ) {
      return this.group(factoryModel, undefined, controlsConfig);
    }
    const extra: DynamicFormGroupConfig = (options || {}) as DynamicFormGroupConfig;

    let validators: ValidatorFn[] | null = null;
    let asyncValidators: AsyncValidatorFn[] | null = null;
    let updateOn: any;

    if (extra != null) {
      if (isAbstractControlOptions(extra)) {
        // `extra` are `AbstractControlOptions`
        validators = extra.validators != null ? extra.validators : null;
        asyncValidators = extra.asyncValidators != null ? extra.asyncValidators : null;
        updateOn = extra.updateOn != null ? extra.updateOn : undefined;
      }
      if (isLegacyOrOpts(extra)) {
        // `extra` are legacy form group options
        validators = validators || [];
        if (extra.validator != null) {
          validators.push(extra.validator);
        }
        asyncValidators = asyncValidators || [];
        if (extra.asyncValidator != null) {
          asyncValidators.push(extra.asyncValidator);
        }
      }
      // Set default customValidatorOptions
      if (!isDynamicFormGroupConfig(extra)) {
        extra.customValidatorOptions = { validationError: { target: false } };
      }
    }
    
    // If there is no manual controlsConfig specified, use given factoryModel to create a proto-form-model. 

    let newControlsConfig: FormModel<TModel> | undefined;

    if (controlsConfig !== undefined) {
      newControlsConfig = controlsConfig as FormModel<TModel>;
    }

    // experimental
    if (controlsConfig === undefined) {
      newControlsConfig = { ...this.createEmptyObject(factoryModel) };

      // check if any given properties are objects or arrays.
      // in this case, try to create FormArrays / sub-FormGroups for them.
      Object.keys(newControlsConfig).forEach(key => {
        if (canCreateGroup()) {
          // recursively create a dynamic group for the nested object
          newControlsConfig[key] = this.group(newControlsConfig[key].constructor, undefined, {
            ...(extra.customValidatorOptions ? { customValidatorOptions: extra.customValidatorOptions } : {}),
            asyncValidators,
            updateOn,
            validators
          });
        } else {
          if (canCreateArray()) {
            if (newControlsConfig[key][0].constructor) {
              // recursively create an array with a group
              newControlsConfig[key] = super.array(
                newControlsConfig[key].map(newControlsConfigItem =>
                  this.group(newControlsConfigItem.constructor, undefined, {
                    ...(extra.customValidatorOptions ? { customValidatorOptions: extra.customValidatorOptions } : {}),
                    asyncValidators,
                    updateOn,
                    validators
                  })
                )
              );
            } else {
              // Create an array of form controls
              newControlsConfig[key] = super.array(
                newControlsConfig[key].map(newControlsConfigItem => this.control(newControlsConfigItem))
              );
            }
          }

          function canCreateGroup() {
            const candidate = newControlsConfig && newControlsConfig[key];

            return (
              candidate &&
              !Array.isArray(candidate) &&
              candidate.constructor &&
              typeof candidate === 'object' &&
              (candidate.length === undefined ||
                (candidate.length !== undefined && Object.keys(candidate).length === candidate.length))
            );
          }

          function canCreateArray() {
            if (Array.isArray(newControlsConfig && newControlsConfig[key]) === false) {
              return false;
            }

            const candidate = newControlsConfig && newControlsConfig[key][0];

            return (
              candidate.constructor &&
              typeof candidate === 'object' &&
              (candidate.length === undefined ||
                (candidate.length !== undefined && Object.keys(candidate).length === candidate.length))
            );
          }
        });
      }
    }

    // Remove empty
    validators = validators && validators.filter(validator => validator);
    asyncValidators = asyncValidators && asyncValidators.filter(validator => validator);

    // Create an Angular group from the top-level object
    const classValidators = getClassValidators<TModel>(
      factoryModel,
      newControlsConfig,
      extra && extra.customValidatorOptions
    );
    const formGroup = super.group(classValidators, {
      ...(asyncValidators || {}),
      ...(updateOn || {}),
      ...(validators || {})
    });

    // Initialize the resulting group
    const dynamicFormGroup = new DynamicFormGroup<TModel>(factoryModel, newControlsConfig, {
      asyncValidators,
      updateOn,
      validators
    });

    // Add all angular controls to the resulting dynamic group
    Object.keys(formGroup.controls).forEach(key => {
      dynamicFormGroup.addControl(key, formGroup.controls[key]);
    });

    // Add a listener to the dynamic group for value changes; on change, execute validation
    dynamicFormGroup.subscribeToValueChanges(undefined, extra && extra.customValidatorOptions);

    return dynamicFormGroup;
  }

  // *******************
  // Helpers

  /**
   * Recursively creates an empty object from the data provided
   */
  private createEmptyObject<TModel>(factoryModel: ClassType<TModel>, data = {}) {
    let modifed = false;

    const object: any = factoryModel ? plainToClass(factoryModel, data) : data;
    const fields = Object.keys(object);

    fields.forEach((fieldName: any) => {
		// find array fields
      if (object[fieldName] && object[fieldName].length !== undefined) {
		  // check if field has an existing object entry with constructor
		  // if so, createEmptyObject from entries constructor - why??
		  // probably to find sub-arrays!
        if (
          object[fieldName].length === 1 &&
          Object.keys(object[fieldName][0]).length > 0 &&
          object[fieldName][0].constructor
        ) {
          object[fieldName] = [this.createEmptyObject(object[fieldName][0].constructor)];
        }

		// if length is 0, add an empty entry and run createEmptyObject with modified data again.
        if (object[fieldName].length === 0) {
          data[fieldName] = [{}];
          modifed = true;
        }
      } else {
        data[fieldName] = undefined;
      }
    });

    if (modifed) {
      return this.createEmptyObject(factoryModel, data);
    }

    return object;
  }
}
