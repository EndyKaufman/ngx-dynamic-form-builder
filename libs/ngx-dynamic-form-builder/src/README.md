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

## Usage

Code
```ts 
import { DynamicFormGroup, DynamicFormBuilder } from 'ngx-dynamic-form-builder';
import { Validate, IsNotEmpty, IsEmail, ValidateNested, IsOptional } from 'class-validator';
import { Type, plainToClass } from 'class-transformer';

form: DynamicFormGroup<User>;
fb = new DynamicFormBuilder();

// Entities
class Department {
    id: number;
    @IsNotEmpty()
    name: string;
}
class User {
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
}

// Entity object
item = plainToClass(
    User,
    {
        'id': 1,
        'username': 'admin',
        'password': 'secretpassword',
        'email': 'admin@site15.ru',
        'department': {
            'id': 2,
            'name': 'department'
        }
});

// Init form
this.form = this.fb.group(User, {
    username: '',
    email: ''
    department: this.fb.group(Department, {
        name: ''
    })
});

// Set object to form
this.form.object = this.item;

// Validate and save
if (this.form.valid) {
    this.savedItem = this.form.object;
}

// Show all validate errors
this.form.validateAllFormFields();

```

Template
```html
<form [formGroup]="form" novalidate>
  <h3>Group form</h3>
  <input formControlName="username">
  <span *ngIf="(form?.customValidateErrors | async)?.username?.length">
    {{(form?.customValidateErrors | async).username[0]}}
  </span>
  <div formGroupName="department">
    <h3>Sub group form</h3>
    <input formControlName="name" [placeholder]="strings.department">
    <span *ngIf="(form?.customValidateErrors | async)?.department?.name?.length">
      {{(form.customValidateErrors | async).department.name[0]}}
    </span>
  </div>
</form>
```

## License

MIT