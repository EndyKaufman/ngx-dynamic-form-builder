# customization

## Custom plainToClass and classToClass
### dynamic-form-group
```js
import { FormGroup } from '@angular/forms';
import { ClassType } from 'class-transformer/ClassTransformer';
import { classToClass, plainToClass } from 'class-transformer';

export class DynamicFormGroup<TModel> extends FormGroup {     
    ...
    classToClass<TClassModel>(object: TClassModel) {
        return classToClass(object, { ignoreDecorators: true });
    }
    plainToClass<TClassModel, Object>(cls: ClassType<TClassModel>, plain: Object) {
        return plainToClass(cls, plain, { ignoreDecorators: true });
    }
    ...
}
```
### custom-dynamic-form-group
```js
import { ClassType } from 'class-transformer/ClassTransformer';
import { JsonConvert } from 'json2typescript';
import { DynamicFormGroup } from 'ngx-dynamic-form-builder';
const cloneDeep = require('lodash.clonedeep');

export class CustomDynamicFormGroup<TModel> extends DynamicFormGroup<TModel> {    
    private jsonConvert: JsonConvert = new JsonConvert();
    classToClass<TClassModel>(object: TClassModel) {
        return clonedeep(object);
    }
    plainToClass<TClassModel, Object>(cls: ClassType<TClassModel>, plain: Object) {
        let object: ClassType<TClassModel>;
        try {
            object = jsonConvert.deserialize(plain, cls);
        } catch (e) {
            console.log((<Error>e));
        }
        
    }
}
```