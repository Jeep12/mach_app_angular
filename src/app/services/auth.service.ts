// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from './token.service';
import { LoginResponse } from '../models/auth-responses';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private tokenService: TokenService
  ) { }

  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, body).pipe(
      tap((response: LoginResponse) => {
        this.tokenService.saveAccessToken(response.access_token);
        this.tokenService.saveRefreshToken(response.refresh_token);
      })
    );
  }

  logout(): void {
    this.tokenService.removeTokens();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  isAdmin(): boolean {
    const token = this.tokenService.getAccessToken();
    if (token) {
      const decodedToken = this.tokenService.decodeToken(token);
      return decodedToken.authorities && decodedToken.authorities.includes('ROLE_ADMIN');
    }
    return false;
  }

  register(firstName: string, lastName: string, email: string, password: string, captchaToken: string): Observable<any> {
    const body = {
      name: firstName,
      lastname: lastName,
      email: email,
      password: password,
    };

    return this.http.post<any>(`${this.apiUrl}/api/users/register?captchaToken=${captchaToken}`, body);
  }

  forgotPassword(emailReset: string, captchaToken: string): Observable<string> {
    const body = { email: emailReset };
    return this.http.post<string>(`${this.apiUrl}/api/users/forgot-password?captchaToken=${captchaToken}`, body, { responseType: 'text' as 'json' });
  }

  resetPassword(tokenUser: string, password: string, captchaToken: string): Observable<any> {
    const body = { tokenUser, password };
    return this.http.post<any>(`${this.apiUrl}/api/users/reset-password?captchaToken=${captchaToken}`, body, { responseType: 'json' as 'json' });
  }
}
