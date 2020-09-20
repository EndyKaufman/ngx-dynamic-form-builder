import { Expose, ExposeOptions, Transform } from 'class-transformer';

// for correct work expose with js object
// https://github.com/typestack/class-transformer/issues/365
export function ExposeNested(options?: ExposeOptions) {
  const exposeFn = Expose(options);
  const transformFn = (propertyKey: string) =>
    Transform((value: any, obj: any) => {
      return obj ? obj[propertyKey] : undefined;
    });
  return (target: any, propertyKey: string) => {
    transformFn(propertyKey)(target, propertyKey);
    exposeFn(target, propertyKey);
  };
}
