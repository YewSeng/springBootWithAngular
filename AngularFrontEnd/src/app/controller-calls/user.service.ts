import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { UserResponse } from '../pojos/UserResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>("http://localhost:8080/v1/users/getAllUsers");
  }

  public getUserById(userId: String): Observable<UserResponse> {
    return this.http.get<UserResponse>("http://localhost:8080/v1/users/getUser/"+userId);
  }

  public createUser(user: any): Observable<UserResponse> {
    return this.http.post<UserResponse>("http://localhost:8080/v1/users/registerUser", user, {responseType: 'json'});
  }

  public updateUser(userId: String, updatedUser: any): Observable<UserResponse> {
    return this.http.put<UserResponse>("http://localhost:8080/v1/users/update/"+userId, updatedUser);
  }

  public deleteUser(userId: String): Observable<UserResponse> {
    return this.http.delete<UserResponse>("http://localhost:8080/v1/users/"+userId);
  }

  public checkUsernameAndEmailAndMobileNumber(username: string, email: string, mobileNumber: string): Observable<any> {
    return this.getAllUsers().pipe(map((users: UserResponse[]) => {
      const usernameTaken = users.some(userResponse => 
        userResponse.user && userResponse.user.username === username
      );
      const emailTaken = users.some(userResponse => 
        userResponse.user && userResponse.user.email === email
      );
      const mobileNumberTaken = users.some(userResponse =>
        userResponse.user && userResponse.user.mobileNumber === mobileNumber
      );
      return { usernameTaken, emailTaken, mobileNumberTaken };
    }));   
  }

  public checkUsernameAndEmailAndMobileNumberById(userId: string, username: string, email: string, mobileNumber: string): Observable<{ usernameTaken: boolean, emailTaken: boolean, mobileNumberTaken: boolean }> {
    // First, check if the username and email belong to the original user
    return this.getUserById(userId).pipe(
      switchMap((response: UserResponse) => {
        const originalUser = response.user;
        const isUsernameTaken = originalUser.username !== username;
        const isEmailTaken = originalUser.email !== email;
        const isMobileNumberTaken = originalUser.mobileNumber !== mobileNumber;
        
        // If username and email and Mobile Number belong to the original user, return false for both
        if (!isUsernameTaken && !isEmailTaken && !isMobileNumberTaken) {
          return of({ usernameTaken: false, emailTaken: false, mobileNumberTaken: false });
        }
  
        // If username or email or mobile number belong to the original user, proceed to check against other users
        return this.getAllUsers().pipe(
          map((users: UserResponse[]) => {
            const usernameTaken = users.some(userResponse => userResponse.user && userResponse.user.username === username && userResponse.user.id !== userId);
            const emailTaken = users.some(userResponse => userResponse.user && userResponse.user.email === email && userResponse.user.id !== userId);
            const mobileNumberTaken = users.some(userResponse => userResponse.user && userResponse.user.mobileNumber === mobileNumber && userResponse.user.id !== userId);
            return { usernameTaken, emailTaken, mobileNumberTaken };
          })
        );
      })
    );
  }

  public getUserByUsername(username: string): Observable<UserResponse> {
    return this.getAllUsers().pipe(
      map((users: UserResponse[]) => {
        // Find the driver with the matching username
        return users.find(usersResponse => usersResponse.user && usersResponse.user.username === username);
      })
    );
  }
}
