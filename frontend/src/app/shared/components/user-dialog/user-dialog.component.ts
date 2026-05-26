import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../interfaces/user.interface';

export interface UserDialogData {
  user?: User; // Provided if editing, empty if adding
}

@Component({
  selector: 'app-user-dialog',
  template: `
    <h2 mat-dialog-title style="color: var(--text-primary);">
      {{ isEditMode ? 'Modify User Profile' : 'Register New User' }}
    </h2>
    
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content style="display: flex; flex-direction: column; gap: 16px; padding: 15px 0;">
        
        <!-- Username Field -->
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>User ID / Username</mat-label>
          <input matInput formControlName="username" placeholder="e.g., john_doe" autocomplete="off">
          <mat-error *ngIf="userForm.get('username')?.hasError('required')">
            Username is required.
          </mat-error>
          <mat-error *ngIf="userForm.get('username')?.hasError('minlength')">
            Must be at least 3 characters.
          </mat-error>
        </mat-form-field>

        <!-- Password Field (Only shown in creation mode) -->
        <mat-form-field *ngIf="!isEditMode" appearance="outline" style="width: 100%;">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" placeholder="Enter password">
          <mat-error *ngIf="userForm.get('password')?.hasError('required')">
            Password is required.
          </mat-error>
          <mat-error *ngIf="userForm.get('password')?.hasError('minlength')">
            Must be at least 6 characters.
          </mat-error>
        </mat-form-field>

        <!-- Role Selector -->
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>System Role Access</mat-label>
          <mat-select formControlName="role">
            <mat-option value="General User">General User</mat-option>
            <mat-option value="Admin">Admin</mat-option>
          </mat-select>
          <mat-error *ngIf="userForm.get('role')?.hasError('required')">
            Access Role is required.
          </mat-error>
        </mat-form-field>

      </mat-dialog-content>

      <mat-dialog-actions align="end" style="gap: 8px; margin-top: 15px; padding: 0;">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="userForm.invalid">
          {{ isEditMode ? 'Update' : 'Register' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  standalone: false
})
export class UserDialogComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDialogData
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data.user;

    // Initialize Form Group
    this.userForm = this.fb.group({
      username: [
        { value: this.data.user?.username || '', disabled: this.isEditMode },
        [Validators.required, Validators.minLength(3)]
      ],
      password: [
        '',
        this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]
      ],
      role: [this.data.user?.role || 'General User', [Validators.required]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      // Get raw value because username might be disabled when editing, and form.value excludes disabled fields
      const rawData = this.userForm.getRawValue();
      
      const payload: any = {
        username: rawData.username,
        role: rawData.role
      };

      if (!this.isEditMode) {
        payload.password = rawData.password;
      }

      this.dialogRef.close(payload);
    }
  }
}
