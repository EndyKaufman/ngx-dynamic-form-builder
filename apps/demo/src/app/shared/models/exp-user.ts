import { Expose, Type } from 'class-transformer-global-storage';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator-multi-lang';
import { EqualsTo } from '../utils/custom-validators';
import { ExpDepartment } from './exp-department';

export class ExpUser {
  @Expose()
  id: number | undefined;

  @IsNotEmpty({
    groups: ['user', 'guest', 'new'],
  })
  @Expose()
  username: string;

  @IsNotEmpty({
    groups: ['guest', 'new'],
  })
  @Expose()
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
  @Expose()
  rePassword: string;

  @IsEmail(undefined, {
    groups: ['user'],
  })
  @IsNotEmpty({
    groups: ['user'],
  })
  @Expose()
  email: string;

  @Expose()
  isSuperuser: boolean;

  @Expose()
  isStaff: boolean;

  @ValidateNested({
    groups: ['user'],
  })
  @IsOptional({
    groups: ['user'],
  })
  @Type(() => ExpDepartment)
  @Expose()
  department: ExpDepartment;

  @Type(() => Date)
  @Expose()
  dateOfBirth?: Date;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      this.dateOfBirth;
    }
  }
}
