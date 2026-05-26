import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title style="margin: 0 0 10px 0; color: var(--text-primary);">{{ data.title }}</h2>
    <mat-dialog-content style="padding: 10px 0;">
      <p style="margin: 0; font-size: 0.95rem; line-height: 1.5; color: var(--text-secondary);">
        {{ data.message }}
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end" style="margin-top: 20px; padding: 0; gap: 8px;">
      <button mat-button (click)="onCancel()">
        {{ data.cancelText || 'Cancel' }}
      </button>
      <button mat-raised-button color="warn" (click)="onConfirm()">
        {{ data.confirmText || 'Delete' }}
      </button>
    </mat-dialog-actions>
  `,
  standalone: false
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
