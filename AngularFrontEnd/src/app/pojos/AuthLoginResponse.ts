import { AuthResponse } from "./AuthResponse";

export class AuthLoginResponse extends AuthResponse {
    userType?: string;
    message?: string;
}