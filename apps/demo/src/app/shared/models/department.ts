import { IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type, plainToClassFromExist } from 'class-transformer';
import { Company } from './company';
import { serializeModel } from '../utils/custom-transforms';

export class Department {
    static strings = {
        id: 'Id',
        name: 'Name',
        company: 'Company'
    };
    static fields = ['id', 'name', 'company'];

    id: number;
    @IsNotEmpty()
    name: string = undefined;
    @ValidateNested()
    @IsOptional()
    @Type(serializeModel(Company))
    company: Company = new Company();

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
