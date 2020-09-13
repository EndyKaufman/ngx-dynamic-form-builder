import { marker } from '@ngneat/transloco-keys-manager/marker';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, Validate, ValidateNested } from 'class-validator-multi-lang';
import { ProjectPanelStepsEnum } from '../enums/project-panel-steps.enum';
import { serializeModel } from '../utils/custom-transforms';
import { ObjectMustBeNotEmpty } from '../utils/custom-validators';
import { Task } from './task';

export class Project {
  id?: number = undefined;

  @IsNotEmpty({
    groups: [ProjectPanelStepsEnum.Step1],
  })
  name?: string = undefined;

  @IsNotEmpty({ always: true })
  description?: string = undefined;

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
  @Type(serializeModel(Task))
  tasks?: Task[] = [];

  toString() {
    return `Project #${this.id} ${this.name}`;
  }
}
