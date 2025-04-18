import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal-delete-user-admin',
  imports: [],
  templateUrl: './modal-delete-user-admin.component.html',
  styleUrl: './modal-delete-user-admin.component.css'
})
export class ModalDeleteUserAdminComponent {
  show = false;
  
  constructor(private modalService: ModalService) {
    // Suscribe al Observable correcto
    this.modalService.deleteUserAdminSubject$.subscribe(state => {
      this.show = state.show;
    });
  }


  close() {
    this.modalService.hide();
  }

}
