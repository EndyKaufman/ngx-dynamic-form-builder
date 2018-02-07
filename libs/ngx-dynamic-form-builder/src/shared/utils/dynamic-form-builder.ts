import { FormBuilder } from '@angular/forms';
import { DynamicFormGroup } from './dynamic-form-group';
import 'reflect-metadata';

export class DynamicFormBuilder extends FormBuilder {
    group<TModel>(
        factoryModel: { new(data?: any): TModel; },
        controlsConfig: {
            [key: string]: any;
        }, extra?: {
            [key: string]: any;
        } | null
    ): DynamicFormGroup<TModel> {
        const dynamicFormGroup = new DynamicFormGroup<TModel>(factoryModel, controlsConfig);
        const formGroup = super.group(
            DynamicFormGroup.getClassValidators<TModel>(
                factoryModel,
                controlsConfig
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
