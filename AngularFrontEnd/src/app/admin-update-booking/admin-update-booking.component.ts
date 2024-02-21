import { Component, OnInit } from '@angular/core';
import { Booking } from '../pojos/Booking';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../controller-calls/booking.service';
import { BookingResponse } from '../pojos/BookingResponse';
import { UserService } from '../controller-calls/user.service';
import { DriverService } from '../controller-calls/driver.service';
import { FareCalculatorService } from '../controller-calls/fare-calculator.service';
import { catchError, combineLatest, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-admin-update-booking',
  templateUrl: './admin-update-booking.component.html',
  styleUrls: ['./admin-update-booking.component.css']
})
export class AdminUpdateBookingComponent implements OnInit{
  
  bookingId: string;
  oldBookingData: Booking;
  updateBookingForm: FormGroup;
  updateError: string;
  updatedTravelFare: number;
  fareCalculated: boolean = false;

  constructor(private route: ActivatedRoute, 
    private bookingService: BookingService, 
    private userService: UserService,
    private driverService: DriverService,
    private fareCalculatorService: FareCalculatorService,
    private router: Router, 
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
    this.route.params.subscribe(params => {
      this.bookingId = params['bookingId']; 
      this.loadBookingData(this.bookingId); 
    });
  }

  initializeForm(): void {
    // Initialize the reactive form with form controls and validators
    this.updateBookingForm = this.formBuilder.group({
      pickup: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("[0-9]{6}")]], 
      dropoff: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("[0-9]{6}")]], 
      bookingTime: ['', Validators.required],
      travelFare: [''], // No need for validators here
      surchargeCheckbox: [false, Validators.requiredTrue] 
    });
  }

  loadBookingData(bookingId: string): void {
    this.bookingService.getBookingById(bookingId).subscribe({
      next: (response: BookingResponse) => {
        this.oldBookingData = response.booking; 
        if (this.oldBookingData) {
          this.updateBookingForm.patchValue({
            travelFare: this.oldBookingData.travelFare
          });
        }
      },
      error: (error) => {
        console.error('Error loading booking data:', error);
        this.updateError = 'An error occurred while loading booking data.';
      }
    });
  }

  calculateNewFare() {
    // Instead of trying to access bookingId from the form, use the bookingId obtained from route params
    const bookingId = this.bookingId; // Use bookingId obtained from route params
    const userUsername = this.oldBookingData.user.username; // Use oldBookingData directly
    const driverUsername = this.oldBookingData.driver.username; // Use oldBookingData directly
    const newPickUpPoint = this.updateBookingForm.get('pickup').value;
    const newDropOffPoint = this.updateBookingForm.get('dropoff').value;
    const newBookingTime = this.updateBookingForm.get('bookingTime').value;
    
    // Fetch Users & Drivers & booking concurrently
    combineLatest([
      this.userService.getUserByUsername(userUsername),
      this.driverService.getDriverByUsername(driverUsername),
      this.bookingService.getBookingById(bookingId) // Ensure bookingId is defined
    ]).pipe(
      catchError(error => {
        console.error('Error fetching user or driver or booking details:', error);
        this.updateError = 'Failed to fetch user or driver or booking details. Please try again later.';
        throw error; // Rethrow the error to stop the execution
      })
    ).subscribe(([userDetails, driverDetails, bookingDetails]) => {
      const user = userDetails.user;
      const driver = driverDetails.driver;
      const booking = bookingDetails.booking;
      booking.source = newPickUpPoint;
      booking.destination = newDropOffPoint;
      booking.bookingTime = newBookingTime;
      
      // calculate new fare
      this.fareCalculatorService.getFareRates(booking).subscribe(
        (fare: number) => {
          this.updatedTravelFare = fare; // Assign the fare to updatedTravelFare
          this.fareCalculated = true; // Set fareCalculated to true
          // Enable the travelFare form control and set its value
          this.updateBookingForm.get('travelFare').enable();
          this.updateBookingForm.patchValue({
            travelFare: this.updatedTravelFare
          });
        },
        (error) => {
          this.updateError = 'Error calculating fare: ' + error.message;
          console.error('Error calculating fare:', error);
        }
      );
    });
  }

  updateTravelFare(event: any) {
    // Update travel fare based on checkbox state
    if (event.target.checked) {
      // Add $3 surcharge
      this.updatedTravelFare += 3;
    } else {
      // Remove $3 surcharge
      if (this.updatedTravelFare > 3) {
        this.updatedTravelFare -= 3;
      }
    }
    // Update the travel fare value in the form
    this.updateBookingForm.patchValue({
      travelFare: this.updatedTravelFare
    });
  }
  
  updateBooking() {
    this.bookingService.getBookingById(this.bookingId).pipe(
        switchMap((bookingDetails: BookingResponse) => {
            const updatedBooking = bookingDetails.booking;
            // Update the properties of updatedBooking with the new values from the form if necessary
            updatedBooking.source = this.updateBookingForm.get('pickup').value;
            updatedBooking.destination = this.updateBookingForm.get('dropoff').value;
            updatedBooking.bookingTime = this.updateBookingForm.get('bookingTime').value;
            const travelFareString = (<HTMLInputElement>document.getElementById('fare')).value;
            const travelFare = parseFloat(travelFareString);
            updatedBooking.travelFare = travelFare;
            // Return the updated booking
            return of(updatedBooking);
        }),
        switchMap((updatedBooking: Booking) => {
            // Call the updateBooking service method with the updated booking
            return this.bookingService.updateBooking(this.bookingId, updatedBooking);
        })
    ).subscribe({
        next: () => {
            // Redirect to the view bookings page upon successful update
            this.router.navigate(['/admin/viewBookings'], { state: { success: true } });
        },
        error: (error) => {
            console.error('Error updating booking:', error);
            this.updateError = 'An error occurred while updating booking.';
        }
    });
  }

}
