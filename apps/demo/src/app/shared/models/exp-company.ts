import { marker } from '@ngneat/transloco-keys-manager/marker';
import { Expose } from 'class-transformer-global-storage';
import {
  ClassPropertyTitle,
  ClassTitle,
  IsNotEmpty,
  IsOptional,
  Max,
  MaxLength,
  Min,
  Validate,
} from 'class-validator-multi-lang';
import { TextLengthMore15 } from '../utils/custom-validators';

@ClassTitle('Company')
export class ExpCompany {
  @Expose()
  id: number;

  @Validate(TextLengthMore15, {
    groups: ['user'],
    message: marker('The company name must be longer than 15'),
  })
  @IsNotEmpty({
    groups: ['user'],
  })
  @MaxLength(20)
  @ClassPropertyTitle(marker('company name'))
  @Expose()
  name: string;

  @IsOptional()
  @Min(1)
  @Max(99)
  @ClassPropertyTitle(marker('company region name'))
  @Expose()
  regionNum: number;

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
