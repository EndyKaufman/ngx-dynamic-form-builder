import { FormBuilder } from '@angular/forms';
import { ClassType } from 'class-transformer/ClassTransformer';
import 'reflect-metadata';
import { Dictionary } from '../models';
import { FormGroupExtra } from '../models/form-group-extra';
import { DynamicFormGroup } from './dynamic-form-group';
import { ValidatorOptions } from 'class-validator';
import { getClassValidators } from './functions/get-class-validators.function';

export class DynamicFormBuilder extends FormBuilder {

  group<TModel>(factoryModel: ClassType<TModel>, controlsConfig?: Dictionary, extra?: FormGroupExtra | null): DynamicFormGroup<TModel> {

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
      newControlsConfig = new factoryModel();

      Object.keys(newControlsConfig).forEach(key => {
        if (canCreateSubGroup()) {
          // recursively create a dynamic group for the nested object
          newControlsConfig[key] = this.group(newControlsConfig[key].constructor, undefined, extra);
        }

        function canCreateSubGroup() {
          return newControlsConfig[key] &&
                newControlsConfig[key].constructor &&
                typeof newControlsConfig[key] === 'object' &&
                (
                  newControlsConfig[key].length === undefined ||
                  (
                    newControlsConfig[key].length !== undefined &&
                    Object.keys(newControlsConfig[key].length).length === newControlsConfig[key].length
                  )
                );
        }
      });
    }

    // Create an Angular group from the top-level object
    const formGroup = super.group(
      getClassValidators<TModel>(factoryModel, newControlsConfig, this.getExtraValidationOptions(extra)),
      extra
    );

    // Initialize the resulting group
    const dynamicFormGroup = new DynamicFormGroup<TModel>(factoryModel, newControlsConfig);

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

  private getExtraValidationOptions(extra: FormGroupExtra): ValidatorOptions {
    return (extra && extra.customValidatorOptions) ? extra.customValidatorOptions : undefined;
  }
}
