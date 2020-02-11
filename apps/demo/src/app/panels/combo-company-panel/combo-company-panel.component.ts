import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicFormBuilder, DynamicFormGroup } from 'ngx-dynamic-form-builder';
import { Company } from './../../shared/models/company';

@Component({
  selector: 'combo-company-panel',
  templateUrl: './combo-company-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComboCompanyPanelComponent {
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

  savedItem?: Company;

  constructor() {
    this.form = this.fb.group(Company, {
      name: 'name',
      regionNum: ['', Validators.required]
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
    this.form.validateAllFormFields();
    if (this.form.valid) {
      this.savedItem = this.form.object;
    }
  }
}
