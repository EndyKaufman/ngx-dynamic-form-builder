export function getOrSetEmptyObject(factoryModel: any) {
  if (factoryModel && !factoryModel.emptyObject) {
    factoryModel.emptyObject = new factoryModel();
  }
  return factoryModel ? factoryModel.emptyObject : undefined;
}
