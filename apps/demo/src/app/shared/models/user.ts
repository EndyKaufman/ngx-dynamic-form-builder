import { marker } from '@ngneat/transloco-keys-manager/marker';
import { plainToClassFromExist, Transform, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, Matches, ValidateNested } from 'class-validator-multi-lang';
import { serializeModel, transformDateToString, transformStringToDate } from '../utils/custom-transforms';
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

  id: number;

  @IsNotEmpty()
  username: string;
  password: string;

  // flag "g" in RegExp work incorrect, please read issue: https://github.com/typestack/class-validator/issues/484
  @Matches(RegExp('^abc$', 'i'), { message: marker(`it should match the cool 'abc' string`) })
  abc: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
  isSuperuser: boolean;
  isStaff: boolean;

  @ValidateNested()
  @IsOptional()
  @Type(serializeModel(Department))
  department: Department = new Department();

  @Transform(transformStringToDate, { toClassOnly: true })
  @Transform(transformDateToString, { toPlainOnly: true })
  dateOfBirth: Date;

  toString() {
    return this.username;
  }

  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }
}
