import { plainToClassFromExist, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { serializeModel } from '../utils/custom-transforms';
import { Task } from './task';

export class Project {
  id?: number;
  @IsNotEmpty({
    groups: ['step-1']
  })
  name?: string;
  @IsNotEmpty({ always: true })
  description?: string;
  @ValidateNested({
    groups: ['step-2']
  })
  @IsOptional()
  @Type(serializeModel(Task))
  tasks?: Task[];

  toString() {
    return `Project #${this.id} ${this.name}`;
  }

  constructor(data?: any) {
    data = data ? data : {};
    if (!(data instanceof Project)) {
      this.id = data.id;
      this.name = data.name;
      this.description = data.description;
      this.tasks = data.tasks ? data.tasks : [];
    }
    plainToClassFromExist(this, data);
  }
}
