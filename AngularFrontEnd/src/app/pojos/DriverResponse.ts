import { Driver } from './Driver';

export class DriverResponse {
    driver?: Driver;
    message?: string;

    constructor(driver: Driver, message: string) {
        this.driver = driver;
        this.message = message;
    }
}