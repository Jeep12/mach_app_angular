import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RecaptchaModule, RecaptchaFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']

})
export class ResetPasswordComponent implements OnInit {
  errors: string[] = [];
  resetForm: FormGroup;
  passwordVisible: boolean = false;
  repeatPasswordVisible: boolean = false;
  captchaToken: string | null = null;
  loading: boolean = false;
  siteKey = environment.recaptchaSiteKey;
  tokenUser: string | null = null;  // Para almacenar el token de la URL

  passwordValidations = {
    length: false,
    uppercase: false,
    specialChar: false,
    number: false,
    match: false
  };

  constructor(private fb: FormBuilder, private authService: AuthService, private route: ActivatedRoute) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      recaptcha: ['', Validators.required]
    });

    this.resetForm.get('password')?.valueChanges.subscribe(() => {
      this.onPasswordChange();
    });

    this.resetForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.onPasswordChange();
    });
  }

  ngOnInit(): void {
    // Obtener el token de la URL
    this.route.queryParams.subscribe(params => {
      this.tokenUser = params['token'];  // Aquí obtenemos el 'token' de la URL
    });
  }

  onPasswordChange() {
    const password = this.resetForm.get('password')?.value;
    const confirmPassword = this.resetForm.get('confirmPassword')?.value;

    this.passwordValidations.length = password.length >= 8;
    this.passwordValidations.uppercase = /[A-Z]/.test(password);
    this.passwordValidations.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    this.passwordValidations.number = /\d/.test(password);
    this.passwordValidations.match = password === confirmPassword;
  }

  passwordMatchValidator(control: any) {
    const password = this.resetForm.get('password')?.value;
    const confirmPassword = control.value;

    if (password && confirmPassword !== password) {
      return { mismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (!this.tokenUser) {
      this.errors = ['No se encontró el token.'];
      return;
    }
  
    const { password, confirmPassword } = this.resetForm.value;
  
    // Verificamos si las contraseñas coinciden
    if (password !== confirmPassword) {
      this.errors = ['Las contraseñas no coinciden.'];
      return;
    }
  
    if (this.resetForm.valid && this.tokenUser && this.captchaToken) {
      this.loading = true;
  
      // Llamamos al servicio para restablecer la contraseña
      this.authService.resetPassword(this.tokenUser, password, this.captchaToken).subscribe(
        (response) => {
          // Aquí ya no necesitas hacer JSON.parse
          if (response.success === false) {
            this.errors = [response.message];
            this.loading = false;

          } else {
            this.loading = false;
            const modal = new bootstrap.Modal(document.getElementById('successModal'));
            modal.show();
            this.errors = [];  // Limpiar errores
          }
        },
        (error) => {
          this.errors = [];
          const errorResponse = error.error;
          this.errors = [errorResponse.message];
          this.loading = false;
        }
      );
    } else {
      this.errors = [];
      this.errors = ["Formulario no válido o reCAPTCHA no completado"];
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleRepeatPasswordVisibility() {
    this.repeatPasswordVisible = !this.repeatPasswordVisible;
  }

  isPasswordValid() {
    return (
      this.passwordValidations.length &&
      this.passwordValidations.uppercase &&
      this.passwordValidations.specialChar &&
      this.passwordValidations.number &&
      this.passwordValidations.match
    );
  }

  executeRecaptchaVisible(token: any) {
    this.captchaToken = token;
    this.resetForm.get('recaptcha')?.setValue(token);
  }
}
