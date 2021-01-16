import { AbstractControlOptions, AsyncValidatorFn, FormBuilder, ValidatorFn } from '@angular/forms';
import { ClassTransformOptions } from 'class-transformer';
import { ClassConstructor } from 'class-transformer';
import { ValidatorOptions } from 'class-validator-multi-lang';
import { DynamicFormGroup } from '../utils/dynamic-form-group';
import { DynamicFormGroupConfig } from './dynamic-form-group-config';
import { FormModel } from './form-model';

export interface DynamicFormBuilderOptions {
  factoryFormBuilder?: () => FormBuilder;
  factoryDynamicFormGroup?: <TModel, TDynamicFormGroup extends DynamicFormGroup<TModel>>(
    factoryModel: ClassConstructor<TModel>,
    fields?: FormModel<TModel>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
    options?: DynamicFormGroupConfig
  ) => TDynamicFormGroup;
  classValidatorOptions?: ValidatorOptions;
  classTransformOptions?: ClassTransformOptions;
  classTransformToPlainOptions?: ClassTransformOptions | undefined;
  validateAllFormFields?: boolean | undefined;
}
