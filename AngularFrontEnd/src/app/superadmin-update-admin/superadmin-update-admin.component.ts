import { Component, OnInit } from '@angular/core';
import { Admin } from '../pojos/Admin';
import { AdminService } from '../controller-calls/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminResponse } from '../pojos/AdminResponse';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-superadmin-update-admin',
  templateUrl: './superadmin-update-admin.component.html',
  styleUrls: ['./superadmin-update-admin.component.css']
})
export class SuperadminUpdateAdminComponent implements OnInit {

  adminId: string;
  oldAdminData: Admin; 
  updateAdminForm: FormGroup;
  usernameTaken: boolean;
  emailTaken: boolean;
  mobileNumberTaken: boolean;
  showPassword = false;
  updateError: string;

  ngOnInit(): void {
    this.initializeForm();
    this.route.params.subscribe(params => {
      this.adminId = params['id']; // Get the admin ID from the route URL
      this.loadAdminData(this.adminId); // Load admin data based on the ID
    });
  }

  constructor(private route: ActivatedRoute, private adminService: AdminService, private router: Router, private formBuilder: FormBuilder) { }
  
  loadAdminData(adminId: string): void {
    this.adminService.getAdminById(adminId).subscribe((response: AdminResponse) => {
      this.oldAdminData = response.admin; // Assign fetched admin data to oldAdminData
    });
  }

  initializeForm(): void {
    this.updateAdminForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(5)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(10)]],
      mobileNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[89]\\d{7}$')]], // Mobile number starts with 8 or 9, followed by 7 digits
      username: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern('^[A][a-zA-Z0-9]*$')]], // Username starts with A as uppercase letter, followed by letters or numbers
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255), Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[@]).{8,}$')]] // Password: At least 1 number, 1 uppercase, 1 "@", At least length 8
    }) as FormGroup;
  }

  mobileNumberValidator(mobileNumber: string): boolean {
    const mobileNumberPattern = /^[+]\d{2}([8-9])\d{7}$/;
    return mobileNumberPattern.test(mobileNumber);
  }

  updateAdmin() {
    const adminId = this.adminId;
    const username = this.updateAdminForm.get('username').value;
    const email = this.updateAdminForm.get('email').value;
    const mobileNumber = '+65' + this.updateAdminForm.get('mobileNumber').value;
    console.log('Admin Id:', adminId);
    // Check if the provided username and email and mobile number are taken by other admins
    this.adminService.checkUsernameAndEmailAndMobileNumberById(adminId, username, email, mobileNumber).subscribe({
      next: (result: { usernameTaken: boolean, emailTaken: boolean, mobileNumberTaken: boolean }) => {
        this.usernameTaken = result.usernameTaken;
        this.emailTaken = result.emailTaken;
        this.mobileNumberTaken = result.mobileNumberTaken;
    
        if (!this.usernameTaken && !this.emailTaken && !this.mobileNumberTaken) {
          const adminToUpdate = { ...this.updateAdminForm.value }; // Copy the form value
          adminToUpdate.mobileNumber = '+65' + adminToUpdate.mobileNumber; // Singapore code
    
          if (this.mobileNumberValidator(adminToUpdate.mobileNumber)) {
            // Update the admin
            this.adminService.updateAdmin(adminId, adminToUpdate).subscribe({
              next: () => {
                this.router.navigate(['/superadmin/viewAdmins'], { state: { success: true } });
              },
              error: (error) => {
                console.error('Error updating admin:', error);
                this.updateError = 'An error occurred while updating admin.';
              }
            });
          } else {
            this.updateError = 'Invalid Mobile Number.';
          }
        } else {
          // If username or email or mobile number is taken, display an error message
          if (this.usernameTaken) {
            this.updateAdminForm.get('username').setErrors({ taken: true });
            this.updateError = 'Username is already taken!';
          }
          if (this.emailTaken) {
            this.updateAdminForm.get('email').setErrors({ taken: true });
            this.updateError = 'Email is already taken!';
          }
          if (this.mobileNumberTaken) {
            this.updateAdminForm.get('mobileNumber').setErrors({ taken: true });
            this.updateError = 'Mobile Number is already taken!';
          }
          if (this.usernameTaken && this.emailTaken) {
            this.updateAdminForm.get('username').setErrors({ taken: true });
            this.updateAdminForm.get('email').setErrors({ taken: true });
            this.updateError = 'Username & Email is already taken!';
          }
          if (this.usernameTaken && this.mobileNumberTaken) {
            this.updateAdminForm.get('username').setErrors({ taken: true });
            this.updateAdminForm.get('mobileNumber').setErrors({ taken: true });
            this.updateError = 'Username & Mobile Number is already taken!';
          }
          if (this.emailTaken && this.mobileNumberTaken) {
            this.updateAdminForm.get('email').setErrors({ taken: true });
            this.updateAdminForm.get('mobileNumber').setErrors({ taken: true });
            this.updateError = 'Email & Mobile Number is already taken!';
          }
          if (this.usernameTaken && this.emailTaken && this.mobileNumberTaken) {
            this.updateAdminForm.get('username').setErrors({ taken: true });
            this.updateAdminForm.get('email').setErrors({ taken: true });
            this.updateAdminForm.get('mobileNumber').setErrors({ taken: true });
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
    const passwordControl = this.updateAdminForm.get('password');
    if (passwordControl) {
      const passwordInput = document.getElementById('passwordInput') as HTMLInputElement;
      if (passwordInput) {
        this.showPassword = !this.showPassword;
        passwordInput.type = this.showPassword ? 'text' : 'password';
      }
    }
  }
}
