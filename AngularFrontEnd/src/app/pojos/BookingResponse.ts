import { Booking } from "./Booking";

export class BookingResponse {
    booking?: Booking;
    message?: string;
    
    constructor(booking: Booking, message: string) {
      this.booking = booking;
      this.message = message;
    }
  }