import { FormBuilder } from '@angular/forms';
import { DynamicFormGroup } from './dynamic-form-group';
import 'reflect-metadata';
import { classToClassFromExist, classToClass } from 'class-transformer';

export class DynamicFormBuilder extends FormBuilder {
    group<TModel>(
        factoryModel: { new(data?: any): TModel; },
        controlsConfig?: {
            [key: string]: any;
        }, extra?: {
            [key: string]: any;
        } | null
    ): DynamicFormGroup<TModel> {
        const newControlsConfig = new factoryModel(
            controlsConfig ? controlsConfig : {}
        );
        Object.keys(newControlsConfig).forEach(key => {
            if (
                newControlsConfig[key] &&
                newControlsConfig[key].constructor &&
                newControlsConfig[key].constructor.name &&
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
                    newControlsConfig[key]
                );
            }
        });
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
