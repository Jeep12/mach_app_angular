import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { switchMap, catchError, throwError, mergeMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);

  // Excluir endpoints que no necesitan intercepción
  if (req.url.includes('/refresh-token') || req.url.includes('/login')) {
    return next(req);
  }

  const accessToken = tokenService.getAccessToken();
  const refreshToken = tokenService.getRefreshToken();



  // Clonar la solicitud con el token actual si existe
  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  } else {
  }

  return next(authReq).pipe(
    catchError(error => {

      // Solo intentar refrescar el token si hay un refreshToken y el error es 401
      if (error.status === 401 && refreshToken) {

        // Llamada para obtener un nuevo access token usando el refresh token
        return tokenService.refreshToken().pipe(
          mergeMap((response: any) => {
            if (!response?.accessToken) {
              console.error('No se recibió nuevo access token');
              throw new Error('No se recibió nuevo access token');
            }


            // Guardar el nuevo token
            tokenService.saveAccessToken(response.accessToken);

            // Clonar la solicitud original con el nuevo token
            const newAuthReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`
              }
            });

            return next(newAuthReq); // Reintenta la solicitud original
          }),
          catchError(refreshError => {
            console.error('Error al refrescar el token:', refreshError);
            tokenService.removeTokens(); // Eliminar los tokens si no se puede refrescar
            // Redirigir al login u otra acción necesaria
            return throwError(() => refreshError);
          })
        );
      }

      // Si no es error 401 o no hay refreshToken, reenviar el error
      return throwError(() => error);
    })
  );
};
