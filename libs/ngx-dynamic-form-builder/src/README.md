FormBuilder + class-transformer + class-validator = dynamic form group builder for Angular5+

## Installation

```bash
npm install --save ngx-dynamic-form-builder
```

## Usage

Code
```ts 
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
  <input matInput formControlName="username">
  <span *ngIf="(form?.customValidateErrors | async)?.username?.length">
    {{(form?.customValidateErrors | async).username[0]}}
  </span>
  <div formGroupName="department">
    <h3>Sub group form</h3>
    <input matInput formControlName="name" [placeholder]="strings.department">
    <span *ngIf="(form?.customValidateErrors | async)?.department?.name?.length">
      {{(form.customValidateErrors | async).department.name[0]}}
    </span>
  </div>
</form>
```

## Links

[Demo](https://github.com/EndyKaufman/ngx-dynamic-form-builder) - Demo application with ngx-dynamic-form-builder.

## License

MIT