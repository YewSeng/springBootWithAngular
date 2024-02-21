import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../controller-calls/admin.service';
import { Admin } from '../pojos/Admin';
import { Role } from '../pojos/Role';
import { AdminResponse } from '../pojos/AdminResponse';

@Component({
  selector: 'app-superadmin-create-admin',
  templateUrl: './superadmin-create-admin.component.html',
  styleUrls: ['./superadmin-create-admin.component.css']
})
export class SuperadminCreateAdminComponent implements OnInit {

  registerAdminForm: FormGroup;
  registerError: string;
  showPassword = false;

  
  ngOnInit(): void {
    this.initializeForm();
  }

  constructor(private router: Router, private formBuilder: FormBuilder, private adminService: AdminService){}

  initializeForm(): void {
    this.registerAdminForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(5)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(10)]],
      mobileNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[89]\\d{7}$')]], // Mobile number starts with 8 or 9, followed by 7 digits
      username: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern('^[A][a-zA-Z0-9]*$')]], // Username starts with A as uppercase letter, followed by letters or numbers
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255), Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[@]).{8,}$')]] // Password: At least 1 number, 1 uppercase, 1 "@", At least length 8
    }) as FormGroup;;
  }

  mobileNumberValidator(mobileNumber: string): boolean {
    const mobileNumberPattern = /^[+]\d{2}([8-9])\d{7}$/;
    return mobileNumberPattern.test(mobileNumber);
  }

  registerAdmin() {
    if (this.registerAdminForm.valid) {
      const mobileNumber = '+65' + this.registerAdminForm.get('mobileNumber').value;
      if (this.mobileNumberValidator(mobileNumber)) {
        // Getting adminKey from session storage
        const adminKey = sessionStorage.getItem('adminKey');
        // Getting fields from form inputs
        const firstName = this.registerAdminForm.get('firstName').value;
        const lastName = this.registerAdminForm.get('lastName').value;
        const email = this.registerAdminForm.get('email').value;
        const username = this.registerAdminForm.get('username').value;
        const password = this.registerAdminForm.get('password').value;
        const registrationDate = new Date(); // Get current date and time
        // Instantiate Admin object
        const admin = new Admin(firstName, lastName, mobileNumber, email, username, password, registrationDate, Role.ADMIN);

        // Check if username or email or mobile numberis already taken
        this.adminService.checkUsernameAndEmailAndMobileNumber(username, email, mobileNumber).subscribe({
          next: (result: any) => {
            const { usernameTaken, emailTaken, mobileNumberTaken } = result;
            if (!usernameTaken && !emailTaken && !mobileNumberTaken) {
              // Call the service method to register the admin
              this.adminService.registerAdmin(admin, adminKey)
                .subscribe(
                  (response: AdminResponse) => {
                    // Handle success response
                    console.log('Admin registered successfully', response);
                    // Pass the new admin details to the View Admins page
                    this.router.navigate(['/superadmin/viewAdmins'], { state: { success: true, admin: response.admin } });
                  },
                  (error) => {
                    // Handle error response
                    console.error('Error occurred while registering admin', error);
                    this.registerError = 'Failed to register admin. Please try again later.';
                  }
                );
            } else {
              // Username or email is already taken
              if (usernameTaken) {
                this.registerAdminForm.get('username').setErrors({ taken: true });
                this.registerError = 'Username is already taken!';
              }
              if (emailTaken) {
                this.registerAdminForm.get('email').setErrors({ taken: true });
                this.registerError = 'Email is already taken!';
              }
              if (mobileNumberTaken) {
                this.registerAdminForm.get('mobileNumber').setErrors({ taken: true });
                this.registerError = 'Mobile number is already taken!';
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
    const passwordControl = this.registerAdminForm.get('password');
    if (passwordControl) {
      const passwordInput = document.getElementById('passwordInput') as HTMLInputElement;
      if (passwordInput) {
        this.showPassword = !this.showPassword;
        passwordInput.type = this.showPassword ? 'text' : 'password';
      }
    }
  }
}
