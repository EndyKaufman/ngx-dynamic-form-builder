import { Validate, IsNotEmpty } from 'class-validator';
import { TextLengthMore15 } from '../utils/custom-validators';

export class ExpCompany {

    id: number;
    @Validate(TextLengthMore15, {
        groups: ['user'],
        message: 'The company name must be longer than 15'
    })
    @IsNotEmpty({
        groups: ['user']
    })
    name: string;

    constructor(data?: any) {
        if (data === undefined) {
            data = {};
        }
        this.name = data.name;
    }
}
