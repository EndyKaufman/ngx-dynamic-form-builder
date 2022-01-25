import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import {
  ClassConstructor,
  ClassTransformOptions,
} from 'class-transformer-global-storage';
import { ValidatorOptions } from 'class-validator-multi-lang';
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from 'rxjs';

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface IDynamicControlMetadata {
  classType: ClassConstructor<unknown> | null;
  propertyName: string | null;
  propertyIndex?: number;
  isArray: boolean;
  properties: IDynamicControlMetadata[];
  withAncestors?: boolean;
  ignore?: boolean;
  parent?: IDynamicControlMetadata;
}

export interface DynamicControlOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rootValue: any;
  controlPath: string;
  control: AbstractControl | DynamicFormProperties;
  metadata: IDynamicControlMetadata;
}

export type DynamicFormProperties<T = unknown> = {
  classTransformMetadata: IDynamicControlMetadata;

  externalErrors: ClassValidatorErrors;
  classValidatorErrors: ClassValidatorErrors;

  externalErrorsSubject: BehaviorSubject<ClassValidatorErrors>;
  classValidatorErrorsSubject: BehaviorSubject<ClassValidatorErrors>;
  customValidateErrors: BehaviorSubject<ShortValidationErrors>;

  parent: AbstractControl['parent'] | DynamicFormProperties<T>;
  value: AbstractControl['value'];
};

export type DynamicFormArray = FormArray & DynamicFormProperties;

export type DynamicFormControl = FormControl & DynamicFormProperties;

export interface DynamicFormBuilderOptions {
  classValidatorOptions?: ValidatorOptions;
  classTransformOptions?: ClassTransformOptions;
  classTransformToPlainOptions?: ClassTransformOptions;
  maxNestedModelDepth?:number;
  allowedNestedModels?:string[];
}

export interface ClassValidatorErrors {
  [key: string]: {
    messages?: string[];
    children?: ClassValidatorErrors;
  };
}
export interface ShortValidationErrors {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: string[] | ShortValidationErrors | any;
}

export type DynamicFormGroup<T = never, TJSON = T> = FormGroup &
  DynamicFormProperties<T> & {
    globalDynamicFormBuilderOptionsChangedSubscription: Subscription;

    dynamicFormBuilderOptions: DynamicFormBuilderOptions;

    commonAsyncValidatorSubject: ReplaySubject<null | string>;
    commonAsyncValidatorFirstChanged: boolean;
    commonAsyncValidatorFirstChangedSubscription: Subscription;
    commonAsyncValidator: (
      control: DynamicFormProperties | AbstractControl
    ) => Observable<ValidationErrors | null>;

    setExternalErrors(externalErrors: ClassValidatorErrors): void;
    getExternalErrors(): ClassValidatorErrors;

    getClassValidatorErrors: (
      control: AbstractControl | null,
      nullIfEmpty: boolean
    ) => Observable<ClassValidatorErrors[''] | null>;

    setDynamicValue(
      value: DeepPartial<T>,
      options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
      }
    ): void;

    patchDynamicFormBuilderOptions(
      dynamicFormBuilderOptions: DynamicFormBuilderOptions
    ): void;

    refresh: () => void;

    object: T;
    json: TJSON;

    getObject: () => T;
    setObject: (object: T) => void;

    getJSON: () => TJSON;
    setJSON: (object: TJSON) => void;
  };
