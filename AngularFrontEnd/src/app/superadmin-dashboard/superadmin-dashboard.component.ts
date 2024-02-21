import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-superadmin-dashboard',
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.css']
})
export class SuperadminDashboardComponent implements OnInit {


  ngOnInit(): void {
    
  }

  constructor(private router: Router){

  }

  goToCreateAdminPage() {
    this.router.navigate(['/superadmin/createAdmin']);
  }

  goToViewAdminsPage() {
    this.router.navigate(['/superadmin/viewAdmins']);
  }

  goToViewEnquiriesPage() {
    this.router.navigate(['/superadmin/viewEnquiries']);
  }
}
