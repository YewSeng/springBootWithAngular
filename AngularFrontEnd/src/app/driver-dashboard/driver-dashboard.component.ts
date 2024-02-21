import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-dashboard',
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.css']
})
export class DriverDashboardComponent implements OnInit {

  driver: string = sessionStorage.getItem('authenticatedUsername');
  driverId: string = sessionStorage.getItem('authenticatedId');
  
  ngOnInit(): void {
    
  }
  
  constructor(private router: Router) {}

  goToViewProfilePage() {
    this.router.navigate(['/driver/viewProfile/' + this.driverId]);
  }
  
  goToViewBookingsPage() {
    this.router.navigate(['/driver/viewBookings/' + this.driverId]);
  }
}
