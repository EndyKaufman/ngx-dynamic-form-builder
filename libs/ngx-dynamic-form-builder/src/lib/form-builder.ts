import { AbstractControlOptions, FormBuilder } from '@angular/forms';
import { ClassConstructor } from 'class-transformer-global-storage';
import { createFormControls } from './lib';
import { DynamicFormBuilderOptions, DynamicFormGroup } from './types/types';
export class DynamicFormBuilder extends FormBuilder {
  rootFormGroup<T = Record<string, unknown>>(
    classType: ClassConstructor<T> | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controlsConfig: { [key: string]: any },
    options?: (AbstractControlOptions & DynamicFormBuilderOptions) | null
  ): DynamicFormGroup<T>;
  rootFormGroup<T = Record<string, unknown>>(
    classType: ClassConstructor<T> | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controlsConfig: { [key: string]: any },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: { [key: string]: any }
  ): DynamicFormGroup<T>;
  rootFormGroup<T = Record<string, unknown>>(
    classType: ClassConstructor<T> | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controlsConfig: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any
  ): DynamicFormGroup<T> {
    const form = createFormControls<T>({
      classType,
      form: super.group({}, options),
      formBuilder: this,
      defaultValue: controlsConfig,
      dynamicFormBuilderOptions: options,
    });
    return form;
  }
}
