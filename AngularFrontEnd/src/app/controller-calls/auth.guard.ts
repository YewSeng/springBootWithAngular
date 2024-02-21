import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UnauthorizedAccessService } from './unauthorized-access.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private unauthorizedAccessService: UnauthorizedAccessService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const authenticatedUserType = sessionStorage.getItem('authenticatedUserType');

    if (!authenticatedUserType) {
      const errorMessage = 'You do not have permission to access this page.';
      this.unauthorizedAccessService.setUnauthorizedAccessError(errorMessage);
      this.router.navigate(['/home']);
      return false;
    }

    const requiredRole = (route.data as any)['requiredRole'];

    if (requiredRole && authenticatedUserType !== requiredRole) {
      const errorMessage = 'You do not have permission to access this page.';
      this.unauthorizedAccessService.setUnauthorizedAccessError(errorMessage);
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}