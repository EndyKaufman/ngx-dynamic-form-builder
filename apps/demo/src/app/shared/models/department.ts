import { marker } from '@ngneat/transloco-keys-manager/marker';
import { plainToClassFromExist, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator-multi-lang';
import { serializeModel } from '../utils/custom-transforms';
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
  @Type(serializeModel(Company))
  company: Company;

  toString() {
    return this.name;
  }

  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }
}
