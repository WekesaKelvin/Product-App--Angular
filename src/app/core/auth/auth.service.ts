import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'https://auth.yourdomain.com/api/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.post(`${this.authUrl}/login`, { username, password }, { withCredentials: true }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  signup(username: string, password: string): Observable<boolean> {
    return this.http.post(`${this.authUrl}/signup`, { username, password }, { withCredentials: true }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get(`${this.authUrl}/check`, { withCredentials: true }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): Observable<void> {
    return this.http.post(`${this.authUrl}/logout`, {}, { withCredentials: true }).pipe(
      map(() => undefined)
    );
  }
}