import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../services/modal-service.service';

@Component({
  selector: 'app-modal-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-success.component.html',
  styleUrls: ['./modal-success.component.css']
})
export class ModalSuccessComponent {
  showModal = false;
  config = {
    title: '',
    message: '',
    confirmText: 'Aceptar'
  };
  constructor(private modalService: ModalService) {
    this.modalService.modalState$.subscribe(state => {
      this.showModal = state.show;
      if (state.show) {
        this.config = { ...this.config, ...state.config };
      }
    });
  }

 close() {
    this.modalService.hide();
  }

}