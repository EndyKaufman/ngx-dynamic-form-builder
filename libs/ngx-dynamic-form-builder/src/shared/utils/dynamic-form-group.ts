import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata';
import { MetadataStorage, Validator, getFromContainer, ValidationTypes, validateSync, ValidationError } from 'class-validator';
import { FormControl } from '@angular/forms';
import { classToClass, plainToClass } from 'class-transformer';
import 'reflect-metadata';
import { ClassType } from 'class-transformer/ClassTransformer';

export class DynamicFormGroup<TModel> extends FormGroup {
    public customValidateErrors = new BehaviorSubject<any>({});
    private _object: TModel;
    constructor(
        public factoryModel: ClassType<TModel>,
        public fields: {
            [key: string]: any
        }
    ) {
        super({});
        this.fields = this.onlyFields(this.fields);
    }
    static getClassValidators<TModel>(
        factoryModel: ClassType<TModel>,
        fields: {
            [key: string]: any
        }
    ) {
        const validationMetadatas: ValidationMetadata[] =
            getFromContainer(MetadataStorage).getTargetValidationMetadatas(factoryModel, '');
        const formGroupFields = {};
        const validator = new Validator();
        Object.keys(fields).filter(key => key.indexOf('__') !== 0).forEach(key => {
            let formGroupField = formGroupFields[key];
            if (formGroupField === undefined) {
                formGroupField = Array.isArray(fields[key]) ? fields[key] : [];
            }
            if (!Array.isArray(fields[key])) {
                if (fields[key] instanceof DynamicFormGroup) {
                    fields[key].object = fields[key].fields;
                    formGroupField.push(
                        fields[key]
                    );
                } else {
                    formGroupField.push(fields[key]);
                }
            }
            validationMetadatas.forEach(validationMetadata => {
                if (validationMetadata.propertyName === key) {
                    switch (validationMetadata.type) {
                        /*
                        case ValidationTypes.IS_NOT_EMPTY: {
                            formGroupField.push(Validators.required);
                            break;
                        }
                        case ValidationTypes.IS_EMAIL: {
                            formGroupField.push(Validators.required);
                            break;
                        }*/
                        default: {
                            for (const typeKey in ValidationTypes) {
                                if (ValidationTypes.hasOwnProperty(typeKey)) {
                                    if (
                                        validationMetadata.type === ValidationTypes[typeKey] &&
                                        validator[validationMetadata.type] === undefined &&
                                        validationMetadata.type === 'nestedValidation' &&
                                        typeKey === 'NESTED_VALIDATION'
                                    ) {
                                        const nestedValidate = function (c: FormControl) {
                                            const isValid = (c.parent && c.parent.value) ?
                                                validateSync(
                                                    c.value,
                                                    { validationError: { target: false } }
                                                ).length === 0 : true;
                                            return isValid ? null : {
                                                nestedValidate: {
                                                    valid: false,
                                                    type: validationMetadata.type
                                                }
                                            };
                                        };
                                        formGroupField.push(nestedValidate);
                                    }
                                    if (
                                        validationMetadata.type === ValidationTypes[typeKey] &&
                                        validator[validationMetadata.type] === undefined &&
                                        validationMetadata.type === 'customValidation' &&
                                        typeKey === 'CUSTOM_VALIDATION'
                                    ) {
                                        const customValidation = function (c: FormControl) {
                                            // todo: refactor
                                            const object = (c.parent instanceof DynamicFormGroup) ?
                                                (c.parent as DynamicFormGroup<any>).object :
                                                (c.parent ? c.parent.value : {});
                                            if (object) {
                                                object[key] = c.value;
                                            }
                                            const validateErrors = (c.parent && c.parent.value) ?
                                                validateSync(
                                                    object,
                                                    { validationError: { target: false } }
                                                ) : [];
                                            const isValid = validateErrors.filter((error: ValidationError) => {
                                                if (error.children.length &&
                                                    error.children.filter(children => children.property === key)) {
                                                    return true;
                                                }
                                                return true;
                                            }).length === 0;
                                            return isValid ? null : {
                                                customValidation: {
                                                    valid: false,
                                                    type: validationMetadata.type
                                                }
                                            };
                                        };
                                        formGroupField.push(customValidation);
                                    }
                                    if (
                                        validationMetadata.type === ValidationTypes[typeKey] &&
                                        validator[validationMetadata.type] !== undefined
                                    ) {
                                        const customValidate = function (c: FormControl) {
                                            if (!c) {
                                                return null;
                                            }
                                            const isValid = c.parent && c.parent.value ? validator[validationMetadata.type](c.value) : true;
                                            return isValid ? null : {
                                                customValidate: {
                                                    valid: false,
                                                    type: validationMetadata.type
                                                }
                                            };
                                        };
                                        formGroupField.push(customValidate);
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
            });
            if (formGroupField[0] instanceof DynamicFormGroup) {
                formGroupFields[key] = formGroupField[0];
            } else {
                formGroupFields[key] = [
                    formGroupField[0],
                    formGroupField.filter((item, index) => index !== 0)
                ];
            }
        });
        return formGroupFields;
    }

    private onlyFields(
        fields: {
            [key: string]: any
        }
    ) {
        const newFields = {};
        if (fields !== undefined) {
            Object.keys(fields).forEach(key => {
                if (fields[key] instanceof DynamicFormGroup) {
                    newFields[key] = this.onlyFields((fields[key] as DynamicFormGroup<any>).fields);
                } else {
                    newFields[key] = fields[key];
                }
            });
        }
        return newFields;
    }
    get object() {
        const object = this._object ? this.classToClass(this._object) : new this.factoryModel();
        if (object !== undefined) {
            Object.keys(this.controls).forEach(key => {
                if (this.controls[key] instanceof DynamicFormGroup) {
                    object[key] = (this.controls[key] as DynamicFormGroup<any>).value;
                } else {
                    object[key] = this.controls[key].value;
                }
            });
        }
        return this.plainToClass(this.factoryModel, object);
    }
    set object(object: TModel) {
        if (object instanceof this.factoryModel) {
            this._object = this.classToClass(object);
        } else {
            this._object = this.plainToClass(this.factoryModel, object as Object);
        }
        Object.keys(this.controls).forEach(key => {
            if (this.controls[key] instanceof DynamicFormGroup) {
                (this.controls[key] as DynamicFormGroup<any>).object = this._object ? this._object[key] : {};
            } else {
                this.controls[key].setValue(
                    (this._object && this._object[key]) ? this._object[key] : undefined
                );
            }
        });
    }
    private transformValidationErrors(errors: ValidationError[]) {
        const customErrors = {};
        errors.forEach((error: ValidationError) => {
            if (error.constraints !== undefined) {
                Object.keys(error.constraints).forEach(
                    (key: string) => {
                        if (!customErrors[error.property]) {
                            customErrors[error.property] = [];
                        }
                        if (customErrors[error.property].indexOf(error.constraints[key]) === -1) {
                            customErrors[error.property].push(error.constraints[key]);
                        }
                    }
                );
            }
            if (error.children !== undefined && error.children.length) {
                customErrors[error.property] = this.transformValidationErrors(error.children);
            }
        });
        return customErrors;
    }
    classToClass<TClassModel>(object: TClassModel) {
        return classToClass(object, { ignoreDecorators: true });
    }
    plainToClass<TClassModel, Object>(cls: ClassType<TClassModel>, plain: Object) {
        return plainToClass(cls, plain, { ignoreDecorators: true });
    }
    validate(otherErrors?: ValidationError[]) {
        if (otherErrors === undefined) {
            otherErrors = [];
        }
        const errors = validateSync(this.object, { validationError: { target: false } });
        this.customValidateErrors.next(
            this.transformValidationErrors(
                [...errors, ...otherErrors]
            )
        );
    }
    validateAllFormFields() {
        Object.keys(this.controls).forEach(field => {
            const control = this.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof DynamicFormGroup) {
                control.validateAllFormFields();
            }
        });
    }
}
