import { IsEmail, IsNotEmpty, IsOptional, Validate, ValidateIf, ValidateNested } from 'class-validator-multi-lang';
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

  dateOfBirth?: Date;

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

    if (data.dateOfBirth) {
      const dateOfBirth = new Date(data.dateOfBirth);
      const userTimezoneOffset = dateOfBirth.getTimezoneOffset() * 60000;
      this.dateOfBirth = new Date(dateOfBirth.getTime() - userTimezoneOffset);
    } else {
      this.dateOfBirth = undefined;
    }
  }

  toJSON() {
    return {
      ...this,
      department: this.department instanceof ExpDepartment ? this.department.toJSON() : this.department,
      dateOfBirth: this.dateOfBirth ? this.dateOfBirth.toISOString() : undefined,
    };
  }
}
