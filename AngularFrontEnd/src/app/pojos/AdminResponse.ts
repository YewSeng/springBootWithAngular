import { Admin } from "./Admin";

export class AdminResponse {
    admin?: Admin;
    message?: string;
    
    constructor(admin: Admin, message: string) {
      this.admin = admin;
      this.message = message;
    }
  }
  