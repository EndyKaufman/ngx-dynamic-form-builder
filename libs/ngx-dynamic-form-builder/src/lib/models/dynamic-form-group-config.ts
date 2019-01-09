import { ValidatorOptions } from 'class-validator';
import { Dictionary } from './dictionary';

export interface DynamicFormGroupConfig {
  legacyOrOpts?: Dictionary;
  customValidatorOptions?: ValidatorOptions;
}

