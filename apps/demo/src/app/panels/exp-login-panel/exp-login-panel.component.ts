import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DynamicFormBuilder, DynamicFormGroup } from 'ngx-dynamic-form-builder';
import { ExpUser } from '../../shared/models/exp-user';

@Component({
  selector: 'exp-login-panel',
  templateUrl: './exp-login-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpLoginPanelComponent implements OnInit {
  @Input()
  form: DynamicFormGroup<ExpUser>;

  fb = new DynamicFormBuilder();
  savedItem: ExpUser;

  constructor() {
    this.form = this.fb.group(ExpUser, {
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
