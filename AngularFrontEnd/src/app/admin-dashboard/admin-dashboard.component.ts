import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  admin: string = sessionStorage.getItem('authenticatedUsername');
  
  ngOnInit(): void {
    
  }
  
  constructor(private router: Router) {}

  goToCreateUserPage() {
    this.router.navigate(['/admin/createUser']);
  }

  goToViewUsersPage() {
    this.router.navigate(['/admin/viewUsers']);
  }

  goToCreateDriverPage() {
    this.router.navigate(['/admin/createDriver']);
  }

  goToViewDriversPage() {
    this.router.navigate(['/admin/viewDrivers']);
  }

  goToCreateBookingPage() {
    this.router.navigate(['/admin/createBooking']);
  }

  goToViewBookingsPage() {
    this.router.navigate(['/admin/viewBookings']);
  }
}
