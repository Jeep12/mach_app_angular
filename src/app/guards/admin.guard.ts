import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private authService: AuthService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
    const token = this.authService.getToken();  // Obtén el token del servicio de autenticación

    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      if (decodedToken.authorities.includes('ROLE_ADMIN')) {
        return true;  // El usuario tiene el rol de admin
      }
    }

    // Si no tiene acceso, redirigir al login o a otro lugar
    this.router.navigate(['/home']);
    return false;
  }
}
