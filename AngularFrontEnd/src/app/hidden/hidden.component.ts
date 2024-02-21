import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../controller-calls/admin.service';
import { Router } from '@angular/router';
import { AdminKeyResponse } from '../pojos/AdminKeyResponse';
import { AttemptsService } from '../controller-calls/attempts.service';

@Component({
  selector: 'app-hidden',
  templateUrl: './hidden.component.html',
  styleUrls: ['./hidden.component.css']
})
export class HiddenComponent implements OnInit {
  adminCodeForm: FormGroup;
  codeError: string;
  isLoading: boolean = false;
  attempts: number = 0;

  constructor(private formBuilder: FormBuilder, private adminService: AdminService, 
    private router: Router, private attemptsService: AttemptsService) {
      this.adminCodeForm = this.formBuilder.group({
        adminCode: ['', Validators.required]
      });
    }
  ngOnInit(): void {
      
  }

  onValidSuperAdmin() {
    if (this.adminCodeForm.valid && !this.isLoading && this.attempts < 5) {
      this.isLoading = true;
      const adminKey = this.adminCodeForm.get('adminCode').value;

      this.adminService.verifyAdminKey(adminKey).subscribe(
        (response: AdminKeyResponse) => {
          if (response.message === 'Admin key is correct.') {
            sessionStorage.setItem('authenticatedUserType', 'superadmin');
            const adminKey = this.adminCodeForm.get('adminCode').value;
            sessionStorage.setItem('adminKey', response.adminKey);
            console.log('Authenticated User Type: Super Admin Privilege');
            this.router.navigate(['/superadmin']);
            console.log(this.attempts);
          } else {
            this.codeError = response.message;
            this.attempts++; // Increment attempts on incorrect attempt
            this.attemptsService.incrementAttempts(); // Increment attempts on incorrect attempt
            if (this.attempts >= 5) {
              this.router.navigate(['/home']); // Redirect to /home after 5 attempts
            }
          }
        },
        error => {
          console.error(error);
          this.codeError = 'Invalid Admin Code';
          this.attempts++; // Increment attempts on error
          this.attemptsService.incrementAttempts(); // Increment attempts on error
          if (this.attempts >= 5) {
            this.router.navigate(['/home']); // Redirect to /home after 5 attempts
          }
        }
      ).add(() => {
        this.isLoading = false;
      });
    }
  }
}
