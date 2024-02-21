import { Component, ElementRef, ViewChild } from '@angular/core';
import { BookingResponse } from '../pojos/BookingResponse';
import { CabType } from '../pojos/CabType';
import { debounceTime, distinctUntilChanged, forkJoin, fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { BookingService } from '../controller-calls/booking.service';
import { UserService } from '../controller-calls/user.service';
import { DriverService } from '../controller-calls/driver.service';
import { User } from '../pojos/User';
import { Driver } from '../pojos/Driver';

@Component({
  selector: 'app-driver-view-bookings',
  templateUrl: './driver-view-bookings.component.html',
  styleUrls: ['./driver-view-bookings.component.css']
})
export class DriverViewBookingsComponent {

  driverId: string = sessionStorage.getItem('authenticatedId');
  bookingList: BookingResponse[] = [];
  filteredBookings: BookingResponse[] = [];
  pageSize: number = 5;
  currentPage: number = 1;
  selectedFilterCriteria: string = 'driverUsername';
  searchTerm: string = '';
  deletedBooking: BookingResponse | null = null;
  deletionError: string | null = null;
  successMessage: string;
  newBooking: any;
  @ViewChild('filterPreferencesSelect') filterPreferencesSelect: ElementRef;
  // Added a list of cab types for dropdown
  cabTypes: string[] = [CabType.STANDARD, CabType.PREMIUM, CabType.LIMOUSINE, CabType.SPECIAL];
  Object: any;
  CabType: CabType;

  ngOnInit(): void {
    this.fetchBookings();
    const navigationData = history.state;
    if (navigationData && navigationData.success && navigationData.user) {
      this.successMessage = 'Booking registered successfully:';
      this.newBooking = navigationData.Booking;
    }
  }

  ngAfterViewInit(): void {
    // Subscribe to the (change) event after the view is initialized
    if (this.filterPreferencesSelect) {
      fromEvent(this.filterPreferencesSelect.nativeElement, 'change')
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(() => {
          this.onFilterVehicleTypeChange();
        });
    }
  }
  
  constructor(private router: Router, private bookingService: BookingService, private userService: UserService,
    private driverService: DriverService) {}

  fetchBookings(): void {
    this.bookingService.getBookingsByDriverId(this.driverId).subscribe(
      (response: BookingResponse[]) => {
        this.bookingList = response;
        console.log('Fetched Bookings:', this.bookingList);
        this.filterBookings();
      },
      (error) => {
        console.error("Error fetching Bookings:", error);
      }
    );
  }

  onPageChange(pageNumber: number, event: Event): void {
    event.preventDefault();
    this.currentPage = pageNumber;
    this.filterBookings();
  }

  getPages(): number[] {
    const pageCount = Math.ceil(this.filteredBookings.length / this.pageSize);
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  onFilterVehicleTypeChange(): void {
    // Adjust the search term to backend format for Cab Type
    this.searchTerm = this.selectedFilterCriteria === 'vehicleType'
      ? this.getBackendCabType(this.searchTerm)
      : this.searchTerm;

    this.filterBookings();
  }

  filterBookings(): void {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    console.log('Search Term: ', lowerCaseSearchTerm);
    
    // Check if searchTerm is empty, if so, display all bookings
    if (!this.searchTerm || this.searchTerm.trim() === '') {
        this.filteredBookings = this.bookingList.slice(); // Make a copy of the entire bookingList
    } else {
        this.filteredBookings = this.bookingList.filter(bookingContact => {
            let filterValue: string;

            // Determine which username field to filter based on selectedFilterCriteria
            if (this.selectedFilterCriteria === 'driverUsername') {
                filterValue = bookingContact.booking.driver.username?.toLowerCase();
            } else {
                // If selectedFilterCriteria is not 'userUsername' or 'driverUsername', use vehicleType
                filterValue = this.getDisplayPreference(bookingContact.booking.driver.vehicleType)?.toLowerCase();
            }
        
            return filterValue?.includes(lowerCaseSearchTerm);
        });
    }
  
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredBookings = this.filteredBookings.slice(startIndex, endIndex);
  }
  
  deleteBooking(bookingId: string): void {
    // First, fetch the booking information including the user and driver details
    this.bookingService.getBookingById(bookingId).subscribe(
      (response: BookingResponse) => {
        const booking = response;
        
        // Store the user and driver information
        const userId = booking.booking.user.id;
        const driverId = booking.booking.driver.id;
        
        // Now, delete the booking
        this.bookingService.deleteBooking(bookingId).subscribe(
          () => {
            // Once deletion is successful, handle the deletion success
            this.handleDeletionSuccess(booking, userId, driverId);
          },
          (error) => {
            console.error("Error deleting Booking:", error);
            this.handleError("Error deleting Booking.");
          }
        );
      },
      (error) => {
        console.error("Error fetching Booking information:", error);
        this.handleError("Error fetching Booking information.");
      }
    );
  }
  
  private handleDeletionSuccess(deletedBooking: BookingResponse, userId: string, driverId: string): void {
    // Now that the booking is deleted, you have the user and driver IDs to fetch their details
    forkJoin([
      this.userService.getUserById(userId),
      this.driverService.getDriverById(driverId)
    ]).subscribe(
      ([deleteUser, deleteDriver]) => {
        console.log('Deleted User:', deleteUser);
        console.log('Deleted Driver:', deleteDriver);
        
        // Create user and driver objects
        const deletedUser: User = {
          id: deleteUser.user.id,
          username: deleteUser.user.username
        };
  
        const deletedDriver: Driver = {
          id: deleteDriver.driver.id,
          username: deleteDriver.driver.username
        };
  
        // Update the user and driver objects in the deleted booking
        deletedBooking.booking.user = deletedUser;
        deletedBooking.booking.driver = deletedDriver;
  
        // Set the deleted booking and reset the deletion error
        this.deletedBooking = deletedBooking;
        this.deletionError = null;
  
        // Fetch the updated booking list
        this.fetchBookings();
      },
      (error) => {
        console.error("Error fetching user or driver information:", error);
        this.handleError("Error fetching user or driver information.");
      }
    );
  }
  
  private handleError(errorMessage: string): void {
    this.deletionError = errorMessage;
    this.deletedBooking = null;
  }  
  
  // Modify the getDisplayPreference method
  getDisplayPreference(cabType: string): string {
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

  // New method to convert frontend CabType to backend format
  getBackendCabType(displayCabType: string): string {
    switch (displayCabType.toUpperCase()) {
      case 'STANDARD':
        return CabType.STANDARD;
      case 'PREMIUM':
        return CabType.PREMIUM;
      case 'LIMOUSINE':  // Update to match your backend format
        return CabType.LIMOUSINE;
      case 'SPECIAL':
        return CabType.SPECIAL;
      default:
        return displayCabType;
    }
  }
}
