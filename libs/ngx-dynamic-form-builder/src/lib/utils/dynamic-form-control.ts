import { AsyncValidatorFn, FormControl, ValidatorFn } from '@angular/forms';
import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata';
import { Observable } from 'rxjs';
import { DynamicFormGroupField } from '../models/dynamic-form-group-field';

export class DynamicFormControl extends FormControl {
  public validationDefinitions: ValidationMetadata[];

  constructor(fieldDefinition: DynamicFormGroupField) {
    super(
      fieldDefinition.data instanceof Observable ? null : fieldDefinition.data,
      fieldDefinition.validationFunctions
        .filter(func => func.type === 'sync')
        .map(func => func.validator as ValidatorFn),
      fieldDefinition.validationFunctions
        .filter(func => func.type === 'async')
        .map(func => func.validator as AsyncValidatorFn)
    );
    this.validationDefinitions = fieldDefinition.validationDefinitions;
  }
}
