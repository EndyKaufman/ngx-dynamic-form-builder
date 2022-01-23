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

  fb = new DynamicFormBuilder();

  savedItem?: User;

  constructor() {
    this.form = this.fb.rootFormGroup(User, {
      username: '',
      email: '',
      dateOfBirth: '',
      isSuperuser: false,
      isStaff: false,
      abc: '',
      department: {
        name: '',
        company: {
          name: '',
          regionNum: null,
        },
      },
    });
  }
  onLoadExternalClick(): void {
    this.form.setExternalErrors({
      username: { messages: ['external error'] },
      department: {
        children: {
          company: {
            children: {
              name: { messages: ['external error for name'] },
            },
          },
        },
      },
    });
  }
  onClearExternalClick(): void {
    this.form.setExternalErrors({});
  }
  onLoadClick(): void {
    this.savedItem = undefined;
    this.form.json = this.jsonItem as unknown as User;
  }
  onClearClick(): void {
    this.savedItem = undefined;
    this.form.object = new User();
  }
  onSaveClick(): void {
    if (this.form.valid) {
      this.savedItem = { ...this.form.json };
    } else {
      this.savedItem = undefined;
    }
  }
}
