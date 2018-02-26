import { Validate, IsNotEmpty } from 'class-validator';
import { plainToClassFromExist } from 'class-transformer';
import { TextLengthMore15 } from '../utils/custom-validators';

export class Company {
    static strings = {
        id: 'Id',
        name: 'Name'
    };
    static fields = ['id', 'name'];

    id: number;
    @Validate(TextLengthMore15, {
        message: 'The company name must be longer than 15'
    })
    @IsNotEmpty()
    name: string;

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
