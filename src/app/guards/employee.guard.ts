import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from '../services/token.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeGuard implements CanActivate {

  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private tokenService: TokenService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const token = this.tokenService.getAccessToken();  // Obtén el token de acceso desde TokenService

    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      if (decodedToken.authorities && decodedToken.authorities.includes('ROLE_EMPLOYEE')) {
        return true;  // El usuario tiene el rol de empleado
      }
    }

    // Si no tiene acceso, redirigir al home o a otro lugar
    this.router.navigate(['/home']);
    return false;
  }
}
