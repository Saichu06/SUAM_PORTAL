import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://suam-portal.onrender.com/api';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  // Helper to construct headers if needed
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // GET Request
  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${path}`, { headers: this.getHeaders() })
      .pipe(catchError(err => this.handleError(err)));
  }

  // POST Request
  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, body, { headers: this.getHeaders() })
      .pipe(catchError(err => this.handleError(err)));
  }

  // PUT Request
  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${path}`, body, { headers: this.getHeaders() })
      .pipe(catchError(err => this.handleError(err)));
  }

  // DELETE Request
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${path}`, { headers: this.getHeaders() })
      .pipe(catchError(err => this.handleError(err)));
  }

  // Centered error handler which pops a snackbar message
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected network error occurred. Please try again.';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = error.error?.message || `Server Error (Code ${error.status})`;
    }

    // Show professional Toast notification on the bottom right or center
    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });

    console.error('API Error details:', error);
    return throwError(() => new Error(errorMessage));
  }
}
