import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator-multi-lang';

@ValidatorConstraint()
export class TextLengthMore15 implements ValidatorConstraintInterface {
  validate(text: string) {
    return text ? text.length > 15 : false;
  }
}
@ValidatorConstraint()
export class ObjectMustBeNotEmpty implements ValidatorConstraintInterface {
  validate(data: Object | ArrayLike<Object>, validationArguments: ValidationArguments) {
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
            keys.filter((key) => object[key] === undefined || object[key] === null || object[key] === '').length ===
              keys.length
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
          validationArguments.object.hasOwnProperty(otherField) && validationArguments.object[otherField] === value
      ).length > 0
    );
  }

  defaultMessage(validationArguments: ValidationArguments) {
    return `${validationArguments.constraints.join(',')} do not match to ${validationArguments.property}`;
  }
}
