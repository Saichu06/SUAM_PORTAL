import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private activeRequests = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  // Observable stream of loading states
  public loading$ = this.loadingSubject.asObservable();

  show(): void {
    this.activeRequests++;
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (this.activeRequests === 0) {
      this.loadingSubject.next(false);
    }
  }

  // Forces loading to clear (e.g., on route changes or errors)
  clear(): void {
    this.activeRequests = 0;
    this.loadingSubject.next(false);
  }
}
