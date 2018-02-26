# ngx-dynamic-form-builder

[![Greenkeeper badge](https://badges.greenkeeper.io/EndyKaufman/ngx-dynamic-form-builder.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/EndyKaufman/ngx-dynamic-form-builder.svg?branch=master)](https://travis-ci.org/EndyKaufman/ngx-dynamic-form-builder)
[![npm version](https://badge.fury.io/js/ngx-dynamic-form-builder.svg)](https://badge.fury.io/js/ngx-dynamic-form-builder)


[FormBuilder](https://angular.io/api/forms/FormBuilder) + [class-transformer](https://github.com/typestack/class-transformer) + [class-validator](https://github.com/typestack/class-validator) = dynamic form group builder for [Angular5+](https://angular.io)

## Installation

```bash
npm install --save ngx-dynamic-form-builder class-validator class-transformer
```

## Links

[Demo](https://endykaufman.github.io/ngx-dynamic-form-builder) - Demo application with ngx-dynamic-form-builder.

[Stackblitz](https://stackblitz.com/edit/ngx-dynamic-form-builder) - Simply sample of usage on https://stackblitz.com

## Usage

app.module.ts
```js 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserPanelComponent } from './user-panel/user-panel.component';

@NgModule({
  imports: [
    ...
    FormsModule,
    ReactiveFormsModule,
    ...
  ],
  declarations: [
    ...
    UserPanelComponent,
    ...
  ],
  ...
})
export class AppModule {}
```

models/user.ts
```js 
import { IsNotEmpty, IsEmail, ValidateNested, IsOptional } from 'class-validator';
import { Type, plainToClassFromExist } from 'class-transformer';
import { Department } from './department';

export class User {
  static strings = {
    id: 'Id',
    username: 'Username',
    password: 'Password',
    isSuperuser: 'Administrator',
    isStaff: 'Staff',
    email: 'Email',
    department: 'Department',
    dateOfBirth: 'Date of birth',
    departmentStrings: Department.strings,
  };
  static fields = ['id', 'username', 'password', 'isSuperuser',
    'isStaff', 'email', 'department', 'dateOfBirth'];
  id: number;
  @IsNotEmpty()
  username: string;
  password: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ValidateNested()
  @IsOptional()
  @Type(() => Department)
  department: Department;
  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }
}
```

models/department.ts
```js 
import { IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type, plainToClassFromExist } from 'class-transformer';

export class Department {
  static strings = {
    id: 'Id',
    name: 'Name'
  };
  static fields = ['id', 'name'];
  id: number;
  @IsNotEmpty()
  name: string;
  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }
}

```

user-panel/user-panel.component.html
```html
<form [formGroup]="form" novalidate>
	<h3>Group form</h3>
	<input formControlName="username" [placeholder]="strings.username">
	<span *ngIf="(form?.customValidateErrors | async)?.username?.length">
      {{(form?.customValidateErrors | async).username[0]}}
    </span>
	<input type="email" formControlName="email" [placeholder]="strings.email">
	<span *ngIf="(form?.customValidateErrors | async)?.email?.length">
      {{(form.customValidateErrors | async).email[0]}}
    </span>
	<input type="date" formControlName="dateOfBirth" [placeholder]="strings.dateOfBirth">
	<span *ngIf="form.get('dateOfBirth').hasError('required')">
      date of birth is
      <strong>required</strong>
    </span>
	<span *ngIf="(form?.customValidateErrors | async)?.dateOfBirth?.length">
      {{(form.customValidateErrors | async).dateOfBirth[0]}}
    </span>
	<div formGroupName="department">
		<h3>Sub group form</h3>
		<input formControlName="name" [placeholder]="strings.department">
		<span *ngIf="(form?.customValidateErrors | async)?.department?.name?.length">
        {{(form.customValidateErrors | async).department.name[0]}}
      </span>
	</div>
	<div>
		<input type="checkbox" formControlName="isSuperuser">{{strings.isSuperuser}}
		<input type="checkbox" formControlName="isStaff">{{strings.isStaff}}
	</div>
	<div>
		<p>Form status: {{ form.status | json }}</p>
		<p *ngIf="!form.valid">Custom validation errors: {{form.customValidateErrors|async|json}}</p>
		<p *ngIf="savedItem">Saved item: {{savedItem|json}}</p>
	</div>
	<div class="full-width">
		<button (click)="onLoadClick()">Load</button>
		<button (click)="onClearClick()">Clear</button>
		<button (click)="onSaveClick()" [disabled]="!form.valid">Save</button>
	</div>
</form>
```

user-panel/user-panel.component.ts
```js
import { DynamicFormGroup, DynamicFormBuilder } from 'ngx-dynamic-form-builder';
import { Department } from '../shared/models/department';
import { User } from '../shared/models/user';
import { Input, Component } from '@angular/core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent {

  @Input()
  form: DynamicFormGroup<User>;
  @Input()
  item = new User(
    {
      'username': 'admin',
      'isStaff': true,
      'id': 1,
      'isSuperuser': true,
      'dateOfBirth': '1985-05-11T01:00:00Z',
      'password': 'secretpassword',
      'email': 'admin@site15.ru',
      'department': {
        'id': 2,
        'name': 'department 1'
      }
    });
  @Input()
  strings = User.strings;

  fb = new DynamicFormBuilder();
  savedItem: User;

  constructor() {
    this.form = this.fb.group(User, {
      username: '',
      email: '',
      dateOfBirth: ['', Validators.required],
      isSuperuser: false,
      isStaff: false,
      department: this.fb.group(Department, {
        name: ''
      })
    });
  }
  onLoadClick(): void {
    this.savedItem = undefined;
    this.form.object = this.item;
    this.form.validateAllFormFields();
  }
  onClearClick(): void {
    this.savedItem = undefined;
    this.form.object = new User();
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

user-panel/user-panel.component.scss
```css
input[type=text],input[type=date],input[type=email],{
  display:block;
}
span{
  color: purple;
  display: block;
}
```

app.component.ts
```html
...
<user-panel></user-panel>
...
```

## License

MIT