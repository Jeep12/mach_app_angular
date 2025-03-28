import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink], // Importa ReactiveFormsModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string = ''; // Variable para mostrar el mensaje del servidor
  passwordVisible: boolean = false;  // Variable para controlar la visibilidad de la contraseña
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      this.authService.login(email, password).subscribe(
        (response: { token: any; message: string; }) => {
          // Guardar el token
          this.authService.saveToken(response.token);

          this.router.navigate(['/home']);

        },
        (error: any) => {
          this.message = error.error.message;
        }
      );
    } else {
      this.message = 'Formulario inválido';
    }
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;  // Cambiar el estado de visibilidad
  }

}
