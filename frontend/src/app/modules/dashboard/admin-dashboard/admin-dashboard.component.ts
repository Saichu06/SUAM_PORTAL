import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../shared/interfaces/user.interface';
import { UserDialogComponent } from '../../../shared/components/user-dialog/user-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: false
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;

  // Table structures
  displayedColumns: string[] = ['id', 'username', 'role', 'lastLogin', 'actions'];
  dataSource = new MatTableDataSource<User>([]);

  // Analytics Metrics
  totalUsers = 0;
  adminsCount = 0;
  generalUsersCount = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

        this.calculateStats(users);
      },
      error: (err) => {
        console.error('Error fetching system users:', err);
      }
    });
  }

  calculateStats(users: User[]): void {
    this.totalUsers = users.length;
    this.adminsCount = users.filter(u => u.role === 'Admin').length;
    this.generalUsersCount = users.filter(u => u.role === 'General User').length;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addUser(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '450px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.addUser(result).subscribe({
          next: (newUser) => {
            this.snackBar.open(`User "${newUser.username}" created successfully.`, 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.loadUsers();
          }
        });
      }
    });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '450px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUser(user.id, result).subscribe({
          next: (updatedUser) => {
            this.snackBar.open(`User "${updatedUser.username}" updated successfully.`, 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.loadUsers();
          }
        });
      }
    });
  }

  deleteUser(user: User): void {
    // Prevent self deletion
    if (this.currentUser && this.currentUser.id === user.id) {
      this.snackBar.open('Operation denied. You cannot delete your own account.', 'OK', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete User Confirmation',
        message: `Are you sure you want to permanently delete user "${user.username}"? This action is irreversible.`,
        confirmText: 'Delete User'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.snackBar.open(`User "${user.username}" deleted successfully.`, 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.loadUsers();
          }
        });
      }
    });
  }
}
