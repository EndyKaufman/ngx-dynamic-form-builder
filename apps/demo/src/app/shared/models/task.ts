import { IsNotEmpty } from 'class-validator-multi-lang';

export class Task {
  id?: number = undefined;

  // If remove this decorator, ObjectMustBeNotEmpty custom validator on parent class detect error if value is null|undefined|empty string
  @IsNotEmpty({ always: true })
  description?: string = undefined;

  toString() {
    return `Task #${this.id} ${this.description}`;
  }
}
