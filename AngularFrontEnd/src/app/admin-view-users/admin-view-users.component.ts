import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserResponse } from '../pojos/UserResponse';
import { Router } from '@angular/router';
import { UserService } from '../controller-calls/user.service';
import { debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';
import { CabType } from '../pojos/CabType';

@Component({
  selector: 'app-admin-view-users',
  templateUrl: './admin-view-users.component.html',
  styleUrls: ['./admin-view-users.component.css']
})
export class AdminViewUsersComponent implements OnInit {

  userList: UserResponse[] = [];
  filteredUsers: UserResponse[] = [];
  pageSize: number = 5;
  currentPage: number = 1;
  selectedFilterCriteria: string = 'firstName';
  searchTerm: string = '';
  deletedUser: UserResponse | null = null;
  deletionError: string | null = null;
  successMessage: string;
  newUser: any;
  @ViewChild('filterPreferencesSelect') filterPreferencesSelect: ElementRef;
  // Added a list of cab types for dropdown
  cabTypes: string[] = [CabType.STANDARD, CabType.PREMIUM, CabType.LIMOUSINE, CabType.SPECIAL];
  Object: any;
  CabType: CabType;

  ngOnInit(): void {
    this.fetchUsers();
    const navigationData = history.state;
    if (navigationData && navigationData.success && navigationData.user) {
      this.successMessage = 'User registered successfully:';
      this.newUser = navigationData.user;
    }
  }

  ngAfterViewInit(): void {
    // Subscribe to the (change) event after the view is initialized
    if (this.filterPreferencesSelect) {
      fromEvent(this.filterPreferencesSelect.nativeElement, 'change')
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(() => {
          this.onFilterPreferencesChange();
        });
    }
  }
  
  constructor(private router: Router, private userService: UserService) {}

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe(
      (response: UserResponse[]) => {
        this.userList = response;
        console.log('Fetched Users:', this.userList);
        this.filterUsers();
      },
      (error) => {
        console.error("Error fetching Users:", error);
      }
    );
  }

  onPageChange(pageNumber: number, event: Event): void {
    event.preventDefault();
    this.currentPage = pageNumber;
    this.filterUsers();
  }

  getPages(): number[] {
    const pageCount = Math.ceil(this.filteredUsers.length / this.pageSize);
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  onFilterPreferencesChange(): void {
    // Adjust the search term to backend format for Cab Type
    this.searchTerm = this.selectedFilterCriteria === 'preferences'
      ? this.getBackendCabType(this.searchTerm)
      : this.searchTerm;

    this.filterUsers();
  }
  
  filterUsers(): void {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    console.log('Search Term: ', lowerCaseSearchTerm);
    this.filteredUsers = this.userList.filter(userContact => {
      const filterValue = this.selectedFilterCriteria === 'preferences'
        ? this.getDisplayPreference(userContact.user.preferences)?.toLowerCase()
        : userContact.user[this.selectedFilterCriteria]?.toLowerCase();
  
      return this.selectedFilterCriteria === 'preferences'
        ? filterValue === lowerCaseSearchTerm || userContact.user.preferences === this.getBackendCabType(lowerCaseSearchTerm)
        : filterValue?.includes(lowerCaseSearchTerm);
    });
  
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe(
      (response: UserResponse) => {
        this.deletedUser = response;
        this.deletionError = null;
        this.fetchUsers();
      },
      (error) => {
        console.error("Error deleting User:", error);
        this.deletionError = "Error deleting user.";
        this.deletedUser = null;
      }
    );
  }

  // Modify the getDisplayPreference method
  getDisplayPreference(cabType: string): string {
    switch (cabType) {
      case CabType.STANDARD:
        return 'Standard';
      case CabType.PREMIUM:
        return 'Premium';
      case CabType.LIMOUSINE:
        return 'Limousine';
      case CabType.SPECIAL:
        return 'special';
      default:
        return cabType;
    }
  }  

  // New method to convert frontend CabType to backend format
  getBackendCabType(displayCabType: string): string {
    switch (displayCabType.toUpperCase()) {
      case 'STANDARD':
        return CabType.STANDARD;
      case 'PREMIUM':
        return CabType.PREMIUM;
      case 'LIMOUSINE':  // Update to match your backend format
        return CabType.LIMOUSINE;
      case 'SPECIAL':
        return CabType.SPECIAL;
      default:
        return displayCabType;
    }
  }
}
