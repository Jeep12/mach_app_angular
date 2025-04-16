import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private apiUrl = environment.apiUrl;


  constructor(
    private http: HttpClient,
    private router: Router,
  ) {

  }


  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/api/users`);  // Hacemos la solicitud GET al endpoint
  }

  toggleUserStatus(userId: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/api/users/toggle-status`, { id: userId });
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/users/delete-user`, {
      body: { id: userId }  // Pasamos el ID en el cuerpo de la solicitud DELETE
    });
  }

  updateUserRoles(userId: number, roles: any[]): Observable<any> {
    const request = {
      id: userId,
      roles: roles
    };

    return this.http.put(`${this.apiUrl}/api/users/change-roles`, request);  // Enviar el objeto con id y roles
  }
  
}
