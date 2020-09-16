import { marker } from '@ngneat/transloco-keys-manager/marker';
import { IsNotEmpty, IsOptional, Max, MaxLength, Min, Validate } from 'class-validator-multi-lang';
import { TextLengthMore15 } from '../utils/custom-validators';
export class Company {
  static strings = {
    id: marker('Id'),
    name: marker('Name'),
    regionNum: marker('Region num'),
  };

  id: number;

  @Validate(TextLengthMore15, {
    message: marker('The company name must be longer than 15'),
  })
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @IsOptional()
  @Min(1)
  @Max(99)
  regionNum: number;

  toString() {
    const arr: string[] = [];
    if (arr.length === 0 && this.name) {
      arr.push(this.name);
    }
    return arr.join(' ');
  }

  constructor(data?: any) {
    Object.keys(data || {}).map((key) => (this[key] = data ? data[key] : undefined));
  }

  toJSON() {
    return {
      ...this,
    };
  }
}
