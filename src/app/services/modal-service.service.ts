import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface ModalConfig {
  title: string;
  message: string;
  confirmText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new Subject<{
    show: boolean;
    config: ModalConfig;
  }>();

  // Observable que los componentes pueden suscribirse
  modalState$ = this.modalSubject.asObservable();

  // Método para mostrar modal de éxito
  showSuccess(config: ModalConfig) {
    this.modalSubject.next({
      show: true,
      config: {
        title: config.title || 'Operación exitosa', // Valor por defecto
        message: config.message,
        confirmText: config.confirmText || 'Aceptar'
      }
    });
  }

  // Método para ocultar el modal
  hide() {
    this.modalSubject.next({
      show: false,
      config: { title: '', message: '' }
    });
  }
}