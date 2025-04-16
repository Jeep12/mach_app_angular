import { Role } from "./role.model";

export interface User {
  id: number;
  roles: Role[]; // El campo roles es un array de objetos Role
  createdAt: string; // Se puede dejar como string o convertirlo a Date según prefieras
  emailVerified: boolean;
  lastname: string;
  name: string;
  email: string;
  enabled: boolean;
}

