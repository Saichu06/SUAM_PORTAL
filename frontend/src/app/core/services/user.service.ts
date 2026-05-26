import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../../shared/interfaces/user.interface';
import { Record } from '../../shared/interfaces/record.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  // Fetch device access records for dashboards
  getRecords(): Observable<Record[]> {
    return this.apiService.get<Record[]>('records');
  }

  // Fetch all users (Admin only)
  getUsers(): Observable<User[]> {
    return this.apiService.get<User[]>('users');
  }

  // Add a new user (Admin only)
  addUser(user: Partial<User> & { password?: string }): Observable<User> {
    return this.apiService.post<User>('users', user);
  }

  // Edit user details/role (Admin only)
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.apiService.put<User>(`users/${id}`, user);
  }

  // Delete user (Admin only)
  deleteUser(id: number): Observable<{ message: string; deletedId: number }> {
    return this.apiService.delete<{ message: string; deletedId: number }>(`users/${id}`);
  }
}
