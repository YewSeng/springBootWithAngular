import { User } from './User';
import { CabType } from './CabType';
import { Driver } from './Driver';


export class Booking {
  bookingId?: string;
  source?: number;
  destination?: number;
  vehicleType?: CabType;
  travelFare?: number;
  bookingTime?: Date;
  user?: User;
  driver?: Driver;

  constructor(
    source: number,
    destination: number,
    vehicleType: CabType,
    travelFare: number,
    bookingTime: Date,
    user: User,
    driver: Driver
  ) {
    this.source = source;
    this.destination = destination;
    this.vehicleType = vehicleType;
    this.travelFare = travelFare;
    this.bookingTime = bookingTime;
    this.user = user;
    this.driver = driver;
  }
}
