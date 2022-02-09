import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { marker } from '@ngneat/transloco-keys-manager/marker';
import { Expose, Type } from 'class-transformer-global-storage';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  Validate,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator-multi-lang';
import {
  DeepPartial,
  DynamicFormBuilder,
  DynamicFormGroup,
  getCustomDataToRootFormGroup,
  getDynamicControlOptions,
  setCustomDataToRootFormGroup,
  setGlobalDynamicFormBuilderOptions,
  ValidateIfUpdater,
} from 'ngx-dynamic-form-builder';
import { Subject } from 'rxjs';

@ValidatorConstraint({ async: true })
export class AsyncMustIncludeWordDep implements ValidatorConstraintInterface {
  validate(value: string, validationArguments?: ValidationArguments) {
    const dynamicFormBuilderOptions = getDynamicControlOptions(
      validationArguments?.object
    );
    if (
      value &&
      dynamicFormBuilderOptions?.metadata.parent?.classType === Department &&
      dynamicFormBuilderOptions?.metadata.propertyName === 'name'
    ) {
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          const result = (value as string).toLowerCase().includes('dep');
          setCustomDataToRootFormGroup(
            dynamicFormBuilderOptions.control,
            AsyncMustIncludeWordDep.name,
            result
          );
          resolve(result);
        }, 300);
      });
    }
    return Promise.resolve(
      getCustomDataToRootFormGroup(
        dynamicFormBuilderOptions?.control,
        AsyncMustIncludeWordDep.name,
        true
      )
    );
  }
}

export class Group {
  @Expose()
  id?: number;

  @IsNotEmpty()
  @Expose()
  name?: string;
}

export class Company {
  @Expose()
  id?: number;

  @IsNotEmpty()
  @Expose()
  name!: string;

  @ValidateIfUpdater(
    (controlPath: string, value: string, rootFormGroup: AbstractControl) => {
      if (controlPath === 'company.country') {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const stateControl = rootFormGroup.get('company')!.get('state')!;
        stateControl.setValue(stateControl.value);
        return true;
      }
      return false;
    }
  )
  @IsOptional()
  @Expose()
  country?: string;

  @ValidateIf((object: Company) => Boolean(object.country))
  @IsNotEmpty()
  @Expose()
  state!: string;

  @IsNotEmpty()
  @Expose()
  house!: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ each: true })
  @Expose()
  permissions?: boolean[];

  @ValidateNested()
  @Type(() => Department)
  @Expose({ groups: ['nested'] })
  department?: Department | undefined;
}

export class PeopleAgeSubProp {
  @IsNotEmpty()
  @Expose()
  subProp!: string;
}

export class PeopleAge {
  @IsNumberString()
  @IsNotEmpty()
  @Expose()
  age!: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => PeopleAgeSubProp)
  @Expose()
  peopleAgeSubProps?: PeopleAgeSubProp[];
}

export enum TransportTypeEnum {
  car = 'car',
  airplane = 'airplane',
}

export abstract class Transport {
  @IsEnum(TransportTypeEnum)
  @IsNotEmpty()
  @Expose()
  type?: TransportTypeEnum;

  @IsNotEmpty()
  @Expose()
  transportNumber!: string;
}

export class Car extends Transport {
  @IsEnum(TransportTypeEnum)
  @IsNotEmpty()
  @Expose()
  override type!: TransportTypeEnum.car;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  numberOfWheels!: number;
}
export class Airplane extends Transport {
  @IsEnum(TransportTypeEnum)
  @IsNotEmpty()
  @Expose()
  override type!: TransportTypeEnum.airplane;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  numberOfTurbines!: number;
}

export class Department {
  @Expose()
  id?: number;

  @IsNotEmpty()
  @Expose()
  @Validate(AsyncMustIncludeWordDep, {
    message: marker('must include word "dep" (async validate)'),
  })
  name!: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => Group)
  @Expose()
  groups?: Group[];

  @ValidateNested()
  @Type(() => Company)
  @Expose()
  company?: Company;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @Expose()
  cabinets?: number[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => PeopleAge)
  @Expose()
  peopleAges?: PeopleAge[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => Transport, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: Airplane, name: TransportTypeEnum.airplane },
        { value: Car, name: TransportTypeEnum.car },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  @Expose()
  transports?: (Airplane | Car)[];
}

@Component({
  selector: 'ngx-dynamic-form-builder-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  form: DynamicFormGroup<Department>;

  TransportTypeEnum = TransportTypeEnum;
  transportTypeEnumKeys = Object.keys(
    TransportTypeEnum
  ) as (keyof typeof TransportTypeEnum)[];

  formBuilder = new DynamicFormBuilder();

  savedItem$ = new Subject<Department | undefined>();

  constructor() {
    this.form = this.formBuilder.rootFormGroup(
      Department,
      this.getEmptyDepartment(),
      {
        classTransformOptions: {
          excludeGroups: ['nested'],
        },
      }
    );
    console.log(this.form);
  }

  //

  setLocalPropertyText() {
    this.form.patchDynamicFormBuilderOptions({
      classValidatorOptions: { titles: { name: 'имя' } },
    });
  }

  setGlobalPropertyText() {
    setGlobalDynamicFormBuilderOptions({
      classValidatorOptions: { titles: { name: 'исем' } },
    });
  }

  restoreGlobalPropertyText() {
    setGlobalDynamicFormBuilderOptions({
      classValidatorOptions: { titles: { name: 'name' } },
    });
  }

  onLoadClick(): void {
    this.form.json = this.getExampleDepartment() as Department;
    console.log(this.form);
  }

  setExternalErrors() {
    this.form.externalErrors = {
      company: { children: { state: { messages: ['hoi'] } } },
    };
  }

  unsetExternalErrors() {
    this.form.externalErrors = {};
  }

  onClearClick(): void {
    this.savedItem$.next(undefined);

    this.form.json = this.getEmptyDepartment() as Department;
    console.log(this.form);
  }

  onSaveClick(): void {
    if (this.form.valid) {
      this.savedItem$.next(this.form.json);
    } else {
      this.savedItem$.next(undefined);
    }
  }

  //

  private getExampleDepartment(): DeepPartial<Department> {
    return {
      id: 11,
      name: 'dep name 1',
      company: {
        id: 22,
        name: 'comp name 1',
        country: 'USA',
        state: 'California',
        house: '221b',
        permissions: [true, false],
        department: { name: 'name' },
      },
      groups: [
        { id: 33, name: 'group name 1' },
        { id: 44, name: 'group name 2' },
      ],
      cabinets: [55, 66],
      peopleAges: [{ age: '18', peopleAgeSubProps: [{ subProp: 'sub' }] }],
      transports: [
        {
          type: TransportTypeEnum.car,
          transportNumber: 'DMC-12',
          numberOfWheels: 4,
        },
        {
          type: TransportTypeEnum.airplane,
          transportNumber: 'Boeing 737',
          numberOfTurbines: 2,
        },
      ],
    };
  }

  private getEmptyDepartment(): DeepPartial<Department> {
    return {
      name: '',
      company: {
        name: '',
        country: '',
        state: '',
        house: '',
        permissions: [],
      },
      cabinets: [],
      peopleAges: [],
      transports: [],
    } as DeepPartial<Department>;
  }

  // permissions

  get permissions() {
    return (this.form.get('company') as DynamicFormGroup).controls[
      'permissions'
    ] as FormArray;
  }

  savePermission(index: number, permission: boolean | string) {
    this.permissions
      .get(index.toString())
      ?.setValue(
        permission === 'true' || permission === 'false'
          ? permission === 'true'
          : permission
      );
  }

  addPermission(permission: boolean | string) {
    this.permissions.push(
      this.formBuilder.control(
        permission === 'true' || permission === 'false'
          ? permission === 'true'
          : permission
      )
    );
    this.form.refresh();
  }

  deletePermission(cabinetIndex: number) {
    this.permissions.removeAt(cabinetIndex);
  }

  // cabinets

  get cabinets() {
    return this.form.controls['cabinets'] as FormArray;
  }

  saveCabinet(index: number, num: number | string) {
    this.cabinets
      .get(index.toString())
      ?.setValue(num === '' || isNaN(+num) ? num : +num);
  }

  addCabinet(num: number | string) {
    this.cabinets.push(
      this.formBuilder.control(num === '' || isNaN(+num) ? num : +num)
    );
    this.form.refresh();
  }

  deleteCabinet(cabinetIndex: number) {
    this.cabinets.removeAt(cabinetIndex);
  }

  // peopleAges

  get peopleAges() {
    return this.form.controls['peopleAges'] as FormArray;
  }

  savePeopleAge(index: number, peopleAge: PeopleAge) {
    this.peopleAges.get(index.toString())?.setValue(peopleAge);
  }

  addPeopleAge(peopleAge: PeopleAge) {
    this.peopleAges.push(
      this.formBuilder.childFormGroup(this.form, PeopleAge, peopleAge)
    );
    this.form.refresh();
    console.log(this.form);
  }

  deletePeopleAge(peopleAgeIndex: number) {
    this.peopleAges.removeAt(peopleAgeIndex);
  }

  // transports

  get transports() {
    return this.form.controls['transports'] as FormArray;
  }

  saveTransport(index: number, transport: Airplane | Car) {
    if (transport.type === TransportTypeEnum.airplane) {
      transport.numberOfTurbines =
        !transport.numberOfTurbines || isNaN(+transport.numberOfTurbines)
          ? transport.numberOfTurbines
          : +transport.numberOfTurbines;
      this.transports
        .get(index.toString())
        ?.setValue({ ...transport, numberOfWheels: '' });
    }
    if (transport.type === TransportTypeEnum.car) {
      transport.numberOfWheels =
        !transport.numberOfWheels || isNaN(+transport.numberOfWheels)
          ? transport.numberOfWheels
          : +transport.numberOfWheels;
      this.transports
        .get(index.toString())
        ?.setValue({ ...transport, numberOfTurbines: '' });
    }
  }

  addTransport(transport: Airplane | Car) {
    if (transport.type === TransportTypeEnum.airplane) {
      transport.numberOfTurbines =
        !transport.numberOfTurbines || isNaN(+transport.numberOfTurbines)
          ? transport.numberOfTurbines
          : +transport.numberOfTurbines;
      this.transports.push(this.formBuilder.group(transport));
      this.form.refresh();
    }
    if (transport.type === TransportTypeEnum.car) {
      transport.numberOfWheels =
        !transport.numberOfWheels || isNaN(+transport.numberOfWheels)
          ? transport.numberOfWheels
          : +transport.numberOfWheels;
      this.transports.push(this.formBuilder.group(transport));
      this.form.refresh();
    }
    console.log(this.form);
  }

  deleteTransport(index: number) {
    this.transports.removeAt(index);
  }
}
