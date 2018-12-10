import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DynamicFormBuilder, DynamicFormGroup } from 'ngx-dynamic-form-builder';
import { Company } from './../../shared/models/company';

@Component({
  selector: 'company-panel',
  templateUrl: './company-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyPanelComponent {
  @Input()
  form: DynamicFormGroup<Company>;
  @Input()
  item = new Company({
    id: 11,
    name: '123456789012345',
    regionNum: 1
  });
  @Input()
  strings = Company.strings;

  fb = new DynamicFormBuilder();
  savedItem: Company;

  constructor() {
    this.form = this.fb.group(Company, {
      name: '',
      regionNum: 0
    });
  }
  onLoadClick(): void {
    this.savedItem = undefined;
    this.form.object = this.item;
    this.form.validateAllFormFields();
  }
  onClearClick(): void {
    this.savedItem = undefined;
    this.form.object = new Company();
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
