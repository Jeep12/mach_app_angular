import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { UserManagementService } from '../../services/user-management.service';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-modal-change-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-change-roles.component.html',
  styleUrls: ['./modal-change-roles.component.css']
})
export class ModalChangeRolesComponent implements OnInit {
  show = false;
  user: User | null = null;
  currentRole: string = '';
  isEmployeeChecked = false;

  @Output() roleChanged = new EventEmitter<{ user: User | null, newRole: string }>();

  constructor(private modalService: ModalService, private userManagementService: UserManagementService, private authService: AuthService) {
    this.modalService.toggleRoleSubject$.subscribe(state => {
      this.show = state.show;
      this.user = state.config.user;
      this.isEmployeeChecked = this.isEmployee(); // Inicializa si el rol de empleado está seleccionado
    });
  }

  ngOnInit(): void { }

  close() {
    this.modalService.hide();
  }

  saveChanges() {
    const roles: string[] = [];

    if (this.isEmployeeChecked) {
      roles.push('ROLE_EMPLOYEE');
    }

    if (this.isUser()) {
      roles.push('ROLE_USER');
    }

    if (!this.user || roles.length === 0) {
      alert('Datos incompletos para actualizar el rol');
      return;
    }


    this.userManagementService.updateUserRoles(this.user.id, roles).subscribe({
      next: (response) => {

      if(response.success) {
        this.modalService.showSuccess({
          title: 'Exito',
          message: response.message,
        });
      }    
   
        this.roleChanged.emit({ user: this.user, newRole: roles.join(', ') });
      },
      error: (error) => {
        this.modalService.showError({
          title: 'Error al actualizar roles',
          message: `${error.error.message}`,
        });
      }
    });
  }


  isAdmin() {
    return this.user?.roles.some(role => role.name === 'ROLE_ADMIN') || false;
  }

  isUser() {
    return this.user?.roles.some(role => role.name === 'ROLE_USER') || false;
  }

  isEmployee() {
    return this.user?.roles.some(role => role.name === 'ROLE_EMPLOYEE') || false;
  }
}


