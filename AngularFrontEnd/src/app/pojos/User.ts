import { Role } from './Role';
import { CabType } from './CabType';
import { Booking } from './Booking';
import { UserBase } from './UserBase';

export class User implements UserBase {
    id?: string;
    firstName?: string;
    lastName?: string;
    mobileNumber?: string;
    email?: string;
    username?: string;
    password?: string;
    registrationDate?: Date;
    role?: Role = Role.USER;
    preferences?: CabType;
    bookings?: Booking[];
  
    constructor(
      firstName: string,
      lastName: string,
      mobileNumber: string,
      email: string,
      username: string,
      password: string,
      preferences: CabType,
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
      this.preferences = preferences;
      this.registrationDate = registrationDate;
      this.role = role || Role.USER;
      this.bookings = bookings || [];
    }
}