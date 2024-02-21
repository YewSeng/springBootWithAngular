import { Component, OnInit } from '@angular/core';
import { User } from '../pojos/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../controller-calls/user.service';
import { UserResponse } from '../pojos/UserResponse';

@Component({
  selector: 'app-user-update-user',
  templateUrl: './user-update-user.component.html',
  styleUrls: ['./user-update-user.component.css']
})
export class UserUpdateUserComponent implements OnInit{

   
  userId: string = sessionStorage.getItem('authenticatedId');
  oldUserData: User; 
  updateUserForm: FormGroup;
  usernameTaken: boolean;
  emailTaken: boolean;
  mobileNumberTaken: boolean;
  showPassword = false;
  updateError: string;

  ngOnInit(): void {
    this.initializeForm();
    this.route.params.subscribe(params => {
      this.userId = params['id']; // Get the user ID from the route URL
      this.loadUserData(this.userId); // Load User data based on the ID
    });
  }

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router, private formBuilder: FormBuilder) { }
  
  loadUserData(userId: string): void {
    this.userService.getUserById(userId).subscribe((response: UserResponse) => {
      this.oldUserData = response.user; // Assign fetched user data to oldUserData
    });
  }

  initializeForm(): void {
    this.updateUserForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(5)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(10)]],
      mobileNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[89]\\d{7}$')]], // Mobile number starts with 8 or 9, followed by 7 digits
      cabPreferences: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern('^[U][a-zA-Z0-9]*$')]], // Username starts with U as uppercase letter, followed by letters or numbers
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255), Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[@]).{8,}$')]] // Password: At least 1 number, 1 uppercase, 1 "@", At least length 8
    }) as FormGroup;
  }

  mobileNumberValidator(mobileNumber: string): boolean {
    const mobileNumberPattern = /^[+]\d{2}([8-9])\d{7}$/;
    return mobileNumberPattern.test(mobileNumber);
  }

  updateUser() {
    const userId = this.userId;
    const username = this.updateUserForm.get('username').value;
    const email = this.updateUserForm.get('email').value;
    const mobileNumber = '+65' + this.updateUserForm.get('mobileNumber').value;
    const password = this.updateUserForm.get('password').value;

    // Check if the provided username, email, and mobile number are taken by other users
    this.userService.checkUsernameAndEmailAndMobileNumberById(userId, username, email, mobileNumber).subscribe({
        next: (result: { usernameTaken: boolean, emailTaken: boolean, mobileNumberTaken: boolean }) => {
            this.usernameTaken = result.usernameTaken;
            this.emailTaken = result.emailTaken;
            this.mobileNumberTaken = result.mobileNumberTaken;

            if (!this.usernameTaken && !this.emailTaken && !this.mobileNumberTaken) {
                // Merge oldUserData and form value
                const userToUpdate = { ...this.oldUserData, ...this.updateUserForm.value };

                // Modify relevant properties
                userToUpdate.mobileNumber = '+65' + userToUpdate.mobileNumber;
                userToUpdate.username = username;
                userToUpdate.password = password;
                userToUpdate.email = email;
                userToUpdate.cabPreferences = this.updateUserForm.get('cabPreferences').value;

                // Update the user
                this.userService.updateUser(userId, userToUpdate).subscribe({
                    next: () => {
                        this.router.navigate(['/user/viewProfile/' + this.userId], { state: { success: true } });
                    },
                    error: (error) => {
                        console.error('Error updating user:', error);
                        this.updateError = 'An error occurred while updating user.';
                    }
                });
            } else {
               // If username or email or mobile number is taken, display an error message
              if (this.usernameTaken) {
                this.updateUserForm.get('username').setErrors({ taken: true });
                this.updateError = 'Username is already taken!';
              }
              if (this.emailTaken) {
                this.updateUserForm.get('email').setErrors({ taken: true });
                this.updateError = 'Email is already taken!';
              }
              if (this.mobileNumberTaken) {
                this.updateUserForm.get('mobileNumber').setErrors({ taken: true });
                this.updateError = 'Mobile Number is already taken!';
              }
              if (this.usernameTaken && this.emailTaken) {
                this.updateUserForm.get('username').setErrors({ taken: true });
                this.updateUserForm.get('email').setErrors({ taken: true });
                this.updateError = 'Username & Email is already taken!';
              }
              if (this.usernameTaken && this.mobileNumberTaken) {
                this.updateUserForm.get('username').setErrors({ taken: true });
                this.updateUserForm.get('mobileNumber').setErrors({ taken: true });
                this.updateError = 'Username & Mobile Number is already taken!';
              }
              if (this.emailTaken && this.mobileNumberTaken) {
                this.updateUserForm.get('email').setErrors({ taken: true });
                this.updateUserForm.get('mobileNumber').setErrors({ taken: true });
                this.updateError = 'Email & Mobile Number is already taken!';
              }
              if (this.usernameTaken && this.emailTaken && this.mobileNumberTaken) {
                this.updateUserForm.get('username').setErrors({ taken: true });
                this.updateUserForm.get('email').setErrors({ taken: true });
                this.updateUserForm.get('mobileNumber').setErrors({ taken: true });
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
    const passwordControl = this.updateUserForm.get('password');
    if (passwordControl) {
      const passwordInput = document.getElementById('passwordInput') as HTMLInputElement;
      if (passwordInput) {
        this.showPassword = !this.showPassword;
        passwordInput.type = this.showPassword ? 'text' : 'password';
      }
    }
  }

}
