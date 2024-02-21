import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FareCalculatorService {

  constructor(private http: HttpClient) { }

  public getFareRates(booking: any): Observable<number> {
    return this.http.post<number>("http://localhost:8080/v1/fares/getRates", booking, { responseType: 'json' });
  }
}
