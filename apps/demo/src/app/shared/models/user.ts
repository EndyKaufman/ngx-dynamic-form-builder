import { Transform, Type, plainToClassFromExist } from 'class-transformer';
import { IsNotEmpty, IsEmail, ValidateNested, IsOptional } from 'class-validator';
import { Department } from './department';
import { serializeModel, transformStringToDate, transformDateToString } from '../utils/custom-transforms';

export class User {
    static strings = {
        id: 'Id',
        username: 'Username',
        password: 'Password',
        isSuperuser: 'Administrator',
        isStaff: 'Staff',
        email: 'Email',
        department: 'Department',
        dateOfBirth: 'Date of birth'
    };
    static fields = ['id', 'username', 'password', 'isSuperuser',
        'isStaff', 'email', 'department', 'dateOfBirth'];

    id: number;
    @IsNotEmpty()
    username: string = undefined;
    password: string = undefined;
    @IsEmail()
    @IsNotEmpty()
    email: string = undefined;
    isSuperuser: boolean = undefined;
    isStaff: boolean = undefined;
    @ValidateNested()
    @IsOptional()
    @Type(serializeModel(Department))
    department: Department = new Department();
    @Transform(transformStringToDate, { toClassOnly: true })
    @Transform(transformDateToString, { toPlainOnly: true })
    dateOfBirth: string = undefined;

    toString() {
        const arr: string[] = [];
        if (arr.length === 0 && this.username) {
            arr.push(this.username);
        }
        return arr.join(' ');
    }

    constructor(data?: any) {
        plainToClassFromExist(this, data);
    }
}
