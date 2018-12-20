import { FormBuilder } from '@angular/forms';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { ValidatorOptions } from 'class-validator';
import 'reflect-metadata';
import { DynamicFormGroup } from './dynamic-form-group';

export class DynamicFormBuilder extends FormBuilder {

  private createEmptyObject<TModel>(factoryModel: ClassType<TModel>, data = {}) {
    const object = factoryModel ? plainToClass(factoryModel, data) : data;
    let modifed = false;
    const keys = Object.keys(object);
    keys.forEach((key: any) => {
      if (object[key] && object[key].length !== undefined) {
        if (object[key].length === 1 && Object.keys(object[key][0]).length > 0 && object[key][0].constructor) {
          object[key] = [this.createEmptyObject(object[key][0].constructor)];
        }
        if (object[key].length === 0) {
          data[key] = [
            {}
          ];
          modifed = true;
        }
      } else {
        data[key] = undefined;
      }
    });
    if (modifed) {
      return this.createEmptyObject(factoryModel, data);
    }
    return object;
  }
  group<TModel>(
    factoryModel: ClassType<TModel>,
    controlsConfig?: {
      [key: string]: any;
    } | {
      legacyOrOpts?: {
        [key: string]: any;
      },
      customValidatorOptions?: ValidatorOptions;
    },
    extra?: {
      legacyOrOpts?: {
        [key: string]: any;
      },
      customValidatorOptions?: ValidatorOptions;
    }
  ): DynamicFormGroup<TModel> {
    if (controlsConfig && (controlsConfig.legacyOrOpts || controlsConfig.customValidatorOptions)) {
      return this.group(factoryModel, undefined, controlsConfig);
    }
    if (extra !== undefined && extra.customValidatorOptions === undefined) {
      extra.customValidatorOptions = { validationError: { target: false } };
    }
    let newControlsConfig;
    if (controlsConfig !== undefined) {
      newControlsConfig = controlsConfig;
    }
    // experimental
    if (controlsConfig === undefined) {
      newControlsConfig = { ...this.createEmptyObject(factoryModel) };
      Object.keys(newControlsConfig).forEach(key => {
        if (
          newControlsConfig[key] &&
          newControlsConfig[key].constructor &&
          typeof newControlsConfig[key] === 'object' &&
          (newControlsConfig[key].length === undefined ||
            (newControlsConfig[key].length !== undefined &&
              Object.keys(newControlsConfig[key].length).length === newControlsConfig[key].length))
        ) {
          newControlsConfig[key] = this.group(newControlsConfig[key].constructor, newControlsConfig[key], extra);
        } else {
          if (
            Array.isArray(newControlsConfig[key]) &&
            newControlsConfig[key][0].constructor &&
            typeof newControlsConfig[key][0] === 'object' &&
            (newControlsConfig[key][0].length === undefined ||
              (newControlsConfig[key][0].length !== undefined &&
                Object.keys(newControlsConfig[key][0].length).length === newControlsConfig[key][0].length))
          ) {
            if (newControlsConfig[key][0].constructor) {
              newControlsConfig[key] = super.array(
                newControlsConfig[key].map(newControlsConfigItem =>
                  this.group(
                    newControlsConfigItem.constructor,
                    newControlsConfigItem,
                    extra
                  )
                )
              );
            } else {
              newControlsConfig[key] = super.array(
                newControlsConfig[key].map(newControlsConfigItem =>
                  this.control(
                    newControlsConfigItem
                  )
                )
              );
            }
          }
        }
      });
    }
    const dynamicFormGroup = new DynamicFormGroup<TModel>(
      factoryModel,
      newControlsConfig,
      extra && extra.customValidatorOptions ? extra.customValidatorOptions : undefined
    );
    const classValidators = DynamicFormGroup.getClassValidators<TModel>(
      factoryModel,
      newControlsConfig,
      extra && extra.customValidatorOptions ? extra.customValidatorOptions : undefined
    );
    const formGroup = super.group(
      classValidators,
      extra
    );
    Object.keys(formGroup.controls).forEach(key => {
      dynamicFormGroup.addControl(key, formGroup.controls[key]);
    });
    dynamicFormGroup.valueChanges.subscribe(data => {
      dynamicFormGroup.validate(
        undefined,
        extra && extra.customValidatorOptions ? extra.customValidatorOptions : undefined
      );
    });
    return dynamicFormGroup;
  }
}
