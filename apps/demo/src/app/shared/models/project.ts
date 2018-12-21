import { plainToClassFromExist, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { serializeModel } from '../utils/custom-transforms';
import { Task } from './task';

export class Project {
  id?: number = undefined;
  @IsNotEmpty({
    groups: ['step-1']
  })
  name?: string = undefined;
  @IsNotEmpty({ always: true })
  description?: string = undefined;
  @ValidateNested({
    groups: ['step-2']
  })
  @IsOptional()
  @Type(serializeModel(Task))
  tasks?: Task[] = [];

  toString() {
    return `Project #${this.id} ${this.name}`;
  }
}
