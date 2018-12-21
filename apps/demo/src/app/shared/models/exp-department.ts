import { IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { ExpCompany } from './exp-company';

export class ExpDepartment {
  id: number;
  @IsNotEmpty({
    groups: ['user']
  })
  name: string;
  @ValidateNested({
    groups: ['user']
  })
  @IsOptional({
    groups: ['user']
  })
  company: ExpCompany;

  constructor(data?: any) {
    if (data === undefined) {
      data = {};
    }
    this.name = data.name;
    this.company = new ExpCompany(data.company);
  }
}
