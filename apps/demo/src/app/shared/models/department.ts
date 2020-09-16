import { marker } from '@ngneat/transloco-keys-manager/marker';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator-multi-lang';
import { Company } from './company';

export class Department {
  static strings = {
    id: marker('Id'),
    name: marker('Name'),
    company: marker('Company'),
  };

  id: number;

  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @IsOptional()
  company: Company;

  toString() {
    return this.name;
  }

  constructor(data?: any) {
    Object.keys(data || {}).map((key) => (this[key] = data ? data[key] : undefined));
    this.company = new Company(this.company);
  }

  toJSON() {
    return {
      ...this,
      company: this.company instanceof Company ? this.company.toJSON() : this.company,
    };
  }
}
