import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata';
import { DynamicFormGroup } from '../utils/dynamic-form-group';
import { ValidatorFunctionType } from './validator-function-type';

export interface DynamicFormGroupField {
  data: any | DynamicFormGroup<any>;
  validationFunctions: ValidatorFunctionType[];
  validationDefinitions: ValidationMetadata[];
}
