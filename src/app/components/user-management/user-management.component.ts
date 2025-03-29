import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-management',
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  users: any[] = [];  // Para almacenar la respuesta

  constructor(private http: HttpClient) { }

  fetchUsers(): void {
    this.http.get('http://localhost:8080/api/users')  // Aquí se hace la solicitud GET
      .subscribe(
        (response: any) => {
          this.users = response;  // Guardamos la respuesta en el arreglo 'users'
          console.log('Usuarios:', this.users);  // Muestra la respuesta en consola
        },
        (error) => {
          console.error('Error al obtener usuarios:', error);  // Muestra error en consola si ocurre
        }
      );
  }
}
