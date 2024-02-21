import { UserBase } from './UserBase';
import { User } from './User';
import { Driver } from './Driver';
import { Admin } from './Admin';
import { SuperAdmin } from './SuperAdmin';

export class AuthResponse {
  authenticated?: boolean;
  userDetails?: UserBase | User | Driver | Admin | SuperAdmin;

  constructor(authenticated: boolean, userBase: UserBase);
  constructor(authenticated: boolean, user: User);
  constructor(authenticated: boolean, driver: Driver);
  constructor(authenticated: boolean, admin: Admin);
  constructor(authenticated: boolean, superAdmin: SuperAdmin);

  constructor(authenticated: boolean, userDetails: UserBase | User | Driver | Admin | SuperAdmin) {
    this.authenticated = authenticated;
    this.userDetails = userDetails;
  }
}
