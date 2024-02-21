import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DriverResponse } from '../pojos/DriverResponse';
import { CabType } from '../pojos/CabType';
import { debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { DriverService } from '../controller-calls/driver.service';

@Component({
  selector: 'app-admin-view-drivers',
  templateUrl: './admin-view-drivers.component.html',
  styleUrls: ['./admin-view-drivers.component.css']
})
export class AdminViewDriversComponent implements OnInit {
  driverList: DriverResponse[] = [];
  filteredDrivers: DriverResponse[] = [];
  pageSize: number = 5;
  currentPage: number = 1;
  selectedFilterCriteria: string = 'firstName';
  searchTerm: string = '';
  deletedDriver: DriverResponse | null = null;
  deletionError: string | null = null;
  successMessage: string;
  newDriver: any;
  @ViewChild('filterPreferencesSelect') filterPreferencesSelect: ElementRef;
  // Added a list of cab types for dropdown
  cabTypes: string[] = [CabType.STANDARD, CabType.PREMIUM, CabType.LIMOUSINE, CabType.SPECIAL];
  Object: any;
  CabType: CabType;

  ngOnInit(): void {
    this.fetchDrivers();
    const navigationData = history.state;
    if (navigationData && navigationData.success && navigationData.user) {
      this.successMessage = 'Driver registered successfully:';
      this.newDriver = navigationData.Driver;
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
  
  constructor(private router: Router, private driverService: DriverService) {}

  fetchDrivers(): void {
    this.driverService.getAllDrivers().subscribe(
      (response: DriverResponse[]) => {
        this.driverList = response;
        console.log('Fetched Drivers:', this.driverList);
        this.filterDrivers();
      },
      (error) => {
        console.error("Error fetching Drivers:", error);
      }
    );
  }

  onPageChange(pageNumber: number, event: Event): void {
    event.preventDefault();
    this.currentPage = pageNumber;
    this.filterDrivers();
  }

  getPages(): number[] {
    const pageCount = Math.ceil(this.filteredDrivers.length / this.pageSize);
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  onFilterVehicleTypeChange(): void {
    // Adjust the search term to backend format for Cab Type
    this.searchTerm = this.selectedFilterCriteria === 'vehicleType'
      ? this.getBackendCabType(this.searchTerm)
      : this.searchTerm;

    this.filterDrivers();
  }
  
  filterDrivers(): void {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    console.log('Search Term: ', lowerCaseSearchTerm);
    this.filteredDrivers = this.driverList.filter(driverContact => {
      const filterValue = this.selectedFilterCriteria === 'vehicleType'
        ? this.getDisplayPreference(driverContact.driver.vehicleType)?.toLowerCase()
        : driverContact.driver[this.selectedFilterCriteria]?.toLowerCase();
  
      return this.selectedFilterCriteria === 'vehicleType'
        ? filterValue === lowerCaseSearchTerm || driverContact.driver.vehicleType === this.getBackendCabType(lowerCaseSearchTerm)
        : filterValue?.includes(lowerCaseSearchTerm);
    });
  
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredDrivers = this.filteredDrivers.slice(startIndex, endIndex);
  }

  deleteDriver(driverId: string): void {
    this.driverService.deleteDriver(driverId).subscribe(
      (response: DriverResponse) => {
        this.deletedDriver = response;
        this.deletionError = null;
        this.fetchDrivers();
      },
      (error) => {
        console.error("Error deleting Driver:", error);
        this.deletionError = "Error deleting Driver.";
        this.deletedDriver = null;
      }
    );
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
