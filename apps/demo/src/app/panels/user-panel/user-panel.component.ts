import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DynamicFormBuilder, DynamicFormGroup } from 'ngx-dynamic-form-builder';
import { Department } from '../../shared/models/department';
import { User } from '../../shared/models/user';
import { Company } from './../../shared/models/company';

@Component({
  selector: 'user-panel',
  templateUrl: './user-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPanelComponent {
  form: DynamicFormGroup<User>;

  @Input()
  jsonItem = {
    username: 'admin',
    isStaff: true,
    id: 1,
    isSuperuser: true,
    dateOfBirth: '1985-05-11T01:00:00Z',
    password: 'secretpassword',
    email: 'admin@site15.ru',
    department: {
      id: 2,
      name: 'department 1',
      company: {
        id: 3,
        name: 'company 2',
        regionNum: 1,
      },
    },
  };

  @Input()
  strings = User.strings;

  @Input()
  departmentStrings = Department.strings;

  @Input()
  companyStrings = Company.strings;

  fb = new DynamicFormBuilder({ validateAllFormFields: true });

  savedItem?: Object;

  constructor() {
    this.form = this.fb.group(User, {
      username: '',
      email: '',
      dateOfBirth: '',
      isSuperuser: false,
      isStaff: false,
      abc: '',
      department: this.fb.group(Department, {
        name: '',
        company: this.fb.group(Company, {
          name: '',
          regionNum: null,
        }),
      }),
    });
  }
  onLoadExternalClick(): void {
    this.form.setExternalErrors({
      username: ['external error'],
      department: {
        company: {
          name: ['external error for name'],
        },
      },
    });
  }
  onClearExternalClick(): void {
    this.form.clearExternalErrors();
  }
  onLoadClick(): void {
    this.savedItem = undefined;
    this.form.json = this.jsonItem;
  }
  onClearClick(): void {
    this.savedItem = undefined;
    this.form.object = new User();
  }
  onSaveClick(): void {
    this.form.validateAsync().then((_) => {
      if (this.form.valid) {
        this.savedItem = this.form.json;
      } else {
        this.savedItem = undefined;
      }
    });
  }
  onResetValidateAllFormFields(): void {
    this.form.resetValidateAllFormFields();
  }
}
