import { plainToClassFromExist } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class Task {
  id?: number = undefined;
  @IsNotEmpty({ always: true })
  description?: string = undefined;

  toString() {
    return `Task #${this.id} ${this.description}`;
  }
}
