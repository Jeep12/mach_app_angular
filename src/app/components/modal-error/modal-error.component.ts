import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-error',
  imports: [CommonModule],
  templateUrl: './modal-error.component.html',
  styleUrl: './modal-error.component.css'
})
export class ModalErrorComponent {
  showModal = false;
  config = {
    title: '',
    message: '',
    confirmText: 'Aceptar'
  };

  constructor(private modalService: ModalService) {
    this.modalService.errorSubject$.subscribe(state => {
      this.showModal = state.show;
      if (state.show) {
        this.config = { ...this.config, ...state.config };
      }
    });
  }
  close() {
    this.modalService.closeErrorModal();
  }
}
