import { AsyncValidatorFn, FormControl, ValidatorFn } from '@angular/forms';
import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata';
import { Observable } from 'rxjs';
import { DynamicFormGroupField } from '../models/dynamic-form-group-field';

export class DynamicFormControl extends FormControl {
  public controlName: string;
  public validationDefinitions: ValidationMetadata[];

  constructor(name: string, fieldDefinition: DynamicFormGroupField) {
    super(
      fieldDefinition.data instanceof Observable ? null : fieldDefinition.data,
      fieldDefinition.validationFunctions
        .filter(func => func.type === 'sync')
        .map(func => func.validator as ValidatorFn),
      fieldDefinition.validationFunctions
        .filter(func => func.type === 'async')
        .map(func => func.validator as AsyncValidatorFn)
    );
    this.controlName = name;
    this.validationDefinitions = fieldDefinition.validationDefinitions;
  }
}
