import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _logoutSuccessSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get logoutSuccess$() {
    return this._logoutSuccessSubject.asObservable();
  }

  setLogoutSuccess(status: boolean) {
    this._logoutSuccessSubject.next(status);
  }
}
