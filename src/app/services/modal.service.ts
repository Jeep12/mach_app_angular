import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../models/user.model';

interface SuccessModalConfig {
  title: string;
  message: string;
  confirmText?: string;
}
interface ErrorModalConfig {
  title: string;
  message: string;
  confirmText?: string;
}

interface RoleModalConfig {
  user: User | null;
  currentRole: string;
}
interface DeleteUserModalConfig {
  user: User | null;
}
interface ResendRecoveryEmailModalConfig {
  user: User | null;
}
@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalSuccessSubject = new Subject<{
    show: boolean;
    config: SuccessModalConfig;
  }>();
  private modalErrorSubject = new Subject<{
    show: boolean;
    config: ErrorModalConfig;
  }>();
  private roleModalSubject = new Subject<{
    show: boolean;
    config: RoleModalConfig;
  }>();
  private deleteUserAdminSubject = new Subject<{
    show: boolean;
  }>();

  private deleteUserSubject = new Subject<{
    show: boolean;
    config: DeleteUserModalConfig;
  }>();

  private resendRecoveryEmail = new Subject<{
    show: boolean;
    config: ResendRecoveryEmailModalConfig;
  }>();


  // Observable que los componentes pueden suscribirse
  successSubject$ = this.modalSuccessSubject.asObservable();
  errorSubject$ = this.modalErrorSubject.asObservable();
  toggleRoleSubject$ = this.roleModalSubject.asObservable();
  deleteUserAdminSubject$ = this.deleteUserAdminSubject.asObservable();
  deleteUserSubject$ = this.deleteUserSubject.asObservable();
  resendRecoveryEmail$ = this.resendRecoveryEmail.asObservable();
  // Método para mostrar modal de éxito
  showSuccess(config: SuccessModalConfig) {
    this.modalSuccessSubject.next({
      show: true,
      config: {
        title: config.title || 'Operación exitosa', // Valor por defecto
        message: config.message,
        confirmText: config.confirmText || 'Aceptar'
      }
    });
  }
  showError(config: ErrorModalConfig) {
    this.modalErrorSubject.next({
      show: true,
      config: {
        title: config.title || 'Error', // Valor por defecto
        message: config.message,
        confirmText: config.confirmText || 'Aceptar'
      }
    });
  }

  showChangeRole(config: RoleModalConfig) {
    this.roleModalSubject.next({
      show: true,
      config: {
        user: config.user,
        currentRole: config.currentRole
      }
    });
  }

  showDeleteUserAdmin(config: { show: boolean }) {
    this.deleteUserAdminSubject.next({
      show: true,
    });
  }
  showDeleteUser(config: DeleteUserModalConfig) {
    this.deleteUserSubject.next({
      show: true,
      config: {
        user: config.user
      }
    });
  }
  shoeResendRecoveryEmail(config: ResendRecoveryEmailModalConfig) {
    this.resendRecoveryEmail.next({
      show: true,
      config: {
        user: config.user,
      }
    });
  }

  hide() {
    this.modalSuccessSubject.next({
      show: false,
      config: { title: '', message: '' }
    });
    this.modalErrorSubject.next({
      show: false,
      config: { title: '', message: '' }
    });
    this.roleModalSubject.next({
      show: false,
      config: { user: null, currentRole: '' }
    });
    this.deleteUserAdminSubject.next({
      show: false,
    });
    this.deleteUserSubject.next({
      show: false,
      config: { user: null }
    });
    this.resendRecoveryEmail.next({
      show: false,
      config: { user: null }
    });

  }
  closeSuccessModal() {
    this.modalSuccessSubject.next({
      show: false,
      config: { title: '', message: '' }
    });
  }
  closeErrorModal() {
    this.modalErrorSubject.next({
      show: false,
      config: { title: '', message: '' }
    });
  }
  closeRoleModal() {
    this.roleModalSubject.next({
      show: false,
      config: { user: null, currentRole: '' }
    });
  }
  closeDeleteUserAdminModal() {
    this.deleteUserAdminSubject.next({
      show: false,
    });
  }
  closeDeleteUserModal() {
    this.deleteUserSubject.next({
      show: false,
      config: { user: null }
    });
  }
  closeResendRecoveryEmailModal() {
    this.resendRecoveryEmail.next({
      show: false,
      config: { user: null }
    });
  } 

}