[![Greenkeeper badge](https://badges.greenkeeper.io/EndyKaufman/ngx-dynamic-form-builder.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/EndyKaufman/ngx-dynamic-form-builder.svg?branch=master)](https://travis-ci.org/EndyKaufman/ngx-dynamic-form-builder)
[![npm version](https://badge.fury.io/js/ngx-dynamic-form-builder.svg)](https://badge.fury.io/js/ngx-dynamic-form-builder)


[FormBuilder](https://angular.io/api/forms/FormBuilder) + [class-transformer](https://github.com/typestack/class-transformer) + [class-validator](https://github.com/typestack/class-validator) = dynamic form group builder for [Angular7+](https://angular.io)

## Installation

```bash
npm i --save ngx-dynamic-form-builder
```

## Links

[Demo](https://endykaufman.github.io/ngx-dynamic-form-builder) - Demo application with ngx-dynamic-form-builder.

[Stackblitz](https://stackblitz.com/edit/ngx-dynamic-form-builder) - Simply sample of usage on https://stackblitz.com

## Usage

app.module.ts
```typescript
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyPanelComponent } from './company-panel.component';

@NgModule({
  imports: [
    ...
    FormsModule,
    ReactiveFormsModule,
    ...
  ],
  declarations: [
    ...
    CompanyPanelComponent,
    ...
  ],
  ...
})
export class AppModule {}
```

company.ts
```typescript
import { Validate, IsNotEmpty } from 'class-validator';
import { plainToClassFromExist } from 'class-transformer';
import { TextLengthMore15 } from '../utils/custom-validators';

export class Company {
    static strings = {
        id: 'Id',
        name: 'Name'
    };
    static fields = ['id', 'name'];

    id: number;
    @Validate(TextLengthMore15, {
        message: 'The company name must be longer than 15'
    })
    @IsNotEmpty()
    name: string;

    toString() {
        return this.name;
    }

    constructor(data?: any) {
        plainToClassFromExist(this, data);
    }
}
```

company-panel.component.html
```html
<form [formGroup]="form" novalidate>
    <input formControlName="name" [placeholder]="strings.name">
    <p *ngIf="form?.formErrors?.name?.length">
      Error: {{form?.formErrors.name[0]}}
    </p>
    <p>Form status: {{ form.status | json }}</p>
    <p *ngIf="!form.valid">
      Form errors: {{fform?.formErrors | json}}
    </p>
    <p *ngIf="savedItem">
      Saved item: {{savedItem|json}}
    </p>
    <button (click)="onLoadClick()">Load</button>
    <button (click)="onClearClick()">Clear</button>
    <button (click)="onSaveClick()" [disabled]="!form.valid">Save</button>
</form>
```

company-panel.component.ts
```typescript
import { DynamicFormGroup, DynamicFormBuilder } from 'ngx-dynamic-form-builder';
import { Company } from './../../shared/models/company';
import { Input, Component } from '@angular/core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'company-panel',
  templateUrl: './company-panel.component.html'
})
export class CompanyPanelComponent {

  @Input()
  form: DynamicFormGroup<Company>;
  @Input()
  item = new Company({
    'id': 11,
    'name': '123456789012345'
  });
  @Input()
  strings = Company.strings;

  fb = new DynamicFormBuilder();
  savedItem: Company;

  constructor() {
    this.form = this.fb.group(Company, {
      name: ''
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
```

custom-validators.ts
```typescript
import {
    ValidatorConstraintInterface, ValidatorConstraint
} from 'class-validator';

@ValidatorConstraint()
export class TextLengthMore15 implements ValidatorConstraintInterface {
    validate(text: string) {
        return text ? text.length > 15 : false;
    }
}
```

## Observable Errors
the customValidateErrors property can be subscribed for cases in which your code should act on changes in errors

company-panel.component.html
```html
<form [formGroup]="form" novalidate>
    <input formControlName="name" [placeholder]="strings.name">
    <p *ngIf="(form?.customValidateErrors | async)?.name?.length">
      Error: {{(form.customValidateErrors | async).name[0]}}
    </p>
    <p>Form status: {{ form.status | json }}</p>
    <p *ngIf="!form.valid">
      Observable validation errors: {{form.customValidateErrors|async|json}}
    </p>
    <p *ngIf="savedItem">
      Saved item: {{savedItem|json}}
    </p>
    <button (click)="onLoadClick()">Load</button>
    <button (click)="onClearClick()">Clear</button>
    <button (click)="onSaveClick()" [disabled]="!form.valid">Save</button>
</form>
```

company-panel.component.ts
```typescript
import { DynamicFormGroup, DynamicFormBuilder } from 'ngx-dynamic-form-builder';
import { Company } from './../../shared/models/company';
import { Input, Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'company-panel',
  templateUrl: './company-panel.component.html'
})
export class CompanyPanelComponent implements onDestroy {

  @Input()
  form: DynamicFormGroup<Company>;
  @Input()
  item = new Company({
    'id': 11,
    'name': '123456789012345'
  });
  @Input()
  strings = Company.strings;

  fb = new DynamicFormBuilder();
  savedItem: Company;

  errorChangeSubscription: Subscription;

  constructor() {
    this.form = this.fb.group(Company, {
      name: ''
    });

    this.errorChangeSubscription = this.form.customValidateErrors.subscribe((allErrors) => {
      console.log('Errors changed': allErrors);
    })
  }
  ngOnDestroy() {
    if(this.errorChangeSubscription != null && this.errorChangeSubscription.closed === false) {
      this.errorChangeSubscription.unsubscribe();
    }
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
```

## License

MIT
