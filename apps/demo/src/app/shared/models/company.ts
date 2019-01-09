import { Validate, IsNotEmpty, MaxLength, Min, Max, IsOptional } from 'class-validator';
import { plainToClassFromExist } from 'class-transformer';
import { TextLengthMore15 } from '../utils/custom-validators';

export class Company {
  static strings = {
    id: 'Id',
    name: 'Name',
    regionNum: 'Region num'
  };

  id: number;
  @Validate(TextLengthMore15, {
    message: 'The company name must be longer than 15'
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
    plainToClassFromExist(this, data);
  }
}
