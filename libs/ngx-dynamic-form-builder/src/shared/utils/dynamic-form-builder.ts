import { FormBuilder } from '@angular/forms';
import { DynamicFormGroup } from './dynamic-form-group';
import 'reflect-metadata';
import { ClassType } from 'class-transformer/ClassTransformer';

export class DynamicFormBuilder extends FormBuilder {
    group<TModel>(
        factoryModel: ClassType<TModel>,
        controlsConfig?: {
            [key: string]: any;
        }, extra?: {
            [key: string]: any;
        } | null
    ): DynamicFormGroup<TModel> {
        let newControlsConfig;
        if (controlsConfig !== undefined) {
            newControlsConfig = controlsConfig;
        }
        // experimental
        if (controlsConfig === undefined) {
            newControlsConfig = new factoryModel({});
            Object.keys(newControlsConfig).forEach(key => {
                if (
                    newControlsConfig[key] &&
                    newControlsConfig[key].constructor &&
                    typeof newControlsConfig[key] === 'object' &&
                    newControlsConfig[key].__not_group !== true &&
                    (
                        newControlsConfig[key].length === undefined ||
                        (
                            newControlsConfig[key].length !== undefined &&
                            Object.keys(newControlsConfig[key].length).length === newControlsConfig[key].length
                        )
                    )
                ) {
                    newControlsConfig[key].__not_group = true;
                    newControlsConfig[key] = this.group(
                        newControlsConfig[key].constructor,
                        controlsConfig !== undefined ? newControlsConfig[key] : undefined
                    );
                }
            });
        }
        const dynamicFormGroup = new DynamicFormGroup<TModel>(factoryModel, newControlsConfig);
        const formGroup = super.group(
            DynamicFormGroup.getClassValidators<TModel>(
                factoryModel,
                newControlsConfig
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
