export function hasToJSON(object: any) {
  return object ? typeof object.toJSON === 'function' : false;
}
