import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEvent, debounceTime, distinctUntilChanged, combineLatest, catchError } from 'rxjs';
import { BookingService } from '../controller-calls/booking.service';
import { DriverService } from '../controller-calls/driver.service';
import { FareCalculatorService } from '../controller-calls/fare-calculator.service';
import { UserService } from '../controller-calls/user.service';
import { Booking } from '../pojos/Booking';
import { CabType } from '../pojos/CabType';
import { DriverResponse } from '../pojos/DriverResponse';
import { UserResponse } from '../pojos/UserResponse';

@Component({
  selector: 'app-user-create-booking',
  templateUrl: './user-create-booking.component.html',
  styleUrls: ['./user-create-booking.component.css']
})
export class UserCreateBookingComponent implements OnInit {

  userId: string = sessionStorage.getItem('authenticatedId');
  registerBookingForm: FormGroup;
  registerError: string;
  fareCalculated: boolean = false;
  fare: number;
  driverList: DriverResponse[] = [];
  filteredDrivers: DriverResponse[] = [];
  userList: UserResponse[] = [];
  filteredUsers: UserResponse[] = [];
  pageSize: number = 5;
  currentPage: number = 1;
  selectedUserFilterCriteria: string = 'username';
  selectedDriverFilterCriteria: string = 'vehicleType';
  userSearchTerm: string = '';
  driverSearchTerm: string = '';
  @ViewChild('filterPreferencesSelect') filterPreferencesSelect: ElementRef;
  @ViewChild('filterVehicleSelect') filterVehicleSelect: ElementRef;
  cabTypes: CabType[] = [CabType.STANDARD, CabType.PREMIUM, CabType.LIMOUSINE, CabType.SPECIAL];
  
  constructor(
      private bookingService: BookingService, 
      private driverService: DriverService,
      private userService: UserService,
      private fareCalculatorService: FareCalculatorService,
      private formBuilder: FormBuilder, 
      private router: Router
  ) {}

  ngOnInit(): void {
      this.initForm();
      // Set the userId field value in the form
      this.registerBookingForm.get('userId').setValue(this.userId);
      this.fetchDrivers();
      // Initially, set filteredDrivers to contain all drivers
      this.filteredDrivers = [...this.driverList];
      // Call selectUser method to filter drivers based on user's cab preferences
      this.selectUser();
  }

  ngAfterViewInit(): void {
    if (this.filterVehicleSelect) {
      fromEvent(this.filterVehicleSelect.nativeElement, 'change')
          .pipe(debounceTime(300), distinctUntilChanged())
          .subscribe(() => {
              this.onDriverFilterVehicleTypeChange();
          });
  }
  }

  initForm(): void {
      this.registerBookingForm = this.formBuilder.group({
          pickup: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("[0-9]{6}")]],
          dropoff: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("[0-9]{6}")]],
          bookingTime: ['', Validators.required],
          userId: ['', Validators.required],
          driverId: ['', Validators.required]
      });
  }

  registerBooking() {
    if (this.registerBookingForm.valid) {
      const userId = this.registerBookingForm.get('userId').value;
      const driverId = this.registerBookingForm.get('driverId').value;
      const travelFareString = (<HTMLInputElement>document.getElementById('fare')).value;
      const travelFare = parseFloat(travelFareString);
  
      // Fetch user and driver details concurrently
      combineLatest([
        this.userService.getUserById(userId),
        this.driverService.getDriverById(driverId)
      ]).pipe(
        catchError(error => {
          console.error('Error fetching user or driver details:', error);
          this.registerError = 'Failed to fetch user or driver details. Please try again later.';
          throw error; // Rethrow the error to stop the execution
        })
      ).subscribe(([userDetails, driverDetails]) => {
        const cabTypeString = driverDetails.driver.vehicleType.toUpperCase();
        const cabTypeEnumValue = CabType[cabTypeString as keyof typeof CabType];
  
        // Construct the Booking object
        const bookingDetails = {
          source: this.registerBookingForm.get('pickup').value,
          destination: this.registerBookingForm.get('dropoff').value,
          vehicleType: cabTypeEnumValue,
          travelFare: travelFare,
          bookingTime: this.registerBookingForm.get('bookingTime').value,
          user: userDetails.user, // Pass the fetched user object
          driver: driverDetails.driver // Pass the fetched driver object
        };
  
        // Call the booking service method to register the booking
        this.bookingService.createBooking(bookingDetails).subscribe(
          (response) => {
            // Handle success response
            console.log('Booking registered successfully:', response);
            // Pass the new user details to the View Drivers page
            this.router.navigate(['/user/viewBookings/' + this.userId], { state: { success: true, booking: response.booking } });
          },
          (error) => {
            // Handle error response
            console.error('Error registering booking:', error);
            this.registerError = 'Failed to register booking. Please try again later.';
          }
        );
      });
    }
  }

  calculateFare(): void {
    if (this.registerBookingForm.valid) {
      const userId = this.registerBookingForm.get('userId').value;
      const driverId = this.registerBookingForm.get('driverId').value;
  
      // Fetch user details
      this.userService.getUserById(userId).subscribe(
        (userDetails) => {
          // Fetch driver details
          this.driverService.getDriverById(driverId).subscribe(
            (driverDetails) => {
              // Once user and driver details are fetched, construct the Booking object
              console.log('Driver Details:', driverDetails);
              if (driverDetails && driverDetails.driver) {
                console.log('Vehicle Type: ', driverDetails.driver.vehicleType);
  
                // Use the fetched driver's vehicle type if available
                const cabTypeString = driverDetails.driver.vehicleType.toUpperCase();
                const cabTypeEnumValue = CabType[cabTypeString as keyof typeof CabType];
  
                const bookingDetails = new Booking(
                  this.registerBookingForm.get('pickup').value,
                  this.registerBookingForm.get('dropoff').value,
                  cabTypeEnumValue,
                  null,
                  this.registerBookingForm.get('bookingTime').value,
                  userDetails.user, // Pass the fetched user object
                  driverDetails.driver // Pass the fetched driver object
                );
                console.log('CabType: ', bookingDetails.vehicleType);
  
                // Calculate fare using the constructed Booking object
                this.fareCalculatorService.getFareRates(bookingDetails).subscribe(
                  (fare: number) => {
                    this.fare = fare;
                    this.fareCalculated = true;
                    // Set the travelFare property of the booking
                    bookingDetails.travelFare = this.fare;
                  },
                  (error) => {
                    this.registerError = 'Error calculating fare: ' + error.message;
                    console.error('Error calculating fare:', error);
                  }
                );
              } else {
                this.registerError = 'Driver details or vehicle type not found';
                console.error('Driver details or vehicle type not found');
              }
            },
            (error) => {
              this.registerError = 'Error fetching driver details: ' + error.message;
              console.error('Error fetching driver details:', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    }
  }
  
  selectUser(): void {
    const selectedUserId = this.userId;

    this.registerBookingForm.controls['userId'].setValue(selectedUserId);

    this.userService.getUserById(selectedUserId).subscribe(
        (userDetails) => {
            const userPreferences = userDetails.user.preferences;

            this.cabTypes = [userPreferences];

            // Filter drivers based on the selected user's cab preferences
            this.filteredDrivers = this.driverList.filter(driverResponse => {
                return driverResponse.driver.vehicleType.toLowerCase() === userPreferences.toLowerCase();
            });

            // Set the selected user's preferences as the filter criteria for drivers
            this.selectedDriverFilterCriteria = 'vehicleType';
            this.driverSearchTerm = userPreferences;

            this.filterDrivers(); // Apply filtering
        },
        (error) => {
            console.error('Error fetching user details:', error);
        }
    );
  }


  fetchDrivers(): void {
    this.driverService.getAllDrivers().subscribe(
      (response: DriverResponse[]) => {
        this.driverList = response;
        console.log('Fetched Drivers:', this.driverList);
        
        // Call filterDrivers here to update filteredDrivers with the fetched drivers
        this.filterDrivers();
      },
      (error) => {
        console.error("Error fetching Drivers:", error);
      }
    );
  }
  
  onDriverPageChange(pageNumber: number, event: Event): void {
      event.preventDefault();
      this.currentPage = pageNumber;
      this.filterDrivers();
  }

  getDriverPages(): number[] {
      const pageCount = Math.ceil(this.filteredDrivers.length / this.pageSize);
      return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  onDriverFilterVehicleTypeChange(): void {
    // Adjust the search term to backend format for Cab Type
    this.driverSearchTerm = this.selectedDriverFilterCriteria === 'vehicleType'
      ? this.getBackendCabType(this.driverSearchTerm)
      : this.driverSearchTerm;

    this.filterDrivers();
  }

  filterDrivers(): void {
    const lowerCaseSearchTerm = this.driverSearchTerm.toLowerCase();
    console.log('Search Term: ', lowerCaseSearchTerm);
    
    // Start by showing all drivers
    let filteredDrivers = [...this.driverList];
  
    // If a user is selected, filter drivers based on the selected user's cab preferences
    if (this.registerBookingForm.value.userId) {
      const selectedUserId = this.registerBookingForm.value.userId;
      const selectedUser = this.userList.find(user => user.user.id === selectedUserId)?.user;
  
      if (selectedUser) {
        const userPreferences = selectedUser.preferences;
        filteredDrivers = filteredDrivers.filter(driverResponse => {
          // Check if the driver's vehicleType matches the selected user's cab preferences
          return driverResponse.driver.vehicleType.toLowerCase() === userPreferences.toLowerCase();
        });
      } else {
        // If the selected user is not found, display all drivers
        filteredDrivers = [...this.driverList];
      }
    }
  
    // Apply additional filtering based on the search term if present
    if (lowerCaseSearchTerm.trim() !== '') {
      filteredDrivers = filteredDrivers.filter(driverContact => {
        const filterValue = this.selectedDriverFilterCriteria === 'vehicleType'
          ? this.getDriverDisplayPreference(driverContact.driver.vehicleType)?.toLowerCase()
          : driverContact.driver[this.selectedDriverFilterCriteria]?.toLowerCase();
  
        return this.selectedDriverFilterCriteria === 'vehicleType'
          ? filterValue === lowerCaseSearchTerm || driverContact.driver.vehicleType === this.getBackendCabType(lowerCaseSearchTerm)
          : filterValue?.includes(lowerCaseSearchTerm);
      });
    }
  
    // Update the displayed drivers based on pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredDrivers = filteredDrivers.slice(startIndex, endIndex);
  }    
  
  getDriverDisplayPreference(cabType: string): string {
      switch (cabType) {
          case CabType.STANDARD:
              return 'Standard';
          case CabType.PREMIUM:
              return 'Premium';
          case CabType.LIMOUSINE:
              return 'Limousine';
          case CabType.SPECIAL:
              return 'special';
          default:
              return cabType;
      }
  }  

  getBackendCabType(displayCabType: string): string {
      switch (displayCabType.toUpperCase()) {
          case 'STANDARD':
              return CabType.STANDARD;
          case 'PREMIUM':
              return CabType.PREMIUM;
          case 'LIMOUSINE':
              return CabType.LIMOUSINE;
          case 'SPECIAL':
              return CabType.SPECIAL;
          default:
              return displayCabType;
      }
  }

  // Modify the getDisplayPreference method
  getUserDisplayPreference(cabType: string): string {
    switch (cabType) {
      case CabType.STANDARD:
        return 'Standard';
      case CabType.PREMIUM:
        return 'Premium';
      case CabType.LIMOUSINE:
        return 'Limousine';
      case CabType.SPECIAL:
        return 'special';
      default:
        return cabType;
    }
  }  
}
