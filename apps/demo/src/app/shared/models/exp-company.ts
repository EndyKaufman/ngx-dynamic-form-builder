import { Validate, IsNotEmpty, Min, Max, MaxLength, IsOptional, getText } from 'class-validator-multi-lang';
import { TextLengthMore15 } from '../utils/custom-validators';

export class ExpCompany {
  id: number;

  @Validate(TextLengthMore15, {
    groups: ['user'],
    message: getText('The company name must be longer than 15'),
  })
  @IsNotEmpty({
    groups: ['user'],
  })
  @MaxLength(20)
  name: string;

  @IsOptional()
  @Min(1)
  @Max(99)
  regionNum: number;

  constructor(data?: any) {
    if (data === undefined) {
      data = {};
    }
    this.id = data.id;
    this.name = data.name;
    this.regionNum = data.regionNum;
  }
}
