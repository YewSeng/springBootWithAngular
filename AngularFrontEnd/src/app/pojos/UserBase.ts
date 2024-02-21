import { Role } from './Role';

export interface UserBase {
    id?: string;
    firstName?: string;
    lastName?: string;
    mobileNumber?: string;
    email?: string;
    username?: string;
    password?: string;
    registrationDate?: Date; 
    role?: Role;
  }