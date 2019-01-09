import { FormBuilder } from '@angular/forms';
import { ClassType } from 'class-transformer/ClassTransformer';
import { ValidatorOptions } from 'class-validator';
import 'reflect-metadata';
import { Dictionary } from '../models';
import { DynamicFormGroupConfig } from '../models/dynamic-form-group-config';
import { DynamicFormGroup, getClassValidators } from './dynamic-form-group';
import { plainToClass } from 'class-transformer';

export class DynamicFormBuilder extends FormBuilder {

  // ******************
  // Public API

  group<TModel>(factoryModel: ClassType<TModel>, controlsConfig?: Dictionary | DynamicFormGroupConfig, extra?: DynamicFormGroupConfig): DynamicFormGroup<TModel> {

    // Process the group with the controlsConfig passed into extra instead. (What does this accomplish?)
    if (controlsConfig && (controlsConfig.legacyOrOpts || controlsConfig.customValidatorOptions)) {
      return this.group(factoryModel, undefined, controlsConfig);
    }

    // Set default customValidatorOptions
    if (extra !== undefined && extra.customValidatorOptions === undefined) {
      extra.customValidatorOptions = { validationError: { target: false } };
    }

    let newControlsConfig: Dictionary;

    if (controlsConfig !== undefined) {
      newControlsConfig = controlsConfig;
    }

    // experimental
    if (controlsConfig === undefined) {
      newControlsConfig = { ...this.createEmptyObject(factoryModel) };

      Object.keys(newControlsConfig).forEach(key => {
        if (canCreateGroup()) {
          // recursively create a dynamic group for the nested object
          newControlsConfig[key] = this.group(newControlsConfig[key].constructor, extra);
        } else {
          if (canCreateArray()) {
            if (newControlsConfig[key][0].constructor) {
              // recursively create an array with a group
              newControlsConfig[key] = super.array(newControlsConfig[key]
                .map(newControlsConfigItem => this.group(newControlsConfigItem.constructor, extra)));
            } else {
              // Create an array of form controls
              newControlsConfig[key] = super.array(newControlsConfig[key]
                .map(newControlsConfigItem => this.control(newControlsConfigItem)));
            }
          }
        }

        function canCreateGroup() {
          const candidate = newControlsConfig[key];

          return candidate && !Array.isArray(candidate) &&
            candidate.constructor &&
            typeof candidate === 'object' &&
            (candidate.length === undefined ||
              (candidate.length !== undefined &&
              Object.keys(candidate).length === candidate.length));
        }

        function canCreateArray() {
          if (Array.isArray(newControlsConfig[key]) === false) {
            return false;
          }

          const candidate = newControlsConfig[key][0];

          return  candidate.constructor &&
            typeof candidate === 'object' &&
            (candidate.length === undefined ||
              (candidate.length !== undefined &&
              Object.keys(candidate).length === candidate.length));
        }
      });
    }

    // Create an Angular group from the top-level object
    const classValidators = getClassValidators<TModel>(factoryModel, newControlsConfig, this.getExtraValidationOptions(extra));
    const formGroup = super.group(classValidators, extra);

    // Initialize the resulting group
    const dynamicFormGroup = new DynamicFormGroup<TModel>(
      factoryModel,
      newControlsConfig,
      this.getExtraValidationOptions(extra)
    );

    // Add all angular controls to the resulting dynamic group
    Object.keys(formGroup.controls).forEach(key => {
      dynamicFormGroup.addControl(key, formGroup.controls[key]);
    });

    // Add a listener to the dynamic group for value changes; on change, execute validation
    dynamicFormGroup.valueChanges.subscribe(data => {
      dynamicFormGroup.validate(undefined, this.getExtraValidationOptions(extra));
    });

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
      if (object[fieldName] && object[fieldName].length !== undefined) {

        if (object[fieldName].length === 1 && Object.keys(object[fieldName][0]).length > 0 && object[fieldName][0].constructor) {
          object[fieldName] = [this.createEmptyObject(object[fieldName][0].constructor)];
        }

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

  /**
   * Helper for getting the customValidatorOptions
   */
  private getExtraValidationOptions(extra: DynamicFormGroupConfig): ValidatorOptions {
    return extra && extra.customValidatorOptions ? extra.customValidatorOptions : undefined;
  }
}
