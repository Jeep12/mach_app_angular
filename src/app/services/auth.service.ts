import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}`;  // Endpoint de login

  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService) { }

  // Método para hacer login
  login(email: string, password: string): Observable<any> {
    const body = { email, password }; // Datos que vas a enviar en la petición

    return this.http.post<any>(this.apiUrl + "/login", body); // Realizamos la petición POST
  }

  // Guardar el token en localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token); // Guardar con la clave 'token'
  }

  // Obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('token'); // Obtener con la clave 'token'
  }
  decodeToken(token: string): any {
    return this.jwtHelper.decodeToken(token);
  }
  // Eliminar el token de localStorage
  removeToken(): void {
    localStorage.removeItem('token'); // Eliminar con la clave 'token'
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!localStorage.getItem('token'); // Verificar 'token', no 'auth_token'
    }
    return false;
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token); // Usar jwtHelper para decodificar el token
      return decodedToken.authorities && decodedToken.authorities.includes('ROLE_ADMIN'); // Comprobar el rol
    }
    return false;
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token'); // Eliminar con la clave 'token'
      this.router.navigate(['/login']); // Redirigir al login después de cerrar sesión

    }
  }
  register(firstName: string, lastName: string, email: string, password: string, captchaToken: string): Observable<any> {
    const body = {
      name: firstName,
      lastname: lastName,
      email: email,
      password: password,
    };

    return this.http.post<any>(`${this.apiUrl}/api/users/register?captchaToken=${captchaToken}`, body); // Enviamos el captchaToken como parámetro de consulta
  }
  forgotPassword(emailReset: string, captchaToken: string) {
    const body = {
      email: emailReset
    };

    return this.http.post<string>(`${this.apiUrl}/api/users/forgot-password?captchaToken=${captchaToken}`, body, { responseType: 'text' as 'json' });
  }



  resetPassword( tokenUser: string, password: string,captchaToken: string,) {
    const body = {
      tokenUser: tokenUser,
      password: password
    };
    // Corregir el objeto de configuración para el tipo de respuesta
    return this.http.post<any>(`${this.apiUrl}/api/users/reset-password?captchaToken=${captchaToken}`, body, {
      responseType: 'json' as 'json' // Correctamente pasa el objeto de configuración
    });
  }
  

}
