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

  constructor() {
    // Numa carga completa da pagina (F5 ou URL colada), o SSR resolve a rota
    // no servidor, onde localStorage nao existe — o redirecionamento acontece,
    // mas o token vencido continua guardado no navegador. Descartamos aqui,
    // assim que o app sobe no browser.
    const token = this.getToken();
    if (token && this.isTokenExpired(token)) {
      this.clearSession();
    }
  }

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
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  /** Descarta a sessao sem navegar — usado pelo interceptor, que redireciona por conta propria. */
  clearSession() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Le o claim exp do proprio token. Sem isto a UI continuava se achando
   * logada com um token vencido, e o usuario so descobria quando a
   * requisicao falhava.
   *
   * Na duvida (token ilegivel ou sem exp) tratamos como expirado: e mais
   * seguro mandar para o login do que deixar a tela quebrar depois.
   */
  private isTokenExpired(token: string): boolean {
    const payload = this.decodePayload(token);
    if (!payload || typeof payload.exp !== 'number') return true;
    return payload.exp * 1000 <= Date.now();
  }

  private decodePayload(token: string): any | null {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';
    const parsed = this.decodePayload(token);
    if (!parsed) return '';
    // Spring might use 'role', 'roles', or 'authorities'
    return parsed.role || (parsed.roles && parsed.roles[0]) || (parsed.authorities && parsed.authorities[0]?.authority) || '';
  }
}
