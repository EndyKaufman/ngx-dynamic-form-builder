import { FormControl } from '@angular/forms';
import { DynamicFormGroupField } from '../models';
import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata';

export class DynamicFormControl extends FormControl {

  public validationDefinitions: ValidationMetadata[];

  constructor(fieldDefinition: DynamicFormGroupField) {
    super (fieldDefinition.data, fieldDefinition.validationFunctions);

    this.validationDefinitions = fieldDefinition.validationDefinitions;
  }
}
