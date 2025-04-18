import { Component, ViewChild } from '@angular/core';
import { User } from '../../models/user.model';
import { ModalService } from '../../services/modal.service';
import { UserManagementService } from '../../services/user-management.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-modal-resend-email-recovery',
  imports: [CommonModule, RecaptchaModule, RecaptchaFormsModule, ReactiveFormsModule],
  templateUrl: './modal-resend-email-recovery.component.html',
  styleUrl: './modal-resend-email-recovery.component.css'
})
export class ModalResendEmailRecoveryComponent {
  @ViewChild('recaptcha') recaptcha!: RecaptchaComponent;

  loading: boolean = false;
  show = false;
  user: User | null = null;

  sendRecoveryEmailForm: FormGroup;

  captchaToken: string | null = null;
  siteKey = environment.recaptchaSiteKey;

  lastEmailSent: Date | null = null;
  isCooldown = false;
  cooldownMinutes = 15;

  constructor(private modalService: ModalService, private userManagementService: UserManagementService, private fb: FormBuilder) {
    this.modalService.resendRecoveryEmail$.subscribe(state => {
      this.show = state.show;
      this.user = state.config.user;
    });

    this.sendRecoveryEmailForm = this.fb.group({
      recaptcha: ['', Validators.required],
    });
    this.resetModalState();
  }
  isAdmin(): boolean {
    return this.user?.roles?.some(r => r.name === 'ROLE_ADMIN') || false;
  }
  sendEmailRecovery() {
    if (!this.captchaToken || !this.user?.email) return;

    this.loading = true;

    this.userManagementService.resendRecoveryEmail(this.user.email,this.captchaToken).subscribe({
      next: (response) => {
        this.modalService.showSuccess({
          title: 'Email enviado',
          message: `Email de recuperación reenviado a ${this.user?.email} correctamente`,
        });
        this.resetModalState();
      },
      error: (err) => {

        const msRemaining = err.error.expiresAt;                       // milisegundos que faltan
        const remainingTime = this.formatTimeRemaining(msRemaining);
        
        this.modalService.showError({
          title: 'Email no enviado',
          message: `${err.error.message}. Inténtalo de nuevo en ${remainingTime}`,
        });

    this.resetModalState();
  },
  complete: () => {
        this.loading = false;
      }
    });
  }

executeRecaptchaVisible(token: any) {
  this.captchaToken = token;
  this.sendRecoveryEmailForm.get('recaptcha')?.setValue(token);

}

close(): void {
  this.resetModalState();
  this.modalService.hide();
  this.resetRecaptcha();
}
  private resetModalState(): void {
  this.loading = false;
  this.captchaToken = null;
  this.lastEmailSent = null;
  this.isCooldown = false;
  this.sendRecoveryEmailForm.reset();
  this.resetRecaptcha(); // Añade esto también aquí por si acaso
}
  private resetRecaptcha(): void {
  if(this.recaptcha) {
  this.recaptcha.reset();
}
  }



  private formatTimeRemaining(msRemaining: number): string {
  const totalSeconds = Math.ceil(msRemaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${this.pad(minutes)}m ${this.pad(seconds)}s`;
}
  
  private pad(value: number): string {
  return value.toString().padStart(2, '0');
}
  
}
