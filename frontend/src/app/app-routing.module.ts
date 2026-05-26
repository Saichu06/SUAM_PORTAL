import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/auth/login/login.component';

import { UserDashboardComponent } from './modules/dashboard/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './modules/dashboard/admin-dashboard/admin-dashboard.component';

import { AuthGuard } from './shared/guards/auth.guard';
import { RoleGuard } from './shared/guards/role.guard';

const routes: Routes = [

  // Landing Page
  {
    path: '',
    component: HomeComponent
  },

  // Login Page
  {
    path: 'login',
    component: LoginComponent
  },

  // User Dashboard
  {
    path: 'dashboard/user',
    component: UserDashboardComponent,
    canActivate: [AuthGuard]
  },

  // Admin Dashboard
  {
    path: 'dashboard/admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] }
  },

  // Wildcard Route
  {
    path: '**',
    redirectTo: ''
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }