import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingService } from '../../../core/services/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    // If already logged in, redirect based on role
    if (this.authService.isAuthenticated()) {
      this.redirectByRole(this.authService.getUserRole());
      return;
    }

    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      role: ['General User', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password, role } = this.loginForm.value;

      this.authService.login(username, password, role).subscribe({
        next: (response) => {
          this.snackBar.open(`Welcome back, ${response.user.username}!`, 'Dismiss', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
          });
          
          this.redirectByRole(response.user.role);
        },
        error: (err) => {
          // Errors are already handled and displayed in API Service snackbar
          console.error('Login submission failed:', err);
        }
      });
    }
  }

  private redirectByRole(role: string | null): void {
    if (role === 'Admin') {
      this.router.navigate(['/dashboard/admin']);
    } else {
      this.router.navigate(['/dashboard/user']);
    }
  }
}
