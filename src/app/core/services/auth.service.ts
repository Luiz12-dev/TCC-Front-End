import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.authUrl;

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res && res.accessToken) {
          localStorage.setItem('token', res.accessToken);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      let payload = token.split('.')[1];
      // Convert base64url to base64
      payload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(payload);
      const parsed = JSON.parse(decoded);
      // Spring might use 'role', 'roles', or 'authorities'
      return parsed.role || (parsed.roles && parsed.roles[0]) || (parsed.authorities && parsed.authorities[0]?.authority) || ''; 
    } catch (e) {
      return '';
    }
  }
}
