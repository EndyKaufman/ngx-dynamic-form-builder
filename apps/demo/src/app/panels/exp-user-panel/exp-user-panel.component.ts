import { DynamicFormGroup, DynamicFormBuilder } from 'ngx-dynamic-form-builder';
import { Company } from './../../shared/models/company';
import { Department } from '../../shared/models/department';
import { ExpUser } from '../../shared/models/exp-user';
import { Input, Component } from '@angular/core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'exp-user-panel',
  templateUrl: './exp-user-panel.component.html'
})
export class ExpUserPanelComponent {

  @Input()
  form: DynamicFormGroup<ExpUser>;
  @Input()
  item = new ExpUser({
    'username': 'admin',
    'isStaff': true,
    'id': 1,
    'isSuperuser': true,
    'dateOfBirth': '1985-05-11T01:00:00Z',
    'password': 'secretpassword',
    'email': 'admin@site15.ru',
    'department': {
      'id': 2,
      'name': 'department 1',
      'company': {
        'id': 3,
        'name': 'company 2'
      }
    }
  });

  fb = new DynamicFormBuilder();
  savedItem: ExpUser;

  constructor() {
    this.form = this.fb.group(ExpUser);
  }
  onLoadClick(): void {
    this.savedItem = undefined;
    this.form.object = this.item;
    this.form.validateAllFormFields();
  }
  onClearClick(): void {
    this.savedItem = undefined;
    this.form.object = new ExpUser();
    this.form.validateAllFormFields();
  }
  onSaveClick(): void {
    if (this.form.valid) {
      this.savedItem = this.form.object;
    } else {
      this.form.validateAllFormFields();
    }
  }
}
