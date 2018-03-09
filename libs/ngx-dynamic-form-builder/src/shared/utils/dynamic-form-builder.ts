import { FormBuilder } from '@angular/forms';
import { DynamicFormGroup } from './dynamic-form-group';
import 'reflect-metadata';
import { ClassType } from 'class-transformer/ClassTransformer';
import { ValidatorOptions } from 'class-validator';

export class DynamicFormBuilder extends FormBuilder {
    group<TModel>(
        factoryModel: ClassType<TModel>,
        controlsConfig?: {
            [key: string]: any;
        },
        extra?: {
            [key: string]: any;
            customValidatorOptions?: ValidatorOptions;
        } | null
    ): DynamicFormGroup<TModel> {
        if (extra !== undefined && extra.customValidatorOptions === undefined) {
            extra.customValidatorOptions = { validationError: { target: false } };
        }
        let newControlsConfig;
        if (controlsConfig !== undefined) {
            newControlsConfig = controlsConfig;
        }
        // experimental
        if (controlsConfig === undefined) {
            newControlsConfig = new factoryModel();
            Object.keys(newControlsConfig).forEach(key => {
                if (
                    newControlsConfig[key] &&
                    newControlsConfig[key].constructor &&
                    typeof newControlsConfig[key] === 'object' &&
                    (
                        newControlsConfig[key].length === undefined ||
                        (
                            newControlsConfig[key].length !== undefined &&
                            Object.keys(newControlsConfig[key].length).length === newControlsConfig[key].length
                        )
                    )
                ) {
                    newControlsConfig[key] = this.group(
                        newControlsConfig[key].constructor,
                        undefined,
                        extra
                    );
                }
            });
        }
        const dynamicFormGroup = new DynamicFormGroup<TModel>(factoryModel, newControlsConfig);
        const formGroup = super.group(
            DynamicFormGroup.getClassValidators<TModel>(
                factoryModel,
                newControlsConfig,
                '',
                (extra &&
                    extra.customValidatorOptions &&
                    extra.customValidatorOptions.groups) ?
                    extra.customValidatorOptions.groups :
                    undefined
            )
            , extra
        );
        Object.keys(formGroup.controls).forEach(key => {
            dynamicFormGroup.addControl(key, formGroup.controls[key]);
        });
        dynamicFormGroup.valueChanges.subscribe(data => {
            dynamicFormGroup.validate();
        });
        return dynamicFormGroup;
    }
}
