import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DriverService } from '../controller-calls/driver.service';
import { DriverResponse } from '../pojos/DriverResponse';
import { CabType } from '../pojos/CabType';
import { Router } from '@angular/router';
import { Driver } from '../pojos/Driver';
import { Role } from '../pojos/Role';

@Component({
  selector: 'app-admin-create-driver',
  templateUrl: './admin-create-driver.component.html',
  styleUrls: ['./admin-create-driver.component.css']
})
export class AdminCreateDriverComponent implements OnInit {
  
  registerDriverForm: FormGroup;
  CabType = CabType;
  registerError: string;
  showPassword = false;



  constructor(private driverService: DriverService, private formBuilder: FormBuilder, private router: Router){}

  ngOnInit(): void {
    this.initializeForm();
  }


  initializeForm(): void {
    this.registerDriverForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(5)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(10)]],
      mobileNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[89]\\d{7}$')]], // Mobile number starts with 8 or 9, followed by 7 digits
      vehicleType: ['', Validators.required],
      carBrand: ['', [Validators.required, Validators.minLength(3)]],
      carColor: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern('^[D][a-zA-Z0-9]*$')]], // Username starts with D as uppercase letter, followed by letters or numbers
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255), Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[@]).{8,}$')]] // Password: At least 1 number, 1 uppercase, 1 "@", At least length 8
    }) as FormGroup;;
  }

  mobileNumberValidator(mobileNumber: string): boolean {
    const mobileNumberPattern = /^[+]\d{2}([8-9])\d{7}$/;
    return mobileNumberPattern.test(mobileNumber);
  }

  registerDriver() {
    if (this.registerDriverForm.valid) {
      const mobileNumber = '+65' + this.registerDriverForm.get('mobileNumber').value;
      if (this.mobileNumberValidator(mobileNumber)) {
        // Getting fields from form inputs
        const firstName = this.registerDriverForm.get('firstName').value;
        const lastName = this.registerDriverForm.get('lastName').value;
        const email = this.registerDriverForm.get('email').value;
        const username = this.registerDriverForm.get('username').value;
        const password = this.registerDriverForm.get('password').value;
        const vehicleType = this.registerDriverForm.get('vehicleType').value;
        const carBrand = this.registerDriverForm.get('carBrand').value;
        const carColor = this.registerDriverForm.get('carColor').value;
        const registrationDate = new Date(); // Get current date and time
        // Instantiate Driver object
        const driver = new Driver(firstName, lastName, mobileNumber, email, username, password, vehicleType, carBrand, carColor, registrationDate, Role.DRIVER);

        // Check if username or email or mobile numberis already taken
        this.driverService.checkUsernameAndEmailAndMobileNumber(username, email, mobileNumber).subscribe({
          next: (result: any) => {
            const { usernameTaken, emailTaken, mobileNumberTaken } = result;
            if (!usernameTaken && !emailTaken && !mobileNumberTaken) {
              // Call the service method to register the driver
              this.driverService.createDriver(driver)
                .subscribe(
                  (response: DriverResponse) => {
                    // Handle success response
                    console.log('Driver registered successfully', response);
                    // Pass the new user details to the View Drivers page
                    this.router.navigate(['/admin/viewDrivers'], { state: { success: true, driver: response.driver } });
                  },
                  (error) => {
                    // Handle error response
                    console.error('Error occurred while registering driver', error);
                    this.registerError = 'Failed to register driver. Please try again later.';
                  }
                );
            } else {
              // Username or email is already taken
              if (usernameTaken) {
                this.registerDriverForm.get('username').setErrors({ taken: true });
                this.registerError = 'Username is already taken!';
              }
              if (emailTaken) {
                this.registerDriverForm.get('email').setErrors({ taken: true });
                this.registerError = 'Email is already taken!';
              }
              if (mobileNumberTaken) {
                this.registerDriverForm.get('mobileNumber').setErrors({ taken: true });
                this.registerError = 'Mobile number is already taken!';
              }
              if (usernameTaken && emailTaken) {
                this.registerDriverForm.get('username').setErrors({ taken: true });
                this.registerDriverForm.get('email').setErrors({ taken: true });
                this.registerError = 'Username & Email is already taken!';
              }
              if (usernameTaken && mobileNumberTaken) {
                this.registerDriverForm.get('username').setErrors({ taken: true });
                this.registerDriverForm.get('mobileNumber').setErrors({ taken: true });
                this.registerError = 'Username & Mobile Number is already taken!';
              }
              if (emailTaken && mobileNumberTaken) {
                this.registerDriverForm.get('email').setErrors({ taken: true });
                this.registerDriverForm.get('mobileNumber').setErrors({ taken: true });
                this.registerError = 'Email & Mobile Number is already taken!';
              }
              if (usernameTaken && emailTaken && mobileNumberTaken) {
                this.registerDriverForm.get('username').setErrors({ taken: true });
                this.registerDriverForm.get('email').setErrors({ taken: true });
                this.registerDriverForm.get('mobileNumber').setErrors({ taken: true });
                this.registerError = 'Username & Email & Mobile Number is already taken!';
              }
            }
          },
          error: (error) => {
            console.error('Error occurred while checking username and email:', error);
            this.registerError = 'Failed to register driver. Please try again later.';
          }
        });
      }
    }
  }

  togglePasswordVisibility() {
    const passwordControl = this.registerDriverForm.get('password');
    if (passwordControl) {
      const passwordInput = document.getElementById('passwordInput') as HTMLInputElement;
      if (passwordInput) {
        this.showPassword = !this.showPassword;
        passwordInput.type = this.showPassword ? 'text' : 'password';
      }
    }
  }
}
