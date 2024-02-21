import { Component, OnInit } from '@angular/core';
import { IndexService } from '../controller-calls/index.service';
import { Router } from '@angular/router';
import { AuthLoginResponse } from '../pojos/AuthLoginResponse';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../controller-calls/auth.service';
import { AttemptsService } from '../controller-calls/attempts.service';
import { UnauthorizedAccessService } from '../controller-calls/unauthorized-access.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  loginError: string; // Add this property
  unauthorizedAccessError: string; // Add this property
  logoutSuccess: boolean = false;

  constructor(private formBuilder: FormBuilder, private indexService: IndexService, 
    private router: Router, private authService: AuthService, 
    private attemptsService: AttemptsService, private unauthorizedAccessService: UnauthorizedAccessService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.logoutSuccess$.subscribe((status) => {
      this.logoutSuccess = status;
  
      // Additional logic if needed when the logout status changes
      this.attemptsService.attempts$.subscribe((attempts) => {
        if (attempts >= 5) {
          this.loginError = 'Too many login attempts. Please try again later.';
        }
      });
  
      // Check if there is an unauthorized access error in the route data
      if (this.router.getCurrentNavigation()?.extras.state?.['unauthorizedAccessError']) {
        this.unauthorizedAccessError = this.router.getCurrentNavigation().extras.state['unauthorizedAccessError'];
      }
      
      // Check if there is an unauthorized access error in the service
      this.unauthorizedAccessService.getUnauthorizedAccessError().subscribe((error) => {
        this.unauthorizedAccessError = error;
      });
    });
  }

  login() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username').value;
      const password = this.loginForm.get('password').value;
  
      // Call the login method from IndexService
      this.indexService.login({ username, password }).subscribe(
        (response: AuthLoginResponse) => {
          if (response.authenticated) {
            // Store the authenticated user type in sessionStorage
            sessionStorage.setItem('authenticatedUserType', response.userType);
            console.log('Authenticated User Type:', response.userType);

            sessionStorage.setItem('authenticatedUsername', username);
            console.log('Authenticated Username:', username, ' has logined as a ', response.userType);

            sessionStorage.setItem('authenticatedId', response.userDetails.id);
            console.log('Authenticated ID: ', response.userDetails.id);

            // Handle the response here
            console.log(response);
  
            // Redirect based on user type
            switch (response.userType) {
              case 'user':
                console.log('User logged in');
                this.router.navigate(['/user']);
                break;
              case 'driver':
                console.log('Driver logged in');
                this.router.navigate(['/driver']);
                break;
              case 'admin':
                console.log('Admin logged in');
                this.router.navigate(['/admin']); 
                break;
              default:
                console.error('Unknown user type');
                break;
            }
          } else {
            // Handle authentication failure
            this.loginError = response.message;
          }
        },
        error => {
          // Handle errors
          console.error(error);
          this.loginError = 'Invalid Username and/or Password.';
        }
      );
    }
  }

  togglePasswordVisibility() {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl) {
      const passwordInput = document.getElementById('passwordInput') as HTMLInputElement;
      if (passwordInput) {
        this.showPassword = !this.showPassword;
        passwordInput.type = this.showPassword ? 'text' : 'password';
      }
    }
  }
}
