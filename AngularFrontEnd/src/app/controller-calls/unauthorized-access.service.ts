import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnauthorizedAccessService {
  private unauthorizedAccessErrorSubject = new BehaviorSubject<string | null>(null);

  setUnauthorizedAccessError(error: string): void {
    this.unauthorizedAccessErrorSubject.next(error);
  }

  getUnauthorizedAccessError(): Observable<string | null> {
    return this.unauthorizedAccessErrorSubject.asObservable();
  }
}
