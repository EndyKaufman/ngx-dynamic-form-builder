# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.2.2](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/v2.2.1...v2.2.2) (2022-06-26)


### Bug Fixes

* lock versions of deps ([f61029b](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/f61029b283b84f5b7a46214b8db97bc1b895e4c7))

### [2.2.1](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/v2.2.0...v2.2.1) (2022-02-19)

### Bug Fixes

- add check type of array, check for DynamicFormArray ([6e115a5](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/6e115a55a5ebb21e7f4916b4690ab75b26c465c0))
- setObject -- inconsistent behavior on FormArrays ([#195](https://github.com/EndyKaufman/ngx-dynamic-form-builder/issues/195)) ([767f540](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/767f5407ccd43f0f28fa4928550c5fd7666edc69))
- the initial value of formArrayLength is unused, since it is always overwritten ([569726f](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/569726fb8f7f67579e5fc11f7c13c992e2864c5f))

## [2.2.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/v2.1.0...v2.2.0) (2022-02-09)

### Features

- update deps ([e9da929](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/e9da9294415304cdc0c6ce629dfd3df2195e39a4))

### Bug Fixes

- add childFormGroup for work with nested FormArrays ([#192](https://github.com/EndyKaufman/ngx-dynamic-form-builder/issues/192)) ([c3bd0e2](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/c3bd0e228e68affdebffa34ca0245c66b46520fc))

## [2.1.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/v2.0.1...v2.1.0) (2022-01-30)

### Features

- add support native Angular validators ([#183](https://github.com/EndyKaufman/ngx-dynamic-form-builder/issues/183)), support correct work with isOptional ([#188](https://github.com/EndyKaufman/ngx-dynamic-form-builder/issues/188)), add excludeGroups for fix recursive errors and unexpected creation of submodels ([#185](https://github.com/EndyKaufman/ngx-dynamic-form-builder/issues/185)) ([d9d8c77](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/d9d8c77b2d8b1c6967448b0271279f6608cb3098))

### [2.0.1](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/v2.0.0...v2.0.1) (2022-01-23)

### Bug Fixes

- update readme ([f7f9ca3](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/f7f9ca3e3abf955a6c4425c679aaa5c216d4c5e8))

## 2.0.0 (2022-01-23)

### ⚠ BREAKING CHANGES

- Version above 2 has a completely rewritten code, partially backwards compatible

Now `@Expose` and `@Exclude` decorators are used to define model fields, the new version is rigidly dependent on class-transform

Dependencies are not used original, but forks with additional necessary properties, when using this library, you need to replace all original imports with forks with modifications

Fork [class-validator-multi-lang](https://github.com/EndyKaufman/class-validator-multi-lang) - adds translation capability for errors (PR:[https://github.com/typestack/class-validator/pull/743](https://github.com/typestack/class-validator/pull/743))

Fork [class-transformer-global-storage](https://github.com/petrzjunior/class-transformer) - adds the ability to get meta information about all used classes (PR:[https://github.com/typestack/class-transformer/pull/929](https://github.com/typestack/class-transformer/pull/929))

For correct parse metadata, need remove `compilerOptions.downlevelIteration` and append `compilerOptions.emitDecoratorMetadata: true` in `tsconfig.json`

### Features

- rewrite all project ([b5c4831](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/b5c4831e1cf485e72c280e4b0327fd299fb310c1))

# [1.12.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.11.0...1.12.0) (2021-01-16)

### Features

- update source for new deps ([1a8ee79](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/1a8ee796c4600f80dac944adc58f858b19a28166))
- update to Angular 11 ([def7793](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/def7793ccf9369a874593aa3f469b1d79aff5e8a))

# [1.11.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.10.1...1.11.0) (2020-09-21)

### Bug Fixes

- chnage priority of validator options on run validate ([2105da5](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/2105da500377b9b776816ed6a6ccf771820d4608))
- update dependencies ([6518784](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/65187844f4c601b150910efabd0a25e91fd9571f))
- update detect logic object property value in ExposeNested ([63b6445](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/63b64455692898f9e5bf824dd76824cc45c09cdf))

### Features

- add classTransformToPlainOptions for custom logic in convert to object to class, add decorator ExposeNested ([bce8fb8](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/bce8fb89c54a1a79d90a7a0c77ca24a516b08472))
- change all private methods and fields to protected for extends and customization ([bf81463](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/bf814631424b28268881f054a6c720cf61e7411b))

## [1.10.1](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.10.0...1.10.1) (2020-09-17)

### Bug Fixes

- remove ignoreDecorators from transform objects ([d8cbeda](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/d8cbedab69250bbe6cf1f2cb2ea74f93b2ecb1a5))

# [1.10.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.9.1...1.10.0) (2020-09-16)

### Features

- add factoryFormBuilder for customizations, add classValidatorOptions and classTransformOptions to DynamicFormBuilderOptions for set base options for all groups ([5b2dd39](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/5b2dd398c1c28298392e1a9689a3c6e241a18fbc))
- add options on constructor in DynamicFormBuilder for use custom dynamic form group ([5befeab](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/5befeab1c736a35e2e2f75f9d7733757a34655b3))
- add serialize from/to json ([0ca3a22](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/0ca3a22100284a0493d3a05637ecc2bbf18eff84))
- add validateAllFormFields for builder and form group options for force run validate after create form group ([08ba24a](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/08ba24a8130b6417c91520c679fadd1c368f43e6))
- improved performance by disabling unnecessary class transformations ([e61c39e](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/e61c39efe4110d36e8c145c4de2033a6e9131a81))

## [1.9.1](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.9.0...1.9.1) (2020-09-14)

### Bug Fixes

- add cloneDeep for argumentValidatorOptions on receive ([86723c4](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/86723c44ffb45f60d92c9e55495e0d9abb9d1e4b))

# [1.9.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.8.0...1.9.0) (2020-09-13)

### Features

- rename customValidatorOptions to classValidatorOptions, add support change messages and titles on run time with set validatorOptions ([aaf9c78](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/aaf9c7820a2b26d88317f1fbbcbf8d5735371662))

# [1.8.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.7.0...1.8.0) (2020-09-11)

### Bug Fixes

- add support set nested object to undefined, update deps ([6c7fa3c](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/6c7fa3c993f21c8cbf1a686c6e9bbdc467c57790))

### Features

- add support translate title of properties in validation errors ([dbba241](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/dbba241203103dad8972612de43f0e12a9d13488))

# [1.7.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.6.1...1.7.0) (2020-09-09)

### Features

- change class-validator to class-validator-multi-lang for support i18n ([df0eab4](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/df0eab4f48f40d64c6e2ac0e5c297e23b0d13bc4))
- support errors messages switching between languages, ​​in runtime ([ca623c4](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/ca623c4b14729ed01e95ad8d5eeb6be5601e7162))

## [1.6.1](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.6.0...1.6.1) (2020-08-14)

### Bug Fixes

- **docs:** update version of Angular ([08d704a](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/08d704aae6820d9e56529a9e2a66578830861170))

# [1.6.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.5.4...1.6.0) (2020-08-14)

### Features

- update deps (Angular 10) ([090b85b](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/090b85bc510218b64b219499fad5ff0e09737ec8))

## [1.5.4](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.5.3...1.5.4) (2020-05-20)

### Bug Fixes

- add hash function for calculate hache add validation ([7fb2be3](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/7fb2be33fc6462f27c3e55567ce0729925e6a667))
- speed up on work with short version of model ([892ba43](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/892ba43c253020288e9f8bf9b714b1cd4de8cabc))

## [1.5.3](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.5.2...1.5.3) (2020-05-18)

### Bug Fixes

- add check not exists control ([90437e3](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/90437e36d793f0e5941e1dae6547d00ff9cdf260))

## [1.5.2](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.5.1...1.5.2) (2020-05-18)

### Bug Fixes

- change validators to "synchorical" type and small optimizations for GC ([54308fc](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/54308fc9c370386bfb32fb7eec02373b95859ab8))

## [1.5.1](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.5.0...1.5.1) (2020-05-04)

### Bug Fixes

- add ignore error on try get value from not exists control ([39a0773](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/39a07738d9fa6be93cf7c282e79ec054b7bedd7b))

# [1.5.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.4.0...1.5.0) (2020-05-04)

### Bug Fixes

- remove class-transformer and class-validator from production dependencies ([445b3bc](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/445b3bccd8e4375bf28630e79894f17c94b5cd89))

### Features

- update dependencies ([920fc2d](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/920fc2d65e0790d97d6c602cef1ece9378c56b65))
- update for correct work new version of class-validator ([f7da8dd](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/f7da8ddb20e964607eecc50db9cf439fb4561c73))

# [1.4.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.3.0...1.4.0) (2020-04-14)

### Bug Fixes

- add support for conditional validations ([9c738a9](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/9c738a98686e59aa2c4f3e8e2730e4871e33984e))
- update for correct support conditional validations ([1c0e744](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/1c0e7449b6244f92c07ae87a0ca03e6b4a8f37da))

### Features

- update dependencies and fix sources for it ([6daff8e](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/6daff8ef62e03c140b33ae321975c54069c80a8e))

# [1.3.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.2.0...1.3.0) (2020-03-19)

### Bug Fixes

- add unsubscribe from subscribe to form group changes, change transform class validator to usage async angular validator ([59270ba](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/59270ba8b50a80cea7a9aa48d213ee94ee6a2549))

### Features

- add control name to DynamicFormControl ([a033091](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/a033091f98f5296a248c7be567bf553790e8a1ff))

# [1.2.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.1.0...1.2.0) (2020-03-12)

### Features

- update dependencies ([5946cf5](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/5946cf5b06f414eeaa79246a1871250b4a3f7dbd))
- update deps ([de6e549](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/de6e5497ee0df88eb62c82120c3fe5eeb61a4c74))

# [1.1.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/1.0.0...1.1.0) (2020-02-11)

### Features

- update for new tslint and tsconfig rules ([3de5c31](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/3de5c3164d0e6a74011cb6bdc14fa33f19f7ad15))
- update versions of deps ([3ab7069](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/3ab70699d659640121feb4a2e465a80d1f5760a8))

# [1.0.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.10.1...1.0.0) (2019-05-04)

### Bug Fixes

- Change private transformValidationErrors to public ([f80e6e9](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/f80e6e9))

### Features

- Add method resetValidateAllFormFields to reset all errors ([8642886](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/8642886))
- Add support use native angular validations, create sample for it - combo ([fd48f90](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/fd48f90))

## [0.10.1](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.10.0...0.10.1) (2019-05-04)

### Bug Fixes

- Add use standalone lodash.clonedeep and lodash.mergewith in lib ([d38198d](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/d38198d))

# [0.10.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.9.0...0.10.0) (2019-05-03)

### Bug Fixes

- Update dependencies ([3c88ce1](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/3c88ce1))

### Features

- Add support classLevelValidator with native angular validators and update sample for it ([#106](https://github.com/EndyKaufman/ngx-dynamic-form-builder/issues/106), [#107](https://github.com/EndyKaufman/ngx-dynamic-form-builder/issues/107)) ([26ee044](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/26ee044))

# [0.9.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.8.1...0.9.0) (2019-01-21)

### Bug Fixes

- Ivalidate formGroup if founded any castomValidationErrors ([26a26ec](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/26a26ec))

### Features

- Add objectChange event on update with set object ([62e05d8](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/62e05d8))

## [0.8.1](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.8.0...0.8.1) (2019-01-12)

### Bug Fixes

- **dynamic-form-group:** Refactor isValid detect in createCustomValidation ([49871c5](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/49871c5))
- Set value from control on createNestedValidate if it ([6dc9c1c](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/6dc9c1c))

# [0.8.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.7.0...0.8.0) (2019-01-12)

### Bug Fixes

- Revert to original getClassValidators for correct validate arrays and refactor code more readable ([bf296c3](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/bf296c3))
- **dynamic-form-group:** Fix test error due to recursive types ([87bfee8](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/87bfee8))

### Features

- **dynamic-form-control:** Add validation definitions to form controls ([8cbb9a2](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/8cbb9a2))
- **dynamic-form-group:** Group type safety ([f183e49](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/f183e49))
- **dynamic-form-group:** Implement a non-observable error API ([ac713c8](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/ac713c8))

# [0.7.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.6.1...0.7.0) (2018-12-30)

### Features

- Change externalErrors and validatorOptions with getter and setter to functions: setExternalErrorsAsync, setExternalErrors, clearExternalErrorsAsync, clearExternalErrors and setValidatorOptionsAsync, setValidatorOptions ([e256c0f](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/e256c0f))

## [0.6.1](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.6.0...0.6.1) (2018-12-21)

### Bug Fixes

- Update transformValidationErrors for correct output errors for array ([e526426](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/e526426))

# [0.6.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.5.1...0.6.0) (2018-12-21)

### Bug Fixes

- Wrong work with exists nested exeperimental sample ([#74](https://github.com/EndyKaufman/ngx-dynamic-form-builder/issues/74)) ([407b9de](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/407b9de))

### Features

- Add support bind class validator to array controls and array form groups ([#74](https://github.com/EndyKaufman/ngx-dynamic-form-builder/issues/74), [#75](https://github.com/EndyKaufman/ngx-dynamic-form-builder/issues/75)) ([90f8c3e](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/90f8c3e))

## [0.5.1](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.5.0...0.5.1) (2018-12-10)

### Bug Fixes

- Update dependencies ([db8c595](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/db8c595))

# [0.5.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.4.4...0.5.0) (2018-11-17)

### Features

- **deps:** Update dependencies ([65913d1](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/65913d1))

<a name="0.4.4"></a>

## [0.4.4](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.4.3...0.4.4) (2018-09-16)

### Bug Fixes

- **deps:** Update dependencies ([5833025](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/5833025))

<a name="0.4.3"></a>

## [0.4.3](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.4.2...0.4.3) (2018-06-18)

### Bug Fixes

- **dynamic-form-group:** Fix validators that expect more than one argument and fix work with conditional validations [#36](https://github.com/EndyKaufman/ngx-dynamic-form-builder/issues/36) ([30a0a6c](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/30a0a6c))

<a name="0.4.2"></a>

## [0.4.2](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.4.1...0.4.2) (2018-06-06)

### Bug Fixes

- Add whitelistedNonPeerDependencies in ng-package.json ([06fdac7](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/06fdac7))

<a name="0.4.1"></a>

## [0.4.1](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.4.0...0.4.1) (2018-06-05)

### Bug Fixes

- Add needed deps to devDependencies ([540e775](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/540e775))

<a name="0.4.0"></a>

# [0.4.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.3.2...0.4.0) (2018-06-03)

### Bug Fixes

- **sw:** Update path for ngsw-worker.js ([0491271](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/0491271))

### Features

- Update to Angular 6 and Rx 6 ([f600e3c](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/f600e3c))

<a name="0.3.2"></a>

## [0.3.2](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.3.1...0.3.2) (2018-03-23)

### Bug Fixes

- **dynamic-form-group:** Change code for correct work with externalErrors (renamed from otherErrors) ([087772b](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/087772b))

<a name="0.3.1"></a>

## [0.3.1](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.3.0...0.3.1) (2018-03-09)

### Bug Fixes

- **dynamic-form-builder:** Add ValidatorOptions for nested objects validations ([95b4dfd](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/95b4dfd))

<a name="0.3.0"></a>

# [0.3.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.2.1...0.3.0) (2018-03-09)

### Features

- **dynamic-form-builder:** Add support use ValidatorOptions ([57ac15a](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/57ac15a))

<a name="0.2.1"></a>

## [0.2.1](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.2.0...0.2.1) (2018-03-01)

### Bug Fixes

- **dynamic-form-group:** Change return object type for nested object if it type is DynamicFormGroup ([8bb303e](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/8bb303e))

<a name="0.2.0"></a>

# [0.2.0](https://github.com/EndyKaufman/ngx-dynamic-form-builder/compare/0.1.0...0.2.0) (2018-02-28)

### Bug Fixes

- **dynamic-form-group:** Remove hard dependencies of class-transformer, for use alternative class mapper using the decorators ([8aff1c4](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/8aff1c4))

### Features

- **dynamic-form-group:** Added method classToClass and plainToClass to override and customize transformation algorithm ([734f9ea](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/734f9ea))

<a name="0.1.0"></a>

# 0.1.0 (2018-02-28)

### Bug Fixes

- Change form.object update method ([417a533](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/417a533))
- **dynamic-form-builder:** Divided the old method and the experimental by the optional controlsConfig attr ([928a908](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/928a908))
- **scripts:** Update for correct build ([30f53b5](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/30f53b5))

### Features

- **dynamic-form-group:** controlsConfig set to optional in method "group" ([811b824](https://github.com/EndyKaufman/ngx-dynamic-form-builder/commit/811b824))
