import { Role } from './Role';
import { CabType } from './CabType';
import { Booking } from './Booking';
import { UserBase } from './UserBase';

export class Driver implements UserBase {
    id?: string;
    firstName?: string;
    lastName?: string;
    mobileNumber?: string;
    email?: string;
    username?: string;
    password?: string;
    registrationDate?: Date; 
    role?: Role = Role.DRIVER;
    vehicleType?: CabType;
    carBrand?: string;
    carColor?: string;
    bookings?: Booking[];

    constructor(
        firstName: string,
        lastName: string,
        mobileNumber: string,
        email: string,
        username: string,
        password: string,
        vehicleType: CabType,
        carBrand: string,
        carColor: string,
        registrationDate: Date,
        role?: Role, 
        bookings?: Booking[]
    ) 
    {
        this.firstName = firstName;
        this.lastName = lastName;
        this.mobileNumber = mobileNumber;
        this.email = email;
        this.username = username;
        this.password = password;
        this.vehicleType = vehicleType;
        this.carBrand = carBrand;
        this.carColor = carColor;
        this.registrationDate = registrationDate;
        this.role = role || Role.DRIVER;
        this.bookings = bookings || [];
    }
}
