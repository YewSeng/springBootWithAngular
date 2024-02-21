import { User } from "./User";

export class UserResponse {
    user?: User;
    message?: string;

    constructor(user: User, message: string) {
        this.user = user;
        this.message = message;
    }
}