export class AdminKeyResponse {
    adminKey?: string;
    message?: string;

    constructor(adminKey: string , message: string) {
        this.adminKey = adminKey;
        this.message = message;
    }
}