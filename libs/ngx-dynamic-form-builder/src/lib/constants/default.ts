import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator-multi-lang';

export const DEFAULT_CLASS_TRANSFORM_OPTIONS: ClassTransformOptions = {
  strategy: 'excludeAll',
};
export const DEFAULT_CLASS_VALIDATOR_OPTIONS: ValidatorOptions = { validationError: { target: false }, always: true };
