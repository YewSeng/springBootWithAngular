import { Component, OnInit } from '@angular/core';
import { AdminService } from '../controller-calls/admin.service';
import { Router } from '@angular/router';
import { AdminResponse } from '../pojos/AdminResponse';

@Component({
  selector: 'app-superadmin-view-admins',
  templateUrl: './superadmin-view-admins.component.html',
  styleUrls: ['./superadmin-view-admins.component.css']
})
export class SuperadminViewAdminsComponent implements OnInit{

  adminList: AdminResponse[] = [];
  filteredAdmins: AdminResponse[] = [];
  pageSize: number = 5;
  currentPage: number = 1;
  selectedFilterCriteria: string = 'firstName';
  searchTerm: string = '';
  deletedAdmin: AdminResponse | null = null; // Variable to store details of the deleted admin
  deletionError: string | null = null; // Variable to store deletion error message
  successMessage: string;
  newAdmin: any;


  ngOnInit(): void {
    this.fetchAdmins();
    // Check if navigation data contains success flag and admin details
    const navigationData = history.state;
    if (navigationData && navigationData.success && navigationData.admin) {
      this.successMessage = 'Admin registered successfully:';
      this.newAdmin = navigationData.admin;
    }
  }

  constructor(private router: Router, private adminService: AdminService) {}

  fetchAdmins(): void {
    this.adminService.getAllAdmins().subscribe(
      (response: AdminResponse[]) => {
        this.adminList = response;
        console.log('Fetched Admins:', this.adminList);
        this.filterAdmins();
      },
      (error) => {
        console.error("Error fetching Admins:", error);
      }
    );   
  }

  onPageChange(pageNumber: number, event: Event): void {
    event.preventDefault(); // Prevent the default behavior of the anchor tag
    this.currentPage = pageNumber;
    this.filterAdmins();
  }  

  getPages(): number[] {
    const pageCount = Math.ceil(this.adminList.length / this.pageSize);
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  filterAdmins(): void {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.filteredAdmins = this.adminList.filter(adminContact =>
      adminContact.admin[this.selectedFilterCriteria].toLowerCase().includes(lowerCaseSearchTerm)
    );

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredAdmins = this.filteredAdmins.slice(startIndex, endIndex);
  }

  deleteAdmin(adminId: string) {
    this.adminService.deleteAdmin(adminId).subscribe(
      (response: AdminResponse) => {
        this.deletedAdmin = response; // Store details of the deleted admin
        this.deletionError = null; // Reset deletion error message
        // Refresh admin list
        this.fetchAdmins();
      },
      (error) => {
        console.error("Error deleting Admin:", error);
        this.deletionError = "Error deleting admin."; // Set deletion error message
        this.deletedAdmin = null; // Reset deleted admin details
      }
    );
  }
}
