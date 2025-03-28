import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router'; // Importa RouterModule
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true, // Marca el componente como standalone
  imports: [CommonModule, RouterLink],// Importa RouterModule aquí
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {


  constructor(private authService: AuthService) { }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();

  }
}