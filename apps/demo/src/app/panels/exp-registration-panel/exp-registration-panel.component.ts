import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DynamicFormBuilder, DynamicFormGroup } from 'ngx-dynamic-form-builder';
import { ExpUser } from '../../shared/models/exp-user';

@Component({
  selector: 'exp-registration-panel',
  templateUrl: './exp-registration-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpRegistrationPanelComponent implements OnInit {
  form: DynamicFormGroup<ExpUser>;

  fb = new DynamicFormBuilder();

  savedItem?: ExpUser;

  constructor() {
    this.form = this.fb.rootFormGroup(
      ExpUser,
      {},
      {
        classValidatorOptions: {
          groups: ['new'],
        },
      }
    );
  }
  ngOnInit() {
    this.savedItem;
    this.form.object = new ExpUser();
  }
  onRegistrationClick(): void {
    if (this.form.valid) {
      this.savedItem = this.form.object;
    } else {
      this.savedItem;
    }
  }
}
