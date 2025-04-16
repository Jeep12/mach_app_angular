import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
declare var bootstrap: any; // Para usar Bootstrap en Angular

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RecaptchaModule, RecaptchaFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  errors: string[] = [];
  registerForm: FormGroup;
  passwordVisible: boolean = false;
  repeatPasswordVisible: boolean = false;
  captchaToken: string | null = null;
  loading: boolean = false;
  successMessage: string | null = null;
  userEmail: string = ""; // Guarda el email
  siteKey = environment.recaptchaSiteKey;

  passwordValidations = {
    length: false,
    uppercase: false,
    specialChar: false,
    number: false,
    match: false
  };

  constructor(private fb: FormBuilder, private authService: AuthService) {
    // Inicializamos el formulario
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]], // Confirmar contraseñas
      recaptcha: ['', Validators.required],  // Agregar el control de reCAPTCHA

    });


    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.onPasswordChange();
    });

    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.onPasswordChange(); // No actualizar validación para evitar bucle
    });



  }


  onEmailBlur() {

    // Verificamos si el email es válido
    if (this.registerForm.get('email')?.valid) {
      this.errors = [];

    } else {
      this.errors = ['Ingresaste un email no valido'];
    }
  }

  // Método para validar la contraseña
  onPasswordChange() {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;

    // Validación de la longitud, mayúsculas, caracteres especiales, etc.
    this.passwordValidations.length = password.length >= 8;
    this.passwordValidations.uppercase = /[A-Z]/.test(password);
    this.passwordValidations.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    this.passwordValidations.number = /\d/.test(password);

    // Validación de si las contraseñas coinciden
    this.passwordValidations.match = password === confirmPassword;
  }

  // Valida que las contraseñas coincidan
  passwordMatchValidator(control: any) {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = control.value;

    if (password && confirmPassword !== password) {
      return { mismatch: true };  // Retorna un error si las contraseñas no coinciden
    }

    return null;  // Retorna null si las contraseñas coinciden
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // Datos del formulario
      const { firstName, lastName, email, password } = this.registerForm.value;
      const captchaToken = this.captchaToken || ''; // Aseguramos que captchaToken no sea null
      this.loading = true;
      // Llamar al método de registro del AuthService
      this.authService.register(firstName, lastName, email, password, captchaToken).subscribe(
        (response) => {
          // Si el registro es exitoso
          this.loading = false;
          this.errors = [];
          this.userEmail = email; // Guarda el email

          const modal = new bootstrap.Modal(document.getElementById('successModal'));
          modal.show();
        },
        (error) => {
          // Si hay un error
          this.errors = ['Hubo un problema al registrar el usuario. \n Intentelo nuevamente'];
          this.loading = false;

        }
      );
    }
  }

  // Método para cambiar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;  // Cambiar el estado de visibilidad
  }

  // Método para cambiar la visibilidad de la confirmación de la contraseña
  toggleRepeatPasswordVisibility() {
    this.repeatPasswordVisible = !this.repeatPasswordVisible;  // Cambiar el estado de visibilidad
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
    this.registerForm.get('recaptcha')?.setValue(token);

  }




}
