import { Expose } from 'class-transformer-global-storage';
import { IsNotEmpty } from 'class-validator-multi-lang';

export class Task {
  @Expose()
  id?: number;

  // If remove this decorator, ObjectMustBeNotEmpty custom validator on parent class detect error if value is null|undefined|empty string
  @IsNotEmpty({ always: true })
  @Expose()
  description?: string;

  toString() {
    return `Task #${this.id} ${this.description}`;
  }
}
