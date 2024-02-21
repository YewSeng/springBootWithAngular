import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  user: string = sessionStorage.getItem('authenticatedUsername');
  userId: string = sessionStorage.getItem('authenticatedId');
  
  ngOnInit(): void {
    
  }
  
  constructor(private router: Router) {}

  goToViewProfilePage() {
    this.router.navigate(['/user/viewProfile/' + this.userId]);
  }

  goToCreateBookingPage() {
    this.router.navigate(['/user/createBooking']);
  }

  goToViewBookingsPage() {
    this.router.navigate(['/user/viewBookings/' + this.userId]);
  }
}
