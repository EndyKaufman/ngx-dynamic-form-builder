import { IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type, plainToClassFromExist } from 'class-transformer';
import { Company } from './company';
import { serializeModel } from '../utils/custom-transforms';

export class Department {
    static strings = {
        id: 'Id',
        name: 'Name',
        company: 'Company',
        companyStrings: Company.strings,
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
        const arr: string[] = [];
        if (arr.length === 0 && this.name) {
            arr.push(this.name);
        }
        return arr.join(' ');
    }

    constructor(data?: any) {
        plainToClassFromExist(this, data);
    }
}
