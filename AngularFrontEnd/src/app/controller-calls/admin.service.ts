import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { AdminResponse } from '../pojos/AdminResponse';
import { AdminKeyResponse } from '../pojos/AdminKeyResponse';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }

  public verifyAdminKey(adminKey: string): Observable<AdminKeyResponse> {
    const params = { adminKey }; 
    return this.http.post<AdminKeyResponse>("http://localhost:8080/v1/admins/getAdminKey", null, { params, responseType:'json'});
  }

  public getAllAdmins(): Observable<AdminResponse[]> {
    return this.http.get<AdminResponse[]>("http://localhost:8080/v1/admins/getAllAdmins");
  }

  public getAdminById(adminId: String): Observable<AdminResponse> {
    return this.http.get<AdminResponse>("http://localhost:8080/v1/admins/getAdmin/"+adminId);
  }

  public registerAdmin(admin: any, adminKey: String): Observable<AdminResponse> {
    const key = sessionStorage.getItem('adminKey');
    const params = new HttpParams().set('adminKey', key);
    return this.http.post<AdminResponse>("http://localhost:8080/v1/admins/registerAdmin", admin, { params, responseType:'json'});
  }

  public updateAdmin(adminId: String, updatedAdmin: any): Observable<AdminResponse> {
    return this.http.put<AdminResponse>("http://localhost:8080/v1/admins/update/"+adminId, updatedAdmin);
  }

  public deleteAdmin(adminId: String): Observable<AdminResponse> {
    return this.http.delete<AdminResponse>("http://localhost:8080/v1/admins/"+adminId);
  }

  public checkUsernameAndEmailAndMobileNumber(username: string, email: string, mobileNumber: string): Observable<any> {
    return this.getAllAdmins().pipe(map((admins: AdminResponse[]) => {
      const usernameTaken = admins.some(adminResponse => 
        adminResponse.admin && adminResponse.admin.username === username
      );
      const emailTaken = admins.some(adminResponse => 
        adminResponse.admin && adminResponse.admin.email === email
      );
      const mobileNumberTaken = admins.some(adminResponse =>
        adminResponse.admin && adminResponse.admin.mobileNumber === mobileNumber
      );
      return { usernameTaken, emailTaken, mobileNumberTaken };
    }));   
  }

  public checkUsernameAndEmailAndMobileNumberById(adminId: string, username: string, email: string, mobileNumber: string): Observable<{ usernameTaken: boolean, emailTaken: boolean, mobileNumberTaken: boolean }> {
    // First, check if the username and email belong to the original user
    return this.getAdminById(adminId).pipe(
      switchMap((response: AdminResponse) => {
        const originalAdmin = response.admin;
        const isUsernameTaken = originalAdmin.username !== username;
        const isEmailTaken = originalAdmin.email !== email;
        const isMobileNumberTaken = originalAdmin.mobileNumber !== mobileNumber;
        
        // If username and email and Mobile Number belong to the original user, return false for both
        if (!isUsernameTaken && !isEmailTaken && !isMobileNumberTaken) {
          return of({ usernameTaken: false, emailTaken: false, mobileNumberTaken: false });
        }
  
        // If username or email or mobile number belong to the original user, proceed to check against other admins
        return this.getAllAdmins().pipe(
          map((admins: AdminResponse[]) => {
            const usernameTaken = admins.some(adminResponse => adminResponse.admin && adminResponse.admin.username === username && adminResponse.admin.id !== adminId);
            const emailTaken = admins.some(adminResponse => adminResponse.admin && adminResponse.admin.email === email && adminResponse.admin.id !== adminId);
            const mobileNumberTaken = admins.some(adminResponse => adminResponse.admin && adminResponse.admin.mobileNumber === mobileNumber && adminResponse.admin.id !== adminId);
            return { usernameTaken, emailTaken, mobileNumberTaken };
          })
        );
      })
    );
  }
}
