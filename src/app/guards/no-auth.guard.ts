import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Inyectamos el AuthService
  const router = inject(Router);

  // Si el usuario está autenticado, lo redirigimos a la home (o la ruta principal)
  if (authService.isAuthenticated()) {
    router.navigate(['/']);  // O la ruta que desees para usuarios autenticados
    return false;  // No dejamos que acceda al login
  }

  // Si no está autenticado, dejamos que acceda al login
  return true;
};
