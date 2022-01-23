import { marker } from '@ngneat/transloco-keys-manager/marker';
import { Expose, Type } from 'class-transformer-global-storage';
import {
  ClassPropertyTitle,
  ClassTitle,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator-multi-lang';
import { ExpCompany } from './exp-company';

@ClassTitle('Department')
export class ExpDepartment {
  @Expose()
  id: number | undefined;

  @IsNotEmpty({
    groups: ['user'],
  })
  @ClassPropertyTitle(marker('department name'))
  @Expose()
  name: string;

  @ValidateNested({
    groups: ['user'],
  })
  @IsOptional({
    groups: ['user'],
  })
  @Type(() => ExpCompany)
  @Expose()
  company: ExpCompany;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(data?: any) {
    if (data === undefined) {
      data = {};
    }
    this.name = data.name;
    this.company = new ExpCompany(data.company);
  }
}
