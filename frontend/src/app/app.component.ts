import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { User } from './shared/interfaces/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  title = 'suam-frontend';
  currentUser: User | null = null;
  isDarkMode = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Listen for current authenticated user status
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Check system preference or saved theme
    const savedTheme = localStorage.getItem('suam_theme');
    if (savedTheme === 'dark') {
      this.toggleDarkMode(true);
    }
  }

  toggleDarkMode(force?: boolean): void {
    this.isDarkMode = force !== undefined ? force : !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('suam_theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('suam_theme', 'light');
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
