import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../controller-calls/user.service';
import { Router } from '@angular/router';
import { CabType } from '../pojos/CabType';
import { Role } from '../pojos/Role';
import { User } from '../pojos/User';
import { UserResponse } from '../pojos/UserResponse';

@Component({
  selector: 'app-admin-create-user',
  templateUrl: './admin-create-user.component.html',
  styleUrls: ['./admin-create-user.component.css']
})
export class AdminCreateUserComponent implements OnInit{
  
  registerUserForm: FormGroup;
  CabType = CabType;
  registerError: string;
  showPassword = false;



  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router){}

  ngOnInit(): void {
    this.initializeForm();
  }


  initializeForm(): void {
    this.registerUserForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(5)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(10)]],
      mobileNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[89]\\d{7}$')]], // Mobile number starts with 8 or 9, followed by 7 digits
      cabPreferences: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern('^[U][a-zA-Z0-9]*$')]], // Username starts with U as uppercase letter, followed by letters or numbers
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255), Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[@]).{8,}$')]] // Password: At least 1 number, 1 uppercase, 1 "@", At least length 8
    }) as FormGroup;;
  }

  mobileNumberValidator(mobileNumber: string): boolean {
    const mobileNumberPattern = /^[+]\d{2}([8-9])\d{7}$/;
    return mobileNumberPattern.test(mobileNumber);
  }

  registerUser() {
    if (this.registerUserForm.valid) {
      const mobileNumber = '+65' + this.registerUserForm.get('mobileNumber').value;
      if (this.mobileNumberValidator(mobileNumber)) {
        // Getting fields from form inputs
        const firstName = this.registerUserForm.get('firstName').value;
        const lastName = this.registerUserForm.get('lastName').value;
        const email = this.registerUserForm.get('email').value;
        const username = this.registerUserForm.get('username').value;
        const password = this.registerUserForm.get('password').value;
        const cabPreferences = this.registerUserForm.get('cabPreferences').value;
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
                    this.router.navigate(['/admin/viewUsers'], { state: { success: true, user: response.user } });
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
                this.registerUserForm.get('username').setErrors({ taken: true });
                this.registerError = 'Username is already taken!';
              }
              if (emailTaken) {
                this.registerUserForm.get('email').setErrors({ taken: true });
                this.registerError = 'Email is already taken!';
              }
              if (mobileNumberTaken) {
                this.registerUserForm.get('mobileNumber').setErrors({ taken: true });
                this.registerError = 'Mobile number is already taken!';
              }
              if (usernameTaken && emailTaken) {
                this.registerUserForm.get('username').setErrors({ taken: true });
                this.registerUserForm.get('email').setErrors({ taken: true });
                this.registerError = 'Username & Email is already taken!';
              }
              if (usernameTaken && mobileNumberTaken) {
                this.registerUserForm.get('username').setErrors({ taken: true });
                this.registerUserForm.get('mobileNumber').setErrors({ taken: true });
                this.registerError = 'Username & Mobile Number is already taken!';
              }
              if (emailTaken && mobileNumberTaken) {
                this.registerUserForm.get('email').setErrors({ taken: true });
                this.registerUserForm.get('mobileNumber').setErrors({ taken: true });
                this.registerError = 'Email & Mobile Number is already taken!';
              }
              if (usernameTaken && emailTaken && mobileNumberTaken) {
                this.registerUserForm.get('username').setErrors({ taken: true });
                this.registerUserForm.get('email').setErrors({ taken: true });
                this.registerUserForm.get('mobileNumber').setErrors({ taken: true });
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

  togglePasswordVisibility() {
    const passwordControl = this.registerUserForm.get('password');
    if (passwordControl) {
      const passwordInput = document.getElementById('passwordInput') as HTMLInputElement;
      if (passwordInput) {
        this.showPassword = !this.showPassword;
        passwordInput.type = this.showPassword ? 'text' : 'password';
      }
    }
  }
}
