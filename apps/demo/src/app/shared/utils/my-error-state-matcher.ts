import { ErrorStateMatcher } from '@angular/material';
import { FormGroupDirective } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
