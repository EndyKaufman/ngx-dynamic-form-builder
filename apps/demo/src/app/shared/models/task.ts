import { plainToClassFromExist } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class Task {
  id?: number;
  @IsNotEmpty({ always: true })
  description?: string;

  toString() {
    return `Task #${this.id} ${this.description}`;
  }

  constructor(data?: any) {
    data = data ? data : {};
    if (!(data instanceof Task)) {
      this.id = data.id;
      this.description = data.description;
    }
    plainToClassFromExist(this, data);
  }
}
