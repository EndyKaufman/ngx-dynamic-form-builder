import { IsEmail, IsNotEmpty, IsOptional, Validate, ValidateIf, ValidateNested } from 'class-validator';
import { EqualsTo } from '../utils/custom-validators';
import { ExpDepartment } from './exp-department';

export class ExpUser {
  id: number;

  @IsNotEmpty({
    groups: ['user', 'guest', 'new'],
  })
  username: string;

  @IsNotEmpty({
    groups: ['guest', 'new'],
  })
  password: string;

  @ValidateIf((o) => o.password, {
    groups: ['new'],
  })
  @IsNotEmpty({
    groups: ['new'],
  })
  @Validate(EqualsTo, ['password'], {
    groups: ['new'],
  })
  rePassword: string;

  @IsEmail(undefined, {
    groups: ['user'],
  })
  @IsNotEmpty({
    groups: ['user'],
  })
  email: string;

  isSuperuser: boolean;

  isStaff: boolean;

  @ValidateNested({
    groups: ['user'],
  })
  @IsOptional({
    groups: ['user'],
  })
  department: ExpDepartment;

  dateOfBirth: string;

  constructor(data?: any) {
    if (data === undefined) {
      data = {};
    }
    this.username = data.username;
    this.password = data.password;
    this.rePassword = data.rePassword;
    this.email = data.email;
    this.isSuperuser = data.isSuperuser;
    this.isStaff = data.isStaff;
    this.department = new ExpDepartment(data.department);
    this.dateOfBirth = data.substring ? data.substring(0, 10) : undefined;
  }
}
