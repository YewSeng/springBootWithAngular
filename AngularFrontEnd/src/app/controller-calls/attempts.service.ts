import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttemptsService {
  private attemptsSubject = new BehaviorSubject<number>(0);
  attempts$ = this.attemptsSubject.asObservable();

  incrementAttempts() {
    const currentAttempts = this.attemptsSubject.value;
    this.attemptsSubject.next(currentAttempts + 1);
  }
}
