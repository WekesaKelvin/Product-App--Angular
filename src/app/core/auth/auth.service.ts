import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:8080/auth';

  
  private authStatusSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus$ = this.authStatusSubject.asObservable();
  

  constructor(private http: HttpClient) {}


    updateAuthStatus(status: boolean): void {
      this.authStatusSubject.next(status);
    }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserDetail() {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    return {
      id: decodedToken.nameid,
      fullName: decodedToken.name,
      email: decodedToken.email,
      roles: decodedToken.role || [],
    };
  }


  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    const decodedToken: any = jwtDecode(token);
    return new Date(decodedToken.exp * 1000) < new Date();
  }

 
  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return !!this.getToken() && !this.isTokenExpired();
  }


  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>(`${this.authUrl}/login`, { username, password }, { withCredentials: true }).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        this.authStatusSubject.next(true); 
      }),
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

  logout(): Observable<void> {
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('userDetail');
    this.authStatusSubject.next(false);
    sessionStorage.clear();

    return this.http.post(`http://localhost:8080/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        localStorage.removeItem('authToken');
        this.authStatusSubject.next(false); 
      }),
      map(() => undefined)
    );
  }
}


