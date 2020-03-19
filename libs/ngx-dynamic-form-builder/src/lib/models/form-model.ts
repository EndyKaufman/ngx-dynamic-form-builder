import { FormArray } from '@angular/forms';
import { DynamicFormGroup } from '../utils/dynamic-form-group';

// Enforces the properties of the object, if supplied, to be of the original type or DynamicFormGroup or, FormArray
export type FormModel<T> = { [P in keyof T]?: T[P] | DynamicFormGroup<any> | FormArray };
