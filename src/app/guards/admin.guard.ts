import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const token = this.tokenService.getAccessToken();  // Obtén el token de acceso desde TokenService

    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      if (decodedToken.authorities && decodedToken.authorities.includes('ROLE_ADMIN')) {
        return true;  // El usuario tiene el rol de admin
      }
    }

    // Si no tiene acceso, redirigir al home o a otro lugar
    this.router.navigate(['/home']);
    return false;
  }
}
