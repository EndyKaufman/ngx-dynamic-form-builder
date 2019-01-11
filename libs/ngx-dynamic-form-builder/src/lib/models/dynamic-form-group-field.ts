import { DynamicFormGroup } from '../utils/dynamic-form-group';

export interface DynamicFormGroupField {
  data: any | DynamicFormGroup<any>;
  validation: any[];
}
