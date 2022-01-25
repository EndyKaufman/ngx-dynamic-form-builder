# ngx-dynamic-form-builder

[![Build Status](https://travis-ci.org/EndyKaufman/ngx-dynamic-form-builder.svg?branch=master)](https://travis-ci.org/EndyKaufman/ngx-dynamic-form-builder)
[![npm version](https://badge.fury.io/js/ngx-dynamic-form-builder.svg)](https://badge.fury.io/js/ngx-dynamic-form-builder)
[![monthly downloads](https://badgen.net/npm/dm/ngx-dynamic-form-builder)](https://www.npmjs.com/package/ngx-dynamic-form-builder)

[FormBuilder](https://angular.io/api/forms/FormBuilder) + [class-transformer-global-storage](https://github.com/petrzjunior/class-transformer) + [class-validator-multi-lang](https://github.com/endykaufman/class-validator-multi-lang) = dynamic form group builder for [Angular12+](https://angular.io)

## Installation

```bash
npm i --save class-transformer-global-storage class-validator-multi-lang ngx-dynamic-form-builder
```

## BREAKING CHANGE !!!

Version above 2 has a completely rewritten code, partially backwards compatible

Now `@Expose` and `@Exclude` decorators are used to define model fields, the new version is rigidly dependent on class-transform

Dependencies are not used original, but forks with additional necessary properties, when using this library, you need to replace all original imports with forks with modifications

Fork [class-validator-multi-lang](https://github.com/EndyKaufman/class-validator-multi-lang) - adds translation capability for errors (PR:[https://github.com/typestack/class-validator/pull/743](https://github.com/typestack/class-validator/pull/743))

Fork [class-transformer-global-storage](https://github.com/petrzjunior/class-transformer) - adds the ability to get meta information about all used classes (PR:[https://github.com/typestack/class-transformer/pull/929](https://github.com/typestack/class-transformer/pull/929))

For correct parse metadata, need remove `compilerOptions.downlevelIteration` and append `compilerOptions.emitDecoratorMetadata: true` in `tsconfig.json`

Native Angular validators not supported

## Links

[Demo](https://endykaufman.github.io/ngx-dynamic-form-builder) - Demo application with ngx-dynamic-form-builder.

[Stackblitz](https://stackblitz.com/edit/ngx-dynamic-form-builder) - Simply sample of usage on https://stackblitz.com

## Usage

company.ts

```typescript
import { Validate, IsNotEmptym } from 'class-validator-multi-lang';
import { TextLengthMore15 } from '../utils/custom-validators';
import { marker } from '@ngneat/transloco-keys-manager/marker';
import { Expose, Type } from 'class-transformer-global-storage';

export class Company {
  @Expose()
  id: number;

  @Validate(TextLengthMore15, {
    message: marker('The company name must be longer than 15'),
  })
  @IsNotEmpty()
  @Expose()
  name: string;

  constructor(data?: any) {
    if (data === undefined) {
      data = {};
    }
    this.id = data.id;
    this.name = data.name;
  }
}
```

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

company-panel.component.html

```html
<form
  [formGroup]="form"
  *ngIf="form?.customValidateErrors | async as errors"
  novalidate
>
  <input formControlName="name" placeholder="Name" />
  <p *ngIf="errors.name?.length">Error: {{errors.name[0]}}</p>
  <p>Form status: {{ form.status | json }}</p>
  <p>Form class-validator-multi-lang errors: {{errors|json}}</p>
  <p *ngIf="savedItem">Saved item: {{savedItem|json}}</p>
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
  templateUrl: './company-panel.component.html',
})
export class CompanyPanelComponent {
  form: DynamicFormGroup<Company>;

  @Input()
  item = new Company({
    id: 11,
    name: '123456789012345',
  });

  fb = new DynamicFormBuilder();

  savedItem?: Company;

  constructor() {
    this.form = this.fb.group(Company, {
      name: '',
    });
  }
  onLoadClick(): void {
    this.savedItem = undefined;
    this.form.object = this.item;
  }
  onClearClick(): void {
    this.savedItem = undefined;
    this.form.object = new Company();
  }
  onSaveClick(): void {
    if (this.form.valid) {
      this.savedItem = this.form.object;
    } else {
      this.savedItem = undefined;
    }
  }
}
```

custom-validators.ts

```typescript
import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator-multi-lang';

@ValidatorConstraint()
export class TextLengthMore15 implements ValidatorConstraintInterface {
  validate(text: string) {
    return text ? text.length > 15 : false;
  }
}
```


## Nested Forms and Models

### Depth limiting

By default, ngx-dynamic-form-builder will create all Submodels that it can find in specified model, with a max depth of 2.

```ts
class Company {
	@Expose()
	@Type(()=>User)
	manager?:any;
}

class User {
	@Expose()
	name?: string;

	@Type(type => Company)
	@Expose()
	company?: Company;
}

const form = new DynamicFormBuilder().rootFormGroup(User,{})

/*
  form.value will look like:
  { 
    name: '', 
    company: { <-- sub model level 1
      manager: { <-- sub model level 2
        name: ''
        --> no sub model level 3
      }
    }
  }
*/

```

You can change the depth by specifying a different value for maxNestedModelDepth:

```ts
const form = new DynamicFormBuilder().rootFormGroup(User,{}, {maxNestedModelDepth:0})

/*
  form.value will look like:
  { 
    name: '', 
    --> no sub models at all
  }
*/
```

### Create only specific submodels

Sometimes the form model may contain @Type decorated props, but you don't want these submodels to appear in the form.

Use _allowedNestedModels_ to specify a list of props / dot-separated prop paths that you want to be created.

All other submodels will be excluded.

```ts

/* Company + User from above example */

class Package {
	@Type(type => User)
	@Expose()
	user?: User;

	@Type(type => Company)
	@Expose()
	company?: Company;
}

const form = new DynamicFormBuilder().rootFormGroup(Package,{}, {allowedNestedModels:[]})

/*
  form.value will look like:
  { 
    --> no sub models at all
  }
*/

const form = new DynamicFormBuilder().rootFormGroup(Package,{}, {allowedNestedModels:['user','company']})

/*
  form.value will look like:
  { 
    user:{ name : '' },
    company:{ },
  }
*/

const form = new DynamicFormBuilder().rootFormGroup(Package,{}, {allowedNestedModels:['user','company','company.manager']})

/*
  form.value will look like:
  { 
    user: { name : '' },
    company:{ 
      manager: { name : '' }
	},
  }
*/
```




## Support multi-language translate validation errors (I18n)

Because multi-language supported in class-validator-multi-lang, now ngx-dynamic-form-builder also support this feature

set validation messages as settings when create form group

```typescript
this.form = this.fb.group(
  Company,
  {
    name: '',
  },
  {
    classValidatorOptions: {
      messages: {
        'The company name must be longer than 15':
          'company name must be longer than 15 (translate on other language)',
      },
    },
  }
);
```

set validation messages on runtime after for exists form group

```typescript
this.form.patchDynamicFormBuilderOptions({
  classValidatorOptions: {
    messages: {
      'The company name must be longer than 15':
        'company name must be longer than 15 (translate on other language)',
    },
  },
});
```

set translate property name in error

```typescript
this.form.patchDynamicFormBuilderOptions({
  classValidatorOptions: {
    titles: {
      regionNum:
        'number of region (translate property name in error on other language)',
    },
  },
});
```

set validation messages and properties name global for all instance of form group in project

```typescript
setGlobalDynamicFormBuilderOptions({
  classValidatorOptions: {
    messages: {
      'The company name must be longer than 15':
        'company name must be longer than 15 (translate on other language)',
    },
    titles: {
      regionNum:
        'number of region (translate property name in error on other language)',
    },
  },
});
```

## Observable Errors

The customValidateErrors property can be subscribed for cases in which your code should act on changes in errors

company-panel.component.html

```html
<form
  [formGroup]="form"
  *ngIf="form?.customValidateErrors | async as errors"
  novalidate
>
  <input formControlName="name" placeholder="Name" />
  <p *ngIf="errors.name?.length">Error: {{errors.name[0]}}</p>
  <p>Form status: {{ form.status | json }}</p>
  <p>Observable validation errors: {{errors|json}}</p>
  <p *ngIf="savedItem">Saved item: {{savedItem|json}}</p>
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
  templateUrl: './company-panel.component.html',
})
export class CompanyPanelComponent implements onDestroy {
  form: DynamicFormGroup<Company>;

  @Input()
  item = new Company({
    id: 11,
    name: '123456789012345',
  });

  @Input()
  strings = Company.strings;

  fb = new DynamicFormBuilder();

  savedItem?: Company;

  errorChangeSubscription: Subscription;

  constructor() {
    this.form = this.fb.group(Company, {
      name: '',
    });

    this.errorChangeSubscription = this.form.customValidateErrors.subscribe(
      (allErrors) => {
        console.log(`Errors changed: ${allErrors}`);
      }
    );
  }
  ngOnDestroy() {
    if (
      this.errorChangeSubscription != null &&
      this.errorChangeSubscription.closed === false
    ) {
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
    this.form.validateAllFormFields();
    if (this.form.valid) {
      this.savedItem = this.form.object;
    } else {
      this.savedItem = undefined;
    }
  }
}
```

## License

MIT
