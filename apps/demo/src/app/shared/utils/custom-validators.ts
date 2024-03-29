import { marker } from '@ngneat/transloco-keys-manager/marker';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator-multi-lang';

@ValidatorConstraint()
export class TextLengthMore15 implements ValidatorConstraintInterface {
  validate(text: string) {
    return text ? text.length > 15 : false;
  }
}
@ValidatorConstraint()
export class ObjectMustBeNotEmpty implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(data: any | any[], validationArguments: ValidationArguments) {
    let objects;
    if (!Array.isArray(data)) {
      objects = [data];
    } else {
      objects = data;
    }
    const objectLength = objects ? objects.length : 0;
    if (
      !validationArguments.constraints ||
      (validationArguments.constraints &&
        validationArguments.constraints.length === 2 &&
        +validationArguments.constraints[0] <= objectLength &&
        +validationArguments.constraints[1] >= objectLength) ||
      (validationArguments.constraints &&
        validationArguments.constraints.length === 1 &&
        +validationArguments.constraints[0] <= objectLength)
    ) {
      return (
        objectLength !== 0 &&
        objects.filter((object) => {
          const keys = object ? Object.keys(object) : [];
          return (
            keys.length === 0 ||
            keys.filter(
              (key) =>
                object[key] === undefined ||
                object[key] === null ||
                object[key] === ''
            ).length === keys.length
          );
        }).length === 0
      );
    }
    return false;
  }
}

@ValidatorConstraint({ name: 'equalsTo', async: false })
export class EqualsTo implements ValidatorConstraintInterface {
  validate(value: string, validationArguments: ValidationArguments) {
    return (
      validationArguments.constraints.length > 0 &&
      validationArguments.constraints.filter(
        (otherField) =>
          // eslint-disable-next-line no-prototype-builtins
          validationArguments.object.hasOwnProperty(otherField) &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (validationArguments.object as any)[otherField] === value
      ).length > 0
    );
  }

  defaultMessage() {
    return marker('$constraint1 do not match to $property');
  }
}
