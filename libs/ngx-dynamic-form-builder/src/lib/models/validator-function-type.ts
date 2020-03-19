import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';

export interface ValidatorFunctionSyncType {
  type: 'sync';
  validator: ValidatorFn;
}

export interface ValidatorFunctionAsyncType {
  type: 'async';
  validator: AsyncValidatorFn;
}

export type ValidatorFunctionType = ValidatorFunctionSyncType | ValidatorFunctionAsyncType;
