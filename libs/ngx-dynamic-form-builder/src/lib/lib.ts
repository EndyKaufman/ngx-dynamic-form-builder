import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import {
  ClassConstructor,
  classToPlain,
  ClassTransformOptions,
  plainToClass,
} from 'class-transformer-global-storage';
import {
  validate,
  validateSync,
  ValidationError,
} from 'class-validator-multi-lang';
import cloneDeep from 'lodash.clonedeep';
import lodashGet from 'lodash.get';
import mergeWith from 'lodash.mergewith';
import lodashSet from 'lodash.set';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  from,
  map,
  Observable,
  of,
  ReplaySubject,
  tap,
} from 'rxjs';
import { DEFAULT_CLASS_TRANSFORM_OPTIONS } from './constants/constants';
import {
  ClassValidatorErrors,
  DeepPartial,
  DynamicFormArray,
  DynamicFormBuilderOptions,
  DynamicFormControl,
  DynamicFormGroup,
  DynamicFormProperties,
  IDynamicControlMetadata,
  ShortValidationErrors,
} from './types/types';
import { getGlobal } from './utils/get-global.util';
import {
  getGlobalDynamicFormBuilderOptions,
  getGlobalDynamicFormBuilderOptionsSubject,
} from './utils/global-dynamic-form-builder-options';
import {
  isPrimitiveClass,
  isPrimitiveType,
  mergeErrors,
  recursiveRemoveDynamicControlOptions,
  replaceLastPropertyToDynamicControlOptionsByDotPath,
  setDynamicControlOptions,
  transformClassValidatorErrorsToShortValidationErrors,
  transformValidationErrorsToClassValidatorErrors,
} from './utils/utils';

export function createFormControls<T = Record<string, unknown>>({
  classType,
  formBuilder,
  form,
  rootFormGroup,
  metadata,
  defaultValue,
  dynamicFormBuilderOptions,
}: {
  classType: ClassConstructor<T> | null;
  formBuilder: FormBuilder;
  form?: FormGroup;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rootFormGroup?: DynamicFormGroup<any>;
  metadata?: IDynamicControlMetadata;
  defaultValue: DeepPartial<T>;
  dynamicFormBuilderOptions?: DynamicFormBuilderOptions;
}): DynamicFormGroup<T> {
  const isRoot = !rootFormGroup;

  let dynamicForm = form as DynamicFormGroup<T>;

  if (!dynamicForm) {
    dynamicForm = formBuilder.group({}) as DynamicFormGroup<T>;
  }

  if (isRoot) {
    rootFormGroup = dynamicForm;
    setupDynamicFormBuilderOptions<T>({
      dynamicForm,
      dynamicFormBuilderOptions,
    });
  }

  setupClassTransformMetadata<T>({
    classType,
    dynamicForm,
    defaultMetadata: metadata,
  });

  createAllFormGroupChildrenControls<T>({
    dynamicForm,
    defaultValue,
    formBuilder,
    rootFormGroup,
    dynamicFormBuilderOptions,
  });

  addDynamicMethodsToFormGroup<T>(dynamicForm);

  if (isRoot) {
    subscribeToRootFormGroupValueChanges<T>(dynamicForm);
    subscribeToGlobalDynamicFormBuilderOptionsChange<T>(
      formBuilder,
      dynamicForm
    );

    return addDynamicMethodsToRootFormGroup<T>({
      dynamicForm,
      rootFormGroup,
      formBuilder,
    });
  } else {
    return dynamicForm;
  }
}

export function setValuesForControls<T = Record<string, unknown>>(
  formBuilder: FormBuilder,
  form: DynamicFormGroup<T>,
  value: T
) {
  const metadata: IDynamicControlMetadata = form.classTransformMetadata;
  if (!metadata) {
    throw new Error(`classTransformMetadata not found in form group`);
  }
  if (
    metadata.classType &&
    !isPrimitiveClass(metadata.classType) &&
    !(value instanceof metadata.classType)
  ) {
    // need for multi types
    if (
      metadata.withAncestors &&
      metadata.parent?.classType &&
      metadata.propertyName
    ) {
      const isArray =
        metadata.parent.properties.find(
          (prop) => prop.propertyName === metadata.propertyName
        )?.isArray || false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parentClassType: any = metadata.parent.classType;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parentObject: any = {
        [metadata.propertyName]: isArray ? [value] : value,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parentJson: any = plainToClass(
        parentClassType,
        parentObject,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (form.root as DynamicFormGroup<any>).dynamicFormBuilderOptions
          .classTransformOptions
      );
      value = isArray
        ? parentJson[metadata.propertyName][0]
        : parentJson[metadata.propertyName];
    } else {
      value = plainToClass(
        metadata.classType,
        value,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (form.root as DynamicFormGroup<any>).dynamicFormBuilderOptions
          .classTransformOptions
      ) as T;
    }
  }
  metadata.properties.forEach((metadataItem) => {
    if (!metadataItem.ignore) {
      if (metadataItem.propertyName) {
        if (!metadataItem.ignore) {
          if (!metadataItem.isArray) {
            const control = form.controls[
              metadataItem.propertyName
            ] as FormControl;
            if (
              !metadataItem.classType ||
              isPrimitiveClass(metadataItem.classType)
            ) {
              try {
                control.patchValue(
                  value !== undefined
                    ? (value as never)[metadataItem.propertyName]
                    : ''
                );
              } catch (err) {
                console.log({ err, metadataItem, form });
              }
            } else {
              try {
                setValuesForControls(
                  formBuilder,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  form.controls[metadataItem.propertyName] as any,
                  value !== undefined
                    ? (value as never)[metadataItem.propertyName]
                    : {}
                );
              } catch (err) {
                console.log({ err, metadataItem, form });
                throw err;
              }
            }
          } else {
            const arrayControl = form.controls[
              metadataItem.propertyName
            ] as FormArray;
            let formArrayLength = arrayControl.length;

            while (formArrayLength !== 0) {
              arrayControl.removeAt(0);
              formArrayLength--;
            }

            if (
              !metadataItem.classType ||
              isPrimitiveClass(metadataItem.classType)
            ) {
              try {
                (value !== undefined
                  ? (value as never)[metadataItem.propertyName] || []
                  : []
                ).forEach((item: never) => {
                  if (metadataItem.propertyName) {
                    arrayControl.push(formBuilder.control(item));
                  }
                });
              } catch (err) {
                console.log({ err, metadataItem, form });
              }
            } else {
              try {
                (value !== undefined
                  ? (value as never)[metadataItem.propertyName] || []
                  : []
                )
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .forEach((item: any) => {
                    // need for multi types
                    const itemKeys = Object.keys(item);
                    if (metadataItem.withAncestors) {
                      metadataItem.properties.forEach((prop) => {
                        if (
                          prop.propertyName &&
                          !itemKeys.includes(prop.propertyName)
                        ) {
                          item[prop.propertyName] = '';
                        }
                      });
                    }
                    if (metadataItem.propertyName) {
                      arrayControl.push(formBuilder.group(item));
                    }
                  });
              } catch (err) {
                console.log({ err, metadataItem, form });
              }
            }
          }
        }
      }
    }
  });
}

export function setValidatorsToControls<T>(
  formBuilder: FormBuilder,
  form: DynamicFormGroup<T>,
  rootFormGroup?: DynamicFormGroup<T>
) {
  if (!rootFormGroup) {
    rootFormGroup = form;
  }

  addCommonAsyncValidatorToRootForm(rootFormGroup);

  const metadata: IDynamicControlMetadata = form.classTransformMetadata;
  if (!metadata) {
    throw new Error('classTransformMetadata not found in form group');
  }

  metadata.properties.forEach((metadataItem) => {
    if (!metadataItem.ignore && metadataItem.propertyName) {
      if (!metadataItem.isArray) {
        if (
          !metadataItem.classType ||
          isPrimitiveClass(metadataItem.classType)
        ) {
          if (!rootFormGroup?.commonAsyncValidator) {
            throw new Error('commonAsyncValidator not set');
          }
          try {
            if (form.controls[metadataItem.propertyName]) {
              (
                form.controls[metadataItem.propertyName] as DynamicFormControl
              ).classTransformMetadata = metadataItem;
              if (
                !form.controls[metadataItem.propertyName].hasAsyncValidator(
                  rootFormGroup.commonAsyncValidator
                )
              ) {
                form.controls[metadataItem.propertyName].setAsyncValidators(
                  rootFormGroup.commonAsyncValidator
                );
              }
            }
          } catch (err) {
            console.log({ err, metadataItem, form });
          }
        } else {
          try {
            setValidatorsToControls(
              formBuilder,
              form.controls[metadataItem.propertyName] as DynamicFormGroup<T>,
              rootFormGroup
            );
          } catch (err) {
            console.log({ err, metadataItem, form });
          }
        }
      } else {
        if (
          !metadataItem.classType ||
          isPrimitiveClass(metadataItem.classType)
        ) {
          if (!rootFormGroup?.commonAsyncValidator) {
            throw new Error('commonAsyncValidator not set');
          }
          try {
            (
              form.controls[metadataItem.propertyName] as DynamicFormArray
            ).controls.forEach((control, propertyIndex) => {
              (control as DynamicFormGroup).classTransformMetadata = {
                ...metadataItem,
                propertyIndex,
                isArray: false,
              };
              if (!rootFormGroup) {
                throw Error('rootFormGroup not set');
              }
              if (
                !control.hasAsyncValidator(rootFormGroup.commonAsyncValidator)
              ) {
                control.setAsyncValidators(rootFormGroup.commonAsyncValidator);
              }
            });
            if (!rootFormGroup) {
              throw Error('rootFormGroup not set');
            }
            if (
              !(
                form.controls[metadataItem.propertyName] as DynamicFormArray
              ).hasAsyncValidator(rootFormGroup.commonAsyncValidator)
            ) {
              (
                form.controls[metadataItem.propertyName] as DynamicFormArray
              ).setAsyncValidators(rootFormGroup.commonAsyncValidator);
            }
          } catch (err) {
            console.log({ err, metadataItem, form });
          }
        } else {
          try {
            (
              form.controls[metadataItem.propertyName] as DynamicFormArray
            ).controls.forEach((control, propertyIndex) => {
              (control as DynamicFormGroup).classTransformMetadata = {
                ...metadataItem,
                propertyIndex,
                isArray: false,
              };
              const controlValue = control.value || {};
              // needed for extend controls if it does not exists, but the value has property with that name
              if (
                metadataItem.classType &&
                !isPrimitiveType(metadataItem.classType) &&
                metadataItem.properties.length >
                  Object.keys(controlValue).length
              ) {
                metadataItem.properties.forEach((prop) => {
                  if (
                    prop.propertyName &&
                    !Object.getOwnPropertyDescriptor(
                      controlValue,
                      prop.propertyName
                    )
                  ) {
                    if (prop.classType && !isPrimitiveType(prop.classType)) {
                      controlValue[prop.propertyName] = {};
                      if (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        !(control as DynamicFormGroup<any, any>).controls[
                          prop.propertyName
                        ]
                      ) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (control as DynamicFormGroup<any, any>).addControl(
                          prop.propertyName,
                          formBuilder.group(controlValue[prop.propertyName])
                        );
                      }
                    } else {
                      if (prop.isArray) {
                        controlValue[prop.propertyName] = [];
                        if (
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          !(control as DynamicFormGroup<any, any>).controls[
                            prop.propertyName
                          ]
                        ) {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (control as DynamicFormGroup<any, any>).addControl(
                            prop.propertyName,
                            formBuilder.array(controlValue[prop.propertyName])
                          );
                        }
                      } else {
                        controlValue[prop.propertyName] = '';
                        if (
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          !(control as DynamicFormGroup<any, any>).controls[
                            prop.propertyName
                          ]
                        ) {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (control as DynamicFormGroup<any, any>).addControl(
                            prop.propertyName,
                            formBuilder.control(controlValue[prop.propertyName])
                          );
                        }
                      }
                    }
                  }
                });
                setValuesForControls(
                  formBuilder,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control as DynamicFormGroup<any, any>,
                  controlValue
                );
              }
              setValidatorsToControls(
                formBuilder,
                control as DynamicFormGroup<T>,
                rootFormGroup
              );
              if (!rootFormGroup) {
                throw Error('rootFormGroup not set');
              }
              if (
                !control.hasAsyncValidator(rootFormGroup.commonAsyncValidator)
              ) {
                control.setAsyncValidators(rootFormGroup.commonAsyncValidator);
              }
            });
            if (!rootFormGroup) {
              throw Error('rootFormGroup not set');
            }
            if (
              !(
                form.controls[metadataItem.propertyName] as DynamicFormArray
              ).hasAsyncValidator(rootFormGroup.commonAsyncValidator)
            ) {
              (
                form.controls[metadataItem.propertyName] as DynamicFormArray
              ).setAsyncValidators(rootFormGroup.commonAsyncValidator);
            }
          } catch (err) {
            console.log({ err, metadataItem, form });
          }
        }
      }
    }
  });
}

export function validateAllFormFields(form: FormGroup) {
  let control: AbstractControl | null;
  let formArrayControlsLength: number;
  Object.keys(form.controls).forEach((field) => {
    control = form.get(field);

    // Control
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    }
    // Group: recursive
    else if (control instanceof FormGroup) {
      validateAllFormFields(control);
    }
    // Array
    else if (control instanceof FormArray) {
      formArrayControlsLength = (control as FormArray).controls.length;
      for (let i = 0; i < formArrayControlsLength; i++) {
        // Control in Array
        if ((control as FormArray).controls[i] instanceof FormControl) {
          ((control as FormArray).controls[i] as FormControl).markAsTouched({
            onlySelf: true,
          });
        }
        // Group in Array: recursive
        if ((control as FormArray).controls[i] instanceof FormGroup) {
          validateAllFormFields(
            (control as FormArray).controls[i] as FormGroup
          );
        }
      }
    }
  });
}

function getMetadata(
  classType: ClassConstructor<unknown>,
  dynamicFormBuilderOptions: DynamicFormBuilderOptions,
  currentDepth:number,
  currentPath:string[],
  classTransformOptions?: ClassTransformOptions,
): IDynamicControlMetadata {
  const classTransformerMetadataStorage =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
   getGlobal()['classTransformerMetadataStorage'] || undefined;
  if (!classTransformerMetadataStorage) {
    throw new Error(
      'classTransformerMetadataStorage not set in windows, please use the "class-transformer-global-storage" instead of "class-transformer"'
    );
  }
  const classValidatorMetadataStorage =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getGlobal()['classValidatorMetadataStorage'] || undefined;
    // (window as any)['classValidatorMetadataStorage'] || undefined;
  if (!classValidatorMetadataStorage) {
    throw new Error('classValidatorMetadataStorage not set in windows');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let exposeProperties: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let excludeProperties: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prevMultiTypes: any[] | null = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let multiTypes: any[] | null = null;
  

  // need for create all link for multi types
  if (classTransformOptions) {
    while (
      !prevMultiTypes ||
      !multiTypes ||
      prevMultiTypes.length !== multiTypes.length
    ) {
      prevMultiTypes = multiTypes;
      plainToClass(classType, {}, classTransformOptions);
      multiTypes = Array.from(classTransformerMetadataStorage._typeMetadatas)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((meta: any) =>
          Array.from(meta[1])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((sub: any) => sub[1].options.discriminator)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((sub: any) => ({ ...sub[1], ...sub[1].options.discriminator }))
        )
        .filter((arr) => arr.length > 0)
        .map((arr) =>
          arr.map((item) => ({
            classType: item.target,
            propertyName: item.propertyName,
            types: item.subTypes,
            property: item.property,
          }))
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .reduce((all: any, cur: any) => [...all, ...cur], []);
      multiTypes.forEach((multiType) =>
        multiType.types.forEach((type: { name: string }) =>
          plainToClass(
            multiType.classType,
            { [multiType.propertyName]: { [multiType.property]: type.name } },
            classTransformOptions
          )
        )
      );
      exposeProperties =
        classTransformerMetadataStorage.getExposedMetadatas(classType);
    }

    prevMultiTypes = [];
    multiTypes = null;
    // need for create all link for multi types
    while (
      !prevMultiTypes ||
      !multiTypes ||
      prevMultiTypes.length !== multiTypes.length
    ) {
      prevMultiTypes = multiTypes;
      plainToClass(classType, {}, classTransformOptions);
      multiTypes = Array.from(classTransformerMetadataStorage._excludeMetadatas)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((meta: any) =>
          Array.from(meta[1])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((sub: any) => sub[1].options.discriminator)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((sub: any) => ({ ...sub[1], ...sub[1].options.discriminator }))
        )
        .filter((arr) => arr.length > 0)
        .map((arr) =>
          arr.map((item) => ({
            classType: item.target,
            propertyName: item.propertyName,
            types: item.subTypes,
            property: item.property,
          }))
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .reduce((all: any, cur: any) => [...all, ...cur], []);
      multiTypes.forEach((multiType) =>
        multiType.types.forEach((type: { name: string }) =>
          plainToClass(
            multiType.classType,
            { [multiType.propertyName]: { [multiType.property]: type.name } },
            classTransformOptions
          )
        )
      );
      excludeProperties =
        classTransformerMetadataStorage.getExcludedMetadatas(classType);
    }
  } else {
    exposeProperties =
      classTransformerMetadataStorage.getExposedMetadatas(classType);
    excludeProperties =
      classTransformerMetadataStorage.getExcludedMetadatas(classType);
  }

  // need for support ancestors multiple types of form group
  const ancestorsProperties = [
    Array.from(classTransformerMetadataStorage._ancestorsMap)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((item: any) => item[1][0] === classType)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) =>
        classTransformerMetadataStorage.getExposedMetadatas(item[0])
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((all: any, cur: any) => [...all, ...cur], []),
  ];

  const properties = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...exposeProperties,
    ...excludeProperties,
    ...(ancestorsProperties.length > 0 ? ancestorsProperties[0] : []),
  ].filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (existsLimit: any, existsIndex: any, items: any) =>
      existsIndex ===
      items.findIndex(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (it: any) => it.propertyName === existsLimit.propertyName
      )
  );

  const depthLimitExceeded = currentDepth >= (dynamicFormBuilderOptions.maxNestedModelDepth as number);

  properties.forEach(
    (
      exposeMetadataItem: {
        propertyName: string;
        target: ClassConstructor<unknown>;
      },
      index: number
    ) => {
      const propertyMetadata = classTransformerMetadataStorage.findTypeMetadata(
        exposeMetadataItem.target,
        exposeMetadataItem.propertyName
      );

	  
	  if (propertyMetadata) {
		if(depthLimitExceeded) {
	      // prop exceeds limit, it should not be created at all, so remove it from list
		  delete properties[index];
		} else {
		  const propertyPath = [...currentPath,exposeMetadataItem.propertyName];
		  // only include submodel type data if allowedNestedModels is not set
		  // or, if it is defined, only allow if the property path is on list.
		  if(!Array.isArray(dynamicFormBuilderOptions.allowedNestedModels))
		  {
		  	properties[index] = {
		  	  ...getMetadata(propertyMetadata.typeFunction(),dynamicFormBuilderOptions,currentDepth+1,propertyPath,undefined),
		  	  isArray: Array === propertyMetadata.reflectedType,
		  	  propertyName: exposeMetadataItem.propertyName,
		  	};
		  } else {
		    if(dynamicFormBuilderOptions.allowedNestedModels.includes(propertyPath.join('.'))) {
		  	  properties[index] = {
		  		...getMetadata(propertyMetadata.typeFunction(),dynamicFormBuilderOptions,currentDepth+1,propertyPath,undefined),
		  		isArray: Array === propertyMetadata.reflectedType,
		  		propertyName: exposeMetadataItem.propertyName,
		  	  };
		    } else {
		      // prop should be excluded, add no metadata info at all
		      delete properties[index];
		      // properties[index] = {
		      //   classType: null,
		      //   properties: [],
		      //   isArray: false,
		      //   propertyName: exposeMetadataItem.propertyName,
		      // };
		    }
		  }
		}
      } else {
        properties[index] = {
          classType: null,
          properties: [],
          isArray: false,
          propertyName: exposeMetadataItem.propertyName,
        };
      }

    }
  );

  return {
    classType,
    properties,
    withAncestors:
      (ancestorsProperties?.length > 0 ? ancestorsProperties[0] : []).length >
      0,
    isArray: false,
    propertyName: null,
  };
}

function setupClassTransformMetadata<T = Record<string, unknown>>({
  defaultMetadata,
  classType,
  dynamicForm,
}: {
  defaultMetadata: IDynamicControlMetadata | undefined;
  classType: ClassConstructor<T> | null;
  dynamicForm: DynamicFormGroup<T, T>;
}) {
  if (!defaultMetadata && classType) {
    dynamicForm.classTransformMetadata = getMetadata(
      classType,
      dynamicForm.dynamicFormBuilderOptions,
	  0,
	  [],
    );
  } else {
    dynamicForm.classTransformMetadata =
      defaultMetadata as IDynamicControlMetadata;
  }
  if (!dynamicForm.classTransformMetadata) {
    throw new Error('metadata not set');
  }
}

function setupDynamicFormBuilderOptions<T = Record<string, unknown>>({
  dynamicForm,
  dynamicFormBuilderOptions,
}: {
  dynamicForm: DynamicFormGroup<T, T>;
  dynamicFormBuilderOptions: DynamicFormBuilderOptions | undefined;
}) {
  if (!dynamicForm) {
    throw new Error('dynamicForm not set');
  }
  if (!dynamicForm.dynamicFormBuilderOptions) {
    dynamicForm.dynamicFormBuilderOptions = dynamicFormBuilderOptions || {};
  }
  dynamicForm.dynamicFormBuilderOptions.classValidatorOptions = {
    ...(dynamicForm.dynamicFormBuilderOptions.classValidatorOptions || {}),
  };
  dynamicForm.dynamicFormBuilderOptions.classTransformOptions = {
    ...DEFAULT_CLASS_TRANSFORM_OPTIONS,
    ...(dynamicForm.dynamicFormBuilderOptions.classTransformOptions || {}),
  };
  dynamicForm.dynamicFormBuilderOptions.classTransformToPlainOptions = {
    ...(dynamicForm.dynamicFormBuilderOptions.classTransformToPlainOptions ||
      {}),
  };
  dynamicForm.dynamicFormBuilderOptions.maxNestedModelDepth = 
    (typeof dynamicForm.dynamicFormBuilderOptions.maxNestedModelDepth==='number' ? 
	  dynamicForm.dynamicFormBuilderOptions.maxNestedModelDepth : 2);

	// dynamicFormBuilderOptions.allowedNestedModels defaults to undefined
}

function createAllFormGroupChildrenControls<T = Record<string, unknown>>({
  dynamicForm,
  defaultValue,
  formBuilder,
  rootFormGroup,
  dynamicFormBuilderOptions,
}: {
  dynamicForm: DynamicFormGroup<T, T>;
  defaultValue: DeepPartial<T>;
  formBuilder: FormBuilder;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rootFormGroup: DynamicFormGroup<any, any> | undefined;
  dynamicFormBuilderOptions: DynamicFormBuilderOptions | undefined;
}) {
  dynamicForm.classTransformMetadata.properties.forEach(
    (metadataItem, index) => {
      dynamicForm.classTransformMetadata.properties[index].ignore = true;
      if (metadataItem.propertyName) {
        if (
          Object.keys(defaultValue || {}).length === 0 ||
          Object.getOwnPropertyDescriptor(
            defaultValue || {},
            metadataItem.propertyName
          )
        ) {
          if (!metadataItem.isArray) {
            if (
              !metadataItem.classType ||
              isPrimitiveClass(metadataItem.classType)
            ) {
              addDynamicPrimitiveObjectAsFormGroup<T>({
                defaultValue,
                metadataItem,
                formBuilder,
                dynamicForm,
                index,
              });
            } else {
              addDynamicTypedObjectAsFormGroup<T>({
                defaultValue,
                metadataItem,
                formBuilder,
                rootFormGroup,
                dynamicFormBuilderOptions,
                dynamicForm,
                index,
              });
            }
          } else {
            if (
              !metadataItem.classType ||
              isPrimitiveClass(metadataItem.classType)
            ) {
              addDynamicPrimitiveObjectAsFormArray<T>({
                defaultValue,
                metadataItem,
                formBuilder,
                dynamicForm,
                index,
              });
            } else {
              addDynamicTypedObjectAsFormArray<T>({
                defaultValue,
                metadataItem,
                formBuilder,
                rootFormGroup,
                dynamicFormBuilderOptions,
                dynamicForm,
                index,
              });
            }
          }
        }
      }
    }
  );
}

function addDynamicTypedObjectAsFormArray<T = Record<string, unknown>>({
  defaultValue,
  metadataItem,
  formBuilder,
  rootFormGroup,
  dynamicFormBuilderOptions,
  dynamicForm,
  index,
}: {
  defaultValue: DeepPartial<T>;
  metadataItem: IDynamicControlMetadata;
  formBuilder: FormBuilder;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rootFormGroup: DynamicFormGroup<any, any> | undefined;
  dynamicFormBuilderOptions: DynamicFormBuilderOptions | undefined;
  dynamicForm: DynamicFormGroup<T, T>;
  index: number;
}) {
  if (!metadataItem.propertyName) {
    throw new Error('propertyName not set');
  }
  const defaultArray: never[] = (defaultValue as never)[
    metadataItem.propertyName
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any[] =
    defaultArray && defaultArray.length > 0 ? defaultArray : [];

  const control = formBuilder.array([]) as DynamicFormArray;

  value.forEach((item) => {
    const form = formBuilder.group(item);
    form.setParent(control);
    control.push(
      createFormControls({
        classType: metadataItem.classType,
        formBuilder,
        form,
        rootFormGroup,
        metadata: metadataItem,
        defaultValue: item,
        dynamicFormBuilderOptions,
      })
    );
  });
  dynamicForm.addControl(metadataItem.propertyName, control);
  control.classTransformMetadata = metadataItem;
  control.classTransformMetadata.parent = dynamicForm.classTransformMetadata;
  dynamicForm.classTransformMetadata.properties[index].ignore = false;
}

function addDynamicPrimitiveObjectAsFormArray<T = Record<string, unknown>>({
  defaultValue,
  metadataItem,
  formBuilder,
  dynamicForm,
  index,
}: {
  defaultValue: DeepPartial<T>;
  metadataItem: IDynamicControlMetadata;
  formBuilder: FormBuilder;
  dynamicForm: DynamicFormGroup<T, T>;
  index: number;
}) {
  if (!metadataItem.propertyName) {
    throw new Error('propertyName not set');
  }
  const defaultArray: never[] = (defaultValue as never)[
    metadataItem.propertyName
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any[] =
    defaultArray && defaultArray.length > 0 ? defaultArray : [];
  const control = formBuilder.array(value) as DynamicFormArray;
  // todo: incorrect work with addControl
  dynamicForm.setControl(metadataItem.propertyName, control);
  control.classTransformMetadata = metadataItem;
  control.classTransformMetadata.parent = dynamicForm.classTransformMetadata;
  dynamicForm.classTransformMetadata.properties[index].ignore = false;
}

function addDynamicTypedObjectAsFormGroup<T = Record<string, unknown>>({
  defaultValue,
  metadataItem,
  formBuilder,
  rootFormGroup,
  dynamicFormBuilderOptions,
  dynamicForm,
  index,
}: {
  defaultValue: DeepPartial<T>;
  metadataItem: IDynamicControlMetadata;
  formBuilder: FormBuilder;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rootFormGroup: DynamicFormGroup<any, any> | undefined;
  dynamicFormBuilderOptions: DynamicFormBuilderOptions | undefined;
  dynamicForm: DynamicFormGroup<T, T>;
  index: number;
}) {
  if (!metadataItem.propertyName) {
    throw new Error('propertyName not set');
  }
  const value =
    (defaultValue as never)[metadataItem.propertyName] ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadataItem.properties.reduce((all: any, cur) => {
      if (cur.propertyName) {
        if (cur.isArray) {
          all[cur.propertyName] = [];
        } else {
          if (!cur.classType || isPrimitiveClass(cur.classType)) {
            all[cur.propertyName] = '';
          } else {
            all[cur.propertyName] = {};
          }
        }
      }
      return all;
    }, {});
  const form = formBuilder.group({});
  form.setParent(rootFormGroup as FormGroup);
  const control = createFormControls({
    classType: metadataItem.classType,
    formBuilder,
    form,
    rootFormGroup,
    metadata: metadataItem,
    defaultValue: value,
    dynamicFormBuilderOptions,
  });
  dynamicForm.addControl(metadataItem.propertyName, control);
  control.classTransformMetadata = metadataItem;
  control.classTransformMetadata.parent = dynamicForm.classTransformMetadata;
  dynamicForm.classTransformMetadata.properties[index].ignore = false;
}

function addDynamicPrimitiveObjectAsFormGroup<T = Record<string, unknown>>({
  defaultValue,
  metadataItem,
  formBuilder,
  dynamicForm,
  index,
}: {
  defaultValue: DeepPartial<T>;
  metadataItem: IDynamicControlMetadata;
  formBuilder: FormBuilder;
  dynamicForm: DynamicFormGroup<T, T>;
  index: number;
}) {
  if (!metadataItem.propertyName) {
    throw new Error('propertyName not set');
  }
  const value = (defaultValue as never)[metadataItem.propertyName] || '';
  const control = formBuilder.control(value) as DynamicFormControl;
  dynamicForm.addControl(metadataItem.propertyName, control);
  control.classTransformMetadata = metadataItem;
  control.classTransformMetadata.parent = dynamicForm.classTransformMetadata;
  dynamicForm.classTransformMetadata.properties[index].ignore = false;
}

function addDynamicMethodsToRootFormGroup<T = Record<string, unknown>>({
  dynamicForm,
  rootFormGroup,
  formBuilder,
}: {
  dynamicForm: DynamicFormGroup<T, T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rootFormGroup: DynamicFormGroup<any, any> | undefined;
  formBuilder: FormBuilder;
}) {
  dynamicForm.externalErrorsSubject = new BehaviorSubject<ClassValidatorErrors>(
    {}
  );

  dynamicForm.patchDynamicFormBuilderOptions = (
    dynamicFormBuilderOptions: DynamicFormBuilderOptions
  ) => {
    if (!dynamicForm) {
      throw new Error('rootFormGroup not set');
    }
    dynamicForm.dynamicFormBuilderOptions = {
      ...dynamicForm.dynamicFormBuilderOptions,
      ...dynamicFormBuilderOptions,
    };
    setValidatorsToControls(formBuilder, dynamicForm);
    dynamicForm.patchValue(dynamicForm.value);
  };

  dynamicForm.getObject = () => {
    if (!dynamicForm.classTransformMetadata.classType) {
      throw new Error('classType not set');
    }
    return plainToClass(
      dynamicForm.classTransformMetadata.classType,
      {
        ...dynamicForm.value,
      },
      dynamicForm.dynamicFormBuilderOptions.classTransformOptions
    ) as T;
  };

  dynamicForm.setObject = (object: T) => {
    setValuesForControls(
      formBuilder,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dynamicForm as any,
      classToPlain(
        object,
        dynamicForm.dynamicFormBuilderOptions.classTransformToPlainOptions
      )
    );
    setValidatorsToControls(formBuilder, dynamicForm, rootFormGroup);
  };

  dynamicForm.refresh = () => {
    setValidatorsToControls(formBuilder, dynamicForm, rootFormGroup);
    dynamicForm.patchValue(dynamicForm.value);
  };

  dynamicForm.getJSON = () => {
    return recursiveRemoveDynamicControlOptions(cloneDeep(dynamicForm.value));
  };

  dynamicForm.setJSON = (
    value: T,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ) => {
    setValuesForControls(formBuilder, dynamicForm, value);
    setValidatorsToControls(formBuilder, dynamicForm, rootFormGroup);
    dynamicForm.patchValue(dynamicForm.value, options);
  };

  dynamicForm.setExternalErrors = (externalErrors: ClassValidatorErrors) => {
    dynamicForm.externalErrorsSubject.next(
      recursiveRemoveDynamicControlOptions(cloneDeep(externalErrors))
    );
    dynamicForm.patchValue(dynamicForm.value);
  };

  dynamicForm.getExternalErrors = () => {
    return recursiveRemoveDynamicControlOptions(
      cloneDeep(dynamicForm.externalErrorsSubject.value)
    );
  };

  const dynamicFormProxy = new Proxy(dynamicForm, {
    get(target: typeof dynamicForm, prop: keyof typeof dynamicForm) {
      if (prop === 'object') {
        return target.getObject();
      }
      if (prop === 'json') {
        return target.getJSON();
      }
      if (prop === 'externalErrors') {
        return target.getExternalErrors();
      }
      return target[prop];
    },
    set(
      target: typeof dynamicForm,
      prop: keyof typeof dynamicForm,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: any
    ) {
      if (prop === 'object') {
        target.setObject(value);
        return true;
      }
      if (prop === 'json') {
        target.setJSON(value);
        return true;
      }
      if (prop === 'externalErrors') {
        target.setExternalErrors(value);
        return true;
      }
      Object.defineProperty(target, prop, {
        value,
        configurable: true,
      });
      return true;
    },
  });

  dynamicFormProxy.patchValue(dynamicFormProxy.value);
  setValidatorsToControls(formBuilder, dynamicFormProxy, rootFormGroup);
  return dynamicFormProxy;
}

function addDynamicMethodsToFormGroup<T = Record<string, unknown>>(
  dynamicForm: DynamicFormGroup<T, T>
) {
  dynamicForm.getClassValidatorErrors = (
    control: AbstractControl | null,
    nullIfEmpty: boolean
  ) => {
    const dynamicControl = control as unknown as DynamicFormProperties;
    if (!dynamicControl?.classValidatorErrorsSubject) {
      return of(null);
    }
    return dynamicControl.classValidatorErrorsSubject.pipe(
      map((errors) => {
        if (
          dynamicControl?.classTransformMetadata?.propertyName &&
          Object.getOwnPropertyDescriptor(
            errors,
            dynamicControl?.classTransformMetadata?.propertyName
          )
        ) {
          return errors[dynamicControl?.classTransformMetadata?.propertyName]
            ?.messages?.length === 0 && nullIfEmpty
            ? null
            : errors[dynamicControl?.classTransformMetadata?.propertyName];
        }
        return null;
      })
    );
  };
}

function addCommonAsyncValidatorToRootForm<T>(
  rootFormGroup: DynamicFormGroup<T>
) {
  if (!rootFormGroup.commonAsyncValidator) {
    rootFormGroup.commonAsyncValidatorSubject = new ReplaySubject<
      null | string
    >();
    rootFormGroup.commonAsyncValidator = (
      control: DynamicFormProperties | AbstractControl
    ): Observable<ValidationErrors | null> => {
      const metadata = (control as DynamicFormProperties)
        ?.classTransformMetadata;

      if (!metadata) {
        throw new Error('classTransformMetadata not found in form group');
      }

      const rootValue = rootFormGroup ? rootFormGroup.value : null;
      const { inputPath, errorsPath, controlPath } = findControlPaths(control);

      const object = setDynamicControlValue<T>(
        rootFormGroup,
        rootValue,
        controlPath,
        control,
        metadata
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setDynamicControlOptions(object, {
        rootValue,
        controlPath,
        control,
        metadata,
      });

      const localClassValidatorOptions = cloneDeep(
        rootFormGroup.dynamicFormBuilderOptions.classValidatorOptions
      );
      const globalClassValidatorOptions = cloneDeep(
        getGlobalDynamicFormBuilderOptions().classValidatorOptions
      );
      const classValidatorOptions = mergeWith(
        globalClassValidatorOptions,
        localClassValidatorOptions
      );
      return (
        rootFormGroup.commonAsyncValidatorFirstChanged
          ? from(validate(object as never, classValidatorOptions))
          : of(validateSync(object as never, classValidatorOptions))
      ).pipe(
        debounceTime(700),
        map((rootClassValidatorErrors: ValidationError[]) => {
          setRootFormGroupClassValidatorErrors<T>(
            rootFormGroup,
            rootClassValidatorErrors
          );

          const dynamicFormControl = setFormControlClassValidatorErrors<T>(
            control,
            rootFormGroup,
            errorsPath,
            inputPath
          );

          return Object.keys(dynamicFormControl.classValidatorErrors || {})
            .length > 0
            ? dynamicFormControl.classValidatorErrors
            : null;
        })
      );
    };
  }
}

function setDynamicControlValue<T>(
  rootFormGroup: DynamicFormGroup<T, T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rootValue: any,
  controlPath: string,
  control: DynamicFormProperties<unknown> | AbstractControl,
  metadata: IDynamicControlMetadata
) {
  if (!rootFormGroup) {
    throw Error('rootFormGroup not set');
  }
  if (!rootFormGroup.classTransformMetadata.classType) {
    throw Error('classType not set');
  }

  // need for resize arrays
  lodashSet(rootValue, controlPath, control.value);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const object: any = plainToClass(
    rootFormGroup.classTransformMetadata.classType,
    rootValue,
    rootFormGroup.dynamicFormBuilderOptions.classTransformOptions
  );

  // set original values of inputs
  if (
    metadata.isArray &&
    (!metadata.classType || isPrimitiveClass(metadata.classType))
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control.value.forEach((item: any, index: number) => {
      lodashSet(object, `${controlPath}.${index}`, control.value[index]);
    });
  }

  // need for correct work ValidateIfUpdater
  if (metadata.parent?.classType && metadata.propertyIndex === undefined) {
    replaceLastPropertyToDynamicControlOptionsByDotPath(
      controlPath,
      object,
      rootValue,
      control,
      metadata
    );
  }
  return object;
}

function findControlPaths(
  control: DynamicFormProperties<unknown> | AbstractControl
) {
  const inputPath: string[] = [];
  const errorsPath: string[] = [];
  let ctrl = control as DynamicFormProperties;
  while (ctrl) {
    const key =
      ctrl.classTransformMetadata?.propertyIndex?.toString() ||
      ctrl.classTransformMetadata?.propertyName ||
      null;
    if (key !== null) {
      inputPath.push(key);
      errorsPath.push(key);
      if (ctrl.parent?.parent) {
        errorsPath.push('children');
      }
    }
    ctrl = ctrl.parent as DynamicFormProperties;
  }
  const controlPath = inputPath.reverse().join('.');
  return { inputPath, errorsPath, controlPath };
}

function setFormControlClassValidatorErrors<T>(
  control: DynamicFormProperties<unknown> | AbstractControl,
  rootFormGroup: DynamicFormGroup<T, T>,
  errorsPath: string[],
  inputPath: string[]
) {
  const dynamicFormControl = control as DynamicFormControl;

  const propErrors = lodashGet(
    rootFormGroup.classValidatorErrors,
    errorsPath.reverse()
  );
  dynamicFormControl.classValidatorErrors =
    Object.keys(propErrors || {}).length > 0
      ? {
          [inputPath.reverse()[0]]: propErrors || {},
        }
      : {};

  if (!dynamicFormControl.classValidatorErrorsSubject) {
    dynamicFormControl.classValidatorErrors = {};
    dynamicFormControl.classValidatorErrorsSubject =
      new BehaviorSubject<ClassValidatorErrors>({});
  }
  dynamicFormControl.classValidatorErrorsSubject.next(
    dynamicFormControl.classValidatorErrors
  );

  if (!dynamicFormControl.customValidateErrors) {
    dynamicFormControl.customValidateErrors =
      new BehaviorSubject<ShortValidationErrors>({});
  }
  dynamicFormControl.customValidateErrors.next(
    transformClassValidatorErrorsToShortValidationErrors(
      dynamicFormControl.classValidatorErrors
    )
  );
  return dynamicFormControl;
}

function setRootFormGroupClassValidatorErrors<T>(
  rootFormGroup: DynamicFormGroup<T, T>,
  rootClassValidatorErrors: ValidationError[]
) {
  if (!rootFormGroup) {
    throw new Error('rootFormGroup not set');
  }

  rootFormGroup.classValidatorErrors =
    mergeErrors(
      rootFormGroup.externalErrorsSubject?.value || {},
      transformValidationErrorsToClassValidatorErrors(
        rootClassValidatorErrors
      ) || {}
    ) || {};

  if (!rootFormGroup.classValidatorErrorsSubject) {
    rootFormGroup.classValidatorErrors = {};
    rootFormGroup.classValidatorErrorsSubject =
      new BehaviorSubject<ClassValidatorErrors>({});
  }
  rootFormGroup.classValidatorErrorsSubject.next(
    rootFormGroup.classValidatorErrors
  );

  if (!rootFormGroup.customValidateErrors) {
    rootFormGroup.customValidateErrors =
      new BehaviorSubject<ShortValidationErrors>({});
  }
  rootFormGroup.customValidateErrors.next(
    transformClassValidatorErrorsToShortValidationErrors(
      rootFormGroup.classValidatorErrors
    )
  );
}

function subscribeToRootFormGroupValueChanges<T>(
  rootFormGroup: DynamicFormGroup<T, T>
) {
  if (!rootFormGroup.commonAsyncValidatorFirstChangedSubscription) {
    rootFormGroup.commonAsyncValidatorFirstChangedSubscription =
      rootFormGroup?.valueChanges
        .pipe(
          tap(() => {
            if (!rootFormGroup) {
              throw Error('rootFormGroup not set');
            }

            rootFormGroup.commonAsyncValidatorFirstChanged = true;
          }),
          catchError((err) => {
            console.log({ err, rootFormGroup });
            return of(null);
          })
        )
        .subscribe();
  }
}

function subscribeToGlobalDynamicFormBuilderOptionsChange<T>(
  formBuilder: FormBuilder,
  rootFormGroup: DynamicFormGroup<T, T>
) {
  if (!rootFormGroup.globalDynamicFormBuilderOptionsChangedSubscription) {
    rootFormGroup.globalDynamicFormBuilderOptionsChangedSubscription =
      getGlobalDynamicFormBuilderOptionsSubject()
        .pipe(
          tap(() => {
            setValidatorsToControls(formBuilder, rootFormGroup);
            rootFormGroup.patchValue(rootFormGroup.value);
          }),
          catchError((err) => {
            console.log({ err, rootFormGroup });
            return of(null);
          })
        )
        .subscribe();
  }
}
