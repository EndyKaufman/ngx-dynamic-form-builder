import { marker } from '@ngneat/transloco-keys-manager/marker';
import {
  Exclude,
  Expose,
  Transform,
  Type,
} from 'class-transformer-global-storage';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  ValidateNested,
} from 'class-validator-multi-lang';
import { ExposeNested } from 'ngx-dynamic-form-builder';
import {
  transformDateToString,
  transformStringToDate,
} from '../utils/custom-transforms';
import { Department } from './department';

export class User {
  static strings = {
    id: marker('Id'),
    username: marker('Username'),
    password: marker('Password'),
    isSuperuser: marker('Administrator'),
    isStaff: marker('Staff'),
    email: marker('Email'),
    department: marker('Department'),
    dateOfBirth: marker('Date of birth'),
    abc: marker('Only abc field'),
  };

  @Expose()
  id!: number;

  @IsNotEmpty()
  @Expose()
  username!: string;

  @Expose()
  password!: string;

  // flag "g" in RegExp work incorrect, please read issue: https://github.com/typestack/class-validator/issues/484
  @Matches(RegExp('^abc$', 'i'), {
    message: marker(`it should match the cool 'abc' string`),
  })
  @Expose()
  abc!: string;

  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email!: string;

  @Exclude()
  isSuperuser!: boolean;

  @Expose()
  isStaff!: boolean;

  @ValidateNested()
  @IsOptional()
  @Type(() => Department)
  @ExposeNested()
  department: Department = new Department();

  @Transform(transformStringToDate, { toClassOnly: true })
  @Transform(transformDateToString, { toPlainOnly: true })
  @Expose()
  dateOfBirth!: Date;

  toString() {
    return this.username;
  }
}
