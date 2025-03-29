export interface LoginResponse {
    access_token: string;    // Token de acceso (con guión bajo)
    refresh_token: string;   // Token de refresco (con guión bajo)
    message: string;         // Mensaje descriptivo
    email: string;           // Email del usuario autenticado
  }