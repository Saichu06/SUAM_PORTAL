import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const expectedRoles = route.data['roles'] as Array<string>;
    const userRole = this.authService.getUserRole();

    // Check if the user has one of the expected roles
    if (expectedRoles && expectedRoles.includes(userRole || '')) {
      return true;
    }

    // Role mismatch: redirect to general user dashboard and show error message
    this.snackBar.open('Access Denied. You do not have permission to view this page.', 'Close', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['warning-snackbar']
    });

    this.router.navigate(['/dashboard/user']);
    return false;
  }
}
