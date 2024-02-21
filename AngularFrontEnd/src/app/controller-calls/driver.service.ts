import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { DriverResponse } from '../pojos/DriverResponse';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(private http:HttpClient) { }

  public getAllDrivers(): Observable<DriverResponse[]> {
    return this.http.get<DriverResponse[]>("http://localhost:8080/v1/drivers/getAllDrivers/");
  }

  public getDriverById(driverId: String): Observable<DriverResponse> {
    return this.http.get<DriverResponse>("http://localhost:8080/v1/drivers/getDriver/"+driverId);
  }

  public createDriver(driver: any): Observable<DriverResponse> {
    return this.http.post<DriverResponse>("http://localhost:8080/v1/drivers/registerDriver/", driver, {responseType:'json'});
  }

  public updateDriver(driverId: String, updatedDriver: any): Observable<DriverResponse> {
    return this.http.put<DriverResponse>("http://localhost:8080/v1/drivers/update/"+driverId, updatedDriver);
  }

  public deleteDriver(driverId: String): Observable<DriverResponse> {
    return this.http.delete<DriverResponse>("http://localhost:8080/v1/drivers/"+driverId);
  }

  public checkUsernameAndEmailAndMobileNumber(username: string, email: string, mobileNumber: string): Observable<any> {
    return this.getAllDrivers().pipe(map((drivers: DriverResponse[]) => {
      const usernameTaken = drivers.some(driverResponse => 
        driverResponse.driver && driverResponse.driver.username === username
      );
      const emailTaken = drivers.some(driverResponse => 
        driverResponse.driver && driverResponse.driver.email === email
      );
      const mobileNumberTaken = drivers.some(driverResponse =>
        driverResponse.driver && driverResponse.driver.mobileNumber === mobileNumber
      );
      return { usernameTaken, emailTaken, mobileNumberTaken };
    }));   
  }

  public checkUsernameAndEmailAndMobileNumberById(driverId: string, username: string, email: string, mobileNumber: string): Observable<{ usernameTaken: boolean, emailTaken: boolean, mobileNumberTaken: boolean }> {
    // First, check if the username and email belong to the original driver
    return this.getDriverById(driverId).pipe(
      switchMap((response: DriverResponse) => {
        const originalUser = response.driver;
        const isUsernameTaken = originalUser.username !== username;
        const isEmailTaken = originalUser.email !== email;
        const isMobileNumberTaken = originalUser.mobileNumber !== mobileNumber;
        
        // If username and email and Mobile Number belong to the original user, return false for both
        if (!isUsernameTaken && !isEmailTaken && !isMobileNumberTaken) {
          return of({ usernameTaken: false, emailTaken: false, mobileNumberTaken: false });
        }
  
        // If username or email or mobile number belong to the original user, proceed to check against other users
        return this.getAllDrivers().pipe(
          map((drivers: DriverResponse[]) => {
            const usernameTaken = drivers.some(driverResponse => driverResponse.driver && driverResponse.driver.username === username && driverResponse.driver.id !== driverId);
            const emailTaken = drivers.some(driverResponse => driverResponse.driver && driverResponse.driver.email === email && driverResponse.driver.id !== driverId);
            const mobileNumberTaken = drivers.some(driverResponse => driverResponse.driver && driverResponse.driver.mobileNumber === mobileNumber && driverResponse.driver.id !== driverId);
            return { usernameTaken, emailTaken, mobileNumberTaken };
          })
        );
      })
    );
  }

  public getDriverByUsername(username: string): Observable<DriverResponse> {
    return this.getAllDrivers().pipe(
      map((drivers: DriverResponse[]) => {
        // Find the driver with the matching username
        return drivers.find(driverResponse => driverResponse.driver && driverResponse.driver.username === username);
      })
    );
  }
  
}
