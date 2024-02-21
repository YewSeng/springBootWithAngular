import { Component, OnInit  } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../controller-calls/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit{
  
  navbarLink: string = '/hidden';
  authenticatedUserType: string;
  isUserNavBarVisible = false;
  isDriverNavBarVisible = false;
  isAdminNavBarVisible = false;
  isSuperAdminNavBarVisible = false;
  unauthorized: boolean = true;
  userId: string = sessionStorage.getItem('authenticatedId');
  driverId: string = sessionStorage.getItem('authenticatedId');
  
  constructor(private router: Router, private authService: AuthService) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Update navbar visibility based on route
        this.isUserNavBarVisible = event.url.startsWith('/user');
        this.isDriverNavBarVisible = event.url.startsWith('/driver');
        this.isAdminNavBarVisible = event.url.startsWith('/admin');
        this.isSuperAdminNavBarVisible = event.url.startsWith('/superadmin');

         // Update unauthorized based on route
         this.unauthorized = !(this.isUserNavBarVisible || this.isDriverNavBarVisible 
          || this.isAdminNavBarVisible || this.isSuperAdminNavBarVisible);
      }
    });
  }

  ngOnInit(): void {
    // Retrieve the authenticated user type from sessionStorage
    this.authenticatedUserType = sessionStorage.getItem('authenticatedUserType');

    // Do something with the retrieved value
    console.log('Authenticated User Type in Index Component:', this.authenticatedUserType);
  }

  logout() {
    // Clear session-related information
    sessionStorage.removeItem('authenticatedUserType');
  
    // Notify other components about the successful logout
    this.authService.setLogoutSuccess(true);

    // Redirect to home or any other appropriate route
    this.router.navigate(['/home']);

  }
  
}
