import { marker } from '@ngneat/transloco-keys-manager/marker';
import { Expose, Type } from 'class-transformer-global-storage';
import {
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator-multi-lang';
import { Company } from './company';

export class Department {
  static strings = {
    id: marker('Id'),
    name: marker('Name'),
    company: marker('Company'),
  };

  @Expose()
  id: number;

  @IsNotEmpty()
  @Expose()
  name: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => Company)
  @Expose()
  company: Company;

  toString() {
    return this.name;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(data?: any) {
    if (data === undefined) {
      data = {};
    }
    this.id = data.id;
    this.name = data.name;
    this.company = new Company(data.company);
  }
}
