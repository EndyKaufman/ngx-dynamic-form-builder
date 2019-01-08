import { ValidatorOptions } from 'class-validator';

export interface FormGroupExtra {
  [key: string]: any;
  customValidatorOptions?: ValidatorOptions;
}
