export function getOrSetEmptyObject(factoryModel: any) {
  if (!factoryModel) {
    return undefined;
  }
  if (!factoryModel.emptyObject) {
    factoryModel.emptyObject = new factoryModel();
  }
  return factoryModel.emptyObject;
}
