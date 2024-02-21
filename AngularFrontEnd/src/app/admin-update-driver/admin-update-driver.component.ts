import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DriverService } from '../controller-calls/driver.service';
import { Driver } from '../pojos/Driver';
import { DriverResponse } from '../pojos/DriverResponse';

@Component({
  selector: 'app-admin-update-driver',
  templateUrl: './admin-update-driver.component.html',
  styleUrls: ['./admin-update-driver.component.css']
})
export class AdminUpdateDriverComponent implements OnInit {
 
  driverId: string;
  oldDriverData: Driver; 
  updateDriverForm: FormGroup;
  usernameTaken: boolean;
  emailTaken: boolean;
  mobileNumberTaken: boolean;
  showPassword = false;
  updateError: string;

  ngOnInit(): void {
    this.initializeForm();
    this.route.params.subscribe(params => {
      this.driverId = params['id']; // Get the user ID from the route URL
      this.loadUserData(this.driverId); // Load User data based on the ID
    });
  }

  constructor(private route: ActivatedRoute, private driverService: DriverService, private router: Router, private formBuilder: FormBuilder) { }
  
  loadUserData(driverId: string): void {
    this.driverService.getDriverById(driverId).subscribe((response: DriverResponse) => {
      this.oldDriverData = response.driver; // Assign fetched user data to oldDriverData
    });
  }

  initializeForm(): void {
    this.updateDriverForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(5)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(10)]],
      mobileNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[89]\\d{7}$')]], // Mobile number starts with 8 or 9, followed by 7 digits
      vehicleType: ['', Validators.required],
      carBrand: ['', [Validators.required, Validators.minLength(3)]],
      carColor: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern('^[D][a-zA-Z0-9]*$')]], // Username starts with D as uppercase letter, followed by letters or numbers
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255), Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[@]).{8,}$')]] // Password: At least 1 number, 1 uppercase, 1 "@", At least length 8
    }) as FormGroup;
  }

  mobileNumberValidator(mobileNumber: string): boolean {
    const mobileNumberPattern = /^[+]\d{2}([8-9])\d{7}$/;
    return mobileNumberPattern.test(mobileNumber);
  }

  updateDriver() {
    const userId = this.driverId;
    const username = this.updateDriverForm.get('username').value;
    const email = this.updateDriverForm.get('email').value;
    const mobileNumber = '+65' + this.updateDriverForm.get('mobileNumber').value;

    // Check if the provided username, email, and mobile number are taken by other drivers
    this.driverService.checkUsernameAndEmailAndMobileNumberById(userId, username, email, mobileNumber).subscribe({
        next: (result: { usernameTaken: boolean, emailTaken: boolean, mobileNumberTaken: boolean }) => {
            this.usernameTaken = result.usernameTaken;
            this.emailTaken = result.emailTaken;
            this.mobileNumberTaken = result.mobileNumberTaken;

            if (!this.usernameTaken && !this.emailTaken && !this.mobileNumberTaken) {
                // Merge oldDriverData and form value
                const driverToUpdate = { ...this.updateDriverForm.value };

                // Modify relevant properties
                driverToUpdate.mobileNumber = mobileNumber;
                driverToUpdate.username = username;
                driverToUpdate.email = email;
                driverToUpdate.vehicleType = this.updateDriverForm.get('vehicleType').value;

                // Update the driver
                this.driverService.updateDriver(userId, driverToUpdate).subscribe({
                    next: () => {
                        this.router.navigate(['/admin/viewDrivers'], { state: { success: true } });
                    },
                    error: (error) => {
                        console.error('Error updating driver:', error);
                        this.updateError = 'An error occurred while updating driver.';
                    }
                });
            } else {
               // If username or email or mobile number is taken, display an error message
              if (this.usernameTaken) {
                this.updateDriverForm.get('username').setErrors({ taken: true });
                this.updateError = 'Username is already taken!';
              }
              if (this.emailTaken) {
                this.updateDriverForm.get('email').setErrors({ taken: true });
                this.updateError = 'Email is already taken!';
              }
              if (this.mobileNumberTaken) {
                this.updateDriverForm.get('mobileNumber').setErrors({ taken: true });
                this.updateError = 'Mobile Number is already taken!';
              }
              if (this.usernameTaken && this.emailTaken) {
                this.updateDriverForm.get('username').setErrors({ taken: true });
                this.updateDriverForm.get('email').setErrors({ taken: true });
                this.updateError = 'Username & Email is already taken!';
              }
              if (this.usernameTaken && this.mobileNumberTaken) {
                this.updateDriverForm.get('username').setErrors({ taken: true });
                this.updateDriverForm.get('mobileNumber').setErrors({ taken: true });
                this.updateError = 'Username & Mobile Number is already taken!';
              }
              if (this.emailTaken && this.mobileNumberTaken) {
                this.updateDriverForm.get('email').setErrors({ taken: true });
                this.updateDriverForm.get('mobileNumber').setErrors({ taken: true });
                this.updateError = 'Email & Mobile Number is already taken!';
              }
              if (this.usernameTaken && this.emailTaken && this.mobileNumberTaken) {
                this.updateDriverForm.get('username').setErrors({ taken: true });
                this.updateDriverForm.get('email').setErrors({ taken: true });
                this.updateDriverForm.get('mobileNumber').setErrors({ taken: true });
                this.updateError = 'Username & Email & Mobile Number is already taken!';
              }
            }
        },
        error: (error) => {
            this.updateError = 'Error checking username, email, and mobile number: ' + error.message;
        }
    });
  }

  
  togglePasswordVisibility() {
    const passwordControl = this.updateDriverForm.get('password');
    if (passwordControl) {
      const passwordInput = document.getElementById('passwordInput') as HTMLInputElement;
      if (passwordInput) {
        this.showPassword = !this.showPassword;
        passwordInput.type = this.showPassword ? 'text' : 'password';
      }
    }
  }

}
