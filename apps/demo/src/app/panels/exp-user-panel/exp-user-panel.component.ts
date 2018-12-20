import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DynamicFormBuilder, DynamicFormGroup } from 'ngx-dynamic-form-builder';
import { ExpUser } from '../../shared/models/exp-user';

@Component({
  selector: 'exp-user-panel',
  templateUrl: './exp-user-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpUserPanelComponent {
  @Input()
  form: DynamicFormGroup<ExpUser>;
  @Input()
  item = new ExpUser({
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
        regionNum: 1
      }
    }
  });

  fb = new DynamicFormBuilder();
  savedItem: ExpUser;

  constructor() {
    this.form = this.fb.group(ExpUser, {
      customValidatorOptions: {
        groups: ['user']
      }
    });
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
