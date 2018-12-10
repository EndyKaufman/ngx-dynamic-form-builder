import { plainToClassFromExist } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class Group {
  static strings = {
    id: 'Id',
    name: 'Name'
  };

  id: number;
  @IsNotEmpty()
  name: string;

  toString() {
    return this.name;
  }

  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }
}
