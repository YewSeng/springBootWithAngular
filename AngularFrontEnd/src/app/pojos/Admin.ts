import { Role } from './Role';
import { UserBase } from './UserBase';

export class Admin implements UserBase {
    id?: string;
    firstName?: string;
    lastName?: string;
    mobileNumber?: string;
    email?: string;
    username?: string;
    password?: string;
    registrationDate?: Date; 
    role?: Role = Role.ADMIN;

    constructor(
        firstName: string,
        lastName: string,
        mobileNumber: string,
        email: string,
        username: string,
        password: string,
        registrationDate: Date,
        role?: Role, 
    ) 
    {
        this.firstName = firstName;
        this.lastName = lastName;
        this.mobileNumber = mobileNumber;
        this.email = email;
        this.username = username;
        this.password = password;
        this.registrationDate = registrationDate;
        this.role = role || Role.ADMIN;
    }
}
