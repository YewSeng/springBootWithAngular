import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CabType } from '../pojos/CabType';
import { UserService } from '../controller-calls/user.service';
import { Router } from '@angular/router';
import { DriverService } from '../controller-calls/driver.service';
import { User } from '../pojos/User';
import { UserResponse } from '../pojos/UserResponse';
import { Role } from '../pojos/Role';
import { DriverResponse } from '../pojos/DriverResponse';
import { Driver } from '../pojos/Driver';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerUserForm: FormGroup;
  registerDriverForm: FormGroup;
  CabType = CabType;
  registerError: string;
  showPassword = false;
  isUserFormVisible = false;
  isDriverFormVisible = false;

  constructor(private userService: UserService, private driverService: DriverService, private formBuilder: FormBuilder, private router: Router){}

  ngOnInit(): void {
    this.initializeUserForm();
    this.initializeDriverForm();
  }

  initializeUserForm(): void {
    this.registerUserForm = this.formBuilder.group({
      userFirstName: ['', [Validators.required, Validators.minLength(5)]],
      userLastName: ['', [Validators.required, Validators.minLength(3)]],
      userEmail: ['', [Validators.required, Validators.email, Validators.minLength(10)]],
      userMobileNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[89]\\d{7}$')]], // Mobile number starts with 8 or 9, followed by 7 digits
      userCabPreferences: ['', Validators.required],
      userUsername: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern('^[U][a-zA-Z0-9]*$')]], // Username starts with U as uppercase letter, followed by letters or numbers
      userPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255), Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[@]).{8,}$')]] // Password: At least 1 number, 1 uppercase, 1 "@", At least length 8
    }) as FormGroup;;
  }

  initializeDriverForm(): void {
    this.registerDriverForm = this.formBuilder.group({
      driverFirstName: ['', [Validators.required, Validators.minLength(5)]],
      driverLastName: ['', [Validators.required, Validators.minLength(3)]],
      driverEmail: ['', [Validators.required, Validators.email, Validators.minLength(10)]],
      driverMobileNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[89]\\d{7}$')]], // Mobile number starts with 8 or 9, followed by 7 digits
      driverVehicleType: ['', Validators.required],
      driverCarBrand: ['', [Validators.required, Validators.minLength(3)]],
      driverCarColor: ['', [Validators.required, Validators.minLength(3)]],
      driverUsername: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern('^[D][a-zA-Z0-9]*$')]], // Username starts with D as uppercase letter, followed by letters or numbers
      driverPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255), Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[@]).{8,}$')]] // Password: At least 1 number, 1 uppercase, 1 "@", At least length 8
    }) as FormGroup;;
  }

  showUserForm() {
    this.isUserFormVisible = true;
    this.isDriverFormVisible = false;
  }

  showDriverForm() {
    this.isDriverFormVisible = true;
    this.isUserFormVisible = false;
  }

  mobileNumberValidator(mobileNumber: string): boolean {
    const mobileNumberPattern = /^[+]\d{2}([8-9])\d{7}$/;
    return mobileNumberPattern.test(mobileNumber);
  }

  registerUser() {
    if (this.registerUserForm.valid) {
      const mobileNumber = '+65' + this.registerUserForm.get('userMobileNumber').value;
      if (this.mobileNumberValidator(mobileNumber)) {
        // Getting fields from form inputs
        const firstName = this.registerUserForm.get('userFirstName').value;
        const lastName = this.registerUserForm.get('userLastName').value;
        const email = this.registerUserForm.get('userEmail').value;
        const username = this.registerUserForm.get('userUsername').value;
        const password = this.registerUserForm.get('userPassword').value;
        const cabPreferences = this.registerUserForm.get('userCabPreferences').value;
        const registrationDate = new Date(); // Get current date and time
        // Instantiate User object
        const user = new User(firstName, lastName, mobileNumber, email, username, password, cabPreferences, registrationDate, Role.USER);

        // Check if username or email or mobile numberis already taken
        this.userService.checkUsernameAndEmailAndMobileNumber(username, email, mobileNumber).subscribe({
          next: (result: any) => {
            const { usernameTaken, emailTaken, mobileNumberTaken } = result;
            if (!usernameTaken && !emailTaken && !mobileNumberTaken) {
              // Call the service method to register the user
              this.userService.createUser(user)
                .subscribe(
                  (response: UserResponse) => {
                    // Handle success response
                    console.log('User registered successfully', response);
                    // Pass the new user details to the View Users page
                    this.router.navigate(['/home'], { state: { success: true, user: response.user } });
                  },
                  (error) => {
                    // Handle error response
                    console.error('Error occurred while registering user', error);
                    this.registerError = 'Failed to register user. Please try again later.';
                  }
                );
            } else {
              // Username or email is already taken
              if (usernameTaken) {
                this.registerUserForm.get('userUsername').setErrors({ taken: true });
                this.registerError = 'Username is already taken!';
              }
              if (emailTaken) {
                this.registerUserForm.get('userEmail').setErrors({ taken: true });
                this.registerError = 'Email is already taken!';
              }
              if (mobileNumberTaken) {
                this.registerUserForm.get('userMobileNumber').setErrors({ taken: true });
                this.registerError = 'Mobile number is already taken!';
              }
              if (usernameTaken && emailTaken) {
                this.registerUserForm.get('userUsername').setErrors({ taken: true });
                this.registerUserForm.get('userEmail').setErrors({ taken: true });
                this.registerError = 'Username & Email is already taken!';
              }
              if (usernameTaken && mobileNumberTaken) {
                this.registerUserForm.get('userUsername').setErrors({ taken: true });
                this.registerUserForm.get('userMobileNumber').setErrors({ taken: true });
                this.registerError = 'Username & Mobile Number is already taken!';
              }
              if (emailTaken && mobileNumberTaken) {
                this.registerUserForm.get('userEmail').setErrors({ taken: true });
                this.registerUserForm.get('userMobileNumber').setErrors({ taken: true });
                this.registerError = 'Email & Mobile Number is already taken!';
              }
              if (usernameTaken && emailTaken && mobileNumberTaken) {
                this.registerUserForm.get('userUsername').setErrors({ taken: true });
                this.registerUserForm.get('userEmail').setErrors({ taken: true });
                this.registerUserForm.get('userMobileNumber').setErrors({ taken: true });
                this.registerError = 'Username & Email & Mobile Number is already taken!';
              }
            }
          },
          error: (error) => {
            console.error('Error occurred while checking username and email:', error);
            this.registerError = 'Failed to register admin. Please try again later.';
          }
        });
      }
    }
  }

  registerDriver() {
    if (this.registerDriverForm.valid) {
      const mobileNumber = '+65' + this.registerDriverForm.get('driverMobileNumber').value;
      if (this.mobileNumberValidator(mobileNumber)) {
        // Getting fields from form inputs
        const firstName = this.registerDriverForm.get('driverFirstName').value;
        const lastName = this.registerDriverForm.get('driverLastName').value;
        const email = this.registerDriverForm.get('driverEmail').value;
        const username = this.registerDriverForm.get('driverUsername').value;
        const password = this.registerDriverForm.get('driverPassword').value;
        const vehicleType = this.registerDriverForm.get('driverVehicleType').value;
        const carBrand = this.registerDriverForm.get('driverCarBrand').value;
        const carColor = this.registerDriverForm.get('driverCarColor').value;
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
                    this.router.navigate(['/home'], { state: { success: true, driver: response.driver } });
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
                this.registerDriverForm.get('driverUsername').setErrors({ taken: true });
                this.registerError = 'Username is already taken!';
              }
              if (emailTaken) {
                this.registerDriverForm.get('driverEmail').setErrors({ taken: true });
                this.registerError = 'Email is already taken!';
              }
              if (mobileNumberTaken) {
                this.registerDriverForm.get('driverMobileNumber').setErrors({ taken: true });
                this.registerError = 'Mobile number is already taken!';
              }
              if (usernameTaken && emailTaken) {
                this.registerDriverForm.get('driverUsername').setErrors({ taken: true });
                this.registerDriverForm.get('driverEmail').setErrors({ taken: true });
                this.registerError = 'Username & Email is already taken!';
              }
              if (usernameTaken && mobileNumberTaken) {
                this.registerDriverForm.get('driverUsername').setErrors({ taken: true });
                this.registerDriverForm.get('driverMobileNumber').setErrors({ taken: true });
                this.registerError = 'Username & Mobile Number is already taken!';
              }
              if (emailTaken && mobileNumberTaken) {
                this.registerDriverForm.get('driverEmail').setErrors({ taken: true });
                this.registerDriverForm.get('driverMobileNumber').setErrors({ taken: true });
                this.registerError = 'Email & Mobile Number is already taken!';
              }
              if (usernameTaken && emailTaken && mobileNumberTaken) {
                this.registerDriverForm.get('driverUsername').setErrors({ taken: true });
                this.registerDriverForm.get('driverEmail').setErrors({ taken: true });
                this.registerDriverForm.get('driverMobileNumber').setErrors({ taken: true });
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
  
  toggleUserPasswordVisibility() {
    const passwordControl = this.registerUserForm.get('userPassword');
    if (passwordControl) {
      const passwordInput = document.getElementById('userPasswordInput') as HTMLInputElement;
      if (passwordInput) {
        this.showPassword = !this.showPassword;
        passwordInput.type = this.showPassword ? 'text' : 'password';
      }
    }
  }

  toggleDriverPasswordVisibility() {
    const passwordControl = this.registerDriverForm.get('driverPassword');
    if (passwordControl) {
      const passwordInput = document.getElementById('driverPasswordInput') as HTMLInputElement;
      if (passwordInput) {
        this.showPassword = !this.showPassword;
        passwordInput.type = this.showPassword ? 'text' : 'password';
      }
    }
  }
}
