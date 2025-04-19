// src/app/components/nav/nav.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  isAuthenticatedUser: boolean = false;
  isLoading: boolean = false;
  userEmail: string | null = null;
  userDisplayName: string | null = null;
  private authSub!: Subscription;
  private loadingSub!: Subscription;


  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Verificar estado inicial de autenticación
    this.checkInitialAuthStatus();

    // Suscripción a cambios de estado de autenticación
    this.authSub = this.tokenService.authStatus$.subscribe(status => {
      this.isAuthenticatedUser = status;
      if (status) {
        this.loadUserData();
      } else {
        this.userEmail = null;
      }
    });

    // Suscripción a cambios de estado de carga
    this.loadingSub = this.tokenService.loading$.subscribe(
      loading => this.isLoading = loading
    );
  }

  private checkInitialAuthStatus(): void {
    const token = this.tokenService.getAccessToken();
    if (token && this.tokenService.isAuthenticated()) {
      this.isAuthenticatedUser = true;
      this.loadUserData();
    } else {
      this.isAuthenticatedUser = false;
    }
  }

  private loadUserData(): void {
    const token = this.tokenService.getAccessToken();
    if (token) {
      const decoded = this.tokenService.decodeToken(token);
      this.userEmail = decoded?.email || null;
      this.userDisplayName = decoded?.name || null + ' ' + decoded?.lastname || null;
    }
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.loadingSub?.unsubscribe();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  isEmployee(): boolean {
    return this.authService.isEmployee();
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
