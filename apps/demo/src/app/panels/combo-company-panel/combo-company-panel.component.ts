import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicFormBuilder, DynamicFormGroup } from 'ngx-dynamic-form-builder';
import { ComboCompany } from './../../shared/models/combo-company';

@Component({
  selector: 'combo-company-panel',
  templateUrl: './combo-company-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboCompanyPanelComponent {
  form: DynamicFormGroup<ComboCompany>;

  @Input()
  jsonItem = {
    id: 11,
    name: '123456789012345',
    regionNum: 1,
    nameLocale: { ru: 'ru:123456789012345', en: 'en:123456789012345' },
  };

  @Input()
  strings = ComboCompany.strings;

  fb = new DynamicFormBuilder();

  savedItem?: ComboCompany;

  constructor() {
    this.form = this.fb.rootFormGroup(
      ComboCompany,
      {
        name: undefined,
        regionNum: undefined,
      },
      { angularValidators: { regionNum: [Validators.required] } }
    );
  }
  onLoadClick(): void {
    this.savedItem = undefined;
    this.form.json = this.jsonItem;
    console.log(this.form);
  }
  onLoadAsObjectClick(): void {
    this.savedItem = undefined;
    const object = new ComboCompany();
    object.id = this.jsonItem.id;
    object.name = this.jsonItem.name;
    object.regionNum = this.jsonItem.regionNum;
    object.nameLocale = this.jsonItem.nameLocale;
    this.form.object = object;
    console.log(this.form);
  }
  onClearClick(): void {
    this.savedItem = undefined;
    this.form.json = {} as ComboCompany;
  }
  onClearAsObjectClick(): void {
    this.savedItem = undefined;
    this.form.object = new ComboCompany();
  }
  onSaveClick(): void {
    console.log(this.form);
    if (this.form.valid) {
      this.savedItem = this.form.json;
    } else {
      this.savedItem = undefined;
    }
  }
}
