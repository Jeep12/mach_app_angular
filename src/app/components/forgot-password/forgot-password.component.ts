import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
declare var bootstrap: any;

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RecaptchaModule, RecaptchaFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  captchaToken: string | null = null;
  errors: string[] = [];
  loading: boolean = false;
  userEmail: string = "";
  siteKey = environment.recaptchaSiteKey;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onEmailBlur() {
    if (this.forgotPasswordForm.get('email')?.valid) {
      this.errors = [];
    } else {
      this.errors = ['Ingresaste un email no válido'];
    }
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid && this.captchaToken) {
      this.loading = true;
      const email = this.forgotPasswordForm.get('email')?.value;

      this.authService.forgotPassword(email, this.captchaToken).subscribe(
        (response) => {
          let jsonResponse;

          try {
            jsonResponse = JSON.parse(response); // Intentamos convertir la respuesta en JSON
          } catch (e) {
            this.errors = ['Hubo un problema con la respuesta del servidor.'];
            this.loading = false;
            return;
          }

          if (jsonResponse.success === false) {
            this.errors = [jsonResponse.message];
            this.loading = false;
          } else {
            this.userEmail = email;
            this.loading = false;
            const modal = new bootstrap.Modal(document.getElementById('successModal'));
            modal.show();
            this.errors = [];  // Limpiar errores
          }
        },
        (error) => {

          this.errors = [];
          const errorPrase = JSON.parse(error.error); // Intentamos convertir la respuesta en JSON
          this.loading = false;
          this.errors = [errorPrase.message];
        }
      );
    } else {
      this.errors = [];
      this.errors = ["Formulario no válido o reCAPTCHA no completado"];

    }
  }


  executeRecaptcha(token: any) {
    this.captchaToken = token;
    this.forgotPasswordForm.get('recaptcha')?.setValue(token);

  }
}
