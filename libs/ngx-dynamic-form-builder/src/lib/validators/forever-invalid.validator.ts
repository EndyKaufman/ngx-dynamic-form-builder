import { FormControl } from '@angular/forms';

export function foreverInvalid(c: FormControl) {
  return {
    foreverInvalid: {
      valid: false,
    },
  };
}
export const FOREVER_INVALID_NAME = 'foreverInvalid';
