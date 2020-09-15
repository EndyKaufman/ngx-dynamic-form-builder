import { IsNotEmpty, ValidateNested, IsOptional, ClassPropertyTitle, ClassTitle } from 'class-validator-multi-lang';
import { ExpCompany } from './exp-company';
import { marker } from '@ngneat/transloco-keys-manager/marker';

@ClassTitle('Department')
export class ExpDepartment {
  id: number;

  @IsNotEmpty({
    groups: ['user'],
  })
  @ClassPropertyTitle(marker('department name'))
  name: string;

  @ValidateNested({
    groups: ['user'],
  })
  @IsOptional({
    groups: ['user'],
  })
  company: ExpCompany;

  constructor(data?: any) {
    if (data === undefined) {
      data = {};
    }
    this.name = data.name;
    this.company = new ExpCompany(data.company);
  }

  toJSON() {
    return { ...this, company: this.company ? this.company.toJSON() : this.company };
  }
}
