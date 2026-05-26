import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User } from '../../shared/interfaces/user.interface';
import { AuthResponse } from '../../shared/interfaces/auth-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.initializeSession();
  }

  // Check localStorage on load to see if a valid session exists
  private initializeSession(): void {
    const savedUser = localStorage.getItem('suam_user');
    const savedToken = localStorage.getItem('suam_token');

    if (savedUser && savedToken) {
      try {
        this.currentUserSubject.next(JSON.parse(savedUser));
      } catch (e) {
        this.logout();
      }
    }
  }

  // Authenticates user and sets token/user state
  login(username: string, password: string, role: string): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('login', { username, password, role }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('suam_token', response.token);
          localStorage.setItem('suam_user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  // Logs out user, clears localStorage, redirects to login page
  logout(): void {
    localStorage.removeItem('suam_token');
    localStorage.removeItem('suam_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Get active session token
  getToken(): string | null {
    return localStorage.getItem('suam_token');
  }

  // Get current user object synchronously
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  // Helper to get user role
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }
}
