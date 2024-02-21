import { Role } from "./Role";

export class SuperAdmin {
    id?: string;
    role?: Role = Role.SUPERADMIN;

    constructor(role?: Role) {
        this.role = role || Role.SUPERADMIN;
    }
}