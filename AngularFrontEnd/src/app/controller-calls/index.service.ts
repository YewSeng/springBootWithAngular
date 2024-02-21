import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactResponse } from '../pojos/ContactResponse';
import { UserResponse } from '../pojos/UserResponse';
import { DriverResponse } from '../pojos/DriverResponse';
import { AuthLoginResponse } from '../pojos/AuthLoginResponse';

@Injectable({
  providedIn: 'root'
})
export class IndexService {

  constructor(private http: HttpClient) { }

  public createEnquiry(contact: any): Observable<ContactResponse> {
    return this.http.post<ContactResponse>("http://localhost:8080/v1/public/contact", contact, { responseType: 'json' });
  }

  public registerUser(user: any): Observable<UserResponse> {
    return this.http.post<UserResponse>("http://localhost:8080/v1/public/registerUser", user, { responseType: 'json' });
  }

  public registerDriver(driver: any): Observable<DriverResponse> {
    return this.http.post<DriverResponse>("http://localhost:8080/v1/public/registerDriver", driver, { responseType: 'json' });
  }

  public login(userBase: any): Observable<AuthLoginResponse> {
    return this.http.post<AuthLoginResponse>("http://localhost:8080/v1/public/login", userBase, { responseType: 'json' });
  }
}
