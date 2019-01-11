import { DynamicFormGroup } from '../utils/dynamic-form-group';
import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata';

export interface DynamicFormGroupField {
  data: any | DynamicFormGroup<any>;
  validationFunctions: any[];
  validationDefinitions: ValidationMetadata[];
}
