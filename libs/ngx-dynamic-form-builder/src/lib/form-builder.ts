import { AbstractControlOptions, FormBuilder } from '@angular/forms';
import { ClassConstructor } from 'class-transformer-global-storage';
import { createFormControls } from './lib';
import {
  DynamicFormBuilderOptions,
  DynamicFormBuilderOptionsKeys,
  DynamicFormGroup,
} from './types/types';
export class DynamicFormBuilder extends FormBuilder {
  rootFormGroup<T = Record<string, unknown>>(
    classType: ClassConstructor<T> | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controlsConfig?: { [key: string]: any },
    options?: (AbstractControlOptions & DynamicFormBuilderOptions<T>) | null
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
    controlsConfig?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any
  ): DynamicFormGroup<T> {
    let defaultValue = controlsConfig || {};
    let dynamicFormBuilderOptions = options;
    if (
      !options &&
      Object.keys(controlsConfig || {}).find((controlName) =>
        Object.keys(DynamicFormBuilderOptionsKeys).find(
          (optionsKey) => optionsKey === controlName
        )
      )
    ) {
      dynamicFormBuilderOptions = controlsConfig;
      defaultValue = {};
    }
    const form = createFormControls<T>({
      classType,
      form: super.group(
        {},
        dynamicFormBuilderOptions?.angularValidators ||
          dynamicFormBuilderOptions
      ),
      formBuilder: this,
      defaultValue,
      dynamicFormBuilderOptions,
    });
    return form;
  }

  childFormGroup<T = Record<string, unknown>>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rootFormGroup: DynamicFormGroup<any, any>,
    classType: ClassConstructor<T> | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controlsConfig?: { [key: string]: any }
  ): DynamicFormGroup<T>;
  childFormGroup<T = Record<string, unknown>>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rootFormGroup: DynamicFormGroup<any, any>,
    classType: ClassConstructor<T> | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controlsConfig: { [key: string]: any }
  ): DynamicFormGroup<T>;
  childFormGroup<T = Record<string, unknown>>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rootFormGroup: DynamicFormGroup<any, any>,
    classType: ClassConstructor<T> | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controlsConfig?: any
  ): DynamicFormGroup<T> {
    const defaultValue = controlsConfig || {};
    const form = createFormControls<T>({
      classType,
      form: super.group({}),
      formBuilder: this,
      defaultValue,
      rootFormGroup,
    });
    return form;
  }
}
