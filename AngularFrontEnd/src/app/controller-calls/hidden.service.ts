import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactResponse } from '../pojos/ContactResponse';
import { AdminResponse } from '../pojos/AdminResponse';

@Injectable({
  providedIn: 'root'
})
export class HiddenService {

  constructor(private http: HttpClient) { }

  public getAllContacts(adminKey: String): Observable<ContactResponse[]> {
    const key = sessionStorage.getItem('adminKey');
    const headers = new HttpHeaders().set('adminKey', key);
    return this.http.get<ContactResponse[]>(`http://localhost:8080/v1/hidden/viewAllContacts?adminKey=${key}`, { responseType: 'json' });
  }

  public registerAdmin(admin: any, key: String): Observable<AdminResponse> {
    const adminKey = sessionStorage.getItem('adminKey');
    return this.http.post<AdminResponse>("http://localhost:8080/v1/hidden/registerAdmin", admin, { responseType: 'json' });
  }
}
