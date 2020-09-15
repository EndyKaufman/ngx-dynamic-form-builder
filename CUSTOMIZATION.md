# customization

## Custom plainToClass and classToClass

### default dynamic-form-group

```typescript
import { FormGroup } from '@angular/forms';
import { ClassType } from 'class-transformer/ClassTransformer';
import { classToClass, plainToClass } from 'class-transformer';

export class DynamicFormGroup<TModel> extends FormGroup {
    ...

  classToClass<TClassModel>(object: TClassModel) {
    if (hasToJSON(object)) {
      return new (object as any).constructor((object as any).toJSON());
    }
    return cloneDeep(object);
  }

  plainToClass<TClassModel, Object>(cls: ClassType<TClassModel>, plain: Object) {
    if (hasToJSON(getOrSetEmptyObject(cls))) {
      return new cls(plain);
    }
    if (Object.keys(plain || {}).length === 0) {
      return this.classToClass(getOrSetEmptyObject(cls));
    }
    if (plain instanceof cls) {
      return this.classToClass(plain);
    }
    if (stringify(plain) === stringify(getOrSetEmptyObject(cls))) {
      return this.classToClass(getOrSetEmptyObject(cls));
    }
    return plainToClass(cls, plain, { ...this._classTransformOptions, ignoreDecorators: true });
  }

  classToPlain<TClassModel>(object: TClassModel) {
    if (hasToJSON(object)) {
      return (object as any).toJSON();
    }
    return classToPlain(object, this._classTransformOptions);
  }
    ...
}
```

### custom-dynamic-form-group

```typescript
import { ClassType } from 'class-transformer/ClassTransformer';
import { JsonConvert } from 'json2typescript';
import { DynamicFormGroup } from 'ngx-dynamic-form-builder';
const cloneDeep = require('lodash.clonedeep');

export class CustomDynamicFormGroup<TModel> extends DynamicFormGroup<TModel> {
  private jsonConvert: JsonConvert = new JsonConvert();
  classToClass<TClassModel>(object: TClassModel) {
    return cloneDeep(object);
  }
  plainToClass<TClassModel, Object>(cls: ClassType<TClassModel>, plain: Object) {
    let object: ClassType<TClassModel>;
    try {
      object = jsonConvert.deserialize(plain, cls);
    } catch (e) {
      console.log(<Error>e);
    }
  }
  classToPlain<TClassModel>(object: TClassModel) {
    try {
      return jsonConvert.serialize(object, cls);
    } catch (e) {
      console.log(<Error>e);
    }
  }
}
```
