import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DynamicFormBuilder, DynamicFormGroup } from 'ngx-dynamic-form-builder';
import { ExpUser } from '../../shared/models/exp-user';

@Component({
  selector: 'exp-login-panel',
  templateUrl: './exp-login-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpLoginPanelComponent implements OnInit {
  form: DynamicFormGroup<ExpUser>;

  fb = new DynamicFormBuilder();

  savedItem?: ExpUser;

  constructor() {
    this.form = this.fb.rootFormGroup(
      ExpUser,
      {},
      {
        classValidatorOptions: {
          groups: ['guest'],
        },
      }
    );
  }
  ngOnInit() {
    this.savedItem;
    this.form.object = new ExpUser();
  }
  onLoginClick(): void {
    if (this.form.valid) {
      this.savedItem = this.form.object;
    } else {
      this.savedItem;
    }
  }
}
