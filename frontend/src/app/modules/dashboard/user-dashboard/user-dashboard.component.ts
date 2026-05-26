import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Record } from '../../../shared/interfaces/record.interface';
import { User } from '../../../shared/interfaces/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  standalone: false
})
export class UserDashboardComponent implements OnInit {
  currentUser: User | null = null;
  
  // Table properties
  displayedColumns: string[] = ['id', 'deviceName', 'accessLevel', 'status', 'timestamp'];
  dataSource = new MatTableDataSource<Record>([]);
  
  // Summary Stats
  totalLogsCount = 0;
  approvedCount = 0;
  deniedCount = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadLogs();
  }

  loadLogs(): void {
    this.userService.getRecords().subscribe({
      next: (records) => {
        this.dataSource.data = records;
        
        // Connect MatTableDataSource components
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

        this.calculateStats(records);
      },
      error: (err) => {
        console.error('Error fetching access logs:', err);
      }
    });
  }

  calculateStats(records: Record[]): void {
    this.totalLogsCount = records.length;
    this.approvedCount = records.filter(r => r.status.toLowerCase() === 'approved').length;
    this.deniedCount = records.filter(r => r.status.toLowerCase() === 'denied').length;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  refreshLogs(): void {
    this.loadLogs();
    this.snackBar.open('Refreshing system access logs...', 'OK', { duration: 2000 });
  }
}
