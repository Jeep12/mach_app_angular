// src/app/services/token.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RefreshTokenResponse } from '../models/token-response';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private apiUrl = environment.apiUrl;
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());
  private loading = new BehaviorSubject<boolean>(false);

  authStatus$ = this.authStatus.asObservable();
  loading$ = this.loading.asObservable();

  constructor(private http: HttpClient) { }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  saveAccessToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.accessTokenKey, token);
      this.updateAuthStatus(true);
    }
  }

  saveRefreshToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.refreshTokenKey, token);
    }
  }

  getAccessToken(): string | null {
    return this.isBrowser() ? localStorage.getItem(this.accessTokenKey) : null;
  }

  getRefreshToken(): string | null {
    return this.isBrowser() ? localStorage.getItem(this.refreshTokenKey) : null;
  }

  removeTokens(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.accessTokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      this.updateAuthStatus(false);
    }
  }

  updateAuthStatus(status: boolean): void {
    this.authStatus.next(status);
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    this.loading.next(true);
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      this.loading.next(false);
      this.updateAuthStatus(false);
      return throwError(() => new Error('No refresh token available'));
    }

    const url = `${this.apiUrl}/api/users/refresh-token`;
    const body = { refreshToken };

    return this.http.post<RefreshTokenResponse>(url, body).pipe(
      tap((response: RefreshTokenResponse) => {
        this.saveAccessToken(response.accessToken); // Usamos accessToken (camelCase)
        this.updateAuthStatus(true);
      }),
      catchError(error => {
        this.removeTokens();
        return throwError(() => error);
      }),
      finalize(() => this.loading.next(false))
    );
  }

  isTokenExpired(token: string): boolean {
    if (!token) return true;

    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();

    return currentTime >= expirationTime;
  }

  decodeToken(token: string): any {
    if (!token || typeof token !== 'string') {
      return null;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(base64);
      return JSON.parse(decodedPayload);
    } catch (error) {
      return null;
    }
  }
}
