import { AbstractControlOptions, AsyncValidatorFn, FormBuilder, ValidatorFn } from '@angular/forms';
import { ClassTransformOptions } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { ValidatorOptions } from 'class-validator-multi-lang';
import { DynamicFormGroup } from '../utils/dynamic-form-group';
import { DynamicFormGroupConfig } from './dynamic-form-group-config';
import { FormModel } from './form-model';

export interface DynamicFormBuilderOptions {
  factoryFormBuilder?: () => FormBuilder;
  factoryDynamicFormGroup?: <TModel, TDynamicFormGroup extends DynamicFormGroup<TModel>>(
    factoryModel: ClassType<TModel>,
    fields?: FormModel<TModel>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
    options?: DynamicFormGroupConfig
  ) => TDynamicFormGroup;
  classValidatorOptions?: ValidatorOptions;
  classTransformOptions?: ClassTransformOptions;
  validateAllFormFields?: boolean | undefined;
}
