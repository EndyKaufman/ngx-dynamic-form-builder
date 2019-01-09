import { Transform, Type, plainToClassFromExist } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { serializeModel, transformDateToString, transformStringToDate } from '../utils/custom-transforms';
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
    dateOfBirth: 'Date of birth'
  };

  id: number;
  @IsNotEmpty()
  username: string;
  password: string;
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
  dateOfBirth: string;

  toString() {
    return this.username;
  }

  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }
}
