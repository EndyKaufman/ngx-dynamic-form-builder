import { Type, plainToClassFromExist } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { serializeModel } from '../utils/custom-transforms';
import { Company } from './company';

export class Department {
    static strings = {
        id: 'Id',
        name: 'Name',
        company: 'Company'
    };
    static fields = ['id', 'name', 'company'];

    id: number;
    @IsNotEmpty()
    name: string;
    @ValidateNested()
    @IsOptional()
    @Type(serializeModel(Company))
    company: Company;

    toString() {
        return this.name;
    }

    constructor(data?: any) {
        plainToClassFromExist(this, data);
    }
}
