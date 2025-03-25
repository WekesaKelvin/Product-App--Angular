import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const decodedToken: any = jwtDecode(token);
    const expirationDate = new Date(decodedToken.exp * 1000);
    return expirationDate < new Date();
  }
  getToken(): string | null {
    
    return localStorage.getItem('authToken');
  }
  private authUrl = 'https://auth.yourdomain.com/api/auth';

  constructor(private http: HttpClient) {}

  getUserDetail = () => {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    const userDetail = {
      id: decodedToken.nameid,
      fullName: decodedToken.name,
      email: decodedToken.email,
      roles: decodedToken.role || [],
    };

    return userDetail;
  };

  isLoggedIn = (): boolean => {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired();
  };

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


