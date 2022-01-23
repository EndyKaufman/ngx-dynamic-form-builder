import { marker } from '@ngneat/transloco-keys-manager/marker';
import { Expose } from 'class-transformer-global-storage';
import {
  IsNotEmpty,
  IsOptional,
  Max,
  MaxLength,
  Min,
  Validate,
} from 'class-validator-multi-lang';
import { ExposeNested } from 'ngx-dynamic-form-builder';
import { TextLengthMore15 } from '../utils/custom-validators';

export class ComboCompany {
  static strings = {
    id: marker('Id'),
    name: marker('Name'),
    regionNum: marker('Region num'),
  };

  @Expose()
  id: number | undefined;

  @Validate(TextLengthMore15, {
    message: marker('The company name must be longer than 15'),
  })
  @IsNotEmpty()
  @MaxLength(20)
  @Expose()
  name: string | undefined;

  @ExposeNested()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nameLocale: any;

  @IsOptional()
  @Min(1)
  @Max(99)
  @Expose()
  regionNum: number | undefined;

  toString() {
    const arr: string[] = [];
    if (arr.length === 0 && this.name) {
      arr.push(this.name);
    }
    return arr.join(' ');
  }
}
