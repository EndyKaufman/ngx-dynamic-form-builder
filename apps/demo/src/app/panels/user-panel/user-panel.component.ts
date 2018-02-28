import { DynamicFormGroup, DynamicFormBuilder } from 'ngx-dynamic-form-builder';
import { Company } from './../../shared/models/company';
import { Department } from '../../shared/models/department';
import { User } from '../../shared/models/user';
import { Input, Component } from '@angular/core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'user-panel',
  templateUrl: './user-panel.component.html'
})
export class UserPanelComponent {

  @Input()
  form: DynamicFormGroup<User>;
  @Input()
  item = new User({
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
  @Input()
  strings = User.strings;
  @Input()
  departmentStrings = Department.strings;
  @Input()
  companyStrings = Company.strings;

  fb = new DynamicFormBuilder();
  savedItem: User;

  constructor() {
    this.form = this.fb.group(User, {
      username: '',
      email: '',
      dateOfBirth: '',
      isSuperuser: false,
      isStaff: false,
      department: this.fb.group(Department, {
        name: '',
        company: this.fb.group(Company, {
          name: ''
        })
      })
    });
  }
  onLoadClick(): void {
    this.savedItem = undefined;
    this.form.object = this.item;
    this.form.validateAllFormFields();
  }
  onClearClick(): void {
    this.savedItem = undefined;
    this.form.object = new User();
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
