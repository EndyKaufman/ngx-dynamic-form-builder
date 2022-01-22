import { marker } from '@ngneat/transloco-keys-manager/marker';
import { Expose } from 'class-transformer-global-storage';
import {
  IsNotEmpty,
  IsOptional,
  Max,
  MaxLength,
  Min,
  Validate,
} from 'class-validator-multi-lang';
import { TextLengthMore15 } from '../utils/custom-validators';
export class Company {
  static strings = {
    id: marker('Id'),
    name: marker('Name'),
    regionNum: marker('Region num'),
  };

  @Expose()
  id: number;

  @Validate(TextLengthMore15, {
    message: marker('The company name must be longer than 15'),
  })
  @IsNotEmpty()
  @MaxLength(20)
  @Expose()
  name: string;

  @IsOptional()
  @Min(1)
  @Max(99)
  @Expose()
  regionNum: number;

  toString() {
    const arr: string[] = [];
    if (arr.length === 0 && this.name) {
      arr.push(this.name);
    }
    return arr.join(' ');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(data?: any) {
    if (data === undefined) {
      data = {};
    }
    this.id = data.id;
    this.name = data.name;
    this.regionNum = data.regionNum;
  }
}
