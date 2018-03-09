import { DynamicFormGroup, DynamicFormBuilder } from 'ngx-dynamic-form-builder';
import { Company } from './../../shared/models/company';
import { Department } from '../../shared/models/department';
import { ExpUser } from '../../shared/models/exp-user';
import { Input, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'exp-login-panel',
  templateUrl: './exp-login-panel.component.html'
})
export class ExpLoginPanelComponent implements OnInit {

  @Input()
  form: DynamicFormGroup<ExpUser>;

  fb = new DynamicFormBuilder();
  savedItem: ExpUser;

  constructor() {
    this.form = this.fb.group(ExpUser, undefined, {
      customValidatorOptions: {
        groups: ['guest']
      }
    });
  }
  ngOnInit() {
    this.savedItem = undefined;
    this.form.object = new ExpUser();
    this.form.validateAllFormFields();
  }
  onLoginClick(): void {
    if (this.form.valid) {
      this.savedItem = this.form.object;
    } else {
      this.form.validateAllFormFields();
    }
  }
}
