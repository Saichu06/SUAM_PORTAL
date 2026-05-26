import { Component } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loader',
  template: `
    <div class="global-loader-overlay" *ngIf="loadingService.loading$ | async">
      <mat-spinner color="primary" [diameter]="50"></mat-spinner>
      <div class="global-loader-text">SUAM : SECURE ACCESS IN PROGRESS...</div>
    </div>
  `,
  standalone: false
})
export class LoaderComponent {
  constructor(public loadingService: LoadingService) {}
}
