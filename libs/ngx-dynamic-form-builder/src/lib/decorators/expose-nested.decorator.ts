import {
  Expose,
  ExposeOptions,
  Transform,
  TransformFnParams,
} from 'class-transformer-global-storage';

// for correct work expose with js object
// https://github.com/typestack/class-transformer/issues/365
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ExposeNested(options?: ExposeOptions & { default: any }) {
  const exposeFn = Expose(options);
  const transformFn = (propertyKey: string) =>
    Transform((params: TransformFnParams) => {
      return (
        (params.obj && Object.getOwnPropertyDescriptor(params.obj, propertyKey)
          ? params.obj[propertyKey]
          : options?.default) || params.value
      );
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any, propertyKey: string) => {
    transformFn(propertyKey)(target, propertyKey);
    exposeFn(target, propertyKey);
  };
}
