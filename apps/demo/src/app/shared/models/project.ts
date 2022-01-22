import { marker } from '@ngneat/transloco-keys-manager/marker';
import { Expose, Type } from 'class-transformer-global-storage';
import {
  IsNotEmpty,
  IsOptional,
  Validate,
  ValidateNested,
} from 'class-validator-multi-lang';
import { ProjectPanelStepsEnum } from '../enums/project-panel-steps.enum';
import { ObjectMustBeNotEmpty } from '../utils/custom-validators';
import { Task } from './task';

export class Project {
  @Expose()
  id?: number;

  @IsNotEmpty({
    groups: [ProjectPanelStepsEnum.Step1],
  })
  @Expose()
  name?: string;

  @IsNotEmpty({ always: true })
  @Expose()
  description?: string;

  @ValidateNested({
    groups: [ProjectPanelStepsEnum.Step2],
  })
  @Validate(ObjectMustBeNotEmpty, [1, 3], {
    groups: [ProjectPanelStepsEnum.Step2],
    message: marker(
      'Tasks not initialized or min length = 1 and max length = 3, and all initialized tasks must be not empty'
    ),
  })
  @IsOptional()
  @Type(() => Task)
  @Expose()
  tasks?: Task[] = [];

  toString() {
    return `Project #${this.id} ${this.name}`;
  }
}
