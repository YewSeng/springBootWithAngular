import { Component, OnInit } from '@angular/core';
import { CabType } from '../pojos/CabType';
import { UserService } from '../controller-calls/user.service';
import { UserResponse } from '../pojos/UserResponse';
import { User } from '../pojos/User';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  username: string = sessionStorage.getItem('authenticatedUsername');
  userId: string = sessionStorage.getItem('authenticatedId');
  userPreferences: CabType;
  user: User;

  constructor(private userService: UserService) {}
  
  ngOnInit(): void {
    this.userService.getUserById(this.userId).subscribe(
      (userDetails: UserResponse) => {
        this.user = userDetails.user;
        this.userPreferences = userDetails.user.preferences;
      },
      error => {
        console.error('Error fetching user:', error);
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
