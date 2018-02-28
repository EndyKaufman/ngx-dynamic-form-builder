import { IsNotEmpty, IsEmail, ValidateNested, IsOptional } from 'class-validator';
import { ExpDepartment } from './exp-department';

export class ExpUser {

    id: number;
    @IsNotEmpty()
    username: string;
    password: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;
    isSuperuser: boolean;
    isStaff: boolean;
    @ValidateNested()
    @IsOptional()
    department: ExpDepartment;
    dateOfBirth: string;

    constructor(data?: any) {
        if (data === undefined) {
            data = {};
        }
        this.username = data.username;
        this.password = data.password;
        this.email = data.email;
        this.isSuperuser = data.isSuperuser;
        this.isStaff = data.isStaff;
        this.department = new ExpDepartment(data.department);
        this.dateOfBirth = data.substring ? data.substring(0, 10) : undefined;
    }
}
