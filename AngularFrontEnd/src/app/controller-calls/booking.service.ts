import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingResponse } from '../pojos/BookingResponse';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http:HttpClient) { }

  public getBookingById(bookingId: String): Observable<BookingResponse> {
    return this.http.get<BookingResponse>("http://localhost:8080/v1/bookings/"+bookingId);
  }

  public getBookingsByUserId(userId: String): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>("http://localhost:8080/v1/bookings/user/"+userId);
  }

  public getBookingsByDriverId(driverId: String): Observable<BookingResponse[]>  {
    return this.http.get<BookingResponse[]>("http://localhost:8080/v1/bookings/driver/"+driverId);
  }

  public getAllBookings(): Observable<BookingResponse[]>  {
    return this.http.get<BookingResponse[]>("http://localhost:8080/v1/bookings/adminBookings");
  }

  public createBooking(booking: any): Observable<BookingResponse> {
    return this.http.post<BookingResponse>("http://localhost:8080/v1/bookings/registerBooking", booking, {responseType: 'json'});
  }

  public updateBooking(bookingId: String, updatedBooking: any): Observable<BookingResponse> {
    return this.http.put<BookingResponse>("http://localhost:8080/v1/bookings/update/"+bookingId, updatedBooking);
  }

  public deleteBooking(bookingId: String): Observable<BookingResponse> {
    return this.http.delete<BookingResponse>("http://localhost:8080/v1/bookings/"+bookingId);
  }
}
