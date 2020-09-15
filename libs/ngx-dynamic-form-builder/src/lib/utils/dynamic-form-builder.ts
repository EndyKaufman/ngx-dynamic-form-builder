import { AbstractControlOptions, AsyncValidatorFn, FormBuilder, ValidatorFn } from '@angular/forms';
import { ClassType } from 'class-transformer/ClassTransformer';
import 'reflect-metadata';
import {
  DynamicFormGroupConfig,
  isAbstractControlOptions,
  isDynamicFormGroupConfig,
  isLegacyOrOpts,
} from '../models/dynamic-form-group-config';
import { FormModel } from '../models/form-model';
import { DynamicFormGroup, getClassValidators } from './dynamic-form-group';
const cloneDeep = require('lodash.clonedeep');

export interface DynamicFormBuilderOptions {
  factoryDynamicFormGroup?: <TModel, TDynamicFormGroup extends DynamicFormGroup<TModel>>(
    factoryModel: ClassType<TModel>,
    fields?: FormModel<TModel>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) => TDynamicFormGroup;
}

export class DynamicFormBuilder extends FormBuilder {
  // need for createEmptyObject
  private emptyDynamicFormGroup = this.factoryDynamicFormGroup(Object);

  constructor(private options?: DynamicFormBuilderOptions) {
    super();
  }
  // ******************
  // Public API

  group<TModel>(
    factoryModel: ClassType<TModel>,
    controlsConfig?: FormModel<TModel> | DynamicFormGroupConfig | { [key: string]: any },
    options?: AbstractControlOptions | DynamicFormGroupConfig
  ): DynamicFormGroup<TModel> {
    // console.time(factoryModel.toString());
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
    const extra: DynamicFormGroupConfig = options as DynamicFormGroupConfig;

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
      // Set default classValidatorOptions
      if (!isDynamicFormGroupConfig(extra)) {
        extra.classValidatorOptions = { validationError: { target: false } };
      }
    }

    let newControlsConfig: FormModel<TModel> | undefined;

    if (controlsConfig !== undefined) {
      newControlsConfig = controlsConfig as FormModel<TModel>;
    }

    // experimental
    if (controlsConfig === undefined) {
      newControlsConfig = { ...this.createEmptyObject(factoryModel) };
      if (newControlsConfig !== undefined) {
        Object.keys(newControlsConfig).forEach((key) => {
          if (canCreateGroup() && newControlsConfig) {
            // recursively create a dynamic group for the nested object
            newControlsConfig[key] = this.group(newControlsConfig[key].constructor, undefined, {
              ...(extra.classValidatorOptions ? { classValidatorOptions: extra.classValidatorOptions } : {}),
              asyncValidators,
              updateOn,
              validators,
            });
          } else {
            if (canCreateArray() && newControlsConfig) {
              if (newControlsConfig[key][0].constructor) {
                // recursively create an array with a group
                newControlsConfig[key] = super.array(
                  newControlsConfig[key].map((newControlsConfigItem) =>
                    this.group(newControlsConfigItem.constructor, undefined, {
                      ...(extra.classValidatorOptions ? { classValidatorOptions: extra.classValidatorOptions } : {}),
                      asyncValidators,
                      updateOn,
                      validators,
                    })
                  )
                );
              } else {
                // Create an array of form controls
                newControlsConfig[key] = super.array(
                  newControlsConfig[key].map((newControlsConfigItem) => this.control(newControlsConfigItem))
                );
              }
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
    validators = validators && validators.filter((validator) => validator);
    asyncValidators = asyncValidators && asyncValidators.filter((validator) => validator);

    // Create an Angular group from the top-level object
    let classValidators: any = getClassValidators<TModel>(
      factoryModel,
      newControlsConfig,
      extra && extra.classValidatorOptions
    );
    let formGroup: any = super.group(classValidators, {
      ...(asyncValidators || {}),
      ...(updateOn || {}),
      ...(validators || {}),
    });

    // Initialize the resulting group
    const dynamicFormGroup = this.factoryDynamicFormGroup<TModel>(factoryModel, newControlsConfig, {
      asyncValidators,
      updateOn,
      validators,
    });

    // Add all angular controls to the resulting dynamic group
    Object.keys(formGroup.controls).forEach((key) => {
      dynamicFormGroup.addControl(key, formGroup.controls[key]);
    });

    // Add a listener to the dynamic group for value changes; on change, execute validation
    dynamicFormGroup.subscribeToValueChanges(undefined, extra && extra.classValidatorOptions);

    classValidators = null;
    formGroup = null;
    // console.timeEnd(factoryModel.toString());
    return dynamicFormGroup;
  }

  public factoryDynamicFormGroup<TModel>(
    factoryModel: ClassType<TModel>,
    fields?: FormModel<TModel>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    const formGroup = this.options?.factoryDynamicFormGroup
      ? this.options.factoryDynamicFormGroup(factoryModel, fields, validatorOrOpts, asyncValidator)
      : new DynamicFormGroup<TModel>(factoryModel, fields, validatorOrOpts, asyncValidator);
    formGroup.dynamicFormBuilder = this;
    return formGroup;
  }

  // *******************
  // Helpers

  /**
   * Recursively creates an empty object from the data provided
   */
  private createEmptyObject<TModel>(factoryModel: ClassType<TModel>, data = {}) {
    let modifed = false;

    let object: any = factoryModel ? this.emptyDynamicFormGroup.plainToClass(factoryModel, data) : data;
    let fields: any = Object.keys(object);

    let objectFieldNameLength: number;
    let objectFieldName0: any;
    fields.forEach((fieldName: any) => {
      objectFieldNameLength = object[fieldName] && object[fieldName].length;
      if (objectFieldNameLength !== undefined) {
        objectFieldName0 = object[fieldName][0];
        if (objectFieldNameLength === 1 && Object.keys(objectFieldName0).length > 0 && objectFieldName0.constructor) {
          object[fieldName] = [this.createEmptyObject(objectFieldName0.constructor)];
        }

        if (objectFieldNameLength === 0) {
          data[fieldName] = [{}];
          modifed = true;
        }
      } else {
        data[fieldName] = undefined;
      }
    });

    if (modifed) {
      object = null;
      fields = null;
      return this.createEmptyObject(factoryModel, data);
    }

    fields = null;
    return object;
  }
}
