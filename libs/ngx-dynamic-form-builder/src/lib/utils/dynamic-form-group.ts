import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { classToClass, plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import {
    MetadataStorage, ValidationError, ValidationTypes, Validator,
    ValidatorOptions, getFromContainer, validateSync
} from 'class-validator';
import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata';
import { cloneDeep, mergeWith } from 'lodash-es';
import 'reflect-metadata';
import { BehaviorSubject } from 'rxjs';
export interface IShortValidationErrors { [key: string]: string[] | IShortValidationErrors; }
export class DynamicFormGroup<TModel> extends FormGroup {
    set externalErrors(externalErrors: IShortValidationErrors) {
        this._externalErrors = externalErrors;
        this.validate();
    }
    get externalErrors(): IShortValidationErrors {
        return this._externalErrors;
    }
    set validatorOptions(validatorOptions: ValidatorOptions) {
        this._validatorOptions = validatorOptions;
        this.validate();
    }
    get validatorOptions(): ValidatorOptions {
        return this._validatorOptions;
    }
    customValidateErrors = new BehaviorSubject<IShortValidationErrors>({});
    private _object: TModel;
    private _externalErrors: IShortValidationErrors;
    private _validatorOptions: ValidatorOptions;
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
        },
        validatorOptions?: ValidatorOptions
    ) {
        const validationMetadatas: ValidationMetadata[] =
            getFromContainer(MetadataStorage).getTargetValidationMetadatas(
                factoryModel,
                '',
                validatorOptions && validatorOptions.groups ? validatorOptions.groups : undefined
            );
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
                                                    validatorOptions
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
                                                    validatorOptions
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
                                            const isValid = c.parent && c.parent.value ? validator.validateValueByMetadata(c.value, validationMetadata) : true;
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
                    object[key] = (this.controls[key] as DynamicFormGroup<any>).object;
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
    private transformValidationErrors(errors: ValidationError[]): IShortValidationErrors {
        const customErrors: IShortValidationErrors = {};
        errors.forEach((error: ValidationError) => {
            if (error && error.constraints !== undefined) {
                Object.keys(error.constraints).forEach(
                    (key: string) => {
                        if (!customErrors[error.property]) {
                            customErrors[error.property] = [];
                        }
                        if ((customErrors[error.property] as string[]).indexOf(error.constraints[key]) === -1) {
                            (customErrors[error.property] as string[]).push(error.constraints[key]);
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
    private mergeErrors(errors?: IShortValidationErrors, externalErrors?: IShortValidationErrors) {
        return mergeWith(errors, externalErrors, (objValue, srcValue) => {
            if (
                Array.isArray(objValue) &&
                Array.isArray(srcValue) &&
                objValue.filter(objItem => srcValue.indexOf(objItem) !== -1).length === 0
            ) {
                return objValue.concat(srcValue);
            }
        });
    }
    validate(externalErrors?: IShortValidationErrors, validatorOptions?: ValidatorOptions) {
        if (externalErrors === undefined) {
            externalErrors = cloneDeep(this.externalErrors);
        }
        if (validatorOptions === undefined) {
            validatorOptions = cloneDeep(this.validatorOptions);
        }
        if (!externalErrors) {
            externalErrors = {};
        }
        const errors = validateSync(this.object, validatorOptions);
        const transformedErrors = this.transformValidationErrors(errors);
        const allErrors = this.mergeErrors(externalErrors, transformedErrors);
        this.markAsInvalidForExternalErrors(externalErrors, this.controls);
        this.customValidateErrors.next(allErrors);
    }
    private markAsInvalidForExternalErrors(errors: IShortValidationErrors, controls: {
        [key: string]: AbstractControl;
    }) {
        Object.keys(controls).forEach(field => {
            const control = controls[field];
            if (control instanceof FormControl) {
                if (errors && errors[field]) {
                    control.setErrors({ 'externalError': true });
                } else {
                    if (control.errors && control.errors.externalError === true) {
                        control.setErrors(null);
                    }
                }
            } else if (control instanceof DynamicFormGroup) {
                control.markAsInvalidForExternalErrors(
                    errors && errors[field] ? errors[field] as IShortValidationErrors : {},
                    control.controls
                );
            }
        });
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
