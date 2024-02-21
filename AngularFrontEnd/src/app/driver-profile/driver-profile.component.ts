import { Component, OnInit } from '@angular/core';
import { Driver } from '../pojos/Driver';
import { CabType } from '../pojos/CabType';
import { DriverService } from '../controller-calls/driver.service';
import { DriverResponse } from '../pojos/DriverResponse';

@Component({
  selector: 'app-driver-profile',
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.css']
})
export class DriverProfileComponent implements OnInit {

  username: string = sessionStorage.getItem('authenticatedUsername');
  driverId: string = sessionStorage.getItem('authenticatedId');
  vehicleType: CabType;
  driver: Driver;

  constructor(private driverService: DriverService) {}
  
  ngOnInit(): void {
    this.driverService.getDriverById(this.driverId).subscribe(
      (driverDetails: DriverResponse) => {
        this.driver = driverDetails.driver;
        this.vehicleType = driverDetails.driver.vehicleType;
      },
      error => {
        console.error('Error fetching driver:', error);
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
