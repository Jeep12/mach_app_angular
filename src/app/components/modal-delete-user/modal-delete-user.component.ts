import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../../models/user.model';
import { ModalService } from '../../services/modal.service';
import { UserManagementService } from '../../services/user-management.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-delete-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-delete-user.component.html',
  styleUrl: './modal-delete-user.component.css'
})
export class ModalDeleteUserComponent {
  show = false;
  confirmationChecked = false;
  user: User | null = null;
  @Output() userDeleted = new EventEmitter<{ user: User | null }>();

  constructor(private modalService: ModalService, private userManagementService: UserManagementService) {
    this.modalService.deleteUserSubject$.subscribe(state => {
      this.show = state.show;
      this.user = state.config.user;
    });
    this.resetModalState();
  }

  confirmDelete(): void {
    const name = this.user?.name;
    const lastname = this.user?.lastname;

    if (this.user) {
      this.userManagementService.deleteUser(this.user.id).subscribe({
        next: (response) => {
          this.modalService.showSuccess({
            title: 'Usuario eliminado exitosamente',
            message: `El usuario  ${name} ${lastname}  ha sido eliminado. `,
          });
          this.userDeleted.emit({ user: this.user });
          this.resetModalState();
        },
        error: (error) => {
        }
      });
    }

    this.close();


  }

  isAdmin(): boolean {
    return this.user?.roles?.some(r => r.name === 'ROLE_ADMIN') || false;
  }
  isEmployee(): boolean {
    return this.user?.roles?.some(r => r.name === 'ROLE_EMPLOYEE') || false;
  }
  isUser(): boolean {
    return this.user?.roles?.some(r => r.name === 'ROLE_USER') || false;

  }
  close() {
    this.resetModalState();
    this.modalService.hide();
  }

  private resetModalState(): void {
    this.confirmationChecked = false;
    this.user = null;
  }
}

